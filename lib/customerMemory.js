/**
 * Customer Memory Engine - Phase 3
 * 
 * Convierte interacciones aisladas en historial comercial inteligente.
 * 
 * Módulos:
 *   1. visitorProfile - Memoria por visitante (firstSeen, lastSeen, visitCount, etc.)
 *   2. returningDetection - Detecta cuando un usuario vuelve (horas, días, semanas)
 *   3. intentProgression - Evolución de intención a través de visitas
 *   4. productJourney - Patrones de productos por categoría
 *   5. businessJourney - Separación negocio vs consumo
 *   6. humanFollowUp - Detección de solicitud de asesor humano
 *   7. storageLayer - localStorage (anónimo) + Supabase (registrado)
 * 
 * REGLAS:
 *   - NO almacenar datos médicos sensibles
 *   - NO modificar UI, SEO, productos, respuestas base IA, formularios
 *   - Mantener privacidad del visitante
 */

// ===================================================================
// CONSTANTES
// ===================================================================

const STORAGE_KEY = 'fuxion-customer-memory';
const MAX_STORED_VISITORS = 50;
const SESSION_TIMEOUT_MINUTES = 30;
const BUSINESS_PATTERNS = [
  /\b(ganar dinero|negocio|vender|distribuidor|rangos|bonos|bono auto|fondo pa[ií]s)\b/i,
  /\b(oportunidad|emprender|ingresos extra|ingreso extra|independencia financiera)\b/i,
  /\b(plan de compensaci[oó]n|modelo de negocio|afiliarme|ser socio|unirme)\b/i,
  /\b(trabajar con fuxion|trabajar con fuXion|emprender con fuxion|emprender con fuXion)\b/i,
  /\b(libertad financiera|negocio propio|negocio desde casa|ingreso pasivo)\b/i
];

const HUMAN_FOLLOWUP_PATTERNS = [
  /\b(asesor|humano|quiero hablar con alguien|hablar con un asesor)\b/i,
  /\b(contactar con un asesor|asesor humano|persona real|atenci[oó]n personalizada)\b/i,
  /\b(whatsapp|wa|wp)\s*:?\s*(\+?\d{1,3}[\s.-]?\d{7,10})\b/i,
  /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/i,
  /\b(mi\s*(whatsapp|wa|wp|n[uú]mero|tel[eé]fono|correo))\b/i
];

// Mapa de productos a categorías principales
const PRODUCT_CATEGORY_MAP = {
  'prunex': 'digestivo',
  'prunex 1': 'digestivo',
  'flora liv': 'digestivo',
  'floraliv': 'digestivo',
  'liquid fiber': 'digestivo',
  'liquid fibre': 'digestivo',
  'liquidfiber': 'digestivo',
  'thermo t3': 'peso',
  'thermot3': 'peso',
  'nocarb': 'peso',
  'nocarb t': 'peso',
  'nocarb-t': 'peso',
  'no carb': 'peso',
  'protein active': 'deporte',
  'proteinactive': 'deporte',
  'protein active fit': 'deporte',
  'bioprotein': 'deporte',
  'bioprotein active': 'deporte',
  'pre sport': 'deporte',
  'presport': 'deporte',
  'post sport': 'deporte',
  'postsport': 'deporte',
  'on': 'energía',
  'vita xtra': 'energía',
  'vitaextra': 'energía',
  'vitaenergía': 'energía',
  'vitaenergia': 'energía',
  'no stress': 'energía',
  'nostress': 'energía',
  'beauty in': 'belleza',
  'beauty-in': 'belleza',
  'beautyin': 'belleza',
  'youth elixir': 'belleza',
  'youth elixir hgh': 'belleza',
  'passion': 'energía',
  'golden flx': 'deporte',
  'goldenflx': 'deporte',
  'berry balance': 'digestivo',
  'berrybalance': 'digestivo',
  'rexet': 'digestivo',
  'alpha balance': 'digestivo',
  'alpha': 'digestivo',
  'probal': 'belleza',
  'vera': 'energía',
  'vera+': 'energía',
  'gano': 'energía',
  'cafe': 'energía',
  'cafe fit': 'energía',
  'cappuccino': 'energía',
  'nutraday': 'energía',
};

