/**
 * BAIOS - Editor IA
 * Pipeline Factory — Phase 2.002
 */

import type { PipelineContext } from '../pipelines/pipeline.types';
import type { PipelineStep } from './pipeline.step';
import type { PipelineRuntimeContext } from './pipeline.context';
import { createPipelineRuntimeContext } from './pipeline.context';

export interface PipelineStepDefinition {
  name: string;
  stepId: string;
  order: number;
}

export interface PipelineDefinition {
  id: string;
  name: string;
  description: string;
  stages: PipelineStepDefinition[];
}

export function createPipelineInstance(
  definition: PipelineDefinition,
  base: PipelineContext,
): PipelineRuntimeContext {
  const steps: PipelineStep[] = definition.stages.map((s) => ({
    stepId: s.stepId,
    name: s.name,
    order: s.order,
    status: 'IDLE' as const,
    input: null,
    output: null,
  }));

  return createPipelineRuntimeContext(base, steps);
}