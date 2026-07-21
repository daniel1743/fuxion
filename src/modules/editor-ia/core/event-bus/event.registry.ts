/**
 * BAIOS - Editor IA
 * Event Registry — Phase 2.003
 * Validates events against frozen contracts. No new events.
 */

import type { EditorEventName } from '../events/event.names';
import { EDITOR_EVENTS } from '../events/event.names';

const validEvents = new Set<string>(Object.values(EDITOR_EVENTS));

export function isValidEvent(name: string): name is EditorEventName {
  return validEvents.has(name);
}

export function validateEvent(name: string): EditorEventName {
  if (!isValidEvent(name)) {
    throw new Error(`Invalid event: ${name}`);
  }
  return name;
}