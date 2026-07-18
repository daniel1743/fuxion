// ═══════════════════════════════════════════════════════════════
// wellnessAlgorithms.js — Motor Algorítmico de Bienestar en Claro
// Fórmulas biométricas validadas clínicamente + Motor de reglas
// ═══════════════════════════════════════════════════════════════

// ── 1. Índice de Masa Corporal (IMC) ───────────────────────────
export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

export function classifyBMI(bmi) {
  if (bmi == null) return { label: 'Sin datos', color: 'gray' };
  if (bmi < 18.5) return { label: 'Bajo peso', color: '#3b82f6' };
  if (bmi < 25)   return { label: 'Normal', color: '#22c55e' };
  if (bmi < 30)   return { label: 'Sobrepeso', color: '#f59e0b' };
  if (bmi < 35)   return { label: 'Obesidad I', color: '#ef4444' };
  if (bmi < 40)   return { label: 'Obesidad II', color: '#dc2626' };
  return { label: 'Obesidad III', color: '#991b1b' };
}

// ── 2. Gasto Energético en Reposo (Mifflin-St Jeor) ───────────
export function calculateMifflinStJeor(weightKg, heightCm, age, gender) {
  if (!weightKg || !heightCm || !age) return null;
  const base = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  return gender === 'female' ? Math.round(base - 161) : Math.round(base + 5);
}

// ── 3. Gasto Energético Total (TDEE) ──────────────────────────
const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  vigorous: 1.725,
  extreme: 1.9,
};

export function calculateTDEE(ger, activityLevel = 'sedentary') {
  if (!ger) return null;
  const factor = ACTIVITY_FACTORS[activityLevel] || 1.2;
  return Math.round(ger * factor);
}

// ── 4. Necesidades de Proteína ─────────────────────────────────
export function calculateProteinNeeds(weightKg, activityLevel = 'sedentary', goal = 'maintain') {
  if (!weightKg) return null;
  let factor = 0.8; // g/kg — población general sedentaria
  if (activityLevel === 'moderate' || goal === 'lose') factor = 1.4;
  if (activityLevel === 'vigorous' || goal === 'gain') factor = 1.8;
  if (activityLevel === 'extreme') factor = 2.0;
  return Math.round(weightKg * factor);
}

// ── 5. Requerimiento Hídrico ──────────────────────────────────
export function calculateWaterRequirement(weightKg, activityLevel = 'sedentary') {
  if (!weightKg) return null;
  let base = weightKg * 35; // ml
  if (activityLevel === 'moderate') base += 500;
  if (activityLevel === 'vigorous') base += 1000;
  if (activityLevel === 'extreme') base += 1500;
  return Math.round(base);
}

// ── 6. Evaluación de la Escala de Bristol ──────────────────────
export function evaluateBristolScale(type) {
  if (type == null) return { score: 50, label: 'Sin datos', advice: '' };
  if (type <= 2) return {
    score: 25,
    label: 'Estreñimiento',
    advice: 'Tus intestinos necesitan lubricación y volumen. Aumenta tu agua y añade fibra insoluble (vegetales de hoja verde, semillas de chía).',
  };
  if (type <= 4) return {
    score: 100,
    label: 'Óptimo',
    advice: 'Tu tránsito intestinal está en rango saludable. ¡Sigue así!',
  };
  if (type <= 5) return {
    score: 70,
    label: 'Ligeramente acelerado',
    advice: 'Tu tránsito es rápido pero aceptable. Cuida la fibra y la hidratación.',
  };
  return {
    score: 20,
    label: 'Diarrea',
    advice: 'Tu tránsito está demasiado acelerado. Reduce temporalmente la fibra cruda y el café. Prioriza arroz blanco, plátano y compotas.',
  };
}

// ── 7. Calidad del Sueño ──────────────────────────────────────
export function calculateSleepQuality(hoursPerNight, perceivedQuality, awakenings = 0) {
  // hoursPerNight: número de horas
  // perceivedQuality: 1-5 (1=muy mala, 5=excelente)
  // awakenings: número de despertares por noche

  // Eficiencia (0-100): penaliza menos de 7h o más de 10h
  let efficiency = 100;
  if (hoursPerNight < 6) efficiency = 40;
  else if (hoursPerNight < 7) efficiency = 70;
  else if (hoursPerNight > 10) efficiency = 60;
  else if (hoursPerNight > 9) efficiency = 85;

  // Calidad percibida normalizada a 0-100
  const qualityNorm = ((perceivedQuality || 3) / 5) * 100;

  // Fragmentación: cada despertar penaliza
  const fragmentation = Math.max(0, 100 - (awakenings * 20));

  // Ponderación: Eficiencia 50%, Calidad 30%, Fragmentación 20%
  return Math.round(efficiency * 0.5 + qualityNorm * 0.3 + fragmentation * 0.2);
}

