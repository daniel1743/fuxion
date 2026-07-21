/**
 * BAIOS - Editor IA
 * Job Factory — Phase 2.004
 */

import type { Job, JobType, JobPriority } from '../jobs/job.types';
import type { JobRuntimeContext } from './job.context';
import { createJobContext } from './job.context';

export function createJob(
  id: string,
  label: string,
  type: JobType,
  priority: JobPriority = 'NORMAL',
): Job {
  return {
    id,
    label,
    type,
    state: 'CREATED',
    priority,
    parent_id: null,
    created_at: new Date().toISOString(),
    started_at: null,
    completed_at: null,
    error: null,
    metadata: {},
  };
}

export function createJobInstance(
  id: string,
  label: string,
  type: JobType,
  priority?: JobPriority,
): JobRuntimeContext {
  const job = createJob(id, label, type, priority);
  return createJobContext(job);
}