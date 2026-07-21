/**
 * BAIOS - Editor IA
 * Module Registry — Phase 1D (CORE FROZEN)
 * All registered OS modules. No logic.
 */

import type { KernelModuleDescriptor } from './kernel.contracts';

export const MODULE_REGISTRY: readonly KernelModuleDescriptor[] = [
  {
    id: 'editor-ia',
    name: 'EditorIA',
    version: '0.2.0',
    lifecycle: 'ACTIVE',
    dependencies: [],
    capabilities: ['GenerateContent', 'SearchKnowledge'],
    required: true,
  },
  {
    id: 'workflow-engine',
    name: 'WorkflowEngine',
    version: '0.2.0',
    lifecycle: 'ACTIVE',
    dependencies: ['editor-ia', 'job-engine'],
    capabilities: ['ExecuteWorkflow', 'ExecutePipeline'],
    required: true,
  },
  {
    id: 'scheduler',
    name: 'Scheduler',
    version: '0.2.0',
    lifecycle: 'ACTIVE',
    dependencies: ['job-engine'],
    capabilities: ['ScheduleJob'],
    required: true,
  },
  {
    id: 'job-engine',
    name: 'JobEngine',
    version: '0.2.0',
    lifecycle: 'ACTIVE',
    dependencies: [],
    capabilities: ['ExecuteJob', 'TrackJob'],
    required: true,
  },
  {
    id: 'knowledge-graph',
    name: 'KnowledgeGraph',
    version: '0.2.0',
    lifecycle: 'ACTIVE',
    dependencies: [],
    capabilities: ['SearchKnowledge', 'QueryGraph'],
    required: true,
  },
  {
    id: 'policy-engine',
    name: 'PolicyEngine',
    version: '0.2.0',
    lifecycle: 'ACTIVE',
    dependencies: [],
    capabilities: ['ValidatePolicies'],
    required: true,
  },
  {
    id: 'publication-engine',
    name: 'PublicationEngine',
    version: '0.2.0',
    lifecycle: 'ACTIVE',
    dependencies: ['editor-ia', 'scheduler'],
    capabilities: ['PublishContent'],
    required: false,
  },
  {
    id: 'runtime-audit',
    name: 'RuntimeAudit',
    version: '0.2.0',
    lifecycle: 'ACTIVE',
    dependencies: [],
    capabilities: ['AuditExecution'],
    required: true,
  },
] as const;