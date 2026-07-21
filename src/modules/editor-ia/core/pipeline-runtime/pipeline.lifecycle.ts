/**
 * BAIOS - Editor IA
 * Pipeline Lifecycle — Phase 2.002
 */

import type { PipelineRuntimeContext } from './pipeline.context';
import type { PipelineStageStatus } from '../pipelines/pipeline.types';

/** Mark a step as FAILED */
export function failStep(
  ctx: PipelineRuntimeContext,
  stepIndex: number,
): PipelineRuntimeContext {
  const steps = [...ctx.steps];
  if (steps[stepIndex]) {
    steps[stepIndex] = { ...steps[stepIndex], status: 'FAILED' as PipelineStageStatus };
  }
  return { ...ctx, steps };
}

/** Mark a step as SKIPPED */
export function skipStep(
  ctx: PipelineRuntimeContext,
  stepIndex: number,
): PipelineRuntimeContext {
  const steps = [...ctx.steps];
  if (steps[stepIndex]) {
    steps[stepIndex] = { ...steps[stepIndex], status: 'SKIPPED' as PipelineStageStatus };
  }
  return { ...ctx, steps, currentStepIndex: stepIndex + 1 };
}

/** Validate pipeline context before execution */
export function validateContext(ctx: PipelineRuntimeContext): boolean {
  return ctx.pipeline_id.length > 0 && ctx.job !== null && ctx.steps.length > 0;
}

/** Cancel pipeline */
export function cancelPipeline(ctx: PipelineRuntimeContext): PipelineRuntimeContext {
  return {
    ...ctx,
    completedAt: new Date().toISOString(),
  };
}

/** Finish pipeline successfully */
export function finishPipeline(ctx: PipelineRuntimeContext): PipelineRuntimeContext {
  return {
    ...ctx,
    completedAt: new Date().toISOString(),
  };
}