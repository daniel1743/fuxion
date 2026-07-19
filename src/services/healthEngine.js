/**
 * Motor de cálculo de scores de salud.
 * Toma las respuestas del cuestionario y devuelve scores por 12 áreas + IB global.
 * Sin IA. 100% determinista.
 */

// ─── Ponderaciones por área ────────────────────────────────────────────

const AREA_WEIGHTS = {
  nutrition: 1.0,
  hydration: 0.7,
  sleep: 1.2,
  stress: 1.1,
  exercise: 1.1,
  digestion: 0.9,
  gutHealth: 0.9,
  liver: 0.8,
  weight: 0.8,
  immune: 0.9,
  cardiovascular: 1.0,
  metabolic: 0.9,
};

// ─── Funciones de scoring por categoría ────────────────────────────────

function scoreNutrition(q) {
  let score = 50; // base neutra

  // Frutas y verduras
  if (q.frutas_verduras >= 5) score += 20;
  else if (q.frutas_verduras >= 3) score += 10;
  else if (q.frutas_verduras >= 1) score += 5;

  // Proteína
  if (q.proteina === 'siempre') score += 15;
  else if (q.proteina === 'casi_siempre') score += 10;
  else if (q.proteina === 'a_veces') score += 5;

  // Grasas buenas
  if (q.grasas_buenas === 'siempre') score += 10;
  else if (q.grasas_buenas === 'casi_siempre') score += 5;

  // Azúcar
  if (q.azucar <= 2) score += 15;
  else if (q.azucar <= 4) score += 10;
  else if (q.azucar <= 6) score += 5;

  // Procesados
  if (q.ultraprocesados === 'nunca') score += 10;
  else if (q.ultraprocesados === 'casi_nunca') score += 7;
  else if (q.ultraprocesados === 'a_veces') score += 3;

  // Alcohol
  if (q.alcohol <= 2) score += 5;
  else if (q.alcohol <= 4) score += 3;

  return Math.min(100, Math.max(0, score));
}

function scoreHydration(q) {
  let score = 50;

  if (q.agua >= 8) score += 20;
  else if (q.agua >= 6) score += 12;
  else if (q.agua >= 4) score += 6;

  if (q.no_bebe_agua === 'si') score -= 25;
  if (q.no_bebe_agua === 'a_veces') score -= 10;

  if (q.sed !== 'siempre') score += 10;

  return Math.min(100, Math.max(0, score));
}

function scoreSleep(q) {
  let score = 50;

  // Horas
  if (q.horas >= 7 && q.horas <= 9) score += 20;
  else if (q.horas >= 6) score += 10;
  else if (q.horas >= 5) score += 5;

  // Calidad
  if (q.calidad_sueno >= 8) score += 15;
  else if (q.calidad_sueno >= 6) score += 8;
  else if (q.calidad_sueno >= 4) score += 3;

  // Despertares
  if (q.despertares <= 1) score += 15;
  else if (q.despertares <= 3) score += 8;
  else if (q.despertares <= 5) score += 3;

  // Pantallas
  if (q.pantallas === 'no') score += 10;
  else if (q.pantallas === 'a_veces') score += 5;

  // Temperatura
  if (q.temperatura === 'si') score += 5;

  return Math.min(100, Math.max(0, score));
}

function scoreStress(q) {
  let score = 50;

  if (q.estres <= 3) score += 15;
  else if (q.estres <= 6) score += 8;
  else if (q.estres <= 8) score += 3;

  if (q.actividad_relajacion === 'si') score += 15;
  if (q.medita_o_respira === 'si') score += 10;
  if (q.tiempo_libre >= 3) score += 10;

  return Math.min(100, Math.max(0, score));
}

function scoreExercise(q) {
  let score = 50;

  if (q.dias_ejercicio >= 5) score += 25;
  else if (q.dias_ejercicio >= 3) score += 15;
  else if (q.dias_ejercicio >= 1) score += 5;

  if (q.tipo_ejercicio === 'cardio') score += 10;
  else if (q.tipo_ejercicio === 'fuerza') score += 12;
  else if (q.tipo_ejercicio === 'ambos') score += 15;
  else if (q.tipo_ejercicio === 'flexibilidad') score += 8;

  if (q.duracion >= 30) score += 10;

  return Math.min(100, Math.max(0, score));
}

function scoreDigestion(q) {
  let score = 50;

  if (q.estrenimiento === 'no') score += 15;
  if (q.hinchazon === 'no') score += 10;
  if (q.gases === 'no') score += 10;
  if (q.diarrea === 'no') score += 10;

  if (q.mastica_bien === 'si') score += 10;

  if (q.agua_comida === 'si') score += 5;

  if (q.fibra === 'si') score += 10;

  return Math.min(100, Math.max(0, score));
}

