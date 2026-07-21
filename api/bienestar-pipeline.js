/**
 * API Endpoint: Pipeline Automatizado de Bienestar Premium en Claro
 * Webhook / Trigger — v1.0.0
 *
 * Recibe un tema y fecha de publicación desde Airtable, Notion o manual.
 * Ejecuta el pipeline completo: IA Redactor → BFL Image → Media Upload → CMS Publication.
 *
 * POST /api/bienestar-pipeline
 * Body: { tema_solicitado: string, fecha_publicacion?: string, fuente?: string }
 */

const { runBienestarPremiumPipeline } = require('../src/modules/editor-ia/pipelines/bienestar-premium/pipeline-adapter.cjs');

/**
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */
module.exports = async function handler(req, res) {
  // ─── CORS ─────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido. Usa POST.',
    });
  }

  // ─── Rate Limiting simple (1 req/s por IP) ────────────────────
  // Se delega a Vercel Edge / WAF en producción

  try {
    const { tema_solicitado, fecha_publicacion, fuente } = req.body || {};

    // ─── Validación ───────────────────────────────────────────────
    if (!tema_solicitado || typeof tema_solicitado !== 'string' || tema_solicitado.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Campo requerido: "tema_solicitado" (string, mínimo 5 caracteres).',
      });
    }

    if (fecha_publicacion && isNaN(Date.parse(fecha_publicacion))) {
      return res.status(400).json({
        success: false,
        error: '"fecha_publicacion" debe ser una fecha ISO 8601 válida.',
      });
    }

    // ─── Construir el contexto del pipeline ───────────────────────
    const pipelineId = `bienestar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const ctx = {
      pipeline_id: pipelineId,
      job: {
        id: pipelineId,
        topic: tema_solicitado.trim(),
        format: 'ARTICLE',
        target_audience: 'Público general interesado en bienestar y salud',
        status: 'DRAFT',
      },
      stages: [],
      current_stage: 'trigger_entrada',
      traceId: pipelineId,
      // Contexto extendido de Bienestar
      trigger: {
        tema_solicitado: tema_solicitado.trim(),
        fecha_publicacion: fecha_publicacion || null,
        fuente: fuente || 'webhook',
      },
      ia_output: null,
      bfl_output: null,
      media_output: null,
      publication_output: null,
      // Runtime fields
      steps: [],
      currentStepIndex: 0,
      history: [],
      warnings: [],
      startedAt: new Date().toISOString(),
      completedAt: null,
    };

    // ─── Cargar configuración desde variables de entorno ──────────
    const config = {
      llm_api_key: process.env.ANTHROPIC_API_KEY,
      llm_endpoint: process.env.LLM_ENDPOINT,
      llm_model: process.env.LLM_MODEL,
      bfl_api_key: process.env.BFL_API_KEY,
      bfl_endpoint: process.env.BFL_ENDPOINT,
      cms_base_url: process.env.WP_BASE_URL,
      cms_username: process.env.WP_USERNAME,
      cms_application_password: process.env.WP_APP_PASSWORD,
    };

    // ─── Ejecutar pipeline ───────────────────────────────────────
    const startTime = Date.now();
    const result = await runBienestarPremiumPipeline(ctx, config);
    const totalMs = Date.now() - startTime;

    // ─── Responder ────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      pipeline_id: result.pipeline_id,
      duracion_ms: totalMs,
      trigger: {
        tema: result.trigger.tema_solicitado,
        fecha_publicacion: result.trigger.fecha_publicacion,
      },
      ia_output: result.ia_output
        ? {
            tipo_contenido: result.ia_output.tipo_contenido,
            seo_slug: result.ia_output.seo_slug,
            seo_meta_title: result.ia_output.seo_meta_title,
            seo_meta_description: result.ia_output.seo_meta_description,
            contenido_length: result.ia_output.contenido_markdown.length,
          }
        : null,
      bfl_output: result.bfl_output
        ? {
            image_url: result.bfl_output.image_url,
            model: result.bfl_output.model,
            width: result.bfl_output.width,
            height: result.bfl_output.height,
          }
        : null,
      media_output: result.media_output
        ? {
            media_id: result.media_output.media_id,
            cms_url: result.media_output.cms_url,
          }
        : null,
      publication_output: result.publication_output
        ? {
            post_url: result.publication_output.post_url,
            estado_final: result.publication_output.estado_final,
            post_id: result.publication_output.post_id,
          }
        : null,
      warnings: result.warnings || [],
    });
  } catch (err) {
    console.error('[BienestarPipeline::API] Error:', err.message);

    return res.status(500).json({
      success: false,
      error: err.message || 'Error interno del pipeline.',
      timestamp: new Date().toISOString(),
    });
  }
};