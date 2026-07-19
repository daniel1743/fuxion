/**
 * Article enrichment engine — automatic SEO enhancement for wellness and blog articles.
 *
 * When an article is published to Supabase, this engine enriches it with:
 * - Auto-generated FAQs from content analysis
 * - HowTo schema for interventions/routines
 * - Semantic keywords extraction
 * - Related products mapping
 * - Article schema with all required fields
 *
 * Usage:
 *   import { enrichArticle, generateArticleSchema, generateFaqSchema, generateHowToSchema } from '@/lib/articleEnricher';
 *
 *   const enriched = enrichArticle(article, productCatalog, bibliography);
 *   // enriched now has: title, description, keywords, relatedProducts, faqs, howTos
 */

import { SITE_URL, STORE_NAME, getSeoProductBySlug } from './productSeo';

// ── Keyword mappings: medical conditions → Fuxion products ─────────────────────

const CONDITION_TO_PRODUCTS = {
  'estreñimiento': ['prunex-1', 'liquid-fiber', 'flora-liv'],
  'microbiota': ['flora-liv', 'prunex-1', 'liquid-fiber'],
  'intestino irritable': ['flora-liv', 'prunex-1', 'liquid-fiber'],
  'sibo': ['flora-liv', 'prunex-1'],
  'diarrea': ['flora-liv', 'liquid-fiber'],
  'digestión': ['prunex-1', 'flora-liv', 'liquid-fiber', 'rexet'],
  'hígado graso': ['rexet', 'flora-liv', 'prunex-1'],
  'hepático': ['rexet', 'flora-liv'],
  'depurativo': ['rexet', 'alpha-balance'],
  'peso': ['thermo-t3', 'nocarb-t', 'protein-active-fit', 'pack-5-14'],
  'obesidad': ['thermo-t3', 'nocarb-t', 'protein-active-fit'],
  'metabolismo': ['thermo-t3', 'nutraday'],
  'energía': ['vita-xtra-t-plus', 'nutraday', 'vitaenergia'],
  'fatiga': ['vita-xtra-t-plus', 'nutraday', 'vitaenergia'],
  'sueño': ['youth-elixir'],
  'insomnio': ['youth-elixir'],
  'estrés': ['no-stress', 'on'],
  'ansiedad': ['no-stress', 'on'],
  'cognitiva': ['on', 'no-stress'],
  'memoria': ['on', 'vita-xtra-t-plus'],
  'inmunológico': ['vera-plus', 'gano-plus-cappuccino'],
  'defensas': ['vera-plus', 'gano-plus-cappuccino'],
  'piel': ['beauty-in', 'youth-elixir'],
  'antienvejecimiento': ['beauty-in', 'youth-elixir'],
  'anti-edad': ['beauty-in', 'youth-elixir'],
  'articular': ['golden-flx'],
  'articulaciones': ['golden-flx'],
  'deporte': ['pre-sport-pro-edition', 'post-sport-pro-edition', 'bioprotein-active'],
  'recuperación': ['post-sport-pro-edition', 'bioprotein-active'],
  'músculo': ['bioprotein-active', 'protein-active-fit'],
  'hormonal': ['probal'],
  'hormonas': ['probal'],
  'diabetes': ['nocarb-t', 'thermo-t3'],
  'colesterol': ['beta-balance', 'golden-flx'],
};

// ── Condition keywords for matching ─────────────────────────────────────────────

const CONDITION_KEYWORDS = Object.keys(CONDITION_TO_PRODUCTS).map(k => k.toLowerCase());

/**
 * Detect which medical conditions are discussed in an article.
 */
function detectConditions(content) {
  const lower = content.toLowerCase();
  return CONDITION_KEYWORDS.filter(keyword => lower.includes(keyword));
}

/**
 * Get related products based on detected conditions.
 */
function getRelatedProducts(content) {
  const conditions = detectConditions(content);
  const productSlugs = new Set();
  conditions.forEach(condition => {
    CONDITION_TO_PRODUCTS[condition]?.forEach(slug => productSlugs.add(slug));
  });
  return [...productSlugs].map(slug => getSeoProductBySlug(slug)).filter(Boolean);
}

/**
 * Generate FAQs from wellness article content.
 * Uses the module's interventions to create structured Q&A pairs.
 */