// Mapa de categorías a intereses principales
const CATEGORY_INTEREST_MAP = {
  'digestivo': 'Bienestar digestivo',
  'energía': 'Energía y vitalidad',
  'peso': 'Control de peso',
  'belleza': 'Belleza y cuidado personal',
  'deporte': 'Rendimiento deportivo',
  'negocio': 'Oportunidad de negocio',
};

// ===================================================================
// 1. VISITOR PROFILE - Memoria por visitante
// ===================================================================

/**
 * Crea un perfil de visitante vacío.
 * 
 * @param {string} visitorId - ID único del visitante
 * @returns {Object} Perfil de visitante
 */
export const createEmptyVisitorProfile = (visitorId) => ({
  visitorId,
  firstSeen: new Date().toISOString(),
  lastSeen: new Date().toISOString(),
  visitCount: 1,
  totalMessages: 0,
  interestedProducts: [],
  mainCategoryInterest: null,
  highestIntentReached: 'explorando',
  lastImportantPhrase: '',
  contactedHuman: false,
  businessLead: false,
  // Historial de evolución
  intentHistory: [],
  visitHistory: [],
  // Última sesión
  lastSession: {
    messages: 0,
    products: [],
    intent: 'explorando',
    endedAt: null
  },
  // Almacena el endedAt de la sesión anterior para detección de retorno
  previousSessionEndedAt: null
});

/**
 * Obtiene o crea un perfil de visitante.
 * 
 * @param {string} visitorId - ID único del visitante
 * @returns {Object} Perfil de visitante
 */
export const getOrCreateVisitorProfile = (visitorId) => {
  if (!visitorId) return null;
  
  const memory = loadMemory();
  
  if (!memory.visitors[visitorId]) {
    memory.visitors[visitorId] = createEmptyVisitorProfile(visitorId);
    saveMemory(memory);
  }
  
  return { ...memory.visitors[visitorId] };
};

/**
 * Actualiza el perfil del visitante con nueva interacción.
 * 
 * @param {string} visitorId - ID único del visitante
 * @param {Object} interaction - Datos de la interacción
 * @param {string} interaction.message - Mensaje del usuario
 * @param {Array} interaction.products - Productos mencionados
 * @param {string} interaction.intent - Intención detectada (explorando|evaluando|compra|negocio)
 * @param {boolean} interaction.isBusiness - Si es intención de negocio
 * @param {boolean} interaction.contactedHuman - Si solicitó asesor humano
 * @returns {Object} Perfil actualizado
 */
