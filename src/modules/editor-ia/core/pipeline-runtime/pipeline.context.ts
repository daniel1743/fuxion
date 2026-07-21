/**
 * BAIOS - Editor IA
 * Pipeline Runtime Context — Phase 2.002
 * Immutable runtime context. Consumes frozen PipelineContext.
 */

import type { PipelineContext, PipelineStageStatus } from '../pipelines/pipeline.types';
import type { PipelineStep } from './pipeline.step';

/** Runtime augmentation of the frozen PipelineContext */
export interface PipelineRuntimeContext extends PipelineContext {
  /** Ordered execution steps */
  steps: PipelineStep[];
  /** Index of current step */
  currentStepIndex: number;
  /** Execution history */
  history: PipelineStep[];
  /** Warnings */
  warnings: string[];
  /** Execution start timestamp */
  startedAt: string | null;
  /** Execution end timestamp */
  completedAt: string | null;
}

/** Creates fresh runtime context from a frozen PipelineContext */
export function createPipelineRuntimeContext(
  base: PipelineContext,
  steps: PipelineStep[],
): PipelineRuntimeContext {
  return {
    ...base,
    steps: steps.map((s) => ({ ...s, status: 'IDLE' as PipelineStageStatus })),
    currentStepIndex: 0,
    history: [],
    warnings: [],
    startedAt: null,
    completedAt: null,
  };
}