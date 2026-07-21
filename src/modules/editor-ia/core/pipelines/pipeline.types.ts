/**
 * BAIOS - Editor IA
 * Pipeline Types — Phase 1B
 * Pipeline contracts only. No implementations.
 */

import type { ContentJob, DraftArticle, ContentFormat } from '../../types';
import type { EditorState } from '../state-machine/editor.states';
import type { BaseError } from '../errors/base.error';

// ─── Pipeline Stage ──────────────────────────────────────────────────

export type PipelineStageStatus =
  | 'IDLE'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED';

export interface PipelineStageResult {
  stage: string;
  status: PipelineStageStatus;
  started_at: string;
  completed_at: string | null;
  error: BaseError | null;
  metadata: Record<string, unknown>;
}

// ─── Pipeline Context ────────────────────────────────────────────────

export interface PipelineContext {
  pipeline_id: string;
  job: ContentJob;
  stages: PipelineStageResult[];
  current_stage: string;
  traceId: string;
  warnings?: string[];
}

// ─── Knowledge Pipeline ──────────────────────────────────────────────

export interface KnowledgePipelineInput {
  job: ContentJob;
  topic: string;
  max_sources: number;
}

export interface KnowledgePipelineOutput {
  sources_found: number;
  top_category: string;
  evidence_level: string;
}

// ─── Editorial Pipeline ──────────────────────────────────────────────

export interface EditorialPipelineInput {
  job: ContentJob;
  knowledge_sources: string[];
  target_word_count: number;
}

export interface EditorialPipelineOutput {
  outline_sections: string[];
  estimated_reading_minutes: number;
  tone: string;
}

// ─── Generation Pipeline ─────────────────────────────────────────────

export interface GenerationPipelineInput {
  job: ContentJob;
  outline: string[];
  format: ContentFormat;
  target_audience: string;
}

export interface GenerationPipelineOutput {
  draft: DraftArticle;
  word_count: number;
  citations_included: number;
}

// ─── SEO Pipeline ────────────────────────────────────────────────────

export interface SEOPipelineInput {
  job: ContentJob;
  draft: DraftArticle;
  target_keywords: string[];
}

export interface SEOPipelineOutput {
  seo_score: number;
  keywords_matched: number;
  suggestions: string[];
}

// ─── Media Pipeline ──────────────────────────────────────────────────

export interface MediaPipelineInput {
  job: ContentJob;
  article_topic: string;
  required_assets: number;
}

export interface MediaPipelineOutput {
  assets_selected: number;
  classifications_used: string[];
}

// ─── Quality Pipeline ────────────────────────────────────────────────

export interface QualityPipelineInput {
  job: ContentJob;
  draft: DraftArticle;
  minimum_score: number;
}

export interface QualityPipelineOutput {
  quality_score: number;
  passed: boolean;
  issues: string[];
  recommendations: string[];
}

// ─── Publication Pipeline ────────────────────────────────────────────

export interface PublicationPipelineInput {
  job: ContentJob;
  channel: string;
  publish_at: string;
}

export interface PublicationPipelineOutput {
  published: boolean;
  url: string;
  published_at: string;
}

// ─── Pipeline Registry ───────────────────────────────────────────────

export interface PipelineDefinition {
  name: string;
  description: string;
  from_state: EditorState;
  to_state: EditorState;
  stages: string[];
}

export const PIPELINE_REGISTRY: Record<string, PipelineDefinition> = {
  knowledge: {
    name: 'KnowledgePipeline',
    description: 'Recupera y verifica fuentes científicas para el contenido',
    from_state: 'DRAFT',
    to_state: 'KNOWLEDGE_READY',
    stages: ['fetch_sources', 'validate_evidence', 'categorize_knowledge'],
  },
  editorial: {
    name: 'EditorialPipeline',
    description: 'Genera el esquema editorial basado en el conocimiento',
    from_state: 'KNOWLEDGE_READY',
    to_state: 'OUTLINE_READY',
    stages: ['analyze_topic', 'build_outline', 'estimate_reading_time'],
  },
  generation: {
    name: 'GenerationPipeline',
    description: 'Genera el contenido del artículo usando IA',
    from_state: 'OUTLINE_READY',
    to_state: 'CONTENT_READY',
    stages: ['generate_sections', 'insert_citations', 'polish_draft'],
  },
  seo: {
    name: 'SEOPipeline',
    description: 'Optimiza el contenido para motores de búsqueda',
    from_state: 'CONTENT_READY',
    to_state: 'SEO_READY',
    stages: ['extract_keywords', 'optimize_metadata', 'score_content'],
  },
  media: {
    name: 'MediaPipeline',
    description: 'Selecciona y clasifica activos multimedia',
    from_state: 'SEO_READY',
    to_state: 'MEDIA_READY',
    stages: ['analyze_content', 'select_assets', 'classify_media'],
  },
  quality: {
    name: 'QualityPipeline',
    description: 'Verifica calidad editorial y cumplimiento de estándares',
    from_state: 'MEDIA_READY',
    to_state: 'QUALITY_READY',
    stages: ['check_sections', 'validate_citations', 'score_quality'],
  },
  publication: {
    name: 'PublicationPipeline',
    description: 'Publica el contenido en los canales configurados',
    from_state: 'APPROVED',
    to_state: 'PUBLISHED',
    stages: ['queue_job', 'schedule_publication', 'publish_content'],
  },
} as const;