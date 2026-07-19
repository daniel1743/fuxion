import { NextResponse } from 'next/server';

// Handler que se ejecuta cada X minutos vía cron (Vercel Cron o similar)
export async function POST(request) {
  try {
    const { analyzeSession, getSessionsSince, calculateLeadScore, detectAnomalies, processAndNotify, notifyHotLead } =
      require('@/services/readerAnalytics');
    const { sendTelegramAlert } = require('@/services/telegramNotifier');

    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    const SESSION_WINDOW = '1h'; // Analizar sesiones de la última hora

    // Obtener sesiones recientes
    const sessions = await getSessionsSince(new Date(Date.now() - 3600000).toISOString());

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ status: 'ok', message: 'No hay sesiones nuevas' });
    }

    const alerts = [];
    const hotLeads = [];

    for (const session of sessions) {
      // Analizar con IA
      const aiAnalysis = await analyzeSession(session, DEEPSEEK_API_KEY);

      // Calcular lead score
      const leadScore = calculateLeadScore(session);

      // Si es lead caliente, notificar
      if (leadScore.score >= 60) {
        hotLeads.push({
          readerScore: calculateReaderScore(session).score,
          leadScore: leadScore.score,
          articles: session.filter(e => e.event_type === 'article_open').map(e => e.payload?.article_slug),
          chatOpened: session.filter(e => e.event_type === 'chat_open').length > 0,
          aiAnalysis,
        });
      }

      // Detectar anomalías
      const anomalies = detectAnomalies({
        bestArticle: { slug: 'test', count: 1 },
        worstRetention: { slug: 'test', retention: 50 },
      });
      alerts.push(...anomalies);
    }

    // Enviar alertas
    await processAndNotify(alerts);

    // Notificar leads calientes
    for (const lead of hotLeads) {
      await notifyHotLead(lead);
    }

    return NextResponse.json({
      status: 'ok',
      sessions: sessions.length,
      alerts: alerts.length,
      hotLeads: hotLeads.length,
    });
  } catch (err) {
    console.error('[Analytics Cron] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
