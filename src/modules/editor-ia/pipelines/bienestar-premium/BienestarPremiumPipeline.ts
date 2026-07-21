/**
 * BAIOS - Editor IA
 * Pipeline: Biblioteca Premium de Bienestar en Claro
 * Core Executor — v1.0.0
 *
 * Implementa los 5 pasos del pipeline automatizado:
 *  1. TRIGGER — Recepción y validación del tema
 *  2. IA_REDACTOR — Procesamiento LLM: redacción + SEO + prompt de imagen
 *  3. BFL_IMAGE — Generación de imagen con Black Forest Labs
 *  4. MEDIA_UPLOAD — Descarga y subida de imagen al CMS
 *  5. CMS_PUBLICATION — Ensamblaje y programación del artículo
 */

import type {
  BienestarPipelineContext,
  BienestarTriggerInput,
  IARedactorOutput,
  BFLImageOutput,
  MediaUploadOutput,
  CMSPublicationOutput,
  BienestarPipelineConfig,
} from './bienestar-premium.types';
import { BIENESTAR_SYSTEM_PROMPT, BienestarPipelineSteps } from './bienestar-premium.types';
import {
  BIENESTAR_PREMIUM_PIPELINE_CONFIG,
} from './bienestar-premium.pipeline';
import type { PipelineStep } from '../../core/pipeline-runtime/pipeline.step';

// ─── Step 1: TRIGGER ──────────────────────────────────────────────

export function executeTriggerStep(
  ctx: BienestarPipelineContext,
): BienestarPipelineContext {
  const { trigger } = ctx;
  if (!trigger || !trigger.tema_solicitado) {
    throw new Error(
      '[BienestarPremium::TRIGGER] Falta "tema_solicitado" en el trigger de entrada.',
    );
  }

  const warnings: string[] = [];
  if (!trigger.fecha_publicacion) {
    warnings.push(
      '[BienestarPremium::TRIGGER] No se especificó fecha_publicacion. Se usará fecha actual + 7 días.',
    );
  }

  const now = new Date();
  const defaultDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const enrichedCtx: BienestarPipelineContext = {
    ...ctx,
    trigger: {
      ...trigger,
      fecha_publicacion: trigger.fecha_publicacion || defaultDate,
      fuente: trigger.fuente || 'manual',
    },
    warnings: [...(ctx.warnings || []), ...warnings],
  };

  return enrichedCtx;
}

// ─── Step 2: IA_REDACTOR ───────────────────────────────────────────

export async function executeIARedactorStep(
  ctx: BienestarPipelineContext,
  config: BienestarPipelineConfig,
): Promise<BienestarPipelineContext> {
  const endpoint =
    config.llm_endpoint || BIENESTAR_PREMIUM_PIPELINE_CONFIG.llm_default_endpoint;
  const model =
    config.llm_model || BIENESTAR_PREMIUM_PIPELINE_CONFIG.llm_default_model;
  const apiKey = config.llm_api_key || process.env.ANTHROPIC_API_KEY || '';

  if (!apiKey) {
    throw new Error(
      '[BienestarPremium::IA_REDACTOR] No se encontró API key para el LLM. Configura llm_api_key o ANTHROPIC_API_KEY.',
    );
  }

  const prompt = BIENESTAR_SYSTEM_PROMPT.replace(
    '{{TEMA_SOLICITADO}}',
    ctx.trigger.tema_solicitado,
  );

  const body = {
    model,
    max_tokens: 4096,
    temperature: 0.7,
    system: prompt,
    messages: [
      {
        role: 'user',
        content: `Redacta un artículo completo sobre: "${ctx.trigger.tema_solicitado}". Responde SOLO con el JSON.`,
      },
    ],
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `[BienestarPremium::IA_REDACTOR] Error del LLM (${response.status}): ${errText}`,
    );
  }

  const data = await response.json();
  const rawContent = data?.content?.[0]?.text || '';
  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      '[BienestarPremium::IA_REDACTOR] El LLM no devolvió un JSON válido.',
    );
  }

  let iaOutput: IARedactorOutput;
  try {
    iaOutput = JSON.parse(jsonMatch[0]) as IARedactorOutput;
  } catch {
    throw new Error(
      '[BienestarPremium::IA_REDACTOR] Falló el parseo del JSON devuelto por el LLM.',
    );
  }

  if (!iaOutput.contenido_markdown || !iaOutput.seo_slug) {
    throw new Error(
      '[BienestarPremium::IA_REDACTOR] El JSON del LLM está incompleto. Faltan campos requeridos.',
    );
  }

  return {
    ...ctx,
    ia_output: iaOutput,
  };
}