// ── 8. Índice Integral de Bienestar (IIB) ─────────────────────
// Ponderación de 7 dominios inspirada en Life's Essential 8 (AHA)
const IIB_WEIGHTS = {
  nutrition:    0.20,
  activity:     0.20,
  sleep:        0.15,
  mental:       0.15,
  biometry:     0.15,
  digestion:    0.10,
  habits:       0.05,
};

function scoreNutrition(a) {
  let s = 50; // base
  // Frutas y verduras (porciones/día)
  const fv = a.fruitVegServings || 0;
  if (fv >= 5) s += 30;
  else if (fv >= 3) s += 15;
  else s -= 10;

  // Hidratación (litros/día)
  const water = a.waterLiters || 0;
  const target = a.weight ? (a.weight * 35) / 1000 : 2;
  const hydrationRatio = water / target;
  if (hydrationRatio >= 0.9) s += 20;
  else if (hydrationRatio >= 0.7) s += 10;
  else s -= 10;

  // Ultraprocesados (veces/semana)
  const ultra = a.ultraprocessedPerWeek || 0;
  if (ultra <= 2) s += 10;
  else if (ultra >= 7) s -= 20;

  return Math.max(0, Math.min(100, s));
}

function scoreActivity(a) {
  let s = 50;
  const mins = a.exerciseMinutesPerWeek || 0;
  if (mins >= 150) s += 30;
  else if (mins >= 75) s += 15;
  else if (mins < 30) s -= 20;

  const steps = a.dailySteps || 0;
  if (steps >= 10000) s += 15;
  else if (steps >= 7000) s += 10;
  else if (steps < 4000) s -= 10;

  const sedentary = a.sedentaryHours || 0;
  if (sedentary > 10) s -= 15;
  else if (sedentary > 8) s -= 5;

  return Math.max(0, Math.min(100, s));
}

function scoreSleep(a) {
  return calculateSleepQuality(
    a.sleepHours || 7,
    a.sleepQuality || 3,
    a.awakeningsPerNight || 0
  );
}

function scoreMental(a) {
  let s = 50;
  const stress = a.stressLevel || 5; // 1-10
  if (stress <= 3) s += 30;
  else if (stress <= 5) s += 10;
  else if (stress >= 8) s -= 25;
  else if (stress >= 6) s -= 10;

  const mood = a.moodLevel || 3; // 1-5
  if (mood >= 4) s += 20;
  else if (mood <= 2) s -= 15;

  return Math.max(0, Math.min(100, s));
}

function scoreBiometry(a) {
  let s = 50;
  const bmi = calculateBMI(a.weight, a.height);
  if (bmi) {
    if (bmi >= 18.5 && bmi < 25) s += 30;
    else if (bmi >= 25 && bmi < 30) s += 5;
    else s -= 15;
  }

  const waist = a.waistCm || 0;
  const isFemale = a.gender === 'female';
  if (waist > 0) {
    const safeLimit = isFemale ? 80 : 94;
    const riskLimit = isFemale ? 88 : 102;
    if (waist < safeLimit) s += 20;
    else if (waist > riskLimit) s -= 20;
  }

  return Math.max(0, Math.min(100, s));
}

function scoreDigestion(a) {
  const bristol = evaluateBristolScale(a.bristolType);
  let s = bristol.score;

  const freq = a.bowelFrequency || 'daily';
  if (freq === 'multiple_daily' || freq === 'daily') s = Math.min(100, s + 10);
  else if (freq === 'few_per_week') s -= 15;
  else if (freq === 'less') s -= 25;

  const bloating = a.bloating || 'never';
  if (bloating === 'always') s -= 20;
  else if (bloating === 'often') s -= 10;

  return Math.max(0, Math.min(100, s));
}

function scoreHabits(a) {
  let s = 80;
  if (a.smokes) s -= 40; // Penalización absoluta por tabaquismo
  
  const alcohol = a.alcoholPerWeek || 0;
  if (alcohol === 0) s += 10;
  else if (alcohol >= 7) s -= 25;
  else if (alcohol >= 4) s -= 10;

  const sunExposure = a.sunExposure || 'some';
  if (sunExposure === 'plenty') s += 10;
  else if (sunExposure === 'none') s -= 10;

  return Math.max(0, Math.min(100, s));
}

