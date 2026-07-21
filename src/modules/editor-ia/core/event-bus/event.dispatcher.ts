/**
 * BAIOS - Editor IA
 * Event Dispatcher — Phase 2.003
 * Dispatches events to subscribers. Isolated, no orchestration.
 */

import type { EventBusEnvelope } from './event.context';
import { getSubscribers } from './subscription.registry';

/** Dispatch an envelope to all registered subscribers */
export function dispatch(envelope: EventBusEnvelope): EventBusEnvelope {
  const subs = getSubscribers(envelope.eventName);
  for (const sub of subs) {
    try { sub.handler(envelope); } catch { /* isolated */ }
  }
  return { ...envelope, delivered: true, subscriberCount: subs.length };
}