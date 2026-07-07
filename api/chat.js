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
import {
  processUserMessage,
  generateProfileContext,
  getOrCreateProfile,
  markProductRecommended,
  markTopicExplained
} from '../lib/conversation/conversationEngine.js';
import {
  generateReasonedContext,
  generateFullContext
} from '../lib/conversation/reasoning/reasoningEngine.js';
import {
  assessRisk,
  generateRiskContext,
  getWarningMessage
} from '../lib/conversation/reasoning/medicalRiskAssessment.js';
import {
  processRecommendation
} from '../lib/recommendation/recommendationEngine.js';

// ===================================================================
// MODO DEBUG - Controlado por variable de entorno
// ===================================================================
const DEBUG_CHAT = process.env.DEBUG_CHAT === "true";

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
  { pattern: /\b(sueno|sueño|dormir|insomnio|descansar|relajacion|relajación|relajar|estres|estrés|ansiedad|nervios|calma|tranquilidad)\b/i, products: ['NO STRESS'] },
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
    // Productos con nombre corto (<= 3 caracteres): solo coincidencia exacta de palabra completa
    if (entry.normalized.length <= 3) {
      const escaped = entry.normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const wordPattern = new RegExp('\\b' + escaped + '\\b');
      if (wordPattern.test(normalizedText)) {
        matchedProducts.add(entry.original);
      }
      continue;
    }
    // Productos largos: detección flexible (includes)
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
// DETECCIÓN DE INTERÉS EN OPORTUNIDAD DE NEGOCIO
// ===================================================================
const BUSINESS_OPPORTUNITY_PATTERNS = [
  /\b(vender fuxion|vender fuXion)\b/i,
  /\b(hacer el negocio)\b/i,
  /\b(c[oó]mo gano dinero|c[oó]mo ganar dinero)\b/i,
  /\b(quiero emprender)\b/i,
  /\b(ser distribuidor)\b/i,
  /\b(oportunidad fuxion|oportunidad fuXion)\b/i,
  /\b(plan de negocio)\b/i,
  /\b(ganancias|ingresos extra|ingreso extra)\b/i,
  /\b(negocio fuxion|negocio fuXion)\b/i,
  /\b(trabajar con fuxion|trabajar con fuXion)\b/i,
  /\b(emprender con fuxion|emprender con fuXion)\b/i,
  /\b(unirme a fuxion|unirme a fuXion|asociarme)\b/i,
  /\b(ser parte de fuxion|ser parte de fuXion)\b/i,
  /\b(modelo de negocio|plan de compensaci[oó]n)\b/i,
  /\b(ganar dinero con fuxion|ganar dinero con fuXion)\b/i,
  /\b(c[oó]mo funciona el negocio)\b/i,
  /\b(quiero vender|vender productos)\b/i,
  /\b(oportunidad de negocio|negocio propio)\b/i,
  /\b(ingresos|dinero extra)\b/i,
  /\b(independencia financiera|libertad financiera)\b/i,
  /\b(trabajo desde casa|negocio desde casa)\b/i,
  /\b(ingreso pasivo|ingresos pasivos)\b/i
];

const detectBusinessOpportunityIntent = (text = '') => {
  if (!text) return false;
  return BUSINESS_OPPORTUNITY_PATTERNS.some(pattern => pattern.test(text));
};

const BUSINESS_OPPORTUNITY_RESPONSE = `El usuario ha mostrado interés en la OPORTUNIDAD DE NEGOCIO FuXion (vender, distribuir, emprender, ganar dinero, plan de negocio, etc.). Responde de forma natural, humana y cercana siguiendo estas pautas:

INFORMACION QUE PUEDES COMPARTIR:
- FuXion es una empresa de bienestar con presencia internacional.
- Además de consumir los productos, existe la posibilidad de desarrollar un proyecto independiente compartiendo bienestar.
- Muchas personas comienzan buscando un ingreso adicional o una forma de emprender con acompañamiento.
- Hay acompañamiento, formación continua, herramientas digitales y una comunidad que apoya.
- El modelo se basa en venta directa, con crecimiento por rangos, incentivos según resultados y bonos del plan comercial FuXion.
- Puedes mencionar conceptos como: bono auto, fondo país, rangos, reconocimientos.
- Cada persona avanza a su propio ritmo, sin presión.

REGLAS DE SEGURIDAD (OBLIGATORIAS):
- NUNCA prometas ingresos, ganancias, ni resultados económicos específicos.
- NUNCA uses frases como "gana dinero fácil", "hazte rico", "ingreso garantizado", "todos ganan", "te haces rico", "vas a ganar dinero", "ingresos asegurados", "libertad financiera garantizada" o similares.
- NUNCA presiones al usuario a unirse o tomar una decisión inmediata.
- Siempre usa lenguaje condicional: "puedes desarrollar", "existe la posibilidad", "según resultados", "según esfuerzo y plan vigente".
- Siempre mantén un tono informativo, no de venta agresiva.

TONO:
- Humano, cercano, simple.
- Informativo, tranquilo, sin presión.
- Como quien explica una posibilidad, no como quien vende un sueño.
- Invita a conocer más, no a decidir hoy.

VIDEO EDUCATIVO:
- Cuando el usuario pregunte "cómo funciona", "explícame", "quiero saber más", ofrecer el video explicativo.
- NO mandar el video en el primer mensaje siempre.
- El video está disponible en: https://youtu.be/L_AIXB0MI8A?si=nRhoWh3M9Fwd4_oX

DERIVACIÓN HUMANA:
- Si el usuario dice "asesor", "humano", "quiero hablar con alguien", no insistir con IA, derivar.
- El sistema detectará automáticamente la solicitud de asesor humano.

Ejemplo de respuesta:
"Qué bueno que quieras conocer la oportunidad FuXion 🌱

Además de consumir los productos, existe la posibilidad de desarrollar un proyecto independiente compartiendo bienestar.

Muchas personas comienzan buscando un ingreso adicional o una forma de emprender con acompañamiento.

Puedo compartirte un video corto donde se explica cómo funciona y también conectarte con un asesor."

NO uses este template textualmente. Adáptalo al contexto de la conversación.`;

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

