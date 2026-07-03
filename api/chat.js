/**
 * Vercel Serverless Function para Chat con APIs de IA
 *
 * Esta función se ejecuta en el BACKEND (servidor de Vercel)
 * para evitar problemas de CORS y proteger las API keys.
 *
 * Sistema de fallback: DeepSeek > Qwen > Gemini
 *
 * MODO AHORRADOR: La base de datos de productos se carga UNA SOLA VEZ
 * en la memoria global de Vercel y se reusa entre peticiones.
 * Esto evita leer archivos JSON en cada request.
 *
 * DEBUG: Cambiar DEBUG_CHAT a true para ver el flujo completo en consola.
 */

import { createClient } from '@supabase/supabase-js';
import { processChatConversation } from '../lib/chatEvents.js';

// ===================================================================
// MODO DEBUG
// ===================================================================
const DEBUG_CHAT = false;

const debugLog = (label, data) => {
  if (!DEBUG_CHAT) return;
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const prefix = `[DEBUG][${timestamp}]`;
  if (typeof data === 'string') {
    console.log(`${prefix} ${label}: ${data}`);
  } else {
    console.log(`${prefix} ${label}:`, JSON.stringify(data, null, 2));
  }
};

// ===================================================================
// CARGA EFICIENTE DE BASE DE DATOS (Modo Ahorrador)
// Se carga UNA SOLA VEZ usando el módulo global de Node.js
// Vercel mantiene la instancia caliente entre peticiones
// ===================================================================
let databaseCache = null;

// Cargar módulos de forma síncrona (CommonJS compatible)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadDatabase = () => {
  if (databaseCache) return databaseCache;
  
  try {
    const dbPath = path.resolve(__dirname, '../src/data/fuxion_database.json');
    const verifiedPath = path.resolve(__dirname, '../src/data/fuxion_ai_verified_catalog.json');
    
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const verified = JSON.parse(fs.readFileSync(verifiedPath, 'utf-8'));
    
    databaseCache = { db, verified };
    console.log('📦 Base de datos cargada en memoria (modo ahorrador)');
    return databaseCache;
  } catch (error) {
    console.error('Error cargando base de datos:', error.message);
    return { db: { productos: {}, empresa: {} }, verified: { productos_verificados: {} } };
  }
};

// ===================================================================
// NORMALIZACIÓN Y FUZZY MATCHING
// ===================================================================
const normalizeText = (text = '') =>
  String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const levenshteinDistance = (a, b) => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[b.length][a.length];
};

const isFuzzyMatch = (userWord, productName) => {
  if (!userWord || !productName) return false;
  if (productName.includes(userWord) || userWord.includes(productName)) {
    if (productName.length <= 3 && userWord.length > productName.length + 2) return false;
    return true;
  }
  const maxLen = Math.max(userWord.length, productName.length);
  const minLen = Math.min(userWord.length, productName.length);
  if (minLen <= 3 && maxLen > minLen + 2) return false;
  const distance = levenshteinDistance(userWord, productName);
  const maxDistance = Math.max(Math.min(Math.floor(maxLen * 0.4), 3), maxLen >= 5 ? 2 : 1);
  return distance > 0 && distance <= maxDistance;
};

const getWords = (text) => text.split(/\s+/).filter(Boolean);

// ===================================================================
// ÍNDICE DE BÚSQUEDA DE PRODUCTOS (construido una sola vez)
// ===================================================================
let productSearchIndex = null;

const buildProductSearchIndex = () => {
  if (productSearchIndex) return productSearchIndex;
  
  const { db, verified } = loadDatabase();
  const products = Object.values(db.productos || {});
  const verifiedNames = Object.keys(verified.productos_verificados || {});
  const index = new Map();

  const addName = (name) => {
    const normalized = normalizeText(name);
    if (!normalized) return;
    index.set(normalized, name);
    const withoutNumber = normalized.replace(/\s+\d+$/, '').trim();
    if (withoutNumber && withoutNumber !== normalized) index.set(withoutNumber, name);
    const withoutSymbols = normalized.replace(/[-]/g, ' ').replace(/\s+/g, ' ').trim();
    if (withoutSymbols && withoutSymbols !== normalized) index.set(withoutSymbols, name);
    const withoutSpaces = normalized.replace(/\s+/g, '');
    if (withoutSpaces && withoutSpaces !== normalized) index.set(withoutSpaces, name);
  };

  products.forEach(product => {
    addName(product.nombre);
    if (product.alias) addName(product.alias);
    addName(String(product.nombre).replace(/[+]/g, ' '));
  });
  verifiedNames.forEach(name => addName(name));

  productSearchIndex = Array.from(index.entries()).map(([normalized, original]) => ({ normalized, original }));
  console.log(`🔍 Índice de búsqueda construido: ${productSearchIndex.length} variantes`);
  return productSearchIndex;
};

