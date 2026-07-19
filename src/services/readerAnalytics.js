/**
 * readerAnalytics.js — Motor de análisis de lectores
 *
 * Agrupa eventos por sesión, calcula Reader Score y Lead Score,
 * ejecuta análisis con IA y determina qué notificar.
 */

import { supabase } from '@/lib/supabaseClient';

// ── Puntuaciones base por tipo de evento ─────────────────────
const SCORE_MAP = {
  TIME_READING: 30,
  SCROLL_90_PLUS: 20,
  REGRESSED_PARAGRAPH: 15,
  VISITED_ANOTHER_ARTICLE: 20,
  IMAGE_OPENED: 10,
  TEXT_COPIED: 10,
  SHARED: 30,
  CHAT_OPENED: 40,
  VIEWED_COMPLETELY: 50,
  LEAVES_AFTER_TECHNICAL: -20,
};

// ── 1. Agrupar eventos por sesión ────────────────────────────
export async function getSessionsSince(timestamp) {
  const { data, error } = await supabase
    .from('reader_events')
    .select('*')
    .gte('timestamp', timestamp)
    .order('timestamp', { ascending: true });

  if (error || !data) return [];

  // Agrupar por session_id y ordenar eventos dentro de cada sesión
  const grouped = {};
  for (const event of data) {
    if (!grouped[event.session_id]) grouped[event.session_id] = [];
    grouped[event.session_id].push(event);
  }

  return Object.values(grouped);
}

// ── 2. Calcular Reader Score de una sesión ───────────────────
export function calculateReaderScore(events) {
  let score = 0;
  let breakdown = [];

  const scrollDepths = events
    .filter(e => e.event_type === 'scroll_depth')
    .map(e => e.payload?.depth ?? 0);
  const maxScroll = Math.max(...scrollDepths, 0);

  const paragraphs = events
    .filter(e => e.event_type === 'time_on_paragraph')
    .map(e => e.payload?.seconds ?? 0);
  const avgParagraphTime = paragraphs.length > 0
    ? paragraphs.reduce((a, b) => a + b, 0) / paragraphs.length
    : 0;
  const hasRegressed = paragraphs.some(s => s > 15); // re-lectura > 15s

  const articleOpens = events.filter(e => e.event_type === 'article_open');
  const articleCloses = events.filter(e => e.event_type === 'article_close');
  const visitedAnother = articleOpens.length > 1;

  const imageClicks = events.filter(e => e.event_type === 'image_click').length;
  const textCopies = events.filter(e => e.event_type === 'text_copy').length;
  const shares = events.filter(e => e.event_type === 'share').length;
  const chatOpened = events.filter(e => e.event_type === 'chat_open').length > 0;

  const totalTimeReading = paragraphs.reduce((a, b) => a + b, 0);
  const viewedCompletely = maxScroll >= 95 && totalTimeReading > 120;

  // Aplicar puntuaciones
  if (totalTimeReading > 60) {
    score += SCORE_MAP.TIME_READING;
    breakdown.push({ event: 'Tiempo leyendo', points: SCORE_MAP.TIME_READING });
  }
  if (maxScroll >= 90) {
    score += SCORE_MAP.SCROLL_90_PLUS;
    breakdown.push({ event: 'Scroll mayor al 90%', points: SCORE_MAP.SCROLL_90_PLUS });
  }
  if (hasRegressed) {
    score += SCORE_MAP.REGRESSED_PARAGRAPH;
    breakdown.push({ event: 'Regresó a un párrafo', points: SCORE_MAP.REGRESSED_PARAGRAPH });
  }
  if (visitedAnother) {
    score += SCORE_MAP.VISITED_ANOTHER_ARTICLE;
    breakdown.push({ event: 'Visitó otro artículo', points: SCORE_MAP.VISITED_ANOTHER_ARTICLE });
  }
  if (imageClicks > 0) {
    score += SCORE_MAP.IMAGE_OPENED;
    breakdown.push({ event: 'Abrió imágenes', points: SCORE_MAP.IMAGE_OPENED });
  }
  if (textCopies > 0) {
    score += SCORE_MAP.TEXT_COPIED;
    breakdown.push({ event: 'Copió texto', points: SCORE_MAP.TEXT_COPIED });
  }
  if (shares > 0) {
    score += SCORE_MAP.SHARED;
    breakdown.push({ event: 'Compartió', points: SCORE_MAP.SHARED });
  }
  if (chatOpened) {
    score += SCORE_MAP.CHAT_OPENED;
    breakdown.push({ event: 'Abrió chat', points: SCORE_MAP.CHAT_OPENED });
  }
  if (viewedCompletely) {
    score += SCORE_MAP.VIEWED_COMPLETELY;
    breakdown.push({ event: 'Leyó completo', points: SCORE_MAP.VIEWED_COMPLETELY });
  }

  // Detectar abandono técnico
  const exitEvents = events.filter(e => e.event_type === 'exit');
  const lastExit = exitEvents[exitEvents.length - 1];
  if (lastExit && lastExit.payload?.lastScrollDepth < 40 && totalTimeReading < 30) {
    score += SCORE_MAP.LEAVES_AFTER_TECHNICAL;
    breakdown.push({ event: 'Abandono precoz', points: SCORE_MAP.LEAVES_AFTER_TECHNICAL });
  }

  return { score: Math.max(0, Math.min(100, score)), breakdown };
}

