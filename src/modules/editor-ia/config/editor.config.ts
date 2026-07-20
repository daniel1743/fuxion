/**
 * BAIOS - Editor IA
 * Editor Configuration — Phase 1B
 * Runtime constants. No logic.
 */

import type { ContentFormat } from '../types';

export const EDITOR_CONFIG = {
  /** Maximum articles per batch generation */
  max_articles_per_batch: 10,

  /** Supported output formats */
  supported_formats: ['ARTICLE', 'REPORT', 'FAQ', 'SOCIAL_MEDIA'] as ContentFormat[],

  /** Default language for content generation */
  default_language: 'es',

  /** Supported languages */
  supported_languages: ['es', 'en'],

  /** Default tone for clinical content */
  default_clinical_tone: 'clinical' as const,

  /** Default tone for educational content */
  default_educational_tone: 'educational' as const,
} as const;