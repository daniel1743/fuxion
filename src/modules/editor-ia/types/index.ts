/**
 * BAIOS - Editor IA Types
 * Phase 1: AI Editor Skeleton
 * DO NOT MODIFY without explicit approval from System Architecture.
 */

// ─── Scientific Source ────────────────────────────────────────────────

export type ScientificSourceType =
  | 'STUDY'
  | 'CLINICAL_GUIDELINE'
  | 'META_ANALYSIS';

export interface ScientificSource {
  id: string; // UUID
  type: ScientificSourceType;
  entity: string;
  url_doi: string;
  evidence_level: string;
}

// ─── Content Job ──────────────────────────────────────────────────────

export type ContentFormat =
  | 'ARTICLE'
  | 'REPORT'
  | 'FAQ'
  | 'SOCIAL_MEDIA';

export type JobStatus =
  | 'DRAFT'
  | 'AI_REVIEW'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED';

export interface ContentJob {
  id: string; // UUID
  topic: string;
  format: ContentFormat;
  target_audience: string;
  status: JobStatus;
}

// ─── Draft Article ────────────────────────────────────────────────────

export interface DraftArticle {
  id: string; // UUID
  job_id: string; // UUID
  title: string;
  body: string;
  scientific_citations: string[];
  quality_score: number | null;
}

// ─── Media Asset ──────────────────────────────────────────────────────

export type MediaClassification =
  | 'ORGAN'
  | 'PERSON'
  | 'INFOGRAPHIC'
  | 'CHART';

export interface MediaAsset {
  id: string; // UUID
  article_id: string; // UUID
  classification: MediaClassification;
  alt_text: string;
  url: string;
}

// ─── Provider Abstraction ─────────────────────────────────────────────

export type AIProvider = 'CLAUDE' | 'OPENAI' | 'GEMINI' | 'DEEPSEEK' | 'LLAMA';

export interface ProviderConfig {
  provider: AIProvider;
  api_key?: string;
  endpoint?: string;
  model?: string;
  options?: Record<string, unknown>;
}

// ─── Editor Dashboard State ───────────────────────────────────────────

export type EditorView =
  | 'dashboard'
  | 'knowledge-base'
  | 'editorial-engine'
  | 'media-manager'
  | 'queue-system'
  | 'publisher';

export interface EditorDashboardState {
  activeView: EditorView;
  sidebarCollapsed: boolean;
}
