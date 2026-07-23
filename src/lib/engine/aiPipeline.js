/**
 * aiPipeline.js — Orquestador del Pipeline de Reporte Bienestar en Claro
 *
 * Encadena las 6 etapas del pipeline de generación de reportes:
 *
 *   Etapa 1: Motor Matemático       — DigitalTwinEngine.generateDigitalTwin()
 *   Etapa 2: Motor de Reglas        — recommendationRules.json (ya integrado)
 *   Etapa 3: Detección de Patrones  — PatternDetector.detectBehavioralPatterns()
 *   Etapa 4: Validador Clínico      — ClinicalValidator.validateReportContent()
 *   Etapa 5: Generador de Narrativa — Sonnet (via /api/generate-report)
 *   Etapa 6: Renderizador PDF       — Conversión markdown → PDF profesional
 *
 * Cada etapa recibe el contexto enriquecido por la anterior.
 * Los resultados intermedios se cachéan para evitar trabajo duplicado.
 */

import { generateDigitalTwin } from './DigitalTwinEngine';
import { detectBehavioralPatterns, purgeExpiredCache } from './PatternDetector';
import { validateReportContent, autoCorrectReport, safetySummary } from './ClinicalValidator';

// ── Configuración ───────────────────────────────────────────────

const PIPELINE_TIMEOUT_MS = import.meta.env.DEV ? 90_000 : 60_000;
const MAX_NARRATIVE_RETRIES = 0;

const DOMAIN_LABELS = {
  nutrition: 'Nutrición e hidratación',
  activity: 'Actividad física',
  sleep: 'Sueño y recuperación',
  mental: 'Estrés y estado de ánimo',
  biometry: 'Biometría',
  digestion: 'Digestión',
  habits: 'Hábitos preventivos',
};

const GOAL_LABELS = {
  lose: 'control de peso',
  gain: 'ganancia muscular',
  energy: 'energía y vitalidad',
  digestion: 'salud digestiva',
  stress: 'estrés y descanso',
  maintain: 'mantener y optimizar salud',
  general: 'bienestar general',
};

// ── Memoria de caché del pipeline ──────────────────────────────

const _pipelineCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos

function _pipelineCacheKey(answersHash) {
  return `pipeline:${answersHash}`;
}

