/**
 * BAIOS - Editor IA
 * Event Subscriber — Phase 2.003
 * Subscriber contract. No orchestration, no side effects.
 */

import type { EventBusEnvelope } from './event.context';

/** Subscriber ID */
export type SubscriberId = string;

/** Subscriber function signature */
export type EventSubscriber = (envelope: EventBusEnvelope) => void;