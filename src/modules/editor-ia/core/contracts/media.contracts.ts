/**
 * BAIOS - Editor IA
 * Media Contracts — Phase 1B
 * No implementations.
 */

import type { MediaClassification } from '../../types';

// ─── Media Request ───────────────────────────────────────────────────

export interface MediaRequest {
  job_id: string;
  article_topic: string;
  required_count: number;
  preferred_classifications?: MediaClassification[];
}

// ─── Media Selection ─────────────────────────────────────────────────

export interface MediaSelection {
  selection_id: string;
  job_id: string;
  assets: MediaRecommendation[];
  total_selected: number;
  created_at: string;
}

// ─── Media Recommendation ────────────────────────────────────────────

export interface MediaRecommendation {
  asset_id: string;
  classification: MediaClassification;
  alt_text: string;
  url: string;
  relevance_score: number;
  reason: string;
}