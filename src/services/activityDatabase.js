/**
 * Base de datos de actividades físicas.
 * Genera planes personalizados según edad, peso y objetivo.
 */

export const ACTIVITY_DATABASE = {
  levels: {
    sedentario: {
      label: 'Sedentario',
      description: 'Pocas o ninguna actividad física',
      startingDays: 2,
      startingDuration: 15,
    },
    ligero: {
      label: 'Ligero',
      description: 'Actividad ocasional (1-2 veces/semana)',
      startingDays: 3,
      startingDuration: 20,
    },
    moderado: {
      label: 'Moderado',
      description: 'Actividad regular (3-4 veces/semana)',
      startingDays: 4,
      startingDuration: 30,
    },
    activo: {
      label: 'Activo',
      description: 'Actividad frecuente (5+ veces/semana)',
      startingDays: 5,
      startingDuration: 45,
    },
    muy_activo: {
      label: 'Muy activo',
      description: 'Actividad intensa diaria',
      startingDays: 6,
      startingDuration: 60,
    },
  },

  exercises: {
    cardio: [
      { name: 'Caminata rápida', duration: '30 min', intensity: 'baja-media', calories: 200 },
      { name: 'Correr suave', duration: '20 min', intensity: 'media', calories: 300 },
      { name: 'Bicicleta', duration: '30 min', intensity: 'media', calories: 250 },
      { name: 'Natación', duration: '30 min', intensity: 'media-alta', calories: 350 },
      { name: 'Saltar cuerda', duration: '15 min', intensity: 'alta', calories: 200 },
      { name: 'Baile', duration: '45 min', intensity: 'media', calories: 300 },
    ],
    fuerza: [
      { name: 'Sentadillas', reps: '3x12', equipment: 'ninguno', calories: 60 },
      { name: 'Lagartijas', reps: '3x10', equipment: 'ninguno', calories: 50 },
      { name: 'Plancha', reps: '3x30s', equipment: 'ninguno', calories: 40 },
      { name: 'Peso muerto con mancuernas', reps: '3x10', equipment: 'mancuernas', calories: 120 },
      { name: 'Press de hombros', reps: '3x10', equipment: 'mancuernas', calories: 80 },
      { name: 'Remo con mancuerna', reps: '3x10', equipment: 'mancuernas', calories: 90 },
      { name: 'Zancadas', reps: '3x12 cada pierna', equipment: 'ninguno', calories: 80 },
      { name: 'Burpees', reps: '3x8', equipment: 'ninguno', calories: 100 },
    ],
    flexibilidad: [
      { name: 'Yoga suave', duration: '30 min', intensity: 'baja', calories: 120 },
      { name: 'Estiramientos', duration: '20 min', intensity: 'baja', calories: 60 },
      { name: 'Pilates', duration: '30 min', intensity: 'baja-media', calories: 150 },
      { name: 'Tai Chi', duration: '30 min', intensity: 'baja', calories: 100 },
    ],
  },

  // Planes semanales por objetivo
  weeklyPlans: {
    perder_peso: {
      lunes: [
        { type: 'cardio', exercise: 'Caminata rápida', duration: 30, intensity: 'media' },
        { type: 'fuerza', exercise: 'Sentadillas + Zancadas', duration: 20, intensity: 'media' },
      ],
      martes: [
        { type: 'cardio', exercise: 'Correr suave', duration: 20, intensity: 'media' },
      ],
      miercoles: [
        { type: 'flexibilidad', exercise: 'Yoga suave', duration: 30, intensity: 'baja' },
      ],
      jueves: [
        { type: 'cardio', exercise: 'Bicicleta', duration: 30, intensity: 'media' },
        { type: 'fuerza', exercise: 'Lagartijas + Plancha', duration: 20, intensity: 'media' },
      ],
      viernes: [
        { type: 'cardio', exercise: 'Natación', duration: 30, intensity: 'media-alta' },
      ],
      sabado: [
        { type: 'cardio', exercise: 'Saltar cuerda', duration: 15, intensity: 'alta' },
        { type: 'fuerza', exercise: 'Peso muerto + Remo', duration: 20, intensity: 'media' },
      ],
      domingo: [
        { type: 'flexibilidad', exercise: 'Estiramientos', duration: 20, intensity: 'baja' },
      ],
    },
    ganar_musculo: {
      lunes: [
        { type: 'fuerza', exercise: 'Pecho + Hombros', duration: 40, intensity: 'alta' },
      ],
      martes: [
        { type: 'cardio', exercise: 'Caminata rápida', duration: 20, intensity: 'baja' },
      ],
      miercoles: [
        { type: 'fuerza', exercise: 'Pierna completa', duration: 40, intensity: 'alta' },
      ],
      jueves: [
        { type: 'flexibilidad', exercise: 'Estiramientos', duration: 20, intensity: 'baja' },
      ],
      viernes: [
        { type: 'fuerza', exercise: 'Espalda + Bíceps', duration: 40, intensity: 'alta' },
      ],
      sabado: [
        { type: 'fuerza', exercise: 'Tríceps + Core', duration: 30, intensity: 'media' },
      ],
      domingo: [
        { type: 'flexibilidad', exercise: 'Yoga suave', duration: 30, intensity: 'baja' },
      ],
    },
    mantenimiento: {
      lunes: [
        { type: 'cardio', exercise: 'Caminata rápida', duration: 30, intensity: 'media' },
      ],
      martes: [
        { type: 'fuerza', exercise: 'Sentadillas + Lagartijas', duration: 25, intensity: 'media' },
      ],
      miercoles: [
        { type: 'cardio', exercise: 'Bicicleta', duration: 25, intensity: 'media' },
      ],
      jueves: [
        { type: 'flexibilidad', exercise: 'Yoga', duration: 30, intensity: 'baja' },
      ],
      viernes: [
        { type: 'fuerza', exercise: 'Plancha + Zancadas', duration: 25, intensity: 'media' },
      ],
      sabado: [
        { type: 'cardio', exercise: 'Natación o baile', duration: 40, intensity: 'media' },
      ],
      domingo: [
        { type: 'flexibilidad', exercise: 'Estiramientos', duration: 20, intensity: 'baja' },
      ],
    },
  },
};

