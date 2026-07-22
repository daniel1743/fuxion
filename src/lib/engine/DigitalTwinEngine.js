import {
  calculateBMI,
  classifyBMI,
  calculateMifflinStJeor,
  calculateTDEE,
  calculateProteinNeeds,
  calculateWaterRequirement,
  evaluateBristolScale,
  calculateSleepQuality,
  calculateIIBScore,
  classifyIIBLevel,
} from '../wellnessAlgorithms';

import rules from './recommendationRules.json';

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const DOMAIN_LABELS = {
  nutrition: 'Nutricion e hidratacion',
  activity: 'Actividad fisica',
  sleep: 'Sueno',
  mental: 'Estres y estado de animo',
  biometry: 'Biometria',
  digestion: 'Digestivo',
  habits: 'Habitos preventivos',
};

const REQUIRED_SIGNAL_FIELDS = [
  'name',
  'age',
  'gender',
  'weight',
  'height',
  'activityLevel',
  'sleepHours',
  'sleepQuality',
  'waterLiters',
  'fruitVegServings',
  'bristolType',
  'stressLevel',
  'goal',
];

const OPTIONAL_SIGNAL_FIELDS = [
  'waistCm',
  'exerciseMinutesPerWeek',
  'dailySteps',
  'sedentaryHours',
  'awakeningsPerNight',
  'screensBeforeBed',
  'ultraprocessedPerWeek',
  'bowelFrequency',
  'bloating',
  'moodLevel',
  'sunExposure',
  'smokes',
  'alcoholPerWeek',
  'coffeePerDay',
  'knownConditions',
];

const GOAL_LABELS = {
  lose: 'control de peso',
  gain: 'ganancia muscular',
  energy: 'energia y vitalidad',
  digestion: 'salud digestiva',
  stress: 'estres y descanso',
  maintain: 'mantener y optimizar salud',
  general: 'bienestar general',
};

function hasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

function getDataCompleteness(answers) {
  const requiredAnswered = REQUIRED_SIGNAL_FIELDS.filter((field) => hasValue(answers[field]));
  const optionalAnswered = OPTIONAL_SIGNAL_FIELDS.filter((field) => hasValue(answers[field]));
  const requiredScore = requiredAnswered.length / REQUIRED_SIGNAL_FIELDS.length;
  const optionalScore = optionalAnswered.length / OPTIONAL_SIGNAL_FIELDS.length;
  const score = Math.round(clamp((requiredScore * 0.75 + optionalScore * 0.25) * 100));

  return {
    score,
    confidence: score >= 85 ? 'alta' : score >= 65 ? 'media' : 'limitada',
    answered: requiredAnswered.length + optionalAnswered.length,
    total: REQUIRED_SIGNAL_FIELDS.length + OPTIONAL_SIGNAL_FIELDS.length,
    missing_required: REQUIRED_SIGNAL_FIELDS.filter((field) => !hasValue(answers[field])),
  };
}

function getDomainInsights(domains) {
  const entries = Object.entries(domains)
    .map(([key, score]) => ({ key, label: DOMAIN_LABELS[key] || key, score: Math.round(score) }))
    .sort((a, b) => a.score - b.score);

  const weakest = entries.slice(0, 2);
  const strongest = [...entries].sort((a, b) => b.score - a.score).slice(0, 2);
  const spread = entries.length ? strongest[0].score - weakest[0].score : 0;
  const average = entries.length
    ? Math.round(entries.reduce((sum, item) => sum + item.score, 0) / entries.length)
    : 0;

  return {
    weakest,
    strongest,
    average,
    spread,
    pattern: spread >= 35
      ? 'perfil_desbalanceado'
      : average >= 75
        ? 'perfil_solido'
        : 'perfil_en_construccion',
  };
}