export const updateVisitorProfile = (visitorId, interaction = {}) => {
  if (!visitorId) return null;
  
  const memory = loadMemory();
  const profile = memory.visitors[visitorId] || createEmptyVisitorProfile(visitorId);
  
  const now = new Date().toISOString();
  const {
    message = '',
    products = [],
    intent = 'explorando',
    isBusiness = false,
    contactedHuman = false
  } = interaction;
  
  // Actualizar timestamps
  profile.lastSeen = now;
  profile.totalMessages += 1;
  
  // Detectar si es una nueva visita (más de 30 min desde última actividad)
  const lastSessionEnd = profile.lastSession?.endedAt;
  if (lastSessionEnd) {
    const diffMinutes = (new Date(now) - new Date(lastSessionEnd)) / 60000;
    if (diffMinutes > SESSION_TIMEOUT_MINUTES) {
      profile.visitCount += 1;
      profile.visitHistory.push({
        visitNumber: profile.visitCount,
        startedAt: now,
        intent: intent,
        products: [...products]
      });
    }
  } else {
    // Primera interacción
    profile.visitHistory.push({
      visitNumber: 1,
      startedAt: now,
      intent: intent,
      products: [...products]
    });
  }
  
  // Actualizar productos de interés
  if (products && products.length > 0) {
    products.forEach(product => {
      const normalized = product.toLowerCase().trim();
      if (!profile.interestedProducts.includes(normalized)) {
        profile.interestedProducts.push(normalized);
      }
    });
    
    // Inferir categoría principal
    profile.mainCategoryInterest = inferMainCategory(profile.interestedProducts);
  }
  
  // Actualizar intención más alta alcanzada
  const intentPriority = { 'explorando': 0, 'evaluando': 1, 'compra': 2, 'negocio': 3 };
  const currentPriority = intentPriority[intent] || 0;
  const highestPriority = intentPriority[profile.highestIntentReached] || 0;
  
  if (currentPriority > highestPriority) {
    profile.highestIntentReached = intent;
  }
  
  // Registrar en historial de intención
  profile.intentHistory.push({
    timestamp: now,
    intent: intent,
    message: message.substring(0, 200),
    products: [...products]
  });
  
  // Actualizar frase importante (último mensaje relevante)
  if (message && message.length > 3) {
    profile.lastImportantPhrase = message.substring(0, 300);
  }
  
  // Actualizar flags
  if (isBusiness) {
    profile.businessLead = true;
  }
  if (contactedHuman) {
    profile.contactedHuman = true;
  }
  
  // Guardar el endedAt anterior antes de sobrescribir
  if (profile.lastSession?.endedAt) {
    profile.previousSessionEndedAt = profile.lastSession.endedAt;
  }
  
  // Actualizar última sesión
  profile.lastSession = {
    messages: profile.lastSession.messages + 1,
    products: [...new Set([...profile.lastSession.products, ...products])],
    intent: intent,
    endedAt: now
  };
  
  // Guardar
  memory.visitors[visitorId] = profile;
  saveMemory(memory);
  
  return { ...profile };
};

// ===================================================================
// 2. RETURNING CUSTOMER DETECTION
// ===================================================================

/**
 * Detecta si un visitante está volviendo después de un tiempo.
 * 
 * @param {string} visitorId - ID único del visitante
 * @returns {Object|null} Información de retorno o null si es primera vez
 */
export const detectReturningCustomer = (visitorId) => {
  if (!visitorId) return null;
  
  const profile = getOrCreateVisitorProfile(visitorId);
  if (!profile) return null;
  
  // Si es primera visita (visitCount === 1 y no hay historial de visitas)
  if (profile.visitCount <= 1 && profile.visitHistory.length <= 1) {
    return null;
  }
  
  const now = new Date();
  const firstSeen = new Date(profile.firstSeen);
  const lastSeen = new Date(profile.lastSeen);
  
  // Calcular tiempo desde primera visita
  const hoursSinceFirstVisit = Math.round((now - firstSeen) / 3600000);
  const daysSinceFirstVisit = Math.round(hoursSinceFirstVisit / 24);
  
  // Calcular tiempo desde última visita anterior
  // Usar previousSessionEndedAt (guardado antes de sobrescribir lastSession)
  let hoursSinceLastVisit = null;
  let daysSinceLastVisit = null;
  
  // Buscar el endedAt de la sesión anterior
  const previousVisits = profile.visitHistory.slice(0, -1); // Excluir visita actual
  if (previousVisits.length > 0) {
    // Usar previousSessionEndedAt si está disponible (más preciso)
    // o el startedAt de la penúltima visita como fallback
    let lastPreviousVisit;
    if (profile.previousSessionEndedAt) {
      lastPreviousVisit = new Date(profile.previousSessionEndedAt);
    } else {
      const penultimateVisit = previousVisits[previousVisits.length - 1];
      lastPreviousVisit = new Date(penultimateVisit.startedAt);
    }
    hoursSinceLastVisit = Math.round((now - lastPreviousVisit) / 3600000);
    daysSinceLastVisit = Math.round(hoursSinceLastVisit / 24);
  }
  
  // Si no hay visitas anteriores pero hay más de 1 visita, usar firstSeen
  if (hoursSinceLastVisit === null && profile.visitCount > 1) {
    hoursSinceLastVisit = Math.round((now - firstSeen) / 3600000);
    daysSinceLastVisit = Math.round(hoursSinceLastVisit / 24);
  }
  
  // Determinar tipo de retorno
  let returnType = null;
  if (daysSinceLastVisit !== null) {
    if (daysSinceLastVisit === 0 && hoursSinceLastVisit > 0) {
      returnType = 'horas';
    } else if (daysSinceLastVisit >= 1 && daysSinceLastVisit <= 2) {
      returnType = 'días';
    } else if (daysSinceLastVisit >= 3) {
      returnType = 'semanas';
    }
  }
  
  if (!returnType) return null;
  
  // Detectar cambio de interés
  const previousProducts = previousVisits.length > 0
    ? previousVisits[previousVisits.length - 1].products || []
    : [];
  const currentProducts = profile.lastSession?.products || [];
  const newProducts = currentProducts.filter(p => !previousProducts.includes(p));
  
  // Detectar evolución de intención
  const previousIntent = previousVisits.length > 0
    ? previousVisits[previousVisits.length - 1].intent
    : 'explorando';
  const currentIntent = profile.lastSession?.intent || 'explorando';
  
  return {
    detected: true,
    returnType,
    hoursSinceFirstVisit,
    daysSinceFirstVisit,
    hoursSinceLastVisit,
    daysSinceLastVisit,
    visitCount: profile.visitCount,
    previousIntent,
    currentIntent,
    intentEvolved: previousIntent !== currentIntent,
    newProducts: newProducts.length > 0 ? newProducts : null,
    previousProducts,
    currentProducts
  };
};

