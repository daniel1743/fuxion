/**
 * Motor de micro-reconocimiento contextual.
 *
 * Genera mensajes cortos que validan lo que el usuario acaba de responder,
 * conectándolo con implicaciones reales de su bienestar.
 *
 * Se usa así:
 *   const msg = recognizeAnswer(category, answer, previousAnswer);
 *   // { text: "...", category: "...", severity: "neutral"|"warning"|"positive" }
 */

// ── Plantillas por categoría ────────────────────────────────────────

const TEMPLATES = {
  activity: {
    sedentary: [
      'Solo {value}. Tu cuerpo necesita moverse aunque sea un poco.',
      '{value} semanales. Es hora de darle algo de movimiento real.',
    ],
    light: [
      '1–3 días por semana. Ya es un buen comienzo.',
      'Te mueves un poco. El siguiente paso son 2 días más.',
    ],
    moderate: [
      '¡Bien! 3–5 días es un ritmo sostenible.',
      '{value} semanales. Ese ritmo te mantiene activo.',
    ],
    vigorous: [
      '{value} semanales. ¡Eso es bastante intenso!',
      'Frecuente y vigoroso. Tu cuerpo está acostumbrado al esfuerzo.',
    ],
    extreme: [
      '¡Atleta! Eso es entrenamiento serio.',
      'Entrenamiento muy intenso. Tu cuerpo responde bien al esfuerzo.',
    ],
  },
  sleep: {
    short: (v) => (v < 5
      ? `${v} horas. Eso explica por qué te sientes agotado.`
      : `${v} horas. Tu cuerpo necesita al menos 7 para recuperarse.`),
    ok: (v) => `${v} horas. Un poco más y serían ideales.`,
    good: (v) => `${v} horas. Casi donde deberías estar.`,
  },
  sleep_quality: {
    1: 'Muy mala. Despiertas sin recuperación.',
    2: 'Mala. Descanso irregular o liviano.',
    3: 'Regular. Aceptable, pero mejorable.',
    4: 'Buena. Sueles despertar con energía.',
    5: 'Excelente. Descanso profundo y consistente.',
  },
  water: {
    low: (v) => (v < 1
      ? `${v} litros. Tu cuerpo no tiene de qué hidratarse.`
      : `${v} litros. Necesitas al menos 1.5 para funcionar bien.`),
    ok: (v) => `${v} litros. Más o menos lo mínimo.`,
    good: (v) => `${v} litros. Estás hidratado.`,
  },
  fruit_veg: {
    low: (v) => (v < 2
      ? `${v} porciones. Tu cuerpo necesita más frutas y verduras.`
      : `${v} porciones. Podrías subir a 3 al día.`),
    ok: (v) => `${v} porciones. Casi donde deberías estar.`,
    good: (v) => `${v} porciones. ¡Bien alimentado!`,
  },
  ultraprocessed: {
    low: (v) => `${v} por semana. Poco ultraprocesado, bien hecho.`,
    ok: (v) => (v < 6
      ? `${v} por semana. Hay margen para mejorar.`
      : `${v} por semana. Eso empieza a sumar calorías vacías.`),
    high: (v) => `${v} por semana. Mucho ultraprocesado. Cuidado.`,
  },
  bristol: {
    1: 'Tipo 1. Trozos duros separados. Necesitas más fibra y agua.',
    2: 'Tipo 2. Grumosa o muy compacta. Tu tránsito está lento.',
    3: 'Tipo 3. Con forma y grietas. Normal.',
    4: 'Tipo 4. Suave, lisa y formada. ¡Perfecto!',
    5: 'Tipo 5. Blanda con bordes definidos. Aceptable.',
    6: 'Tipo 6. Pastosa o poco formada. Demasiado rápido.',
    7: 'Tipo 7. Líquida. Necesitas controlar el tránsito.',
  },
  bowel_frequency: {
    multiple_daily: 'Varias veces al día. Frecuencia alta.',
    daily: 'Una vez al día. Patrón diario normal.',
    few_per_week: 'Pocas veces por semana. Tránsito lento.',
    less: 'Menos frecuente. Requiere atención de hábitos.',
  },
  bloating: {
    never: 'Nunca. Sin hinchazón habitual.',
    sometimes: 'A veces. Aparece en ocasiones.',
    often: 'Frecuente. Se repite varias veces.',
    always: 'Siempre. Es una señal persistente.',
  },
  stress: {
    low: (v) => (v <= 3
      ? `${v}/10. Estás tranquilo. Bien.`
      : `${v}/10. Un poco de estrés es normal.`),
    moderate: (v) => (v <= 6
      ? `${v}/10. El estrés empieza a pesar.`
      : `${v}/10. Eso es bastante estrés.`),
    high: (v) => (v <= 8
      ? `${v}/10. El estrés crónico bloquea tu recuperación.`
      : `${v}/10. Mucho estrés. Necesitas bajarlo.`),
  },
  mood: {
    1: 'Muy bajo. Días pesados o desmotivación.',
    2: 'Bajo. Ánimo irregular.',
    3: 'Regular. Estable, con altibajos.',
    4: 'Bueno. Buen tono general.',
    5: 'Excelente. Energía emocional alta.',
  },
  sun_exposure: {
    none: 'Poca o nula. Tu cuerpo necesita luz solar.',
    some: 'Moderada. 10–30 minutos. Aceptable.',
    plenty: 'Abundante. Más de 30 minutos. ¡Bien!',
  },
  smoking: {
    true: 'Fumas. Este factor reduce tu capacidad de recuperación vascular.',
    false: 'No fumas. Bien. Este factor no te afecta.',
  },
  alcohol: {
    low: (v) => (v <= 3
      ? `${v} copas/semana. Poco alcohol, bien.`
      : `${v} copas/semana. Aceptable.`),
    moderate: (v) => (v <= 7
      ? `${v} copas/semana. Empieza a sumar.`
      : `${v} copas/semana. Demasiado para tu sueño.`),
    high: (v) => `${v} copas/semana. Mucho alcohol. Cuidado.`,
  },
  coffee: {
    low: (v) => (v <= 2
      ? `${v} tazas/día. Poco café. Bien.`
      : `${v} tazas/día. Aceptable.`),
    moderate: (v) => (v <= 4
      ? `${v} tazas/día. Ya empiezan a acumularse.`
      : `${v} tazas/día. Mucho café.`),
    high: (v) => `${v} tazas/día. Demasiado café para tu sueño.`,
  },
  goal: {
    lose: 'Quieres perder peso. Enfocado en bajar grasa.',
    maintain: 'Quieres mejorar tu salud. Equilibrado.',
    gain: 'Quieres ganar músculo. Enfocado en masa y rendimiento.',
  },
};