// ── 3. Calcular Lead Score (interés comercial) ───────────────
export function calculateLeadScore(events) {
  let score = 0;
  let reasons = [];

  const articleOpens = events
    .filter(e => e.event_type === 'article_open')
    .map(e => e.payload?.article_slug);
  const chatOpened = events.filter(e => e.event_type === 'chat_open').length > 0;

  // Si leyó artículos sobre productos relacionados
  const productRelatedSlugs = [
    'prunex-1', 'nocarb-t', 'thermo-t3', 'flora-liv', 'rexet',
    'vita-xtra-t-plus', 'nutraday', 'protein-active-fit', 'on', 'no-stress'
  ];
  const viewedProducts = articleOpens.filter(slug =>
    productRelatedSlugs.includes(slug)
  );

  if (viewedProducts.length > 0) {
    score += viewedProducts.length * 15;
    reasons.push(`Visitó ${viewedProducts.length} artículo(s) de producto`);
  }

  if (chatOpened) {
    score += 30;
    reasons.push('Abrió chat IA');
  }

  // Si leyó + abrió chat = señal fuerte
  if (viewedProducts.length > 0 && chatOpened) {
    score += 20;
    reasons.push('Interés comercial compuesto');
  }

  const readerScore = calculateReaderScore(events);
  if (readerScore.score >= 70) {
    score += 15;
    reasons.push('Lector comprometido');
  }

  return { score: Math.min(100, score), reasons };
}

// ── 4. Análisis IA ───────────────────────────────────────────
const AI_PROVIDER_URL = 'https://api.deepseek.com/chat/completions';