// ===================================================================
// CONOCIMIENTO COMERCIAL ENRIQUECIDO POR CATEGORÍA
// ===================================================================
const CATEGORY_KNOWLEDGE = {
  'Limpieza del Colon': {
    commonQuestions: [
      '¿Es laxante?',
      '¿Crea dependencia?',
      '¿Desde cuándo hace efecto?',
      '¿Puedo tomarlo todos los días?',
      '¿Es seguro para uso prolongado?'
    ],
    painPoints: [
      'Estreñimiento crónico o severo',
      'Hinchazón abdominal',
      'Sensación de pesadez',
      'Dificultad para evacuar',
      'Inflamación después de comer'
    ],
    complementaryProducts: ['FLORA LIV', 'LIQUID FIBER'],
    explanation: 'La salud intestinal es la base del bienestar general. Cuando el colon no funciona bien, afecta la digestión, la absorción de nutrientes y hasta el estado de ánimo.'
  },
  'Regeneración Flora Intestinal': {
    commonQuestions: [
      '¿Cuánto tiempo debo tomarlo?',
      '¿Puedo tomarlo con antibióticos?',
      '¿Ayuda con la gastritis?',
      '¿Es para toda la familia?'
    ],
    painPoints: [
      'Gastritis frecuente',
      'Reflujo',
      'Colitis',
      'Colon irritable',
      'Intolerancia a la lactosa',
      'Malestar después de comer'
    ],
    complementaryProducts: ['PRUNEX 1', 'LIQUID FIBER'],
    explanation: 'La flora intestinal es clave para la digestión y las defensas. Cuando está desequilibrada, aparecen molestias digestivas y baja la inmunidad.'
  },
  'Limpieza del Sistema Digestivo': {
    commonQuestions: [
      '¿Es lo mismo que un laxante?',
      '¿Crea dependencia?',
      '¿Puedo tomarlo a diario?',
      '¿Sirve para mantener el peso?'
    ],
    painPoints: [
      'Estreñimiento leve o moderado',
      'Digestión lenta',
      'Sensación de hinchazón',
      'Tránsito intestinal irregular'
    ],
    complementaryProducts: ['FLORA LIV', 'PRUNEX 1'],
    explanation: 'Mantener un tránsito intestinal regular es fundamental para sentirse liviano y con energía.'
  },
  'Vigor Mental': {
    commonQuestions: [
      '¿Da energía como el café?',
      '¿Se puede tomar todos los días?',
      '¿Tiene cafeína?',
      '¿Ayuda a estudiar o trabajar?',
      '¿Interfiere con el sueño?'
    ],
    painPoints: [
      'Falta de concentración',
      'Cansancio mental',
      'Estrés diario',
      'Dificultad para enfocarse',
      'Agotamiento por estudio o trabajo'
    ],
    complementaryProducts: [],
    explanation: 'El rendimiento mental depende de la nutrición del cerebro. Con los nutrientes adecuados, la mente funciona con mayor claridad y enfoque.'
  },
  'Control de Peso': {
    commonQuestions: [
      '¿Baja de peso realmente?',
      '¿Hay que hacer dieta?',
      '¿Cuánto se puede bajar?',
      '¿Es seguro?',
      '¿Funciona sin ejercicio?'
    ],
    painPoints: [
      'Dificultad para bajar de peso',
      'Ansiedad por comer',
      'Metabolismo lento',
      'Estrés que lleva a comer',
      'Recuperación de peso perdido'
    ],
    complementaryProducts: ['THERMO T3', 'NOCARB-T', 'PROTEIN ACTIVE FIT'],
    explanation: 'El control de peso es un proceso integral que combina nutrición, actividad física y hábitos saludables.'
  },
  'Anti-Edad': {
    commonQuestions: [
      '¿Ayuda con la energía?',
      '¿Es para hombres o mujeres?',
      '¿Se puede tomar todos los días?',
      '¿Tiene efectos secundarios?',
      '¿Ayuda con la circulación?'
    ],
    painPoints: [
      'Falta de energía y vitalidad',
      'Bajo deseo o apetito sexual',
      'Problemas de circulación',
      'Migrañas frecuentes',
      'Cansancio general'
    ],
    complementaryProducts: ['NO STRESS', 'VITA XTRA T+'],
    explanation: 'La vitalidad y la energía son fundamentales para disfrutar la vida al máximo. PASSION está diseñado para quienes buscan un impulso natural de energía, mejorar su circulación y mantener una vida activa y plena.'
  },
  'Sport': {
    commonQuestions: [
      '¿Cuándo debo tomarlo?',
      '¿Antes o después del ejercicio?',
      '¿Reemplaza una comida?',
      '¿Es solo para deportistas?'
    ],
    painPoints: [
      'Rendimiento deportivo estancado',
      'Recuperación lenta después del ejercicio',
      'Fatiga muscular',
      'Deshidratación durante el entrenamiento'
    ],
    complementaryProducts: [],
    explanation: 'La nutrición deportiva adecuada marca la diferencia entre un buen rendimiento y resultados excepcionales.'
  }
};