// ─── Step 3: BFL_IMAGE ─────────────────────────────────────────────

export async function executeBFLImageStep(
  ctx: BienestarPipelineContext,
  config: BienestarPipelineConfig,
): Promise<BienestarPipelineContext> {
  if (!ctx.ia_output?.bfl_image_prompt) {
    throw new Error(
      '[BienestarPremium::BFL_IMAGE] No hay bfl_image_prompt. Ejecuta primero el paso IA_REDACTOR.',
    );
  }

  const endpoint =
    config.bfl_endpoint || BIENESTAR_PREMIUM_PIPELINE_CONFIG.bfl_default_endpoint;
  const apiKey = config.bfl_api_key || process.env.BFL_API_KEY || '';

  if (!apiKey) {
    throw new Error(
      '[BienestarPremium::BFL_IMAGE] No se encontró API key de Black Forest Labs. Configura bfl_api_key o BFL_API_KEY.',
    );
  }

  const prompt = `${ctx.ia_output.bfl_image_prompt}, highly detailed, 8k resolution, cinematic lighting, medical/wellness context, professional photography --no text`;
  const width = BIENESTAR_PREMIUM_PIPELINE_CONFIG.bfl_default_width;
  const height = BIENESTAR_PREMIUM_PIPELINE_CONFIG.bfl_default_height;
  const model = BIENESTAR_PREMIUM_PIPELINE_CONFIG.bfl_default_model;

  const body = {
    model,
    prompt,
    width,
    height,
    output_format: 'jpeg',
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `[BienestarPremium::BFL_IMAGE] Error de BFL API (${response.status}): ${errText}`,
    );
  }

  const data = await response.json();
  const imageUrl = data?.data?.url || data?.url || data?.image_url;

  if (!imageUrl) {
    throw new Error(
      '[BienestarPremium::BFL_IMAGE] La API de BFL no devolvió una URL de imagen.',
    );
  }

  const bflOutput: BFLImageOutput = {
    image_url: imageUrl,
    model,
    width,
    height,
    generated_at: new Date().toISOString(),
  };

  return {
    ...ctx,
    bfl_output: bflOutput,
  };
}

// ─── Step 4: MEDIA_UPLOAD ──────────────────────────────────────────

