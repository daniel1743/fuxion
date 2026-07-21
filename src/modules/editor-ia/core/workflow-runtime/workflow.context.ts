/**
 * BAIOS - Editor IA
 * Workflow Runtime Context — Phase 2.001
 * Immutable runtime context conforming to frozen WorkflowContext contract.
 * No logic.
 */

import type { WorkflowContext, WorkflowStatus } from '../workflows/workflow.types';
import type { EditorState } from '../state-machine/editor.states';
import type { ContentJob } from '../../types';
import type { BaseError } from '../errors/base.error';

/** Step within a workflow execution */
export interface WorkflowStep {
  /** Step identifier */
  name: string;
  /** Order in the sequence */
  order: number;
  /** Target state after completion */
  targetState: EditorState;
  /** Whether this step has been executed */
  executed: boolean;
  /** Error if step failed */
  error: BaseError | null;
}

/** Runtime state augmentation of the frozen WorkflowContext */
export interface WorkflowRuntimeContext extends WorkflowContext {
  /** Ordered steps for this workflow */
  steps: WorkflowStep[];
  /** Index of the current step (0-based) */
  currentStepIndex: number;
  /** Total number of steps */
  totalSteps: number;
  /** Step execution history */
  history: WorkflowStep[];
  /** Warnings collected during execution */
  warnings: string[];
}

/** Creates a fresh runtime context from a base WorkflowContext */
export function createRuntimeContext(
  base: WorkflowContext,
  steps: Omit<WorkflowStep, 'executed' | 'error'>[],
): WorkflowRuntimeContext {
  const initializedSteps: WorkflowStep[] = steps.map((s) => ({
    ...s,
    executed: false,
    error: null,
  }));

  return {
    ...base,
    steps: initializedSteps,
    currentStepIndex: 0,
    totalSteps: initializedSteps.length,
    history: [],
    warnings: [],
  };
}