function generateWellnessFAQs(module, interventionIndex) {
  const intervention = module.interventions?.[interventionIndex];
  if (!intervention) return [];

  const faqs = [];

  // Always generate a "What is" FAQ from the module title
  faqs.push({
    question: `¿Qué es ${module.title}?`,
    answer: module.pathophysiology || `La ${module.title.toLowerCase()} es un tema fundamental en el campo de la salud y el bienestar.`
  });

  // Generate "What is" FAQ for the specific intervention
  if (intervention.action) {
    faqs.push({
      question: `¿Qué es ${intervention.action}?`,
      answer: intervention.mechanism || `La ${intervention.action.toLowerCase()} es una intervención clave con evidencia de alto nivel.`
    });
  }

  // Generate "When to use" FAQ
  if (intervention.benefit_time) {
    faqs.push({
      question: `¿Cuándo se recomienda ${intervention.action}?`,
      answer: intervention.benefit_time
    });
  }

  // Generate "Errors to avoid" FAQ
  if (intervention.errors_alternatives) {
    faqs.push({
      question: `¿Cuáles son los errores comunes al aplicar ${intervention.action}?`,
      answer: intervention.errors_alternatives
    });
  }

  // Generate "Evidence level" FAQ
  if (intervention.impact_evidence) {
    faqs.push({
      question: `¿Qué nivel de evidencia tiene ${intervention.action}?`,
      answer: intervention.impact_evidence
    });
  }

  return faqs;
}

/**
 * Generate HowTo schema from a wellness intervention.
 */
function generateHowToSchema(module, intervention) {
  if (!intervention.action) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: intervention.action,
    description: module.title,
    step: [
      {
        '@type': 'HowToStep',
        name: 'Mecanismo de acción',
        text: intervention.mechanism || ''
      },
      {
        '@type': 'HowToStep',
        name: 'Beneficio esperado',
        text: intervention.benefit_time || ''
      },
      {
        '@type': 'HowToStep',
        name: 'Precauciones',
        text: intervention.errors_alternatives || ''
      }
    ]
  };
}

/**
 * Generate semantic keywords from article content.
 * Extracts entities, symptoms, treatments, and conditions.
 */
export function extractSemanticKeywords(content, category) {
  const keywords = new Set();

  if (category) {
    keywords.add(category.toLowerCase());
  }

  // Add condition keywords that appear in content
  detectConditions(content).forEach(condition => {
    keywords.add(condition);
    keywords.add(`${condition} en chile`);
    keywords.add(`${condition} síntomas`);
    keywords.add(`${condition} tratamiento`);
    keywords.add(`${condition} prevención`);
  });

  // Add generic wellness keywords
  keywords.add('nutrición');
  keywords.add('bienestar');
  keywords.add('salud natural');
  keywords.add('nutracéuticos');
  keywords.add('Fuxion');

  return [...keywords];
}

/**
 * Generate a meta description from content if not provided.
 */
function generateMetaDescription(content, title) {
  if (!content) return `${title} en Bienestar en Claro — información basada en evidencia.`;

  // Take the first 2 meaningful paragraphs (up to ~155 characters)
  const paragraphs = content.trim().split(/\n\s*\n/).filter(Boolean);
  if (paragraphs.length === 0) return `${title} en Bienestar en Claro — información basada en evidencia.`;

  let desc = paragraphs[0].trim();
  if (desc.length > 155) {
    desc = desc.substring(0, 152) + '...';
  }
  return desc;
}

/**
 * Generate a slug-friendly title for OG images.
 */
function generateOgImageTitle(title) {
  return title.replace(/[^a-zA-Z0-9áéíóúñÑüÜ\s]/g, '').trim();
}

/**
 * Main enrichment function — takes a raw article and returns enriched version.
 */
export function enrichArticle(article, productCatalog = [], bibliography = []) {
  const content = article.content || article.excerpt || '';
  const conditions = detectConditions(content);
  const relatedProducts = getRelatedProducts(content);
  const keywords = extractSemanticKeywords(content, article.category);
  const metaDescription = article.excerpt || generateMetaDescription(content, article.title);

  return {
    ...article,
    _enriched: {
      conditions,
      relatedProducts,
      keywords,
      metaDescription,
      ogImageTitle: generateOgImageTitle(article.title)
    }
  };
}

