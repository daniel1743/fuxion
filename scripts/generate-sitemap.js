/**
 * Dynamic sitemap generator for Tienda Fuxion Chile
 * 
 * Run: node scripts/generate-sitemap.js
 * This generates public/sitemap.xml with all products, categories, wellness articles, and static pages.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://www.bienestarenclaro.com';
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// ── Static pages ──────────────────────────────────────────────
const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/sobre-nosotros', priority: '0.85', changefreq: 'monthly' },
  { loc: '/asesor-fuxion', priority: '0.75', changefreq: 'monthly' },
  { loc: '/centro-de-ayuda', priority: '0.60', changefreq: 'monthly' },
  { loc: '/productos-fuxion', priority: '0.90', changefreq: 'weekly' },
  { loc: '/opiniones', priority: '0.80', changefreq: 'weekly' },
  { loc: '/bienestar', priority: '0.75', changefreq: 'weekly' },
  { loc: '/categorias', priority: '0.85', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.75', changefreq: 'weekly' },
  { loc: '/ayuda', priority: '0.60', changefreq: 'monthly' },
  { loc: '/terminos', priority: '0.30', changefreq: 'monthly' },
  { loc: '/privacidad', priority: '0.30', changefreq: 'monthly' },
  { loc: '/cookies', priority: '0.30', changefreq: 'monthly' },
  { loc: '/contacto', priority: '0.70', changefreq: 'weekly' },
  { loc: '/envios', priority: '0.40', changefreq: 'monthly' },
  { loc: '/faq', priority: '0.50', changefreq: 'monthly' },
  { loc: '/oportunidad-fuxion', priority: '0.85', changefreq: 'weekly' },
  { loc: '/productos-fuxion-chile', priority: '0.90', changefreq: 'weekly' },
];

// ── Category pages (clean URLs) ───────────────────────────────
const categories = [
  { slug: 'limpieza-desintoxicacion', name: 'Limpieza y Desintoxicación' },
  { slug: 'proteinas-nutricion', name: 'Proteínas y Nutrición' },
  { slug: 'energia-natural', name: 'Energía Natural' },
  { slug: 'sistema-inmune', name: 'Sistema Inmune' },
  { slug: 'control-peso', name: 'Control de Peso' },
  { slug: 'anti-edad-belleza', name: 'Anti-Edad y Belleza' },
  { slug: 'vigor-mental', name: 'Vigor Mental' },
  { slug: 'deportes', name: 'Deportes' },
];

// ── Product slugs from database ───────────────────────────────
function loadProductSlugs() {
  try {
    const dbPath = path.resolve(__dirname, '../src/data/fuxion_database.json');
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(raw);
    const productos = db.productos || {};

    return Object.values(productos).map((p) => {
      const name = p.nombre || '';
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\+/g, ' plus ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      return { slug, name };
    });
  } catch (err) {
    console.error('Error loading product database:', err.message);
    return [];
  }
}

// ── Wellness article slugs from Supabase (optional) ───────────
// If a wellness-articles.json cache exists, include those URLs too
function loadWellnessArticleSlugs() {
  try {
    const cachePath = path.resolve(__dirname, '../public/wellness-articles-cache.json');
    if (fs.existsSync(cachePath)) {
      const raw = fs.readFileSync(cachePath, 'utf-8');
      const articles = JSON.parse(raw);
      if (Array.isArray(articles)) {
        return articles
          .filter((a) => a.slug && a.is_published !== false)
          .map((a) => ({ slug: a.slug, title: a.title }));
      }
    }
  } catch (err) {
    // Silently fail - cache may not exist yet
  }
  return [];
}

// ── Generate XML ──────────────────────────────────────────────
function generateSitemap() {
  const products = loadProductSlugs();
  const wellnessArticles = loadWellnessArticleSlugs();
  const urls = [];

  // Static pages
  for (const page of staticPages) {
    urls.push(`  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  // Category pages (clean URLs)
  for (const cat of categories) {
    urls.push(`  <url>
    <loc>${SITE_URL}/categoria/${cat.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>`);
  }

  // Product pages
  for (const product of products) {
    if (!product.slug) continue;
    urls.push(`  <url>
    <loc>${SITE_URL}/producto/${product.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>`);
  }

  // Wellness article pages
  for (const article of wellnessArticles) {
    urls.push(`  <url>
    <loc>${SITE_URL}/bienestar/${article.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`✅ Sitemap generated: ${outputPath}`);
  console.log(`   ${urls.length} URLs included (${staticPages.length} static, ${categories.length} categories, ${products.length} products, ${wellnessArticles.length} wellness articles)`);
}

generateSitemap();
