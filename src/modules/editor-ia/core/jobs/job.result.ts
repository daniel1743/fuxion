/**
 * BAIOS - Editor IA
 * Job Result — Phase 1C
 */

import type { JobType, JobState } from './job.types';
import type { AIProvider } from '../../types';

/** Execution metrics for completed jobs */
export interface JobExecutionMetrics {
  execution_time_ms: number;
  provider: AIProvider | null;
  tokens_input: number;
  tokens_output: number;
  estimated_cost_usd: number;
  retry_count: number;
}

/** Result envelope for any completed job */
export interface JobResult {
  /** Job identifier */
  job_id: string;
  /** Job type */
  job_type: JobType;
  /** Final state */
  final_state: JobState;
  /** Execution measurements */
  metrics: JobExecutionMetrics;
  /** Structured output data */
  output: Record<string, unknown> | null;
  /** Error details if failed */
  error: string | null;
  /** ISO-8601 completed timestamp */
  completed_at: string;
}