/**
 * BAIOS - Editor IA
 * Pipeline: Biblioteca Premium de Bienestar en Claro
 * CommonJS Adapter — v1.0.0
 *
 * Puente entre la API serverless (CommonJS) y el pipeline TypeScript.
 * Proporciona la misma funcionalidad que BienestarPremiumPipeline.ts
 * pero en un módulo require()-able desde api/bienestar-pipeline.js
 */

// ─── Tipos (JSDoc para intellisense en JS) ──────────────────────

/**
 * @typedef {'Articulo_Unico'|'Serie'} TipoContenido
 *
 * @typedef {object} IARedactorOutput
 * @property {TipoContenido} tipo_contenido
 * @property {string} contenido_markdown
 * @property {string} seo_slug
 * @property {string} seo_meta_title
 * @property {string} seo_meta_description
 * @property {string} bfl_image_prompt
 *
 * @typedef {object} BFLImageOutput
 * @property {string} image_url
 * @property {string} model
 * @property {number} width
 * @property {number} height
 * @property {string} generated_at
 *
 * @typedef {object} MediaUploadOutput
 * @property {number} media_id
 * @property {string} cms_url
 * @property {string} alt_text
 *
 * @typedef {object} CMSPublicationOutput
 * @property {string} post_url
 * @property {'Programado con éxito'|'Publicado'|'Error'} estado_final
 * @property {number} post_id
 * @property {string} fecha_publicacion
 *
 * @typedef {object} BienestarPipelineContext
 * @property {string} pipeline_id
 * @property {object} job
 * @property {Array} stages
 * @property {string} current_stage
 * @property {string} traceId
 * @property {object} trigger
 * @property {string} trigger.tema_solicitado
 * @property {string} trigger.fecha_publicacion
 * @property {string} [trigger.fuente]
 * @property {IARedactorOutput|null} ia_output
 * @property {BFLImageOutput|null} bfl_output
 * @property {MediaUploadOutput|null} media_output
 * @property {CMSPublicationOutput|null} publication_output
 * @property {Array} steps
 * @property {number} currentStepIndex
 * @property {Array} history
 * @property {Array<string>} warnings
 * @property {string|null} startedAt
 * @property {string|null} completedAt
 *
 * @typedef {object} BienestarPipelineConfig
 * @property {string} [llm_api_key]
 * @property {string} [llm_endpoint]
 * @property {string} [llm_model]
 * @property {string} [bfl_api_key]
 * @property {string} [bfl_endpoint]
 * @property {string} [cms_base_url]
 * @property {string} [cms_username]
 * @property {string} [cms_application_password]
 */

// ─── Constantes ──────────────────────────────────────────────────

const BIENESTAR_SYSTEM_PROMPT = `Eres el editor médico automatizado de 'Bienestar en Claro'.
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

const DEFAULTS = {
  llm_endpoint: 'https://api.anthropic.com/v1/messages',
  llm_model: 'claude-sonnet-4-20250514',
  bfl_endpoint: 'https://api.bfl.ml/v1/generate',
  bfl_model: 'flux-pro',
  bfl_width: 1920,
  bfl_height: 1080,
  cms_media_endpoint: '/wp-json/wp/v2/media',
  cms_posts_endpoint: '/wp-json/wp/v2/posts',
};

// ─── Step 1: TRIGGER ─────────────────────────────────────────────

function executeTriggerStep(ctx) {
  if (!ctx || !ctx.trigger || !ctx.trigger.tema_solicitado) {
    throw new Error('[BienestarPremium::TRIGGER] Falta "tema_solicitado" en el trigger de entrada.');
  }

  const warnings = [];
  if (!ctx.trigger.fecha_publicacion) {
    warnings.push('[BienestarPremium::TRIGGER] No se especificó fecha_publicacion. Se usará fecha actual + 7 días.');
  }

  const now = new Date();
  const defaultDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return {
    ...ctx,
    trigger: {
      ...ctx.trigger,
      fecha_publicacion: ctx.trigger.fecha_publicacion || defaultDate,
      fuente: ctx.trigger.fuente || 'manual',
    },
    warnings: [...(ctx.warnings || []), ...warnings],
  };
}

// ─── Step 2: IA_REDACTOR ──────────────────────────────────────────

async function executeIARedactorStep(ctx, config) {
  const endpoint = config.llm_endpoint || DEFAULTS.llm_endpoint;
  const model = config.llm_model || DEFAULTS.llm_model;
  const apiKey = config.llm_api_key || process.env.ANTHROPIC_API_KEY || '';

  if (!apiKey) {
    throw new Error('[BienestarPremium::IA_REDACTOR] No se encontró API key para el LLM.');
  }

  const prompt = BIENESTAR_SYSTEM_PROMPT.replace('{{TEMA_SOLICITADO}}', ctx.trigger.tema_solicitado);

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
    throw new Error(`[BienestarPremium::IA_REDACTOR] Error del LLM (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const rawContent = (data && data.content && data.content[0] && data.content[0].text) || '';
  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('[BienestarPremium::IA_REDACTOR] El LLM no devolvió un JSON válido.');
  }

  /** @type {IARedactorOutput} */
  let iaOutput;
  try {
    iaOutput = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('[BienestarPremium::IA_REDACTOR] Falló el parseo del JSON devuelto por el LLM.');
  }

  if (!iaOutput.contenido_markdown || !iaOutput.seo_slug) {
    throw new Error('[BienestarPremium::IA_REDACTOR] El JSON del LLM está incompleto.');
  }

  return { ...ctx, ia_output: iaOutput };
}