// ── Función principal ───────────────────────────────────────────────

/**
 * Genera un mensaje de reconocimiento contextual.
 *
 * @param {string} category — 'activity' | 'sleep' | 'water' | 'fruit_veg' | 'ultraprocessed' | 'bristol' | 'bowel_frequency' | 'bloating' | 'stress' | 'mood' | 'sun_exposure' | 'smoking' | 'alcohol' | 'coffee' | 'goal' | 'general'
 * @param {any} answer — el valor respondido por el usuario
 * @param {any} [previousAnswer] — respuesta anterior (para contexto adicional)
 * @returns {{ text: string, category: string, severity: 'neutral'|'warning'|'positive' }}
 */
export function recognizeAnswer(category, answer, previousAnswer) {
  const templates = TEMPLATES[category];
  if (!templates) {
    return {
      text: `Gracias. ${answer != null ? String(answer) : ''} registrado.`,
      category,
      severity: 'neutral',
    };
  }

  const text = pickTemplate(templates, answer, previousAnswer);

  return {
    text,
    category,
    severity: detectSeverity(category, answer),
  };
}

// ── Selección de plantilla ─────────────────────────────────────────

function pickTemplate(templates, answer, _previous) {
  const key = typeof answer === 'string' ? answer : String(answer);

  // Función template
  if (typeof templates === 'function') {
    return templates(answer);
  }

  // Template por clave específica
  if (templates[key] !== undefined) {
    if (typeof templates[key] === 'function') {
      return templates[key](answer);
    }
    return templates[key];
  }

  // Template por rango (ej. sleep: short/ok/good)
  const numAnswer = typeof answer === 'number' ? answer : parseFloat(String(answer));
  if (numAnswer) {
    for (const [rangeKey, tmpl] of Object.entries(templates)) {
      if (typeof tmpl === 'function' && tmpl(numAnswer)) {
        return tmpl(numAnswer);
      }
    }
  }

  // Plantilla genérica de respaldo
  if (templates.general) {
    if (typeof templates.general === 'function') {
      return templates.general(answer);
    }
    return templates.general;
  }

  return `${answer != null ? String(answer) : ''}. Registrado.`;
}