// ===================================================================
// CONSTRUCCIÓN DE CONTEXTO ENRIQUECIDO PARA LA IA
// ===================================================================
const buildProductContext = (productNames = []) => {
  if (!productNames || productNames.length === 0) return null;
  const sections = productNames.map((productName) => {
    const { name, product, verified } = getProductDetails(productName);
    const category = product?.categoria || '';
    const categoryKnowledge = CATEGORY_KNOWLEDGE[category];

    const lines = [`--- INICIO FICHA TECNICA: ${name} ---`];
    lines.push(`Nombre: ${name}`);
    if (category) lines.push(`Categoria: ${category}`);
    if (product?.presentacion) lines.push(`Presentacion: ${product.presentacion}`);
    if (product?.precio) lines.push(`Precio: $${product.precio.toLocaleString('es-CL')}`);
    if (product?.sabor) lines.push(`Sabor: ${product.sabor}`);
    if (product?.ingredientes?.length) lines.push(`Ingredientes: ${product.ingredientes.join(', ')}`);
    if (product?.beneficios?.length) lines.push(`Beneficios: ${product.beneficios.join(', ')}`);
    if (product?.modo_uso) lines.push(`Modo de uso: ${product.modo_uso}`);
    if (product?.horario) lines.push(`Horario: ${product.horario}`);
    if (product?.efecto) lines.push(`Efecto: ${product.efecto}`);
    if (product?.advertencia) lines.push(`Advertencia: ${product.advertencia}`);
    if (product?.para_toda_familia) lines.push(`Apto para toda la familia: Si`);
    // NUEVOS CAMPOS ENRIQUECIDOS desde base de datos.json
    if (product?.objetivo_funcional) lines.push(`Objetivo funcional: ${product.objetivo_funcional}`);
    if (product?.descripcion_tecnica) lines.push(`Descripcion tecnica: ${product.descripcion_tecnica}`);
    if (product?.ingredientes_clave) lines.push(`Ingredientes clave: ${product.ingredientes_clave}`);
    if (product?.pauta_consumo) lines.push(`Pauta de consumo detallada: ${product.pauta_consumo}`);
    if (product?.inversion_referencial) lines.push(`Inversion referencial: ${product.inversion_referencial}`);
    if (verified) {
      if (verified.respuesta_base) lines.push(`Respuesta base: ${verified.respuesta_base}`);
      if (verified.ingredientes_oficiales?.length) lines.push(`Ingredientes oficiales: ${verified.ingredientes_oficiales.slice(0, 7).join(', ')}`);
      // NUEVOS CAMPOS ENRIQUECIDOS desde base de datos.json (AI catalog)
      if (verified.descripcion_tecnica) lines.push(`Descripcion tecnica (verificada): ${verified.descripcion_tecnica}`);
      if (verified.objetivo_funcional) lines.push(`Objetivo funcional (verificado): ${verified.objetivo_funcional}`);
      if (verified.pauta_consumo_detallada) lines.push(`Pauta de consumo detallada (verificada): ${verified.pauta_consumo_detallada}`);
      if (verified.ingredientes_clave_completos) lines.push(`Ingredientes clave completos (verificados): ${verified.ingredientes_clave_completos}`);
    }
    lines.push(`--- FIN FICHA TECNICA: ${name} ---`);

    // Agregar conocimiento comercial enriquecido
    if (categoryKnowledge) {
      lines.push('');
      lines.push(`--- CONOCIMIENTO COMERCIAL: ${name} ---`);
      lines.push(`Explicacion de la necesidad: ${categoryKnowledge.explanation}`);
      if (categoryKnowledge.painPoints.length > 0) {
        lines.push(`Dolores del cliente que resuelve: ${categoryKnowledge.painPoints.join(', ')}`);
      }
      if (categoryKnowledge.commonQuestions.length > 0) {
        lines.push(`Preguntas frecuentes de clientes: ${categoryKnowledge.commonQuestions.join(', ')}`);
      }
      if (categoryKnowledge.complementaryProducts.length > 0) {
        lines.push(`Productos complementarios sugeridos: ${categoryKnowledge.complementaryProducts.join(', ')}`);
      }
      lines.push(`--- FIN CONOCIMIENTO COMERCIAL ---`);
    }

    return lines.join('\n');
  });
  return sections.join('\n\n');
};

