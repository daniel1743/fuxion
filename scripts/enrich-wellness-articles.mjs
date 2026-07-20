#!/usr/bin/env node
/**
 * enrich-wellness-articles.mjs
 *
 * Pipeline de Enriquecimiento Editorial con IA — Etapa 2
 * ======================================================
 *
 * Arquitectura modularizada en fases:
 * 1. Verificar idempotencia
 * 2. Leer artículo de Supabase
 * 3. Crear Backup local completo
 * 4. Generar contenido (OneProvider + Claude Sonnet 5)
 * 5. Quality Gate (Validación Editorial)
 * 6. Actualizar Supabase
 * 7. Registrar resultado
 *
 * @version 2.0.0
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { config as loadEnv } from 'dotenv';
import { generateContent } from './providers/oneprovider.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  loadEnv({ path: envPath });
} else {
  console.warn('⚠️ No se encontró .env — se usarán variables del entorno actual.');
}

const PROMPT_VERSION = 'v2.0';

// ── 1. Seguridad y Configuración (Fail-Fast) ───────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iyloouessyxfvwvzdboc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ONEPROVIDER_API_KEY = process.env.ONEPROVIDER_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'claude-sonnet-5';

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERROR FATAL: SUPABASE_SERVICE_ROLE_KEY no está definida en el entorno.');
  process.exit(1);
}

if (!ONEPROVIDER_API_KEY) {
  console.error('❌ ERROR FATAL: ONEPROVIDER_API_KEY no está definida en el entorno.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ── CLI Args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const IS_DRY_RUN = args.includes('--dry-run');
const IS_FORCE = args.includes('--force');
const IS_RESET = args.includes('--reset');
const LIMIT_ARG = args.find((a) => a.startsWith('--limit='));
const BATCH_LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split('=')[1], 10) : null;

// ── Logging & Progreso ─────────────────────────────────────────────────────

const LOG_DIR = path.join(__dirname, '..', 'logs');
const BACKUPS_DIR = path.join(LOG_DIR, 'backups');
const PROGRESS_FILE = path.join(LOG_DIR, 'enrich-progress.json');
const ERROR_LOG = path.join(LOG_DIR, 'enrich-errors.log');

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });

function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  } catch {}
  return { processed: [], errors: [], startedAt: null, totalProcessed: 0, totalErrors: 0 };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function logError(articleSlug, errorMessage) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(ERROR_LOG, `[${timestamp}] ${articleSlug}: ${errorMessage}\n`);
}

function log(message, level = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const prefix = { info: '📝', success: '✅', warn: '⚠️', error: '❌', start: '🚀' };
  console.log(`${prefix[level] || 'ℹ️'} [${timestamp}] ${message}`);
}

// ── FASE 2: Idempotencia y Lectura ──────────────────────────────────────────

function isAlreadyEnriched(article) {
  const content = article.content || '';
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  // Criterio robusto basado en estructura editorial compleja
  const hasIntro = content.includes('## Introducción');
  const hasEvidence = content.includes('## Evidencia científica');
  const hasConclusion = content.includes('## Conclusión');
  return wordCount > 800 && hasIntro && hasEvidence && hasConclusion;
}

async function fetchArticles(limit = null) {
  let query = supabase.from('wellness_articles').select('*').order('created_at', { ascending: true });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw new Error(`Error fetching articles: ${error.message}`);
  return data || [];
}

// ── FASE 3: Backup Local ────────────────────────────────────────────────────

async function backupArticle(article) {
  const timestamp = Date.now();
  const backupPath = path.join(BACKUPS_DIR, `${article.slug}-${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(article, null, 2));
  return backupPath;
}

// ── FASE 4: OneProvider (Claude Sonnet 5) ──────────────────────────────────

async function generateEditorialContent(systemPrompt, userPrompt) {
  return await generateContent({ systemPrompt, userPrompt });
}

function buildSystemPrompt(articleTitle) {
  const title = articleTitle || 'el tema del artículo';
  return `Eres un redactor editorial científico especializado en salud y bienestar para "Bienestar en Claro" (bienestarenclaro.cl), una editorial chilena.

REGLAS ESTRICTAS Y CALIDAD EDITORIAL:
1. FUENTE PRINCIPAL: El "artículo semilla" proporcionado es tu fuente absoluta de verdad. Debes expandirlo sin contradecirlo.
2. CERO ALUCINACIONES: NO inventes estudios, autores, años, cifras ni estadísticas.
3. COMPLEMENTO ACEPTABLE: Solo puedes complementar con conocimiento médico, fisiológico o biológico ampliamente aceptado y consensuado universalmente.
4. INCERTIDUMBRE: Si no hay evidencia contundente sobre algo, indícalo explícitamente: "La evidencia científica actual es limitada en..."
5. CERO RELLENO: No uses frases infladas ("En el tejido de la sociedad moderna...", "Es importante destacar que..."). Ve al grano. No repitas párrafos.
6. CERO IA-ESQUE: Nunca uses frases como "Como modelo de lenguaje", "Como IA", "Aquí tienes el artículo".
7. TONO: Claro, clínico, empático, respetando principios EEAT (Experience, Expertise, Authoritativeness, Trustworthiness).

ESTRUCTURA OBLIGATORIA DEL ARTÍCULO (Usa exactamente estos H2):
## Introducción
(Contexto general, importancia clínica del tema: ${title}).
## ¿Qué es ${title}?
(Definición, mecanismos fisiológicos base).
## ¿Cómo funciona?
(Mecanismo de acción específico basado en la semilla).
## Beneficios y tiempo esperado
(Resultados realistas según la evidencia).
## Evidencia científica
(Resumen objetivo de la evidencia proporcionada).
## Recomendaciones prácticas
(Cómo aplicarlo, dosis, combinaciones sinérgicas).
## Errores frecuentes
(Precauciones, malas interpretaciones).
## ¿Cuándo consultar al médico?
(Señales de alerta).
## Conclusión
(Síntesis de valor).

FORMATO DE SALIDA:
- SOLO Markdown.
- NO incluyas el H1 (título) ni FAQs ni JSON.
- Escribe entre 1200 y 2500 palabras de contenido de altísimo valor.`;
}

function buildUserPrompt(article) {
  return `INFORMACIÓN DEL ARTÍCULO SEMILLA:
Título: ${article.title}
Categoría: ${article.category || 'No especificada'}
Nivel de evidencia: ${article.evidence_level || 'No especificado'}

CONTENIDO SEMILLA (Fuente de Verdad):
${article.content || '(sin contenido)'}

INSTRUCCIONES FINALES:
Expande este contenido semilla en un artículo completo siguiendo estrictamente las secciones requeridas.`;
}

// ── FASE 5: Quality Gate (Validación Editorial) ─────────────────────────────

function validateEditorialQuality(content, seedArticle) {
  const errors = [];
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  if (wordCount < 800) errors.push(`Contenido muy corto (${wordCount} palabras). Posible fallo de generación.`);

  const requiredSections = [
    '## Introducción',
    '## ¿Qué es',
    '## ¿Cómo funciona',
    '## Beneficios y tiempo esperado',
    '## Evidencia científica',
    '## Recomendaciones prácticas',
    '## Errores frecuentes',
    '## ¿Cuándo consultar al médico?',
    '## Conclusión'
  ];

  for (const section of requiredSections) {
    if (!content.includes(section)) errors.push(`Falta la sección obligatoria: ${section}`);
  }

  const badPatterns = [
    /como modelo de lenguaje/i,
    /como ia/i,
    /aquí tienes el artículo/i,
    /\[insertar/i,
    /todo:/i
  ];

  for (const pattern of badPatterns) {
    if (pattern.test(content)) errors.push(`Se detectó texto residual de IA o placeholder: ${pattern}`);
  }

  // Detectar encabezados H2 duplicados (síntoma de alucinación estructural)
  const h2Matches = content.match(/^## .+/gm) || [];
  const uniqueH2 = new Set(h2Matches);
  if (h2Matches.length !== uniqueH2.size) {
    errors.push('Se detectaron encabezados H2 duplicados.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// ── FASE 6: Extracción y Actualización ──────────────────────────────────────

function extractEditorialBody(aiContent) {
  let body = aiContent.replace(/^# .+\n+/gm, ''); // Eliminar H1 extra
  body = body.replace(/## Preguntas Frecuentes[\s\S]*$/i, ''); // Eliminar FAQs extra
  body = body.replace(/## FAQ[\s\S]*$/i, '');
  return body.trim();
}

function extractFaqSection(content) {
  if (!content) return '';
  const match = content.match(/## Preguntas Frecuentes[\s\S]*$/i);
  return match ? match[0].trim() : '';
}

async function updateArticle(articleId, editorialContent) {
  if (IS_DRY_RUN) return true;
  const { error } = await supabase
    .from('wellness_articles')
    .update({ content: editorialContent, updated_at: new Date().toISOString() })
    .eq('id', articleId);
  if (error) throw new Error(`Supabase Update Error: ${error.message}`);
  return true;
}

// ── Orquestador por Artículo ────────────────────────────────────────────────

async function processSingleArticle(article, index, total) {
  const label = `[${index + 1}/${total}]`;
  log(`${label} Iniciando: "${article.slug}"`, 'start');
  const startTime = Date.now();

  try {
    // Fase 1: Idempotencia
    if (isAlreadyEnriched(article)) {
      log(`${label} ⏭️ Ya enriquecido — saltando.`, 'warn');
      return { success: true, skipped: true };
    }

    // Fase 2: Backup
    const backupFile = await backupArticle(article);

    // Fase 3: Generar IA
    const systemPrompt = buildSystemPrompt(article.title);
    const userPrompt = buildUserPrompt(article);
    const { content: aiContent, usage } = await generateEditorialContent(systemPrompt, userPrompt);

    // Preparar el cuerpo
    const editorialBody = extractEditorialBody(aiContent);

    // Fase 4: Quality Gate
    const validation = validateEditorialQuality(editorialBody, article);
    if (!validation.isValid) {
      throw new Error(`Rechazado por Quality Gate: ${validation.errors.join(' | ')}`);
    }

    // Fase 5: Ensamblar y Actualizar
    const h1 = `# ${article.title}`;
    const faqSection = extractFaqSection(article.content);
    const finalContent = [h1, '', editorialBody, faqSection].filter(Boolean).join('\n\n');

    await updateArticle(article.id, finalContent);

    // Fase 6: Registrar Resultado
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log(`${label} ✅ ÉXITO | ${countWords(editorialBody)} palabras | ${duration}s | Backup: ${path.basename(backupFile)}`, 'success');
    
    return { success: true };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log(`${label} ❌ FALLO | ${duration}s | Error: ${error.message}`, 'error');
    logError(article.slug, error.message);
    return { success: false, error: error.message };
  }
}

function countWords(text) {
  return (text || '').split(/\s+/).filter(Boolean).length;
}

// ── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  Pipeline Editorial IA - Fase 2 (Enterprise Grade)   ║');
  console.log(`║  Versión del Prompt: ${PROMPT_VERSION}                            ║`);
  console.log('╚══════════════════════════════════════════════════════╝\n');

  if (IS_DRY_RUN) log('MODO DRY RUN: No se modificará Supabase.', 'warn');
  
  const progress = loadProgress();
  if (IS_RESET) {
    log('Reiniciando progreso de enriquecimiento...', 'warn');
    progress.processed = [];
    progress.errors = [];
    progress.totalProcessed = 0;
    progress.totalErrors = 0;
    saveProgress(progress);
  }
  if (!progress.startedAt) progress.startedAt = new Date().toISOString();

  log('Consultando artículos en Supabase...', 'info');
  const allArticles = await fetchArticles(BATCH_LIMIT);
  
  let articlesToProcess = IS_FORCE ? allArticles : allArticles.filter((a) => !isAlreadyEnriched(a));
  
  // Reanudación
  const toProcess = articlesToProcess.filter((a) => !progress.processed.includes(a.slug));

  if (toProcess.length === 0) {
    log('No hay artículos pendientes para procesar. ¡Todo al día! 🎉', 'success');
    return;
  }

  log(`Artículos a procesar en esta ejecución: ${toProcess.length}`, 'start');

  for (let i = 0; i < toProcess.length; i++) {
    const article = toProcess[i];
    const result = await processSingleArticle(article, i, toProcess.length);

    progress.processed.push(article.slug);
    if (result.success) progress.totalProcessed++;
    else {
      progress.totalErrors++;
      progress.errors.push({ slug: article.slug, error: result.error });
    }
    saveProgress(progress);

    // Rate Limiting preventivo (1 seg)
    if (i < toProcess.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  RESUMEN FINAL');
  console.log('═══════════════════════════════════════════════════════');
  log(`Procesados: ${toProcess.length} | Exitosos: ${progress.totalProcessed} | Errores: ${progress.totalErrors}`, 'info');
  
  if (progress.totalErrors > 0) log(`Revisa el log de errores en: ${ERROR_LOG}`, 'warn');
}

main().catch((err) => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});