/**
 * BAIOS - Editor IA
 * Runtime Audit Contracts — Phase 1C
 * Metrics registry for future executions. No logic.
 */

import type { JobType } from '../jobs/job.types';
import type { AIProvider } from '../../types';

/** Audit entry for every job execution */
export interface RuntimeAuditEntry {
  /** Unique audit identifier */
  audit_id: string;
  /** Associated job */
  job_id: string;
  /** Job classification */
  job_type: JobType;
  /** Workflow that executed */
  workflow: string;
  /** AI provider used */
  provider: AIProvider;
  /** Execution metrics */
  execution_time_ms: number;
  /** Tokens consumed (input) */
  tokens_input: number;
  /** Tokens produced (output) */
  tokens_output: number;
  /** Estimated cost in USD */
  estimated_cost_usd: number;
  /** Execution status */
  execution_status: 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'RETRY';
  /** Quality score if applicable */
  quality_score: number | null;
  /** ISO-8601 execution timestamp */
  executed_at: string;
  /** Additional context */
  metadata: Record<string, unknown>;
}

/** Aggregated metrics summary */
export interface RuntimeMetrics {
  total_jobs: number;
  total_failures: number;
  total_tokens: number;
  total_cost_usd: number;
  average_execution_ms: number;
  provider_distribution: Record<string, number>;
}