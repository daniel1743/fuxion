/**
 * BAIOS - Editor IA
 * Pipeline Registry — Phase 2.002
 */

import type { PipelineRuntimeContext } from './pipeline.context';

export type PipelineExecutor = (
  ctx: PipelineRuntimeContext,
) => PipelineRuntimeContext;

export interface PipelineRegistryEntry {
  id: string;
  name: string;
  description: string;
  executor: PipelineExecutor;
}

const registry = new Map<string, PipelineRegistryEntry>();

export function registerPipeline(entry: PipelineRegistryEntry): void {
  if (registry.has(entry.id)) {
    throw new Error(`Pipeline already registered: ${entry.id}`);
  }
  registry.set(entry.id, entry);
}

export function getPipeline(id: string): PipelineRegistryEntry {
  const entry = registry.get(id);
  if (!entry) throw new Error(`Pipeline not found: ${id}`);
  return entry;
}

export function hasPipeline(id: string): boolean {
  return registry.has(id);
}

export function listPipelines(): string[] {
  return Array.from(registry.keys());
}

export function clearRegistry(): void {
  registry.clear();
}