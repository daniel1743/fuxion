/**
 * BAIOS - Editor IA
 * Pipeline Executor — Phase 2.002
 * Atomic step execution. Deterministic, immutable.
 */

import type { PipelineRuntimeContext } from './pipeline.context';
import type { PipelineStep } from './pipeline.step';

/** Execute the current step and advance */
export function executeStep(
  ctx: PipelineRuntimeContext,
): PipelineRuntimeContext {
  if (ctx.currentStepIndex >= ctx.steps.length) return ctx;

  const current = ctx.steps[ctx.currentStepIndex];
  if (!current) return ctx;

  const executed: PipelineStep = {
    ...current,
    status: 'COMPLETED',
    output: {},
  };

  const updated = [...ctx.steps];
  updated[ctx.currentStepIndex] = executed;

  return {
    ...ctx,
    currentStepIndex: ctx.currentStepIndex + 1,
    current_stage: current.name,
    steps: updated,
    history: [...ctx.history, executed],
  };
}

export function getCurrentStep(ctx: PipelineRuntimeContext): PipelineStep | null {
  return ctx.steps[ctx.currentStepIndex] ?? null;
}

export function hasMoreSteps(ctx: PipelineRuntimeContext): boolean {
  return ctx.currentStepIndex < ctx.steps.length;
}

export function allStepsDone(ctx: PipelineRuntimeContext): boolean {
  return ctx.steps.every((s) => s.status === 'COMPLETED' || s.status === 'SKIPPED');
}

export function addWarning(ctx: PipelineRuntimeContext, msg: string): PipelineRuntimeContext {
  return { ...ctx, warnings: [...ctx.warnings, msg] };
}