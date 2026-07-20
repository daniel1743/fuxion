/**
 * Dynamic sitemap generator for Bienestar en Claro Chile
 *
 * Run: node scripts/generate-sitemap-final.cjs
 * This generates public/sitemap.xml with all products, categories, wellness articles, and blog posts.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ROOT_DIR = path.resolve(__dirname, '..');
const SITE_URL = 'https://www.bienestarenclaro.com';
const TODAY = new Date().toISOString().split('T')[0];

// ── Supabase client ───────────────────────────────────────────
const supabaseUrl = 'https://iyloouessyxfvwvzdboc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bG9vdWVzc3l4ZnZ3dnpkYm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MzcyNzUsImV4cCI6MjA5NzIxMzI3NX0.6bjQCIC3vQKFny4Sl5i-k7P1r7_4UUKhhcQ65Y5jsmc';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    const dbPath = path.join(ROOT_DIR, 'src/data/fuxion_database.json');
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(raw);
    const productos = db.productos || {};

    return Object.values(productos).map((p) => {
      const name = p.nombre || '';
      const slug = name
        .toLowerCase()
        .normalize('NFD')
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

// ── Blog post slugs from Supabase (dynamic) ───────────────────
async function loadBlogPostSlugs() {
  try {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured — skipping blog posts.');
      return [];
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('is_published', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading blog posts:', error.message);
      return [];
    }

    return (data || []).map((post) => ({
      slug: post.slug,
      updated_at: post.updated_at || TODAY
    }));
  } catch (err) {
    console.error('❌ Error loading blog posts:', err.message);
    return [];
  }
}

// ── Wellness article slugs from Supabase (dynamic) ────────────
async function loadWellnessArticleSlugs() {
  try {
    if (!supabase) {
      // Fall back to cache file
      const cachePath = path.join(ROOT_DIR, 'public/wellness-articles-cache.json');
      if (fs.existsSync(cachePath)) {
        const raw = fs.readFileSync(cachePath, 'utf-8');
        const articles = JSON.parse(raw);
        if (Array.isArray(articles)) {
          return articles
            .filter((a) => a.slug && a.is_published !== false)
            .map((a) => ({ slug: a.slug, title: a.title }));
        }
      }
      return [];
    }

    const { data, error } = await supabase
      .from('wellness_articles')
      .select('slug, updated_at')
      .eq('is_published', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading wellness articles:', error.message);
      return [];
    }

    return (data || []).map((article) => ({
      slug: article.slug,
      updated_at: article.updated_at || TODAY
    }));
  } catch (err) {
    console.error('❌ Error loading wellness articles:', err.message);
    return [];
  }
}

// ── Generate XML ──────────────────────────────────────────────
async function generateSitemap() {
  const products = loadProductSlugs();
  const wellnessArticles = await loadWellnessArticleSlugs();
  const blogPosts = await loadBlogPostSlugs();
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
    <lastmod>${article.updated_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>`);
  }

  // Blog post pages
  for (const post of blogPosts) {
    urls.push(`  <url>
    <loc>${SITE_URL}/articulos/${post.slug}</loc>
    <lastmod>${post.updated_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  const outputPath = path.join(ROOT_DIR, 'public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`✅ Sitemap generated: ${outputPath}`);
  console.log(`   ${urls.length} URLs included (`);
  console.log(`      ${staticPages.length} static,`);
  console.log(`      ${categories.length} categories,`);
  console.log(`      ${products.length} products,`);
  console.log(`      ${wellnessArticles.length} wellness articles,`);
  console.log(`      ${blogPosts.length} blog posts)`);
}

generateSitemap();
