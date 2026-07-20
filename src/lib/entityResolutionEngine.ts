/**
 * Hybrid Entity Resolution Engine
 * Combina 4 estrategias de clasificación en cascada:
 * 1. Exact Match (taxonomía)
 * 2. Synonym Resolution (sinónimos)
 * 3. Lexical Fallback (keyword matching con pesos)
 * 4. Embeddings (futuro, opcional)
 */

import { supabase } from '@/lib/supabaseClient';

// =============================================
// INTERFACES
// =============================================

export interface ClassificationResult {
  primaryNode: TaxonomyNode;
  confidence: number;
  detectedEntities: DetectedEntity[];
  taxonomyNodes: TaxonomyNode[];
  algorithm: string;
  scores: ScoreBreakdown[];
}

export interface TaxonomyNode {
  id: string;
  name: string;
  slug: string;
  level: number;
  parentId: string | null;
  description: string;
  relatedEntities: string[];
  relatedProducts: string[];
  childTopics: string[];
  evidenceLevel: string;
  contentCount: number;
  searchVolume: number;
  createdAt: string;
  updatedAt: string;
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  synonyms: string[];
  aliases: string[];
  medicalTerms: string[];
  popularTerms: string[];
  scientificTerms: string[];
  parentId: string | null;
  taxonomyNodeIds: string[];
  confidence: number;
  evidenceLevel: string;
  properties: Record<string, string | number | boolean>;
}

export interface DetectedEntity {
  entityId: string;
  entityType: string;
  name: string;
  score: number;
  matches: Match[];
}

export interface Match {
  source: 'title' | 'heading' | 'content' | 'synonym' | 'lexical';
  term: string;
  strength: number;
}

export interface ScoreBreakdown {
  source: string;
  weight: number;
  rawScore: number;
  weightedScore: number;
}

// =============================================
// PESOS POR FUENTE DE COINCIDENCIA
// =============================================
const SOURCE_WEIGHTS = {
  title: 0.40,
  heading: 0.20,
  content_first_200: 0.15,
  content_rest: 0.05,
  synonym: 0.10,
  co_occurring_entities: 0.05,
  embedding_semantic: 0.05, // Futuro
};

// =============================================
// MULTIPLICADORES POR POSICIÓN
// =============================================
const POSITION_MULTIPLIERS = {
  title: 2.0,
  first_paragraph: 1.5,
  headings: 1.3,
  body: 1.0,
  disclaimer_footer: 0.1,
};

// =============================================
// UMBRALES ADAPTATIVOS POR TIPO DE CONTENIDO
// =============================================
const CONFIDENCE_THRESHOLDS = {
  medical_article: 0.90, // Cirrosis, cáncer
  wellness_article: 0.75, // Nutrición, ejercicio
  informational_article: 0.60, // Qué es X
  opinion_article: 0.50,
};

// =============================================
// MOTOR DE CLASIFICACIÓN
// =============================================

export class HybridEntityResolutionEngine {
  private taxonomyCache: Map<string, TaxonomyNode> = new Map();
  private entitiesCache: Map<string, Entity> = new Map();

  /**
   * Clasifica un artículo usando el motor híbrido.
   */
  async classifyArticle(article: {
    title: string;
    headings: string[];
    content: string;
    contentType?: 'medical' | 'wellness' | 'informational' | 'opinion';
  }): Promise<ClassificationResult> {
    const threshold = CONFIDENCE_THRESHOLDS[article.contentType || 'wellness'];

    // Paso 1: Exact Match
    const exactMatch = await this.exactMatch(article.title, article.headings);
    if (exactMatch) {
      return {
        ...exactMatch,
        algorithm: 'exact_match',
        scores: [{
          source: 'title_exact',
          weight: 1.0,
          rawScore: exactMatch.confidence,
          weightedScore: exactMatch.confidence,
        }],
      };
    }

    // Paso 2: Synonym Resolution
    const synonymMatch = await this.synonymResolution(article.title, article.content);
    if (synonymMatch) {
      return {
        ...synonymMatch,
        algorithm: 'synonym_resolution',
        scores: [{
          source: 'synonym_title',
          weight: 0.95,
          rawScore: synonymMatch.confidence,
          weightedScore: synonymMatch.confidence * 0.95,
        }],
      };
    }

    // Paso 3: Lexical Fallback
    const lexicalMatch = await this.lexicalFallback(article);
    return lexicalMatch;
  }

  /**
   * Paso 1: Exact Match contra la taxonomía
   */
  private async exactMatch(title: string, headings: string[]): Promise<ClassificationResult | null> {
    const taxonomy = await this.getFullTaxonomy();

    for (const node of taxonomy) {
      if (this.fuzzyMatch(title.toLowerCase(), node.slug.toLowerCase())) {
        return this.buildResult(node, 0.95);
      }
      for (const heading of headings) {
        if (this.fuzzyMatch(heading.toLowerCase(), node.slug.toLowerCase())) {
          return this.buildResult(node, 0.90);
        }
      }
    }
    return null;
  }