// ── Detección de severidad ─────────────────────────────────────────

function detectSeverity(category, answer) {
  const num = typeof answer === 'number' ? answer : parseFloat(String(answer));

  switch (category) {
    case 'sleep':
      return num < 6 ? 'warning' : num >= 7.5 ? 'positive' : 'neutral';
    case 'stress':
      return num >= 7 ? 'warning' : num <= 3 ? 'positive' : 'neutral';
    case 'water':
      return num < 1.5 ? 'warning' : num >= 2.5 ? 'positive' : 'neutral';
    case 'fruit_veg':
      return num < 3 ? 'warning' : num >= 5 ? 'positive' : 'neutral';
    case 'ultraprocessed':
      return num > 4 ? 'warning' : num <= 1 ? 'positive' : 'neutral';
    case 'bristol':
      return num <= 2 || num >= 6 ? 'warning' : num === 4 ? 'positive' : 'neutral';
    case 'bloating':
      return answer === 'always' || answer === 'often' ? 'warning' : 'neutral';
    case 'mood':
      return num <= 2 ? 'warning' : num >= 4 ? 'positive' : 'neutral';
    case 'smoking':
      return answer === true ? 'warning' : 'positive';
    case 'alcohol':
      return num > 7 ? 'warning' : num <= 3 ? 'positive' : 'neutral';
    case 'coffee':
      return num > 4 ? 'warning' : num <= 2 ? 'positive' : 'neutral';
    case 'sleep_quality':
      return num <= 2 ? 'warning' : num >= 4 ? 'positive' : 'neutral';
    default:
      return 'neutral';
  }
}

// ── Detección de patrones de riesgo ────────────────────────────────

/**
 * Detecta patrones de riesgo combinando múltiples respuestas.
 * Útil para ajustar el flujo o priorizar preguntas.
 *
 * @param {Object} answers
 * @returns {{ flags: Array<{id: string, severity: string, title: string}> }}
 */
export function detectRiskPatterns(answers) {
  const flags = [];

  const sleepHrs = Number(answers.sleepHours) || 0;
  const sleepQual = Number(answers.sleepQuality) || 3;
  const stress = Number(answers.stressLevel) || 5;
  const activity = answers.activityLevel;
  const smokes = answers.smokes;
  const water = Number(answers.waterLiters) || 0;
  const bristol = Number(answers.bristolType);

  if (sleepHrs < 5.5 && stress >= 7) {
    flags.push({ id: 'sleep_stress', severity: 'high', title: 'Sueño bajo + estrés alto' });
  }

  if (activity === 'sedentary' && sleepHrs < 6) {
    flags.push({ id: 'sedentary_sleep', severity: 'medium', title: 'Sedentarismo + sueño insuficiente' });
  }

  if (smokes && sleepHrs < 6) {
    flags.push({ id: 'smoking_sleep', severity: 'high', title: 'Fumar + sueño bajo' });
  }

  if (bristol >= 6 || water < 1.5) {
    flags.push({ id: 'digestive', severity: 'medium', title: 'Posible problema digestivo' });
  }

  return { flags };
}
