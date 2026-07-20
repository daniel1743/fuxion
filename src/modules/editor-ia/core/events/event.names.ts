/**
 * BAIOS - Editor IA
 * Event Names — Phase 1B
 * Immutable event name registry. No logic.
 */

export const EDITOR_EVENTS = {
  /** A new content job has been created and queued for processing */
  CONTENT_JOB_CREATED: 'editor:content-job:created',

  /** Knowledge base retrieval completed for a content job */
  KNOWLEDGE_RETRIEVED: 'editor:knowledge:retrieved',

  /** Editorial outline has been generated */
  OUTLINE_GENERATED: 'editor:outline:generated',

  /** Article content generation completed */
  ARTICLE_GENERATED: 'editor:article:generated',

  /** SEO optimization completed */
  SEO_COMPLETED: 'editor:seo:completed',

  /** Media assets selected and associated */
  MEDIA_SELECTED: 'editor:media:selected',

  /** Quality review automation completed */
  QUALITY_REVIEW_COMPLETED: 'editor:quality-review:completed',

  /** Editor has manually approved the content */
  EDITOR_APPROVED: 'editor:approval:approved',

  /** Content job scheduled for publication */
  JOB_SCHEDULED: 'editor:job:scheduled',

  /** Article successfully published */
  ARTICLE_PUBLISHED: 'editor:article:published',

  /** Job failed at any stage */
  JOB_FAILED: 'editor:job:failed',
} as const;

export type EditorEventName =
  (typeof EDITOR_EVENTS)[keyof typeof EDITOR_EVENTS];