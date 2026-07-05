/**
 * Product Relationship Engine
 *
 * Grafo de relaciones entre productos FUXION.
 * Permite al CRE comprender qué productos se complementan,
 * cuáles son alternativas y cuáles son incompatibles.
 */

// ===================================================================
// GRAFO DE RELACIONES ENTRE PRODUCTOS
// ===================================================================
const PRODUCT_GRAPH = {
  'PRUNEX 1': {
    complements: ['FLORA LIV', 'LIQUID FIBER'],
    alternatives: ['LIQUID FIBER'],
    incompatible: [],
    category: 'Limpieza del Colon',
    phase: 1, // Primera fase: limpieza
    description: 'Limpieza inicial del colon'
  },
  'LIQUID FIBER': {
    complements: ['FLORA LIV'],
    alternatives: ['PRUNEX 1'],
    incompatible: [],
    category: 'Limpieza del Sistema Digestivo',
    phase: 1,
    description: 'Fibra soluble para tránsito regular'
  },
  'FLORA LIV': {
    complements: ['PRUNEX 1', 'LIQUID FIBER'],
    alternatives: [],
    incompatible: [],
    category: 'Regeneración Flora Intestinal',
    phase: 2, // Segunda fase: regeneración
    description: 'Probióticos para regenerar flora intestinal'
  },
  'REXET': {
    complements: ['ALPHA BALANCE'],
    alternatives: ['ALPHA BALANCE'],
    incompatible: [],
    category: 'Desintoxicación Hepática',
    phase: 1,
    description: 'Desintoxicación del hígado'
  },
  'ALPHA BALANCE': {
    complements: ['REXET'],
    alternatives: ['REXET'],
    incompatible: [],
    category: 'Balance Metabólico',
    phase: 2,
    description: 'Balance de colesterol y triglicéridos'
  },
  'THERMO T3': {
    complements: ['NOCARB-T', 'PROTEIN ACTIVE FIT'],
    alternatives: [],
    incompatible: [],
    category: 'Control de Peso',
    phase: 1,
    description: 'Termogénico para quemar grasa'
  },
  'NOCARB-T': {
    complements: ['THERMO T3', 'PROTEIN ACTIVE FIT'],
    alternatives: [],
    incompatible: [],
    category: 'Control de Peso',
    phase: 1,
    description: 'Bloqueador de carbohidratos'
  },
  'PROTEIN ACTIVE FIT': {
    complements: ['THERMO T3', 'NOCARB-T'],
    alternatives: ['BIOPROTEIN ACTIVE'],
    incompatible: [],
    category: 'Sport',
    phase: 2,
    description: 'Proteína para masa muscular'
  },
  'BIOPROTEIN ACTIVE': {
    complements: ['THERMO T3'],
    alternatives: ['PROTEIN ACTIVE FIT'],
    incompatible: [],
    category: 'Sport',
    phase: 2,
    description: 'Proteína vegetal'
  },
  'ON': {
    complements: [],
    alternatives: ['NO STRESS'],
    incompatible: [],
    category: 'Vigor Mental',
    phase: 1,
    description: 'Enfoque y concentración mental'
  },
  'NO STRESS': {
    complements: ['PASSION'],
    alternatives: ['ON'],
    incompatible: [],
    category: 'Vigor Mental',
    phase: 1,
    description: 'Relajación y manejo del estrés'
  },
  'PASSION': {
    complements: ['NO STRESS'],
    alternatives: [],
    incompatible: [],
    category: 'Bienestar Hormonal',
    phase: 2,
    description: 'Deseo y vitalidad'
  },
  'BERRY BALANCE': {
    complements: [],
    alternatives: [],
    incompatible: [],
    category: 'Salud Urinaria',
    phase: 1,
    description: 'Apoyo al tracto urinario'
  },
  'GOLDEN FLX': {
    complements: [],
    alternatives: [],
    incompatible: [],
    category: 'Cuidado Articular',
    phase: 1,
    description: 'Movilidad y articulaciones'
  },
  'BEAUTY-IN': {
    complements: ['YOUTH ELIXIR'],
    alternatives: ['YOUTH ELIXIR'],
    incompatible: [],
    category: 'Belleza',
    phase: 1,
    description: 'Colágeno para piel y uñas'
  },
  'YOUTH ELIXIR': {
    complements: ['BEAUTY-IN'],
    alternatives: ['BEAUTY-IN'],
    incompatible: [],
    category: 'Belleza',
    phase: 2,
    description: 'Juventud y vitalidad celular'
  },
  'VITA XTRA T+': {
    complements: [],
    alternatives: ['VITAENERGÍA'],
    incompatible: [],
    category: 'Energía',
    phase: 1,
    description: 'Multivitamínico energizante'
  },
  'VITAENERGÍA': {
    complements: [],
    alternatives: ['VITA XTRA T+'],
    incompatible: [],
    category: 'Energía',
    phase: 1,
    description: 'Energía natural'
  },
  'VERA+': {
    complements: [],
    alternatives: [],
    incompatible: [],
    category: 'Defensas',
    phase: 1,
    description: 'Aloe vera para defensas'
  },
  'GANO+ CAPPUCCINO': {
    complements: [],
    alternatives: [],
    incompatible: [],
    category: 'Defensas',
    phase: 1,
    description: 'Ganoderma para inmunidad'
  },
  'PRE SPORT PRO EDITION': {
    complements: ['POST SPORT PRO EDITION'],
    alternatives: [],
    incompatible: [],
    category: 'Sport',
    phase: 0,
    description: 'Pre-entreno'
  },
  'POST SPORT PRO EDITION': {
    complements: ['PRE SPORT PRO EDITION'],
    alternatives: [],
    incompatible: [],
    category: 'Sport',
    phase: 2,
    description: 'Recuperación post-entreno'
  },
  'NUTRADAY': {
    complements: [],
    alternatives: [],
    incompatible: [],
    category: 'Nutrición Infantil',
    phase: 1,
    description: 'Nutrición completa para niños'
  },
  'PROBAL': {
    complements: [],
    alternatives: [],
    incompatible: [],
    category: 'Bienestar Hormonal',
    phase: 1,
    description: 'Balance hormonal femenino'
  }
};

