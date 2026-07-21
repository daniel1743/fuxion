/**
 * BAIOS - Editor IA
 * Event Result — Phase 2.003
 */

import type { EventBusEnvelope } from './event.context';

export interface EventPublishResult {
  envelope: EventBusEnvelope;
  success: boolean;
  subscriberCount: number;
}