// ===================================================================
// MAPA DE INTENCIONES/BENEFICIOS A PRODUCTOS
// ===================================================================
const BENEFIT_TO_PRODUCT_MAP = [
  { pattern: /\b(concentracion|concentración|concentrarme|concentrar|enfoque|enfocar|mente|mental|alert|alerta|cerebro|aprendizaje|memoria|estudiar|estudio|trabajo mental|rendimiento mental|tics nerviosos|atencion|atención|foco)\b/i, products: ['ON', 'NO STRESS'] },
  { pattern: /\b(energia|energía|energizante|vitalidad|activarme|activar|despertar|cansancio|fatiga|agotamiento|sin energia|sin energías|rendimiento fisico|rendimiento físico)\b/i, products: ['VITA XTRA T+', 'VITAENERGÍA'] },
  { pattern: /\b(digestion|digestión|digestivo|estomago|estómago|hinchazon|hinchazón|pesadez|gastritis|reflujo|colitis|colon irritable|intolerancia|probiótico|probióticos|flora intestinal|intestinal)\b/i, products: ['FLORA LIV', 'PRUNEX 1', 'LIQUID FIBER'] },
  { pattern: /\b(colon|estreñimiento|estrenimiento|constipacion|constipación|limpieza colon|limpiar colon|transito intestinal|tránsito intestinal|ir al baño|evacuar)\b/i, products: ['PRUNEX 1', 'LIQUID FIBER'] },
  { pattern: /\b(peso|bajar de peso|perder peso|adelgazar|control de peso|dieta|rebajar|obesidad|sobrepeso|grasa|quemar grasa|cardio|ejercicio|entrenar|entrenamiento|fit|fitness)\b/i, products: ['THERMO T3', 'NOCARB-T', 'PROTEIN ACTIVE FIT'] },
  { pattern: /\b(defensas|inmunidad|inmunologico|inmunológico|sistema inmunologico|sistema inmunológico|proteccion|protección|resfriado|gripe|defensa natural)\b/i, products: ['VERA+', 'GANO+ CAPPUCCINO'] },
  { pattern: /\b(piel|colageno|colágeno|belleza|anti edad|anti-edad|antiaging|antiaging|arrugas|juvenil|juventud|envejecimiento|pelo|cabello|uñas|cutanea|cutánea)\b/i, products: ['BEAUTY-IN', 'YOUTH ELIXIR'] },
  { pattern: /\b(desintoxicacion|desintoxicación|detox|limpieza|higado|hígado|higado graso|sangre|organos|órganos|depurar|purificar)\b/i, products: ['REXET', 'ALPHA BALANCE', 'PRUNEX 1', 'FLORA LIV'] },
  { pattern: /\b(urinario|urinaria|vias urinarias|vías urinarias|infeccion urinaria|infección urinaria|cistitis|cranberry|berri|berry)\b/i, products: ['BERRY BALANCE'] },
  { pattern: /\b(sueno|sueño|dormir|insomnio|descansar|relajacion|relajación|relajar|estres|estrés|ansiedad|nervios|calma|tranquilidad)\b/i, products: ['NO STRESS', 'PASSION'] },
  { pattern: /\b(proteina|proteína|protein|musculo|músculo|muscular|masa muscular|recuperacion|recuperación|post entrenamiento|post workout|pre entrenamiento|pre workout)\b/i, products: ['PROTEIN ACTIVE FIT', 'BIOPROTEIN ACTIVE', 'PRE SPORT PRO EDITION', 'POST SPORT PRO EDITION'] },
  { pattern: /\b(vitamina|vitaminas|multivitaminico|multivitamínico|minerales|nutricion|nutrición|suplemento|suplementos)\b/i, products: ['VITA XTRA T+', 'VITAENERGÍA', 'NUTRADAY'] },
  { pattern: /\b(verdad|verdad+|aloe|aloe vera|sabila|sábila)\b/i, products: ['VERA+'] },
  { pattern: /\b(ganoderma|reishi|hongos|medicinal|hongo)\b/i, products: ['GANO+ CAPPUCCINO'] },
  { pattern: /\b(cafe|café|cappuccino|capuchino)\b/i, products: ['CAFÉ & CAFÉ FIT CAPPUCCINO', 'GANO+ CAPPUCCINO'] },
  { pattern: /\b(nocarb|no carb|bloqueador|bloquear carbohidratos|carbohidratos|harinas|frijol blanco|cromo)\b/i, products: ['NOCARB-T'] },
  { pattern: /\b(termo|thermo|quemador|quemar grasa|termogenico|termogénico)\b/i, products: ['THERMO T3'] },
  { pattern: /\b(pasion|pasión|passion|deseo|libido|apetito sexual|hormonal)\b/i, products: ['PASSION'] },
  { pattern: /\b(probal|balance hormonal|hormonas|femenino|femenina|mujer)\b/i, products: ['PROBAL'] },
  { pattern: /\b(golden|flx|dorado|dorada|antioxidante|antioxidantes)\b/i, products: ['GOLDEN FLX'] },
  { pattern: /\b(beauty|beauti|colageno|colágeno|piel|belleza)\b/i, products: ['BEAUTY-IN'] },
  { pattern: /\b(youth|elixir|hgh|juvenil|juventud|crecimiento|hormona crecimiento)\b/i, products: ['YOUTH ELIXIR'] },
  { pattern: /\b(alpha|balance|sangre|colesterol|trigliceridos|triglicéridos|higado graso|hígado graso)\b/i, products: ['ALPHA BALANCE'] },
  { pattern: /\b(rexet|higado|hígado|desintoxicar|fiesta|alcohol|resaca|hepatobiliar)\b/i, products: ['REXET'] },
  { pattern: /\b(fibra|liquid|fiber|fibra soluble)\b/i, products: ['LIQUID FIBER'] },
  { pattern: /\b(prunex|prune|prunex 1|colon|estreñimiento)\b/i, products: ['PRUNEX 1'] },
  { pattern: /\b(flora|floraliv|floaliv|probiótico|probióticos|flora intestinal|digestión)\b/i, products: ['FLORA LIV'] },
  { pattern: /\b(berry|berri|cranberry|urinario|urinaria)\b/i, products: ['BERRY BALANCE'] },
  { pattern: /\b(vita|xtra|vitamina|energia|energía|multivitaminico)\b/i, products: ['VITA XTRA T+', 'VITAENERGÍA'] },
  { pattern: /\b(no stress|nostress|estres|estrés|relajacion|relajación)\b/i, products: ['NO STRESS'] },
  { pattern: /\b(pre sport|presport|preentreno|pre entreno|pre workout)\b/i, products: ['PRE SPORT PRO EDITION'] },
  { pattern: /\b(post sport|postsport|postentreno|post entreno|post workout|recuperacion|recuperación)\b/i, products: ['POST SPORT PRO EDITION'] },
  { pattern: /\b(protein active|proteinactive|proteina|proteína|musculo|músculo)\b/i, products: ['PROTEIN ACTIVE FIT', 'BIOPROTEIN ACTIVE'] },
  { pattern: /\b(bioprotein|bioprotein active|proteina vegetal|proteína vegetal)\b/i, products: ['BIOPROTEIN ACTIVE'] },
  { pattern: /\b(nutraday|nutricion infantil|niños|niñas|desarrollo mental|desarrollo fisico|hidratacion)\b/i, products: ['NUTRADAY'] },
  { pattern: /\b(articulacion|articulaciones|dolor articular|artritis|artrosis|movilidad|inflamacion|antiinflamatorio|analgesico)\b/i, products: ['GOLDEN FLX'] },
];

