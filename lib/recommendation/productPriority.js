/**
 * Product Priority - Catálogo de Especialidades
 *
 * Define la especialidad principal de cada producto FUXION.
 * La IA NUNCA debe elegir el producto principal.
 * El PRE (Product Recommendation Engine) es el único responsable.
 *
 * Cada producto tiene:
 * - especialidadPrincipal: Array de condiciones/objetivos para los que es LA opción
 * - prioridad: Número (menor = más prioritario)
 * - productosComplementarios: Productos que se pueden combinar
 * - productosAEVitar: Productos que NO deben recomendarse juntos
 * - notas: Información adicional para el validador
 */

export const PRODUCT_SPECIALTIES = {
  'PRUNEX 1': {
    especialidadPrincipal: [
      'limpieza intestinal',
      'estreñimiento',
      'transito intestinal',
      'gases por transito lento',
      'heces compactadas',
      'colon',
      'limpieza de colon',
      'hinchazon abdominal',
      'pesadez estomacal',
      'digestion lenta'
    ],
    prioridad: 1,
    productosComplementarios: ['FLORA LIV', 'LIQUID FIBER'],
    productosAEVitar: [],
    notas: 'Primera línea para cualquier problema de tránsito intestinal. No es un laxante agresivo.'
  },

  'FLORA LIV': {
    especialidadPrincipal: [
      'microbiota',
      'flora intestinal',
      'probioticos',
      'equilibrio digestivo',
      'recuperacion intestinal',
      'gastritis',
      'reflujo',
      'colitis',
      'colon irritable',
      'intolerancia a la lactosa',
      'malestar despues de comer',
      'digestion pesada'
    ],
    prioridad: 1,
    productosComplementarios: ['PRUNEX 1', 'LIQUID FIBER'],
    productosAEVitar: [],
    notas: 'Probióticos y prebióticos para regenerar la flora intestinal. Ideal después de una limpieza con Prunex 1.'
  },

  'LIQUID FIBER': {
    especialidadPrincipal: [
      'fibra soluble',
      'transito regular',
      'suplemento de fibra',
      'regulacion intestinal suave'
    ],
    prioridad: 2,
    productosComplementarios: ['FLORA LIV'],
    productosAEVitar: [],
    notas: 'Alternativa suave a Prunex 1. Ideal para uso diario y mantenimiento.'
  },

  'REXET': {
    especialidadPrincipal: [
      'sistema hepatico',
      'apoyo hepatico',
      'higado',
      'higado graso',
      'detox hepatico',
      'desintoxicacion del higado',
      'proteccion del higado',
      'higado graso',
      'higado graso',
      'resaca',
      'desintoxicacion por alcohol',
      'fiesta',
      'hepatobiliar'
    ],
    prioridad: 1,
    productosComplementarios: ['ALPHA BALANCE', 'PRUNEX 1'],
    productosAEVitar: [],
    notas: 'PRIMERA LINEA para apoyo hepático. NUNCA sustituir por Vita Xtra T+ para este propósito.'
  },

  'ALPHA BALANCE': {
    especialidadPrincipal: [
      'colesterol',
      'trigliceridos',
      'balance metabolico',
      'sangre',
      'lipidos en sangre',
      'grasas en sangre'
    ],
    prioridad: 1,
    productosComplementarios: ['REXET'],
    productosAEVitar: [],
    notas: 'Complemento ideal después de Rexet para mantener el balance metabólico.'
  },

  'THERMO T3': {
    especialidadPrincipal: [
      'oxidacion de grasa',
      'apoyo al control del peso',
      'activacion metabolica',
      'quemar grasa',
      'bajar de peso',
      'perder peso',
      'termogenico',
      'metabolismo lento'
    ],
    prioridad: 1,
    productosComplementarios: ['NOCARB-T', 'PROTEIN ACTIVE FIT'],
    productosAEVitar: [],
    notas: 'PRIMERA LINEA para control de peso. Termogénico que acelera el metabolismo.'
  },

  'NOCARB-T': {
    especialidadPrincipal: [
      'control de carbohidratos',
      'metabolismo de carbohidratos',
      'bloquear carbohidratos',
      'harinas',
      'frijol blanco',
      'absorcion de carbohidratos'
    ],
    prioridad: 1,
    productosComplementarios: ['THERMO T3', 'PROTEIN ACTIVE FIT'],
    productosAEVitar: [],
    notas: 'Bloqueador natural de carbohidratos. Ideal para quienes consumen muchas harinas.'
  },

  'VITAENERGÍA': {
    especialidadPrincipal: [
      'energia',
      'fatiga',
      'cansancio',
      'vitalidad',
      'sin energia',
      'agotamiento',
      'rendimiento fisico'
    ],
    prioridad: 1,
    productosComplementarios: [],
    productosAEVitar: [],
    notas: 'PRIMERA LINEA para energía y vitalidad. Fuente natural de energía.'
  },

  'VITA XTRA T+': {
    especialidadPrincipal: [
      'antioxidantes',
      'activacion general',
      'apoyo nutricional',
      'multivitaminico',
      'vitaminas',
      'minerales',
      'nutricion celular',
      'defensas'
    ],
    prioridad: 2,
    productosComplementarios: [],
    productosAEVitar: [],
    notas: 'Multivitamínico con antioxidantes. NO es primera línea para apoyo hepático ni para energía específica.'
  },

  'PROTEIN ACTIVE FIT': {
    especialidadPrincipal: [
      'proteina',
      'mantenimiento muscular',
      'recuperacion muscular',
      'apoyo nutricional deportivo',
      'masa muscular',
      'post entrenamiento',
      'post workout'
    ],
    prioridad: 1,
    productosComplementarios: ['THERMO T3', 'NOCARB-T'],
    productosAEVitar: [],
    notas: 'Proteína para mantenimiento y recuperación muscular.'
  },

  'BIOPROTEIN ACTIVE': {
    especialidadPrincipal: [
      'proteina vegetal',
      'proteina vegana',
      'alternativa vegetal',
      'proteina sin lactosa'
    ],
    prioridad: 2,
    productosComplementarios: ['THERMO T3'],
    productosAEVitar: [],
    notas: 'Alternativa vegetal a Protein Active Fit.'
  },

  'ON': {
    especialidadPrincipal: [
      'concentracion',
      'enfoque mental',
      'memoria',
      'rendimiento mental',
      'cerebro',
      'estudio',
      'trabajo mental',
      'atencion'
    ],
    prioridad: 1,
    productosComplementarios: [],
    productosAEVitar: [],
    notas: 'Enfoque y concentración mental. Ideal para estudio y trabajo.'
  },

  'NO STRESS': {
    especialidadPrincipal: [
      'estres',
      'ansiedad',
      'relajacion',
      'nervios',
      'calma',
      'tranquilidad',
      'sueno',
      'insomnio',
      'descanso'
    ],
    prioridad: 1,
    productosComplementarios: [],
    productosAEVitar: ['PASSION'],
    notas: 'Manejo del estrés y la ansiedad. Ayuda a conciliar el sueño. PASSION NO es para dormir, es un producto de vitalidad y energía.'
  },

  'PASSION': {
    especialidadPrincipal: [
      'deseo',
      'libido',
      'apetito sexual',
      'vitalidad sexual',
      'hormonal',
      'balance hormonal'
    ],
    prioridad: 1,
    productosComplementarios: ['NO STRESS'],
    productosAEVitar: [],
    notas: 'Deseo y vitalidad. Apoyo al balance hormonal.'
  },

  'BERRY BALANCE': {
    especialidadPrincipal: [
      'salud urinaria',
      'vias urinarias',
      'infeccion urinaria',
      'cistitis',
      'cranberry',
      'tracto urinario'
    ],
    prioridad: 1,
    productosComplementarios: [],
    productosAEVitar: [],
    notas: 'Apoyo al tracto urinario con cranberry.'
  },

  'GOLDEN FLX': {
    especialidadPrincipal: [
      'articulaciones',
      'movilidad',
      'dolor articular',
      'artritis',
      'artrosis',
      'inflamacion articular',
      'antioxidante'
    ],
    prioridad: 1,
    productosComplementarios: [],
    productosAEVitar: [],
    notas: 'Movilidad y cuidado de articulaciones. Alto poder antioxidante.'
  },

  'BEAUTY-IN': {
    especialidadPrincipal: [
      'colageno',
      'piel',
      'belleza',
      'uñas',
      'cabello',
      'anti edad',
      'antiaging',
      'juvenil'
    ],
    prioridad: 1,
    productosComplementarios: ['YOUTH ELIXIR'],
    productosAEVitar: [],
    notas: 'Colágeno para piel, uñas y cabello.'
  },

  'YOUTH ELIXIR': {
    especialidadPrincipal: [
      'juventud',
      'vitalidad celular',
      'antiaging',
      'anti edad',
      'envejecimiento',
      'hgh',
      'hormona crecimiento'
    ],
    prioridad: 2,
    productosComplementarios: ['BEAUTY-IN'],
    productosAEVitar: [],
    notas: 'Juventud y vitalidad celular. Complemento ideal de Beauty-In.'
  },

  'VERA+': {
    especialidadPrincipal: [
      'defensas',
      'inmunidad',
      'sistema inmunologico',
      'aloe vera',
      'proteccion natural',
      'resfriado',
      'gripe'
    ],
    prioridad: 1,
    productosComplementarios: [],
    productosAEVitar: [],
    notas: 'Aloe vera para fortalecer las defensas.'
  },

  'GANO+ CAPPUCCINO': {
    especialidadPrincipal: [
      'inmunidad',
      'ganoderma',
      'reishi',
      'hongos medicinales',
      'defensas',
      'sistema inmunologico',
      'cafe funcional'
    ],
    prioridad: 1,
    productosComplementarios: [],
    productosAEVitar: [],
    notas: 'Ganoderma para inmunidad. Alternativa al café tradicional.'
  },

  'PRE SPORT PRO EDITION': {
    especialidadPrincipal: [
      'pre entrenamiento',
      'pre entreno',
      'pre workout',
      'energia para entrenar',
      'rendimiento deportivo'
    ],
    prioridad: 1,
    productosComplementarios: ['POST SPORT PRO EDITION'],
    productosAEVitar: [],
    notas: 'Pre-entreno para máximo rendimiento.'
  },

  'POST SPORT PRO EDITION': {
    especialidadPrincipal: [
      'post entrenamiento',
      'post entreno',
      'post workout',
      'recuperacion deportiva',
      'recuperacion muscular'
    ],
    prioridad: 1,
    productosComplementarios: ['PRE SPORT PRO EDITION'],
    productosAEVitar: [],
    notas: 'Recuperación post-entreno.'
  },

  'NUTRADAY': {
    especialidadPrincipal: [
      'nutricion infantil',
      'niños',
      'niñas',
      'desarrollo infantil',
      'vitaminas para niños',
      'hidratacion infantil'
    ],
    prioridad: 1,
    productosComplementarios: [],
    productosAEVitar: [],
    notas: 'Nutrición completa para niños.'
  },

  'PROBAL': {
    especialidadPrincipal: [
      'balance hormonal femenino',
      'mujer',
      'hormonas femeninas',
      'salud femenina',
      'ciclo menstrual'
    ],
    prioridad: 1,
    productosComplementarios: [],
    productosAEVitar: [],
    notas: 'Balance hormonal para la mujer.'
  },

  'CAFÉ & CAFÉ FIT CAPPUCCINO': {
    especialidadPrincipal: [
      'cafe',
      'cafe funcional',
      'cappuccino',
      'bebida caliente'
    ],
    prioridad: 2,
    productosComplementarios: [],
    productosAEVitar: [],
    notas: 'Café funcional. Alternativa al café tradicional.'
  }
};