// ===================================================================
// FUNCIONES DEL MOTOR DE RELACIONES
// ===================================================================

/**
 * Obtiene productos complementarios para un producto dado
 */
export const getComplementaryProducts = (productName) => {
  const normalized = productName.toUpperCase().trim();
  const entry = PRODUCT_GRAPH[normalized];
  if (!entry) return [];
  return entry.complements || [];
};

/**
 * Obtiene productos alternativos para un producto dado
 */
export const getAlternativeProducts = (productName) => {
  const normalized = productName.toUpperCase().trim();
  const entry = PRODUCT_GRAPH[normalized];
  if (!entry) return [];
  return entry.alternatives || [];
};

/**
 * Obtiene la fase recomendada para un producto (orden de uso)
 */
export const getProductPhase = (productName) => {
  const normalized = productName.toUpperCase().trim();
  const entry = PRODUCT_GRAPH[normalized];
  return entry?.phase ?? 1;
};

/**
 * Obtiene la categoría de un producto
 */
export const getProductCategory = (productName) => {
  const normalized = productName.toUpperCase().trim();
  const entry = PRODUCT_GRAPH[normalized];
  return entry?.category || '';
};

/**
 * Verifica si dos productos son complementarios
 */
export const areComplementary = (productA, productB) => {
  const complements = getComplementaryProducts(productA);
  return complements.includes(productB.toUpperCase().trim());
};

/**
 * Verifica si dos productos son alternativas
 */
export const areAlternatives = (productA, productB) => {
  const alternatives = getAlternativeProducts(productA);
  return alternatives.includes(productB.toUpperCase().trim());
};

/**
 * Genera un plan de uso ordenado por fase para un conjunto de productos
 */
export const generateUsagePlan = (productNames = []) => {
  if (!productNames.length) return [];

  const productsWithPhase = productNames.map(name => ({
    name,
    phase: getProductPhase(name),
    category: getProductCategory(name)
  }));

  // Ordenar por fase (0 = pre, 1 = primero, 2 = después)
  productsWithPhase.sort((a, b) => a.phase - b.phase);

  return productsWithPhase;
};

/**
 * Obtiene todos los productos de una categoría
 */
export const getProductsByCategory = (category) => {
  return Object.entries(PRODUCT_GRAPH)
    .filter(([, entry]) => entry.category === category)
    .map(([name]) => name);
};

/**
 * Genera resumen de relaciones para un conjunto de productos
 */
export const generateRelationshipSummary = (productNames = []) => {
  if (!productNames.length) return '';

  const lines = [];
  const uniqueProducts = [...new Set(productNames)];

  // Agrupar por categoría
  const byCategory = {};
  uniqueProducts.forEach(name => {
    const cat = getProductCategory(name);
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(name);
  });

  // Generar resumen por categoría
  Object.entries(byCategory).forEach(([category, products]) => {
    lines.push(`Categoria: ${category}`);
    lines.push(`Productos: ${products.join(', ')}`);

    // Productos complementarios entre sí
    const allComplements = new Set();
    products.forEach(p => {
      getComplementaryProducts(p).forEach(c => {
        if (!products.includes(c)) allComplements.add(c);
      });
    });
    if (allComplements.size > 0) {
      lines.push(`Complementos sugeridos: ${[...allComplements].join(', ')}`);
    }

    // Orden de uso
    const plan = generateUsagePlan(products);
    if (plan.length > 1) {
      const order = plan.map((p, i) => `${i + 1}. ${p.name}`).join(' → ');
      lines.push(`Orden sugerido: ${order}`);
    }
    lines.push('');
  });

  return lines.join('\n');
};

export default {
  getComplementaryProducts,
  getAlternativeProducts,
  getProductPhase,
  getProductCategory,
  areComplementary,
  areAlternatives,
  generateUsagePlan,
  getProductsByCategory,
  generateRelationshipSummary
};