const buildSystemContext = () => {
  return `Eres el asesor nutricional oficial de FUXION Chile. No eres un catalogo ni Wikipedia. Actuas como un asesor humano con experiencia en nutricion y bienestar.

Tu proposito es comprender la necesidad del usuario, educar, explicar, generar confianza, recomendar y cerrar naturalmente.

PERSONALIDAD:
- Profesional, calido, humano, cercano y seguro.
- Hablas como una persona real, no como un bot.
- Usas lenguaje sencillo, evitas terminos tecnicos innecesarios.
- No eres robotico ni repetitivo.
- No usas frases comerciales agresivas ni pareces vendedor presionante.

REGLAS DE COMUNICACION:
- Puedes usar emojis con moderacion para dar calidez a la conversacion.
- Manten parrafos cortos de 2 a 3 lineas maximo.
- Varia la forma de empezar tus respuestas. Nunca empieces con "Es un producto..." o "Esta formulado..." o "Contiene...".
- REGLA CRITICA DE SALUDO: Solo debes saludar con "Hola" o "Hola [nombre]" UNA UNICA VEZ en toda la conversacion, en tu primer mensaje. En todas las respuestas siguientes, NUNCA repitas "Hola" ni "Hola [nombre]". Puedes usar el nombre del usuario de forma natural en medio de la respuesta (ej: "Daniel, el producto ideal seria...") pero nunca como saludo repetido. Si ya saludaste al inicio, las siguientes respuestas deben comenzar directamente con el contenido util, sin preambulo de saludo.
- Responde exactamente a la intencion del usuario. Si pregunta por un sintoma, habla del sintoma. Si pregunta por un producto, habla del producto.
- Si el usuario menciona sintomas, embarazo, lactancia, medicamentos o condiciones de salud, no des diagnosticos ni tratamientos. No recomiendes suspender ni modificar tratamientos medicos.
- REGLA ABSOLUTA: NUNCA ofrezcas hablar con un asesor humano ni derivar a WhatsApp. NUNCA. El usuario ya esta hablando contigo. Si necesita un asesor humano, el sistema lo decidira automaticamente.
- Para condiciones estables como higado graso, colesterol, diabetes controlada, gastritis, etc.: incluye una advertencia de precaucion al inicio y CONTINUA asesorando normalmente. NO cortes la conversacion. NO ofrezcas WhatsApp.
- Siempre explica que la informacion entregada tiene fines educativos y de bienestar, y no reemplaza la atencion profesional.

INFORMACION SOBRE EL CENTRO DE AYUDA:
Naturalmente FuXion cuenta con un Centro de Ayuda propio (/ayuda).
Puede recibir:
- consultas generales
- dudas de productos
- reclamos
- inconvenientes con pedidos
- felicitaciones
- experiencias
- solicitudes de contacto
- oportunidad FuXion

Cuando un usuario solicite hablar con una persona real, pida un asesor, mencione reclamo, queja, problema, inconveniente o contacto:
- NO debes intentar retener al usuario.
- NO debes responder "yo puedo reemplazar un asesor humano".
- Debes responder indicando que puede contactar al equipo de Naturalmente FuXion a traves del Centro de Ayuda en /ayuda o por WhatsApp.
- Si es un reclamo, debes indicar que para revisarlo correctamente se necesitan sus datos de contacto (WhatsApp o correo electronico).
- NUNCA envies al usuario a la pagina oficial de FuXion, soporte externo ni correos inventados.
- La ruta interna es /ayuda.

ESTRUCTURA OBLIGATORIA PARA RESPUESTAS SOBRE PRODUCTOS:

Paso 1 - Validar la necesidad:
Reconoce lo que el usuario busca. Ej: "Entiendo, si buscas mejorar tu digestion o sentirte menos pesado..."

Paso 2 - Explicar el problema:
Explica por que suele ocurrir ese problema de forma sencilla. Ej: "Cuando el colon no funciona bien, los desechos se acumulan y generan hinchazon y molestias."

Paso 3 - Recomendar el producto:
Explica por que ese producto puede ayudar. No digas solo el nombre, contextualiza.

Paso 4 - Explicar beneficios en lenguaje practico:
Convierte los beneficios tecnicos en beneficios reales para el dia a dia. No copies la lista del catalogo.

Paso 5 - Explicar ingredientes clave:
Menciona 1 o 2 ingredientes principales y explica para que sirven en lenguaje sencillo.
Ej: "El Psyllium es una fibra soluble que ayuda a regular el transito intestinal de forma natural."

Paso 6 - Indicar uso practico:
Cuando tomarlo, como prepararlo, recomendaciones generales.

Paso 7 - Expectativas realistas:
Nunca prometas resultados. Usa frases como "los resultados pueden variar segun cada persona" o "muchas personas reportan mejorias en las primeras semanas".

Paso 8 - Continuar la conversacion:
Haz una pregunta para seguir ayudando. Ej: "Lo buscas para un problema puntual o para mantenerte bien?" o "Quieres que te explique como combinarlo con otros productos?"

COMPORTAMIENTO DINAMICO SEGUN INTENCION:

Si el usuario muestra intencion de compra (quiere comprar, pregunta precio):
- Se directo con la informacion de precio y disponibilidad.
- Ofrece ayuda con el proceso de compra.

Si el usuario muestra intencion educativa (pregunta que es, como funciona):
- Explica con calma y detalle.
- Enfocate en educar, no en vender.

Si el usuario muestra intencion de comparacion (versus, diferencia, mejor):
- Compara objetivamente.
- Explica para que perfil es mejor cada opcion.

FORMATO OBLIGATORIO DE RESPUESTA:
Todas las respuestas deben generarse en texto plano.
Nunca utilices:
- Markdown
- **negritas**
- __subrayado__
- # titulos
- listas Markdown
- bloques de codigo
- tablas Markdown
- comillas decorativas
Si deseas destacar un producto, hazlo mediante la redaccion, nunca mediante formato.

Ejemplos:
- Incorrecto: "**Prunex 1** puede ayudarte..."
- Correcto: "Prunex 1 puede ayudarte..."
- Incorrecto: "**Ingredientes:**"
- Correcto: "Ingredientes principales:"
- Incorrecto: "## Beneficios"
- Correcto: "Entre sus principales beneficios se encuentran..."

INSTRUCCION SOBRE PRODUCTOS:
- Todos los productos Fuxion vienen en sobres (sachets) para mezclar con agua. No son pastillas, capsulas, jarabes ni liquidos embotellados.
- Cuando recibas una ficha tecnica de producto, esa es tu UNICA fuente de informacion sobre ese producto. No uses tu conocimiento general.
- Si no recibes ficha tecnica para un producto, NO lo recomiendes. No inventes informacion.
- Si el usuario pregunta por un producto que no esta en ninguna ficha tecnica, responde: "No tengo informacion sobre ese producto en mi base de datos actual."

CORRECCION CRITICA SOBRE PASSION Y VITAENERGIA:
- PASSION es un producto de VITALIDAD Y ENERGIA. Contiene ginseng, jalea real, guarana y aminoacidos. Ayuda con la circulacion, la potencia sexual, la energia y las migrañas. NO es para dormir, NO es para relajarse, NO contiene pasiflora ni melatonina.
- VITAENERGIA es un multivitaminico energizante con vitaminas, minerales, fibra prebiotica, camu camu y luteina. Ayuda a disipar la fatiga y mejorar la energia diaria.
- NO confundas PASSION con un producto para dormir o relajarse. PASSION es ENERGETICO, no relajante.
`;
};

