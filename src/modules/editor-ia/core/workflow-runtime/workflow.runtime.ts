/**
 * BAIOS - Editor IA
 * Workflow Runtime Engine — Phase 2.001
 * Deterministic, side-effect-free workflow execution engine.
 * Consumes frozen contracts only. Mock providers only.
 */

import type { WorkflowContext } from '../workflows/workflow.types';
import type { EditorState } from '../state-machine/editor.states';
import type { BaseError } from '../errors/base.error';
import type {
  WorkflowRuntimeContext,
} from './workflow.context';
import { createRuntimeContext } from './workflow.context';
import { getWorkflow, hasWorkflow } from './workflow.registry';
import {
  executeCurrentStep,
  hasMoreSteps,
  allStepsExecuted,
  addWarning,
} from './workflow.executor';
import {
  createSuccessResult,
  createFailureResult,
  type WorkflowExecutionResult,
} from './workflow.result';
import type { WorkflowDefinition } from './workflow.factory';
import { createWorkflowInstance } from './workflow.factory';

export { type WorkflowExecutionResult };

/**
 * Main Workflow Runtime Engine.
 * Executes a registered workflow deterministically.
 */
export class WorkflowRuntime {
  private context: WorkflowRuntimeContext | null = null;
  private startTime: number = 0;

  /**
   * Initializes a workflow instance from a definition and base context.
   * Does NOT start execution.
   */
  initialize(definition: WorkflowDefinition, base: WorkflowContext): void {
    this.context = createWorkflowInstance(definition, base);
    this.context = {
      ...this.context,
      status: 'PENDING',
    };
  }

  /**
   * Runs the entire workflow to completion.
   * Returns a deterministic WorkflowExecutionResult.
   */
  execute(): WorkflowExecutionResult {
    if (!this.context) {
      throw new Error('Workflow not initialized. Call initialize() first.');
    }

    this.startTime = Date.now();
    const errors: BaseError[] = [];

    try {
      let ctx = this.context;
      ctx = { ...ctx, status: 'RUNNING' };

      while (hasMoreSteps(ctx)) {
        ctx = executeCurrentStep(ctx);
      }

      // Mark complete
      ctx = {
        ...ctx,
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
      };

      this.context = ctx;

      return createSuccessResult(
        ctx.workflow_id,
        ctx.current_state,
        Date.now() - this.startTime,
        ctx.history,
        ctx.warnings,
      );
    } catch (err) {
      const executionTime = Date.now() - this.startTime;
      const error: BaseError = {
        code: 'ERR_WF_001',
        message: err instanceof Error ? err.message : 'Unknown workflow error',
        category: 'WORKFLOW',
        severity: 'HIGH',
        retryable: false,
        source: 'WorkflowRuntime.execute',
        timestamp: new Date().toISOString(),
        context: { workflowId: this.context?.workflow_id ?? 'unknown' },
      };

      if (this.context) {
        this.context = {
          ...this.context,
          status: 'FAILED',
          completed_at: new Date().toISOString(),
          error,
        };
      }

      return createFailureResult(
        this.context?.workflow_id ?? 'unknown',
        this.context?.current_state ?? 'FAILED',
        executionTime,
        this.context?.history ?? [],
        this.context?.warnings ?? [],
        [error],
      );
    }
  }

  /**
   * Cancels an in-progress workflow.
   */
  cancel(): WorkflowRuntimeContext | null {
    if (!this.context) return null;

    this.context = {
      ...this.context,
      status: 'FAILED',
      completed_at: new Date().toISOString(),
      error: {
        code: 'ERR_WF_001',
        message: 'Workflow cancelled',
        category: 'WORKFLOW',
        severity: 'MEDIUM',
        retryable: false,
        source: 'WorkflowRuntime.cancel',
        timestamp: new Date().toISOString(),
        context: { workflowId: this.context.workflow_id },
      },
    };

    return this.context;
  }

  /**
   * Returns the current context (for inspection).
   */
  getContext(): WorkflowRuntimeContext | null {
    return this.context;
  }
}

/**
 * Convenience function: runs a registered workflow by ID.
 */
export function runWorkflow(
  workflowId: string,
  definition: WorkflowDefinition,
  base: WorkflowContext,
): WorkflowExecutionResult {
  if (!hasWorkflow(workflowId)) {
    throw new Error(`Workflow not registered: ${workflowId}`);
  }

  const runtime = new WorkflowRuntime();
  runtime.initialize(definition, base);
  return runtime.execute();
}