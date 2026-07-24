import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cachePath = path.join(root, 'public', 'wellness-articles-cache.json');
const articlePath = path.join(root, 'docs', 'modelo_editorial', 'eje-intestino-higado', 'articulo_final.md');
const seoPath = path.join(root, 'docs', 'modelo_editorial', 'eje-intestino-higado', 'configuracion_seo.json');

const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
const content = fs.readFileSync(articlePath, 'utf8').trim();
const seo = JSON.parse(fs.readFileSync(seoPath, 'utf8'));
const legacySlugs = new Set([
  'eje-intestino-hgado',
  'eje-intestino-higado-microbiota',
  'eje-intestino-higado',
]);

const matches = cache.filter((article) => legacySlugs.has(article.slug));
if (matches.length === 0) {
  throw new Error('No se encontró el artículo eje intestino-hígado en el cache.');
}

const preferred = matches.find((article) => article.image_url) || matches[0];
const updated = {
  ...preferred,
  id: '2e2331ff-6d7e-433f-8665-223efb6240cb',
  title: seo.titulo_seo,
  slug: seo.slug,
  excerpt: seo.meta_descripcion,
  content,
  category: seo.categoria,
  image_url: '/images/articles/eje-intestino-higado.png',
  author: 'Daniel Falcón',
  editor_name: 'Daniel Falcón',
  is_published: true,
  updated_at: new Date().toISOString(),
  enriched: {
    semanticKeywords: seo.palabras_clave,
    generatedFaqs: [],
    relatedProducts: [],
    primaryModule: 'Salud hepática',
    metaDescription: seo.meta_descripcion,
    hasFAQs: false,
    hasRelatedProducts: false,
  },
};

const firstMatchIndex = cache.findIndex((article) => legacySlugs.has(article.slug));
const consolidated = cache.filter((article) => !legacySlugs.has(article.slug));
consolidated.splice(firstMatchIndex, 0, updated);

fs.writeFileSync(cachePath, `${JSON.stringify(consolidated, null, 2)}\n`, 'utf8');
console.log(`Cache consolidado: ${matches.length} registros reemplazados por 1.`);