function inferRiskFlags(answers, biometrics, domains) {
  const flags = [];
  const waist = Number(answers.waistCm || 0);
  const isFemale = answers.gender === 'female';
  const waistLimit = isFemale ? 88 : 102;

  if (answers.smokes) {
    flags.push({
      id: 'risk_smoking',
      severity: 'alta',
      domain: 'habits',
      title: 'Tabaquismo activo',
      message: 'Este factor reduce la capacidad de recuperacion vascular y sube la prioridad preventiva.',
    });
  }

  if ((answers.sleepHours || 7) < 5.5) {
    flags.push({
      id: 'risk_sleep_debt',
      severity: 'alta',
      domain: 'sleep',
      title: 'Deuda de sueno relevante',
      message: 'El plan debe proteger recuperacion nocturna antes de exigir mas rendimiento.',
    });
  }

  if (waist > waistLimit) {
    flags.push({
      id: 'risk_waist',
      severity: 'alta',
      domain: 'biometry',
      title: 'Perimetro abdominal sobre umbral',
      message: `Reporta ${waist} cm frente a un umbral de referencia de ${waistLimit} cm.`,
    });
  }

  if (biometrics.bmi >= 30) {
    flags.push({
      id: 'risk_bmi',
      severity: 'media',
      domain: 'biometry',
      title: 'IMC en rango de obesidad',
      message: 'Conviene priorizar acciones sostenibles de energia, saciedad y movimiento.',
    });
  }

  if ((answers.stressLevel || 5) >= 8 && (domains.sleep || 70) < 65) {
    flags.push({
      id: 'risk_stress_sleep',
      severity: 'media',
      domain: 'mental',
      title: 'Estres alto con recuperacion baja',
      message: 'La intervencion debe bajar carga fisiologica antes de aumentar exigencia.',
    });
  }

  if (answers.bristolType >= 6 || answers.bloating === 'always') {
    flags.push({
      id: 'risk_digestive_irritation',
      severity: 'media',
      domain: 'digestion',
      title: 'Senales digestivas persistentes',
      message: 'El plan debe evitar cambios bruscos de fibra, cafeina o ayunos extensos.',
    });
  }

  return flags.sort((a, b) => {
    const order = { alta: 3, media: 2, baja: 1 };
    return order[b.severity] - order[a.severity];
  });
}

function buildAdaptiveLevers(answers, biometrics, domains) {
  const waterTarget = biometrics.waterL || 2;
  const currentWater = Math.max(0, Number(answers.waterLiters) || 0);
  const exerciseMinutes = Math.max(0, Number(answers.exerciseMinutesPerWeek) || 0);
  const sleepHours = Math.max(0, Number(answers.sleepHours) || 0);
  const stressLevel = Number(answers.stressLevel);
  const hasStressLevel = Number.isFinite(stressLevel) && stressLevel >= 1;

  const levers = [
    {
      domain: 'nutrition',
      label: 'Hidratacion diaria',
      current: `${currentWater.toFixed(1)} L`,
      target: `${waterTarget.toFixed(1)} L`,
      gap: Math.max(0, waterTarget - currentWater),
    },
    {
      domain: 'activity',
      label: 'Movimiento semanal',
      current: `${exerciseMinutes} min`,
      target: '150 min',
      gap: Math.max(0, 150 - exerciseMinutes) / 150,
    },
    {
      domain: 'sleep',
      label: 'Recuperacion nocturna',
      current: `${sleepHours} h`,
      target: '7-9 h',
      gap: sleepHours > 0 && sleepHours < 7 ? (7 - sleepHours) / 3 : 0,
    },
    {
      domain: 'mental',
      label: 'Carga de estres',
      current: hasStressLevel ? `${stressLevel}/10` : 'sin dato',
      target: '5/10 o menos',
      gap: hasStressLevel ? Math.max(0, (stressLevel - 5) / 5) : 0,
    },
  ];

  return levers
    .map((lever) => ({
      ...lever,
      priority: Math.round(clamp((100 - (domains[lever.domain] || 70)) * 0.6 + clamp(lever.gap * 100) * 0.4)),
    }))
    .filter((lever) => lever.gap > 0 || lever.priority >= 35)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);
}

function enrichRule(rule, answers, iib, riskFlags, dataCompleteness) {
  const domainScore = iib.domains[rule.domain] ?? 70;
  const matchedRisk = riskFlags.find((flag) => flag.domain === rule.domain);
  const lowDomainBoost = domainScore < 40 ? 18 : domainScore < 60 ? 10 : 0;
  const riskBoost = matchedRisk?.severity === 'alta' ? 14 : matchedRisk ? 8 : 0;
  const goalBoost = (
    (answers.goal === 'digestion' && rule.domain === 'digestion') ||
    (answers.goal === 'stress' && ['sleep', 'mental'].includes(rule.domain)) ||
    (answers.goal === 'lose' && ['nutrition', 'activity', 'biometry'].includes(rule.domain)) ||
    (answers.goal === 'energy' && ['sleep', 'activity', 'nutrition'].includes(rule.domain))
  ) ? 8 : 0;

  const finalScore = Math.round(clamp(rule.priority_weight + lowDomainBoost + riskBoost + goalBoost));
  const severity = finalScore >= 92 ? 'alta' : finalScore >= 78 ? 'media' : 'preventiva';
  const confidence = dataCompleteness.score >= 85 ? 'alta' : dataCompleteness.score >= 65 ? 'media' : 'exploratoria';

  return {
    ...rule,
    rule_id: rule.id,
    finalScore,
    priority: finalScore,
    severity,
    confidence,
    evidence_level: 'regla_algoritmica',
    expected_impact: domainScore < 50 ? 'alto' : finalScore >= 85 ? 'medio-alto' : 'medio',
    reason: rule.reason,
    why: rule.reason,
    personalization_note: matchedRisk
      ? `Prioridad elevada por ${matchedRisk.title.toLowerCase()}.`
      : `Prioridad ajustada segun tu objetivo de ${GOAL_LABELS[answers.goal] || 'bienestar'}.`,
  };
}

