/**
 * Servicio de Enriquecimiento de Artículos
 * Integra el Knowledge Graph, taxonomía y motor de clasificación
 */

import { supabase } from '@/lib/supabaseClient';
import { entityResolutionEngine } from './entityResolutionEngine';

export interface EnrichedArticle {
  articleId: string;
  detectedEntities: DetectedEntity[];
  primaryTaxonomyNode: TaxonomyNode;
  semanticKeywords: string[];
  faqs: FAQ[];
  relatedProducts: ProductMatch[];
  seoSchema: Record<string, unknown>;
  enrichmentScore: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface DetectedEntity {
  entityId: string;
  entityType: string;
  name: string;
  score: number;
}

export interface TaxonomyNode {
  id: string;
  name: string;
  slug: string;
  level: number;
  parentId: string | null;
}

export interface FAQ {
  question: string;
  answer: string;
  source: 'entity' | 'intent' | 'bibliography';
}

export interface ProductMatch {
  productId: string;
  productName: string;
  matchReason: string;
  matchStrength: number;
  confidence: number;
}

/**
 * Enriquece un artículo completo
 */
export async function enrichArticle(article: {
  id: string;
  title: string;
  headings: string[];
  content: string;
  contentType?: 'medical' | 'wellness' | 'informational' | 'opinion';
}): Promise<EnrichedArticle> {
  // 1. Clasificación
  const classification = await entityResolutionEngine.classifyArticle(article);

  // 2. Extracción de entidades
  const entities = await extractEntities(article);

  // 3. Generación de FAQs
  const faqs = await generateFAQs(article, classification.primaryNode);

  // 4. Match de productos
  const products = await matchProducts(classification.primaryNode, entities);

  // 5. Keywords semánticos
  const keywords = extractSemanticKeywords(article);

  // 6. Score de enriquecimiento
  const enrichmentScore = calculateEnrichmentScore(entities, faqs, products, keywords);

  // 7. Generar schemas JSON-LD
  const seoSchema = generateSEOSchema(article, classification.primaryNode, entities, faqs);

  return {
    articleId: article.id,
    detectedEntities: entities,
    primaryTaxonomyNode: classification.primaryNode,
    semanticKeywords: keywords,
    faqs,
    relatedProducts: products,
    seoSchema,
    enrichmentScore,
    status: 'completed',
  };
}

/**
 * Extrae entidades del artículo
 */
async function extractEntities(article: {
  title: string;
  headings: string[];
  content: string;
}): Promise<DetectedEntity[]> {
  const { data: entities } = await supabase
    .from('entities')
    .select('*')
    .limit(50);

  if (!entities) return [];

  const detected: DetectedEntity[] = [];
  const text = `${article.title} ${article.headings.join(' ')} ${article.content}`.toLowerCase();

  for (const entity of entities) {
    const allTerms = [...entity.synonyms, ...entity.aliases, ...entity.popularTerms];
    let score = 0;

    for (const term of allTerms) {
      if (text.includes(term.toLowerCase())) {
        score += 0.3;
      }
    }

    // Boost por posición
    if (article.title.toLowerCase().includes(entity.name.toLowerCase())) {
      score += 0.5;
    }

    if (score > 0.5) {
      detected.push({
        entityId: entity.id,
        entityType: entity.type,
        name: entity.name,
        score,
      });
    }
  }

  return detected.sort((a, b) => b.score - a.score);
}

/**
 * Genera FAQs inteligentes desde 3 fuentes
 */
async function generateFAQs(article: {
  title: string;
  headings: string[];
  content: string;
}, taxonomyNode: TaxonomyNode): Promise<FAQ[]> {
  const faqs: FAQ[] = [];

  // Fuente A: Preguntas de la entidad madre
  const entityFaqs = await getEntityFAQs(taxonomyNode);
  faqs.push(...entityFaqs.map(f => ({ ...f, source: 'entity' as const })));

  // Fuente B: Preguntas de intención
  const intentFaqs = generateIntentFAQs(article.title, article.headings);
  faqs.push(...intentFaqs.map(f => ({ ...f, source: 'intent' as const })));

  // Fuente C: Preguntas de bibliografía (si hay estudios citados)
  const biblioFaqs = await getBibliographyFAQs(article.content);
  faqs.push(...biblioFaqs.map(f => ({ ...f, source: 'bibliography' as const })));

  // Eliminar duplicados y limitar
  const seen = new Set<string>();
  return faqs.filter(faq => {
    const key = faq.question.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 10);
}

/**
 * Genera FAQs basadas en intención de búsqueda
 */
function generateIntentFAQs(title: string, headings: string[]): FAQ[] {
  const faqs: FAQ[] = [];

  // Preguntas informativas básicas
  if (title.toLowerCase().includes('qué es') || title.toLowerCase().includes('qué significa')) {
    faqs.push({
      question: `¿Qué es ${title.replace('¿Qué es ', '').replace('¿Qué significa ', '')}?`,
      answer: 'Definición basada en el contenido del artículo.',
      source: 'intent',
    });
  }

  // Preguntas de síntomas
  faqs.push({
    question: '¿Cuáles son los síntomas principales?',
    answer: 'Los síntomas varían según la condición, pero generalmente incluyen fatiga, malestar y signos específicos.',
    source: 'intent',
  });

  // Preguntas de tratamiento
  faqs.push({
    question: '¿Cómo se trata?',
    answer: 'El tratamiento depende del diagnóstico específico. Consulte siempre con un profesional de salud.',
    source: 'intent',
  });

  // Preguntas de prevención
  faqs.push({
    question: '¿Cómo se puede prevenir?',
    answer: 'La prevención incluye hábitos saludables como ejercicio, alimentación balanceada y descanso adecuado.',
    source: 'intent',
  });

  return faqs;
}

/**
 * Busca FAQs en la bibliografía del artículo
 */
async function getBibliographyFAQs(content: string): Promise<FAQ[]> {
  // TODO: Buscar en la biblia_bienestar.json si hay preguntas relacionadas
  return [];
}

/**
 * Busca FAQs de la entidad en la taxonomía
 */
async function getEntityFAQs(taxonomyNode: TaxonomyNode): Promise<FAQ[]> {
  // TODO: Buscar en la biblia_bienestar.json las intervenciones relacionadas
  return [];
}

/**
 * Match de productos basados en el Knowledge Graph
 */
async function matchProducts(taxonomyNode: TaxonomyNode, entities: DetectedEntity[]): Promise<ProductMatch[]> {
  const { data: relations } = await supabase
    .from('relations')
    .select('*')
    .in('to_entity', entities.map(e => e.entityId))
    .eq('type', 'treats')
    .gte('strength', 0.6);

  if (!relations) return [];

  const { data: products } = await supabase
    .from('entities')
    .select('*')
    .in('id', relations.map(r => r.from_entity));

  return (products || [])
    .filter(p => p.type === 'product')
    .map(p => ({
      productId: p.id,
      productName: p.name,
      matchReason: `Relacionado con ${entities.find(e => e.entityId === p.parent_id)?.name || taxonomyNode.name}`,
      matchStrength: 0.7,
      confidence: 0.7,
    }))
    .slice(0, 5);
}

/**
 * Extrae keywords semánticos del artículo
 */
function extractSemanticKeywords(article: {
  title: string;
  headings: string[];
  content: string;
}): string[] {
  const text = `${article.title} ${article.headings.join(' ')} ${article.content}`.toLowerCase();
  const stopwords = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'y', 'o',
    'que', 'es', 'al', 'lo', 'como', 'más', 'con', 'para', 'por', 'su',
    'sus', 'se', 'no', 'si', 'me', 'mi', 'tu', 'tu', 'nos', 'os',
    'yo', 'él', 'ella', 'usted', 'ellos', 'ellas', 'vosotros',
  ]);