// ===================================================================
// 3. INTENT PROGRESSION
// ===================================================================

/**
 * Analiza la evolución de intención del visitante a través del tiempo.
 * 
 * @param {string} visitorId - ID único del visitante
 * @returns {Object} Evolución de intención
 */
export const analyzeIntentProgression = (visitorId) => {
  if (!visitorId) return null;
  
  const profile = getOrCreateVisitorProfile(visitorId);
  if (!profile) return null;
  
  const history = profile.intentHistory || [];
  if (history.length === 0) {
    return {
      hasProgression: false,
      currentIntent: profile.highestIntentReached,
      stages: [],
      progressionScore: 0
    };
  }
  
  // Construir etapas cronológicas
  const stages = [];
  let currentStage = null;
  
  history.forEach((entry, index) => {
    const date = new Date(entry.timestamp);
    const dayLabel = `Día ${Math.ceil((date - new Date(profile.firstSeen)) / 86400000) || 1}`;
    
    if (!currentStage || currentStage.intent !== entry.intent) {
      if (currentStage) {
        stages.push(currentStage);
      }
      currentStage = {
        day: dayLabel,
        intent: entry.intent,
        messages: [entry.message],
        products: entry.products || [],
        firstSeen: entry.timestamp,
        count: 1
      };
    } else {
      currentStage.messages.push(entry.message);
      currentStage.products = [...new Set([...currentStage.products, ...(entry.products || [])])];
      currentStage.count += 1;
    }
    
    // Última entrada
    if (index === history.length - 1 && currentStage) {
      stages.push(currentStage);
    }
  });
  
  // Calcular score de progresión
  const intentOrder = ['explorando', 'evaluando', 'compra', 'negocio'];
  let progressionScore = 0;
  
  for (let i = 1; i < stages.length; i++) {
    const prevIdx = intentOrder.indexOf(stages[i - 1].intent);
    const currIdx = intentOrder.indexOf(stages[i].intent);
    if (currIdx > prevIdx) {
      progressionScore += (currIdx - prevIdx) * 25;
    }
  }
  
  // Detectar si hay avance real
  const hasProgression = stages.length > 1 && progressionScore > 0;
  
  return {
    hasProgression,
    currentIntent: profile.highestIntentReached,
    stages,
    progressionScore: Math.min(progressionScore, 100),
    totalStages: stages.length,
    firstIntent: stages.length > 0 ? stages[0].intent : 'explorando',
    lastIntent: stages.length > 0 ? stages[stages.length - 1].intent : 'explorando'
  };
};

// ===================================================================
// 4. PRODUCT JOURNEY - Patrones por categoría
// ===================================================================

/**
 * Detecta patrones de productos y categoría dominante.
 * 
 * @param {Array} products - Lista de productos mencionados
 * @returns {Object} Análisis de journey de productos
 */
