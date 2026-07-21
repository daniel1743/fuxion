/**
 * BAIOS - Editor IA
 * Subscription Registry — Phase 2.003
 * Manages subscriber registration per event. No logic.
 */

import type { EditorEventName } from '../events/event.names';
import type { EventSubscriber, SubscriberId } from './event.subscriber';

interface SubEntry {
  id: SubscriberId;
  handler: EventSubscriber;
}

const subs = new Map<EditorEventName, SubEntry[]>();

export function subscribe(
  eventName: EditorEventName,
  id: SubscriberId,
  handler: EventSubscriber,
): void {
  const list = subs.get(eventName) ?? [];
  if (list.some((s) => s.id === id)) {
    throw new Error(`Subscriber ${id} already registered for ${eventName}`);
  }
  list.push({ id, handler });
  subs.set(eventName, list);
}

export function unsubscribe(eventName: EditorEventName, id: SubscriberId): void {
  const list = subs.get(eventName);
  if (!list) return;
  subs.set(
    eventName,
    list.filter((s) => s.id !== id),
  );
}

export function getSubscribers(eventName: EditorEventName): readonly SubEntry[] {
  return subs.get(eventName) ?? [];
}

export function clearAll(): void {
  subs.clear();
}