/**
 * AiReportGenerator
 *
 * El frontend llama al endpoint /api/generate-report.
 * Ese endpoint intenta Sonnet primero y usa DeepSeek como fallback.
 * La respuesta se mantiene normalizada con choices[0].message.content.
 */

import { classifyIIBLevel } from '../wellnessAlgorithms';

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
  const { biometrics, iib } = twinData.twin_state;
  const rawAnswers = twinData.raw_answers || {};
  const profile = twinData.behavior_profile || {};
  const domains = iib?.domains || twinData.twin_state.domains || {};
  const adaptive = twinData.twin_state.adaptive_analysis || {};
  const domainInsights = adaptive.domain_insights || {};
  const dataCompleteness = adaptive.data_completeness || {};
  const riskFlags = adaptive.risk_flags || [];
  const adaptiveLevers = adaptive.adaptive_levers || [];
  const iibLevel = iib?.level || classifyIIBLevel(iib.score).level;
  const reportUser = {
    ...rawAnswers,
    ...profile,
    ...userData,
    goal: userData.goal || rawAnswers.goal || profile.goal || 'mejorar bienestar',
    activityLevel: userData.activityLevel || rawAnswers.activityLevel || profile.activity_level || 'sin especificar',
  };
  const formatDomainList = (items = []) => items
    .map((item) => `${item.label}: ${item.score}/100`)
    .join(', ') || 'sin datos suficientes';
  const formatRiskFlags = riskFlags.length
    ? riskFlags.map((flag) => `- ${flag.title} (${flag.severity}): ${flag.message}`).join('\n')
    : '- No se detectaron banderas críticas con la información disponible.';
  const formatLevers = adaptiveLevers.length
    ? adaptiveLevers.map((lever) => `- ${lever.label}: actual ${lever.current}, objetivo ${lever.target}, prioridad ${lever.priority}/100`).join('\n')
    : '- No hay palancas adaptativas calculadas.';

  const systemPrompt = `
Eres el Coach Principal de Bienestar en Claro, una marca premium de salud y bienestar.
Acabas de analizar los resultados de una evaluación muy exhaustiva de un cliente.
Tu tarea es escribir un INFORME PERSONALIZADO DE BIENESTAR EN FORMATO MARKDOWN.

REGLAS IMPORTANTES:
- Escribe como si el cliente fuera a recibir un entregable por el que vale la pena pagar.
- Escribe directamente al cliente en segunda persona (tú), con tono experto y humano.
- NO inventes diagnósticos médicos. NO prometas curas. NO uses lenguaje alarmista.
- Cuando sugieras productos Fuxion, preséntalos como apoyo opcional dentro de hábitos, no como tratamiento.
- El informe debe sentirse como un estudio profesional de bienestar: claro, consultivo, personalizado y premium.
- Este contenido se convertirá en un PDF con el logo oficial de Bienestar en Claro.

ESTRUCTURA OBLIGATORIA DEL DOCUMENTO:
(Usa títulos H1 (#) y H2 (##) para separar secciones)

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
- Condición médica conocida: ${rawAnswers.knownConditions || 'ninguna declarada'}
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
- Confianza del estudio: ${dataCompleteness.confidence || 'media'} (${dataCompleteness.score || 0}% completo)
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

DATOS ESPECÍFICOS QUE DEBES USAR:
- Horas de sueño: ${rawAnswers.sleepHours || 'no declarado'} h/noche
- Calidad percibida del sueño: ${rawAnswers.sleepQuality || 'no declarado'}/5
- Despertares por noche: ${rawAnswers.awakeningsPerNight || 0}
- Pantallas antes de dormir: ${rawAnswers.screensBeforeBed ? 'Sí' : 'No'}
- Litros de agua: ${rawAnswers.waterLiters || 'no declarado'} L/día
- Porciones frutas/verduras: ${rawAnswers.fruitVegServings || 0}/día
- Comidas ultraprocesadas: ${rawAnswers.ultraprocessedPerWeek || 0}/semana
- Nivel de estrés: ${rawAnswers.stressLevel || 'no declarado'}/10
- Estado de ánimo: ${rawAnswers.moodLevel || 'no declarado'}/5
- Exposición al sol: ${rawAnswers.sunExposure || 'no declarado'}
- Fuma: ${rawAnswers.smokes ? 'Sí' : 'No'}
- Alcohol por semana: ${rawAnswers.alcoholPerWeek || 0} copas
- Cafeína por día: ${rawAnswers.coffeePerDay || 0} tazas
- Tipo de Bristol: ${rawAnswers.bristolType || 'no declarado'}
- Frecuencia intestinal: ${rawAnswers.bowelFrequency || 'no declarado'}
- Hinchazón: ${rawAnswers.bloating || 'no declarado'}
- Circunferencia de cintura: ${rawAnswers.waistCm || 'no declarada'} cm

IMPORTANTE: Usa estos datos específicos para construir una narrativa coherente y personalizada. El cliente quiere sentir que fue leído de verdad, no que recibió una plantilla.
`;

  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REPORT_API_TIMEOUT_MS);

    const response = await fetch('/api/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ systemPrompt, userPrompt }),
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);

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
    return data.choices[0].message.content;
  } catch (err) {
    console.error('Error generando reporte IA:', err);
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
}