// ===================================================================
// DETECCIÓN DE PRODUCTOS
// ===================================================================
const getMentionedProductsFromText = (text = '') => {
  const normalizedText = normalizeText(text);
  if (!normalizedText) return [];
  const userWords = getWords(normalizedText);
  const matchedProducts = new Set();
  const index = buildProductSearchIndex();

  for (const entry of index) {
    if (entry.normalized.length <= 3) {
      const escaped = entry.normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const wordPattern = new RegExp('\\b' + escaped + '\\b');
      if (!wordPattern.test(normalizedText)) continue;
    }
    if (normalizedText.includes(entry.normalized) || entry.normalized.includes(normalizedText)) {
      matchedProducts.add(entry.original);
    }
  }

  if (matchedProducts.size === 0) {
    for (const entry of index) {
      const productWords = getWords(entry.normalized);
      for (const userWord of userWords) {
        if (userWord.length <= 2) continue;
        if (['que', 'para', 'como', 'con', 'por', 'del', 'las', 'los', 'una', 'uno'].includes(userWord)) continue;
        if (isFuzzyMatch(userWord, entry.normalized)) {
          matchedProducts.add(entry.original);
          break;
        }
        for (const productWord of productWords) {
          if (isFuzzyMatch(userWord, productWord)) {
            matchedProducts.add(entry.original);
            break;
          }
        }
        if (matchedProducts.has(entry.original)) break;
      }
    }
  }

  return Array.from(matchedProducts);
};

const getProductsFromBenefitIntent = (text = '') => {
  if (!text) return [];
  const matchedProducts = new Set();
  for (const entry of BENEFIT_TO_PRODUCT_MAP) {
    if (entry.pattern.test(text)) {
      entry.products.forEach(p => matchedProducts.add(p));
    }
  }
  return Array.from(matchedProducts);
};

const getMentionedProductsFromHistory = (messages = []) => {
  const productNames = [];
  messages.forEach(message => {
    const text = String(message.text || message.content || '');
    const matches = getMentionedProductsFromText(text);
    matches.forEach((product) => {
      if (!productNames.includes(product)) productNames.push(product);
    });
  });
  return productNames;
};