const buildDynamicPrompt = (userMessage, conversationHistory = [], profileContext = '', riskAssessment = null, riskContext = '', preResult = null, productJourney = null) => {
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

  const isGreeting = /\b(hola|buenas|buen dí[aá]|buenos d[ií]as|buenas tardes|buenas noches|buenas)\b/i.test(String(userMessage || ''));
  const isThanks = /\b(gracias|muchas gracias|muchísimas gracias|te agradezco|agradecido)\b/i.test(String(userMessage || ''));
  const includeProducts = currentProducts.length > 0 && !isGreeting && !isThanks;

  debugLog('currentProducts', currentProducts);
  debugLog('includeProducts', includeProducts);

  const systemMessages = [{ role: 'system', content: buildSystemContext() }];

  // Inyectar perfil conversacional (CIE) si hay información relevante
  if (profileContext) {
    systemMessages.push({
      role: 'system',
      content: `PERFIL DE LA CONVERSACION:\n${profileContext}`
    });
    debugLog('profileContext', profileContext.substring(0, 200) + '...');
  }

  // ===================================================================
  // SMART PRODUCT INTEREST MEMORY
  // Inyectar contexto de productos vistos por el usuario durante su navegación
  // Esto permite que la IA sepa qué productos ha estado mirando el usuario
  // y cuál es su posible interés inferido.
  // ===================================================================
  if (productJourney && productJourney.viewedProducts && productJourney.viewedProducts.length > 0) {
    const journeyLines = ['CONTEXTO DE NAVEGACION DEL USUARIO (productos vistos en la tienda antes de preguntar):'];
    journeyLines.push('Productos vistos:');
    productJourney.viewedProducts.forEach(p => {
      journeyLines.push(`- ${p.name}`);
    });
    if (productJourney.mainInterest) {
      journeyLines.push('');
      journeyLines.push('Posible interes:');
      journeyLines.push(productJourney.mainInterest);
    }
    journeyLines.push('');
    journeyLines.push('Usa esta informacion para contextualizar tu respuesta. Si el usuario pregunta por recomendacion, ten en cuenta los productos que ya ha visto.');
    systemMessages.push({
      role: 'system',
      content: journeyLines.join('\n')
    });
    debugLog('PRODUCT_JOURNEY', `Contexto inyectado: ${productJourney.viewedProducts.length} productos, interés: ${productJourney.mainInterest || 'ninguno'}`);
  }

  // ===================================================================
  // PRODUCT RECOMMENDATION ENGINE (PRE)
  // El PRE es el ÚNICO responsable de elegir el producto principal.
  // La IA SOLO recibe la recomendación, NO la decide.
  // ===================================================================
  if (preResult) {
    // Inyectar la recomendación del PRE como contexto de sistema
    systemMessages.push({
      role: 'system',
      content: preResult.recommendationContext
    });

    // Inyectar las reglas de negocio que aplicaron
    if (preResult.businessRulesContext) {
      systemMessages.push({
        role: 'system',
        content: preResult.businessRulesContext
      });
    }

    // Inyectar la ficha técnica del producto principal (desde la base de datos)
    const productContext = buildProductContext([preResult.productoPrincipal, ...(preResult.productosSecundarios || []), ...(preResult.productosComplementarios || [])]);
    if (productContext) {
      systemMessages.push({
        role: 'system',
        content: `FICHA TECNICA del producto recomendado:\n\n${productContext}`
      });
    }
  } else if (includeProducts) {
    // Fallback: si el PRE no encontró reglas, usar la detección tradicional
    const uniqueProducts = Array.from(new Set(currentProducts));
    const productContext = buildProductContext(uniqueProducts);
    debugLog('productContext (fallback)', productContext ? productContext.substring(0, 300) + '...' : 'null');
    if (productContext) {
      systemMessages.push({
        role: 'system',
        content: `INFORMACION DE PRODUCTOS:\n\n${productContext}`
      });
    } else {
      debugLog('WARN', 'productContext es null aunque hay productos detectados');
    }
  }

  // Agregar contexto de oportunidad de negocio si aplica
  if (detectBusinessOpportunityIntent(userMessage)) {
    systemMessages.push({
      role: 'system',
      content: BUSINESS_OPPORTUNITY_RESPONSE
    });
  }

  // Agregar contexto de promociones si aplica
  if (/\b(promocion|promociones|descuento|descuentos|regalo|regalos|packs|pack|oferta|programa|promo)\b/i.test(userMessage)) {
    systemMessages.push({
      role: 'system',
      content: `PROMOCIONES: Responde consultas sobre promociones, descuentos, regalos y packs solo cuando se pregunten. Explica el programa de regalos 4+1 con productos elegibles (PASSION, LIQUID FIBER, GOLDEN FLX, NOCARB-T) si es relevante. No inventes descuentos adicionales ni otros beneficios que no existan.`
    });
  }

  // Agregar contexto médico según MRA (Medical Risk Assessment)
  if (riskAssessment && riskAssessment.level >= 2) {
    systemMessages.push({
      role: 'system',
      content: riskContext
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
// DIAGNÓSTICO DE VARIABLES DE ENTORNO (se ejecuta al iniciar el servidor)
// ===================================================================
const ENV_VARS_CHECKED = [];

const checkEnvVar = (name) => {
  const exists = Boolean(process.env[name]);
  ENV_VARS_CHECKED.push({ name, exists });
  return exists;
};

const printEnvDiagnostic = () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('🔍 DIAGNÓSTICO DE VARIABLES DE ENTORNO');
  console.log('='.repeat(60));
  const criticalVars = [
    'DEEPSEEK_API_KEY',
    'QWEN_API_KEY',
    'GEMINI_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_ANON_KEY',
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID'
  ];
  for (const name of criticalVars) {
    const exists = checkEnvVar(name);
    const existsVite = checkEnvVar(`VITE_${name}`);
    const status = exists ? '✅ PRESENTE' : (existsVite ? '✅ PRESENTE (como VITE_)' : '❌ AUSENTE');
    console.log(`  ${name.padEnd(35)} ${status}`);
  }
  console.log('='.repeat(60));
  console.log('');
};

// Ejecutar diagnóstico al cargar el módulo (solo si DEBUG_CHAT está activo)
if (DEBUG_CHAT) {
  printEnvDiagnostic();
}

// ===================================================================
// CONFIGURACIÓN DE APIs
// ===================================================================
const getApiKey = (name) => {
  const key = process.env[name] || process.env[`VITE_${name}`];
  if (!key) {
    console.warn(`⚠️ API key no configurada: ${name} (tampoco con prefijo VITE_)`);
  }
  return key;
};

const DEEPSEEK_API_KEY = getApiKey('DEEPSEEK_API_KEY');
const QWEN_API_KEY = getApiKey('QWEN_API_KEY');
const GEMINI_API_KEY = getApiKey('GEMINI_API_KEY');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);
const SUPABASE_CACHE_TABLE = 'chat_memory';
const SUPABASE_EVENTS_TABLE = 'chat_events';

// Versión del caché para invalidar respuestas antiguas cuando cambia la lógica
// v3: Prompt reescrito como asesor nutricional humano + contexto enriquecido con conocimiento comercial
// v4: Conversation Reasoning Engine (CRE) - razonamiento estructurado + plan de bienestar + detección de personalidad
// v5: Medical Risk Assessment (MRA) - no derivar por enfermedad, continuar conversación
// v6: Corrección crítica PASSION vs VITAENERGÍA - PASSION es energético, no para dormir
const CACHE_VERSION = 'v6';

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
// LOGS ESTRUCTURADOS PARA PROVEEDORES DE IA
// ===================================================================
const logProviderAttempt = (providerName, status, errorMessage, elapsedMs, cause) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    provider: providerName,
    status,
    errorMessage: errorMessage || null,
    elapsedMs,
    cause: cause || null
  };
  console.log(`[API-DIAG] ${JSON.stringify(logEntry)}`);
  return logEntry;
};

