/**
 * BAIOS - Editor IA
 * Job Lifecycle — Phase 2.004
 */

import type { JobState } from '../jobs/job.types';
import type { JobRuntimeContext } from './job.context';
import type { BaseError } from '../errors/base.error';

const VALID_TRANSITIONS: Record<JobState, JobState[]> = {
  CREATED: ['READY', 'CANCELLED'],
  READY: ['RUNNING', 'CANCELLED'],
  RUNNING: ['PAUSED', 'COMPLETED', 'FAILED', 'CANCELLED'],
  PAUSED: ['RUNNING', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  FAILED: [],
};

export function canTransition(from: JobState, to: JobState): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionState(
  ctx: JobRuntimeContext,
  to: JobState,
): JobRuntimeContext {
  if (!canTransition(ctx.job.state, to))
    throw new Error(`Invalid transition: ${ctx.job.state} → ${to}`);
  return {
    ...ctx,
    job: { ...ctx.job, state: to },
    startedAt: to === 'RUNNING' ? new Date().toISOString() : ctx.startedAt,
    completedAt:
      to === 'COMPLETED' || to === 'FAILED' || to === 'CANCELLED'
        ? new Date().toISOString()
        : ctx.completedAt,
  };
}