// ===================================================================
// CONSTRUCCIÓN DE CONTEXTO MÍNIMO PARA LA IA
// ===================================================================
const getProductDetails = (productName) => {
  const { db, verified } = loadDatabase();
  const normalizedTarget = normalizeText(productName);

  // 1. Búsqueda exacta por clave del objeto
  const exactMatch = db.productos?.[productName];
  if (exactMatch) {
    const verifiedEntry = Object.entries(verified.productos_verificados || {}).find(([name]) =>
      normalizeText(name) === normalizedTarget
    );
    return {
      name: exactMatch.nombre || productName,
      product: exactMatch,
      verified: verifiedEntry ? verifiedEntry[1] : null
    };
  }

  // 2. Búsqueda por nombre normalizado exacto
  const product = Object.values(db.productos || {}).find((item) =>
    normalizeText(item.nombre) === normalizedTarget
  );

  // 3. Si no encuentra, búsqueda fuzzy por nombre
  if (!product) {
    const allProducts = Object.values(db.productos || {});
    const fuzzyMatch = allProducts.find((item) => {
      const normalizedName = normalizeText(item.nombre);
      // Incluye parcialmente
      if (normalizedName.includes(normalizedTarget) || normalizedTarget.includes(normalizedName)) return true;
      // Fuzzy match por palabras
      const nameWords = getWords(normalizedName);
      const targetWords = getWords(normalizedTarget);
      for (const nw of nameWords) {
        for (const tw of targetWords) {
          if (nw.length <= 2 || tw.length <= 2) continue;
          if (isFuzzyMatch(nw, tw)) return true;
        }
      }
      // Fuzzy match por alias
      if (item.alias) {
        const normalizedAlias = normalizeText(item.alias);
        if (normalizedAlias.includes(normalizedTarget) || normalizedTarget.includes(normalizedAlias)) return true;
      }
      return false;
    });

    if (fuzzyMatch) {
      const verifiedEntry = Object.entries(verified.productos_verificados || {}).find(([name]) =>
        normalizeText(name) === normalizeText(fuzzyMatch.nombre)
      );
      return {
        name: fuzzyMatch.nombre,
        product: fuzzyMatch,
        verified: verifiedEntry ? verifiedEntry[1] : null
      };
    }
  }

  const verifiedEntry = Object.entries(verified.productos_verificados || {}).find(([name]) =>
    normalizeText(name) === normalizedTarget
  );

  return {
    name: product?.nombre || verifiedEntry?.[0] || productName,
    product: product || null,
    verified: verifiedEntry ? verifiedEntry[1] : null
  };
};

const buildProductContext = (productNames = []) => {
  if (!productNames || productNames.length === 0) return null;
  const sections = productNames.map((productName) => {
    const { name, product, verified } = getProductDetails(productName);
    const lines = [`PRODUCTO: ${name}`];
    if (product?.categoria) lines.push(`Categoría: ${product.categoria}`);
    if (product?.presentacion || product?.presentation) lines.push(`Presentación: ${product.presentacion || product.presentation}`);
    if (product?.modo_uso) lines.push(`Modo de uso: ${product.modo_uso}`);
    if (product?.horario) lines.push(`Horario: ${product.horario}`);
    if (product?.beneficios?.length) lines.push(`Beneficios: ${product.beneficios.join(', ')}`);
    if (product?.ingredientes?.length) lines.push(`Ingredientes: ${product.ingredientes.join(', ')}`);
    if (verified) {
      if (verified.respuesta_base) lines.push(`Respuesta base verificada: ${verified.respuesta_base}`);
      if (verified.ingredientes_oficiales?.length) lines.push(`Ingredientes oficiales: ${verified.ingredientes_oficiales.slice(0, 7).join(', ')}`);
    }
    // Instrucción más flexible: usar datos del catálogo pero permitir conocimiento general
    lines.push('Usa esta información del catálogo como referencia principal. Si el contexto está incompleto, puedes complementar con tu conocimiento general del producto sin contradecir la información oficial. NUNCA afirmes que un producto no existe solo porque falta contexto.');
    return lines.join('\n');
  });
  return [`CONTEXTO DEL PRODUCTO: Información de referencia del catálogo.`, ...sections].join('\n\n');
};

const buildSystemContext = () => {
  return `Eres el asistente de FUXION Chile. Responde en español, con tono sobrio, claro y cercano. No uses emojis, negritas, títulos, separadores ni símbolos decorativos. Mantén párrafos cortos, sin frases comerciales agresivas.

INSTRUCCIONES IMPORTANTES:
- Usa la información del catálogo como referencia principal cuando esté disponible.
- Si el producto fue identificado correctamente pero el contexto está incompleto, puedes usar tu conocimiento general del producto sin contradecir la información oficial.
- NUNCA afirmes que un producto no existe o que FUXION no tiene algo, a menos que estés completamente seguro después de revisar el catálogo completo.
- Si hay dudas sobre la existencia de un producto, pide más información al usuario en lugar de negar.
- Responde exactamente a la intención del usuario. Si hay dudas, pide más información antes de recomendar.
- Si el usuario menciona síntomas, embarazo, lactancia, medicamentos o enfermedades, no des diagnósticos ni tratamientos; sugiere asesor humano.

TODOS los productos Fuxion vienen en SOBRES (sachets) para mezclar con agua. NO son pastillas, cápsulas, jarabes ni líquidos embotellados. Son polvos en sobres individuales que se disuelven en agua.

PRUNEX 1 se disuelve en agua caliente. THERMO T3 se toma 30 minutos antes de hacer ejercicio. BERRY BALANCE es para apoyo del tracto urinario, flora protectora urinaria, cranberry, probióticos y antioxidantes.`;
};

