/**
 * Customer Memory Engine - Phase 3 Tests
 * 
 * Valida los 7 módulos del sistema de memoria comercial:
 *   1. visitorProfile - Memoria por visitante
 *   2. returningDetection - Detección de cliente recurrente
 *   3. intentProgression - Evolución de intención
 *   4. productJourney - Patrones de productos
 *   5. businessJourney - Separación negocio vs consumo
 *   6. humanFollowUp - Detección de asesor humano
 *   7. storageLayer - localStorage + Supabase
 * 
 * Ejecutar: npx jest lib/__tests__/customerMemory.test.js --no-coverage
 */

import {
  createEmptyVisitorProfile,
  getOrCreateVisitorProfile,
  updateVisitorProfile,
  detectReturningCustomer,
  analyzeIntentProgression,
  analyzeProductJourney,
  detectBusinessLead,
  getBusinessLeadInfo,
  detectHumanFollowUp,
  calculatePurchaseProbability,
  generateProfileSummary
} from '../customerMemory.js';

// ===================================================================
// HELPERS
// ===================================================================

// Mock localStorage for Node.js environment
const createMockStorage = () => {
  const store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key: (index) => Object.keys(store)[index] || null
  };
};

// Mock Date.now() for predictable timestamps
const mockDate = (isoString) => {
  const realDate = Date;
  global.Date = class extends realDate {
    constructor(...args) {
      if (args.length === 0) return new realDate(isoString);
      return new realDate(...args);
    }
    static now() {
      return new realDate(isoString).getTime();
    }
  };
};

const restoreDate = () => {
  // No need to restore in test context
};

// ===================================================================
// SETUP
// ===================================================================

