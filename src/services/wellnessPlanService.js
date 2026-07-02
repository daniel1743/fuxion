const STORAGE_PREFIX = 'fuxion-wellness-plan';

export const WELLNESS_OBJECTIVES = [
  { value: 'habitos', label: 'Mejorar mis hábitos' },
  { value: 'energia', label: 'Tener más energía' },
  { value: 'peso', label: 'Apoyar el control de peso' },
  { value: 'entrenamiento', label: 'Comenzar a entrenar' },
  { value: 'digestivo', label: 'Mejorar mi bienestar digestivo' },
];

const PRODUCT_SUPPORT = {
  energia: [
    { name: 'VITA XTRA T+', slug: 'vita-xtra-t-plus', reason: 'Apoyo opcional para energía dentro de una rutina activa.' },
  ],
  peso: [
    { name: 'THERMO T3', slug: 'thermo-t3', reason: 'Solo si entrenas: se toma 30 minutos antes de hacer ejercicio.' },
    { name: 'NOCARB-T', slug: 'nocarb-t', reason: 'Alternativa opcional para acompañar hábitos de control de peso.' },
  ],
  entrenamiento: [
    { name: 'PRE SPORT PRO EDITION', slug: 'pre-sport-pro-edition', reason: 'Apoyo opcional antes de la actividad física.' },
    { name: 'POST SPORT PRO EDITION', slug: 'post-sport-pro-edition', reason: 'Apoyo opcional para la recuperación posterior.' },
  ],
  digestivo: [
    { name: 'LIQUID FIBER', slug: 'liquid-fiber', reason: 'Apoyo opcional para una rutina digestiva y consumo de fibra.' },
  ],
  habitos: [],
};

const getStorageKey = (identity) => `${STORAGE_PREFIX}:${identity || 'guest'}`;

export const loadWellnessPlan = (identity) => {
  try {
    const saved = localStorage.getItem(getStorageKey(identity));
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const saveWellnessPlan = (identity, plan) => {
  localStorage.setItem(getStorageKey(identity), JSON.stringify(plan));
};

const buildRoutine = ({ activity, days, objective }) => {
  const availableDays = Math.max(2, Math.min(Number(days) || 3, 6));
  const beginner = activity === 'sedentario' || activity === 'inicial';
  const sessions = [];

  for (let day = 1; day <= availableDays; day += 1) {
    const isRecovery = day % 3 === 0;
    sessions.push({
      day: `Día ${day}`,
      activity: isRecovery
        ? 'Movilidad, respiración y caminata suave'
        : objective === 'entrenamiento'
          ? `${beginner ? '20–30' : '35–45'} minutos de fuerza de cuerpo completo`
          : `${beginner ? '20–30' : '30–45'} minutos de caminata activa o ejercicio que disfrutes`,
    });
  }

  return sessions;
};

const getHydrationTarget = (weight) => {
  const numericWeight = Number(weight);
  if (!numericWeight) return 'Distribuye agua durante el día y aumenta gradualmente según tu actividad.';
  const liters = Math.min(Math.max(numericWeight * 0.03, 1.5), 3.5).toFixed(1);
  return `Meta orientativa inicial: cerca de ${liters} litros al día, ajustando por ejercicio, clima e indicaciones profesionales.`;
};

export const generateWellnessPlan = (answers, identity) => {
  const hasHealthConsiderations = answers.health === 'si';
  const objectiveLabel = WELLNESS_OBJECTIVES.find((item) => item.value === answers.objective)?.label;

  return {
    id: crypto.randomUUID(),
    identity,
    createdAt: new Date().toISOString(),
    version: 1,
    answers,
    title: `Plan de bienestar de 4 semanas`,
    objective: objectiveLabel || 'Mejorar el bienestar general',
    routine: buildRoutine(answers),
    nutrition: [
      'Organiza horarios de comida que puedas sostener y evita pasar demasiadas horas sin alimentarte.',
      'Prioriza alimentos variados: verduras, frutas, proteínas, legumbres y fuentes de carbohidratos acordes a tu actividad.',
      'Observa hambre, energía y digestión durante la semana; ajusta cantidad y horarios sin recurrir a restricciones extremas.',
      answers.restrictions
        ? `Considera esta preferencia o restricción informada: ${answers.restrictions}.`
        : 'Si tienes alergias o restricciones, valida los ingredientes antes de incorporar un producto nuevo.',
    ],
    hydration: getHydrationTarget(answers.weight),
    weeklyCheck: [
      '¿Cuántos días cumplí la actividad acordada?',
      '¿Cómo estuvo mi energía del 1 al 5?',
      '¿Cómo dormí durante la semana?',
      '¿Qué hábito fue fácil y cuál necesito simplificar?',
    ],
    products: hasHealthConsiderations ? [] : (PRODUCT_SUPPORT[answers.objective] || []),
    safetyNote: hasHealthConsiderations
      ? 'Indicastes una condición de salud, embarazo o uso de medicamentos. Este plan mantiene orientación general y no incluye productos. Revisa cualquier cambio con un profesional.'
      : 'Este es un plan general de hábitos, no una evaluación médica ni nutricional. Ajusta la intensidad a tu condición actual.',
  };
};
