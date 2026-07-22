/**
 * PatternDetector — Stage 3: Detección de Patrones
 *
 * Analiza correlaciones cruzadas entre dominios del bienestar,
 * infiere patrones de comportamiento y construye una narrativa
 * preliminar que alimenta al generador de la carta personal.
 *
 * Usa un modelo ligero (DeepSeek) para mantener costos bajos.
 * Cada detección se cachea con TTL configurable.
 */

const DOMAIN_LABELS = {
  nutrition: 'Nutrición e hidratación',
  activity: 'Actividad física',
  sleep: 'Sueño y descanso',
  mental: 'Salud mental y estrés',
  biometry: 'Biometría y riesgo',
  digestion: 'Digestión',
  habits: 'Prevención y hábitos',
};

const PATTERN_TTL_MS = 5 * 60 * 1000; // 5 minutos de cache

// ── Memoria de caché interna ───────────────────────────────────
const _cache = new Map();

function _cacheKey(answersHash) {
  return `pattern:${answersHash}`;
}

function _hashAnswers(answers) {
  // Hash simple determinista basado en los campos clave
  const sorted = Object.entries(answers)
    .filter(([k, v]) => v != null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(sorted);
}

// ── Heurísticas internas de detección (0 tokens) ────────────────

function detectSleepNutritionLink(answers, domains) {
  const sleepScore = domains.sleep || 0;
  const nutritionScore = domains.nutrition || 0;
  const screenBeforeBed = answers.screensBeforeBed;
  const poorSleep = (answers.sleepHours || 7) < 6.5;
  const highSugar = (answers.ultraprocessedPerWeek || 0) >= 5;

  if (screenBeforeBed && poorSleep && nutritionScore < 50) {
    return {
      type: 'circadian_disruption',
      label: 'Desregulación circadiana',
      confidence: 'alta',
      domains: ['sleep', 'nutrition'],
      description: 'El uso de pantallas antes de dormir, combinado con una alimentación rica en ultraprocesados y un déficit de horas de sueño, sugiere un ciclo de desregulación circadiana que afecta tanto la recuperación como el control del apetito.',
      actionable: true,
    };
  }

  if (poorSleep && nutritionScore < 45) {
    return {
      type: 'sleep_nutrition_link',
      label: 'Déficit energético acumulado',
      confidence: 'media',
      domains: ['sleep', 'nutrition'],
      description: 'La combinación de poco sueño y baja calidad nutricional genera un déficit energético acumulativo que dificulta tanto la pérdida de peso como la recuperación muscular.',
      actionable: true,
    };
  }

  return null;
}

function detectStressBehavioralCascade(answers, domains) {
  const stress = answers.stressLevel || 5;
  const mentalScore = domains.mental || 0;
  const sleepScore = domains.sleep || 0;
  const alcohol = answers.alcoholPerWeek || 0;
  const smokes = answers.smokes;

  if (stress >= 7 && (sleepScore < 50 || domains.digestion < 45)) {
    return {
      type: 'stress_cascade',
      label: 'Cascada de estrés',
      confidence: 'alta',
      domains: ['mental', 'sleep', 'digestion'],
      description: 'Un nivel de estrés sostenido parece estar afectando otros dominios, probablemente a través de mecanismos hormonales (cortisol). Esto se observa en la degradación del sueño y la digestión.',
      actionable: true,
    };
  }

  if ((stress >= 6) && (alcohol >= 4 || smokes)) {
    return {
      type: 'maladaptive_coping',
      label: 'Coping adaptativo insuficiente',
      confidence: 'media',
      domains: ['mental', 'habits'],
      description: 'Ante niveles de estrés moderados-altos, el perfil muestra señales de afrontamiento poco adaptativo (consumo de alcohol o tabaco), lo que refuerza el ciclo de estrés a largo plazo.',
      actionable: true,
    };
  }

  return null;
}

function detectActivityMetabolicPattern(answers, domains) {
  const activity = domains.activity || 0;
  const sedentary = answers.sedentaryHours || 0;
  const exerciseMinutes = answers.exerciseMinutesPerWeek || 0;
  const bmiClass = answers.bmiClass?.label || '';
  const goalsLose = answers.goal === 'lose';

  if (sedentary > 8 && exerciseMinutes < 60) {
    return {
      type: 'sedentary_metabolic_slowdown',
      label: 'Reducción metabólica por sedentarismo',
      confidence: 'alta',
      domains: ['activity', 'biometry', 'nutrition'],
      description: `El perfil indica ${sedentary} horas sentadas sin ejercicio significativo (<${exerciseMinutes} min/semana). Esto provoca una reducción en la actividad de la lipoproteína lipasa, afectando la capacidad del cuerpo para utilizar la energía de los alimentos.`,
      actionable: true,
    };
  }

  if (goalsLose && activity < 40 && sedentary > 8) {
    return {
      type: 'weight_loss_barrier',
      label: 'Barrera metabólica para pérdida de peso',
      confidence: 'alta',
      domains: ['activity', 'biometry'],
      description: 'El objetivo de control de peso se ve dificultado por una combinación de sedentarismo y baja actividad física. Las estrategias dietéticas solas tienen un efecto limitado sin cambio en la actividad.',
      actionable: true,
    };
  }

  return null;
}

function detectHolisticPatterns(answers, domains) {
  const scores = Object.values(domains);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const spread = max - min;

  if (spread >= 40 && min < 40) {
    return {
      type: 'high_variance_profile',
      label: 'Perfil de alta variabilidad',
      confidence: 'alta',
      domains: Object.keys(domains),
      description: `Existe una diferencia de ${spread} puntos entre el dominio más fuerte (${DOMAIN_LABELS[Object.keys(domains)[scores.indexOf(max)]]}) y el más débil (${DOMAIN_LABELS[Object.keys(domains)[scores.indexOf(min)]]}). Los perfiles con alta variabilidad responden mejor a intervenciones focalizadas que a planes generales.`,
      actionable: true,
    };
  }

  if (avg >= 70 && spread < 15) {
    return {
      type: 'balanced_high_profile',
      label: 'Perfil equilibrado y sólido',
      confidence: 'alta',
      domains: Object.keys(domains),
      description: 'El perfil presenta un equilibrio notable entre todos los dominios evaluados, con un promedio alto. Este tipo de perfil responde bien a ajustes sutiles y mantenimiento de hábitos existentes.',
      actionable: false,
    };
  }

  if (avg < 50) {
    return {
      type: 'low_baseline_profile',
      label: 'Perfil en fase de construcción',
      confidence: 'alta',
      domains: Object.keys(domains),
      description: 'La mayoría de los dominios están por debajo de 50 puntos, lo que indica que se está construyendo la base de bienestar. Las primeras intervenciones deben ser mínimas y enfocadas en crear un hábito fundamental.',
      actionable: true,
    };
  }

  return null;
}

// ── Función principal ───────────────────────────────────────────

/**
 * Detecta patrones de comportamiento cruzando dominios.
 * Retorna un objeto con los patrones encontrados, cada uno con:
 *   - type: identificador único
 *   - label: nombre descriptivo
 *   - confidence: 'alta' | 'media' | 'exploratoria'
 *   - domains: array de dominios afectados
 *   - description: texto narrativo listo para usar en el reporte
 *   - actionable: boolean — si este patrón sugiere una acción concreta
 *   - suggested_interventions: array de micro-intervenciones sugeridas
 */
export function detectBehavioralPatterns(answers, twinState) {
  const hash = _hashAnswers(answers);
  const cached = _cache.get(_cacheKey(hash));

  if (cached && Date.now() - cached.timestamp < PATTERN_TTL_MS) {
    return cached.result;
  }

  const domains = twinState.iib?.domains || twinState.domains || {};
  const biometrics = twinState.biometrics || {};

  const heuristics = [
    detectSleepNutritionLink,
    detectStressBehavioralCascade,
    detectActivityMetabolicPattern,
    detectHolisticPatterns,
  ];

  const detected = [];

  for (const fn of heuristics) {
    const result = fn(answers, domains);
    if (result) {
      detected.push(result);
    }
  }

  // Ordenar por confianza y relevancia
  const priorityOrder = { alta: 3, media: 2, exploratoria: 1 };
  detected.sort((a, b) => priorityOrder[b.confidence] - priorityOrder[a.confidence]);

  const result = {
    patterns_detected: detected.length,
    patterns: detected,
    cross_domain_correlations: detected
      .filter(p => p.domains.length > 1)
      .map(p => ({
        pattern: p.label,
        domains: p.domains.map(d => DOMAIN_LABELS[d] || d),
        strength: p.confidence,
      })),
    dominant_pattern: detected[0]?.label || 'perfil_individual',
    narrative_seed: buildNarrativeSeed(detected, answers, twinState),
  };

  _cache.set(_cacheKey(hash), { result, timestamp: Date.now() });
  return result;
}

/**
 * Construye un "seed narrativo" — un resumen conciso que alimenta
 * al generador de la carta personal con los hallazgos clave.
 */
function buildNarrativeSeed(patterns, answers, twinState) {
  const seeds = [];

  const name = answers.name || 'Tu perfil';
  const goal = answers.goal || 'bienestar general';

  seeds.push(`El perfil de ${name} revela un objetivo de ${goal} con patrones detectables en múltiples dominios.`);

  for (const p of patterns) {
    seeds.push(
      `Patrón identificado: ${p.label} (${p.confidence}). ${p.description}`
    );
  }

  // Añadir datos contextuales clave
  if (answers.smokes) {
    seeds.push('El tabaquismo activo es un factor estructural que reduce el IIB total en 15 puntos y afecta la recuperación vascular.');
  }

  if ((answers.sleepHours || 7) < 6) {
    seeds.push(`El déficit de sueño (${answers.sleepHours}h) es una variable crítica que afecta la glucosa, el cortisol y la saciedad.`);
  }

  if (answers.stressLevel >= 7) {
    seeds.push(`El estrés percibido (${answers.stressLevel}/10) parece estar impactando otros dominios del perfil.`);
  }

  return seeds.join(' ');
}

/**
 * Limpia entradas expiradas del caché.
 * Llamar periódicamente (ej. cada 10 requests) para mantener memoria baja.
 */
export function purgeExpiredCache() {
  const now = Date.now();
  for (const [key, entry] of _cache.entries()) {
    if (now - entry.timestamp > PATTERN_TTL_MS) {
      _cache.delete(key);
    }
  }
}
