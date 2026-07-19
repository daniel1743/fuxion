#!/usr/bin/env node
/**
 * Convert biblioteca_bienestar.json → publishable articles for Supabase.
 *
 * Each module + intervention pair becomes ONE article.
 * Output: converted-articles.json (ready to bulk-insert into Supabase blog_posts)
 *
 * Usage:
 *   node scripts/convert-bible-to-articles.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BIBLIA_PATH = path.resolve(__dirname, '../public/branding/base de datos bienestar ia/biblioteca_bienestar.json');
const OUTPUT_PATH = path.resolve(__dirname, '../public/converted-articles.json');

// ── Load bible ──────────────────────────────────────────────
const bible = JSON.parse(fs.readFileSync(BIBLIA_PATH, 'utf-8'));

// ── Helpers ─────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function countWords(text) {
  return text.trim().split(/\s+/).length;
}

// ── Article builder ─────────────────────────────────────────
function buildArticle(module, intervention) {
  const title = `¿Qué es ${intervention.action}? Mecanismo, beneficios y evidencia científica`;
  const excerpt = `${capitalize(intervention.action)}: ${intervention.mechanism}`;

  // Build rich markdown content
  let content = `# ${intervention.action}\n\n`;
  content += `${intervention.mechanism}\n\n`;

  // Add evidence section
  content += `## ¿Qué tan respaldada está esta intervención?\n\n`;
  content += `La evidencia científica indica que **${intervention.impact_evidence}**.\n\n`;

  // Add how to implement
  content += `## Cómo implementar ${intervention.action} en tu rutina\n\n`;
  content += `${intervention.mechanism}\n\n`;

  // Add errors section
  content += `## Errores comunes al implementar ${intervention.action}\n\n`;
  content += `${intervention.errors_alternatives}\n\n`;

  // Add timeline section
  content += `## ¿Cuánto tiempo toma ver resultados?\n\n`;
  content += `${intervention.benefit_time}\n\n`;

  // Add module-level context
  content += `---\n\n`;
  content += `## ${module.title}\n\n`;
  content += `**Fisiopatología:** ${module.pathophysiology}\n\n`;

  if (module.myths_and_errors && module.myths_and_errors.length > 0) {
    content += `### Mitos y errores frecuentes sobre ${module.title}\n\n`;
    for (const myth of module.myths_and_errors) {
      content += `- ${myth}\n`;
    }
    content += '\n';
  }

  if (module.risk_factors && module.risk_factors.length > 0) {
    content += `### Factores de riesgo asociados\n\n`;
    for (const rf of module.risk_factors) {
      content += `- ${rf}\n`;
    }
    content += '\n';
  }

  content += `> **Fuente:** Bibliografía de Bienestar en Claro — evidencia científica actualizada.\n`;
  content += `> **Descargo:** Este contenido tiene fines educativos. No reemplaza evaluación médica profesional.\n`;

  const words = countWords(content);
  const minutes = Math.max(1, Math.ceil(words / 200));

  // Determine tags from module keywords
  const tags = [
    slugify(module.title.toLowerCase()),
    slugify(intervention.action.toLowerCase().slice(0, 40)),
  ];

  // Clean up module title for slug
  const moduleSlug = slugify(module.title.toLowerCase());
  const interventionSlug = slugify(intervention.action.toLowerCase());

  return {
    title,
    slug: `${moduleSlug}-${interventionSlug}`,
    excerpt,
    content,
    category: module.title,
    tags,
    reading_time_minutes: minutes,
    word_count: words,
    intervention_id: intervention.id,
    module_id: module.id,
    module_title: module.title,
    evidence_level: intervention.impact_evidence || 'No especificado',
    source: 'biblioteca_bienestar',
    is_published: false, // Start as draft until reviewed
    created_at: new Date().toISOString().split('T')[0],
    updated_at: new Date().toISOString().split('T')[0],
  };
}

// ── Process all modules ─────────────────────────────────────
const articles = [];

for (const module of bible.modules) {
  if (!module.interventions || module.interventions.length === 0) {
    console.log(`⏭️  Módulo ${module.id}: "${module.title}" — sin intervenciones, omitido`);
    continue;
  }

  for (const intervention of module.interventions) {
    const article = buildArticle(module, intervention);
    articles.push(article);
  }
}

// ── Write output ────────────────────────────────────────────
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(articles, null, 2), 'utf-8');

console.log(`\n✅ ${articles.length} artículos generados`);
console.log(`📁 Archivo: ${OUTPUT_PATH}`);

// Summary by module
const byModule = {};
for (const a of articles) {
  if (!byModule[a.module_title]) byModule[a.module_title] = 0;
  byModule[a.module_title]++;
}

console.log('\n📊 Distribución por módulo:');
for (const [mod, count] of Object.entries(byModule)) {
  console.log(`   ${mod}: ${count} artículos`);
}

// Sample a few titles
console.log('\n📝 Ejemplos de títulos:');
for (const a of articles.slice(0, 5)) {
  console.log(`   • ${a.title}`);
}

console.log('\n💡 Para publicar en Supabase:');
console.log('   1. Abrir el panel de Supabase → tabla blog_posts');
console.log('   2. Importar el JSON generado (columnas: title, slug, content, excerpt, category, tags, reading_time_minutes)');
console.log('   3. Marcar como published (is_published: true)');
console.log('   4. Ejecutar node scripts/generate-sitemap.js para actualizar sitemap');
