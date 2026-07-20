#!/usr/bin/env node
/**
 * enrich-wellness-articles.mjs
 *
 * Pipeline de Enriquecimiento Editorial con IA — Etapa 2
 * ======================================================
 *
 * RESPONSABILIDAD:
 *   Lee artículos semilla desde Supabase (wellness_articles),
 *   detecta cuáles NO han sido enriquecidos aún,
 *   y los desarrolla editorialmente mediante DeepSeek AI,
 *   conservando la estructura SEO existente (H1, H2, FAQs, Schema).
 *
 * ARQUITECTURA:
 *   Biblia Bienestar → convert-biblia-to-articles.mjs → Supabase → ESTE SCRIPT → Supabase → Frontend
 *
 * NO MODIFICA:
 *   - convert-biblia-to-articles.mjs
 *   - Tablas ni migraciones
 *   - Frontend ni rutas
 *
 * CARACTERÍSTICAS:
 *   - Idempotente: puede ejecutarse múltiples veces
 *   - Progreso artículo por artículo
 *   - Reanudable tras fallos
 *   - Nunca inserta nuevos registros (solo UPDATE)
 *   - Conserva slug, IDs, y estructura SEO
 *
 * USO:
 *   node scripts/enrich-wellness-articles.mjs
 *   node scripts/enrich-wellness-articles.mjs --dry-run
 *   node scripts/enrich-wellness-articles.mjs --limit=5
 *   node scripts/enrich-wellness-articles.mjs --force
 *
 * @author Daniel Falcón
 * @version 1.0.0
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Configuración ──────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://iyloouessyxfvwvzdboc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bG9vdWVzc3l4ZnZ3dnpkYm9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTYzNzI3NSwiZXhwIjoyMDk3MjEzMjc1fQ.-YySdwqu5kPADvC_HFx5TtaFRLDBsj0QHMdPfn_isF4';

const DEEPSEEK_API_KEY =
  process.env.DEEPSEEK_API_KEY || 'sk-ced65aa116254984a2d13d5bb4202c20';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ── CLI Args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const IS_DRY_RUN = args.includes('--dry-run');
const IS_FORCE = args.includes('--force');
const LIMIT_ARG = args.find((a) => a.startsWith('--limit='));
const BATCH_LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split('=')[1], 10) : null;

// ── Logging & Progreso ─────────────────────────────────────────────────────

const LOG_DIR = path.join(__dirname, '..', 'logs');
const PROGRESS_FILE = path.join(LOG_DIR, 'enrich-progress.json');
const ERROR_LOG = path.join(LOG_DIR, 'enrich-errors.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Carga el archivo de progreso para permitir reanudación.
 */
function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    }
  } catch {
    // Si está corrupto, empezar de cero
  }
  return {
    processed: [],
    errors: [],
    startedAt: null,
    lastProcessedSlug: null,
    totalProcessed: 0,
    totalErrors: 0,
  };
}

/**
 * Guarda el progreso actual.
 */
function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

/**
 * Registra un error en el log.
 */
function logError(articleSlug, errorMessage) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${articleSlug}: ${errorMessage}\n`;
  fs.appendFileSync(ERROR_LOG, line);
}

/**
 * Log con timestamp.
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const prefix = { info: '📝', success: '✅', warn: '⚠️', error: '❌', start: '🚀' };
  console.log(`${prefix[level] || 'ℹ️'} [${timestamp}] ${message}`);
}

// ── Marcador de enriquecimiento ─────────────────────────────────────────────

const ENRICHED_FLAG_COLUMN = 'enriched_by_ai';
const ENRICHED_FLAG_VALUE = true;

// ── Prompt del Sistema para DeepSeek ────────────────────────────────────────

function buildSystemPrompt() {
  return `Eres un redactor editorial científico especializado en salud y bienestar. 
Escribes para el sitio "Bienestar en Claro" (bienestarenclaro.cl), una editorial chilena de salud basada en evidencia.

Tu responsabilidad es transformar fichas técnicas de intervenciones de bienestar en artículos editoriales completos, 
útiles para personas reales que buscan información confiable sobre salud.

REGLAS ESTRICTAS:
1. NO inventes estudios, cifras, estadísticas ni referencias.
2. NO copies textos de internet.
3. Cuando la evidencia sea limitada, indícalo claramente: "La evidencia disponible es preliminar..." o similar.
4. NO uses frases infladas ni relleno.
5. NO repitas la misma idea con distintas palabras.
6. Lenguaje claro, profesional pero accesible para público general.
7. Rigor científico, tono educativo.
8. Respeta los principios EEAT (Experience, Expertise, Authoritativeness, Trustworthiness).