export const analyzeProductJourney = (products = []) => {
  if (!products || products.length === 0) {
    return {
      hasProducts: false,
      mainCategory: null,
      categoryLabel: null,
      productCount: 0,
      categories: []
    };
  }
  
  // Mapear productos a categorías
  const categoryCount = {};
  const productCategories = {};
  
  products.forEach(product => {
    const normalized = product.toLowerCase().trim();
    const category = PRODUCT_CATEGORY_MAP[normalized] || 'general';
    
    productCategories[normalized] = category;
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  
  // Encontrar categoría dominante
  let maxCount = 0;
  let mainCategory = null;
  
  for (const [category, count] of Object.entries(categoryCount)) {
    if (count > maxCount) {
      maxCount = count;
      mainCategory = category;
    }
  }
  
  // Obtener etiqueta legible
  const categoryLabel = CATEGORY_INTEREST_MAP[mainCategory] || mainCategory;
  
  // NO mostrar lista de 10 productos, solo categoría dominante
  return {
    hasProducts: true,
    mainCategory,
    categoryLabel,
    productCount: products.length,
    categories: Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({
        category: cat,
        label: CATEGORY_INTEREST_MAP[cat] || cat,
        count
      })),
    // Productos agrupados por categoría (no lista plana)
    productsByCategory: Object.entries(
      products.reduce((acc, p) => {
        const cat = productCategories[p.toLowerCase().trim()] || 'general';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(p);
        return acc;
      }, {})
    ).map(([cat, prods]) => ({
      category: cat,
      label: CATEGORY_INTEREST_MAP[cat] || cat,
      products: prods
    }))
  };
};

// ===================================================================
// 5. BUSINESS JOURNEY
// ===================================================================

/**
 * Detecta si un mensaje indica interés en oportunidad de negocio.
 * 
 * @param {string} message - Mensaje del usuario
 * @returns {boolean} true si es lead de negocio
 */
export const detectBusinessLead = (message = '') => {
  if (!message) return false;
  return BUSINESS_PATTERNS.some(pattern => pattern.test(message));
};

/**
 * Obtiene información de lead de negocio.
 * 
 * @param {string} visitorId - ID único del visitante
 * @returns {Object|null} Información de lead de negocio
 */
export const getBusinessLeadInfo = (visitorId) => {
  if (!visitorId) return null;
  
  const profile = getOrCreateVisitorProfile(visitorId);
  if (!profile || !profile.businessLead) return null;
  
  return {
    isBusinessLead: true,
    detectedAt: profile.intentHistory.find(h => h.intent === 'negocio')?.timestamp || profile.firstSeen,
    messageCount: profile.totalMessages,
    visitCount: profile.visitCount,
    label: '🚀 Persona interesada en oportunidad FuXion'
  };
};

// ===================================================================
// 6. HUMAN FOLLOW-UP DETECTION
// ===================================================================

/**
 * Detecta si un mensaje contiene solicitud de asesor humano o datos de contacto.
 * 
 * @param {string} message - Mensaje del usuario
 * @returns {Object} Resultado de detección
 */
export const detectHumanFollowUp = (message = '') => {
  if (!message) return { detected: false, type: null, value: null };
  
  for (const pattern of HUMAN_FOLLOWUP_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      // Determinar tipo
      let type = 'asesor';
      let value = match[0];
      
      if (/\b(whatsapp|wa|wp)\b/i.test(match[0]) && match[2]) {
        type = 'whatsapp';
        value = match[2];
      } else if (/@/.test(match[0])) {
        type = 'correo';
        value = match[1] || match[0];
      } else if (/\b(tel[eé]fono|n[uú]mero)\b/i.test(match[0])) {
        type = 'telefono';
        value = match[1] || match[0];
      }
      
      return { detected: true, type, value };
    }
  }
  
  return { detected: false, type: null, value: null };
};

// ===================================================================
// 7. STORAGE LAYER
// ===================================================================

/**
 * Carga la memoria de clientes desde localStorage.
 * 
 * @returns {Object} Memoria de clientes
 */
