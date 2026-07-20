/**
 * BAIOS - Editor IA
 * Publication Contracts — Phase 1B
 * No implementations.
 */

// ─── Publication Request ─────────────────────────────────────────────

export interface PublicationRequest {
  job_id: string;
  channel: string;
  scheduled_at: string;
  retry_on_failure: boolean;
  metadata?: Record<string, string>;
}

// ─── Publication Schedule ────────────────────────────────────────────

export interface PublicationSchedule {
  publication_id: string;
  job_id: string;
  channel: string;
  scheduled_at: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'PUBLISHED' | 'FAILED';
  created_at: string;
  updated_at: string;
}

// ─── Publication Result ──────────────────────────────────────────────

export interface PublicationResult {
  publication_id: string;
  job_id: string;
  published: boolean;
  url: string | null;
  published_at: string | null;
  error: string | null;
  channel_response: Record<string, unknown>;
}