// Evaluate a single condition against the answers
function evaluateCondition(condition, answers) {
  const { field, operator, value } = condition;
  const answerVal = answers[field];

  if (answerVal === undefined) return false;

  switch (operator) {
    case '<': return Number(answerVal) < Number(value);
    case '>': return Number(answerVal) > Number(value);
    case '<=': return Number(answerVal) <= Number(value);
    case '>=': return Number(answerVal) >= Number(value);
    case '===': return answerVal === value;
    case '!==': return answerVal !== value;
    case 'in': return Array.isArray(value) && value.includes(answerVal);
    default: return false;
  }
}

// Generate the Digital Twin State and Recommendations
export function generateDigitalTwin(answers) {
  // 1. Biometrics & Base Calculations
  const bmi = calculateBMI(answers.weight, answers.height);
  const bmiClass = classifyBMI(bmi);
  const ger = calculateMifflinStJeor(answers.weight, answers.height, answers.age, answers.gender);
  const tdee = calculateTDEE(ger, answers.activityLevel);
  const protein = calculateProteinNeeds(answers.weight, answers.activityLevel, answers.goal);
  const waterL = calculateWaterRequirement(answers.weight, answers.activityLevel) / 1000;
  
  const sleepScore = calculateSleepQuality(
    answers.sleepHours || 7,
    answers.sleepQuality || 3,
    answers.awakeningsPerNight || 0
  );
  
  const bristolEval = evaluateBristolScale(answers.bristolType);
  const iib = calculateIIBScore(answers, bmi, sleepScore, bristolEval);
  const iibLevel = classifyIIBLevel(iib.score);
  const dataCompleteness = getDataCompleteness(answers);
  const domainInsights = getDomainInsights(iib.domains);
  const biometrics = {
    bmi,
    bmiClass,
    ger,
    tdee,
    protein,
    waterL,
    sleepScore,
    bristolEval
  };
  const riskFlags = inferRiskFlags(answers, biometrics, iib.domains);
  const adaptiveLevers = buildAdaptiveLevers(answers, biometrics, iib.domains);

  // 2. Evaluate Rule Engine
  let matchedRules = [];
  
  rules.forEach(rule => {
    // Check if all conditions for this rule are met
    const isMatch = rule.conditions.every(cond => evaluateCondition(cond, answers));
    if (isMatch) {
      matchedRules.push(enrichRule(rule, answers, iib, riskFlags, dataCompleteness));
    }
  });

  // Sort by highest priority
  matchedRules.sort((a, b) => b.finalScore - a.finalScore);
  
  // Pick top recommendations while keeping the plan focused.
  const topRecommendations = matchedRules.slice(0, 4);

  // 3. Construct Digital Twin Data Structure
  return {
    twin_version: "1.0",
    created_from: "web_questionnaire",
    last_evaluation: new Date().toISOString(),
    // En el futuro, next_recommended_review se puede calcular dinámicamente
    next_recommended_review: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    
    twin_state: {
      biometrics: {
        ...biometrics
      },
      iib: {
        score: iib.score,
        level: iibLevel.level,
        level_detail: iibLevel,
        domains: iib.domains
      },
      adaptive_analysis: {
        data_completeness: dataCompleteness,
        domain_insights: domainInsights,
        risk_flags: riskFlags,
        adaptive_levers: adaptiveLevers,
        recommendation_count: matchedRules.length,
        primary_focus: domainInsights.weakest[0] || null,
      },
    },
    
    behavior_profile: {
      activity_level: answers.activityLevel,
      goal: answers.goal,
      goal_label: GOAL_LABELS[answers.goal] || answers.goal || 'bienestar general',
      known_conditions: answers.knownConditions || null,
      stress_level: answers.stressLevel
    },

    recommendations: topRecommendations,
    
    // Almacenamos el raw answers temporalmente por seguridad / historial
    raw_answers: answers
  };
}
