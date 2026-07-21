/**
 * BAIOS - Editor IA
 * Tracing Contracts — Phase 1D (CORE FROZEN)
 * Distributed tracing model. No logic.
 */

import type { AIProvider } from '../../types';
import type { JobType } from '../jobs/job.types';

/** Core trace context — propagates through all operations */
export interface TraceContext {
  /** Unique trace identifier (root span) */
  traceId: string;
  /** Correlation ID for grouping related traces */
  correlationId: string;
  /** Parent trace ID (for sub-spans) */
  parentTraceId: string | null;
  /** Associated workflow */
  workflowId: string | null;
  /** Associated pipeline */
  pipelineId: string | null;
  /** Associated job */
  jobId: string | null;
  /** Provider used (if any) */
  providerId: AIProvider | null;
  /** ISO-8601 start timestamp */
  timestamp: string;
}

/** Span — a single unit of traced work */
export interface TraceSpan {
  /** Span identifier */
  spanId: string;
  /** Parent trace context */
  trace: TraceContext;
  /** Operation name */
  operation: string;
  /** Job type for this span */
  jobType: JobType | null;
  /** Duration in milliseconds */
  durationMs: number;
  /** Whether this span ended in error */
  hasError: boolean;
  /** ISO-8601 span start */
  startedAt: string;
  /** ISO-8601 span end */
  endedAt: string | null;
  /** Additional tags */
  tags: Record<string, string>;
}

/** Lightweight trace context for embedding in contracts */
export interface TraceEmbed {
  traceId: string;
  correlationId: string;
  parentTraceId: string | null;
}