export async function executeMediaUploadStep(
  ctx: BienestarPipelineContext,
  config: BienestarPipelineConfig,
): Promise<BienestarPipelineContext> {
  if (!ctx.bfl_output?.image_url) {
    throw new Error(
      '[BienestarPremium::MEDIA_UPLOAD] No hay image_url. Ejecuta primero el paso BFL_IMAGE.',
    );
  }

  const baseUrl = config.cms_base_url || process.env.WP_BASE_URL || '';
  if (!baseUrl) {
    throw new Error(
      '[BienestarPremium::MEDIA_UPLOAD] No se encontró la URL base del CMS. Configura cms_base_url o WP_BASE_URL.',
    );
  }

  const username = config.cms_username || process.env.WP_USERNAME || '';
  const appPassword = config.cms_application_password || process.env.WP_APP_PASSWORD || '';

  if (!username || !appPassword) {
    throw new Error(
      '[BienestarPremium::MEDIA_UPLOAD] Faltan credenciales del CMS (username/application_password).',
    );
  }

  // 1. Descargar la imagen de BFL
  const imageResponse = await fetch(ctx.bfl_output.image_url);
  if (!imageResponse.ok) {
    throw new Error(
      `[BienestarPremium::MEDIA_UPLOAD] Error al descargar imagen de BFL (${imageResponse.status}).`,
    );
  }

  const imageBlob = await imageResponse.blob();
  const fileName = `bienestar-${ctx.trigger.tema_solicitado
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)}-${Date.now()}.jpeg`;

  const altText =
    ctx.ia_output?.seo_meta_title
      ? `${ctx.ia_output.seo_meta_title} - Bienestar en Claro`
      : `${ctx.trigger.tema_solicitado} - Bienestar en Claro`;

  const title = ctx.ia_output?.seo_meta_title || ctx.trigger.tema_solicitado;

  // 2. Subir al CMS
  const formData = new FormData();
  formData.append('file', imageBlob, fileName);
  formData.append('title', title);
  formData.append('alt_text', altText);

  const auth = btoa(`${username}:${appPassword}`);
  const mediaEndpoint = `${baseUrl.replace(/\/$/, '')}${BIENESTAR_PREMIUM_PIPELINE_CONFIG.cms_default_media_endpoint}`;

  const uploadResponse = await fetch(mediaEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
    },
    body: formData,
  });

  if (!uploadResponse.ok) {
    const errText = await uploadResponse.text();
    throw new Error(
      `[BienestarPremium::MEDIA_UPLOAD] Error al subir imagen al CMS (${uploadResponse.status}): ${errText}`,
    );
  }

  const mediaData = await uploadResponse.json();
  const mediaId = mediaData?.id;
  const cmsUrl = mediaData?.source_url || mediaData?.guid?.rendered || '';

  if (!mediaId) {
    throw new Error(
      '[BienestarPremium::MEDIA_UPLOAD] El CMS no devolvió un media_id válido.',
    );
  }

  const mediaOutput: MediaUploadOutput = {
    media_id: mediaId,
    cms_url: cmsUrl,
    alt_text: altText,
  };

  return {
    ...ctx,
    media_output: mediaOutput,
  };
}

// ─── Step 5: CMS_PUBLICATION ───────────────────────────────────────

export async function executeCMSPublicationStep(
  ctx: BienestarPipelineContext,
  config: BienestarPipelineConfig,
): Promise<BienestarPipelineContext> {
  if (!ctx.ia_output) {
    throw new Error(
      '[BienestarPremium::CMS_PUBLICATION] No hay ia_output. Ejecuta primero el paso IA_REDACTOR.',
    );
  }

  const baseUrl = config.cms_base_url || process.env.WP_BASE_URL || '';
  if (!baseUrl) {
    throw new Error(
      '[BienestarPremium::CMS_PUBLICATION] No se encontró la URL base del CMS.',
    );
  }

  const username = config.cms_username || process.env.WP_USERNAME || '';
  const appPassword = config.cms_application_password || process.env.WP_APP_PASSWORD || '';

  if (!username || !appPassword) {
    throw new Error(
      '[BienestarPremium::CMS_PUBLICATION] Faltan credenciales del CMS.',
    );
  }

  const auth = btoa(`${username}:${appPassword}`);
  const postsEndpoint = `${baseUrl.replace(/\/$/, '')}${BIENESTAR_PREMIUM_PIPELINE_CONFIG.cms_default_posts_endpoint}`;

  // Construir el contenido HTML a partir del Markdown
  const htmlContent = markdownToHtml(ctx.ia_output.contenido_markdown);

  const postBody: Record<string, unknown> = {
    title: ctx.ia_output.seo_meta_title,
    content: htmlContent,
    slug: ctx.ia_output.seo_slug,
    status: 'future', // Programado
    date: ctx.trigger.fecha_publicacion,
    meta: {
      _yoast_wpseo_title: ctx.ia_output.seo_meta_title,
      _yoast_wpseo_metadesc: ctx.ia_output.seo_meta_description,
    },
  };

  // Si hay imagen destacada, adjuntarla
  if (ctx.media_output?.media_id) {
    postBody.featured_media = ctx.media_output.media_id;
  }

  const postResponse = await fetch(postsEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postBody),
  });

  if (!postResponse.ok) {
    const errText = await postResponse.text();
    throw new Error(
      `[BienestarPremium::CMS_PUBLICATION] Error al crear post en CMS (${postResponse.status}): ${errText}`,
    );
  }

  const postData = await postResponse.json();
  const postId = postData?.id;
  const postUrl = postData?.link || '';

  if (!postId) {
    throw new Error(
      '[BienestarPremium::CMS_PUBLICATION] El CMS no devolvió un post_id válido.',
    );
  }

  const publicationOutput: CMSPublicationOutput = {
    post_url: postUrl,
    estado_final: 'Programado con éxito',
    post_id: postId,
    fecha_publicacion: ctx.trigger.fecha_publicacion,
  };

  return {
    ...ctx,
    publication_output: publicationOutput,
  };
}

