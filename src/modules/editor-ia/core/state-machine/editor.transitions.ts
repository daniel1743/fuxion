/**
 * BAIOS - Editor IA
 * Editor State Transitions — Phase 1B
 * Valid transition map for the editorial state machine. No logic.
 */

import type { EditorState } from './editor.states';

/** Represents a valid transition from one state to another */
export interface StateTransition {
  from: EditorState;
  to: EditorState;
  /** The event that triggers this transition */
  trigger: string;
  /** Human-readable description */
  description: string;
}

/** Complete transition map — all valid editorial flows */
export const TRANSITIONS: readonly StateTransition[] = [
  {
    from: 'DRAFT',
    to: 'KNOWLEDGE_READY',
    trigger: 'editor:knowledge:retrieved',
    description: 'Base de conocimiento recuperada para el borrador',
  },
  {
    from: 'KNOWLEDGE_READY',
    to: 'OUTLINE_READY',
    trigger: 'editor:outline:generated',
    description: 'Esquema editorial generado',
  },
  {
    from: 'OUTLINE_READY',
    to: 'CONTENT_READY',
    trigger: 'editor:article:generated',
    description: 'Contenido del artículo generado',
  },
  {
    from: 'CONTENT_READY',
    to: 'SEO_READY',
    trigger: 'editor:seo:completed',
    description: 'Optimización SEO completada',
  },
  {
    from: 'SEO_READY',
    to: 'MEDIA_READY',
    trigger: 'editor:media:selected',
    description: 'Activos multimedia seleccionados',
  },
  {
    from: 'MEDIA_READY',
    to: 'QUALITY_READY',
    trigger: 'editor:quality-review:completed',
    description: 'Revisión de calidad automatizada completada',
  },
  {
    from: 'QUALITY_READY',
    to: 'READY_FOR_EDITOR',
    trigger: 'editor:quality-review:completed',
    description: 'Contenido listo para revisión del editor',
  },
  {
    from: 'READY_FOR_EDITOR',
    to: 'APPROVED',
    trigger: 'editor:approval:approved',
    description: 'Editor aprueba el contenido',
  },
  {
    from: 'APPROVED',
    to: 'QUEUED',
    trigger: 'editor:job:scheduled',
    description: 'Artículo encolado para publicación',
  },
  {
    from: 'QUEUED',
    to: 'SCHEDULED',
    trigger: 'editor:job:scheduled',
    description: 'Publicación programada',
  },
  {
    from: 'SCHEDULED',
    to: 'PUBLISHED',
    trigger: 'editor:article:published',
    description: 'Artículo publicado exitosamente',
  },
  {
    from: 'PUBLISHED',
    to: 'ARCHIVED',
    trigger: 'editor:article:published',
    description: 'Artículo archivado tras publicación',
  },
] as const;

/** All states can transition to FAILED on error */
export const ERROR_TRANSITION: StateTransition = {
  from: 'DRAFT' as EditorState, // placeholder — any state can fail
  to: 'FAILED',
  trigger: 'editor:job:failed',
  description: 'Error en cualquier etapa del pipeline',
};

/** Lookup: given a state, returns all valid next states */
export const VALID_NEXT_STATES: Record<EditorState, EditorState[]> = {
  DRAFT: ['KNOWLEDGE_READY', 'FAILED'],
  KNOWLEDGE_READY: ['OUTLINE_READY', 'FAILED'],
  OUTLINE_READY: ['CONTENT_READY', 'FAILED'],
  CONTENT_READY: ['SEO_READY', 'FAILED'],
  SEO_READY: ['MEDIA_READY', 'FAILED'],
  MEDIA_READY: ['QUALITY_READY', 'FAILED'],
  QUALITY_READY: ['READY_FOR_EDITOR', 'FAILED'],
  READY_FOR_EDITOR: ['APPROVED', 'FAILED'],
  APPROVED: ['QUEUED', 'FAILED'],
  QUEUED: ['SCHEDULED', 'FAILED'],
  SCHEDULED: ['PUBLISHED', 'FAILED'],
  PUBLISHED: ['ARCHIVED'],
  ARCHIVED: [],
  FAILED: [],
};