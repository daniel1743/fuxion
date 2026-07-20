/**
 * BAIOS - Editor IA
 * Editor States — Phase 1B
 * All valid states for the editorial state machine. No logic.
 */

export const EDITOR_STATES = [
  'DRAFT',
  'KNOWLEDGE_READY',
  'OUTLINE_READY',
  'CONTENT_READY',
  'SEO_READY',
  'MEDIA_READY',
  'QUALITY_READY',
  'READY_FOR_EDITOR',
  'APPROVED',
  'QUEUED',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
  'FAILED',
] as const;

export type EditorState = (typeof EDITOR_STATES)[number];

/** Terminal states — no further transitions possible */
export const TERMINAL_STATES: ReadonlySet<EditorState> = new Set([
  'ARCHIVED',
  'FAILED',
]);

/** Human-readable labels for each state */
export const STATE_LABELS: Record<EditorState, string> = {
  DRAFT: 'Borrador',
  KNOWLEDGE_READY: 'Conocimiento Listo',
  OUTLINE_READY: 'Esquema Listo',
  CONTENT_READY: 'Contenido Listo',
  SEO_READY: 'SEO Listo',
  MEDIA_READY: 'Medios Listos',
  QUALITY_READY: 'Calidad Verificada',
  READY_FOR_EDITOR: 'Listo para Editor',
  APPROVED: 'Aprobado',
  QUEUED: 'En Cola',
  SCHEDULED: 'Programado',
  PUBLISHED: 'Publicado',
  ARCHIVED: 'Archivado',
  FAILED: 'Fallido',
};