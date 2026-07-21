/**
 * BAIOS - Editor IA
 * Workflow Result — Phase 2.001
 * Deterministic execution result. No side effects.
 */

import type { EditorState } from '../state-machine/editor.states';
import type { BaseError } from '../errors/base.error';
import type { WorkflowStep } from './workflow.context';

/** Result of a workflow execution */
export interface WorkflowExecutionResult {
  /** Workflow identifier */
  workflowId: string;
  /** Whether execution completed successfully */
  success: boolean;
  /** Final state reached */
  finalState: EditorState;
  /** Total execution time in milliseconds */
  executionTimeMs: number;
  /** Steps that were executed */
  executedSteps: WorkflowStep[];
  /** Warnings collected during execution */
  warnings: string[];
  /** Errors that occurred */
  errors: BaseError[];
}

/** Creates a success result */
export function createSuccessResult(
  workflowId: string,
  finalState: EditorState,
  executionTimeMs: number,
  executedSteps: WorkflowStep[],
  warnings: string[],
): WorkflowExecutionResult {
  return {
    workflowId,
    success: true,
    finalState,
    executionTimeMs,
    executedSteps,
    warnings,
    errors: [],
  };
}

/** Creates a failure result */
export function createFailureResult(
  workflowId: string,
  finalState: EditorState,
  executionTimeMs: number,
  executedSteps: WorkflowStep[],
  warnings: string[],
  errors: BaseError[],
): WorkflowExecutionResult {
  return {
    workflowId,
    success: false,
    finalState,
    executionTimeMs,
    executedSteps,
    warnings,
    errors,
  };
}