const loadMemory = () => {
  try {
    // Intentar localStorage primero (entorno navegador)
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.visitors) {
          return parsed;
        }
      }
    }
  } catch (e) {
    // localStorage no disponible o error de parse
  }
  
  return { visitors: {}, lastUpdated: new Date().toISOString() };
};

/**
 * Guarda la memoria de clientes en localStorage.
 * 
 * @param {Object} memory - Memoria de clientes
 */
const saveMemory = (memory) => {
  if (!memory) return;
  
  memory.lastUpdated = new Date().toISOString();
  
  // Limitar número de visitantes almacenados
  const visitorIds = Object.keys(memory.visitors);
  if (visitorIds.length > MAX_STORED_VISITORS) {
    // Ordenar por lastSeen y mantener los más recientes
    const sorted = visitorIds
      .map(id => ({ id, lastSeen: new Date(memory.visitors[id].lastSeen).getTime() }))
      .sort((a, b) => b.lastSeen - a.lastSeen);
    
    const toKeep = sorted.slice(0, MAX_STORED_VISITORS);
    const toRemove = sorted.slice(MAX_STORED_VISITORS);
    
    toRemove.forEach(({ id }) => {
      delete memory.visitors[id];
    });
  }
  
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    }
  } catch (e) {
    // localStorage lleno o no disponible
    console.warn('[customerMemory] Error guardando memoria:', e.message);
  }
};

/**
 * Guarda el perfil en Supabase (para usuarios registrados).
 * 
 * @param {Object} supabaseClient - Cliente de Supabase
 * @param {string} userId - ID del usuario registrado
 * @param {Object} profile - Perfil del visitante
 */
