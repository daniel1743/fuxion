/**
 * BAIOS - Editor IA
 * Job Manager — Phase 2.004
 * Central job lifecycle manager. No orchestration, no business logic.
 */

import type { JobState } from '../jobs/job.types';
import type { BaseError } from '../errors/base.error';
import type { JobRuntimeContext } from './job.context';
import { register, get, update, unregister, list, clear as clearRegistry } from './job.registry';
import { transitionState, canTransition } from './job.lifecycle';
import { enqueue, dequeue, size, clear as clearQueue } from './job.queue';
import { createJobInstance } from './job.factory';
import { createSuccess, createFailure, type JobExecutionResult } from './job.result';
import type { Job, JobType, JobPriority } from '../jobs/job.types';

export const JobManager = {
  /** Create and register a new job */
  create: (
    id: string, label: string, type: JobType, priority?: JobPriority,
  ): JobRuntimeContext => {
    const ctx = createJobInstance(id, label, type, priority);
    register(ctx);
    return ctx;
  },

  /** Queue a registered job for execution */
  queue: (id: string): void => {
    const ctx = get(id);
    const updated = transitionState(ctx, 'READY');
    update(id, updated);
    enqueue(updated);
  },

  /** Start (dequeue and run) next job */
  start: (id: string): JobRuntimeContext => {
    dequeue(); // remove from queue
    const ctx = get(id);
    return update(id, transitionState(ctx, 'RUNNING'));
  },

  /** Pause a running job */
  pause: (id: string): JobRuntimeContext => {
    const ctx = get(id);
    return update(id, transitionState(ctx, 'PAUSED'));
  },

  /** Resume a paused job */
  resume: (id: string): JobRuntimeContext => {
    const ctx = get(id);
    return update(id, transitionState(ctx, 'RUNNING'));
  },

  /** Cancel a job (any non-terminal state) */
  cancel: (id: string): JobRuntimeContext => {
    const ctx = get(id);
    return update(id, transitionState(ctx, 'CANCELLED'));
  },

  /** Complete a job */
  complete: (id: string, result?: Record<string, unknown>): JobExecutionResult => {
    const ctx = get(id);
    const updated = transitionState(ctx, 'COMPLETED');
    if (result) updated.result = result;
    update(id, updated);
    const started = updated.startedAt ? new Date(updated.startedAt).getTime() : 0;
    const completed = updated.completedAt ? new Date(updated.completedAt).getTime() : 0;
    return createSuccess(id, completed - started, 'COMPLETED', updated.warnings);
  },

  /** Fail a job */
  fail: (id: string, errors: BaseError[]): JobExecutionResult => {
    const ctx = get(id);
    const updated: JobRuntimeContext = {
      ...ctx,
      job: { ...ctx.job, state: 'FAILED', error: errors[0] ?? null, completed_at: new Date().toISOString() },
      completedAt: new Date().toISOString(),
    };
    update(id, updated);
    const started = updated.startedAt ? new Date(updated.startedAt).getTime() : 0;
    const completed = updated.completedAt ? new Date(updated.completedAt).getTime() : 0;
    return createFailure(id, completed - started, updated.warnings, errors);
  },

  /** Lookup a job */
  get: (id: string): JobRuntimeContext => get(id),

  /** List all jobs */
  list: (): string[] => list(),

  /** Queue size */
  queueSize: (): number => size(),

  /** Clear everything (testing only) */
  clear: (): void => { clearRegistry(); clearQueue(); },
};