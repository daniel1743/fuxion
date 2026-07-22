/**
 * AiReportGenerator
 *
 * El frontend llama al endpoint /api/generate-report.
 * Ese endpoint intenta Sonnet primero y usa DeepSeek como fallback.
 * La respuesta se mantiene normalizada con choices[0].message.content.
 *
 * Para uso moderno, preferir el pipeline en src/lib/engine/aiPipeline.js:
 *   import { runAiReportPipeline } from '@/lib/engine/aiPipeline';
 *   const result = await runAiReportPipeline(answers, userData);
 *   // result.markdown contiene el reporte generado por el pipeline de 6 etapas.
 */

import { generateDigitalTwin } from './DigitalTwinEngine';
import { runAiReportPipeline } from './aiPipeline';

const GOAL_LABELS = {
  lose: 'control de peso',
  gain: 'ganancia muscular',
  energy: 'energia y vitalidad',
  digestion: 'salud digestiva',
  stress: 'estres y descanso',
  maintain: 'mantener y optimizar salud',
  general: 'bienestar general',
};

const REPORT_API_TIMEOUT_MS = 45000;

function formatGoal(goal) {
  return GOAL_LABELS[goal] || goal || 'bienestar general';
}

/**
 * Versión legacy: genera reporte local sin IA (fallback).
 * Se mantiene para compatibilidad con código antiguo que llama directamente.
 */
function buildLocalPremiumReport({ reportUser, biometrics, iib, iibLevel, domains, adaptive, riskFlags, adaptiveLevers, recommendations }) {
  const primaryFocus = adaptive.primary_focus?.label || 'bienestar integral';
  const strongest = adaptive.domain_insights?.strongest || [];
  const weakest = adaptive.domain_insights?.weakest || [];
  const domainLine = Object.entries(domains)
    .map(([key, score]) => `- ${key}: ${Math.round(score || 0)}/100`)
    .join('\n');
  const recBlocks = recommendations.map((rec, index) => `
### Prioridad ${index + 1}: ${rec.action}

**Por qué importa:** ${rec.why || rec.reason}

**Cómo empezar hoy:** agenda esta acción en un momento concreto del día y reduce la fricción: deja preparado lo que necesitas antes de comenzar.

**Cómo medir avance:** marca cumplimiento diario durante 7 días y observa energía, digestión, sueño y adherencia.

**Nota personalizada:** ${rec.personalization_note || `Esta prioridad se ajusta a tu objetivo de ${formatGoal(reportUser.goal)}.`}
`).join('\n');
  const levers = adaptiveLevers.map((lever) => `- **${lever.label}:** ${lever.current} hacia ${lever.target}.`).join('\n') || '- No hay palancas calculadas con los datos actuales.';
  const risks = riskFlags.map((flag) => `- **${flag.title}:** ${flag.message}`).join('\n') || '- No se detectaron señales críticas con la información disponible.';

  return `
# 1. Carta Personal del Coach

${reportUser.name || 'Tu perfil'}, acabo de terminar de analizar tu evaluación. Voy a ser directo: ${adaptive.domain_insights?.pattern === 'desbalanceado' ? 'tenés áreas muy fuertes y otras que necesitan atención prioritaria' : adaptive.domain_insights?.pattern === 'solido' ? 'tenés una base bastante sólida y ahora toca afinar detalles' : 'estás construyendo tu base y eso es exactamente lo que hay que hacer'}.

Tu objetivo declarado es **${formatGoal(reportUser.goal)}**. La lectura no busca darte una lista genérica de hábitos: busca ordenar las prioridades según impacto, urgencia y facilidad de implementación.

**Fortalezas actuales:** ${strongest.map((item) => `${item.label} ${item.score}/100`).join(', ') || 'sin datos suficientes'}.

**Oportunidades principales:** ${weakest.map((item) => `${item.label} ${item.score}/100`).join(', ') || 'sin datos suficientes'}.

# 2. Resumen Ejecutivo

${reportUser.name || 'Tu perfil'} muestra un Índice Integral de Bienestar de **${iib.score}/100**, clasificado como **${iibLevel}**. El foco principal del estudio es **${primaryFocus}**, porque ahí se concentra la mayor oportunidad de mejora relativa.

# 3. Lectura Biometrica y Metabolica

Tu IMC estimado es **${biometrics.bmi || 'sin dato'}** (${biometrics.bmiClass?.label || 'sin clasificar'}). Este dato no define tu salud por sí solo, pero sirve como punto de partida para interpretar energía, composición corporal y prioridades de movimiento.

Tu gasto energético diario estimado es **${biometrics.tdee || 'sin dato'} kcal/día**. La proteína sugerida es **${biometrics.protein || 'sin dato'} g/día** y la hidratación objetivo aproximada es **${biometrics.waterL || 'sin dato'} L/día**.

Estas cifras deben usarse como referencias operativas, no como reglas rígidas. El objetivo es ayudarte a tomar mejores decisiones durante la semana.

# 4. Mapa Integral de Bienestar

${domainLine}

El perfil se interpreta como **${adaptive.domain_insights?.pattern || 'perfil en construccion'}**. Cuando existe una diferencia grande entre dominios fuertes y débiles, conviene evitar planes demasiado amplios y empezar por pocas acciones de alto retorno.

# 5. Señales de Atención

${risks}

# 6. Palancas de Mayor Impacto

${levers}

# 7. Prioridades de Intervencion

${recBlocks}

# 8. Recomendacion Premium Fuxion

Según el foco detectado, los productos pueden considerarse como apoyo opcional, nunca como reemplazo de hábitos ni atención profesional.

- Si el foco digestivo domina el perfil, evalúa **Flora Liv** para microbiota o **Prunex1** si el tránsito está lento.
- Si la energía y la recuperación son el cuello de botella, evalúa **VitaExtra T**.
- Si el objetivo es saciedad/control de peso, evalúa **Protein Active Fit** dentro de una rutina alimentaria ordenada.

# 9. Roadmap de 30 Dias

## Dias 1-7: Estabilizar
Elige la primera prioridad y ejecútala de forma simple todos los días. No busques perfección: busca consistencia.

## Dias 8-21: Consolidar
Mantén la primera acción y suma una segunda prioridad solo si la primera ya no requiere demasiado esfuerzo mental.

## Dias 22-30: Medir
Revisa energía, digestión, sueño, adherencia, perímetro abdominal si aplica y sensación general. El objetivo es comparar evolución, no juzgarte.

# 10. Seguimiento y Proximos Pasos

Repite esta evaluación después de 30 días. Lo valioso no es solo el puntaje final, sino observar qué dominios responden mejor a tus acciones.

# 11. Nota Responsable

Este informe tiene fines informativos y educativos. No constituye diagnóstico médico ni reemplaza la consulta con un profesional de salud cualificado.
`;
}

