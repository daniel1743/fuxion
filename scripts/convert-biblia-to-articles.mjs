#!/usr/bin/env node
/**
 * Genera artículos enriquecidos desde biblia_bienestar.json y los sube a Supabase
 *
 * Uso:
 *   1. Ejecutar SQL_WELLNESS_ARTICLES_ALTER.sql en Supabase SQL Editor
 *   2. Ejecutar: node scripts/convert-biblia-to-articles.mjs
 *   3. Verificar en Supabase: SELECT COUNT(*) FROM wellness_articles WHERE enriched = true;
 *   4. Regenerar sitemap: npm run sitemap
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Configuración ──────────────────────────────────────────────
const SUPABASE_URL = 'https://iyloouessyxfvwvzdboc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bG9vdWVzc3l4ZnZ3dnpkYm9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTYzNzI3NSwiZXhwIjoyMDk3MjEzMjc1fQ.-YySdwqu5kPADvC_HFx5TtaFRLDBsj0QHMdPfn_isF4';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BIBLIA_PATH = path.join(__dirname, '..', 'public', 'branding', 'base de datos bienestar ia', 'biblioteca_bienestar.json');

// Owner user — Daniel Falcón's auth user ID.
// Change this to your actual auth.users.id from Supabase.
const OWNER_USER_ID = '8f37047c-a45f-4d8e-8313-fc8534e5a2fa';

// ── Utilidades ─────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function extractEntityFromAction(action) {
  const match = action.match(/^([^()]+?)(?:\s*\(.*?\))?$/);
  return match ? match[1].trim() : action;
}

function getEvidenceLevel(impact) {
  if (impact.includes('Nivel 1')) return 'high';
  if (impact.includes('Nivel 2')) return 'medium';
  return 'low';
}

// ── Generación de artículos ───────────────────────────────────

function generateArticle(module, intervention) {
  const entity = extractEntityFromAction(intervention.action);
  const entitySlug = slugify(entity);
  const moduleSlug = slugify(module.title);

  return {
    // Required columns from wellness_articles table
    owner_user_id: OWNER_USER_ID,
    title: `${intervention.action} — ${module.title}`,
    slug: `${entitySlug}-${moduleSlug}`,
    category: module.title,
    excerpt: `${intervention.action}. ${intervention.mechanism.substring(0, 150)}...`,
    content: `## Intervención: ${intervention.action}

### Mecanismo de acción
${intervention.mechanism}

### Beneficios y tiempo estimado
${intervention.benefit_time || 'Tiempo de efecto variable.'}

### Evidencia científica
${intervention.impact_evidence}

### Errores comunes y alternativas
${intervention.errors_alternatives || 'Consultar con profesional de salud antes de implementar esta intervención.'}

---

*Módulo: ${module.title}*
*Pathophysiology: ${module.pathophysiology}*`,
    image_url: '/branding/social/og-image.png',
    editor_name: 'Daniel Falcón',
    editor_email: 'falcondaniel37@gmail.com',
    is_published: true,
    published_at: new Date().toISOString(),

    // Enrichment columns (added by ALTER TABLE)
    enriched: true,
    entity_detected: [entity],
    entity_slug: entitySlug,
    evidence_level: getEvidenceLevel(intervention.impact_evidence),
    related_products: [],
    semantic_keywords: [entity, intervention.action, module.title],
    seo_schema: {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      name: intervention.action,
      description: intervention.mechanism,
      about: {
        '@type': 'MedicalCondition',
        name: module.title
      },
      author: {
        '@type': 'Person',
        name: 'Daniel Falcón',
        jobTitle: 'Asesor de Bienestar y Nutrición'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Bienestar en Claro Chile'
      },
      datePublished: new Date().toISOString()
    },
    enrichment_score: intervention.impact_evidence?.includes('Nivel 1') ? 0.95 :
                      intervention.impact_evidence?.includes('Nivel 2') ? 0.85 : 0.7,
    views: 0
  };
}

// ── Procesamiento ──────────────────────────────────────────────

async function main() {
  console.log('\n📚 Cargando biblia_bienestar.json...\n');

  const raw = fs.readFileSync(BIBLIA_PATH, 'utf-8');
  const biblia = JSON.parse(raw);

  console.log(`Proyecto: ${biblia.project} v${biblia.version}`);
  console.log(`Módulos: ${biblia.modules.length}`);
  console.log(`Fuentes bibliográficas: ${biblia.bibliographical_sources?.length || 0}\n`);

  const articles = [];
  const errors = [];
  let skipped = 0;

  for (const module of biblia.modules) {
    const interventions = module.interventions || [];

    if (interventions.length === 0) {
      console.log(`⏭️  Módulo ${module.id}: ${module.title} — Sin intervenciones, omitido`);
      skipped++;
      continue;
    }

    console.log(`📝 Módulo ${module.id}: ${module.title} (${interventions.length} intervenciones)`);

    for (const intervention of interventions) {
      try {
        const article = generateArticle(module, intervention);
        articles.push(article);
      } catch (err) {
        errors.push({ module: module.id, intervention: intervention.id, error: err.message });
        console.error(`  ❌ Error generando artículo: ${intervention.id} — ${err.message}`);
      }
    }

    console.log(`   → ${interventions.length} artículos generados`);
  }

  console.log(`\n✅ Total: ${articles.length} artículos enriquecidos`);
  console.log(`⏭️  Omitidos: ${skipped}`);
  console.log(`❌ Errores: ${errors.length}\n`);

  if (errors.length > 0) {
    console.log('Errores detallados:');
    errors.forEach(e => console.log(`  ${e.module}/${e.intervention}: ${e.error}`));
    console.log();
  }

  // ── Guardar cache ───────────────────────────────────────────

  const cachePath = path.join(__dirname, '..', 'public', 'wellness-articles-cache.json');
  fs.writeFileSync(cachePath, JSON.stringify(articles, null, 2));
  console.log(`💾 Cache guardado: ${cachePath} (${articles.length} artículos)`);

  // ── Subir a Supabase ────────────────────────────────────────

  console.log(`\n⏳ Subiendo ${articles.length} artículos a Supabase...`);

  const BATCH_SIZE = 50;
  let uploaded = 0;

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(articles.length / BATCH_SIZE);

    try {
      const { error } = await supabase.from('wellness_articles').upsert(batch, { onConflict: 'slug' });
      if (error) {
        console.error(`  ❌ Batch ${batchNum}/${totalBatches}: ${error.message}`);
        errors.push({ module: 'batch', intervention: i, error: error.message });
      } else {
        uploaded += batch.length;
        console.log(`  ✅ Batch ${batchNum}/${totalBatches}: ${batch.length} artículos subidos (${uploaded}/${articles.length})`);
      }
    } catch (err) {
      console.error(`  ❌ Batch ${batchNum}/${totalBatches}: ${err.message}`);
      errors.push({ module: 'batch', intervention: i, error: err.message });
    }
  }

  console.log(`\n📊 Resumen final:`);
  console.log(`   Artículos generados: ${articles.length}`);
  console.log(`   Artículos subidos: ${uploaded}`);
  console.log(`   Artículos no subidos: ${articles.length - uploaded}`);
  console.log(`   Errores: ${errors.length}\n`);

  if (errors.length === 0) {
    console.log('✅ ¡Conversión completada exitosamente!\n');
  } else {
    console.log(`⚠️  Completada con ${errors.length} errores. Revisa la lista arriba.\n`);
  }

  console.log('📋 Próximos pasos:');
  console.log('   1. Verificar en Supabase: SELECT COUNT(*) FROM wellness_articles WHERE enriched = true;');
  console.log('   2. Regenerar sitemap: npm run sitemap');
  console.log('   3. Verificar en Google Search Console');
  console.log('   4. Solicitar indexación de artículos nuevos\n');
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