function _hashAnswers(answers = {}) {
  const sorted = Object.entries(answers)
    .filter(([, value]) => value != null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(sorted);
}

function formatGoal(goal) {
  return GOAL_LABELS[goal] || goal || 'bienestar general';
}

function formatValue(value, fallback = 'sin dato') {
  return value === undefined || value === null || value === '' ? fallback : value;
}

function getDomainEntries(domains = {}) {
  return Object.entries(domains)
    .map(([key, score]) => ({
      key,
      label: DOMAIN_LABELS[key] || key,
      score: Math.round(score || 0),
    }))
    .sort((a, b) => a.score - b.score);
}

// ── Estructura de log de ejecución ─────────────────────────────

function createExecutionLog() {
  return {
    startedAt: new Date().toISOString(),
    stages: [],
    totalElapsedMs: 0,
    errors: [],
    warnings: [],
    cacheHits: 0,
  };
}

// ═════════════════════════════════════════════════════════════════
// ETAPA 1 & 2: Motor Matemático + Motor de Reglas
// ═════════════════════════════════════════════════════════════════

/**
 * Ejecuta las etapas 1 y 2 (gratuitas, sin IA).
 * Genera el estado del gemelo digital y las recomendaciones basadas en reglas.
 */
function executeDeterministicStages(answers) {
  const twinData = generateDigitalTwin(answers);
  return {
    stage: 'deterministic',
    elapsedMs: 0,
    data: twinData,
  };
}

// ═════════════════════════════════════════════════════════════════
// ETAPA 3: Detección de Patrones (Light AI)
// ═════════════════════════════════════════════════════════════════

/**
 * Ejecuta la detección de patrones cruzados.
 * Las heurísticas internas son gratuitas; la IA solo entra en Stage 5.
 */
function executePatternDetection(answers, twinData) {
  const patterns = detectBehavioralPatterns(answers, twinData.twin_state);
  twinData.detected_patterns = patterns;
  twinData.narrative_seed = patterns.narrative_seed;
  return {
    stage: 'pattern_detection',
    patternsFound: patterns.patterns_detected,
    dominantPattern: patterns.dominant_pattern,
    crossDomainCorrelations: patterns.cross_domain_correlations,
  };
}

// ═════════════════════════════════════════════════════════════════
// ETAPA 5: Generador de Narrativa (Heavy AI)
// ═════════════════════════════════════════════════════════════════

function buildNarrativePrompt(answers, twinData) {
  const { biometrics, iib } = twinData.twin_state;
  const domains = iib?.domains || twinData.twin_state.domains || {};
  const adaptive = twinData.twin_state.adaptive_analysis || {};
  const domainInsights = adaptive.domain_insights || {};
  const riskFlags = adaptive.risk_flags || [];
  const adaptiveLevers = adaptive.adaptive_levers || [];
  const patterns = twinData.detected_patterns?.patterns || [];

  const reportUser = {
    ...answers,
    goal: answers.goal || 'mejorar bienestar',
    activityLevel: answers.activityLevel || 'sedentario',
  };

  const formatDomainList = (items = []) =>
    items.map((item) => `${item.label}: ${item.score}/100`).join(', ') || 'sin datos suficientes';

  const formatRiskFlags = riskFlags.length
    ? riskFlags.map((flag) => `- ${flag.title} (${flag.severity}): ${flag.message}`).join('\n')
    : '- No se detectaron banderas críticas con la información disponible.';

  const formatLevers = adaptiveLevers.length
    ? adaptiveLevers.map((lever) => `- ${lever.label}: actual ${lever.current}, objetivo ${lever.target}, prioridad ${lever.priority}/100`).join('\n')
    : '- No hay palancas adaptativas calculadas.';

  const patternsContext = patterns.length
    ? `\nPATRONES DE COMPORTAMIENTO DETECTADOS:\n${patterns.map((p) => `- ${p.label} (${p.confidence}): ${p.description}`).join('\n')}`
    : '';

  const systemPrompt = `
Eres el Coach Principal de Bienestar en Claro, una marca premium de salud y bienestar.
Acabas de analizar los resultados de una evaluación muy exhaustiva de un cliente.
Tu tarea es escribir un INFORME PERSONALIZADO DE BIENESTAR EN FORMATO MARKDOWN.

REGLAS ABSOLUTAS:
- Escribe como si el cliente fuera a recibir un entregable por el que vale la pena pagar.
- Escribe directamente al cliente en segunda persona (tú), con tono experto y humano.
- NUNCA inventes diagnósticos médicos. NUNCA prometas curas. NUNCA uses lenguaje alarmista.
- Cuando sugieras productos Fuxion, preséntalos como apoyo opcional dentro de hábitos, no como tratamiento.
- El informe debe sentirse como un estudio profesional de bienestar: claro, consultivo, personalizado y premium.
- Este contenido se convertirá en un PDF con el logo oficial de Bienestar en Claro.
- NUNCA menciones que un modelo de IA escribió esto.

ESTRUCTURA OBLIGATORIA DEL DOCUMENTO:

# 1. Carta Personal del Coach
Empieza con una carta directa y honesta escrita específicamente para este cliente.
NOMBRE: ${reportUser.name}
Menciona sus datos más relevantes y lo que más te llamó la atención de su perfil.
Hazlo sentir que alguien lo leyó de verdad.

# 2. Resumen Ejecutivo
Incluye una lectura breve y poderosa del perfil: IIB, nivel, confianza del estudio, foco primario, fortalezas y oportunidades.
Debe sonar como una consultoría personal, no como una plantilla.

# 3. Lectura Biometrica y Metabolica
Explica IMC, gasto energético, proteína e hidratación sugerida.
Aclara que son estimaciones orientativas y que sirven para diseñar hábitos.

# 4. Mapa Integral de Bienestar
Interpreta dominios: nutrición, actividad, sueño, estrés, biometría, digestión y hábitos.
Identifica patrones: dónde hay desbalance, dónde hay base sólida y qué área mueve más el resultado.
Explica POR QUÉ cada dominio tiene ese puntaje, con referencia a los datos específicos del cliente.

# 5. Señales de Atención
Describe las señales de alerta que detectaste.
Para cada señal, explica: qué significa, qué puede pasar si no se atiende, y qué hacer.

# 6. Palancas de Mayor Impacto
Explica las palancas adaptativas calculadas.
Para cada una, explica la brecha actual vs el objetivo y por qué importa.

# 7. Prioridades de Intervencion
Desarrolla los microhábitos recomendados.
Para cada hábito incluye: qué hacer, por qué importa (basado en SUS datos), cómo empezar hoy, cómo medir avance, qué obstáculo anticipar.
Usa datos específicos del usuario para justificar cada recomendación.

# 8. Recomendacion Premium Fuxion
Recomienda 1 o 2 productos Fuxion segun el foco del cliente:
- Energía baja o fatiga: VitaExtra T.
- Digestión lenta/estreñimiento: Prunex1.
- Hinchazón o microbiota: Flora Liv.
- Control de peso/saciedad: Protein Active Fit o Café & Café Fit según contexto.
- Estrés/descanso: No Stress como apoyo opcional.
No fuerces producto si no corresponde. Presenta la recomendación como acompañamiento, no como solución única.

# 9. Roadmap de 30 Dias
Divide en días 1-7, 8-21 y 22-30.
Debe ser realista, accionable y medible.
Incluye qué observar en cada etapa.

# 10. Seguimiento y Proximos Pasos
Explica qué observar semanalmente: sueño, energía, digestión, adherencia, medidas y sensación general.
Invita a repetir evaluación para comparar evolución.

# 11. Nota Responsable
Incluye una nota breve: el informe no reemplaza evaluación médica ni diagnóstico profesional.

Formato:
- Usa párrafos cortos.
- Usa listas cuando ayuden.
- No repitas la misma idea con palabras distintas.
- Evita exageraciones.
- Mantén un estilo premium, sobrio y personalizado.
- NO uses emojis ni lenguaje informal excesivo.
- El tono debe ser profesional pero cercano.
`;

  const userPrompt = `
DATOS DEL CLIENTE:
- Nombre: ${reportUser.name}
- Edad: ${reportUser.age} años
- Género: ${reportUser.gender}
- Objetivo declarado: ${reportUser.goal}
- Condición médica conocida: ${answers.knownConditions || 'ninguna declarada'}
- Actividad Física: ${reportUser.activityLevel}

BIOMETRÍA Y REQUERIMIENTOS:
- IMC: ${biometrics.bmi} (${biometrics.bmiClass?.label || biometrics.bmiClass || 'sin clasificar'})
- Gasto en reposo (GER): ${biometrics.ger} kcal/día
- Gasto total (TDEE): ${biometrics.tdee} kcal/día
- Proteína sugerida: ${biometrics.protein} g/día
- Hidratación: ${biometrics.waterL} L/día
- Calidad de Sueño (Score): ${biometrics.sleepScore}/100
- Tránsito Intestinal (Escala Bristol): ${biometrics.bristolEval?.label || 'Sin datos'}${biometrics.bristolEval?.advice ? ` — ${biometrics.bristolEval.advice}` : ''}

DOMINIOS (0 a 100):
- Nutrición e hidratación: ${domains.nutrition || 0}
- Actividad física: ${domains.activity || 0}
- Sueño y descanso: ${domains.sleep || 0}
- Salud mental y estrés: ${domains.mental || 0}
- Biometría y riesgo: ${domains.biometry || 0}
- Digestión: ${domains.digestion || 0}
- Prevención y hábitos: ${domains.habits || 0}

ANÁLISIS ADAPTATIVO:
- Confianza del estudio: ${adaptive.data_completeness?.confidence || 'media'} (${adaptive.data_completeness?.score || 0}% completo)
- Foco primario: ${adaptive.primary_focus?.label || 'bienestar integral'}
- Perfil detectado: ${domainInsights.pattern || 'sin patrón'}
- Fortalezas: ${formatDomainList(domainInsights.strongest)}
- Oportunidades principales: ${formatDomainList(domainInsights.weakest)}

SEÑALES DE ATENCIÓN DETECTADAS:
${formatRiskFlags}

PALANCAS DE MAYOR IMPACTO:
${formatLevers}

MICROHÁBITOS RECOMENDADOS:
${twinData.recommendations.map(r => `- "${r.action}" (${r.domain}): ${r.why || r.reason}. Prioridad ${r.priority || r.finalScore || 'media'}/100. Severidad: ${r.severity || 'preventiva'}. Nota: ${r.personalization_note || 'Ajustada al perfil.'}`).join('\n')}

${patternsContext}

NARRATIVA SEED (hallazgos clave):
${twinData.narrative_seed || 'Sin hallazgos previos.'}

DATOS ESPECÍFICOS QUE DEBES USAR:
- Horas de sueño: ${answers.sleepHours || 'no declarado'} h/noche
- Calidad percibida del sueño: ${answers.sleepQuality || 'no declarado'}/5
- Despertares por noche: ${answers.awakeningsPerNight || 0}
- Pantallas antes de dormir: ${answers.screensBeforeBed ? 'Sí' : 'No'}
- Litros de agua: ${answers.waterLiters || 'no declarado'} L/día
- Porciones frutas/verduras: ${answers.fruitVegServings || 0}/día
- Comidas ultraprocesadas: ${answers.ultraprocessedPerWeek || 0}/semana
- Nivel de estrés: ${answers.stressLevel || 'no declarado'}/10
- Estado de ánimo: ${answers.moodLevel || 'no declarado'}/5
- Exposición al sol: ${answers.sunExposure || 'no declarado'}
- Fuma: ${answers.smokes ? 'Sí' : 'No'}
- Alcohol por semana: ${answers.alcoholPerWeek || 0} copas
- Cafeína por día: ${answers.coffeePerDay || 0} tazas
- Tipo de Bristol: ${answers.bristolType || 'no declarado'}
- Frecuencia intestinal: ${answers.bowelFrequency || 'no declarado'}
- Hinchazón: ${answers.bloating || 'no declarado'}
- Circunferencia de cintura: ${answers.waistCm || 'no declarada'} cm

IMPORTANTE: Usa estos datos específicos para construir una narrativa coherente y personalizada. El cliente quiere sentir que fue leído de verdad, no que recibió una plantilla.
`;

  return { systemPrompt, userPrompt };
}

async function generateNarrative(answers, twinData, executionLog) {
  let lastError = null;

  for (let attempt = 0; attempt <= MAX_NARRATIVE_RETRIES; attempt++) {
    const { systemPrompt, userPrompt } = buildNarrativePrompt(answers, twinData);
    const attemptStartedAt = performance.now();

    try {
      console.info('[ai-pipeline] Llamando /api/generate-report', {
        attempt: attempt + 1,
        maxAttempts: MAX_NARRATIVE_RETRIES + 1,
        promptChars: systemPrompt.length + userPrompt.length,
      });

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), PIPELINE_TIMEOUT_MS);

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, userPrompt }),
        signal: controller.signal,
      });

      window.clearTimeout(timeoutId);
      const apiElapsedMs = Math.round(performance.now() - attemptStartedAt);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Error en la generación del reporte';
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) errorMessage = errorData.error;
        } catch (e) {
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      let markdown = data.choices[0].message.content;
      console.info('[ai-pipeline] API respondio', {
        attempt: attempt + 1,
        elapsedMs: apiElapsedMs,
        provider: data.provider,
        model: data.model,
        markdownChars: markdown.length,
        fallbackAttempts: data.fallback_attempts || [],
      });

      // ── Etapa 4: Validar ──────────────────────────────────────
      const validationStartedAt = performance.now();
      const validation = validateReportContent(markdown);
      executionLog.stages.push({
        stage: 'clinical_validation',
        status: validation.valid ? 'approved' : 'rejected',
        score: validation.score,
        elapsedMs: Math.round(performance.now() - validationStartedAt),
        details: safetySummary(validation),
      });
      console.info('[ai-pipeline] Validacion clinica', {
        attempt: attempt + 1,
        valid: validation.valid,
        score: validation.score,
        errors: validation.errors,
        warnings: validation.warnings,
      });

      if (validation.valid) {
        if (validation.warnings.length > 0 && validation.score >= 80) {
          markdown = autoCorrectReport(markdown);
        }
        return { markdown, validation, attempt };
      }

      if (validation.score < 30) {
        throw new Error(`Validación clínica rechazó el reporte (score: ${validation.score}). Errores: ${validation.errors.join('; ')}`);
      }

      executionLog.warnings.push(`Intento ${attempt + 1}: reporte aprobado con correcciones (score: ${validation.score}).`);
      lastError = null;

    } catch (err) {
      lastError = err;
      console.warn('[ai-pipeline] Intento de narrativa fallo', {
        attempt: attempt + 1,
        elapsedMs: Math.round(performance.now() - attemptStartedAt),
        error: err.name === 'AbortError' ? `Timeout de ${PIPELINE_TIMEOUT_MS}ms` : err.message,
      });
      executionLog.errors.push(`Narrative generation attempt ${attempt + 1} failed: ${err.message}`);
    }
  }

  throw lastError || new Error('No se pudo generar la narrativa después de varios intentos.');
}

