/**
 * BAIOS - Editor IA
 * Workflow Types — Phase 1B
 * Workflow contracts only. No implementations.
 */

import type { ContentJob, DraftArticle, ContentFormat } from '../../types';
import type { EditorState } from '../state-machine/editor.states';

// ─── Workflow Status ─────────────────────────────────────────────────

export type WorkflowStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

// ─── Base Workflow Context ───────────────────────────────────────────

export interface WorkflowContext {
  workflow_id: string;
  job: ContentJob;
  current_state: EditorState;
  status: WorkflowStatus;
  started_at: string;
  completed_at: string | null;
  error: string | null;
}

// ─── Generate Series Workflow ────────────────────────────────────────

export interface GenerateSeriesRequest {
  topic: string;
  count: number;
  formats: ContentFormat[];
  target_audience: string;
}

export interface GenerateSeriesResult {
  jobs_created: ContentJob[];
  series_id: string;
}

export interface GenerateSeriesContext extends WorkflowContext {
  request: GenerateSeriesRequest;
  result: GenerateSeriesResult | null;
}

// ─── Generate Article Workflow ───────────────────────────────────────

export interface GenerateArticleRequest {
  job_id: string;
  topic: string;
  format: ContentFormat;
  target_audience: string;
}

export interface GenerateArticleResult {
  draft: DraftArticle;
  knowledge_sources_used: number;
  outline_sections: number;
}

export interface GenerateArticleContext extends WorkflowContext {
  request: GenerateArticleRequest;
  result: GenerateArticleResult | null;
}

// ─── Editorial Review Workflow ───────────────────────────────────────

export interface EditorialReviewRequest {
  job_id: string;
  draft: DraftArticle;
  reviewer_notes: string;
}

export interface EditorialReviewResult {
  approved: boolean;
  changes_requested: string[];
  final_quality_score: number;
}

export interface EditorialReviewContext extends WorkflowContext {
  request: EditorialReviewRequest;
  result: EditorialReviewResult | null;
}

// ─── Schedule Publication Workflow ───────────────────────────────────

export interface SchedulePublicationRequest {
  job_id: string;
  scheduled_at: string;
  channel: string;
  retry_on_failure: boolean;
}

export interface SchedulePublicationResult {
  scheduled: boolean;
  publication_id: string;
  scheduled_at: string;
}

export interface SchedulePublicationContext extends WorkflowContext {
  request: SchedulePublicationRequest;
  result: SchedulePublicationResult | null;
}

// ─── Publish Workflow ────────────────────────────────────────────────

export interface PublishRequest {
  job_id: string;
  channel: string;
  publish_immediately: boolean;
}

export interface PublishResult {
  published: boolean;
  url: string;
  published_at: string;
}

export interface PublishContext extends WorkflowContext {
  request: PublishRequest;
  result: PublishResult | null;
}