  const words = text.split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w));

  const freq: Record<string, number> = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

/**
 * Calcula el score de enriquecimiento
 */
function calculateEnrichmentScore(
  entities: DetectedEntity[],
  faqs: FAQ[],
  products: ProductMatch[],
  keywords: string[]
): number {
  const entityScore = Math.min(entities.length / 5, 1.0) * 0.3;
  const faqScore = Math.min(faqs.length / 5, 1.0) * 0.3;
  const productScore = Math.min(products.length / 3, 1.0) * 0.2;
  const keywordScore = Math.min(keywords.length / 15, 1.0) * 0.2;

  return entityScore + faqScore + productScore + keywordScore;
}

/**
 * Genera schemas JSON-LD
 */
function generateSEOSchema(
  article: { title: string; headings: string[]; content: string },
  taxonomyNode: TaxonomyNode,
  entities: DetectedEntity[],
  faqs: FAQ[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: article.title,
    description: article.content.slice(0, 200),
    about: {
      '@type': 'MedicalCondition',
      name: taxonomyNode.name,
    },
    author: {
      '@type': 'Person',
      name: 'Daniel Falcón',
      jobTitle: 'Investigador de Salud y Bienestar',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bienestar en Claro',
    },
    datePublished: new Date().toISOString(),
    image: article.headings[0] ? undefined : undefined,
  };
}