export function calculateIIBScore(answers) {
  const domains = {
    nutrition:  scoreNutrition(answers),
    activity:   scoreActivity(answers),
    sleep:      scoreSleep(answers),
    mental:     scoreMental(answers),
    biometry:   scoreBiometry(answers),
    digestion:  scoreDigestion(answers),
    habits:     scoreHabits(answers),
  };

  // Media ponderada con limitador: ningún dominio puede compensar otro al 100%
  let weighted = 0;
  for (const [key, weight] of Object.entries(IIB_WEIGHTS)) {
    weighted += domains[key] * weight;
  }

  // Limitador absoluto: tabaquismo reduce el IIB total en 15 puntos
  if (answers.smokes) {
    weighted = Math.max(0, weighted - 15);
  }

  // Limitador de sueño extremo
  if ((answers.sleepHours || 7) < 5) {
    weighted = Math.min(weighted, 65); // cap si el déficit es extremo
  }

  const finalScore = Math.round(Math.max(0, Math.min(100, weighted)));

  return { score: finalScore, domains };
}

export function classifyIIBLevel(score) {
  if (score >= 80) return { level: 'Óptimo', color: '#22c55e', emoji: '🌿', description: 'Tu vitalidad está en un nivel excelente. ¡Sigue cultivando estos hábitos!' };
  if (score >= 50) return { level: 'Moderado', color: '#f59e0b', emoji: '🌤️', description: 'Tu bienestar tiene áreas sólidas y oportunidades claras de mejora.' };
  return { level: 'Atención', color: '#ef4444', emoji: '⚠️', description: 'Se detectaron áreas que requieren intervención prioritaria en tu estilo de vida.' };
}

