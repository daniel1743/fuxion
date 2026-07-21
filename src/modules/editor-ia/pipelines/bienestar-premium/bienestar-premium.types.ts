/**
 * BAIOS - Editor IA
 * Pipeline: Biblioteca Premium de Bienestar en Claro
 * Types — v1.0.0
 *
 * Define los contratos de datos para el pipeline automatizado
 * de investigación científica, enrutamiento, SEO, generación de
 * imágenes con FLUX (BFL) y publicación programada.
 */

import type { ContentJob } from '../../types';
import type { PipelineContext, PipelineStageResult } from '../../core/pipelines/pipeline.types';

// ─── Trigger de Entrada ─────────────────────────────────────────────

export interface BienestarTriggerInput {
  /** Tema solicitado por el editor */
  tema_solicitado: string;
  /** Fecha y hora de publicación programada (ISO 8601) */
  fecha_publicacion: string;
  /** Fuente opcional de datos (ej: Airtable, Notion, Webhook) */
  fuente?: 'webhook' | 'airtable' | 'notion' | 'manual';
}

// ─── Output del Redactor IA ─────────────────────────────────────────

export type TipoContenido = 'Articulo_Unico' | 'Serie';

export interface IARedactorOutput {
  /** Decisión de enrutamiento */
  tipo_contenido: TipoContenido;
  /** Contenido redactado en Markdown */
  contenido_markdown: string;
  /** Slug para SEO */
  seo_slug: string;
  /** Meta title para SEO */
  seo_meta_title: string;
  /** Meta description (máx. 160 caracteres) */
  seo_meta_description: string;
  /** Prompt en inglés para generación de imagen (BFL) */
  bfl_image_prompt: string;
}

// ─── Output de BFL Image Generation ─────────────────────────────────

export interface BFLImageOutput {
  /** URL temporal de la imagen generada */
  image_url: string;
  /** Modelo utilizado */
  model: string;
  /** Dimensiones */
  width: number;
  height: number;
  /** Timestamp de generación */
  generated_at: string;
}

// ─── Output de Media Upload ─────────────────────────────────────────

export interface MediaUploadOutput {
  /** ID de la imagen en el servidor CMS */
  media_id: number;
  /** URL permanente en el CMS */
  cms_url: string;
  /** Alt text asignado */
  alt_text: string;
}

// ─── Output de Publicación CMS ─────────────────────────────────────

export interface CMSPublicationOutput {
  /** URL del post publicado/programado */
  post_url: string;
  /** Estado final */
  estado_final: 'Programado con éxito' | 'Publicado' | 'Error';
  /** ID del post en el CMS */
  post_id: number;
  /** Fecha efectiva de publicación */
  fecha_publicacion: string;
}

// ─── Contexto del Pipeline de Bienestar Premium ──────────────────────

export interface BienestarPipelineContext extends PipelineContext {
  /** Datos del trigger de entrada */
  trigger: BienestarTriggerInput;
  /** Output del redactor IA (se popula en step 2) */
  ia_output: IARedactorOutput | null;
  /** Output de generación BFL (se popula en step 3) */
  bfl_output: BFLImageOutput | null;
  /** Output de subida de medios (se popula en step 4) */
  media_output: MediaUploadOutput | null;
  /** Output de publicación (se popula en step 5) */
  publication_output: CMSPublicationOutput | null;
}

// ─── Configuración de APIs ──────────────────────────────────────────

export interface BienestarPipelineConfig {
  /** API key para el LLM (Cloud Sonic / Claude) */
  llm_api_key?: string;
  /** Endpoint del LLM */
  llm_endpoint?: string;
  /** Modelo del LLM */
  llm_model?: string;
  /** API key de Black Forest Labs */
  bfl_api_key?: string;
  /** Endpoint de la API de BFL */
  bfl_endpoint?: string;
  /** URL base del CMS (WordPress REST API) */
  cms_base_url?: string;
  /** Credenciales del CMS */
  cms_username?: string;
  cms_application_password?: string;
}

// ─── System Prompt del Redactor ─────────────────────────────────────

export const BIENESTAR_SYSTEM_PROMPT = `Eres el editor médico automatizado de 'Bienestar en Claro'.
Analiza el tema: {{TEMA_SOLICITADO}}.

TAREAS:
1. ENRUTAMIENTO: Si el tema es muy amplio y complejo, decide que es una 'Serie' y redacta solo la 'Parte 1'. Si es específico, decide 'Artículo Único'.
2. REDACCIÓN: Escribe el artículo en Markdown (H2, H3). Utiliza un tono clínico, basado en evidencia.
3. SEO: Genera el Slug, Meta Title y Meta Description.
4. FOTOGRAFÍA: Escribe un prompt en INGLÉS altamente descriptivo y fotorrealista para generar una imagen médica/de bienestar abstracta o clínica que acompañe el texto.

Responde EXCLUSIVAMENTE con un JSON válido que siga esta estructura:
{
  "tipo_contenido": "Articulo_Unico" | "Serie",
  "contenido_markdown": "string (Markdown completo del artículo)",
  "seo_slug": "string (slug-url-amigable)",
  "seo_meta_title": "string (título SEO optimizado)",
  "seo_meta_description": "string (máx 160 caracteres)",
  "bfl_image_prompt": "string (prompt en inglés, altamente descriptivo, fotorrealista, para generación de imagen médica)"
}`;

// ─── Nombre de los pasos del pipeline ───────────────────────────────

export enum BienestarPipelineSteps {
  TRIGGER = 'trigger_entrada',
  IA_REDACTOR = 'ia_redactor_enrutador',
  BFL_IMAGE = 'generacion_imagen_bfl',
  MEDIA_UPLOAD = 'descarga_subida_imagen',
  CMS_PUBLICATION = 'creacion_post_cms',
}

export const BIENESTAR_PIPELINE_STAGES: Record<string, string> = {
  [BienestarPipelineSteps.TRIGGER]: 'Recepción del Tema',
  [BienestarPipelineSteps.IA_REDACTOR]: 'Procesamiento con IA (Redacción y SEO)',
  [BienestarPipelineSteps.BFL_IMAGE]: 'Generación de Imagen (Black Forest Labs)',
  [BienestarPipelineSteps.MEDIA_UPLOAD]: 'Carga de Imagen al CMS',
  [BienestarPipelineSteps.CMS_PUBLICATION]: 'Ensamblaje y Programación del Artículo',
};