ESTRUCTURA DEL ARTÍCULO QUE DEBES GENERAR:
El artículo DEBE contener estas secciones en orden:

## Introducción
- Contextualizar el tema y por qué es relevante para la salud.
- Explicar el concepto principal en términos simples.
- Mencionar la prevalencia o importancia del tema en Chile/Latinoamérica (si aplica).

## ¿Qué es [TEMA]?
- Definir claramente el concepto, condición o intervención.
- Desarrollar los mecanismos fisiológicos involucrados.
- Explicar cómo funciona en el cuerpo.

## ¿Cómo funciona [INTERVENCIÓN]?
- Describir el mecanismo de acción de la intervención específica.
- Explicar la base científica detrás de la intervención.
- Mencionar los compuestos, nutrientes o procesos clave involucrados.

## Beneficios y tiempo esperado
- Detallar los beneficios respaldados por evidencia.
- Indicar plazos realistas para observar resultados.
- Ser honesto: si los efectos son sutiles o variables, decirlo.

## Evidencia científica
- Resumir el estado actual de la evidencia.
- Mencionar tipos de estudios disponibles (sin inventar referencias).
- Si la evidencia es limitada, indicarlo con transparencia.
- NUNCA inventar nombres de revistas, autores o años.

## Recomendaciones prácticas
- Sugerencias concretas y accionables.
- Cómo incorporar la intervención en la vida diaria.
- Dosis, frecuencia, momento del día (si aplica).
- Combinaciones sinérgicas con otros hábitos saludables.

## Errores frecuentes
- Errores comunes que las personas cometen al aplicar esta intervención.
- Expectativas poco realistas.
- Precauciones importantes.

## ¿Cuándo consultar al médico?
- Señales de alerta que requieren atención profesional.
- Condiciones preexistentes que requieren supervisión.
- Recordatorio de que este artículo es informativo, no reemplaza consulta médica.

## Conclusión
- Síntesis de los puntos clave.
- Mensaje final motivador pero realista.

FORMATO DE SALIDA:
Entrega ÚNICAMENTE el contenido del artículo en Markdown.
NO incluyas el H1 principal (título) — ese ya existe.
NO incluyas "## Preguntas Frecuentes" ni FAQs — esas ya existen en el artículo original.
NO incluyas meta-descripciones ni datos SEO.
Comienza directamente con "## Introducción".
Escribe entre 1500 y 2500 palabras.`;
}

// ── Prompt de Usuario para DeepSeek ─────────────────────────────────────────

function buildUserPrompt(article) {
  const parts = [];

  parts.push('INFORMACIÓN DEL ARTÍCULO SEMILLA:');
  parts.push('');
  parts.push(`Título: ${article.title}`);
  parts.push(`Categoría: ${article.category || 'No especificada'}`);
  parts.push(`Slug: ${article.slug}`);
  parts.push('');

  if (article.excerpt) {
    parts.push(`Extracto actual: ${article.excerpt}`);
    parts.push('');
  }

  if (article.entity_detected && article.entity_detected.length > 0) {
    parts.push(`Entidades detectadas: ${article.entity_detected.join(', ')}`);
    parts.push('');
  }

  if (article.evidence_level) {
    parts.push(`Nivel de evidencia: ${article.evidence_level}`);
    parts.push('');
  }

  if (article.semantic_keywords && article.semantic_keywords.length > 0) {
    parts.push(`Keywords semánticas: ${article.semantic_keywords.join(', ')}`);
    parts.push('');
  }

  parts.push('CONTENIDO ACTUAL (SEMILLA):');
  parts.push('```');
  parts.push(article.content || '(sin contenido)');
  parts.push('```');
  parts.push('');

  parts.push('ESTRUCTURA SEO A CONSERVAR (FAQs y Schema existentes):');
  parts.push('```json');
  if (article.seo_schema) {
    parts.push(JSON.stringify(article.seo_schema, null, 2));
  } else {
    parts.push('{}');
  }
  parts.push('```');
  parts.push('');

  parts.push('INSTRUCCIONES:');
  parts.push('1. Analiza el contenido semilla y comprende el tema a fondo.');
  parts.push('2. Investiga (desde tu conocimiento) el tema para desarrollarlo editorialmente.');
  parts.push('3. Genera un artículo editorial completo siguiendo la estructura indicada.');
  parts.push('4. NO modifiques ni incluyas el H1, FAQs ni Schema — eso ya existe.');
  parts.push('5. Entrega ÚNICAMENTE el contenido Markdown del artículo (comenzando con ## Introducción).');
  parts.push('6. Extensión objetivo: 1500-2500 palabras.');

  return parts.join('\n');
}