// ─── Step 3: BFL_IMAGE ────────────────────────────────────────────

async function executeBFLImageStep(ctx, config) {
  if (!ctx.ia_output || !ctx.ia_output.bfl_image_prompt) {
    throw new Error('[BienestarPremium::BFL_IMAGE] No hay bfl_image_prompt. Ejecuta primero el paso IA_REDACTOR.');
  }

  const endpoint = config.bfl_endpoint || DEFAULTS.bfl_endpoint;
  const apiKey = config.bfl_api_key || process.env.BFL_API_KEY || '';

  if (!apiKey) {
    throw new Error('[BienestarPremium::BFL_IMAGE] No se encontró API key de Black Forest Labs.');
  }

  const prompt = `${ctx.ia_output.bfl_image_prompt}, highly detailed, 8k resolution, cinematic lighting, medical/wellness context, professional photography --no text`;
  const width = DEFAULTS.bfl_width;
  const height = DEFAULTS.bfl_height;
  const model = DEFAULTS.bfl_model;

  const body = { model, prompt, width, height, output_format: 'jpeg' };

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
    throw new Error(`[BienestarPremium::BFL_IMAGE] Error de BFL API (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const imageUrl = (data && data.data && data.data.url) || (data && data.url) || (data && data.image_url);

  if (!imageUrl) {
    throw new Error('[BienestarPremium::BFL_IMAGE] La API de BFL no devolvió una URL de imagen.');
  }

  /** @type {BFLImageOutput} */
  const bflOutput = {
    image_url: imageUrl,
    model,
    width,
    height,
    generated_at: new Date().toISOString(),
  };

  return { ...ctx, bfl_output: bflOutput };
}

// ─── Step 4: MEDIA_UPLOAD ─────────────────────────────────────────

async function executeMediaUploadStep(ctx, config) {
  if (!ctx.bfl_output || !ctx.bfl_output.image_url) {
    throw new Error('[BienestarPremium::MEDIA_UPLOAD] No hay image_url. Ejecuta primero el paso BFL_IMAGE.');
  }

  const baseUrl = config.cms_base_url || process.env.WP_BASE_URL || '';
  if (!baseUrl) {
    throw new Error('[BienestarPremium::MEDIA_UPLOAD] No se encontró la URL base del CMS.');
  }

  const username = config.cms_username || process.env.WP_USERNAME || '';
  const appPassword = config.cms_application_password || process.env.WP_APP_PASSWORD || '';

  if (!username || !appPassword) {
    throw new Error('[BienestarPremium::MEDIA_UPLOAD] Faltan credenciales del CMS.');
  }

  // Descargar imagen
  const imageResponse = await fetch(ctx.bfl_output.image_url);
  if (!imageResponse.ok) {
    throw new Error(`[BienestarPremium::MEDIA_UPLOAD] Error al descargar imagen de BFL (${imageResponse.status}).`);
  }

  const imageBlob = await imageResponse.blob();
  const slugPart = ctx.trigger.tema_solicitado
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
  const fileName = `bienestar-${slugPart}-${Date.now()}.jpeg`;

  const altText = ctx.ia_output && ctx.ia_output.seo_meta_title
    ? `${ctx.ia_output.seo_meta_title} - Bienestar en Claro`
    : `${ctx.trigger.tema_solicitado} - Bienestar en Claro`;

  const title = (ctx.ia_output && ctx.ia_output.seo_meta_title) || ctx.trigger.tema_solicitado;

  // Subir al CMS
  const formData = new FormData();
  formData.append('file', imageBlob, fileName);
  formData.append('title', title);
  formData.append('alt_text', altText);

  const auth = Buffer.from(`${username}:${appPassword}`).toString('base64');
  const mediaEndpoint = `${baseUrl.replace(/\/$/, '')}${DEFAULTS.cms_media_endpoint}`;

  const uploadResponse = await fetch(mediaEndpoint, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}` },
    body: formData,
  });

  if (!uploadResponse.ok) {
    const errText = await uploadResponse.text();
    throw new Error(`[BienestarPremium::MEDIA_UPLOAD] Error al subir imagen al CMS (${uploadResponse.status}): ${errText}`);
  }

  const mediaData = await uploadResponse.json();
  const mediaId = mediaData && mediaData.id;
  const cmsUrl = (mediaData && mediaData.source_url) || (mediaData && mediaData.guid && mediaData.guid.rendered) || '';

  if (!mediaId) {
    throw new Error('[BienestarPremium::MEDIA_UPLOAD] El CMS no devolvió un media_id válido.');
  }

  /** @type {MediaUploadOutput} */
  const mediaOutput = { media_id: mediaId, cms_url: cmsUrl, alt_text: altText };

  return { ...ctx, media_output: mediaOutput };
}