const buildDynamicPrompt = (userMessage, conversationHistory = []) => {
  const userProducts = getMentionedProductsFromText(userMessage);
  const benefitProducts = getProductsFromBenefitIntent(userMessage);
  const historyProducts = getMentionedProductsFromHistory(conversationHistory);

  debugLog('userMessage', userMessage);
  debugLog('userProducts (mencionados)', userProducts);
  debugLog('benefitProducts (intención)', benefitProducts);
  debugLog('historyProducts', historyProducts);

  let currentProducts;
  if (userProducts.length > 0) {
    currentProducts = userProducts;
  } else if (benefitProducts.length > 0) {
    currentProducts = benefitProducts;
  } else {
    currentProducts = historyProducts.slice(-2);
  }

  const isGreeting = /\b(hola|buenas|buen dí[aá]|buenos d[ií]as|buenas tardes|buenas noches|gracias|muchas gracias|buenas)\b/i.test(String(userMessage || ''));
  const includeProducts = currentProducts.length > 0 && !isGreeting;

  debugLog('currentProducts', currentProducts);
  debugLog('includeProducts', includeProducts);

  const systemMessages = [{ role: 'system', content: buildSystemContext() }];

  if (includeProducts) {
    const uniqueProducts = Array.from(new Set(currentProducts));
    const productContext = buildProductContext(uniqueProducts);
    debugLog('productContext', productContext ? productContext.substring(0, 300) + '...' : 'null');
    if (productContext) {
      systemMessages.push({ role: 'system', content: productContext });
    } else {
      debugLog('WARN', 'productContext es null aunque hay productos detectados');
    }
  }

  // Agregar contexto de promociones si aplica
  if (/\b(promocion|promociones|descuento|descuentos|regalo|regalos|packs|pack|oferta|programa|promo)\b/i.test(userMessage)) {
    systemMessages.push({
      role: 'system',
      content: `PROMOCIONES: Responde consultas sobre promociones, descuentos, regalos y packs solo cuando se pregunten. Explica el programa de regalos 4+1 con productos elegibles (PASSION, LIQUID FIBER, GOLDEN FLX, NOCARB-T) si es relevante. No inventes descuentos adicionales ni otros beneficios que no existan.`
    });
  }

  // Agregar contexto médico si aplica
  if (/\b(enfermedad|s[ií]ntoma|dolor|embarazo|lactancia|medicamento|medicamentos|condici[oó]n m[eé]dica|m[eé]dico|doctor|prescripci[oó]n|hipertensi[oó]n|diabetes|tratamiento)\b/i.test(userMessage)) {
    systemMessages.push({
      role: 'system',
      content: `MEDICAL: Si la consulta menciona enfermedades, síntomas, medicamentos, embarazo, lactancia o condiciones de salud, responde con prudencia. No des diagnósticos, no recomiendes tratamientos ni afirmes resultados. Sugiere hablar con un asesor humano para evaluar el caso.`
    });
  }

  // Agregar contexto de envío si aplica
  if (/\b(env[ií]o|despacho|retiro|entrega|llega|llegar|domicilio|sucursal|track|seguimiento)\b/i.test(userMessage)) {
    systemMessages.push({
      role: 'system',
      content: `DESPACHO: Responde preguntas sobre envío, despacho, retiro y entrega de forma general. Si no hay información exacta, sugiere consultar con un asesor humano. No inventes políticas de envío ni tiempos específicos sin confirmación.`
    });
  }

  // Agregar contexto de pago si aplica
  if (/\b(precio|pagar|pagos|forma de pago|formas de pago|transferencia|cuota|cuotas|tarjeta|efectivo|costo|costos)\b/i.test(userMessage)) {
    systemMessages.push({
      role: 'system',
      content: `PAGO: Responde consultas sobre precio y formas de pago usando datos reales cuando estén disponibles. No inventes precios, cuotas o métodos de pago. Si no tienes información exacta, sugiere consultar con un asesor humano o revisar el carrito.`
    });
  }

  // Incluir historial relevante (últimos 6 mensajes)
  const historyMessages = (conversationHistory || []).slice(-6).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: String(msg.text || msg.content || '')
  }));

  const finalPrompt = [
    ...systemMessages,
    ...historyMessages,
    { role: 'user', content: userMessage }
  ];

  debugLog('finalPrompt (system count)', systemMessages.length);
  debugLog('finalPrompt (history count)', historyMessages.length);

  return finalPrompt;
};