export const saveProfileToSupabase = async (supabaseClient, userId, profile) => {
  if (!supabaseClient || !userId || !profile) return;
  
  try {
    const { error } = await supabaseClient
      .from('customer_memory')
      .upsert({
        user_id: userId,
        first_seen: profile.firstSeen,
        last_seen: profile.lastSeen,
        visit_count: profile.visitCount,
        total_messages: profile.totalMessages,
        interested_products: profile.interestedProducts,
        main_category_interest: profile.mainCategoryInterest,
        highest_intent_reached: profile.highestIntentReached,
        last_important_phrase: profile.lastImportantPhrase,
        contacted_human: profile.contactedHuman,
        business_lead: profile.businessLead,
        intent_history: profile.intentHistory,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    
    if (error) {
      console.warn('[customerMemory] Error guardando en Supabase:', error.message);
    }
  } catch (error) {
    console.warn('[customerMemory] Error guardando en Supabase:', error.message);
  }
};

/**
 * Carga el perfil desde Supabase (para usuarios registrados).
 * 
 * @param {Object} supabaseClient - Cliente de Supabase
 * @param {string} userId - ID del usuario registrado
 * @returns {Object|null} Perfil del visitante o null
 */
export const loadProfileFromSupabase = async (supabaseClient, userId) => {
  if (!supabaseClient || !userId) return null;
  
  try {
    const { data, error } = await supabaseClient
      .from('customer_memory')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return null;
    
    return {
      visitorId: userId,
      firstSeen: data.first_seen,
      lastSeen: data.last_seen,
      visitCount: data.visit_count,
      totalMessages: data.total_messages,
      interestedProducts: data.interested_products || [],
      mainCategoryInterest: data.main_category_interest,
      highestIntentReached: data.highest_intent_reached || 'explorando',
      lastImportantPhrase: data.last_important_phrase || '',
      contactedHuman: data.contacted_human || false,
      businessLead: data.business_lead || false,
      intentHistory: data.intent_history || [],
      visitHistory: [],
      lastSession: {
        messages: 0,
        products: [],
        intent: data.highest_intent_reached || 'explorando',
        endedAt: data.last_seen
      }
    };
  } catch (error) {
    console.warn('[customerMemory] Error cargando desde Supabase:', error.message);
    return null;
  }
};

// ===================================================================
// HELPERS
// ===================================================================

/**
 * Infiere la categoría principal basada en productos de interés.
 * 
 * @param {Array} products - Lista de productos
 * @returns {string|null} Categoría principal inferida
 */
const inferMainCategory = (products = []) => {
  if (!products || products.length === 0) return null;
  
  const categoryCount = {};
  
  products.forEach(product => {
    const normalized = product.toLowerCase().trim();
    const category = PRODUCT_CATEGORY_MAP[normalized];
    if (category) {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    }
  });
  
  let maxCount = 0;
  let mainCategory = null;
  
  for (const [category, count] of Object.entries(categoryCount)) {
    if (count > maxCount) {
      maxCount = count;
      mainCategory = category;
    }
  }
  
  return mainCategory;
};

/**
 * Calcula probabilidad de compra basada en el perfil.
 * 
 * @param {Object} profile - Perfil del visitante
 * @returns {number} Probabilidad (0-100)
 */
export const calculatePurchaseProbability = (profile) => {
  if (!profile) return 0;
  
  let probability = 0;
  
  // Factor: intención más alta alcanzada
  const intentWeights = {
    'explorando': 10,
    'evaluando': 40,
    'compra': 80,
    'negocio': 60
  };
  probability += intentWeights[profile.highestIntentReached] || 0;
  
  // Factor: visitas múltiples (indica interés sostenido)
  if (profile.visitCount > 1) {
    probability += Math.min(profile.visitCount * 5, 20);
  }
  
  // Factor: productos de interés
  if (profile.interestedProducts.length > 0) {
    probability += Math.min(profile.interestedProducts.length * 5, 15);
  }
  
  // Factor: evolución de intención
  const progression = analyzeIntentProgression(profile.visitorId);
  if (progression && progression.hasProgression) {
    probability += progression.progressionScore * 0.3;
  }
  
  // Factor: contacto humano (mayor compromiso)
  if (profile.contactedHuman) {
    probability += 10;
  }
  
  return Math.min(Math.round(probability), 100);
};

/**
 * Genera un resumen completo del perfil para Telegram.
 * 
 * @param {string} visitorId - ID único del visitante
 * @returns {Object|null} Resumen del perfil
 */
export const generateProfileSummary = (visitorId) => {
  if (!visitorId) return null;
  
  const profile = getOrCreateVisitorProfile(visitorId);
  if (!profile) return null;
  
  const returningInfo = detectReturningCustomer(visitorId);
  const progression = analyzeIntentProgression(visitorId);
  const productJourney = analyzeProductJourney(profile.interestedProducts);
  const businessInfo = getBusinessLeadInfo(visitorId);
  const probability = calculatePurchaseProbability(profile);
  
  const now = new Date();
  const firstSeen = new Date(profile.firstSeen);
  const daysSinceFirstVisit = Math.round((now - firstSeen) / 86400000);
  
  return {
    visitorId: profile.visitorId,
    firstSeen: profile.firstSeen,
    lastSeen: profile.lastSeen,
    daysActive: daysSinceFirstVisit,
    visitCount: profile.visitCount,
    totalMessages: profile.totalMessages,
    interestedProducts: profile.interestedProducts,
    mainCategoryInterest: profile.mainCategoryInterest,
    categoryLabel: CATEGORY_INTEREST_MAP[profile.mainCategoryInterest] || null,
    highestIntentReached: profile.highestIntentReached,
    lastImportantPhrase: profile.lastImportantPhrase,
    contactedHuman: profile.contactedHuman,
    businessLead: profile.businessLead,
    isReturning: returningInfo !== null,
    returningInfo,
    progression,
    productJourney,
    businessInfo,
    purchaseProbability: probability
  };
};

// ===================================================================
// EXPORT DEFAULT
// ===================================================================

export default {
  createEmptyVisitorProfile,
  getOrCreateVisitorProfile,
  updateVisitorProfile,
  detectReturningCustomer,
  analyzeIntentProgression,
  analyzeProductJourney,
  detectBusinessLead,
  getBusinessLeadInfo,
  detectHumanFollowUp,
  saveProfileToSupabase,
  loadProfileFromSupabase,
  calculatePurchaseProbability,
  generateProfileSummary
};