// ── 9. Motor de Reglas → Microhábitos ─────────────────────────
export function generateRecommendations(answers, iibResult) {
  const recs = [];
  const { domains } = iibResult;

  // ── Hidratación ──
  const waterL = answers.waterLiters || 0;
  const waterTarget = answers.weight ? (answers.weight * 35) / 1000 : 2;
  if (waterL < waterTarget * 0.7) {
    recs.push({
      category: 'Hidratación',
      icon: 'droplets',
      priority: 95,
      title: 'Hidratación matutina urgente',
      action: `Toma 500ml de agua inmediatamente al despertar para activar tu tracto gastrointestinal.`,
      why: `Basado en tu masa corporal (${answers.weight}kg), necesitas al menos ${(waterTarget).toFixed(1)}L diarios. Actualmente reportas ${waterL}L, lo cual puede estar causando fatiga y bajo rendimiento cognitivo.`,
    });
  }

  // ── Sueño ──
  if ((answers.sleepHours || 7) < 6) {
    recs.push({
      category: 'Sueño',
      icon: 'moon',
      priority: 90,
      title: 'Recupera tu sueño esta noche',
      action: 'Adelanta tu hora de acostarte 30 minutos y elimina pantallas 1 hora antes de dormir.',
      why: 'La falta de sueño dispara la grelina (hormona del hambre), reduce tu sensibilidad a la insulina un 20% y detiene la limpieza cerebral nocturna.',
    });
  } else if (answers.screensBeforeBed) {
    recs.push({
      category: 'Sueño',
      icon: 'moon',
      priority: 70,
      title: 'Protege tu melatonina',
      action: 'Activa los filtros de luz cálida en tus dispositivos a partir de las 8 PM o lee un libro impreso.',
      why: 'La luz azul de las pantallas suprime la melatonina, retrasando el inicio del sueño profundo reparador.',
    });
  }

  // ── Actividad ──
  const mins = answers.exerciseMinutesPerWeek || 0;
  if (mins < 60) {
    recs.push({
      category: 'Movimiento',
      icon: 'activity',
      priority: 88,
      title: 'Caminata post-comida de 15 minutos',
      action: 'Después de almorzar, camina 15 minutos a paso ligero. No necesitas ir al gimnasio.',
      why: 'Caminar tras las comidas reduce la glucosa postprandial hasta un 30% y suma minutos de actividad sin percibir esfuerzo.',
    });
  }
  if ((answers.sedentaryHours || 0) > 8) {
    recs.push({
      category: 'Movimiento',
      icon: 'activity',
      priority: 75,
      title: 'Pausas activas cada 45 minutos',
      action: 'Establece alarmas cada 45 minutos para levantarte y moverte durante 2 minutos.',
      why: 'Incluso si entrenas regularmente, estar sentado más de 8 horas deteriora tu metabolismo de forma independiente.',
    });
  }

  // ── Nutrición ──
  if ((answers.ultraprocessedPerWeek || 0) >= 5) {
    recs.push({
      category: 'Nutrición',
      icon: 'apple',
      priority: 82,
      title: 'Sustituye ultraprocesados gradualmente',
      action: 'Esta semana, cambia tus snacks empaquetados por frutos secos o una fruta de temporada.',
      why: 'Los ultraprocesados hackean tus circuitos de saciedad. Contienen combinaciones de azúcar, grasa y sal diseñadas para generar compulsión alimentaria.',
    });
  }
  if ((answers.fruitVegServings || 0) < 3) {
    recs.push({
      category: 'Nutrición',
      icon: 'apple',
      priority: 78,
      title: 'Añade color a cada comida',
      action: 'Incluye al menos una porción de fruta o verdura de color intenso en cada comida principal.',
      why: 'Las guías recomiendan 5 porciones diarias. Los fitonutrientes de colores intensos (verde, rojo, naranja) protegen contra la inflamación crónica.',
    });
  }

  // ── Digestión ──
  if (answers.bristolType && (answers.bristolType <= 2)) {
    recs.push({
      category: 'Digestión',
      icon: 'leaf',
      priority: 80,
      title: 'Fibra y agua para tu intestino',
      action: 'Aumenta hoy tu agua a 2.5L y añade dos cucharadas de semillas de chía o lino a tu desayuno.',
      why: 'Tus deposiciones sugieren tránsito colónico lento. La fibra insoluble + hidratación es la combinación más eficaz para activar el peristaltismo.',
    });
  }

  // ── Estrés ──
  if ((answers.stressLevel || 5) >= 7) {
    recs.push({
      category: 'Salud Mental',
      icon: 'brain',
      priority: 85,
      title: 'Respiración de caja antes de dormir',
      action: 'Practica 5 minutos de respiración 4-4-4-4 (inhala 4s, sostén 4s, exhala 4s, pausa 4s).',
      why: 'Tu nivel de estrés percibido es alto. El cortisol elevado facilita la deposición de grasa visceral y degrada el tejido muscular.',
    });
  }

  // ── Tabaco ──
  if (answers.smokes) {
    recs.push({
      category: 'Prevención',
      icon: 'alert',
      priority: 100,
      title: 'Plan de cesación tabáquica',
      action: 'Identifica el disparador (ansiedad, costumbre, social) que te hace encender el primer cigarrillo del día.',
      why: 'Fumar es la principal causa de envejecimiento vascular prematuro. Tu IIB se ha reducido automáticamente 15 puntos por este factor.',
    });
  }

  // ── Alcohol ──
  if ((answers.alcoholPerWeek || 0) >= 7) {
    recs.push({
      category: 'Prevención',
      icon: 'alert',
      priority: 76,
      title: 'Semana con 4 días libres de alcohol',
      action: 'Designa 4 días consecutivos a la semana completamente libres de alcohol.',
      why: 'El alcohol interfiere con la salud del microbioma y detiene la quema de grasa en el hígado durante las horas de metabolización.',
    });
  }

  // ── Circunferencia abdominal ──
  const waist = answers.waistCm || 0;
  const isFemale = answers.gender === 'female';
  const riskWaist = isFemale ? 88 : 102;
  if (waist > riskWaist) {
    recs.push({
      category: 'Biometría',
      icon: 'target',
      priority: 86,
      title: 'Protocolo anti-inflamatorio abdominal',
      action: 'Inicia caminatas post-prandiales de 15 minutos y reduce estrictamente el azúcar añadida.',
      why: `Tu perímetro abdominal (${waist}cm) supera el umbral de riesgo (${riskWaist}cm). La grasa visceral es un órgano endocrino activo que secreta citoquinas proinflamatorias.`,
    });
  }

  // Ordenar por prioridad y tomar los top 3
  recs.sort((a, b) => b.priority - a.priority);
  return recs.slice(0, 3);
}

// ── 10. Cálculos de resumen para el PDF ───────────────────────
export function generateFullPlan(answers) {
  const bmi = calculateBMI(answers.weight, answers.height);
  const bmiClass = classifyBMI(bmi);
  const ger = calculateMifflinStJeor(answers.weight, answers.height, answers.age, answers.gender);
  const tdee = calculateTDEE(ger, answers.activityLevel);
  const protein = calculateProteinNeeds(answers.weight, answers.activityLevel, answers.goal);
  const water = calculateWaterRequirement(answers.weight, answers.activityLevel);
  const iibResult = calculateIIBScore(answers);
  const iibLevel = classifyIIBLevel(iibResult.score);
  const recommendations = generateRecommendations(answers, iibResult);
  const sleepScore = calculateSleepQuality(answers.sleepHours, answers.sleepQuality, answers.awakeningsPerNight);
  const bristolEval = evaluateBristolScale(answers.bristolType);

  return {
    bmi,
    bmiClass,
    ger,
    tdee,
    protein,
    waterMl: water,
    waterL: water ? +(water / 1000).toFixed(1) : null,
    iib: iibResult,
    iibLevel,
    recommendations,
    sleepScore,
    bristolEval,
    generatedAt: new Date().toISOString(),
  };
}