/**
 * Generate all schemas for a blog post (MedicalWebPage + Article + Breadcrumbs + FAQPage).
 */
export function generateArticleSchema(article, personSchema) {
  const schemas = [];

  // MedicalWebPage
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: article.title,
    description: article.excerpt,
    about: {
      '@type': 'MedicalCondition',
      name: article.category || 'Salud y Bienestar'
    },
    author: personSchema || {
      '@type': 'Person',
      name: 'Daniel Falcón',
      jobTitle: 'Investigador de Salud y Bienestar',
      url: `${SITE_URL}/sobre-nosotros`
    },
    publisher: {
      '@type': 'Organization',
      name: STORE_NAME,
      url: SITE_URL
    },
    datePublished: article.created_at || article.published_at,
    dateModified: article.updated_at || article.created_at,
    image: article.image_url ? `${SITE_URL}${article.image_url}` : undefined
  });

  // Article schema (for Google News)
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: {
      '@type': 'Person',
      name: article.author_name || 'Daniel Falcón',
      jobTitle: article.author_title || 'Investigador de Salud y Bienestar'
    },
    publisher: {
      '@type': 'Organization',
      name: STORE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icons/android-chrome-512x512.png`
      }
    },
    datePublished: article.created_at || article.published_at,
    dateModified: article.updated_at || article.created_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/articulos/${article.slug}`
    },
    image: article.image_url ? `${SITE_URL}${article.image_url}` : undefined
  });

  // WebArticle schema (additional metadata for rich results)
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebArticle',
    headline: article.title,
    datePublished: article.created_at || article.published_at,
    dateModified: article.updated_at || article.created_at,
    author: personSchema || {
      '@type': 'Person',
      name: 'Daniel Falcón',
      url: `${SITE_URL}/sobre-nosotros`
    },
    publisher: {
      '@type': 'Organization',
      name: STORE_NAME
    },
    articleSection: article.category,
    keywords: article.tags?.join(', ') || article.category
  });

  return schemas;
}

/**
 * Generate FAQPage schema from article content.
 * Parses "## Preguntas Frecuentes" sections in markdown.
 */
export function generateFaqSchema(content) {
  const faqSectionMatch = content?.match(/##\s+Preguntas Frecuentes([\s\S]*?)(?=\n##\s|$)/i);
  if (!faqSectionMatch) return null;

  const faqText = faqSectionMatch[1];
  const faqs = [];
  const matches = faqText.matchAll(/###\s+(.+?)\n([\s\S]*?)(?=\n###\s|$)/g);
  for (const match of matches) {
    const question = match[1].trim();
    const answer = match[2].trim().replace(/\n/g, ' ');
    faqs.push({ question, answer });
  }

  if (faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate HowTo schema from wellness article content.
 * Looks for numbered lists of interventions or steps.
 */
export function generateHowToSchemaFromContent(content) {
  // Look for intervention-style content (numbered lists with actions)
  const howTos = [];
  const interventionMatches = content?.matchAll(/(\d+)\.\s+(.+?)\n((?:^>\s+.+\n?)*(?:^\s+-\s+.+\n?)*)/gm);

  if (interventionMatches) {
    for (const match of interventionMatches) {
      const number = match[1];
      const action = match[2].trim();
      const body = match[3]?.trim();

      if (body) {
        howTos.push({
          '@type': 'HowTo',
          name: action,
          step: [
            { '@type': 'HowToStep', name: 'Acción', text: body }
          ]
        });
      }
    }
  }

  return howTos.length > 0 ? howTos : null;
}

/**
 * Build a complete SEO payload for a wellness article from the bible.
 */
export function buildWellnessArticleSeo(module, intervention, bibliography) {
  const faqs = generateWellnessFAQs(module, intervention.id - 1);
  const howTo = generateHowToSchema(module, intervention);

  return {
    title: `${intervention.action} — ${module.title}`,
    description: intervention.mechanism,
    keywords: extractSemanticKeywords(
      `${module.title} ${module.pathophysiology} ${intervention.action} ${intervention.mechanism}`,
      module.title
    ),
    faqs,
    howTo,
    bibliography: bibliography?.slice(0, 5) || [],
    conditions: detectConditions(module.title)
  };
}
