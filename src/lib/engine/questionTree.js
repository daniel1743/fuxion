/**
 * Árbol de preguntas para el cuestionario adaptativo (CAT).
 *
 * Cada pregunta define:
 *   - id: identificador único
 *   - field: campo del objeto `answers` que llena
 *   - label: texto que ve el usuario
 *   - type: 'choice' | 'text' | 'range' | 'textarea'
 *   - options: opciones (solo para 'choice')
 *   - stepGroup: grupo lógico al que pertenece (para navegación y progreso)
 *   - required: si es obligatorio responderla
 *   - conditions: array de condiciones que deben cumplirse para mostrarla
 *   - skipIf: si se cumple, se salta automáticamente (ya sabemos la respuesta)
 */

export const QUESTION_GROUPS = [
  { id: 'profile', label: 'Perfil' },
  { id: 'measures', label: 'Medidas' },
  { id: 'activity', label: 'Actividad' },
  { id: 'sleep', label: 'Sueño' },
  { id: 'nutrition', label: 'Nutrición' },
  { id: 'digestion', label: 'Digestión' },
  { id: 'mental', label: 'Estrés y ánimo' },
  { id: 'risks', label: 'Riesgos y objetivos' },
];

export const QUESTION_ORDER = [
  'q_name',
  'q_age',
  'q_gender',
  'q_weight',
  'q_height',
  'q_waistCm',
  'q_activityLevel',
  'q_exerciseMinutesPerWeek',
  'q_dailySteps',
  'q_sedentaryHours',
  'q_sleepHours',
  'q_sleepQuality',
  'q_awakeningsPerNight',
  'q_screensBeforeBed',
  'q_waterLiters',
  'q_fruitVegServings',
  'q_ultraprocessedPerWeek',
  'q_bristolType',
  'q_bowelFrequency',
  'q_bloating',
  'q_stressLevel',
  'q_moodLevel',
  'q_sunExposure',
  'q_smokes',
  'q_alcoholPerWeek',
  'q_coffeePerDay',
  'q_goal',
  'q_knownConditions',
];

function yesNo() {
  return [
    { value: true, title: 'Sí', desc: 'Ocurre siempre o casi siempre.' },
    { value: false, title: 'No', desc: 'No ocurre o lo evitas.' },
  ];
}