const classifyErrorCause = (providerName, error) => {
  const msg = String(error.message || '').toLowerCase();
  const statusMatch = msg.match(/error (\d+)/);
  const httpStatus = statusMatch ? parseInt(statusMatch[1]) : 0;

  // Causas específicas por código HTTP
  if (httpStatus === 401 || httpStatus === 403) return 'API_KEY_INVALIDA';
  if (httpStatus === 429) return 'CUOTA_AGOTADA';
  if (httpStatus === 402) return 'CUOTA_AGOTADA';
  if (httpStatus >= 500) return 'ERROR_SERVIDOR_PROVEEDOR';

  // Causas por mensaje de error
  if (msg.includes('api key') || msg.includes('unauthorized') || msg.includes('forbidden') || msg.includes('invalid')) return 'API_KEY_INVALIDA';
  if (msg.includes('quota') || msg.includes('rate limit') || msg.includes('too many requests') || msg.includes('insufficient')) return 'CUOTA_AGOTADA';
  if (msg.includes('timeout') || msg.includes('timed out') || msg.includes('abort')) return 'TIMEOUT';
  if (msg.includes('econnrefused') || msg.includes('enotfound') || msg.includes('econnreset') || msg.includes('network') || msg.includes('fetch failed')) return 'ERROR_DE_RED';
  if (msg.includes('api key no configurada') || msg.includes('not configured')) return 'API_KEY_AUSENTE';

  return 'ERROR_DESCONOCIDO';
};

// ===================================================================
// SANITIZACIÓN FINAL DE RESPUESTAS (eliminar cualquier Markdown residual)
// ===================================================================
const sanitizeOutput = (text = '') => {
  if (!text) return '';
  let cleaned = String(text);
  // Eliminar **negritas**
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
  // Eliminar __subrayado__
  cleaned = cleaned.replace(/__(.*?)__/g, '$1');
  // Eliminar *cursivas* (pero no confundir con asteriscos de listas)
  cleaned = cleaned.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '$1');
  // Eliminar ~~tachado~~
  cleaned = cleaned.replace(/~~(.*?)~~/g, '$1');
  // Eliminar # títulos
  cleaned = cleaned.replace(/^#{1,6}\s*/gm, '');
  // Eliminar bloques de código (```...```)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  // Eliminar `código inline`
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  // Eliminar listas Markdown (- o * al inicio de línea)
  cleaned = cleaned.replace(/^\s*[-*]\s+/gm, '');
  // Eliminar listas numeradas Markdown (1. 2. etc)
  cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '');
  // Eliminar tablas Markdown REALES (formato de tabla con | separadores)
  // Solo elimina líneas que tengan formato de tabla markdown:
  // - Líneas que contengan | y tengan al menos 2 pipes (| algo | algo |)
  // - O líneas de separación de tabla (| --- | --- |)
  // NO elimina textos normales que contengan | (ej: "opción A | opción B")
  cleaned = cleaned.replace(/^\s*\|.+\|.+\|?\s*$/gm, '');
  cleaned = cleaned.replace(/^\s*\|?\s*:?-+:?\s*\|.*$/gm, '');
  // Eliminar líneas de separación (---, ***, ___)
  cleaned = cleaned.replace(/^[-*_]{3,}\s*$/gm, '');
  // Eliminar comillas decorativas (>)
  cleaned = cleaned.replace(/^>\s*/gm, '');
  // Eliminar espacios duplicados
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  // Eliminar saltos de línea excesivos (más de 2 seguidos)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
};