export async function generatePremiumReportContent(userData, twinData) {
  // ── Pipeline moderno: 6 etapas con validación clínica ─────────
  try {
    const pipelineResult = await runAiReportPipeline(
      twinData.raw_answers || {},
      userData,
      { useCache: true }
    );
    return pipelineResult.markdown;
  } catch (err) {
    console.error('Pipeline falló, usando fallback local:', err.message);
  }

  // ── Fallback: reporte local sin IA ────────────────────────────
  const { biometrics, iib } = twinData.twin_state;
  const rawAnswers = twinData.raw_answers || {};
  const profile = twinData.behavior_profile || {};
  const domains = iib?.domains || twinData.twin_state.domains || {};
  const adaptive = twinData.twin_state.adaptive_analysis || {};
  const domainInsights = adaptive.domain_insights || {};
  const riskFlags = adaptive.risk_flags || [];
  const adaptiveLevers = adaptive.adaptive_levers || [];
  const iibLevel = iib?.level || 'Moderado';
  const reportUser = {
    ...rawAnswers,
    ...profile,
    ...userData,
    goal: userData.goal || rawAnswers.goal || profile.goal || 'mejorar bienestar',
    activityLevel: userData.activityLevel || rawAnswers.activityLevel || profile.activity_level || 'sin especificar',
  };

  return buildLocalPremiumReport({
    reportUser,
    biometrics,
    iib,
    iibLevel,
    domains,
    adaptive,
    riskFlags,
    adaptiveLevers,
    recommendations: twinData.recommendations || [],
  });
}