// ── Llamada a DeepSeek API ──────────────────────────────────────────────────

async function callDeepSeek(systemPrompt, userPrompt) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`DeepSeek API error ${response.status}: ${errorBody.substring(0, 200)}`);
  }

  const data = await response.json();
  return {
    content: data.choices?.[0]?.message?.content || '',
    usage: data.usage || {},
  };
}

// ── Extraer cuerpo editorial (sin H1, FAQs ni Schema) ───────────────────────

function extractEditorialBody(aiContent) {
  // Eliminar posibles encabezados H1 que la IA podría generar por error
  let body = aiContent.replace(/^# .+\n+/gm, '');
  // Eliminar secciones de FAQ si la IA las generó
  body = body.replace(/## Preguntas Frecuentes[\s\S]*$/i, '');
  body = body.replace(/## FAQ[\s\S]*$/i, '');
  body = body.trim();
  return body;
}

// ── Contar palabras ─────────────────────────────────────────────────────────

function countWords(text) {
  return (text || '').split(/\s+/).filter(Boolean).length;
}

// ── Obtener artículos pendientes de enriquecer ──────────────────────────────

async function fetchPendingArticles(limit = null) {
  let query = supabase
    .from('wellness_articles')
    .select('*')
    .is(ENRICHED_FLAG_COLUMN, null)
    .order('created_at', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching articles: ${error.message}`);
  }

  return data || [];
}

// ── Obtener TODOS los artículos (para --force) ─────────────────────────────

async function fetchAllArticles(limit = null) {
  let query = supabase
    .from('wellness_articles')
    .select('*')
    .order('created_at', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching articles: ${error.message}`);
  }

  return data || [];
}

// ── Actualizar artículo en Supabase ─────────────────────────────────────────

async function updateArticle(articleId, editorialContent) {
  if (IS_DRY_RUN) {
    log(`[DRY RUN] Actualizaría artículo ID=${articleId} (${editorialContent.length} chars)`, 'info');
    return true;
  }

  const { error } = await supabase
    .from('wellness_articles')
    .update({
      content: editorialContent,
      [ENRICHED_FLAG_COLUMN]: ENRICHED_FLAG_VALUE,
      updated_at: new Date().toISOString(),
    })
    .eq('id', articleId);

  if (error) {
    throw new Error(`Error updating article ${articleId}: ${error.message}`);
  }

  return true;
}

// ── Enriquecer un artículo individual ───────────────────────────────────────

async function enrichArticle(article, index, total) {
  const label = `[${index + 1}/${total}]`;
  log(`${label} Procesando: "${article.title.substring(0, 80)}..." (${article.slug})`, 'start');

  const startTime = Date.now();

  try {
    // 1. Construir prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(article);

    // 2. Llamar a DeepSeek
    log(`${label} Llamando a DeepSeek API...`, 'info');
    const { content: aiContent, usage } = await callDeepSeek(systemPrompt, userPrompt);

    // 3. Extraer cuerpo editorial
    const editorialBody = extractEditorialBody(aiContent);
    const wordCount = countWords(editorialBody);

    log(
      `${label} IA respondió: ${aiContent.length} chars, cuerpo editorial: ${editorialBody.length} chars (~${wordCount} palabras)`,
      'info'
    );
    log(`${label} Tokens usados: ${usage.total_tokens || 'N/A'} (prompt: ${usage.prompt_tokens || 'N/A'}, completion: ${usage.completion_tokens || 'N/A'})`, 'info');

    // 4. Validar longitud
    if (wordCount < 800) {
      log(`${label} ADVERTENCIA: Contenido generado es corto (${wordCount} palabras). El artículo puede necesitar revisión.`, 'warn');
    }

    // 5. Construir contenido final: H1 + cuerpo editorial + FAQs
    // Extraer H1 del título
    const h1 = `# ${article.title}`;
    // Extraer FAQs del contenido original si existen
    const faqSection = extractFaqSection(article.content);
    // Extraer Schema (se conserva en columna seo_schema, no en content)

    const finalContent = [h1, '', editorialBody, faqSection].filter(Boolean).join('\n\n');

    // 6. Actualizar Supabase
    await updateArticle(article.id, finalContent);

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log(`${label} Completado en ${duration}s — ${wordCount} palabras`, 'success');

    return {
      slug: article.slug,
      success: true,
      duration,
      wordCount,
      tokensUsed: usage.total_tokens || 0,
    };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log(`${label} ERROR: ${error.message}`, 'error');
    logError(article.slug, error.message);

    return {
      slug: article.slug,
      success: false,
      duration,
      error: error.message,
    };
  }
}

// ── Extraer sección FAQ del contenido original ──────────────────────────────

function extractFaqSection(content) {
  if (!content) return '';
  const match = content.match(/## Preguntas Frecuentes[\s\S]*$/i);
  if (!match) return '';
  return match[0].trim();
}

// ── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  Pipeline de Enriquecimiento Editorial con IA v1.0  ║');
  console.log('║  Bienestar en Claro — Etapa 2                       ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  if (IS_DRY_RUN) {
    log('MODO DRY RUN: No se modificarán registros en Supabase', 'warn');
  }
  if (IS_FORCE) {
    log('MODO FORCE: Se reprocesarán TODOS los artículos (incluso ya enriquecidos)', 'warn');
  }
  if (BATCH_LIMIT) {
    log(`Límite: ${BATCH_LIMIT} artículos`, 'info');
  }

  // Cargar progreso previo
  const progress = loadProgress();
  if (!progress.startedAt) {
    progress.startedAt = new Date().toISOString();
  }
  log(`Progreso previo: ${progress.totalProcessed} procesados, ${progress.totalErrors} errores`, 'info');

  // Obtener artículos
  log('Consultando artículos en Supabase...', 'info');

  let articles;
  if (IS_FORCE) {
    articles = await fetchAllArticles(BATCH_LIMIT);
    log(`${articles.length} artículos encontrados (FORCE mode — todos)`, 'info');
  } else {
    articles = await fetchPendingArticles(BATCH_LIMIT);
    log(`${articles.length} artículos pendientes de enriquecer`, 'info');
  }

  if (articles.length === 0) {
    log('No hay artículos para procesar. ¡Todo al día! 🎉', 'success');
    return;
  }

  // Filtrar artículos ya procesados (reanudación)
  const pendingArticles = articles.filter(
    (a) => !progress.processed.includes(a.slug)
  );

  if (pendingArticles.length === 0 && !IS_FORCE) {
    log('Todos los artículos ya fueron procesados en esta sesión.', 'success');
    return;
  }

  const toProcess = IS_FORCE ? articles : pendingArticles;
  log(`Artículos a procesar en esta ejecución: ${toProcess.length}`, 'start');

  // Procesar artículo por artículo
  for (let i = 0; i < toProcess.length; i++) {
    const article = toProcess[i];
    const result = await enrichArticle(article, i, toProcess.length);

    // Guardar progreso
    progress.processed.push(article.slug);
    if (result.success) {
      progress.totalProcessed++;
    } else {
      progress.totalErrors++;
      progress.errors.push({ slug: article.slug, error: result.error });
    }
    progress.lastProcessedSlug = article.slug;
    saveProgress(progress);

    // Pequeña pausa para no saturar la API
    if (i < toProcess.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Resumen final
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  RESUMEN FINAL');
  console.log('═══════════════════════════════════════════════════════');
  log(`Total procesados en esta ejecución: ${toProcess.length}`, 'info');
  log(`Exitosos: ${progress.totalProcessed}`, 'success');
  log(`Errores: ${progress.totalErrors}`, progress.totalErrors > 0 ? 'error' : 'info');
  log(`Progreso guardado en: ${PROGRESS_FILE}`, 'info');

  if (progress.totalErrors > 0) {
    log(`Log de errores: ${ERROR_LOG}`, 'warn');
    console.log('\n⚠️  Algunos artículos fallaron. Puedes reanudar ejecutando el script de nuevo.');
    console.log('   Los artículos exitosos no se reprocesarán (marcados con enriched_by_ai = true).\n');
  } else {
    console.log('\n✅ Pipeline de enriquecimiento completado exitosamente.\n');
  }

  console.log('📋 Próximos pasos:');
  console.log('   1. Verificar en Supabase: SELECT COUNT(*) FROM wellness_articles WHERE enriched_by_ai = true;');
  console.log('   2. Revisar artículos en el frontend');
  console.log('   3. Regenerar sitemap: npm run sitemap');
  console.log('   4. Solicitar indexación en Google Search Console\n');
}

// ── Ejecutar ────────────────────────────────────────────────────────────────

main().catch((err) => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});