// ─── Helpers ───────────────────────────────────────────────────────

/** Conversión básica de Markdown a HTML */
function markdownToHtml(md: string): string {
  let html = md
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
    // Lists
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    // Paragraphs
    .replace(/^(?!<[hlu]|<\/?[hlu])(.+)$/gm, '<p>$1</p>')
    // Clean empty paragraphs
    .replace(/<p>\s*<\/p>/g, '');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*?<\/li>\s*)+)/g, '<ul>$1</ul>');

  return html;
}

// ─── Pipeline Step Executor Router ──────────────────────────────────

interface BienestarStepHandler {
  stepId: string;
  execute: (
    ctx: BienestarPipelineContext,
    config: BienestarPipelineConfig,
  ) => Promise<BienestarPipelineContext> | BienestarPipelineContext;
}

export const BIENESTAR_STEP_HANDLERS: BienestarStepHandler[] = [
  {
    stepId: BienestarPipelineSteps.TRIGGER,
    execute: (ctx) => executeTriggerStep(ctx),
  },
  {
    stepId: BienestarPipelineSteps.IA_REDACTOR,
    execute: (ctx, cfg) => executeIARedactorStep(ctx, cfg),
  },
  {
    stepId: BienestarPipelineSteps.BFL_IMAGE,
    execute: (ctx, cfg) => executeBFLImageStep(ctx, cfg),
  },
  {
    stepId: BienestarPipelineSteps.MEDIA_UPLOAD,
    execute: (ctx, cfg) => executeMediaUploadStep(ctx, cfg),
  },
  {
    stepId: BienestarPipelineSteps.CMS_PUBLICATION,
    execute: (ctx, cfg) => executeCMSPublicationStep(ctx, cfg),
  },
];

/**
 * Ejecuta el pipeline completo de Bienestar Premium.
 * Recorre secuencialmente los 5 pasos.
 */
export async function runBienestarPremiumPipeline(
  ctx: BienestarPipelineContext,
  config: BienestarPipelineConfig = {},
): Promise<BienestarPipelineContext> {
  let currentCtx = { ...ctx };

  for (const handler of BIENESTAR_STEP_HANDLERS) {
    const stepStart = Date.now();
    try {
      currentCtx = {
        ...(await handler.execute(currentCtx, config)),
        current_stage: handler.stepId,
      };
      const duration = Date.now() - stepStart;
      console.log(
        `[BienestarPremium] ✅ ${handler.stepId} completado en ${duration}ms`,
      );
    } catch (err) {
      const duration = Date.now() - stepStart;
      console.error(
        `[BienestarPremium] ❌ ${handler.stepId} falló en ${duration}ms:`,
        (err as Error).message,
      );
      throw err;
    }
  }

  return currentCtx;
}