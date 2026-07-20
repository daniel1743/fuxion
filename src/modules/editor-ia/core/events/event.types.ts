/**
 * BAIOS - Editor IA
 * Event Types — Phase 1B
 * Type-level contracts only. No implementations.
 */

import type { EditorEventName } from './event.names';

/** Base event envelope — all editor events conform to this shape */
export interface EditorEvent<T extends EditorEventName = EditorEventName> {
  /** Unique event instance ID */
  event_id: string;
  /** Event name from the registry */
  name: T;
  /** ISO-8601 timestamp of event creation */
  timestamp: string;
  /** ID of the originating content job */
  job_id: string;
  /** Event-specific payload */
  payload: unknown;
}

/** Strongly-typed event envelope */
export interface TypedEditorEvent<
  T extends EditorEventName,
  P,
> extends EditorEvent<T> {
  payload: P;
}

/** Event handler contract — subscribers must conform to this signature */
export type EventHandler<
  T extends EditorEventName = EditorEventName,
> = (event: EditorEvent<T>) => void;

/** Typed event handler */
export type TypedEventHandler<T extends EditorEventName, P> = (
  event: TypedEditorEvent<T, P>,
) => void;