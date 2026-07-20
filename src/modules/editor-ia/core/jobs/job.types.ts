/**
 * BAIOS - Editor IA
 * Job Types — Phase 1C
 * All system processes represented as Jobs. No logic.
 */

import type { ContentFormat } from '../../types';

/** Union of all possible job types in the system */
export type JobType =
  | 'GENERATE_ARTICLE'
  | 'GENERATE_SERIES'
  | 'GENERATE_FAQ'
  | 'GENERATE_SOCIAL_POST'
  | 'GENERATE_IMAGE'
  | 'REVIEW_CONTENT'
  | 'QUALITY_CHECK'
  | 'SEO_OPTIMIZATION'
  | 'MEDIA_SELECTION'
  | 'SCHEDULE_PUBLICATION'
  | 'PUBLISH_CONTENT'
  | 'REINDEX_CONTENT'
  | 'UPDATE_ARTICLE'
  | 'CREATE_REPORT'
  | 'DIGITAL_TWIN_ANALYSIS';

/** Job lifecycle states */
export type JobState =
  | 'CREATED'
  | 'WAITING'
  | 'RUNNING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

/** Job priority levels */
export type JobPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

/** Base Job contract — every system job extends this */
export interface Job {
  /** Unique job identifier */
  id: string;
  /** Human-readable label */
  label: string;
  /** Job classification */
  type: JobType;
  /** Current lifecycle state */
  state: JobState;
  /** Execution priority */
  priority: JobPriority;
  /** Parent job ID (for sub-jobs) */
  parent_id: string | null;
  /** ISO-8601 creation timestamp */
  created_at: string;
  /** ISO-8601 start timestamp */
  started_at: string | null;
  /** ISO-8601 completion timestamp */
  completed_at: string | null;
  /** Error details if failed */
  error: string | null;
  /** Arbitrary metadata */
  metadata: Record<string, unknown>;
}

/** Content generation job specifics */
export interface ContentJobSpec extends Job {
  type:
    | 'GENERATE_ARTICLE'
    | 'GENERATE_SERIES'
    | 'GENERATE_FAQ'
    | 'GENERATE_SOCIAL_POST';
  topic: string;
  format: ContentFormat;
  target_audience: string;
  keywords: string[];
}

/** Review job specifics */
export interface ReviewJobSpec extends Job {
  type: 'REVIEW_CONTENT' | 'QUALITY_CHECK';
  target_job_id: string;
  review_criteria: string[];
}

/** SEO job specifics */
export interface SEOJobSpec extends Job {
  type: 'SEO_OPTIMIZATION';
  target_job_id: string;
  target_keywords: string[];
}

/** Media job specifics */
export interface MediaJobSpec extends Job {
  type: 'MEDIA_SELECTION' | 'GENERATE_IMAGE';
  target_job_id: string;
  asset_count: number;
}

/** Publication job specifics */
export interface PublicationJobSpec extends Job {
  type: 'SCHEDULE_PUBLICATION' | 'PUBLISH_CONTENT';
  target_job_id: string;
  channel: string;
  scheduled_at: string;
}

/** Maintenance job specifics */
export interface MaintenanceJobSpec extends Job {
  type: 'REINDEX_CONTENT' | 'UPDATE_ARTICLE';
  target_job_id: string;
  reason: string;
}

/** Report job specifics */
export interface ReportJobSpec extends Job {
  type: 'CREATE_REPORT' | 'DIGITAL_TWIN_ANALYSIS';
  report_type: string;
  parameters: Record<string, unknown>;
}