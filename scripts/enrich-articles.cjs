/**
 * Article Enrichment Pipeline — Bienestar en Claro
 *
 * Reads blog posts from Supabase, enriches them with:
 * - FAQs extracted from the wellness bible
 * - Semantic keywords mapped to wellness modules
 * - Related products from Fuxion database
 * - Schema-ready content for AEO (Answer Engine Optimization)
 *
 * Run: node scripts/enrich-articles.cjs
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const ROOT_DIR = path.resolve(__dirname, '..');
const SITE_URL = 'https://www.bienestarenclaro.com';

// Load external data
const BIBLE_PATH = path.join(ROOT_DIR, 'public', 'branding', 'base de datos bienestar ia', 'biblioteca_bienestar.json');
const BIBLE = JSON.parse(fs.readFileSync(BIBLE_PATH, 'utf-8'));

const PRODUCT_DB = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/fuxion_database.json'), 'utf-8'));
const PRODUCTS = Object.values(PRODUCT_DB.productos || {}).filter(Boolean);

// Supabase client (requires SUPABASE_SERVICE_ROLE_KEY env var)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iyloouessyxfvwvzdboc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY no está definida en el entorno.');
  console.error('   export SUPABASE_SERVICE_ROLE_KEY=tu_clave_aqui');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Keyword maps for products
const PRODUCT_KEYWORD_MAP = {
  'thermo-t3': ['metabolismo', 'quema de grasa', 'energía', 'entrenamiento', 'control de peso', 'L-carnitina', 'te verde'],
  'nocarb-t': ['carbohidratos', 'azúcar', 'fibra', 'cromo', 'canela', 'control de peso'],
  'prunex-1': ['estreñimiento', 'transito intestinal', 'fibra', 'psyllium', 'digestión'],
  'liquid-fiber': ['fibra prebiótica', 'digestión', 'flora intestinal', 'transito'],
  'flora-liv': ['probióticos', 'flora intestinal', 'microbiota', 'gastritis', 'colon irritable'],
  'rexet': ['hígado', 'hígado graso', 'depurativo', 'hepático', 'desintoxicación'],
  'nutraday': ['vitaminas', 'nutrición', 'antioxidantes', 'hidratación', 'familia'],
  'vita-xtra-t-plus': ['energía', 'vitalidad', 'guayusa', 'té verde', 'antioxidantes'],
  'vitaenergia': ['fatiga', 'energía', 'vitaminas', 'regeneración celular', 'defensas'],
  'on': ['cerebro', 'concentración', 'memoria', 'vigor mental', 'taurina'],
  'no-stress': ['estrés', 'ansiedad', 'relajación', 'glicina', 'triptófano'],
  'protein-active-fit': ['proteína vegetal', 'control de peso', 'saciedad', 'quinua'],
  'bioprotein-active': ['proteína vegetal', 'regeneración muscular', 'quinua', 'vegetariana'],
  'youth-elixir': ['anti-edad', 'vitalidad', 'hormona del crecimiento', 'sueño'],
  'beauty-in': ['colágeno', 'piel', 'belleza', 'anti-edad', 'cabello'],
  'golden-flx': ['articulaciones', 'curcuma', 'antiinflamatorio', 'movilidad'],
  'probal': ['salud femenina', 'hormonas', 'menopausia', 'ciclo menstrual'],
  'berry-balance': ['tracto urinario', 'cranberry', 'probióticos', 'ácido urinario'],
  'alpha-balance': ['limpieza', 'metales pesados', 'alfalfa', 'clorofila', 'alcalinizar'],
  'gano-plus-cappuccino': ['defensas', 'beta glucanos', 'inmunidad', 'cappuccino'],
  'pre-sport-pro-edition': ['pre entreno', 'rendimiento deportivo', 'aminoácidos', 'electrolitos'],
  'post-sport-pro-edition': ['recuperación muscular', 'BCAAs', 'glutamina', 'electrolitos'],
  'cafe-cafe-fit-cappuccino': ['café', 'cappuccino', 'energía diaria', 'control de peso'],
  'passion': ['energía vital', 'potencia sexual', 'ginseng', 'jalea real'],
  'pack-5-14': ['control de peso', 'combo', 'plan', 'asesoría']
};

// Map article topics to bible module IDs
const ARTICLE_TOPIC_TO_MODULE = {
  'cirrosis': 1, 'hígado graso': 6, 'hígado': 6, 'esteatosis': 6, 'hepat': 6, 'hepatización': 6, 'hepatiti': 6,
  'digestión': 2, 'estreñimiento': 2, 'disbiosis': 2, 'microbiota': 2,
  'colon irritable': 2, 'gastritis': 2, 'reflujo': 2, 'sibo': 2,
  'fibra': 2, 'intestino irritable': 2, 'permeabilidad intestinal': 2,
  'eje intestino cerebro': 2,
  'insomnio': 3, 'sueño': 3, 'melatonina': 3, 'descanso': 3,
  'apnea': 3, 'sistema inmune': 3, 'defensas': 3,
  'estrés': 4, 'ansiedad': 4, 'miedo': 4, 'cognitiva': 4,
  'memoria': 4, 'depresión': 4, 'hormonas': 4, 'tiroides': 4,
  'hidratación': 5, 'agua': 5, 'electrolitos': 5, 'nutrición celular': 5,
  'deporte': 6, 'ejercicio': 6, 'cardiovascular': 6, 'corazón': 6,
  'obesidad': 1, 'peso': 1, 'diabetes': 1,
  'nutrición': 1, 'alimentación': 1, 'proteína': 1, 'proteina': 1,
  'carbohidrato': 1, 'grasa': 1, 'colesterol': 1,
  'hipertensión': 1, 'hipertension': 1, 'arterial': 1, 'presión arterial': 1
};

// Helpers
function slugifyProduct(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getProductImageUrl(name) {
  return SITE_URL + '/img/productos/' + slugifyProduct(name) + '.png';
}

function decodeHtmlEntities(html) {
  return String(html || '')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');
}


// Enrichment functions
function extractSemanticKeywords(content, title) {
  const text = (title + ' ' + decodeHtmlEntities(content)).toLowerCase();
  const keywords = new Set();
  for (const [, terms] of Object.entries(PRODUCT_KEYWORD_MAP)) {
    for (const term of terms) { if (text.includes(term.toLowerCase())) keywords.add(term); }
  }
  for (const mod of BIBLE.modules || []) {
    if (text.includes(mod.title.toLowerCase())) keywords.add(mod.title);
  }
  return Array.from(keywords);
}

function findMatchingModule(text) {
  // Try topic keywords first
  for (const [topic, moduleId] of Object.entries(ARTICLE_TOPIC_TO_MODULE)) {
    if (text.includes(topic.toLowerCase())) return moduleId;
  }
  // Try direct module title match
  for (let i = 0; i < (BIBLE.modules || []).length; i++) {
    if (text.includes((BIBLE.modules[i].title || '').toLowerCase())) return i + 1;
  }
  return null;
}

function generateFaqsFromBible(content, title) {
  const text = (title + ' ' + decodeHtmlEntities(content)).toLowerCase();
  const faqs = [];

  // Find all matching modules
  const matchedModules = new Set();
  for (const [topic, moduleId] of Object.entries(ARTICLE_TOPIC_TO_MODULE)) {
    if (text.includes(topic.toLowerCase())) matchedModules.add(moduleId);
  }
  for (let i = 0; i < (BIBLE.modules || []).length; i++) {
    if (text.includes((BIBLE.modules[i].title || '').toLowerCase())) matchedModules.add(i + 1);
  }

  // Generate FAQs from matched modules
  for (const modId of matchedModules) {
    const mod = BIBLE.modules[modId - 1];
    if (mod) {
      const interventions = mod.interventions || [];
      for (const intervention of interventions.slice(0, 5)) {
        if (intervention.action && intervention.mechanism) {
          faqs.push({
            question: '¿Qué es ' + intervention.action + '?',
            answer: intervention.mechanism
          });
        }
      }
    }
  }

  return faqs;
}

function findRelatedProducts(content, title) {
  const text = (title + ' ' + decodeHtmlEntities(content)).toLowerCase();
  const scored = [];
  for (const [slug, terms] of Object.entries(PRODUCT_KEYWORD_MAP)) {
    const matchCount = terms.filter(t => text.includes(t.toLowerCase())).length;
    if (matchCount >= 2) {
      const product = PRODUCTS.find(p => slugifyProduct(p.nombre) === slug);
      if (product) {
        scored.push({
          slug, name: product.nombre, category: product.categoria,
          price: product.precio, image: getProductImageUrl(product.nombre),
          matchReason: 'Contiene ' + terms.slice(0, 3).join(', ')
        });
      }
    }
  }
  return scored.sort((a, b) => {
    const aCount = PRODUCT_KEYWORD_MAP[a.slug].filter(t => text.includes(t.toLowerCase())).length;
    const bCount = PRODUCT_KEYWORD_MAP[b.slug].filter(t => text.includes(t.toLowerCase())).length;
    return bCount - aCount;
  }).slice(0, 5);
}

function enrichArticle(article) {
  const content = article.content || '';
  const title = article.title || '';
  const text = title + ' ' + decodeHtmlEntities(content);

  const semanticKeywords = extractSemanticKeywords(content, title);
  const generatedFaqs = generateFaqsFromBible(content, title);
  const relatedProducts = findRelatedProducts(content, title);

  // Determine primary wellness module
  let primaryModule = 'Bienestar';
  const matchedModuleId = findMatchingModule(text);
  if (matchedModuleId) {
    const mod = BIBLE.modules[matchedModuleId - 1];
    if (mod) primaryModule = mod.title;
  }

  const metaDescription = article.excerpt ||
    title + '. Información basada en evidencia científica.' +
    (semanticKeywords.length > 0 ? ' Temas relacionados: ' + semanticKeywords.slice(0, 5).join(', ') + '.' : '');

  return {
    ...article,
    enriched: {
      semanticKeywords,
      generatedFaqs,
      relatedProducts,
      primaryModule,
      metaDescription,
      hasFAQs: generatedFaqs.length > 0,
      hasRelatedProducts: relatedProducts.length > 0
    }
  };
}

// Map bible module titles to the validated taxonomy categories
// DB CHECK constraint: Belleza, Bienestar, Salud hepática, Control de peso,
//   Bienestar gástrico, Ejercicio, Nutrición, Energía, Hábitos saludables, Salud emocional
const MODULE_TO_TAXONOMY = {
  'Nutrición y Metabolismo': 'Nutrición',
  'Salud Digestiva': 'Bienestar gástrico',
  'Sueño y Descanso': 'Hábitos saludables',
  'Salud Emocional y Cognitiva': 'Salud emocional',
  'Hidratación Clínica': 'Nutrición',
  'Hígado Graso': 'Salud hepática',
  'Diabetes y Metabolismo': 'Control de peso',
  'Ejercicio y Fuerza': 'Ejercicio',
  'Control de Peso': 'Control de peso',
  'Belleza y Piel': 'Belleza',
  'Salud Cardiovascular': 'Ejercicio',
  'Salud Hormonal': 'Bienestar',
  'Inmunidad': 'Bienestar',
  'Metabolismo': 'Control de peso',
  'Nutrición': 'Nutrición',
  'Bienestar': 'Bienestar',
};

// Generate a taxonomy string (CSV) from multiple signals
function generateTaxonomy(article) {
  const text = (article.title + ' ' + decodeHtmlEntities(article.content || '')).toLowerCase();
  const categories = new Set();

  // 1. Primary module — mapped to validated taxonomy
  if (article.enriched.primaryModule) {
    const mapped = MODULE_TO_TAXONOMY[article.enriched.primaryModule] || article.enriched.primaryModule;
    categories.add(mapped);
  }

  // 2. Secondary modules — find ALL matching bible modules
  for (const [topic, moduleId] of Object.entries(ARTICLE_TOPIC_TO_MODULE)) {
    if (text.includes(topic.toLowerCase())) {
      const mod = BIBLE.modules[moduleId - 1];
      if (mod) {
        const mapped = MODULE_TO_TAXONOMY[mod.title] || mod.title;
        categories.add(mapped);
      }
    }
  }

  // 3. Semantic keywords that match module titles
  for (const keyword of article.enriched.semanticKeywords) {
    for (const mod of BIBLE.modules || []) {
      if (keyword.toLowerCase().includes(mod.title.toLowerCase()) ||
          mod.title.toLowerCase().includes(keyword.toLowerCase())) {
        const mapped = MODULE_TO_TAXONOMY[mod.title] || mod.title;
        categories.add(mapped);
      }
    }
  }

  // 4. Product categories
  for (const product of article.enriched.relatedProducts) {
    if (product.category) categories.add(product.category);
  }

  // 5. Known health terms → DB CHECK constraint categories
  //    Valid categories: Belleza, Bienestar, Salud hepática, Control de peso,
  //    Bienestar gástrico, Ejercicio, Nutrición, Energía, Hábitos saludables, Salud emocional
  const HEALTH_TERMS = [
    // → Salud hepática
    ['hígado', 'Salud hepática'], ['hígado graso', 'Salud hepática'],
    // → Bienestar gástrico
    ['digestión', 'Bienestar gástrico'], ['estreñimiento', 'Bienestar gástrico'],
    ['microbiota', 'Bienestar gástrico'], ['flora intestinal', 'Bienestar gástrico'],
    ['colon irritable', 'Bienestar gástrico'], ['gastritis', 'Bienestar gástrico'],
    ['reflujo', 'Bienestar gástrico'], ['sibo', 'Bienestar gástrico'],
    // → Bienestar
    ['sistema inmune', 'Bienestar'], ['defensas', 'Bienestar'],
    ['inmunidad', 'Bienestar'], ['alergia', 'Bienestar'],
    ['hormona', 'Bienestar'], ['tiroides', 'Bienestar'],
    ['inflamación', 'Bienestar'], ['articulación', 'Bienestar'],
    ['riñón', 'Bienestar'], ['pulmón', 'Bienestar'],
    // → Control de peso
    ['diabetes', 'Control de peso'], ['insulina', 'Control de peso'],
    ['metabolismo', 'Control de peso'], ['obesidad', 'Control de peso'],
    ['peso', 'Control de peso'],
    // → Nutrición
    ['nutrición', 'Nutrición'], ['proteína', 'Nutrición'],
    ['hidratación', 'Nutrición'], ['agua', 'Nutrición'],
    // → Hábitos saludables
    ['sueño', 'Hábitos saludables'], ['insomnio', 'Hábitos saludables'],
    // → Salud emocional
    ['estrés', 'Salud emocional'], ['ansiedad', 'Salud emocional'],
    ['mente', 'Salud emocional'], ['memoria', 'Salud emocional'],
    ['depresión', 'Salud emocional'], ['salud mental', 'Salud emocional'],
    ['cerebro', 'Salud emocional'], ['neuro', 'Salud emocional'],
    // → Belleza
    ['piel', 'Belleza'], ['colágeno', 'Belleza'],
    ['belleza', 'Belleza'],
    // → Ejercicio
    ['ejercicio', 'Ejercicio'], ['deporte', 'Ejercicio'],
    ['corazón', 'Ejercicio'], ['cardiovascular', 'Ejercicio'],
    ['músculo', 'Ejercicio']
  ];

  for (const [term, category] of HEALTH_TERMS) {
    if (text.includes(term)) categories.add(category);
  }

  // 6. Existing category if it's valid
  if (article.category && article.category !== 'Bienestar') {
    categories.add(article.category);
  }

  // Limit to 5 categories and join as CSV
  const sorted = [...categories];
  const result = sorted.slice(0, 5).join(', ');
  return result;
}

// Schema builders
function buildFaqSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question', name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  };
}

function buildEnrichedMedicalSchema(article, enriched) {
  const { semanticKeywords, primaryModule } = enriched;
  return {
    '@context': 'https://schema.org', '@type': 'MedicalWebPage',
    'name': article.title, 'description': enriched.metaDescription,
    'about': { '@type': 'MedicalCondition', 'name': primaryModule },
    'keywords': semanticKeywords,
    'author': {
      '@type': 'Person', 'name': 'Daniel Falcón',
      'jobTitle': 'Investigador de Salud y Bienestar',
      'url': SITE_URL + '/sobre-nosotros'
    },
    'publisher': { '@type': 'Organization', 'name': 'Bienestar en Claro', 'url': SITE_URL },
    'datePublished': article.created_at, 'dateModified': article.updated_at,
    'image': article.image_url ? SITE_URL + article.image_url : undefined
  };
}

// Main pipeline
async function enrichAllArticles() {
  console.log('Loading articles from Supabase...');

  const { data: blogPosts, error: blogErr } = await supabase
    .from('blog_posts').select('*').eq('is_published', true)
    .order('updated_at', { ascending: false });
  if (blogErr) { console.error('Error loading blog posts:', blogErr.message); process.exit(1); }

  const { data: wellnessArticles, error: wellnessErr } = await supabase
    .from('wellness_articles').select('*').eq('is_published', true)
    .order('updated_at', { ascending: false });
  if (wellnessErr) { console.error('Error loading wellness articles:', wellnessErr.message); process.exit(1); }

  console.log('Loaded ' + blogPosts.length + ' blog posts, ' + wellnessArticles.length + ' wellness articles\n');

  const allArticles = [...blogPosts, ...wellnessArticles];
  const enrichedArticles = allArticles.map(enrichArticle);

  const withFaqs = enrichedArticles.filter(a => a.enriched.hasFAQs).length;
  const withProducts = enrichedArticles.filter(a => a.enriched.hasRelatedProducts).length;
  const avgKeywords = enrichedArticles.reduce((s, a) => s + a.enriched.semanticKeywords.length, 0) / enrichedArticles.length;

  console.log('Enrichment Results:');
  console.log('   Total articles: ' + enrichedArticles.length);
  console.log('   With generated FAQs: ' + withFaqs);
  console.log('   With related products: ' + withProducts);
  console.log('   Avg semantic keywords per article: ' + avgKeywords.toFixed(1));

  // Save enriched data
  const outputPath = path.join(ROOT_DIR, 'public/wellness-articles-cache.json');
  fs.writeFileSync(outputPath, JSON.stringify(enrichedArticles, null, 2), 'utf-8');
  console.log('\nSaved enriched data to ' + outputPath);

  // Generate schema JSON files
  const schemasDir = path.join(ROOT_DIR, 'public/.schemas');
  if (!fs.existsSync(schemasDir)) fs.mkdirSync(schemasDir, { recursive: true });

  for (const article of enrichedArticles) {
    const enriched = article.enriched;
    const slug = article.slug;

    const schema = {
      medical: buildEnrichedMedicalSchema(article, enriched),
      faq: buildFaqSchema(enriched.generatedFaqs),
      seo: {
        title: article.title,
        description: enriched.metaDescription,
        canonical: SITE_URL + '/articulos/' + slug,
        ogImage: article.image_url ? SITE_URL + article.image_url : SITE_URL + '/branding/social/og-image.png',
        ogType: 'article',
        articleTags: [article.category || 'Bienestar'],
        articleAuthor: 'Daniel Falcón',
        articlePublished: article.created_at
      },
      relatedProducts: enriched.relatedProducts.map(rp => ({ ...rp, url: SITE_URL + '/producto/' + rp.slug }))
    };

    fs.writeFileSync(path.join(schemasDir, slug + '.json'), JSON.stringify(schema, null, 2), 'utf-8');
  }

  console.log('Saved ' + enrichedArticles.length + ' schema files to ' + schemasDir);

  // Update Supabase with enriched taxonomy in the category field
  // Generates multiple categories as CSV: "Hígado Graso, Nutrición, Inmunidad"
  console.log('\nWriting enriched taxonomy to Supabase...');
  let updated = 0;
  const MAX_CATEGORY_LENGTH = 95;
  const tables = ['blog_posts', 'wellness_articles'];

  for (const article of enrichedArticles) {
    const taxonomy = generateTaxonomy(article);
    if (!taxonomy) continue;

    const value = taxonomy.length > MAX_CATEGORY_LENGTH
      ? taxonomy.substring(0, MAX_CATEGORY_LENGTH)
      : taxonomy;

    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .update({ category: value })
          .eq('slug', article.slug);
        if (error) {
          if (error.code === 'PGRST204') {
            // Row not found — fine, skip
          } else {
            console.error('  ❌ Failed to update ' + table + '/' + article.slug + ':', error.message);
          }
        } else {
          updated++;
        }
      } catch (err) {
        console.error('  ❌ Error updating ' + table + '/' + article.slug + ':', err.message);
      }
    }
  }
  console.log('Updated ' + updated + ' articles with taxonomy badges.\n');

  console.log('Done! All articles enriched.');
}

enrichAllArticles().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
