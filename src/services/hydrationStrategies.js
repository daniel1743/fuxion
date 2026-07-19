/**
 * Estrategias de hidratación personalizadas.
 */

export const HYDRATION_STRATEGIES = {
  // Por tipo de persona
  personas: {
    odia_agua: [
      'Agua con rodajas de limón o pepino',
      'Infusiones frías (té helado sin azúcar)',
      'Agua con gas y limón',
      'Frutas con alta agua (sandía, naranja, pepino)',
      'Smoothies de frutas',
      'Gelatina sin azúcar',
      'Caldo de pollo o verduras (hidratante)',
    ],
    olvidadiza: [
      'Botella marcada con horas (8am, 10am, 12pm...)',
      'Recordatorios en el celular',
      'Beber un vaso antes de cada comida',
      'Botella visible en escritorio',
      'Usar app de recordatorio',
      'Asociar hidratación con hábitos existentes (cepillar dientes, llegar al trabajo)',
    ],
    deportista: [
      '500ml antes del ejercicio',
      '200ml cada 20 minutos durante ejercicio',
      'Electrolitos después de ejercicio intenso',
      'Agua con sales minerales en verano',
      'Beber incluso sin sed',
    ],
    mayor_de_50: [
      'Programar horarios fijos de bebida',
      'Té de hierbas (camomila, manzanilla)',
      'Sopas y caldos',
      'Frutas y verduras ricas en agua',
      'Reducir café después de las 3pm',
    ],
  },

  // Horarios ideales
  horarios_ideales: [
    { hora: 'Al despertar', cantidad: '250ml', beneficio: 'Rehidratación tras el sueño' },
    { hora: 'Antes del desayuno', cantidad: '200ml', beneficio: 'Prepara el tracto digestivo' },
    { hora: 'Medio día', cantidad: '250ml', beneficio: 'Mantiene concentración' },
    { hora: 'Antes del almuerzo', cantidad: '200ml', beneficio: 'Regula apetito' },
    { hora: 'Medio tarde', cantidad: '250ml', beneficio: 'Combate fatiga' },
    { hora: 'Antes del ejercicio', cantidad: '500ml', beneficio: 'Rendimiento óptimo' },
    { hora: 'Después del ejercicio', cantidad: '500ml', beneficio: 'Recuperación' },
    { hora: 'Antes de dormir', cantidad: '150ml', beneficio: 'Evita deshidratación nocturna' },
  ],

  // Señales de deshidratación
  senales_deshidratacion: [
    'Orina oscura (debería ser amarilla clara)',
    'Sed constante',
    'Dolor de cabeza',
    'Fatiga o cansancio',
    'Piel seca',
    'Mareos al levantarse',
    'Confusión o dificultad de concentración',
  ],
};

export default HYDRATION_STRATEGIES;
