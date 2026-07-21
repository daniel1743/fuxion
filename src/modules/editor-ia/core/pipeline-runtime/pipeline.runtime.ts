/**
 * BAIOS - Editor IA
 * Pipeline Runtime Engine — Phase 2.002
 * Deterministic, sequential, side-effect-free.
 */

import type { PipelineContext } from '../pipelines/pipeline.types';
import type { BaseError } from '../errors/base.error';
import type { PipelineRuntimeContext } from './pipeline.context';
import { executeStep, hasMoreSteps } from './pipeline.executor';
import { createSuccess, createFailure, type PipelineExecutionResult } from './pipeline.result';
import type { PipelineDefinition } from './pipeline.factory';
import { createPipelineInstance } from './pipeline.factory';
import { validateContext, finishPipeline } from './pipeline.lifecycle';
import { getPipeline } from './pipeline.registry';

export class PipelineRuntime {
  private ctx: PipelineRuntimeContext | null = null;
  private startTime = 0;

  initialize(def: PipelineDefinition, base: PipelineContext): void {
    this.ctx = createPipelineInstance(def, base);
    if (!validateContext(this.ctx)) throw new Error('Invalid pipeline context');
    this.ctx = { ...this.ctx, startedAt: new Date().toISOString() };
  }

  execute(): PipelineExecutionResult {
    if (!this.ctx) throw new Error('Not initialized');
    this.startTime = Date.now();

    try {
      let ctx = this.ctx;
      while (hasMoreSteps(ctx)) ctx = executeStep(ctx);
      ctx = finishPipeline(ctx);
      this.ctx = ctx;
      return createSuccess(ctx.pipeline_id, ctx.current_stage, Date.now() - this.startTime, ctx.history, ctx.warnings);
    } catch (err) {
      const ms = Date.now() - this.startTime;
      const error: BaseError = {
        code: 'ERR_PIPE_001', message: err instanceof Error ? err.message : 'Pipeline error',
        category: 'PIPELINE', severity: 'HIGH', retryable: false,
        source: 'PipelineRuntime.execute', timestamp: new Date().toISOString(),
        context: { pipelineId: this.ctx?.pipeline_id ?? 'unknown' },
      };
      return createFailure(this.ctx?.pipeline_id ?? 'unknown', ms, this.ctx?.history ?? [], this.ctx?.warnings ?? [], [error]);
    }
  }

  cancel(): PipelineRuntimeContext | null {
    if (!this.ctx) return null;
    this.ctx = { ...this.ctx, completedAt: new Date().toISOString() };
    return this.ctx;
  }

  getContext(): PipelineRuntimeContext | null { return this.ctx; }
}

export function runPipeline(
  pipelineId: string, def: PipelineDefinition, base: PipelineContext,
): PipelineExecutionResult {
  if (!getPipeline(pipelineId)) throw new Error(`Pipeline not registered: ${pipelineId}`);
  const rt = new PipelineRuntime();
  rt.initialize(def, base);
  return rt.execute();
}