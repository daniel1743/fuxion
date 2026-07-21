/**
 * BAIOS - Editor IA
 * In-Memory Event Bus — Phase 2.003
 * Pure transport. No orchestration, no persistence, no retries.
 */

import type { EditorEventName } from '../events/event.names';
import type { EventBusEnvelope } from './event.context';
import type { EventSubscriber, SubscriberId } from './event.subscriber';
import { publish as createEnvelope } from './event.publisher';
import { dispatch as dispatchEnvelope } from './event.dispatcher';
import {
  subscribe as regSubscribe,
  unsubscribe as regUnsubscribe,
  clearAll,
} from './subscription.registry';

/** Main Event Bus — in-memory only */
export const EventBus = {
  /** Publish and immediately dispatch an event */
  publish: (
    eventName: EditorEventName,
    payload: unknown,
  ): EventBusEnvelope => {
    const envelope = createEnvelope(eventName, payload);
    return dispatchEnvelope(envelope);
  },

  /** Register a subscriber for an event */
  subscribe: (
    eventName: EditorEventName,
    id: SubscriberId,
    handler: EventSubscriber,
  ): void => regSubscribe(eventName, id, handler),

  /** Unregister a subscriber */
  unsubscribe: (eventName: EditorEventName, id: SubscriberId): void =>
    regUnsubscribe(eventName, id),

  /** Clear all subscriptions (testing only) */
  clear: (): void => clearAll(),
};