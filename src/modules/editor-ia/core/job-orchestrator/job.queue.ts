/**
 * BAIOS - Editor IA
 * Job Queue — Phase 2.004
 * In-memory FIFO. No persistence, no retries.
 */

import type { JobRuntimeContext } from './job.context';

const queue: JobRuntimeContext[] = [];

export function enqueue(ctx: JobRuntimeContext): void { queue.push(ctx); }

export function dequeue(): JobRuntimeContext | undefined { return queue.shift(); }

export function peek(): JobRuntimeContext | undefined { return queue[0]; }

export function size(): number { return queue.length; }

export function clear(): void { queue.length = 0; }