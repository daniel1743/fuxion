/**
 * BAIOS - Editor IA
 * Job Orchestrator Context — Phase 2.004
 * Immutable runtime context. Consumes frozen Job contract.
 */

import type { Job, JobState } from '../jobs/job.types';
import type { BaseError } from '../errors/base.error';

/** Runtime job state — extends frozen Job */
export interface JobRuntimeContext {
  job: Job;
  workflowId: string | null;
  pipelineId: string | null;
  traceId: string;
  correlationId: string;
  queuePosition: number;
  startedAt: string | null;
  completedAt: string | null;
  warnings: string[];
  result: Record<string, unknown> | null;
}

/** Creates fresh runtime context */
export function createJobContext(
  job: Job,
  traceId = 'trace-' + Date.now(),
  correlationId = 'corr-' + Date.now(),
): JobRuntimeContext {
  return {
    job,
    workflowId: null,
    pipelineId: null,
    traceId,
    correlationId,
    queuePosition: 0,
    startedAt: null,
    completedAt: null,
    warnings: [],
    result: null,
  };
}