beforeEach(() => {
  // Setup mock localStorage
  if (typeof localStorage === 'undefined') {
    global.localStorage = createMockStorage();
  }
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

// ===================================================================
// TEST 1: VISITOR PROFILE - Creación y actualización de perfil
// ===================================================================

describe('createEmptyVisitorProfile', () => {
  test('debe crear perfil vacío con visitorId', () => {
    const profile = createEmptyVisitorProfile('test-visitor-1');
    
    expect(profile).toBeDefined();
    expect(profile.visitorId).toBe('test-visitor-1');
    expect(profile.firstSeen).toBeDefined();
    expect(profile.lastSeen).toBeDefined();
    expect(profile.visitCount).toBe(1);
    expect(profile.totalMessages).toBe(0);
    expect(profile.interestedProducts).toEqual([]);
    expect(profile.mainCategoryInterest).toBeNull();
    expect(profile.highestIntentReached).toBe('explorando');
    expect(profile.lastImportantPhrase).toBe('');
    expect(profile.contactedHuman).toBe(false);
    expect(profile.businessLead).toBe(false);
    expect(profile.intentHistory).toEqual([]);
    expect(profile.visitHistory).toEqual([]);
    expect(profile.lastSession).toBeDefined();
    expect(profile.lastSession.messages).toBe(0);
  });
});

describe('getOrCreateVisitorProfile', () => {
  test('debe crear nuevo perfil si no existe', () => {
    const profile = getOrCreateVisitorProfile('new-visitor');
    
    expect(profile).toBeDefined();
    expect(profile.visitorId).toBe('new-visitor');
    expect(profile.visitCount).toBe(1);
  });

  test('debe retornar perfil existente', () => {
    const profile1 = getOrCreateVisitorProfile('existing-visitor');
    const profile2 = getOrCreateVisitorProfile('existing-visitor');
    
    expect(profile1.visitorId).toBe('existing-visitor');
    expect(profile2.visitorId).toBe('existing-visitor');
  });

  test('debe retornar null si no hay visitorId', () => {
    expect(getOrCreateVisitorProfile(null)).toBeNull();
    expect(getOrCreateVisitorProfile('')).toBeNull();
  });
});

describe('updateVisitorProfile', () => {
  test('debe actualizar perfil con mensaje básico', () => {
    const profile = updateVisitorProfile('test-update-1', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    expect(profile).toBeDefined();
    expect(profile.totalMessages).toBe(1);
    expect(profile.interestedProducts).toContain('prunex');
    expect(profile.highestIntentReached).toBe('explorando');
    expect(profile.lastImportantPhrase).toBe('Qué es Prunex?');
    expect(profile.lastSession.messages).toBe(1);
  });

  test('debe actualizar intención más alta', () => {
    // Primera interacción: explorando
    updateVisitorProfile('test-intent-1', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    // Segunda interacción: evaluando
    const profile = updateVisitorProfile('test-intent-1', {
      message: 'Cuánto cuesta?',
      products: ['prunex'],
      intent: 'evaluando'
    });
    
    expect(profile.highestIntentReached).toBe('evaluando');
    expect(profile.intentHistory.length).toBe(2);
  });

  test('debe actualizar a compra', () => {
    updateVisitorProfile('test-intent-2', {
      message: 'Qué es ON?',
      products: ['on'],
      intent: 'explorando'
    });
    
    updateVisitorProfile('test-intent-2', {
      message: 'Cuánto vale?',
      products: ['on'],
      intent: 'evaluando'
    });
    
    const profile = updateVisitorProfile('test-intent-2', {
      message: 'Quiero comprar',
      products: ['on'],
      intent: 'compra'
    });
    
    expect(profile.highestIntentReached).toBe('compra');
    expect(profile.intentHistory.length).toBe(3);
  });

  test('debe marcar businessLead', () => {
    const profile = updateVisitorProfile('test-business-1', {
      message: 'Quiero ser distribuidor',
      products: [],
      intent: 'negocio',
      isBusiness: true
    });
    
    expect(profile.businessLead).toBe(true);
    expect(profile.highestIntentReached).toBe('negocio');
  });

  test('debe marcar contactedHuman', () => {
    const profile = updateVisitorProfile('test-human-1', {
      message: 'Quiero hablar con un asesor',
      products: [],
      intent: 'explorando',
      contactedHuman: true
    });
    
    expect(profile.contactedHuman).toBe(true);
  });

  test('debe acumular productos únicos', () => {
    updateVisitorProfile('test-products-1', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    updateVisitorProfile('test-products-1', {
      message: 'Y Flora Liv?',
      products: ['flora liv'],
      intent: 'explorando'
    });
    
    const profile = updateVisitorProfile('test-products-1', {
      message: 'Prunex otra vez',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    expect(profile.interestedProducts.length).toBe(2);
    expect(profile.interestedProducts).toContain('prunex');
    expect(profile.interestedProducts).toContain('flora liv');
  });

  test('debe inferir categoría principal', () => {
    const profile = updateVisitorProfile('test-category-1', {
      message: 'Qué es Prunex y Flora Liv?',
      products: ['prunex', 'flora liv'],
      intent: 'explorando'
    });
    
    expect(profile.mainCategoryInterest).toBe('digestivo');
  });
});

// ===================================================================
// TEST 2: RETURNING CUSTOMER DETECTION
// ===================================================================

describe('detectReturningCustomer', () => {
  test('debe retornar null para primera visita', () => {
    const result = detectReturningCustomer('first-visit');
    expect(result).toBeNull();
  });

  test('debe detectar retorno después de horas', () => {
    // Simular primera visita
    const profile1 = updateVisitorProfile('return-test-1', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    // Modificar lastSession.endedAt para simular tiempo pasado
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 2); // 2 horas antes
    
    // Forzar nueva visita modificando el perfil directamente
    const memory = JSON.parse(localStorage.getItem('fuxion-customer-memory'));
    memory.visitors['return-test-1'].lastSession.endedAt = pastDate.toISOString();
    localStorage.setItem('fuxion-customer-memory', JSON.stringify(memory));
    
    // Segunda visita
    updateVisitorProfile('return-test-1', {
      message: 'Cuánto cuesta Prunex?',
      products: ['prunex'],
      intent: 'evaluando'
    });
    
    const result = detectReturningCustomer('return-test-1');
    expect(result).not.toBeNull();
    expect(result.detected).toBe(true);
    expect(result.returnType).toBe('horas');
    expect(result.visitCount).toBeGreaterThanOrEqual(2);
  });

  test('debe detectar cambio de intención entre visitas', () => {
    // Primera visita: explorando
    const profile1 = updateVisitorProfile('return-evolve-1', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    // Simular tiempo pasado
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3); // 3 días antes
    const memory = JSON.parse(localStorage.getItem('fuxion-customer-memory'));
    memory.visitors['return-evolve-1'].lastSession.endedAt = pastDate.toISOString();
    localStorage.setItem('fuxion-customer-memory', JSON.stringify(memory));
    
    // Segunda visita: evaluando
    updateVisitorProfile('return-evolve-1', {
      message: 'Cuánto cuesta?',
      products: ['prunex'],
      intent: 'evaluando'
    });
    
    const result = detectReturningCustomer('return-evolve-1');
    expect(result).not.toBeNull();
    expect(result.previousIntent).toBe('explorando');
    expect(result.currentIntent).toBe('evaluando');
    expect(result.intentEvolved).toBe(true);
  });

  test('debe detectar nuevo producto en visita recurrente', () => {
    // Primera visita: Prunex
    updateVisitorProfile('return-product-1', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    // Simular tiempo pasado
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    const memory = JSON.parse(localStorage.getItem('fuxion-customer-memory'));
    memory.visitors['return-product-1'].lastSession.endedAt = pastDate.toISOString();
    localStorage.setItem('fuxion-customer-memory', JSON.stringify(memory));
    
    // Segunda visita: Flora Liv (nuevo producto)
    updateVisitorProfile('return-product-1', {
      message: 'Qué es Flora Liv?',
      products: ['flora liv'],
      intent: 'explorando'
    });
    
    const result = detectReturningCustomer('return-product-1');
    expect(result).not.toBeNull();
    expect(result.newProducts).toContain('flora liv');
  });
});

// ===================================================================
// TEST 3: INTENT PROGRESSION
// ===================================================================

describe('analyzeIntentProgression', () => {
  test('debe retornar sin progresión para visitante nuevo', () => {
    const result = analyzeIntentProgression('new-progression');
    expect(result).not.toBeNull();
    expect(result.hasProgression).toBe(false);
    expect(result.currentIntent).toBe('explorando');
  });

  test('debe detectar progresión explorando → evaluando', () => {
    updateVisitorProfile('prog-1', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    updateVisitorProfile('prog-1', {
      message: 'Cuánto cuesta?',
      products: ['prunex'],
      intent: 'evaluando'
    });
    
    const result = analyzeIntentProgression('prog-1');
    expect(result.hasProgression).toBe(true);
    expect(result.firstIntent).toBe('explorando');
    expect(result.lastIntent).toBe('evaluando');
    expect(result.progressionScore).toBeGreaterThan(0);
    expect(result.stages.length).toBeGreaterThanOrEqual(2);
  });

  test('debe detectar progresión completa explorando → evaluando → compra', () => {
    updateVisitorProfile('prog-full', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    updateVisitorProfile('prog-full', {
      message: 'Cuánto cuesta?',
      products: ['prunex'],
      intent: 'evaluando'
    });
    
    updateVisitorProfile('prog-full', {
      message: 'Quiero comprar',
      products: ['prunex'],
      intent: 'compra'
    });
    
    const result = analyzeIntentProgression('prog-full');
    expect(result.hasProgression).toBe(true);
    expect(result.firstIntent).toBe('explorando');
    expect(result.lastIntent).toBe('compra');
    expect(result.totalStages).toBeGreaterThanOrEqual(3);
    expect(result.progressionScore).toBeGreaterThanOrEqual(50);
  });

  test('debe detectar negocio como progresión separada', () => {
    updateVisitorProfile('prog-business', {
      message: 'Qué es FuXion?',
      products: [],
      intent: 'explorando'
    });
    
    updateVisitorProfile('prog-business', {
      message: 'Quiero ser distribuidor',
      products: [],
      intent: 'negocio',
      isBusiness: true
    });
    
    const result = analyzeIntentProgression('prog-business');
    expect(result.hasProgression).toBe(true);
    expect(result.lastIntent).toBe('negocio');
  });
});

// ===================================================================
// TEST 4: PRODUCT JOURNEY
// ===================================================================

describe('analyzeProductJourney', () => {
  test('debe retornar sin productos para lista vacía', () => {
    const result = analyzeProductJourney([]);
    expect(result.hasProducts).toBe(false);
    expect(result.mainCategory).toBeNull();
  });

  test('debe detectar categoría digestivo para Prunex + Flora Liv + Liquid Fiber', () => {
    const result = analyzeProductJourney(['prunex', 'flora liv', 'liquid fiber']);
    
    expect(result.hasProducts).toBe(true);
    expect(result.mainCategory).toBe('digestivo');
    expect(result.categoryLabel).toBe('Bienestar digestivo');
    expect(result.productCount).toBe(3);
  });

  test('debe detectar categoría peso para Thermo T3 + NoCarb-T', () => {
    const result = analyzeProductJourney(['thermo t3', 'nocarb-t']);
    
    expect(result.hasProducts).toBe(true);
    expect(result.mainCategory).toBe('peso');
    expect(result.categoryLabel).toBe('Control de peso');
  });

  test('debe detectar categoría energía para ON + Vitaenergía', () => {
    const result = analyzeProductJourney(['on', 'vitaenergía']);
    
    expect(result.hasProducts).toBe(true);
    expect(result.mainCategory).toBe('energía');
    expect(result.categoryLabel).toBe('Energía y vitalidad');
  });

  test('debe detectar categoría deporte para Protein + Sport', () => {
    const result = analyzeProductJourney(['protein active', 'pre sport']);
    
    expect(result.hasProducts).toBe(true);
    expect(result.mainCategory).toBe('deporte');
    expect(result.categoryLabel).toBe('Rendimiento deportivo');
  });

  test('NO debe mostrar lista de 10 productos individuales', () => {
    const result = analyzeProductJourney([
      'prunex', 'flora liv', 'liquid fiber', 'thermo t3', 'nocarb-t',
      'on', 'vitaenergía', 'protein active', 'beauty in', 'golden flx'
    ]);
    
    expect(result.hasProducts).toBe(true);
    // Debe mostrar categoría dominante, NO lista de 10 productos
    expect(result.mainCategory).toBeDefined();
    expect(result.categoryLabel).toBeDefined();
    // productsByCategory debe agrupar, no listar plano
    expect(result.productsByCategory).toBeDefined();
    // Verificar que no hay una propiedad "allProducts" plana
    expect(result.allProducts).toBeUndefined();
  });

  test('debe agrupar productos por categoría', () => {
    const result = analyzeProductJourney(['prunex', 'flora liv', 'thermo t3']);
    
    expect(result.productsByCategory).toBeDefined();
    expect(result.productsByCategory.length).toBeGreaterThanOrEqual(2);
    
    const digestivo = result.productsByCategory.find(p => p.category === 'digestivo');
    expect(digestivo).toBeDefined();
    expect(digestivo.products.length).toBe(2);
    
    const peso = result.productsByCategory.find(p => p.category === 'peso');
    expect(peso).toBeDefined();
    expect(peso.products.length).toBe(1);
  });
});

// ===================================================================
// TEST 5: BUSINESS JOURNEY
// ===================================================================

describe('detectBusinessLead', () => {
  test('debe detectar "ganar dinero"', () => {
    expect(detectBusinessLead('Quiero ganar dinero con FuXion')).toBe(true);
  });

  test('debe detectar "ser distribuidor"', () => {
    expect(detectBusinessLead('Cómo puedo ser distribuidor?')).toBe(true);
  });

  test('debe detectar "oportunidad de negocio"', () => {
    expect(detectBusinessLead('Cuéntame sobre la oportunidad de negocio')).toBe(true);
  });

  test('debe detectar "vender"', () => {
    expect(detectBusinessLead('Quiero vender productos FuXion')).toBe(true);
  });

  test('debe detectar "rangos" y "bonos"', () => {
    expect(detectBusinessLead('Cómo funcionan los rangos y bonos?')).toBe(true);
  });

  test('debe detectar "bono auto"', () => {
    expect(detectBusinessLead('Qué es el bono auto?')).toBe(true);
  });

  test('debe detectar "fondo país"', () => {
    expect(detectBusinessLead('Cómo funciona el fondo país?')).toBe(true);
  });

  test('NO debe detectar consulta de producto como negocio', () => {
    expect(detectBusinessLead('Qué es Prunex?')).toBe(false);
    expect(detectBusinessLead('Cuánto cuesta ON?')).toBe(false);
    expect(detectBusinessLead('Quiero comprar')).toBe(false);
  });
});

describe('getBusinessLeadInfo', () => {
  test('debe retornar null si no es lead de negocio', () => {
    updateVisitorProfile('not-business', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    const result = getBusinessLeadInfo('not-business');
    expect(result).toBeNull();
  });

  test('debe retornar info si es lead de negocio', () => {
    updateVisitorProfile('yes-business', {
      message: 'Quiero ser distribuidor',
      products: [],
      intent: 'negocio',
      isBusiness: true
    });
    
    const result = getBusinessLeadInfo('yes-business');
    expect(result).not.toBeNull();
    expect(result.isBusinessLead).toBe(true);
    expect(result.label).toContain('oportunidad FuXion');
  });
});

// ===================================================================
// TEST 6: HUMAN FOLLOW-UP DETECTION
// ===================================================================

describe('detectHumanFollowUp', () => {
  test('debe detectar solicitud de asesor', () => {
    const result = detectHumanFollowUp('Quiero hablar con un asesor');
    expect(result.detected).toBe(true);
    expect(result.type).toBe('asesor');
  });

  test('debe detectar WhatsApp', () => {
    const result = detectHumanFollowUp('Mi whatsapp es 912345678');
    expect(result.detected).toBe(true);
    expect(result.type).toBe('whatsapp');
  });

  test('debe detectar correo electrónico', () => {
    const result = detectHumanFollowUp('Mi correo es juan@email.com');
    expect(result.detected).toBe(true);
    expect(result.type).toBe('correo');
  });

  test('debe detectar teléfono', () => {
    const result = detectHumanFollowUp('Mi número es 912345678');
    expect(result.detected).toBe(true);
    expect(result.type).toBe('telefono');
  });

  test('NO debe detectar en mensaje normal', () => {
    const result = detectHumanFollowUp('Qué es Prunex?');
    expect(result.detected).toBe(false);
  });
});

// ===================================================================
// TEST 7: PURCHASE PROBABILITY
// ===================================================================

describe('calculatePurchaseProbability', () => {
  test('debe dar probabilidad baja para explorando', () => {
    const profile = updateVisitorProfile('prob-low', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    const prob = calculatePurchaseProbability(profile);
    expect(prob).toBeLessThan(50);
  });

  test('debe dar probabilidad media para evaluando', () => {
    updateVisitorProfile('prob-med', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    const profile = updateVisitorProfile('prob-med', {
      message: 'Cuánto cuesta?',
      products: ['prunex'],
      intent: 'evaluando'
    });
    
    const prob = calculatePurchaseProbability(profile);
    expect(prob).toBeGreaterThanOrEqual(40);
  });

  test('debe dar probabilidad alta para compra', () => {
    updateVisitorProfile('prob-high', {
      message: 'Qué es ON?',
      products: ['on'],
      intent: 'explorando'
    });
    
    updateVisitorProfile('prob-high', {
      message: 'Cuánto vale?',
      products: ['on'],
      intent: 'evaluando'
    });
    
    const profile = updateVisitorProfile('prob-high', {
      message: 'Quiero comprar',
      products: ['on'],
      intent: 'compra'
    });
    
    const prob = calculatePurchaseProbability(profile);
    expect(prob).toBeGreaterThanOrEqual(80);
  });
});

// ===================================================================
// TEST 8: QA OBLIGATORIO - Escenarios completos
// ===================================================================

describe('QA Obligatorio - Test 1: Día simulado 1', () => {
  test('"qué es Prunex" debe resultar en explorando', () => {
    const profile = updateVisitorProfile('qa-test-1', {
      message: 'qué es Prunex',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    expect(profile.highestIntentReached).toBe('explorando');
    expect(profile.interestedProducts).toContain('prunex');
    
    const progression = analyzeIntentProgression('qa-test-1');
    expect(progression.currentIntent).toBe('explorando');
  });
});

describe('QA Obligatorio - Test 2: Mismo usuario, precio', () => {
  test('"precio Prunex" debe resultar en evaluando + cliente recurrente', () => {
    // Primera visita
    updateVisitorProfile('qa-test-2', {
      message: 'qué es Prunex',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    // Simular tiempo pasado
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const memory = JSON.parse(localStorage.getItem('fuxion-customer-memory'));
    memory.visitors['qa-test-2'].lastSession.endedAt = pastDate.toISOString();
    localStorage.setItem('fuxion-customer-memory', JSON.stringify(memory));
    
    // Segunda visita
    const profile = updateVisitorProfile('qa-test-2', {
      message: 'precio Prunex',
      products: ['prunex'],
      intent: 'evaluando'
    });
    
    expect(profile.highestIntentReached).toBe('evaluando');
    
    const returning = detectReturningCustomer('qa-test-2');
    expect(returning).not.toBeNull();
    expect(returning.detected).toBe(true);
    
    const progression = analyzeIntentProgression('qa-test-2');
    expect(progression.hasProgression).toBe(true);
    expect(progression.firstIntent).toBe('explorando');
    expect(progression.lastIntent).toBe('evaluando');
  });
});

describe('QA Obligatorio - Test 3: Mismo usuario, compra', () => {
  test('"quiero comprar" debe resultar en compra alta', () => {
    // Primera visita
    updateVisitorProfile('qa-test-3', {
      message: 'qué es Prunex',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    // Segunda visita
    updateVisitorProfile('qa-test-3', {
      message: 'precio Prunex',
      products: ['prunex'],
      intent: 'evaluando'
    });
    
    // Tercera visita
    const profile = updateVisitorProfile('qa-test-3', {
      message: 'quiero comprar',
      products: ['prunex'],
      intent: 'compra'
    });
    
    expect(profile.highestIntentReached).toBe('compra');
    
    const prob = calculatePurchaseProbability(profile);
    expect(prob).toBeGreaterThanOrEqual(80);
    
    const progression = analyzeIntentProgression('qa-test-3');
    expect(progression.hasProgression).toBe(true);
    expect(progression.lastIntent).toBe('compra');
  });
});

describe('QA Obligatorio - Test 4: Negocio', () => {
  test('"quiero ser distribuidor" debe resultar en negocio, NO compra', () => {
    const profile = updateVisitorProfile('qa-test-4', {
      message: 'quiero ser distribuidor',
      products: [],
      intent: 'negocio',
      isBusiness: true
    });
    
    expect(profile.highestIntentReached).toBe('negocio');
    expect(profile.businessLead).toBe(true);
    expect(profile.interestedProducts).toEqual([]); // Sin productos de consumo
    
    const businessInfo = getBusinessLeadInfo('qa-test-4');
    expect(businessInfo).not.toBeNull();
    expect(businessInfo.isBusinessLead).toBe(true);
  });
});

describe('QA Obligatorio - Test 5: 5 productos', () => {
  test('debe mostrar categoría dominante, NO lista infinita', () => {
    // Simular 5 productos vistos
    updateVisitorProfile('qa-test-5', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    updateVisitorProfile('qa-test-5', {
      message: 'Y Flora Liv?',
      products: ['flora liv'],
      intent: 'explorando'
    });
    
    updateVisitorProfile('qa-test-5', {
      message: 'Liquid Fiber?',
      products: ['liquid fiber'],
      intent: 'explorando'
    });
    
    updateVisitorProfile('qa-test-5', {
      message: 'Thermo T3?',
      products: ['thermo t3'],
      intent: 'explorando'
    });
    
    updateVisitorProfile('qa-test-5', {
      message: 'Y ON?',
      products: ['on'],
      intent: 'explorando'
    });
    
    const profile = getOrCreateVisitorProfile('qa-test-5');
    expect(profile.interestedProducts.length).toBe(5);
    
    const productJourney = analyzeProductJourney(profile.interestedProducts);
    expect(productJourney.hasProducts).toBe(true);
    expect(productJourney.mainCategory).toBe('digestivo'); // 3 de 5 son digestivo
    expect(productJourney.categoryLabel).toBe('Bienestar digestivo');
    
    // NO debe tener lista plana de 10 productos
    expect(productJourney.productsByCategory).toBeDefined();
    // Debe agrupar por categoría
    const digestivo = productJourney.productsByCategory.find(p => p.category === 'digestivo');
    expect(digestivo).toBeDefined();
    expect(digestivo.products.length).toBe(3);
  });
});

// ===================================================================
// TEST 9: GENERATE PROFILE SUMMARY
// ===================================================================

describe('generateProfileSummary', () => {
  test('debe generar resumen completo para visitante con historial', () => {
    updateVisitorProfile('summary-1', {
      message: 'Qué es Prunex?',
      products: ['prunex'],
      intent: 'explorando'
    });
    
    updateVisitorProfile('summary-1', {
      message: 'Cuánto cuesta?',
      products: ['prunex'],
      intent: 'evaluando'
    });
    
    const summary = generateProfileSummary('summary-1');
    expect(summary).not.toBeNull();
    expect(summary.visitorId).toBe('summary-1');
    expect(summary.visitCount).toBe(1);
    expect(summary.totalMessages).toBe(2);
    expect(summary.highestIntentReached).toBe('evaluando');
    expect(summary.purchaseProbability).toBeGreaterThanOrEqual(40);
    expect(summary.productJourney).toBeDefined();
    expect(summary.progression).toBeDefined();
  });
});