// ─── Step 5: CMS_PUBLICATION ──────────────────────────────────────

async function executeCMSPublicationStep(ctx, config) {
  if (!ctx.ia_output) {
    throw new Error('[BienestarPremium::CMS_PUBLICATION] No hay ia_output. Ejecuta primero el paso IA_REDACTOR.');
  }

  const baseUrl = config.cms_base_url || process.env.WP_BASE_URL || '';
  if (!baseUrl) {
    throw new Error('[BienestarPremium::CMS_PUBLICATION] No se encontró la URL base del CMS.');
  }

  const username = config.cms_username || process.env.WP_USERNAME || '';
  const appPassword = config.cms_application_password || process.env.WP_APP_PASSWORD || '';

  if (!username || !appPassword) {
    throw new Error('[BienestarPremium::CMS_PUBLICATION] Faltan credenciales del CMS.');
  }

  const auth = Buffer.from(`${username}:${appPassword}`).toString('base64');
  const postsEndpoint = `${baseUrl.replace(/\/$/, '')}${DEFAULTS.cms_posts_endpoint}`;

  const htmlContent = markdownToHtml(ctx.ia_output.contenido_markdown);

  /** @type {Record<string, unknown>} */
  const postBody = {
    title: ctx.ia_output.seo_meta_title,
    content: htmlContent,
    slug: ctx.ia_output.seo_slug,
    status: 'future',
    date: ctx.trigger.fecha_publicacion,
    meta: {
      _yoast_wpseo_title: ctx.ia_output.seo_meta_title,
      _yoast_wpseo_metadesc: ctx.ia_output.seo_meta_description,
    },
  };

  if (ctx.media_output && ctx.media_output.media_id) {
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
    throw new Error(`[BienestarPremium::CMS_PUBLICATION] Error al crear post en CMS (${postResponse.status}): ${errText}`);
  }

  const postData = await postResponse.json();
  const postId = postData && postData.id;
  const postUrl = (postData && postData.link) || '';

  if (!postId) {
    throw new Error('[BienestarPremium::CMS_PUBLICATION] El CMS no devolvió un post_id válido.');
  }

  /** @type {CMSPublicationOutput} */
  const publicationOutput = {
    post_url: postUrl,
    estado_final: 'Programado con éxito',
    post_id: postId,
    fecha_publicacion: ctx.trigger.fecha_publicacion,
  };

  return { ...ctx, publication_output: publicationOutput };
}

// ─── Helpers ──────────────────────────────────────────────────────

function markdownToHtml(md) {
  let html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/^(?!<[hlu]|<\/?[hlu])(.+)$/gm, '<p>$1</p>')
    .replace(/<p>\s*<\/p>/g, '');

  html = html.replace(/((?:<li>.*?<\/li>\s*)+)/g, '<ul>$1</ul>');
  return html;
}

// ─── Pipeline Runner ──────────────────────────────────────────────

const STEP_HANDLERS = [
  { stepId: 'trigger_entrada', execute: executeTriggerStep },
  { stepId: 'ia_redactor_enrutador', execute: executeIARedactorStep },
  { stepId: 'generacion_imagen_bfl', execute: executeBFLImageStep },
  { stepId: 'descarga_subida_imagen', execute: executeMediaUploadStep },
  { stepId: 'creacion_post_cms', execute: executeCMSPublicationStep },
];

/**
 * Ejecuta el pipeline completo de Bienestar Premium.
 * @param {BienestarPipelineContext} ctx
 * @param {BienestarPipelineConfig} config
 * @returns {Promise<BienestarPipelineContext>}
 */
async function runBienestarPremiumPipeline(ctx, config = {}) {
  let currentCtx = { ...ctx };

  for (const handler of STEP_HANDLERS) {
    const stepStart = Date.now();
    try {
      currentCtx = {
        ...(await handler.execute(currentCtx, config)),
        current_stage: handler.stepId,
      };
      const duration = Date.now() - stepStart;
      console.log(`[BienestarPremium] ✅ ${handler.stepId} completado en ${duration}ms`);
    } catch (err) {
      const duration = Date.now() - stepStart;
      console.error(`[BienestarPremium] ❌ ${handler.stepId} falló en ${duration}ms:`, err.message);
      throw err;
    }
  }

  currentCtx.completedAt = new Date().toISOString();
  return currentCtx;
}

// ─── Exports ──────────────────────────────────────────────────────

module.exports = {
  runBienestarPremiumPipeline,
  executeTriggerStep,
  executeIARedactorStep,
  executeBFLImageStep,
  executeMediaUploadStep,
  executeCMSPublicationStep,
  BIENESTAR_SYSTEM_PROMPT,
};