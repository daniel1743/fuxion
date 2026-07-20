/**
 * BAIOS - Editor IA
 * Job States — Phase 1C
 */

import type { JobState } from './job.types';

/** All valid job states */
export const JOB_STATES: readonly JobState[] = [
  'CREATED',
  'WAITING',
  'RUNNING',
  'PAUSED',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
] as const;

/** Terminal states — job cannot transition further */
export const JOB_TERMINAL_STATES: ReadonlySet<JobState> = new Set([
  'COMPLETED',
  'FAILED',
  'CANCELLED',
]);

/** State labels */
export const JOB_STATE_LABELS: Record<JobState, string> = {
  CREATED: 'Creado',
  WAITING: 'En espera',
  RUNNING: 'Ejecutando',
  PAUSED: 'Pausado',
  COMPLETED: 'Completado',
  FAILED: 'Fallido',
  CANCELLED: 'Cancelado',
};