/**
 * Obtiene la especialidad principal de un producto
 */
export const getProductSpecialty = (productName) => {
  const normalized = productName.toUpperCase().trim();
  const entry = PRODUCT_SPECIALTIES[normalized];
  return entry?.especialidadPrincipal || [];
};

/**
 * Obtiene la prioridad de un producto (menor = más prioritario)
 */
export const getProductPriority = (productName) => {
  const normalized = productName.toUpperCase().trim();
  const entry = PRODUCT_SPECIALTIES[normalized];
  return entry?.prioridad ?? 99;
};

/**
 * Obtiene los productos complementarios definidos por especialidad
 */
export const getSpecialtyComplementary = (productName) => {
  const normalized = productName.toUpperCase().trim();
  const entry = PRODUCT_SPECIALTIES[normalized];
  return entry?.productosComplementarios || [];
};

/**
 * Obtiene los productos a evitar para un producto
 */
export const getProductsToAvoid = (productName) => {
  const normalized = productName.toUpperCase().trim();
  const entry = PRODUCT_SPECIALTIES[normalized];
  return entry?.productosAEVitar || [];
};

/**
 * Obtiene las notas de un producto
 */
export const getProductNotes = (productName) => {
  const normalized = productName.toUpperCase().trim();
  const entry = PRODUCT_SPECIALTIES[normalized];
  return entry?.notas || '';
};

export default {
  PRODUCT_SPECIALTIES,
  getProductSpecialty,
  getProductPriority,
  getSpecialtyComplementary,
  getProductsToAvoid,
  getProductNotes
};
