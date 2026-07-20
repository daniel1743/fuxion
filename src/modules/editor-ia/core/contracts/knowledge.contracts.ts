/**
 * BAIOS - Editor IA
 * Knowledge Contracts — Phase 1B
 * Knowledge base request/response interfaces. No implementations.
 */

import type { ScientificSourceType } from '../../types';

// ─── Knowledge Request ───────────────────────────────────────────────

export interface KnowledgeRequest {
  /** Topic to search in the knowledge base */
  topic: string;
  /** Maximum number of sources to retrieve */
  max_sources: number;
  /** Minimum evidence level required */
  min_evidence_level?: string;
  /** Filter by source type */
  source_types?: ScientificSourceType[];
}

// ─── Knowledge Response ──────────────────────────────────────────────

export interface KnowledgeResponse {
  /** Collection of evidence sources found */
  sources: EvidenceSource[];
  /** Total sources matching the query */
  total_found: number;
  /** Most relevant evidence category */
  top_category: string;
  /** Highest evidence level among results */
  highest_evidence_level: string;
}

// ─── Evidence Source ─────────────────────────────────────────────────

export interface EvidenceSource {
  /** Unique source identifier */
  id: string;
  /** Source type classification */
  type: ScientificSourceType;
  /** Publishing entity or author */
  entity: string;
  /** URL or DOI reference */
  url_doi: string;
  /** Evidence quality rating */
  evidence_level: string;
  /** Relevant excerpt or summary */
  excerpt: string;
  /** Publication year */
  year: number;
}

// ─── Citation Reference ──────────────────────────────────────────────

export interface CitationReference {
  /** Source identifier */
  source_id: string;
  /** Formatted citation text */
  citation_text: string;
  /** Position in the article where used */
  position: number;
  /** Source entity */
  entity: string;
  /** URL or DOI */
  url_doi: string;
}