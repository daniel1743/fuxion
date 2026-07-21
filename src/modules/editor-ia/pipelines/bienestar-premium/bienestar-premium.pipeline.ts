/**
 * BAIOS - Editor IA
 * Pipeline: Biblioteca Premium de Bienestar en Claro
 * Pipeline Definition & Config — v1.0.0
 */

import type { PipelineDefinition } from '../../core/pipeline-runtime/pipeline.factory';
import { BienestarPipelineSteps } from './bienestar-premium.types';

export const BIENESTAR_PREMIUM_PIPELINE_DEFINITION: PipelineDefinition = {
  id: 'bienestar-premium',
  name: 'Pipeline Premium de Bienestar en Claro',
  description:
    'Flujo automatizado de investigación científica, enrutamiento IA, SEO, generación de imágenes con FLUX (BFL) y publicación programada en CMS.',
  stages: [
    {
      name: 'Recepción del Tema',
      stepId: BienestarPipelineSteps.TRIGGER,
      order: 0,
    },
    {
      name: 'Procesamiento con IA (Redacción y SEO)',
      stepId: BienestarPipelineSteps.IA_REDACTOR,
      order: 1,
    },
    {
      name: 'Generación de Imagen (Black Forest Labs)',
      stepId: BienestarPipelineSteps.BFL_IMAGE,
      order: 2,
    },
    {
      name: 'Carga de Imagen al CMS',
      stepId: BienestarPipelineSteps.MEDIA_UPLOAD,
      order: 3,
    },
    {
      name: 'Ensamblaje y Programación del Artículo',
      stepId: BienestarPipelineSteps.CMS_PUBLICATION,
      order: 4,
    },
  ],
};

export const BIENESTAR_PREMIUM_PIPELINE_CONFIG = {
  /** Tiempo máximo por etapa (segundos) */
  stage_timeout_seconds: 180,
  /** Reintentos máximos por etapa */
  max_stage_retries: 2,
  /** Endpoint por defecto del LLM (Claude via OpenRouter o directo) */
  llm_default_endpoint: 'https://api.anthropic.com/v1/messages',
  /** Modelo por defecto */
  llm_default_model: 'claude-sonnet-4-20250514',
  /** Endpoint de Black Forest Labs */
  bfl_default_endpoint: 'https://api.bfl.ml/v1/generate',
  /** Modelo de BFL por defecto */
  bfl_default_model: 'flux-pro',
  /** Dimensiones de imagen por defecto */
  bfl_default_width: 1920,
  bfl_default_height: 1080,
  /** CMS endpoint (WordPress REST API) */
  cms_default_media_endpoint: '/wp-json/wp/v2/media',
  cms_default_posts_endpoint: '/wp-json/wp/v2/posts',
} as const;