/**
 * Genera un plan personalizado.
 * @param {Object} params
 * @param {number} params.edad - Edad del usuario
 * @param {number} params.peso - Peso en kg
 * @param {string} params.objetivo - 'perder_peso', 'ganar_musculo', 'mantenimiento'
 * @param {string} params.nivel - 'sedentario', 'ligero', 'moderado', 'activo'
 * @returns {Object} Plan semanal personalizado
 */
export function generatePersonalizedPlan(params) {
  const { edad, peso, objetivo = 'mantenimiento', nivel = 'sedentario' } = params;

  const level = ACTIVITY_DATABASE.levels[nivel] || ACTIVITY_DATABASE.levels.sedentario;
  const plan = ACTIVITY_DATABASE.weeklyPlans[objetivo];

  return {
    objetivo,
    nivel,
    plan: Object.entries(plan).map(([dia, ejercicios]) => ({
      dia,
      ejercicios: ejercicios.map((e) => ({
        ...e,
        duration: Math.round(e.duration * (nivel === 'sedentario' ? 0.5 : nivel === 'ligero' ? 0.75 : 1)),
      })),
      totalDuration: ejercicios.reduce((sum, e) => sum + e.duration, 0),
    })),
    recommendations: [
      edad > 50 ? 'Consulta con un médico antes de iniciar' : null,
      peso > 100 ? 'Priorizar ejercicios de bajo impacto (natación, bicicleta)' : null,
      edad > 60 ? 'Incluir ejercicios de equilibrio y flexibilidad' : null,
      objetivo === 'perder_peso' ? 'Combinar con dieta baja en calorías para mejores resultados' : null,
      objetivo === 'ganar_musculo' ? 'Consumir proteína después de cada sesión' : null,
    ].filter(Boolean),
  };
}

export default ACTIVITY_DATABASE;
