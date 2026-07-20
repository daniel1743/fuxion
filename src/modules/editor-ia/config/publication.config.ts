/**
 * BAIOS - Editor IA
 * Publication Configuration — Phase 1B
 */

export const PUBLICATION_CONFIG = {
  /** Publication window in hours from scheduling */
  publication_window_hours: 24,

  /** Retry policy for failed publications */
  retry_policy: {
    max_retries: 3,
    backoff_seconds: 300,
    backoff_multiplier: 2,
  },

  /** Supported publication channels */
  channels: ['web', 'email', 'social'],

  /** Default channel */
  default_channel: 'web',
} as const;