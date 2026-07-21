/**
 * BAIOS - Editor IA
 * Job Registry — Phase 2.004
 */

import type { JobRuntimeContext } from './job.context';

const registry = new Map<string, JobRuntimeContext>();

export function register(ctx: JobRuntimeContext): void {
  if (registry.has(ctx.job.id)) throw new Error(`Job already registered: ${ctx.job.id}`);
  registry.set(ctx.job.id, ctx);
}

export function unregister(id: string): void { registry.delete(id); }

export function get(id: string): JobRuntimeContext {
  const ctx = registry.get(id);
  if (!ctx) throw new Error(`Job not found: ${id}`);
  return ctx;
}

export function update(id: string, ctx: JobRuntimeContext): void {
  if (!registry.has(id)) throw new Error(`Job not found: ${id}`);
  registry.set(id, ctx);
}

export function list(): string[] { return Array.from(registry.keys()); }

export function clear(): void { registry.clear(); }