function scoreGutHealth(q) {
  let score = 50;

  if (q.probioticos === 'si') score += 10;
  if (q.prebioticos === 'si') score += 10;
  if (q.yogurt === 'si') score += 8;

  if (q.antibioticos_recentes === 'no') score += 15;

  if (q.fibra >= 3) score += 10;

  if (q.estres_alto === 'si') score -= 10;

  return Math.min(100, Math.max(0, score));
}

function scoreLiver(q) {
  let score = 50;

  if (q.alcohol <= 2) score += 15;
  if (q.alcohol <= 4) score += 10;

  if (q.medicos === 'no') score += 10;

  if (q.agua >= 6) score += 10;

  if (q.vegetales_verdes === 'si') score += 10;

  if (q.obeso === 'si') score -= 15;

  return Math.min(100, Math.max(0, score));
}

function scoreWeight(q) {
  // BMI-based + lifestyle factors
  let score = 50;

  if (q.imc >= 18.5 && q.imc <= 25) score += 20;
  else if (q.imc >= 25 && q.imc <= 30) score += 5;
  else if (q.imc > 30) score -= 10;
  else if (q.imc < 18.5) score -= 10;

  if (q.actividad_fisica >= 3) score += 15;

  if (q.dieta_balanced === 'si') score += 10;

  if (q.sueño >= 7) score += 10;

  if (q.estres <= 5) score += 5;

  return Math.min(100, Math.max(0, score));
}

function scoreImmune(q) {
  let score = 50;

  if (q.vitamin_d === 'si') score += 10;
  if (q.vitamin_c === 'si') score += 10;
  if (q.zinc === 'si') score += 5;

  if (q.sueno >= 7) score += 15;

  if (q.estres <= 5) score += 10;

  if (q.ejercicio >= 3) score += 10;

  if (q.enfermo_reciente === 'no') score += 10;

  if (q.tabaco === 'si') score -= 15;

  return Math.min(100, Math.max(0, score));
}

function scoreCardiovascular(q) {
  let score = 50;

  if (q.fumador === 'no') score += 15;
  if (q.familia_cardio === 'no') score += 10;
  if (q.ejercicio >= 3) score += 15;
  if (q.sal_monitoreo === 'si') score += 10;
  if (q.sodio <= 3) score += 10;
  if (q.obeso === 'si') score -= 15;
  if (q.diabetes === 'si') score -= 10;

  return Math.min(100, Math.max(0, score));
}

function scoreMetabolic(q) {
  let score = 50;

  if (q.azucar <= 3) score += 15;
  if (q.fibra >= 3) score += 10;
  if (q.ejercicio >= 3) score += 15;
  if (q.obeso === 'no') score += 15;
  if (q.diabetes === 'no') score += 10;
  if (q.ayuno_intermitente === 'si') score += 5;
  if (q.grasas_buenas === 'siempre') score += 5;

  return Math.min(100, Math.max(0, score));
}

// ─── Mapeo de respuestas ───────────────────────────────────────────────

const SCORING_FUNCTIONS = {
  nutrition: scoreNutrition,
  hydration: scoreHydration,
  sleep: scoreSleep,
  stress: scoreStress,
  exercise: scoreExercise,
  digestion: scoreDigestion,
  gutHealth: scoreGutHealth,
  liver: scoreLiver,
  weight: scoreWeight,
  immune: scoreImmune,
  cardiovascular: scoreCardiovascular,
  metabolic: scoreMetabolic,
};

// ─── Función principal ─────────────────────────────────────────────────

/**
 * Calcula todos los scores de salud a partir de las respuestas.
 * @param {Object} answers - Respuestas del cuestionario
 * @returns {Object} Scores por área + IB + datos derivados
 */
export function calculateHealthScores(answers) {
  const areaScores = {};
  const weightedScores = {};

  for (const [area, fn] of Object.entries(SCORING_FUNCTIONS)) {
    areaScores[area] = fn(answers);
    weightedScores[area] = areaScores[area] * (AREA_WEIGHTS[area] || 1);
  }

  // Índice de Bienestar (ponderado)
  const totalWeight = Object.values(AREA_WEIGHTS).reduce((a, b) => a + b, 0);
  const ib = Math.round(
    Object.values(weightedScores).reduce((a, b) => a + b, 0) / totalWeight
  );

  // Edad biológica estimada
  const estimatedAge = estimateBiologicalAge(answers, ib);

  // Fortalezas y riesgos
  const sortedAreas = Object.entries(areaScores).sort((a, b) => b[1] - a[1]);
  const strengths = sortedAreas.slice(0, 3).map(([area]) => area);
  const risks = sortedAreas.slice(-3).map(([area]) => area);

  // Prioridades (áreas más bajas con mayor peso)
  const priorities = sortedAreas
    .slice(-5)
    .reverse()
    .map(([area, score]) => ({ area, score }))
    .slice(0, 3)
    .map((p) => ({
      ...p,
      label: getPriorityLabel(p.area),
    }));

  return {
    ib, // Índice de Bienestar global
    age: {
      chronological: answers.edad || 30,
      biological: estimatedAge,
      delta: estimatedAge - (answers.edad || 30),
    },
    areas: areaScores,
    strengths,
    risks,
    priorities,
    timestamp: new Date().toISOString(),
  };
}