// ═════════════════════════════════════════════════════════════════
// ETAPA 6: Renderizador PDF
// ═════════════════════════════════════════════════════════════════

function renderPdfContent(markdown, answers) {
  return {
    markdown,
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0',
      clientName: answers.name,
      clientId: answers.id || 'unknown',
      iibScore: answers._iib_score || null,
    },
  };
}

// ═════════════════════════════════════════════════════════════════
// Fallback: genera reporte local cuando el pipeline falla
// ═════════════════════════════════════════════════════════════════

/**
 * Genera un reporte local sin IA como fallback.
 * Reutiliza la lógica de AiReportGenerator.js.
 */
async function generateFallbackReport(answers, userData) {
  try {
    const fallbackData = generateDigitalTwin(answers);
    const biometrics = fallbackData.twin_state?.biometrics || {};
    const iib = fallbackData.twin_state?.iib || {};
    const domains = iib.domains || {};
    const adaptive = fallbackData.twin_state?.adaptive_analysis || {};
    const recommendations = fallbackData.recommendations || [];
    const name = userData?.name || answers?.name || 'Tu perfil';
    const domainEntries = getDomainEntries(domains);
    const weakest = adaptive.domain_insights?.weakest?.length
      ? adaptive.domain_insights.weakest
      : domainEntries.slice(0, 2);
    const strongest = adaptive.domain_insights?.strongest?.length
      ? adaptive.domain_insights.strongest
      : [...domainEntries].sort((a, b) => b.score - a.score).slice(0, 2);
    const levers = adaptive.adaptive_levers || [];
    const risks = adaptive.risk_flags || [];
    const primaryFocus = adaptive.primary_focus?.label || weakest[0]?.label || 'bienestar integral';
    const confidence = adaptive.data_completeness || {};
    const roadmapItems = recommendations.slice(0, 4);

    return `# Informe Ejecutivo Bienestar en Claro

Preparado para: **${name}**

Este documento se generó con el motor interno de Bienestar en Claro porque la IA externa no respondió dentro del tiempo permitido. No es una respuesta genérica: usa tus respuestas, tus biometrías, tus dominios de bienestar y tus prioridades calculadas por reglas.

## 1. Resumen ejecutivo

Tu Índice Integral de Bienestar es **${iib.score || 0}/100**, clasificado como **${iib.level || 'moderado'}**. La lectura principal apunta a **${primaryFocus}** como foco prioritario, porque ahí se concentra la mayor oportunidad de mejora con impacto real.

Tu objetivo declarado es **${formatGoal(answers.goal)}**. El plan no busca hacer todo al mismo tiempo; ordena pocas acciones de alto retorno para mejorar adherencia, energía, digestión, sueño y consistencia.

**Confianza del estudio:** ${confidence.confidence || 'media'}${confidence.score ? ` (${confidence.score}%)` : ''}.

## 2. Señales principales

**Fortalezas detectadas**

${strongest.map((item) => `- **${item.label}:** ${item.score}/100. Esta base puede sostener el resto del plan.`).join('\n') || '- Aún no hay fortalezas suficientes para destacar.'}

**Oportunidades de mayor impacto**

${weakest.map((item) => `- **${item.label}:** ${item.score}/100. Conviene priorizarlo antes de sumar estrategias avanzadas.`).join('\n') || '- No se detectaron oportunidades críticas con los datos disponibles.'}

## 3. Lectura biométrica y metabólica

- **IMC:** ${formatValue(biometrics.bmi)} (${biometrics.bmiClass?.label || biometrics.bmiClass || 'sin clasificar'}).
- **Gasto energético estimado:** ${formatValue(biometrics.tdee)} kcal/día.
- **Proteína sugerida:** ${formatValue(biometrics.protein)} g/día.
- **Hidratación objetivo:** ${formatValue(biometrics.waterL)} L/día.

Estas cifras no son un diagnóstico. Funcionan como referencias operativas para tomar mejores decisiones de alimentación, hidratación y rutina semanal.

## 4. Mapa por dominio

${domainEntries.map((item) => `- **${item.label}:** ${item.score}/100`).join('\n') || '- Sin dominios disponibles.'}

## 5. Palancas de mayor impacto

${levers.length ? levers.map((lever) => `- **${lever.label}:** actual ${lever.current}; objetivo ${lever.target}. Prioridad relativa: ${lever.priority}/100.`).join('\n') : '- No hay palancas calculadas con suficiente precisión.'}

## 6. Señales de atención

${risks.length ? risks.map((risk) => `- **${risk.title}:** ${risk.message}`).join('\n') : '- No se detectaron señales críticas con la información disponible.'}

## 7. Prioridades recomendadas

${recommendations.map((rec, index) => `### ${index + 1}. ${rec.action}

**Por qué importa:** ${rec.why || rec.reason || 'Prioridad calculada por el motor de reglas.'}

**Cómo aplicarlo hoy:** define un momento concreto del día, prepara lo necesario antes y mide cumplimiento, no perfección.

**Indicador de avance:** observa energía, digestión, sueño, hambre, adherencia y sensación general durante 7 días.

${rec.personalization_note ? `**Nota personalizada:** ${rec.personalization_note}` : ''}`).join('\n\n') || '### 1. Completar más datos\n\nRepite o completa la evaluación para obtener prioridades más precisas.'}

## 8. Roadmap de 30 días

**Días 1-7: estabilizar.** Ejecuta la primera prioridad todos los días de forma simple. El objetivo es crear tracción.

**Días 8-21: consolidar.** Mantén la primera acción y suma la segunda solo si ya no exige demasiado esfuerzo mental.

**Días 22-30: medir.** Revisa cambios en energía, digestión, sueño, adherencia y sensación general. Ajusta desde evidencia personal, no desde presión.

${roadmapItems.length ? roadmapItems.map((rec, index) => `- Semana ${index + 1}: ${rec.action}`).join('\n') : ''}

## 9. Recomendación de apoyo

Los suplementos pueden ayudar como complemento, pero no reemplazan hábitos ni atención profesional. Si el foco principal es digestivo, considera priorizar primero hidratación, fibra progresiva, horarios y observación de tolerancia. Si el foco es energía, revisa sueño, proteína e hidratación antes de aumentar exigencia.

## 10. Próximo seguimiento

Repite esta evaluación en 30 días o después de aplicar al menos dos prioridades. Lo valioso será comparar qué dominios responden mejor y qué acciones realmente puedes sostener.

## 11. Nota responsable

Este informe es educativo e informativo. No reemplaza una evaluación médica ni un diagnóstico profesional.
`;
  } catch (innerErr) {
    console.error('[ai-pipeline] Fallback local tambien fallo', {
      error: innerErr.message,
      stack: innerErr.stack,
    });
    return 'No se pudo generar el reporte en este momento. Intenta nuevamente.';
  }
}