  /**
   * Paso 2: Resolución de sinónimos
   */
  private async synonymResolution(title: string, content: string): Promise<ClassificationResult | null> {
    const entities = await this.getAllEntities();
    const text = `${title} ${content}`.toLowerCase();

    for (const entity of entities) {
      const allTerms = [...entity.synonyms, ...entity.aliases, ...entity.popularTerms];
      for (const term of allTerms) {
        if (text.includes(term.toLowerCase())) {
          const taxonomyNodes = entity.taxonomyNodeIds.map(id => {
            return taxonomyCache.get(id);
          }).filter(Boolean) as TaxonomyNode[];

          if (taxonomyNodes.length > 0) {
            return this.buildResult(taxonomyNodes[0], entity.confidence * 0.95);
          }
        }
      }
    }
    return null;
  }

  /**
   * Paso 3: Fallback léxico con pesos
   */
  private async lexicalFallback(article: {
    title: string;
    headings: string[];
    content: string;
  }): Promise<ClassificationResult> {
    const taxonomy = await this.getFullTaxonomy();
    const entities = await this.getAllEntities();

    const scores: ScoreBreakdown[] = [];
    let bestScore = 0;
    let bestNode: TaxonomyNode | null = null;

    for (const node of taxonomy) {
      let score = 0;

      // Título
      if (article.title.toLowerCase().includes(node.name.toLowerCase())) {
        score += SOURCE_WEIGHTS.title * POSITION_MULTIPLIERS.title;
      }

      // Heading
      for (const heading of article.headings) {
        if (heading.toLowerCase().includes(node.name.toLowerCase())) {
          score += SOURCE_WEIGHTS.heading * POSITION_MULTIPLIERS.headings;
        }
      }

      // Contenido (primeras 200 palabras)
      const first200 = article.content.split(' ').slice(0, 200).join(' ');
      if (first200.toLowerCase().includes(node.name.toLowerCase())) {
        score += SOURCE_WEIGHTS.content_first_200 * POSITION_MULTIPLIERS.first_paragraph;
      }

      // Contenido restante
      const rest = article.content.split(' ').slice(200).join(' ');
      if (rest.toLowerCase().includes(node.name.toLowerCase())) {
        score += SOURCE_WEIGHTS.content_rest * POSITION_MULTIPLIERS.body;
      }

      // Factores de entidad co-ocurrente
      const entityMatches = entities.filter(e =>
        node.relatedEntities.includes(e.id)
      ).length;
      score += (entityMatches / entities.length) * SOURCE_WEIGHTS.co_occurring_entities;

      scores.push({
        source: node.slug,
        weight: 1.0,
        rawScore: score,
        weightedScore: score,
      });

      if (score > bestScore) {
        bestScore = score;
        bestNode = node;
      }
    }

    // Normalizar confianza
    const normalizedScore = Math.min(bestScore, 1.0);
    const finalConfidence = normalizedScore * (1 + scores.length * 0.1);

    return {
      primaryNode: bestNode || taxonomy[0],
      confidence: finalConfidence,
      detectedEntities: [],
      taxonomyNodes: [bestNode || taxonomy[0]],
      algorithm: 'lexical_fallback',
      scores,
    };
  }

  /**
   * Construye el resultado de clasificación
   */
  private buildResult(node: TaxonomyNode, confidence: number): ClassificationResult {
    return {
      primaryNode: node,
      confidence,
      detectedEntities: [],
      taxonomyNodes: [node],
      algorithm: 'unknown',
      scores: [],
    };
  }

  // =============================================
  // MÉTODOS AUXILIARES
  // =============================================

  private fuzzyMatch(text: string, pattern: string): boolean {
    // Levstein distance simplificada para fuzzy matching
    const threshold = 0.8;
    const similarity = this.stringSimilarity(text, pattern);
    return similarity >= threshold;
  }

  private stringSimilarity(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;

    const edits = this.levenshteinDistance(longer, shorter);
    return (longer.length - edits) / longer.length;
  }

  private levenshteinDistance(s1: string, s2: string): number {
    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  private async getFullTaxonomy(): Promise<TaxonomyNode[]> {
    if (this.taxonomyCache.size === 0) {
      const { data } = await supabase.from('taxonomy').select('*');
      if (data) {
        for (const node of data) {
          this.taxonomyCache.set(node.id, node);
        }
      }
    }
    return Array.from(this.taxonomyCache.values());
  }

  private async getAllEntities(): Promise<Entity[]> {
    if (this.entitiesCache.size === 0) {
      const { data } = await supabase.from('entities').select('*');
      if (data) {
        for (const entity of data) {
          this.entitiesCache.set(entity.id, entity);
        }
      }
    }
    return Array.from(this.entitiesCache.values());
  }
}

// =============================================
// INSTANCIA GLOBAL
// =============================================
export const entityResolutionEngine = new HybridEntityResolutionEngine();