// ─── Funciones auxiliares ──────────────────────────────────────────────

function estimateBiologicalAge(answers, ib) {
  const chrono = answers.edad || 30;
  let delta = 0;

  // IB afecta edad biológica
  if (ib < 50) delta += 5;
  else if (ib < 60) delta += 3;
  else if (ib < 70) delta += 1;
  else if (ib >= 80) delta -= 2;

  // Factores específicos
  if (answers.obeso === 'si') delta += 3;
  if (answers.diabetes === 'si') delta += 4;
  if (answers.fumador === 'si') delta += 3;
  if (answers.alcohol > 5) delta += 2;
  if (answers.sueno < 6) delta += 2;
  if (answers.ejercicio < 2) delta += 2;
  if (answers.estres > 7) delta += 2;
  if (answers.medita_o_respira === 'si') delta -= 1;
  if (answers.ejercicio >= 4) delta -= 2;
  if (answers.frutas_verduras >= 5) delta -= 1;

  return Math.max(chrono - 5, Math.min(chrono + 15, chrono + delta));
}

function getPriorityLabel(area) {
  const labels = {
    nutrition: 'Mejorar nutrición',
    hydration: 'Incrementar hidratación',
    sleep: 'Mejorar calidad de sueño',
    stress: 'Reducir estrés',
    exercise: 'Aumentar actividad física',
    digestion: 'Mejorar digestión',
    gutHealth: 'Fortalecer flora intestinal',
    liver: 'Cuidar hígado',
    weight: 'Controlar peso',
    immune: 'Fortalecer inmunidad',
    cardiovascular: 'Proteger corazón',
    metabolic: 'Optimizar metabolismo',
  };
  return labels[area] || area;
}

// ─── Top 10 acciones con mayor impacto ─────────────────────────────────

export function getTopImpactActions(answers, scores) {
  const actions = [];

  if (answers.horas < 7) {
    const deficit = 7 - answers.horas;
    actions.push({
      action: 'Dormir 1 hora más cada noche',
      impact: Math.round(deficit * 10),
      description: 'Aumentaría tu energía diaria en un ${deficit * 10 - 5}% y mejoraría tu concentración',
    });
  }

  if (answers.agua < 6) {
    const deficit = 6 - answers.agua;
    actions.push({
      action: 'Tomar 2 litros de agua diarios',
      impact: Math.round(deficit * 4),
      description: 'Mejoraría tu energía y digestión significativamente',
    });
  }

  if (answers.dias_ejercicio < 3) {
    actions.push({
      action: 'Caminar 30 minutos al día',
      impact: 16,
      description: 'Mejoraría tu salud cardiovascular, ánimo y sueño',
    });
  }

  if (answers.frutas_verduras < 4) {
    actions.push({
      action: 'Comer 5 porciones de frutas/verduras al día',
      impact: 14,
      description: 'Fuente clave de micronutrientes y antioxidantes',
    });
  }

  if (answers.azucar > 4) {
    actions.push({
      action: 'Reducir bebidas azucaradas',
      impact: 12,
      description: 'Reduciría inflamación y estabilizaría tu energía',
    });
  }

  if (answers.estres > 6) {
    actions.push({
      action: 'Practicar respiración o meditación 10 min/día',
      impact: 11,
      description: 'Reduciría cortisol, mejoraría sueño y digestión',
    });
  }

  if (answers.proteina !== 'siempre') {
    actions.push({
      action: 'Desayunar proteína (huevos, yogurt, nueces)',
      impact: 10,
      description: 'Saciedad, energía estable y recuperación muscular',
    });
  }

  if (answers.antibioticos_recentes === 'si') {
    actions.push({
      action: 'Incluir probióticos y prebióticos',
      impact: 10,
      description: 'Recuperar tu flora intestinal tras antibióticos',
    });
  }

  if (answers.obeso === 'si') {
    actions.push({
      action: 'Reducir ultraprocesados',
      impact: 15,
      description: 'Mayor impacto que cualquier otra acción en tu caso',
    });
  }

  if (answers.fumador === 'si') {
    actions.push({
      action: 'Dejar de fumar',
      impact: 25,
      description: 'La acción con mayor impacto positivo posible',
    });
  }

  return actions.sort((a, b) => b.impact - a.impact).slice(0, 10);
}

// ─── Export ─────────────────────────────────────────────────────────────

export default {
  calculateHealthScores,
  getTopImpactActions,
};