// ===================================================================
// CONFIGURACIÓN DE APIs
// ===================================================================
const getApiKey = (name) => {
  const key = process.env[name];
  if (!key) {
    console.warn(`⚠️ API key no configurada: ${name}`);
  }
  return key;
};

const DEEPSEEK_API_KEY = getApiKey('DEEPSEEK_API_KEY');
const QWEN_API_KEY = getApiKey('QWEN_API_KEY');
const GEMINI_API_KEY = getApiKey('GEMINI_API_KEY');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);
const SUPABASE_CACHE_TABLE = 'chat_memory';
const SUPABASE_EVENTS_TABLE = 'chat_events';

// Versión del caché para invalidar respuestas antiguas cuando cambia la lógica
const CACHE_VERSION = 'v2';

const supabase = USE_SUPABASE
  ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
  : null;

const parseClientDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const findSessionStartedAt = async (sessionId) => {
  if (!supabase || !sessionId) return null;
  try {
    const { data, error } = await supabase
      .from(SUPABASE_EVENTS_TABLE)
      .select('metadata')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    if (error || !data?.metadata?.startedAt) return null;
    return parseClientDate(data.metadata.startedAt);
  } catch (error) {
    console.warn('Error consultando inicio de sesión en chat_events:', error.message);
    return null;
  }
};

const saveChatEvents = async (evaluation) => {
  if (!supabase || !evaluation) return;
  const rows = evaluation.events.length > 0
    ? evaluation.events.map((eventType) => ({
        session_id: evaluation.sessionId,
        event_type: eventType,
        product_name: evaluation.productNames.length > 0 ? evaluation.productNames.join(', ') : null,
        score: evaluation.score,
        cache_hit: evaluation.cacheHit,
        duration_minutes: evaluation.durationMinutes,
        question_count: evaluation.questionCount,
        advisor_declined: evaluation.advisorDeclined,
        metadata: {
          provider: evaluation.provider,
          latencyMs: evaluation.latencyMs,
          responseSummary: evaluation.responseSummary,
          startedAt: evaluation.startedAt,
          events: evaluation.events,
          sessionId: evaluation.sessionId
        }
      }))
    : [{
        session_id: evaluation.sessionId,
        event_type: 'NO_EVENT',
        product_name: null,
        score: evaluation.score,
        cache_hit: evaluation.cacheHit,
        duration_minutes: evaluation.durationMinutes,
        question_count: evaluation.questionCount,
        advisor_declined: evaluation.advisorDeclined,
        metadata: {
          provider: evaluation.provider,
          latencyMs: evaluation.latencyMs,
          responseSummary: evaluation.responseSummary,
          startedAt: evaluation.startedAt,
          events: evaluation.events,
          sessionId: evaluation.sessionId
        }
      }];
  try {
    const { error } = await supabase.from(SUPABASE_EVENTS_TABLE).insert(rows);
    if (error) console.warn('Error guardando chat_events:', error.message);
  } catch (error) {
    console.warn('Error guardando chat_events:', error.message);
  }
};

const normalizeQuestion = (text = '') =>
  String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const CACHE_PRODUCT_TOPICS = [
  'prunex', 'prunex 1',
  'flora liv', 'floraliv',
  'thermo t3', 'thermot3',
  'nocarb', 'nocarb t', 'nocarb-t', 'no carb',
  'berry balance', 'berrybalance',
  'liquid fiber', 'liquid fibre', 'liquidfiber',
  'rexet', 'alpha balance', 'alpha',
  'beauty in', 'beauty-in', 'beautyin',
  'golden flx', 'goldenflx',
  'passion', 'probal',
  'on', 'no stress', 'nostress',
  'pre sport', 'presport',
  'post sport', 'postsport',
  'protein active', 'proteinactive',
  'bioprotein', 'bioprotein active',
  'vitamina', 'vita xtra', 'vitaextra', 'vitaenergia',
  'vera', 'gano',
  'cafe', 'cafe fit', 'cappuccino',
  'digestivo', 'digestión', 'probiótico', 'probióticos', 'colon',
  'producto digestivo', 'salud intestinal',
  'energia', 'energía', 'defensas', 'inmunologico',
  'control peso', 'bajar de peso', 'perder peso',
  'concentracion', 'concentración', 'enfoque', 'memoria', 'mente', 'cerebro',
  'articulaciones', 'articulacion', 'movilidad', 'dorado',
  'nutraday', 'nutricion infantil'
];

