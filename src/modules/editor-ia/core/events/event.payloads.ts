/**
 * BAIOS - Editor IA
 * Event Payloads — Phase 1B
 * Payload contracts for each editor event. No logic.
 */

import type { ContentJob, DraftArticle, MediaAsset } from '../../types';

// ─── Content Job Created ─────────────────────────────────────────────

export interface ContentJobCreatedPayload {
  job: ContentJob;
}

// ─── Knowledge Retrieved ─────────────────────────────────────────────

export interface KnowledgeRetrievedPayload {
  job_id: string;
  sources_found: number;
  top_category: string;
}

// ─── Outline Generated ───────────────────────────────────────────────

export interface OutlineGeneratedPayload {
  job_id: string;
  sections_count: number;
  estimated_reading_minutes: number;
}

// ─── Article Generated ───────────────────────────────────────────────

export interface ArticleGeneratedPayload {
  draft: DraftArticle;
  word_count: number;
}

// ─── SEO Completed ───────────────────────────────────────────────────

export interface SeoCompletedPayload {
  job_id: string;
  seo_score: number;
  keywords_matched: number;
}

// ─── Media Selected ──────────────────────────────────────────────────

export interface MediaSelectedPayload {
  job_id: string;
  assets: MediaAsset[];
}

// ─── Quality Review Completed ────────────────────────────────────────

export interface QualityReviewCompletedPayload {
  job_id: string;
  quality_score: number;
  passed: boolean;
  issues: string[];
}

// ─── Editor Approved ─────────────────────────────────────────────────

export interface EditorApprovedPayload {
  job_id: string;
  approved_by: string;
  notes: string;
}

// ─── Job Scheduled ───────────────────────────────────────────────────

export interface JobScheduledPayload {
  job_id: string;
  scheduled_at: string;
  channel: string;
}

// ─── Article Published ───────────────────────────────────────────────

export interface ArticlePublishedPayload {
  job_id: string;
  published_url: string;
  published_at: string;
}

// ─── Job Failed ──────────────────────────────────────────────────────

export interface JobFailedPayload {
  job_id: string;
  error_code: string;
  error_message: string;
  failed_at_stage: string;
}

// ─── Payload Map ─────────────────────────────────────────────────────

export interface EditorEventPayloadMap {
  'editor:content-job:created': ContentJobCreatedPayload;
  'editor:knowledge:retrieved': KnowledgeRetrievedPayload;
  'editor:outline:generated': OutlineGeneratedPayload;
  'editor:article:generated': ArticleGeneratedPayload;
  'editor:seo:completed': SeoCompletedPayload;
  'editor:media:selected': MediaSelectedPayload;
  'editor:quality-review:completed': QualityReviewCompletedPayload;
  'editor:approval:approved': EditorApprovedPayload;
  'editor:job:scheduled': JobScheduledPayload;
  'editor:article:published': ArticlePublishedPayload;
  'editor:job:failed': JobFailedPayload;
}