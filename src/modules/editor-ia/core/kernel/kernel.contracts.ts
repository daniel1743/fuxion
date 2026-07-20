/**
 * BAIOS - Editor IA
 * Kernel Contracts — Phase 1D (CORE FROZEN)
 * Core OS kernel definition. No logic.
 */

/** Module lifecycle states */
export type ModuleLifecycle = 'UNREGISTERED' | 'INITIALIZING' | 'ACTIVE' | 'DEGRADED' | 'SHUTDOWN';

/** Health status */
export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';

/** Module descriptor registered in the kernel */
export interface KernelModuleDescriptor {
  /** Module unique identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Module version */
  version: string;
  /** Current lifecycle state */
  lifecycle: ModuleLifecycle;
  /** Dependencies on other modules */
  dependencies: string[];
  /** Capabilities this module provides */
  capabilities: string[];
  /** Whether this module is required for system boot */
  required: boolean;
}

/** Health report from a module */
export interface ModuleHealth {
  module_id: string;
  status: HealthStatus;
  message: string;
  checked_at: string;
}

/** Kernel-level health aggregate */
export interface KernelHealth {
  status: HealthStatus;
  modules: ModuleHealth[];
  total_modules: number;
  healthy_modules: number;
  degraded_modules: number;
  unhealthy_modules: number;
}

/** Kernel descriptor defining the entire system */
export interface KernelDescriptor {
  version: string;
  architecture_version: string;
  frozen: boolean;
  modules: KernelModuleDescriptor[];
}