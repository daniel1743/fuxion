/**
 * BAIOS - Editor IA
 * Pipeline Result — Phase 2.002
 */

import type { BaseError } from '../errors/base.error';
import type { PipelineStep } from './pipeline.step';

export interface PipelineExecutionResult {
  pipelineId: string;
  success: boolean;
  finalState: string;
  executedSteps: PipelineStep[];
  executionTimeMs: number;
  warnings: string[];
  errors: BaseError[];
}

export function createSuccess(
  pipelineId: string,
  finalState: string,
  ms: number,
  steps: PipelineStep[],
  warnings: string[],
): PipelineExecutionResult {
  return { pipelineId, success: true, finalState, executedSteps: steps, executionTimeMs: ms, warnings, errors: [] };
}

export function createFailure(
  pipelineId: string,
  ms: number,
  steps: PipelineStep[],
  warnings: string[],
  errors: BaseError[],
): PipelineExecutionResult {
  return { pipelineId, success: false, finalState: 'FAILED', executedSteps: steps, executionTimeMs: ms, warnings, errors };
}