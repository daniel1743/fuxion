/**
 * BAIOS - Editor IA
 * Job Priority — Phase 1C
 */

import type { JobPriority } from './job.types';

/** Priority ordering — lower number = higher urgency */
export const PRIORITY_ORDER: Record<JobPriority, number> = {
  CRITICAL: 0,
  HIGH: 1,
  NORMAL: 2,
  LOW: 3,
};

/** Priority labels */
export const PRIORITY_LABELS: Record<JobPriority, string> = {
  CRITICAL: 'Crítico',
  HIGH: 'Alto',
  NORMAL: 'Normal',
  LOW: 'Bajo',
};