const buildFallbackResponseText = (userMessage = '', riskAssessment = null, preResult = null) => {
  const intro = 'En este momento el asistente de IA está temporalmente fuera de servicio.';
  const mentionedProducts = getMentionedProductsFromText(userMessage);
  const benefitProducts = getProductsFromBenefitIntent(userMessage);
  const candidateProducts = [...new Set([
    ...(preResult?.productoPrincipal ? [preResult.productoPrincipal] : []),
    ...mentionedProducts,
    ...benefitProducts
  ])].filter(Boolean);

  if (candidateProducts.length > 0) {
    const productName = candidateProducts[0];
    const { name, product } = getProductDetails(productName);
    if (product) {
      const presentation = product.presentacion ? `se presenta en ${product.presentacion}` : '';
      const benefits = Array.isArray(product.beneficios) && product.beneficios.length > 0
        ? `y está orientado a ${String(product.beneficios[0]).toLowerCase()}`
        : '';
      const detailText = [presentation, benefits].filter(Boolean).join(' ');
      const detailSuffix = detailText ? ` ${detailText}` : '';
      return `Entiendo que buscas información sobre ${name}. ${intro} La información registrada indica que ${name}${detailSuffix}. Si quieres, puedes decirme otro producto o tu objetivo concreto y te orientaremos mejor cuando el servicio vuelva a estar activo.`;
    }
  }

  if (/\b(precio|costo|cuanto cuesta|cuánto cuesta|despacho|envío|entrega|disponibilidad|stock)\b/i.test(userMessage)) {
    return `${intro} Por ahora no puedo confirmar precios ni disponibilidad en tiempo real, pero puedes escribir el producto que te interesa y te orientaremos cuando vuelva el servicio.`;
  }

  if (riskAssessment?.level >= 2) {
    return `${intro} Si tu consulta está relacionada con salud o bienestar, te recomiendo confirmar cualquier decisión con un profesional de la salud.`;
  }

  return `${intro} Puedes escribir el nombre de un producto o decir qué necesitas para que te ayudemos a revisar opciones de Fuxion.`;
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
  const { messages, preferredProvider = 'deepseek', sessionId, startedAt, productJourney } = req.body;

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

  // Smart Product Interest Memory: log si hay datos de journey
  if (productJourney && productJourney.viewedProducts && productJourney.viewedProducts.length > 0) {
    debugLog('PRODUCT_JOURNEY', `Productos vistos: ${productJourney.viewedProducts.map(p => p.name).join(', ')}`);
    debugLog('PRODUCT_JOURNEY', `Interés inferido: ${productJourney.mainInterest || 'ninguno'}`);
  }

  // Construir el prompt optimizado con contexto de producto
  const conversationHistory = messages
    .filter(m => m.role !== 'system')
    .map(m => ({ sender: m.role === 'user' ? 'user' : 'assistant', text: m.content }));

  // Conversation Intelligence Engine: procesar perfil del usuario
  const detectedProducts = getMentionedProductsFromText(userMessage);
  processUserMessage(sessionId, userMessage, detectedProducts);

  // Medical Risk Assessment: evaluar nivel de riesgo
  const riskAssessment = assessRisk(userMessage);
  const riskContext = generateRiskContext(userMessage);
  debugLog('MRA', `Nivel de riesgo: ${riskAssessment.level}, Accion: ${riskAssessment.action}`);

  // Conversation Reasoning Engine: generar contexto razonado
  const profile = getOrCreateProfile(sessionId);
  const reasonedContext = generateFullContext(profile);

  // Product Recommendation Engine (PRE): determinar producto principal
  // El PRE se ejecuta ANTES del Prompt Builder para que la IA reciba
  // la recomendación ya definida, no tenga que decidirla.
  const preResult = processRecommendation(userMessage, conversationHistory);
  if (preResult) {
    debugLog('PRE', `Producto principal: ${preResult.productoPrincipal}`);
    debugLog('PRE', `Productos secundarios: ${preResult.productosSecundarios.join(', ')}`);
    debugLog('PRE', `Productos complementarios: ${preResult.productosComplementarios.join(', ')}`);
  } else {
    debugLog('PRE', 'No se encontró recomendación basada en reglas de negocio');
  }

  const optimizedMessages = buildDynamicPrompt(userMessage, conversationHistory, reasonedContext, riskAssessment, riskContext, preResult, productJourney);

  // Verificar caché en Supabase (SOLO si no hay riesgo médico)
  let cachedAnswer = null;
  if (USE_SUPABASE && riskAssessment.level < 2) {
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
    const cacheProviderLogs = [];
    let lastError = null;

    for (const provider of providerOrder) {
      const api = API_PROVIDERS[provider];
      const providerStartTime = Date.now();

      if (!api || !api.hasKey()) {
        const elapsed = Date.now() - providerStartTime;
        const logEntry = logProviderAttempt(api?.name || provider, 'SKIPPED', 'API key no configurada', elapsed, 'API_KEY_AUSENTE');
        cacheProviderLogs.push(logEntry);
        console.warn(`⏭️ ${api?.name || provider}: API key no configurada (reformulación)`);
        continue;
      }

      try {
        console.log(`🔄 Reformulando respuesta cacheada con ${api.name}...`);
        result = await api.call(memoryMessages);
        apiUsed = `${provider}_refined`;
        const elapsed = Date.now() - providerStartTime;
        const logEntry = logProviderAttempt(api.name, 'OK', null, elapsed, null);
        cacheProviderLogs.push(logEntry);
        console.log(`✅ Respuesta reformulada con ${api.name} (${elapsed}ms)`);
        break;
      } catch (error) {
        const elapsed = Date.now() - providerStartTime;
        lastError = error;
        const cause = classifyErrorCause(provider, error);
        const logEntry = logProviderAttempt(api.name, 'ERROR', error.message, elapsed, cause);
        cacheProviderLogs.push(logEntry);
        console.warn(`⚠️ ${api.name} falló al reformular (${elapsed}ms): [${cause}] ${error.message}`);
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
    const providerLogs = [];
    let lastError = null;

    for (const provider of providerOrder) {
      const api = API_PROVIDERS[provider];
      const providerStartTime = Date.now();

      // Verificar si la API tiene key configurada
      if (!api || !api.hasKey()) {
        const elapsed = Date.now() - providerStartTime;
        const logEntry = logProviderAttempt(api?.name || provider, 'SKIPPED', 'API key no configurada', elapsed, 'API_KEY_AUSENTE');
        providerLogs.push(logEntry);
        console.warn(`⏭️ ${api?.name || provider}: API key no configurada`);
        continue;
      }

      try {
        console.log(`🔄 Intentando con ${api.name}...`);
        result = await api.call(optimizedMessages);
        apiUsed = provider;
        const elapsed = Date.now() - providerStartTime;
        const logEntry = logProviderAttempt(api.name, 'OK', null, elapsed, null);
        providerLogs.push(logEntry);
        console.log(`✅ Respuesta obtenida de ${api.name} (${elapsed}ms)`);
        break;
      } catch (error) {
        const elapsed = Date.now() - providerStartTime;
        lastError = error;
        const cause = classifyErrorCause(provider, error);
        const logEntry = logProviderAttempt(api.name, 'ERROR', error.message, elapsed, cause);
        providerLogs.push(logEntry);
        console.warn(`⚠️ ${api.name} falló (${elapsed}ms): [${cause}] ${error.message}`);
      }
    }

    if (!result) {
      console.error('❌ Todas las APIs fallaron');
      // Construir detalles de diagnóstico sin exponer claves secretas
      const diagnosticDetails = providerLogs.map(log => ({
        provider: log.provider,
        status: log.status,
        elapsedMs: log.elapsedMs,
        cause: log.cause,
        errorMessage: log.cause === 'API_KEY_AUSENTE' ? 'API key no configurada en el servidor' : log.errorMessage
      }));
      // Agregar diagnóstico de variables de entorno
      const envSummary = ENV_VARS_CHECKED.map(v => ({
        var: v.name,
        present: v.exists
      }));
      console.error(`[API-DIAG] Resumen: ${JSON.stringify({ providerLogs, envSummary })}`);

      const fallbackText = buildFallbackResponseText(userMessage, riskAssessment, preResult);
      const fallbackResponseContract = {
        text: fallbackText,
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        model: 'fallback',
        apiUsed: 'fallback',
        showWhatsApp: false,
        advisorReason: null,
        healthRisk: {
          level: riskAssessment.level,
          condition: riskAssessment.condition || null,
          allowConversation: riskAssessment.level < 3,
          allowRecommendations: riskAssessment.level < 3,
          requiresEmergency: riskAssessment.level >= 3,
          showWhatsApp: riskAssessment.level >= 3
        },
        purchaseIntent: null,
        conversationStage: null,
        advisorRecommendation: null,
        fallback: true,
        fallbackReason: 'No se pudieron contactar los proveedores de IA',
        details: diagnosticDetails,
        envCheck: envSummary
      };

      if (riskAssessment.level >= 3) {
        fallbackResponseContract.showWhatsApp = true;
        fallbackResponseContract.advisorReason = 'Se detectó una situación que requiere atención médica inmediata.';
        fallbackResponseContract.advisorRecommendation = 'emergency';
      } else if (/\b(asesor|humano|whatsapp|hablar con un asesor|quiero hablar con un asesor|necesito un asesor|contactar con un asesor|asesor humano)\b/i.test(userMessage)) {
        fallbackResponseContract.showWhatsApp = true;
        fallbackResponseContract.advisorReason = 'El cliente solicitó hablar con un asesor humano.';
        fallbackResponseContract.advisorRecommendation = 'user_requested';
      } else if (/\b(comprar|quiero comprar|como compro|cómo compro|donde compro|dónde compro|quiero pedir|hacer pedido|quiero ordenar)\b/i.test(userMessage)) {
        fallbackResponseContract.showWhatsApp = true;
        fallbackResponseContract.advisorReason = 'El cliente manifestó intención de compra y puede necesitar asistencia.';
        fallbackResponseContract.advisorRecommendation = 'purchase_intent';
        fallbackResponseContract.purchaseIntent = 'high';
      } else if (/\b(precio|cuanto cuesta|cuánto cuesta|valor|costo|costos|despacho|envío|entrega|disponibilidad|stock)\b/i.test(userMessage)) {
        fallbackResponseContract.showWhatsApp = true;
        fallbackResponseContract.advisorReason = 'El cliente consultó sobre precio, despacho o disponibilidad.';
        fallbackResponseContract.advisorRecommendation = 'pricing_inquiry';
      }

      res.status(200).json(fallbackResponseContract);
      return;
    }

    // Guardar en caché solo si es una pregunta de producto y la respuesta es coherente
    if (USE_SUPABASE && isProductQuestion(userMessage)) {
      // Verificar que la respuesta no sea negativa injustificada
      const hasProductContext = optimizedMessages.some(m => 
        m.role === 'system' && m.content && (
          m.content.includes('INFORMACION DE PRODUCTOS:') ||
          m.content.includes('FICHA TECNICA del producto recomendado:') ||
          m.content.includes('--- INICIO FICHA TECNICA:')
        )
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

  // Sanitizar respuesta final (eliminar cualquier Markdown residual)
  const sanitizedText = sanitizeOutput(result.text);

  // Response Contract: el backend decide todo
  // FalconBot solo debe renderizar lo que el backend indique
  const responseContract = {
    text: sanitizedText,
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    model: result.model,
    apiUsed: result.apiUsed,
    // --- Response Contract v2.0 ---
    // showWhatsApp: true SOLO cuando:
    //   - El usuario solicita explícitamente un asesor humano
    //   - El usuario quiere comprar y necesita asistencia
    //   - El usuario solicita precio, despacho o disponibilidad
    //   - El backend detecta riesgo nivel 3 (urgencia médica)
    //   - Hay un error técnico que impide continuar
    showWhatsApp: false,
    advisorReason: null,
    // healthRisk: información sobre evaluación de riesgo médico
    healthRisk: {
      level: riskAssessment.level,
      condition: riskAssessment.condition || null,
      allowConversation: riskAssessment.level < 3,
      allowRecommendations: riskAssessment.level < 3,
      requiresEmergency: riskAssessment.level >= 3,
      showWhatsApp: riskAssessment.level >= 3
    },
    // purchaseIntent: señales de intención de compra detectadas
    purchaseIntent: null,
    // conversationStage: etapa actual de la conversación
    conversationStage: null,
    // advisorRecommendation: recomendación del backend sobre derivación
    advisorRecommendation: null,
    // Business Opportunity flags
    isBusinessOpportunity: false,
    showOpportunityVideo: false,
    showOpportunityAdvisor: false
  };

  // Detectar intención de oportunidad de negocio
  const isBusinessOpportunity = detectBusinessOpportunityIntent(userMessage);
  if (isBusinessOpportunity) {
    responseContract.isBusinessOpportunity = true;
    // Si el usuario pide explicación, ofrecer video
    if (/\b(c[oó]mo funciona|expl[ií]came|quiero saber m[aá]s|cu[eé]ntame m[aá]s|dime m[aá]s|quiero entender|en qu[eé] consiste)\b/i.test(userMessage)) {
      responseContract.showOpportunityVideo = true;
    }
    // Si el usuario solicita asesor humano, ofrecer derivación
    if (/\b(asesor|humano|quiero hablar con alguien|hablar con un asesor|contactar con un asesor|asesor humano|persona real|atenci[oó]n personalizada)\b/i.test(userMessage)) {
      responseContract.showOpportunityAdvisor = true;
    }
  }

  // Determinar si debe mostrar WhatsApp según las reglas del backend
  if (riskAssessment.level >= 3) {
    // Riesgo nivel 3: urgencia médica
    responseContract.showWhatsApp = true;
    responseContract.advisorReason = 'Se detectó una situación que requiere atención médica inmediata.';
    responseContract.advisorRecommendation = 'emergency';
  } else if (/\b(asesor|humano|whatsapp|hablar con un asesor|quiero hablar con un asesor|necesito un asesor|contactar con un asesor|asesor humano)\b/i.test(userMessage)) {
    // El usuario solicita explícitamente un asesor humano
    responseContract.showWhatsApp = true;
    responseContract.advisorReason = 'El cliente solicitó hablar con un asesor humano.';
    responseContract.advisorRecommendation = 'user_requested';
  } else if (/\b(comprar|quiero comprar|como compro|cómo compro|donde compro|dónde compro|quiero pedir|hacer pedido|quiero ordenar)\b/i.test(userMessage)) {
    // Intención de compra
    responseContract.showWhatsApp = true;
    responseContract.advisorReason = 'El cliente manifestó intención de compra y puede necesitar asistencia.';
    responseContract.advisorRecommendation = 'purchase_intent';
    responseContract.purchaseIntent = 'high';
  } else if (/\b(precio|cuanto cuesta|cuánto cuesta|valor|costo|costos|despacho|envío|entrega|disponibilidad|stock)\b/i.test(userMessage)) {
    // Consulta de precio, despacho o disponibilidad
    responseContract.showWhatsApp = true;
    responseContract.advisorReason = 'El cliente consultó sobre precio, despacho o disponibilidad.';
    responseContract.advisorRecommendation = 'pricing_inquiry';
  }

  // Responder al cliente con el response contract completo
  res.status(200).json(responseContract);
}
