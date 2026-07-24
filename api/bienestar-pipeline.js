/**
 * LEGACY_WRITE_PATH — Pipeline automatizado de Bienestar Premium.
 *
 * Fase 0: contenido por defecto y siempre bloqueado en producción.
 * El módulo que contiene efectos externos se carga únicamente después de
 * superar todos los gates. No aceptar secretos por query string.
 */

const DISABLED_MESSAGE = 'Pipeline temporalmente deshabilitado.';
const GENERIC_ERROR_MESSAGE = 'No se pudo procesar la solicitud.';

function isPipelineEnabled(env = process.env) {
  return env.NODE_ENV !== 'production' && env.BIENESTAR_PIPELINE_ENABLED === 'true';
}

function getAllowedOrigins(env = process.env) {
  return String(env.BIENESTAR_PIPELINE_ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => {
      if (!value || value === '*') return false;
      try {
        const url = new URL(value);
        return (url.protocol === 'https:' || url.protocol === 'http:') && url.origin === value;
      } catch {
        return false;
      }
    });
}

function applyCors(req, res, env = process.env) {
  const origin = req.headers?.origin;
  if (!origin) return true;

  const allowed = getAllowedOrigins(env);
  if (!allowed.includes(origin)) return false;

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return true;
}

function createPipelineContext({ temaSolicitado, fechaPublicacion, fuente }) {
  const pipelineId = `bienestar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    pipeline_id: pipelineId,
    job: {
      id: pipelineId,
      topic: temaSolicitado,
      format: 'ARTICLE',
      target_audience: 'Público general interesado en bienestar y salud',
      status: 'DRAFT',
    },
    stages: [],
    current_stage: 'trigger_entrada',
    traceId: pipelineId,
    trigger: {
      tema_solicitado: temaSolicitado,
      fecha_publicacion: fechaPublicacion || null,
      fuente: fuente || 'webhook',
    },
    ia_output: null,
    bfl_output: null,
    media_output: null,
    publication_output: null,
    steps: [],
    currentStepIndex: 0,
    history: [],
    warnings: [],
    startedAt: new Date().toISOString(),
    completedAt: null,
  };
}

async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  // Gate fail-closed antes de importar cualquier módulo con efectos externos.
  if (!isPipelineEnabled()) {
    return res.status(503).json({ success: false, error: DISABLED_MESSAGE });
  }

  if (!applyCors(req, res)) {
    return res.status(403).json({ success: false, error: 'Origen no autorizado.' });
  }

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido.' });
  }

  try {
    const { tema_solicitado, fecha_publicacion, fuente } = req.body || {};
    if (typeof tema_solicitado !== 'string' || tema_solicitado.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Solicitud inválida.' });
    }
    if (fecha_publicacion && Number.isNaN(Date.parse(fecha_publicacion))) {
      return res.status(400).json({ success: false, error: 'Solicitud inválida.' });
    }

    // Importación diferida: nunca ocurre mientras el kill switch esté cerrado.
    const { runBienestarPremiumPipeline } = await import(
      '../src/modules/editor-ia/pipelines/bienestar-premium/pipeline-adapter.cjs'
    );

    const context = createPipelineContext({
      temaSolicitado: tema_solicitado.trim(),
      fechaPublicacion: fecha_publicacion,
      fuente,
    });
    const result = await runBienestarPremiumPipeline(context, {
      llm_api_key: process.env.ANTHROPIC_API_KEY,
      llm_endpoint: process.env.LLM_ENDPOINT,
      llm_model: process.env.LLM_MODEL,
      bfl_api_key: process.env.BFL_API_KEY,
      bfl_endpoint: process.env.BFL_ENDPOINT,
      cms_base_url: process.env.WP_BASE_URL,
      cms_username: process.env.WP_USERNAME,
      cms_application_password: process.env.WP_APP_PASSWORD,
    });

    return res.status(200).json({
      success: true,
      pipeline_id: result.pipeline_id,
      estado: result.publication_output?.estado_final || 'completado',
    });
  } catch {
    // Nunca devolver mensajes crudos de proveedores, rutas o configuración.
    return res.status(500).json({ success: false, error: GENERIC_ERROR_MESSAGE });
  }
}

export default handler;
export const __testables = {
  isPipelineEnabled,
  getAllowedOrigins,
  applyCors,
  createPipelineContext,
};
