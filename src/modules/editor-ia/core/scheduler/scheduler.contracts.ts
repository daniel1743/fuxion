/**
 * BAIOS - Editor IA
 * Scheduler Contracts — Phase 1C
 */

import type { JobPriority } from '../jobs/job.types';

export interface ScheduleRequest {
  job_id: string;
  execute_at: string;
  priority: JobPriority;
  depends_on: string[];
  execution_window_start: string | null;
  execution_window_end: string | null;
}

export interface RecurringJobConfig {
  job_id: string;
  interval_minutes: number;
  max_executions: number;
  start_at: string;
  end_at: string | null;
}

export interface RetryPolicy {
  max_retries: number;
  base_delay_seconds: number;
  backoff_multiplier: number;
  max_delay_seconds: number;
}

export interface DependencyChain {
  job_id: string;
  dependencies: string[];
  strategy: 'SEQUENTIAL' | 'PARALLEL';
}

export interface ExecutionWindow {
  start_hour: number;
  end_hour: number;
  days_of_week: number[];
  timezone: string;
}