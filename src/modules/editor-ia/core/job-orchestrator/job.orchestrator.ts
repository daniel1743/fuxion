/**
 * BAIOS - Editor IA
 * Job Orchestrator — Phase 2.004
 * Entry point. Delegates to JobManager. No business logic.
 */

import { JobManager } from './job.manager';

export const JobOrchestrator = {
  create: JobManager.create,
  queue: JobManager.queue,
  start: JobManager.start,
  pause: JobManager.pause,
  resume: JobManager.resume,
  cancel: JobManager.cancel,
  complete: JobManager.complete,
  fail: JobManager.fail,
  get: JobManager.get,
  list: JobManager.list,
  queueSize: JobManager.queueSize,
  clear: JobManager.clear,
};