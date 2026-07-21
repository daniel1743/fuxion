/**
 * BAIOS - Editor IA
 * Event Publisher — Phase 2.003
 * Publishes events to the bus. No orchestration, no retries, no persistence.
 */

import type { EditorEventName } from '../events/event.names';
import type { EventBusEnvelope } from './event.context';
import { validateEvent } from './event.registry';

let deliveryCounter = 0;

/** Publish an event. Returns the envelope ready for dispatch. */
export function publish(
  eventName: EditorEventName,
  payload: unknown,
  traceId = 'trace-' + Date.now(),
  correlationId = 'corr-' + Date.now(),
): EventBusEnvelope {
  validateEvent(eventName);
  return {
    deliveryId: 'del-' + (++deliveryCounter) + '-' + Date.now(),
    eventName,
    publishedAt: new Date().toISOString(),
    payload,
    traceId,
    correlationId,
    delivered: false,
    subscriberCount: 0,
  };
}