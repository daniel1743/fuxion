/**
 * BAIOS - Editor IA
 * Pipeline Step — Phase 2.002
 * Atomic execution unit. No logic.
 */

import type { PipelineStageStatus } from '../pipelines/pipeline.types';

/** A single step within a pipeline execution */
export interface PipelineStep {
  /** Unique step identifier */
  stepId: string;
  /** Human-readable name */
  name: string;
  /** Execution order (0-based) */
  order: number;
  /** Current status */
  status: PipelineStageStatus;
  /** Step input data */
  input: Record<string, unknown> | null;
  /** Step output data */
  output: Record<string, unknown> | null;
}