const isProductQuestion = (text = '') => {
  if (!text) return false;
  const normalized = normalizeQuestion(text);
  const words = normalized.split(/\s+/).filter(Boolean);
  for (const topic of CACHE_PRODUCT_TOPICS) {
    if (normalized.includes(topic)) return true;
  }
  for (const word of words) {
    if (word.length <= 2) continue;
    if (['que', 'para', 'como', 'con', 'por', 'del', 'las', 'los', 'una', 'uno'].includes(word)) continue;
    for (const topic of CACHE_PRODUCT_TOPICS) {
      const topicWords = topic.split(/\s+/);
      for (const topicWord of topicWords) {
        if (isFuzzyMatch(word, topicWord)) return true;
      }
    }
  }
  return false;
};

const getLastUserMessage = (messages = []) => {
  if (!Array.isArray(messages)) return null;
  const lastUser = [...messages].reverse().find((message) => message.role === 'user');
  return lastUser ? String(lastUser.content || '').trim() : null;
};

const getCachedAnswer = async (question) => {
  if (!supabase || !question) return null;
  try {
    const normalized = normalizeQuestion(question);
    const { data, error } = await supabase
      .from(SUPABASE_CACHE_TABLE)
      .select('answer_text, provider, api_used, cache_version')
      .eq('normalized_question', normalized)
      .limit(1)
      .single();
    if (error) return null;
    // Invalidar respuestas de versiones anteriores del caché
    if (data && data.cache_version !== CACHE_VERSION) {
      debugLog('CACHE', `Respuesta cacheada con versión ${data.cache_version}, actual es ${CACHE_VERSION}. Ignorando.`);
      return null;
    }
    return data ? { text: data.answer_text, model: data.provider || 'supabase_cache', apiUsed: data.api_used || 'supabase_cache' } : null;
  } catch (error) {
    return null;
  }
};

const saveCachedAnswer = async (question, answer, provider, apiUsed) => {
  if (!supabase || !question || !answer) return;
  try {
    const normalized = normalizeQuestion(question);
    await supabase.from(SUPABASE_CACHE_TABLE).upsert([
      { normalized_question: normalized, question_text: question, answer_text: answer, provider, api_used: apiUsed, cache_version: CACHE_VERSION }
    ], { onConflict: 'normalized_question' });
  } catch (error) {
    console.warn('Error guardando cache de Supabase:', error.message);
  }
};

const buildCacheKnowledgeMessage = (cachedText) => ({
  role: 'system',
  content: `INSTRUCCIÓN DE MEMORIA: La información anterior es una fuente de conocimiento, no una plantilla. No reutilices su estructura, ni copies frases completas ni párrafos literales. Responde según la intención actual del usuario: si pide definición, explica; si pide comparación, compara; si pide consejo, asesora. Varía el inicio, el orden y el estilo de las ideas. Conserva todos los hechos importantes, advertencias y recomendaciones de seguridad exactamente como están.` +
    `\n\nInformación de memoria:\n${cachedText}`
});

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// IMPORTANTE: Las funciones de llamada a APIs deben definirse ANTES de API_PROVIDERS
// para evitar el error "Cannot access 'callDeepSeekAPI' before initialization"

const callDeepSeekAPI = async (messages) => {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages, temperature: 0.7, max_tokens: 1024 })
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`DeepSeek API error ${response.status}: ${errorText}`);
  }
  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || '', model: 'deepseek-chat', apiUsed: 'deepseek' };
};

const callQwenAPI = async (messages) => {
  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${QWEN_API_KEY}` },
    body: JSON.stringify({ model: 'qwen-plus', messages, temperature: 0.7, max_tokens: 1024 })
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Qwen API error ${response.status}: ${errorText}`);
  }
  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || '', model: 'qwen-plus', apiUsed: 'qwen' };
};

