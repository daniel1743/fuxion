/**
 * BAIOS - Editor IA
 * Capability Registry — Phase 1D (CORE FROZEN)
 */

export const CAPABILITY_REGISTRY = [
  { id: 'GenerateContent', description: 'Generate editorial content via AI providers' },
  { id: 'GenerateImages', description: 'Generate images and visual assets' },
  { id: 'SearchKnowledge', description: 'Query the scientific knowledge graph' },
  { id: 'PublishContent', description: 'Publish content to configured channels' },
  { id: 'ExecuteWorkflow', description: 'Execute a predefined editorial workflow' },
  { id: 'ExecutePipeline', description: 'Execute a stage-based pipeline' },
  { id: 'AuditExecution', description: 'Record and aggregate runtime metrics' },
  { id: 'ValidatePolicies', description: 'Evaluate content against editorial policies' },
  { id: 'ScheduleJob', description: 'Schedule jobs for delayed or recurring execution' },
  { id: 'ExecuteJob', description: 'Execute a single job atomically' },
  { id: 'TrackJob', description: 'Monitor and report job lifecycle state' },
  { id: 'QueryGraph', description: 'Traverse entity relationships in the knowledge graph' },
] as const;

export type CapabilityId = (typeof CAPABILITY_REGISTRY)[number]['id'];