export const QUESTIONS = [
  {
    id: 'q_name', field: 'name', type: 'text', required: true,
    label: 'Nombre completo',
    placeholder: 'Ej. Daniel Falcon',
    stepGroup: 'profile',
  },
  {
    id: 'q_age', field: 'age', type: 'text', required: true,
    label: 'Edad',
    placeholder: 'Ej. 38',
    stepGroup: 'profile',
  },
  {
    id: 'q_gender', field: 'gender', type: 'choice', required: true,
    label: 'Sexo usado para cálculos biofísicos',
    hint: 'No se usa para juzgar tu identidad; se usa para fórmulas de energía basal.',
    options: [
      { value: 'female', title: 'Femenino', desc: 'Usado para fórmulas biofísicas.' },
      { value: 'male', title: 'Masculino', desc: 'Usado para fórmulas biofísicas.' },
    ],
    stepGroup: 'profile',
  },
  {
    id: 'q_weight', field: 'weight', type: 'text', required: true,
    label: 'Peso actual (kg)',
    placeholder: 'Ej. 70',
    stepGroup: 'measures',
  },
  {
    id: 'q_height', field: 'height', type: 'text', required: true,
    label: 'Altura (cm)',
    placeholder: 'Ej. 175',
    stepGroup: 'measures',
  },
  {
    id: 'q_waistCm', field: 'waistCm', type: 'text', required: false,
    label: 'Circunferencia de cintura (opcional)',
    hint: 'Mide a la altura del ombligo, sin apretar.',
    stepGroup: 'measures',
  },
  {
    id: 'q_activityLevel', field: 'activityLevel', type: 'choice', required: true,
    label: 'Nivel de actividad',
    options: [
      { value: 'sedentary', title: 'Sedentario', desc: 'Poco o nada de ejercicio semanal.' },
      { value: 'light', title: 'Ligero', desc: 'Ejercicio 1–3 días por semana.' },
      { value: 'moderate', title: 'Moderado', desc: 'Ejercicio 3–5 días por semana.' },
      { value: 'vigorous', title: 'Vigoroso', desc: 'Ejercicio frecuente o intenso.' },
      { value: 'extreme', title: 'Atleta', desc: 'Entrenamiento muy intenso.' },
    ],
    stepGroup: 'activity',
  },
  {
    id: 'q_exerciseMinutesPerWeek', field: 'exerciseMinutesPerWeek', type: 'text', required: false,
    label: 'Minutos de ejercicio por semana',
    placeholder: 'Ej. 150',
    stepGroup: 'activity',
    skipIf: (answers) => answers.activityLevel === 'sedentary',
    skipReason: 'Ya sabemos que no haces ejercicio semanal.',
  },
  {
    id: 'q_dailySteps', field: 'dailySteps', type: 'text', required: false,
    label: 'Pasos diarios aproximados',
    placeholder: 'Ej. 7000',
    stepGroup: 'activity',
  },
  {
    id: 'q_sedentaryHours', field: 'sedentaryHours', type: 'text', required: false,
    label: 'Horas sentado al día',
    placeholder: 'Ej. 8',
    stepGroup: 'activity',
  },
  {
    id: 'q_sleepHours', field: 'sleepHours', type: 'text', required: true,
    label: 'Horas de sueño por noche',
    placeholder: 'Ej. 7.5',
    stepGroup: 'sleep',
  },
  {
    id: 'q_sleepQuality', field: 'sleepQuality', type: 'choice', required: true,
    label: 'Calidad del sueño',
    options: [
      { value: 1, title: 'Muy mala', desc: 'Despiertas sin recuperación.' },
      { value: 2, title: 'Mala', desc: 'Descanso irregular o liviano.' },
      { value: 3, title: 'Regular', desc: 'Aceptable, pero mejorable.' },
      { value: 4, title: 'Buena', desc: 'Sueles despertar con energía.' },
      { value: 5, title: 'Excelente', desc: 'Descanso profundo y consistente.' },
    ],
    stepGroup: 'sleep',
  },
  {
    id: 'q_awakeningsPerNight', field: 'awakeningsPerNight', type: 'text', required: false,
    label: 'Despertares por noche',
    stepGroup: 'sleep',
  },
  {
    id: 'q_screensBeforeBed', field: 'screensBeforeBed', type: 'choice', required: false,
    label: 'Pantallas antes de dormir',
    options: yesNo(),
    stepGroup: 'sleep',
  },
  {
    id: 'q_waterLiters', field: 'waterLiters', type: 'choice', required: true,
    label: 'Litros de agua al día',
    hint: 'Elige el rango más cercano a tu consumo habitual.',
    options: [
      { value: 0.25, title: 'Menos de medio litro', desc: 'Muy poca hidratación diaria.' },
      { value: 0.5, title: 'Medio litro', desc: 'Aproximadamente 1 botella pequeña.' },
      { value: 1, title: '1 litro', desc: 'Consumo bajo, pero constante.' },
      { value: 1.5, title: '1 litro y medio', desc: 'Punto intermedio habitual.' },
      { value: 2, title: '2 litros', desc: 'Buena base para muchas personas.' },
      { value: 2.5, title: '2 litros y medio', desc: 'Hidratación sólida.' },
      { value: 3, title: '3 litros', desc: 'Consumo alto y planificado.' },
      { value: 3.5, title: '3 litros y medio o más', desc: 'Hidratación muy alta.' },
    ],
    stepGroup: 'nutrition',
  },
  {
    id: 'q_fruitVegServings', field: 'fruitVegServings', type: 'text', required: true,
    label: 'Porciones de frutas o verduras al día',
    stepGroup: 'nutrition',
  },
  {
    id: 'q_ultraprocessedPerWeek', field: 'ultraprocessedPerWeek', type: 'text', required: false,
    label: 'Comidas ultraprocesadas por semana',
    hint: 'Cuenta veces por semana en que consumes comida o snacks industriales/listos para comer: pizza o hamburguesa de delivery, papas fritas de bolsa, galletas, embutidos, nuggets, bebidas azucaradas o comida rápida. No cuentes comida casera simple solo porque tenga aceite o esté frita.',
    placeholder: 'Ej. 3',
    stepGroup: 'nutrition',
  },
  {
    id: 'q_bristolType', field: 'bristolType', type: 'choice', required: true,
    label: 'Escala de Bristol',
    hint: 'Elige la descripción más parecida a tu patrón habitual.',
    options: [
      { value: 1, title: 'Tipo 1', desc: 'Trozos duros separados.' },
      { value: 2, title: 'Tipo 2', desc: 'Grumosa o muy compacta.' },
      { value: 3, title: 'Tipo 3', desc: 'Con forma y grietas.' },
      { value: 4, title: 'Tipo 4', desc: 'Suave, lisa y formada.' },
      { value: 5, title: 'Tipo 5', desc: 'Blanda con bordes definidos.' },
      { value: 6, title: 'Tipo 6', desc: 'Pastosa o poco formada.' },
      { value: 7, title: 'Tipo 7', desc: 'Líquida.' },
    ],
    stepGroup: 'digestion',
  },
  {
    id: 'q_bowelFrequency', field: 'bowelFrequency', type: 'choice', required: false,
    label: 'Frecuencia intestinal',
    options: [
      { value: 'multiple_daily', title: 'Varias veces al día', desc: 'Frecuencia alta.' },
      { value: 'daily', title: 'Una vez al día', desc: 'Patrón diario.' },
      { value: 'few_per_week', title: 'Pocas veces por semana', desc: 'Tránsito lento.' },
      { value: 'less', title: 'Menos frecuente', desc: 'Requiere atención de hábitos.' },
    ],
    stepGroup: 'digestion',
  },
  {
    id: 'q_bloating', field: 'bloating', type: 'choice', required: false,
    label: 'Sensación de hinchazón',
    options: [
      { value: 'never', title: 'Nunca', desc: 'Sin hinchazón habitual.' },
      { value: 'sometimes', title: 'A veces', desc: 'Aparece en ocasiones.' },
      { value: 'often', title: 'Frecuente', desc: 'Se repite varias veces.' },
      { value: 'always', title: 'Siempre', desc: 'Es una señal persistente.' },
    ],
    stepGroup: 'digestion',
  },
  {
    id: 'q_stressLevel', field: 'stressLevel', type: 'range', required: true,
    label: 'Nivel de estrés',
    min: 1, max: 10,
    lowLabel: 'Bajo',
    highLabel: 'Alto',
    stepGroup: 'mental',
  },
  {
    id: 'q_moodLevel', field: 'moodLevel', type: 'choice', required: false,
    label: 'Estado de ánimo general',
    options: [
      { value: 1, title: 'Muy bajo', desc: 'Días pesados o desmotivación.' },
      { value: 2, title: 'Bajo', desc: 'Ánimo irregular.' },
      { value: 3, title: 'Regular', desc: 'Estable, con altibajos.' },
      { value: 4, title: 'Bueno', desc: 'Buen tono general.' },
      { value: 5, title: 'Excelente', desc: 'Energía emocional alta.' },
    ],
    stepGroup: 'mental',
  },
  {
    id: 'q_sunExposure', field: 'sunExposure', type: 'choice', required: false,
    label: 'Exposición al sol diaria',
    options: [
      { value: 'none', title: 'Poca o nula', desc: 'Casi sin exposición diaria.' },
      { value: 'some', title: 'Moderada', desc: '10–30 minutos.' },
      { value: 'plenty', title: 'Abundante', desc: 'Más de 30 minutos.' },
    ],
    stepGroup: 'mental',
  },
  {
    id: 'q_smokes', field: 'smokes', type: 'choice', required: true,
    label: 'Fumas actualmente',
    options: yesNo(),
    stepGroup: 'risks',
  },
  {
    id: 'q_alcoholPerWeek', field: 'alcoholPerWeek', type: 'text', required: false,
    label: 'Copas de alcohol por semana',
    stepGroup: 'risks',
  },
  {
    id: 'q_coffeePerDay', field: 'coffeePerDay', type: 'text', required: false,
    label: 'Tazas de café al día',
    stepGroup: 'risks',
  },
  {
    id: 'q_goal', field: 'goal', type: 'choice', required: true,
    label: 'Objetivo principal',
    options: [
      { value: 'lose', title: 'Perder peso', desc: 'Bajar grasa o medidas.' },
      { value: 'maintain', title: 'Mejorar salud', desc: 'Mantener peso y optimizar hábitos.' },
      { value: 'gain', title: 'Ganar músculo', desc: 'Aumentar masa y rendimiento.' },
    ],
    stepGroup: 'risks',
  },
  {
    id: 'q_knownConditions', field: 'knownConditions', type: 'textarea', required: false,
    label: 'Condiciones médicas conocidas (opcional)',
    hint: 'Esto ayuda a mantener el informe prudente y educativo. No reemplaza evaluación médica.',
    placeholder: 'Ej. Hipertensión, asma, diabetes, medicación relevante...',
    stepGroup: 'risks',
  },
];

export function getQuestionById(id) {
  return QUESTIONS.find((q) => q.id === id);
}

export function getQuestionIndex(id) {
  return QUESTION_ORDER.indexOf(id);
}

export function getQuestionsForGroup(groupId) {
  return QUESTIONS.filter((q) => q.stepGroup === groupId);
}

export function getGroupOrder(groupId) {
  return QUESTION_GROUPS.findIndex((g) => g.id === groupId);
}
