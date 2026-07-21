/**
 * BAIOS - Editor IA
 * Workflow Factory — Phase 2.001
 * Creates workflow instances from registered contracts.
 */

import type { EditorState } from '../state-machine/editor.states';
import type { BaseError } from '../errors/base.error';
import type { WorkflowContext } from '../workflows/workflow.types';
import type { ContentJob } from '../../types';
import type {
  WorkflowRuntimeContext,
  WorkflowStep,
} from './workflow.context';
import { createRuntimeContext } from './workflow.context';

/** Step definition used by factory */
export interface WorkflowStepDefinition {
  name: string;
  targetState: EditorState;
}

/** Full workflow definition */
export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStepDefinition[];
}

/** Creates a WorkflowRuntimeContext from a definition and base context */
export function createWorkflowInstance(
  definition: WorkflowDefinition,
  base: WorkflowContext,
): WorkflowRuntimeContext {
  const steps: Omit<WorkflowStep, 'executed' | 'error'>[] =
    definition.steps.map((step, index) => ({
      name: step.name,
      order: index,
      targetState: step.targetState,
    }));

  return createRuntimeContext(base, steps);
}