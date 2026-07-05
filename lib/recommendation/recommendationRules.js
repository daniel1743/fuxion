/**
 * Recommendation Rules - Reglas de Negocio para Recomendaciones
 *
 * Define reglas explícitas de negocio que el PRE debe seguir.
 * Cada regla tiene:
 * - condicion: Función que evalúa si la regla aplica
 * - accion: Producto(s) a recomendar
 * - prioridad: Para resolver conflictos entre reglas
 * - razon: Explicación de por qué aplica esta regla
 */

// ===================================================================
// REGLAS DE NEGOCIO
// ===================================================================
export const BUSINESS_RULES = [
  // === REGLAS DE ESPECIALIDAD (prioridad 1 - las más importantes) ===

  {
    id: 'higado_graso_rexet',
    condicion: (text) => /\b(higado\s*graso|hígado\s*graso|higado graso|hígado graso)\b/i.test(text),
    accion: {
      productoPrincipal: 'REXET',
      productosSecundarios: ['ALPHA BALANCE'],
      productosComplementarios: ['PRUNEX 1'],
      productosAEVitar: ['VITA XTRA T+']
    },
    prioridad: 1,
    razon: 'REXET es el especialista en apoyo hepático. NUNCA usar Vita Xtra T+ como primera opción para hígado graso.'
  },

  {
    id: 'higado_detox_rexet',
    condicion: (text) => /\b(higado|hígado|higado\s*graso|hígado\s*graso|detox\s*hepatico|detox\s*hepático|desintoxicar\s*higado|desintoxicar\s*hígado|proteger\s*higado|proteger\s*hígado|apoyo\s*hepatico|apoyo\s*hepático)\b/i.test(text),
    accion: {
      productoPrincipal: 'REXET',
      productosSecundarios: ['ALPHA BALANCE'],
      productosComplementarios: ['PRUNEX 1'],
      productosAEVitar: ['VITA XTRA T+']
    },
    prioridad: 1,
    razon: 'REXET es el especialista en sistema hepático.'
  },

  {
    id: 'colesterol_alpha_balance',
    condicion: (text) => /\b(colesterol|trigliceridos|triglicéridos|grasa\s*en\s*sangre|lipidos|lípidos)\b/i.test(text),
    accion: {
      productoPrincipal: 'ALPHA BALANCE',
      productosSecundarios: ['REXET'],
      productosComplementarios: [],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'ALPHA BALANCE es el especialista en balance de colesterol y triglicéridos.'
  },

  {
    id: 'estrenimiento_prunex',
    condicion: (text) => /\b(estrenimiento|estreñimiento|constipacion|constipación|ir\s*al\s*baño|evacuar|heces\s*compactadas|colon\s*perezoso|transito\s*lento|tránsito\s*lento)\b/i.test(text),
    accion: {
      productoPrincipal: 'PRUNEX 1',
      productosSecundarios: ['LIQUID FIBER'],
      productosComplementarios: ['FLORA LIV'],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'PRUNEX 1 es la primera línea para estreñimiento y limpieza intestinal.'
  },

  {
    id: 'gases_prunex',
    condicion: (text) => /\b(gases|gas|hinchazon|hinchazón|hinchado|hinchada|pesadez|inflado)\b/i.test(text),
    accion: {
      productoPrincipal: 'PRUNEX 1',
      productosSecundarios: ['LIQUID FIBER'],
      productosComplementarios: ['FLORA LIV'],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'PRUNEX 1 elimina la fermentación que causa gases al limpiar el colon.'
  },

  {
    id: 'flora_intestinal_flora_liv',
    condicion: (text) => /\b(flora\s*intestinal|microbiota|probioticos|probióticos|prebioticos|prebióticos|recuperacion\s*intestinal|recuperación\s*intestinal)\b/i.test(text),
    accion: {
      productoPrincipal: 'FLORA LIV',
      productosSecundarios: [],
      productosComplementarios: ['PRUNEX 1', 'LIQUID FIBER'],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'FLORA LIV es el especialista en regeneración de flora intestinal.'
  },

  {
    id: 'gastritis_flora_liv',
    condicion: (text) => /\b(gastritis|reflujo|acidez|ardor\s*estomacal|colitis|colon\s*irritable)\b/i.test(text),
    accion: {
      productoPrincipal: 'FLORA LIV',
      productosSecundarios: [],
      productosComplementarios: ['PRUNEX 1'],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'FLORA LIV ayuda a equilibrar la flora intestinal, aliviando gastritis y reflujo.'
  },

  {
    id: 'bajar_peso_thermo',
    condicion: (text) => /\b(bajar\s*de\s*peso|perder\s*peso|adelgazar|control\s*de\s*peso|dieta|rebajar|obesidad|sobrepeso|quemar\s*grasa|oxidacion\s*grasa|oxidación\s*grasa)\b/i.test(text),
    accion: {
      productoPrincipal: 'THERMO T3',
      productosSecundarios: ['NOCARB-T'],
      productosComplementarios: ['PROTEIN ACTIVE FIT'],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'THERMO T3 es el termogénico especialista en oxidación de grasa y control de peso.'
  },

  {
    id: 'carbohidratos_nocarb',
    condicion: (text) => /\b(carbohidratos|harinas|frijol\s*blanco|bloquear\s*carbohidratos|nocarb|no\s*carb|absorcion\s*carbohidratos|absorción\s*carbohidratos)\b/i.test(text),
    accion: {
      productoPrincipal: 'NOCARB-T',
      productosSecundarios: ['THERMO T3'],
      productosComplementarios: ['PROTEIN ACTIVE FIT'],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'NOCARB-T es el especialista en bloqueo de carbohidratos.'
  },

  {
    id: 'energia_vitaenergia',
    condicion: (text) => /\b(energia|energía|cansancio|cansado|cansada|fatiga|agotamiento|agotado|agotada|sin\s*energia|sin\s*energías|vitalidad|activarme|despertar)\b/i.test(text),
    accion: {
      productoPrincipal: 'VITAENERGÍA',
      productosSecundarios: ['VITA XTRA T+'],
      productosComplementarios: [],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'VITAENERGÍA es la primera línea para energía y vitalidad.'
  },

  {
    id: 'concentracion_on',
    condicion: (text) => /\b(concentracion|concentración|concentrarme|concentrar|enfoque|enfocar|memoria|mente|cerebro|estudiar|estudio|atencion|atención|rendimiento\s*mental|trabajo\s*mental)\b/i.test(text),
    accion: {
      productoPrincipal: 'ON',
      productosSecundarios: ['NO STRESS'],
      productosComplementarios: [],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'ON es el especialista en concentración y enfoque mental.'
  },

  {
    id: 'estres_no_stress',
    condicion: (text) => /\b(estres|estrés|estresado|estresada|ansiedad|ansioso|ansiosa|nervios|nervioso|nerviosa|relajacion|relajación|relajar|calma|tranquilidad|tranquilo|tranquila|sueno|sueño|insomnio|descansar|dormir)\b/i.test(text),
    accion: {
      productoPrincipal: 'NO STRESS',
      productosSecundarios: [],
      productosComplementarios: [],
      productosAEVitar: ['PASSION']
    },
    prioridad: 1,
    razon: 'NO STRESS es el especialista en manejo del estrés y la ansiedad. PASSION NO es para dormir ni relajarse, es un producto de vitalidad y energía.'
  },

  {
    id: 'defensas_vera',
    condicion: (text) => /\b(defensas|inmunidad|inmunologico|inmunológico|sistema\s*inmunologico|sistema\s*inmunológico|resfriado|gripe|proteccion|protección)\b/i.test(text),
    accion: {
      productoPrincipal: 'VERA+',
      productosSecundarios: ['GANO+ CAPPUCCINO'],
      productosComplementarios: [],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'VERA+ es el especialista en defensas con aloe vera.'
  },

  {
    id: 'articulaciones_golden',
    condicion: (text) => /\b(articulaciones|articulacion|movilidad|dolor\s*articular|artritis|artrosis|inflamacion\s*articular|inflamación\s*articular)\b/i.test(text),
    accion: {
      productoPrincipal: 'GOLDEN FLX',
      productosSecundarios: [],
      productosComplementarios: [],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'GOLDEN FLX es el especialista en cuidado de articulaciones.'
  },

  {
    id: 'piel_beauty',
    condicion: (text) => /\b(piel|colageno|colágeno|belleza|uñas|cabello|anti\s*edad|antiaging|juvenil|arrugas)\b/i.test(text),
    accion: {
      productoPrincipal: 'BEAUTY-IN',
      productosSecundarios: ['YOUTH ELIXIR'],
      productosComplementarios: [],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'BEAUTY-IN es el especialista en colágeno para piel, uñas y cabello.'
  },

  {
    id: 'urinario_berry',
    condicion: (text) => /\b(urinario|urinaria|vias\s*urinarias|vías\s*urinarias|infeccion\s*urinaria|infección\s*urinaria|cistitis|cranberry|berri|berry)\b/i.test(text),
    accion: {
      productoPrincipal: 'BERRY BALANCE',
      productosSecundarios: [],
      productosComplementarios: [],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'BERRY BALANCE es el especialista en salud urinaria.'
  },

  {
    id: 'deportes_protein',
    condicion: (text) => /\b(proteina|proteína|musculo|músculo|masa\s*muscular|recuperacion\s*muscular|recuperación\s*muscular|post\s*entrenamiento|post\s*workout|pre\s*entrenamiento|pre\s*workout|rendimiento\s*deportivo)\b/i.test(text),
    accion: {
      productoPrincipal: 'PROTEIN ACTIVE FIT',
      productosSecundarios: ['BIOPROTEIN ACTIVE'],
      productosComplementarios: ['THERMO T3', 'NOCARB-T'],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'PROTEIN ACTIVE FIT es el especialista en proteína y recuperación muscular.'
  },

  {
    id: 'antioxidantes_vita_xtra',
    condicion: (text) => /\b(antioxidantes|antioxidante|multivitaminico|multivitamínico|vitaminas|minerales|nutricion\s*celular|nutrición\s*celular)\b/i.test(text),
    accion: {
      productoPrincipal: 'VITA XTRA T+',
      productosSecundarios: [],
      productosComplementarios: [],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'VITA XTRA T+ es el especialista en antioxidantes y apoyo nutricional general.'
  },

  {
    id: 'digestion_lenta_prunex',
    condicion: (text) => /\b(digestion\s*lenta|digestión\s*lenta|pesadez\s*estomacal|malestar\s*despues\s*de\s*comer|malestar\s*después\s*de\s*comer)\b/i.test(text),
    accion: {
      productoPrincipal: 'PRUNEX 1',
      productosSecundarios: ['FLORA LIV'],
      productosComplementarios: ['LIQUID FIBER'],
      productosAEVitar: []
    },
    prioridad: 1,
    razon: 'PRUNEX 1 ayuda a eliminar desechos acumulados que causan pesadez y digestion lenta.'
  },

  // === REGLAS DE COMBINACIÓN (prioridad 2) ===

  {
    id: 'gases_mas_higado_graso',
    condicion: (text) => /\b(gases|gas|hinchazon|hinchazón).*(higado\s*graso|hígado\s*graso|higado|hígado)/i.test(text) ||
                          /\b(higado\s*graso|hígado\s*graso|higado|hígado).*(gases|gas|hinchazon|hinchazón)/i.test(text),
    accion: {
      productoPrincipal: 'PRUNEX 1',
      productosSecundarios: ['REXET'],
      productosComplementarios: ['FLORA LIV', 'ALPHA BALANCE'],
      productosAEVitar: ['VITA XTRA T+']
    },
    prioridad: 0,
    razon: 'Cuando hay gases + hígado graso, PRUNEX 1 es primera línea para los gases y REXET para el hígado. Se pueden combinar.'
  },

  {
    id: 'estrenimiento_mas_flora',
    condicion: (text) => /\b(estrenimiento|estreñimiento|constipacion|constipación).*(flora|probiotico|probiótico|digestion|digestión)/i.test(text) ||
                          /\b(flora|probiotico|probiótico|digestion|digestión).*(estrenimiento|estreñimiento|constipacion|constipación)/i.test(text),
    accion: {
      productoPrincipal: 'PRUNEX 1',
      productosSecundarios: ['FLORA LIV'],
      productosComplementarios: ['LIQUID FIBER'],
      productosAEVitar: []
    },
    prioridad: 2,
    razon: 'Primero limpiar con PRUNEX 1, luego regenerar flora con FLORA LIV.'
  },

  {
    id: 'peso_mas_carbohidratos',
    condicion: (text) => /\b(peso|bajar\s*de\s*peso|perder\s*peso|dieta|adelgazar).*(carbohidratos|harinas|nocarb|no\s*carb)/i.test(text) ||
                          /\b(carbohidratos|harinas|nocarb|no\s*carb).*(peso|bajar\s*de\s*peso|perder\s*peso|dieta|adelgazar)/i.test(text),
    accion: {
      productoPrincipal: 'THERMO T3',
      productosSecundarios: ['NOCARB-T'],
      productosComplementarios: ['PROTEIN ACTIVE FIT'],
      productosAEVitar: []
    },
    prioridad: 2,
    razon: 'THERMO T3 quema grasa + NOCARB-T bloquea carbohidratos. Combinación ideal para control de peso.'
  }
];

// ===================================================================
// FUNCIONES DEL MOTOR DE REGLAS
// ===================================================================

/**
 * Evalúa todas las reglas de negocio contra un texto y devuelve
 * las reglas que coinciden, ordenadas por prioridad
 */
export const evaluateRules = (text) => {
  if (!text) return [];

  const matchedRules = [];

  for (const rule of BUSINESS_RULES) {
    try {
      if (rule.condicion(text)) {
        matchedRules.push(rule);
      }
    } catch (error) {
      console.warn(`Error evaluando regla ${rule.id}:`, error.message);
    }
  }

  // Ordenar por prioridad (menor = más prioritario)
  matchedRules.sort((a, b) => a.prioridad - b.prioridad);

  return matchedRules;
};

/**
 * Obtiene la mejor recomendación basada en las reglas de negocio
 */
export const getBestRecommendation = (text) => {
  const matchedRules = evaluateRules(text);

  if (matchedRules.length === 0) {
    return null;
  }

  // La regla de mayor prioridad (menor número) es la que aplica
  return matchedRules[0].accion;
};

/**
 * Obtiene todas las reglas que coinciden para un texto
 */
export const getMatchedRules = (text) => {
  return evaluateRules(text);
};

export default {
  BUSINESS_RULES,
  evaluateRules,
  getBestRecommendation,
  getMatchedRules
};
