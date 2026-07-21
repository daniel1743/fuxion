/**
 * BAIOS - Editor IA
 * Workflow Registry — Phase 2.001
 * Registers all available workflows without instantiating them.
 * Consumes frozen contracts only.
 */

import type { WorkflowContext } from '../workflows/workflow.types';
import type { WorkflowRuntimeContext } from './workflow.context';

/** Signature of a workflow execution function */
export type WorkflowExecutor = (
  context: WorkflowRuntimeContext,
) => WorkflowRuntimeContext;

/** Entry in the workflow registry */
export interface WorkflowRegistryEntry {
  /** Unique workflow identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Description */
  description: string;
  /** Executor function */
  executor: WorkflowExecutor;
}

/** Internal registry store */
const registry = new Map<string, WorkflowRegistryEntry>();

/** Register a workflow */
export function registerWorkflow(entry: WorkflowRegistryEntry): void {
  if (registry.has(entry.id)) {
    throw new Error(`Workflow already registered: ${entry.id}`);
  }
  registry.set(entry.id, entry);
}

/** Retrieve a registered workflow */
export function getWorkflow(id: string): WorkflowRegistryEntry {
  const entry = registry.get(id);
  if (!entry) {
    throw new Error(`Workflow not found: ${id}`);
  }
  return entry;
}

/** Check if a workflow is registered */
export function hasWorkflow(id: string): boolean {
  return registry.has(id);
}

/** List all registered workflow IDs */
export function listWorkflows(): string[] {
  return Array.from(registry.keys());
}

/** Clear the registry (for testing) */
export function clearRegistry(): void {
  registry.clear();
}