// ═════════════════════════════════════════════════════════════════
// ORQUESTADOR PRINCIPAL
// ═════════════════════════════════════════════════════════════════

/**
 * Ejecuta el pipeline completo de generación de reporte.
 *
 * @param {Object} answers — Respuestas del cuestionario (formulario WellnessQuestionnaire)
 * @param {Object} userData — Datos adicionales del usuario (nombre, email, etc.)
 * @param {Object} options — Opciones configurables
 * @returns {Promise<Object>} Resultado completo del pipeline
 */
export async function runAiReportPipeline(answers, userData = {}, options = {}) {
  const { useCache = true, debug = false, cleanupCache = false } = options;
  const pipelineStartedAt = performance.now();
  console.info('[ai-pipeline] Inicio', {
    useCache,
    cleanupCache,
    timeoutMs: PIPELINE_TIMEOUT_MS,
    answersCount: Object.keys(answers || {}).length,
    userName: userData?.name || answers?.name || null,
  });

  if (cleanupCache) {
    purgeExpiredCache();
    const now = Date.now();
    for (const [key, entry] of _pipelineCache.entries()) {
      if (now - entry.timestamp > CACHE_TTL_MS) {
        _pipelineCache.delete(key);
      }
    }
  }

  const answersHash = _hashAnswers(answers);

  // ── Cache hit ─────────────────────────────────────────────────
  if (useCache) {
    const cached = _pipelineCache.get(_pipelineCacheKey(answersHash));
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.info('[ai-pipeline] Cache hit', {
        ageMs: Date.now() - cached.timestamp,
        source: cached.result?.source,
      });
      return {
        ...cached.result,
        source: 'cache',
        latencyMs: 0,
      };
    }
  }

  const executionLog = createExecutionLog();
  const startTime = performance.now();
  let twinData = null;

  try {
    // ── Etapa 1-2: Motor Matemático + Reglas (GRATUITO) ─────────
    executionLog.stages.push({ stage: 'math_engine', status: 'running' });
    const mathStartedAt = performance.now();
    const deterministic = executeDeterministicStages(answers);
    executionLog.stages[0].status = 'completed';
    executionLog.stages[0].elapsedMs = Math.round(performance.now() - mathStartedAt);

    twinData = {
      ...deterministic.data,
      ...userData,
    };

    // ── Etapa 3: Detección de Patrones (GRATUITO — heurísticas) ──
    executionLog.stages.push({ stage: 'pattern_detection', status: 'running' });
    const patternStartedAt = performance.now();
    executePatternDetection(answers, twinData);
    executionLog.stages[1].status = 'completed';
    executionLog.stages[1].elapsedMs = Math.round(performance.now() - patternStartedAt);
    executionLog.stages[1].patternsFound = twinData.detected_patterns?.patterns_detected || 0;

    // ── Etapa 5: Generador de Narrativa (SONNET — COSTO ALTO) ───
    executionLog.stages.push({ stage: 'narrative_generator', status: 'running' });
    const narrative = await generateNarrative(answers, twinData, executionLog);
    executionLog.stages[2].status = 'completed';
    executionLog.stages[2].elapsedMs = performance.now() - startTime;

    // ── Etapa 6: Renderizador PDF ───────────────────────────────
    executionLog.stages.push({ stage: 'pdf_renderer', status: 'running' });
    const pdfContent = renderPdfContent(narrative.markdown, answers);
    executionLog.stages[3].status = 'completed';

    const totalElapsed = performance.now() - startTime;
    executionLog.totalElapsedMs = Math.round(totalElapsed);

    const result = {
      markdown: narrative.markdown,
      pdf_content: pdfContent,
      twin_data: twinData,
      patterns: twinData.detected_patterns,
      validation: narrative.validation,
      source: 'live',
      latencyMs: Math.round(totalElapsed),
      execution_log: executionLog,
    };

    // Guardar en caché
    if (useCache) {
      _pipelineCache.set(_pipelineCacheKey(answersHash), {
        result,
        timestamp: Date.now(),
      });
    }

    console.info('[ai-pipeline] Completado', {
      latencyMs: result.latencyMs,
      source: result.source,
      validationScore: result.validation?.score,
      stages: executionLog.stages,
    });

    return result;

  } catch (err) {
    const runningStage = executionLog.stages.find((stage) => stage.status === 'running');
    if (runningStage) {
      runningStage.status = 'failed';
      runningStage.elapsedMs = Math.round(performance.now() - startTime);
      runningStage.error = err.message;
    }

    executionLog.errors.push(err.message);
    executionLog.totalElapsedMs = Math.round(performance.now() - startTime);

    console.error('[ai-pipeline] Fallback activado', {
      error: err.message,
      elapsedMs: executionLog.totalElapsedMs,
      stages: executionLog.stages,
    });
    const fallbackStartedAt = performance.now();
    const fallbackMarkdown = await generateFallbackReport(answers, userData);
    const fallbackElapsedMs = Math.round(performance.now() - fallbackStartedAt);
    console.info('[ai-pipeline] Fallback completado', {
      fallbackElapsedMs,
      totalElapsedMs: Math.round(performance.now() - pipelineStartedAt),
      markdownChars: fallbackMarkdown.length,
    });

    return {
      markdown: fallbackMarkdown,
      pdf_content: null,
      twin_data: twinData,
      patterns: null,
      validation: {
        valid: false,
        status: 'not_approved_fallback',
        errors: ['Pipeline falló, se usó fallback local'],
        warnings: ['La IA externa no completó la narrativa dentro del tiempo disponible.'],
        score: 0,
      },
      source: 'fallback',
      latencyMs: Math.round(performance.now() - startTime),
      execution_log: executionLog,
      error: err.message,
    };
  }
}

/**
 * Limpia el caché de pipelines.
 */
export function flushPipelineCache() {
  _pipelineCache.clear();
}

/**
 * Retorna estadísticas de uso del caché (para monitoring).
 */
export function getCacheStats() {
  const now = Date.now();
  let liveEntries = 0;
  let expiredEntries = 0;

  for (const [, entry] of _pipelineCache.entries()) {
    if (now - entry.timestamp < CACHE_TTL_MS) {
      liveEntries++;
    } else {
      expiredEntries++;
    }
  }

  return {
    totalEntries: _pipelineCache.size,
    liveEntries,
    expiredEntries,
    ttlMs: CACHE_TTL_MS,
    sizeBytes: JSON.stringify(Array.from(_pipelineCache.entries())).length,
  };
}
