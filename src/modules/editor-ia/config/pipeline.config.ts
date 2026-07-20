/**
 * BAIOS - Editor IA
 * Pipeline Configuration — Phase 1B
 */

export const PIPELINE_CONFIG = {
  /** Pipelines enabled in the current environment */
  enabled_pipelines: [
    'knowledge',
    'editorial',
    'generation',
    'seo',
    'media',
    'quality',
    'publication',
  ],

  /** Execution order — sequential by design */
  execution_order: [
    'knowledge',
    'editorial',
    'generation',
    'seo',
    'media',
    'quality',
    'publication',
  ],

  /** Timeout per stage in seconds */
  stage_timeout_seconds: 120,

  /** Maximum retries per stage */
  max_stage_retries: 2,
} as const;