export async function analyzeSession(session, apiKey) {
  if (!apiKey) return null;

  const readerScore = calculateReaderScore(session);
  const leadScore = calculateLeadScore(session);

  const articleSlugs = session
    .filter(e => e.event_type === 'article_open')
    .map(e => e.payload?.article_slug)
    .filter(Boolean);

  const totalEvents = session.length;
  const totalTimeReading = session
    .filter(e => e.event_type === 'time_on_paragraph')
    .reduce((sum, e) => sum + (e.payload?.seconds ?? 0), 0);

  const prompt = `Analiza el comportamiento de un lector en el sitio "Bienestar en Claro".

Datos de la sesión:
- Total de eventos: ${totalEvents}
- Tiempo total leyendo: ${totalTimeReading}s
- Artículos visitados: ${articleSlugs.join(', ') || 'ninguno'}
- Reader Score: ${readerScore.score}/100
- Lead Score: ${leadScore.score}/100

Eventos (orden cronológico):
${session.map(e => `- ${e.event_type} ${JSON.stringify(e.payload || {})}`).join('\n')}

Responde SOLO con un JSON válido, sin markdown, sin explicaciones:
{
  "behavior_type": "comprometido|escaneó|información_rápida|comparó|interesado|abandonó",
  "conclusion": "Una frase corta describiendo el comportamiento",
  "engagement_level": "alto|medio|bajo",
  "recommendation": "Una recomendación breve sobre qué hacer con este lector"
}`;

  try {
    const response = await fetch(AI_PROVIDER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Eres un analista de comportamiento de lectores. Responde siempre en español con JSON válido.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';

    // Limpiar markdown si viene envuelto
    const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[ReaderAnalytics] Error en análisis IA:', err);
    return null;
  }
}

// ── 5. Análisis agregado (diario) ─────────────────────────────
export async function getDailySummary(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('reader_events')
    .select('*')
    .gte('timestamp', startOfDay.toISOString())
    .lte('timestamp', endOfDay.toISOString())
    .order('timestamp', { ascending: true });

  if (error || !data) return null;

  // Agrupar por sesión
  const sessions = {};
  for (const event of data) {
    if (!sessions[event.session_id]) sessions[event.session_id] = [];
    sessions[event.session_id].push(event);
  }

  const sessionArray = Object.values(sessions);

  // Métricas básicas
  const totalReaders = sessionArray.length;
  const totalArticlesRead = sessionArray.reduce((sum, s) =>
    sum + s.filter(e => e.event_type === 'article_open').length, 0
  );

  // Mejor artículo
  const articleCounts = {};
  for (const s of sessionArray) {
    for (const e of s) {
      if (e.event_type === 'article_open') {
        const slug = e.payload?.article_slug;
        if (slug) articleCounts[slug] = (articleCounts[slug] || 0) + 1;
      }
    }
  }
  const bestArticle = Object.entries(articleCounts).sort((a, b) => b[1] - a[1])[0];

  // Retención por artículo
  const articleRetention = {};
  for (const s of sessionArray) {
    const articles = s.filter(e => e.event_type === 'article_open').map(e => e.payload?.article_slug);
    const exits = s.filter(e => e.event_type === 'exit');
    const lastScroll = exits.length > 0 ? exits[exits.length - 1].payload?.lastScrollDepth ?? 0 : 0;

    for (const slug of articles) {
      if (!articleRetention[slug]) articleRetention[slug] = { views: 0, avgScroll: 0 };
      articleRetention[slug].views++;
      articleRetention[slug].avgScroll =
        (articleRetention[slug].avgScroll * (articleRetention[slug].views - 1) + lastScroll) /
        articleRetention[slug].views;
    }
  }

  const worstRetention = Object.entries(articleRetention)
    .filter(([_, v]) => v.views >= 3)
    .sort((a, b) => a[1].avgScroll - b[1].avgScroll)[0];

  // Chats abiertos
  const chatsOpened = sessionArray.reduce((sum, s) =>
    sum + s.filter(e => e.event_type === 'chat_open').length, 0
  );

  // Lectores de alto interés
  const highInterest = sessionArray.filter(s => calculateLeadScore(s).score >= 60).length;

  return {
    totalReaders,
    totalArticlesRead,
    bestArticle: bestArticle ? { slug: bestArticle[0], count: bestArticle[1] } : null,
    worstRetention: worstRetention ? { slug: worstRetention[0], retention: Math.round(worstRetention[1].avgScroll) } : null,
    chatsOpened,
    highInterest,
    avgReaderScore: Math.round(
      sessionArray.reduce((sum, s) => sum + calculateReaderScore(s).score, 0) / sessionArray.length || 0
    ),
  };
}

// ── 6. Detectar anomalías (tendencia, problema) ──────────────
export function detectAnomalies(summary) {
  const alerts = [];

  // Artículo con problemas de retención
  if (summary?.worstRetention && summary.worstRetention.retention < 40) {
    alerts.push({
      type: 'problem',
      severity: 'high',
      title: 'Artículo con problemas de retención',
      message: `En la última hora, el artículo "${summary.worstRetention.slug}" tuvo un abandono del ${100 - summary.worstRetention.retention}%. La IA cree que el inicio no logra enganchar.`,
    });
  }

  // Tendencia viral
  if (summary?.bestArticle && summary.bestArticle.count >= 10) {
    alerts.push({
      type: 'trend',
      severity: 'medium',
      title: 'Tendencia detectada',
      message: `El artículo "${summary.bestArticle.slug}" ha recibido ${summary.bestArticle.count} lecturas recientes. Considera crear contenido relacionado.`,
    });
  }

  return alerts;
}
