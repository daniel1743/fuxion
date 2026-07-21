/**
 * BAIOS - Editor IA
 * Base Error Model — Phase 1D (CORE FROZEN)
 * Unified error contract. No logic.
 */

export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ErrorCategory =
  | 'VALIDATION'
  | 'WORKFLOW'
  | 'PIPELINE'
  | 'PROVIDER'
  | 'SCHEDULER'
  | 'POLICY'
  | 'PUBLICATION'
  | 'UNKNOWN';

export interface BaseError {
  /** Machine-readable error code (e.g. ERR_VAL_001) */
  code: string;
  /** Human-readable error description */
  message: string;
  /** Error category */
  category: ErrorCategory;
  /** Severity level */
  severity: ErrorSeverity;
  /** Whether this error can be retried */
  retryable: boolean;
  /** Source module or component */
  source: string;
  /** ISO-8601 timestamp */
  timestamp: string;
  /** Arbitrary context */
  context: Record<string, unknown>;
}

/** Specialized error types */

export interface ValidationError extends BaseError {
  category: 'VALIDATION';
  field: string;
}

export interface WorkflowError extends BaseError {
  category: 'WORKFLOW';
  workflow_id: string;
  current_state: string;
}

export interface PipelineError extends BaseError {
  category: 'PIPELINE';
  pipeline_id: string;
  stage: string;
}

export interface ProviderError extends BaseError {
  category: 'PROVIDER';
  provider: string;
  model: string;
}

export interface SchedulerError extends BaseError {
  category: 'SCHEDULER';
  job_id: string;
}

export interface PolicyError extends BaseError {
  category: 'POLICY';
  policy_id: string;
}

export interface PublicationError extends BaseError {
  category: 'PUBLICATION';
  channel: string;
  article_id: string;
}

export interface UnknownError extends BaseError {
  category: 'UNKNOWN';
}