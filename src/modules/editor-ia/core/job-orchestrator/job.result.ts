/**
 * BAIOS - Editor IA
 * Job Result — Phase 2.004
 */

import type { JobState } from '../jobs/job.types';
import type { BaseError } from '../errors/base.error';

export interface JobExecutionResult {
  jobId: string;
  success: boolean;
  durationMs: number;
  finalState: JobState;
  warnings: string[];
  errors: BaseError[];
}

export function createSuccess(
  jobId: string,
  durationMs: number,
  finalState: JobState,
  warnings: string[],
): JobExecutionResult {
  return { jobId, success: true, durationMs, finalState, warnings, errors: [] };
}

export function createFailure(
  jobId: string,
  durationMs: number,
  warnings: string[],
  errors: BaseError[],
): JobExecutionResult {
  return { jobId, success: false, durationMs, finalState: 'FAILED', warnings, errors };
}