/**
 * BAIOS - Editor IA
 * Workflow Executor — Phase 2.001
 * Executes workflow steps deterministically. No side effects.
 * Consumes frozen contracts only.
 */

import type { EditorState } from '../state-machine/editor.states';
import type { BaseError } from '../errors/base.error';
import type {
  WorkflowRuntimeContext,
  WorkflowStep,
} from './workflow.context';

/** Executes the current step of a workflow */
export function executeCurrentStep(
  ctx: WorkflowRuntimeContext,
): WorkflowRuntimeContext {
  if (ctx.status === 'COMPLETED' || ctx.status === 'FAILED') {
    return ctx;
  }

  if (ctx.currentStepIndex >= ctx.steps.length) {
    return ctx;
  }

  const currentStep = ctx.steps[ctx.currentStepIndex];

  // Mark step as executed
  const executedStep: WorkflowStep = {
    ...currentStep,
    executed: true,
    error: null,
  };

  const updatedSteps = [...ctx.steps];
  updatedSteps[ctx.currentStepIndex] = executedStep;

  return {
    ...ctx,
    status: 'RUNNING',
    current_state: executedStep.targetState,
    steps: updatedSteps,
    history: [...ctx.history, executedStep],
    currentStepIndex: ctx.currentStepIndex + 1,
  };
}

/** Determines the next step without executing it */
export function getNextStep(
  ctx: WorkflowRuntimeContext,
): WorkflowStep | null {
  if (ctx.currentStepIndex >= ctx.steps.length) {
    return null;
  }
  return ctx.steps[ctx.currentStepIndex];
}

/** Check if workflow has more steps */
export function hasMoreSteps(ctx: WorkflowRuntimeContext): boolean {
  return ctx.currentStepIndex < ctx.steps.length;
}

/** Check if all steps have been executed */
export function allStepsExecuted(ctx: WorkflowRuntimeContext): boolean {
  return ctx.steps.every((s) => s.executed);
}

/** Update workflow context with a warning */
export function addWarning(
  ctx: WorkflowRuntimeContext,
  warning: string,
): WorkflowRuntimeContext {
  return {
    ...ctx,
    warnings: [...ctx.warnings, warning],
  };
}