const callGeminiAPI = async (messages) => {
  const systemMessages = messages.filter(m => m.role === 'system').map(m => m.content).join('\n');
  const userMessages = messages.filter(m => m.role !== 'system');
  const lastUserContent = userMessages.filter(m => m.role === 'user').pop()?.content || '';
  const historyContent = userMessages.slice(0, -1).map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`).join('\n');
  const prompt = `${systemMessages}\n\nHistorial:\n${historyContent}\n\nUsuario: ${lastUserContent}\n\nAsistente:`;
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }
  const data = await response.json();
  return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || '', model: 'gemini-1.5-flash', apiUsed: 'gemini' };
};

const API_PROVIDERS = {
  deepseek: { name: 'DeepSeek', hasKey: () => Boolean(DEEPSEEK_API_KEY), call: callDeepSeekAPI },
  qwen: { name: 'Qwen', hasKey: () => Boolean(QWEN_API_KEY), call: callQwenAPI },
  gemini: { name: 'Gemini', hasKey: () => Boolean(GEMINI_API_KEY), call: callGeminiAPI }
};

const getProviderOrder = (preferredProvider = 'deepseek') => {
  const fallbackOrder = ['deepseek', 'qwen', 'gemini'];
  const preferredIndex = fallbackOrder.indexOf(preferredProvider);
  if (preferredIndex === -1) return fallbackOrder;
  return [preferredProvider, ...fallbackOrder.filter(p => p !== preferredProvider)];
};

// ===================================================================
// HANDLER PRINCIPAL (Vercel Serverless Function)
// ===================================================================
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const startTime = Date.now();
  const { messages, preferredProvider = 'deepseek', sessionId, startedAt } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Mensajes requeridos' });
    return;
  }

  // Extraer el mensaje del usuario
  const userMessage = getLastUserMessage(messages);
  if (!userMessage) {
    res.status(400).json({ error: 'Mensaje de usuario requerido' });
    return;
  }

  debugLog('handler', `Inicio - sessionId: ${sessionId}, preferredProvider: ${preferredProvider}`);

  // Construir el prompt optimizado con contexto de producto
  const conversationHistory = messages
    .filter(m => m.role !== 'system')
    .map(m => ({ sender: m.role === 'user' ? 'user' : 'assistant', text: m.content }));

  const optimizedMessages = buildDynamicPrompt(userMessage, conversationHistory);

  // Verificar caché en Supabase
  let cachedAnswer = null;
  if (USE_SUPABASE) {
    cachedAnswer = await getCachedAnswer(userMessage);
  }

  let result;
  let apiUsed = 'cache';

  if (cachedAnswer) {
    // Usar respuesta cacheada pero PASARLA por la IA para reformular con el contexto actual
    const cacheKnowledgeMsg = buildCacheKnowledgeMessage(cachedAnswer.text);
    const memoryMessages = [cacheKnowledgeMsg, ...optimizedMessages];

    debugLog('CACHE', 'Respuesta encontrada en caché. Reformulando con IA...');

    // Intentar APIs en orden de preferencia para reformular
    const providerOrder = getProviderOrder(preferredProvider);
    let lastError = null;

    for (const provider of providerOrder) {
      const api = API_PROVIDERS[provider];
      if (!api || !api.hasKey()) continue;

      try {
        console.log(`🔄 Reformulando respuesta cacheada con ${api.name}...`);
        result = await api.call(memoryMessages);
        apiUsed = `${provider}_refined`;
        console.log(`✅ Respuesta reformulada con ${api.name}`);
        break;
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ ${api.name} falló al reformular:`, error.message);
      }
    }

    // Si todas las APIs fallan al reformular, usar la respuesta cacheada directamente
    if (!result) {
      console.log('📦 Usando respuesta cacheada directamente (APIs no disponibles para reformular)');
      result = { text: cachedAnswer.text, model: cachedAnswer.model, apiUsed: 'cache' };
    }
  } else {
    // Intentar APIs en orden de preferencia
    const providerOrder = getProviderOrder(preferredProvider);
    let lastError = null;

    for (const provider of providerOrder) {
      const api = API_PROVIDERS[provider];
      if (!api || !api.hasKey()) continue;

      try {
        console.log(`🔄 Intentando con ${api.name}...`);
        result = await api.call(optimizedMessages);
        apiUsed = provider;
        console.log(`✅ Respuesta obtenida de ${api.name}`);
        break;
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ ${api.name} falló:`, error.message);
      }
    }

    if (!result) {
      console.error('❌ Todas las APIs fallaron');
      res.status(503).json({
        error: 'No se pudo obtener respuesta de los proveedores de IA',
        details: lastError ? [{ api: 'all', error: lastError.message }] : []
      });
      return;
    }

    // Guardar en caché solo si es una pregunta de producto y la respuesta es coherente
    if (USE_SUPABASE && isProductQuestion(userMessage)) {
      // Verificar que la respuesta no sea negativa injustificada
      const hasProductContext = optimizedMessages.some(m => 
        m.role === 'system' && m.content && m.content.includes('CONTEXTO DEL PRODUCTO')
      );
      if (hasProductContext || !result.text.toLowerCase().includes('no tiene')) {
        await saveCachedAnswer(userMessage, result.text, result.model, result.apiUsed);
        debugLog('CACHE', 'Respuesta guardada en caché');
      } else {
        debugLog('CACHE', 'Respuesta no guardada en caché (posible falso negativo)');
      }
    }
  }

  debugLog('handler', `Proveedor usado: ${apiUsed}, tiempo: ${Date.now() - startTime}ms`);

  // Procesar eventos de la conversación
  try {
    const evaluation = await processChatConversation({
      conversation: optimizedMessages,
      response: result,
      sessionId,
      startedAt,
      provider: result.model,
      latencyMs: Date.now() - startTime,
      cacheHit: apiUsed === 'cache' || apiUsed.endsWith('_refined')
    });

    // Guardar eventos en Supabase
    if (USE_SUPABASE && evaluation) {
      await saveChatEvents(evaluation);
    }
  } catch (error) {
    console.warn('Error procesando eventos de chat:', error.message);
  }

  // Responder al cliente
  res.status(200).json({
    text: result.text,
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    model: result.model,
    apiUsed: result.apiUsed
  });
}
