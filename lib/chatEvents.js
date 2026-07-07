import {
  CHAT_RULE_PATTERNS,
  BUY_INTENT_STRONG,
  BUY_INTENT_PRICE,
  BUY_INTENT_LOGISTICS,
  BUY_INTENT_SPECIFIC_PROBLEM,
  BUY_INTENT_REPEATED_PRODUCT,
  BUY_INTENT_MEDIUM,
  BUSINESS_INTENT_PATTERNS,
  INTENT_LEVELS,
  HUMAN_REQUEST_PATTERNS,
  BUSINESS_OPPORTUNITY_PATTERNS,
  PRODUCT_CATEGORY_MAP,
  TELEGRAM_INTERESTED_TEMPLATE,
  TELEGRAM_BUYING_TEMPLATE,
  TELEGRAM_BUSINESS_TEMPLATE
} from '../config/chatAlertRules.js';

import { sendTelegramNotification } from './telegramNotifier.js';
import {
  createLeadProfile,
  detectarCustomerStage,
  detectarContacto,
  checkCooldown,
  registerNotification,
  detectBusinessOpportunity,
  buildTelegramMessageV2
} from './leadIntelligence.js';

// ===================================================================
// DEBUG MODE - Controla logs en producción
// Solo se muestran si DEBUG_CHAT === "true" en variables de entorno
// ===================================================================
const DEBUG_EVENTS = process.env.DEBUG_CHAT === "true";

const debugLog = (label, data) => {
  if (!DEBUG_EVENTS) return;
  if (typeof data === 'object') {
    console.log(`[chatEvents] ${label}:`, JSON.stringify(data, null, 2));
  } else {
    console.log(`[chatEvents] ${label}:`, data);
  }
};

const normalizeText = (text = '') =>
  String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Calcula la distancia de Levenshtein para fuzzy matching.
 */
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

/**
 * Determina si dos palabras son similares (fuzzy match).
 */
const isFuzzyMatch = (userWord, productWord) => {
  if (!userWord || !productWord) return false;
  if (productWord.includes(userWord) || userWord.includes(productWord)) {
    if (productWord.length <= 3 && userWord.length > productWord.length + 2) {
      return false;
    }
    return true;
  }
  const maxLen = Math.max(userWord.length, productWord.length);
  const minLen = Math.min(userWord.length, productWord.length);
  if (minLen <= 3 && maxLen > minLen + 2) return false;
  const distance = levenshteinDistance(userWord, productWord);
  const maxDistance = Math.max(Math.min(Math.floor(maxLen * 0.4), 3), maxLen >= 5 ? 2 : 1);
  return distance > 0 && distance <= maxDistance;
};

const getWords = (text) => text.split(/\s+/).filter(Boolean);

/**
 * Detecta productos mencionados en un texto.
 * 
 * REGLA: Productos de 3 letras o menos (ej: ON) usan coincidencia EXACTA de palabra.
 * Productos más largos usan includes() normal.
 */
const extractProductMatches = (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return [];

  const userWords = getWords(normalized);
  const matchedProducts = new Set();

  for (const product of CHAT_RULE_PATTERNS.products) {
    const productWords = getWords(product);
    const isShortProduct = productWords.some(w => w.length <= 3);

    if (isShortProduct) {
      // Productos cortos (≤3 letras): coincidencia EXACTA de palabra
      for (const productWord of productWords) {
        if (userWords.includes(productWord)) {
          matchedProducts.add(product);
          break;
        }
      }
    } else {
      // Productos largos: includes() normal
      if (normalized.includes(product)) {
        matchedProducts.add(product);
      }
    }
  }

  // Si no se encontró con includes, intentar fuzzy match (solo para productos largos)
  if (matchedProducts.size === 0) {
    for (const product of CHAT_RULE_PATTERNS.products) {
      const productWords = getWords(product);
      const isShortProduct = productWords.some(w => w.length <= 3);
      if (isShortProduct) continue; // Ya se manejó arriba con exact match

      for (const userWord of userWords) {
        if (userWord.length <= 2) continue;
        if (['que', 'para', 'como', 'con', 'por', 'del', 'las', 'los', 'una', 'uno'].includes(userWord)) continue;
        for (const productWord of productWords) {
          if (isFuzzyMatch(userWord, productWord)) {
            matchedProducts.add(product);
            break;
          }
        }
        if (matchedProducts.has(product)) break;
      }
    }
  }

  return Array.from(matchedProducts);
};

const countQuestions = (messages) =>
  messages.filter((msg) => msg.role === 'user' && CHAT_RULE_PATTERNS.questionWords.test(msg.content)).length;

/**
 * Calcula el tiempo REAL de conversación activa.
 * NO usa la edad total de la sesión.
 * Calcula: última interacción - primera interacción activa.
 */
const calculateActiveDuration = (messages) => {
  const userMessages = messages.filter((msg) => msg.role === 'user');
  if (userMessages.length < 2) return 0;

  // Buscar timestamps si existen en los mensajes
  const timestamps = userMessages
    .map((msg) => msg.timestamp || msg.created_at || null)
    .filter(Boolean)
    .map((t) => new Date(t).getTime())
    .filter((t) => !Number.isNaN(t));

  if (timestamps.length >= 2) {
    const first = Math.min(...timestamps);
    const last = Math.max(...timestamps);
    return Math.max(0, Math.round((last - first) / 60000));
  }

  // Sin timestamps, estimar basado en cantidad de mensajes de usuario
  // (cada mensaje ~1 minuto de diferencia como estimación conservadora)
  return Math.max(0, userMessages.length - 1);
};

/**
 * Calcula el BUY_INTENT_SCORE basado en señales comerciales reales.
 * NO considera: tiempo largo, saludos, curiosidad general.
 * 
 * REGLA CRÍTICA: Para alcanzar score >= 70 (LEAD CALIENTE) se requiere
 * una COMBINACIÓN de señales. El tiempo de conversación por sí solo
 * NUNCA dispara cliente caliente.
 */
const calculateBuyIntentScore = (messages, productNames) => {
  let score = 0;
  const detectedSignals = [];

  const userMessages = messages.filter((msg) => msg.role === 'user');

  for (const message of userMessages) {
    const content = String(message.content || '');

    // Señales fuertes (+40)
    if (BUY_INTENT_STRONG.buyPhrases.test(content)) {
      score += BUY_INTENT_STRONG.score;
      detectedSignals.push('quiere comprar');
    }

    // Señales fuertes (+30) - precio
    if (BUY_INTENT_PRICE.priceQuestion.test(content)) {
      score += BUY_INTENT_PRICE.score;
      detectedSignals.push('pregunta precio');
    }

    // Señales fuertes (+30) - logística
    if (BUY_INTENT_LOGISTICS.logisticsQuestion.test(content)) {
      score += BUY_INTENT_LOGISTICS.score;
      detectedSignals.push('consulta despacho');
    }

    // Señales fuertes (+25) - problema específico
    if (BUY_INTENT_SPECIFIC_PROBLEM.specificProblem.test(content)) {
      score += BUY_INTENT_SPECIFIC_PROBLEM.score;
      detectedSignals.push('problema específico');
    }

    // Señales medias (+10)
    if (BUY_INTENT_MEDIUM.benefits.test(content)) {
      score += BUY_INTENT_MEDIUM.score;
      detectedSignals.push('pregunta beneficios');
    }
    if (BUY_INTENT_MEDIUM.ingredients.test(content)) {
      score += BUY_INTENT_MEDIUM.score;
      detectedSignals.push('pregunta ingredientes');
    }
    if (BUY_INTENT_MEDIUM.comparison.test(content)) {
      score += BUY_INTENT_MEDIUM.score;
      detectedSignals.push('compara productos');
    }
  }

  // Señal fuerte (+20) - producto repetido en múltiples mensajes
  const repeatedProducts = productNames.filter((item, index, array) => array.indexOf(item) !== index);
  if (repeatedProducts.length > 0) {
    score += BUY_INTENT_REPEATED_PRODUCT.score;
    detectedSignals.push('consulta repetida del mismo producto');
  }

  // ===================================================================
  // VALIDACIÓN: No permitir score >= 70 solo con señales débiles
  // Para alcanzar LEAD CALIENTE (>= 70) se requiere al menos UNA
  // señal fuerte (comprar, precio, despacho, problema específico)
  // combinada con señales medias o producto repetido.
  // ===================================================================
  const hasStrongSignal = detectedSignals.some(signal =>
    ['quiere comprar', 'pregunta precio', 'consulta despacho', 'problema específico'].includes(signal)
  );

  // Si no hay ninguna señal fuerte, el score máximo es 69 (interested, no hot)
  if (!hasStrongSignal && score >= 70) {
    score = 69;
  }

  // Si solo hay señales medias (beneficios, ingredientes, comparación)
  // sin producto repetido, el score máximo es 30 (curioso)
  const onlyMediumSignals = detectedSignals.every(signal =>
    ['pregunta beneficios', 'pregunta ingredientes', 'compara productos'].includes(signal)
  );
  if (onlyMediumSignals && score > 30) {
    score = 30;
  }

  return { score, detectedSignals: Array.from(new Set(detectedSignals)) };
};

/**
 * Detecta si hay intención de negocio (oportunidad FuXion).
 * NO se mezcla con compra de producto.
 * 
 * REGLA CRÍTICA: Si BUSINESS_OPPORTUNITY es detectado:
 * - NO se marca como PRODUCT_INTEREST
 * - NO se marca como CLIENTE_COMPRA
 * - NO se marca como PRODUCT_SCORE
 * - Usa flujo independiente de alerta Telegram
 */
const detectBusinessIntent = (messages) => {
  const userMessages = messages.filter((msg) => msg.role === 'user');
  for (const message of userMessages) {
    if (BUSINESS_INTENT_PATTERNS.test(message.content)) {
      return true;
    }
  }
  return false;
};

/**
 * Detecta si el usuario solicita explícitamente un asesor humano
 * o quiere ver el video explicativo de oportunidad.
 */
const detectHumanRequest = (text = '') => {
  if (!text) return false;
  return /\b(asesor|humano|quiero hablar con alguien|hablar con un asesor|contactar con un asesor|asesor humano|persona real|atenci[oó]n personalizada)\b/i.test(text);
};

/**
 * Detecta si el usuario pide explicación o más información
 * (para ofrecer video de oportunidad).
 */
const detectExplanationRequest = (text = '') => {
  if (!text) return false;
  return /\b(c[oó]mo funciona|expl[ií]came|quiero saber m[aá]s|cu[eé]ntame m[aá]s|dime m[aá]s|quiero entender|en qu[eé] consiste)\b/i.test(text);
};

/**
 * Determina el nivel de intención según el score.
 * REGLA TELEGRAM FASE FINAL 4:
 *   nivel_1_curioso (0-30):     NO enviar Telegram, guardar memoria
 *   nivel_2_interesado (31-60): guardar seguimiento, no alertar salvo repetición fuerte
 *   nivel_3_posible_compra (61-80): enviar Telegram
 *   nivel_4_cliente_caliente (81-100): Telegram inmediato
 */
const getIntentLevel = (score) => {
  if (score >= INTENT_LEVELS.hotClient.min) return INTENT_LEVELS.hotClient;
  if (score >= INTENT_LEVELS.possiblePurchase.min) return INTENT_LEVELS.possiblePurchase;
  if (score >= INTENT_LEVELS.interested.min) return INTENT_LEVELS.interested;
  return INTENT_LEVELS.curious;
};


/**
 * Construye un resumen ENRIQUECIDO de la conversación para Telegram.
 * En lugar de frases genéricas, genera un análisis con:
 * - Producto real detectado
 * - Intención detectada (compra, información, comparación)
 * - Señales encontradas
 * - Posible necesidad del cliente
 */
export const buildEventSummary = ({ sessionId, events, productNames, score, messages, durationMinutes, advisorDeclined, detectedSignals, lastMessage, isBusinessIntent }) => {
  const uniqueProducts = Array.from(new Set(productNames)).join(', ') || 'Sin producto específico';
  const questions = countQuestions(messages);
  const summaryParts = [];

  // ===================================================================
  // 1. Intención principal
  // ===================================================================
  if (isBusinessIntent) {
    summaryParts.push('🎯 Interés en oportunidad de negocio FuXion');
  } else if (score >= 70) {
    summaryParts.push('🔥 Alta intención de compra - contactar urgente');
  } else if (score >= 40) {
    summaryParts.push('💡 Interés comercial detectado - seguimiento recomendado');
  }

  // ===================================================================
  // 2. Producto específico (si se detectó)
  // ===================================================================
  if (uniqueProducts && uniqueProducts !== 'Sin producto específico') {
    summaryParts.push(`📦 Producto: ${uniqueProducts}`);
  }

  // ===================================================================
  // 3. Señales comerciales detectadas (mapeo a lenguaje humano)
  // ===================================================================
  if (detectedSignals && detectedSignals.length > 0) {
    const signalMap = {
      'quiere comprar': 'Quiere comprar',
      'pregunta precio': 'Preguntó por precio',
      'consulta despacho': 'Consultó por despacho/envío',
      'problema específico': 'Tiene un problema/necesidad específica',
      'pregunta beneficios': 'Preguntó por beneficios',
      'pregunta ingredientes': 'Preguntó por ingredientes',
      'compara productos': 'Está comparando productos',
      'consulta repetida del mismo producto': 'Vuelve al mismo producto (insistencia)'
    };
    const humanSignals = detectedSignals
      .map(s => signalMap[s] || s)
      .filter(Boolean);
    if (humanSignals.length > 0) {
      summaryParts.push(`🔍 Señales: ${humanSignals.join(' | ')}`);
    }
  }

  // ===================================================================
  // 4. Posible necesidad del cliente (inferida de las señales)
  // ===================================================================
  if (detectedSignals && detectedSignals.length > 0) {
    if (detectedSignals.includes('quiere comprar')) {
      summaryParts.push('💬 Necesidad: Quiere adquirir el producto, requiere asistencia en compra');
    } else if (detectedSignals.includes('pregunta precio')) {
      summaryParts.push('💬 Necesidad: Evaluando costo, posible compra si el precio es adecuado');
    } else if (detectedSignals.includes('problema específico')) {
      summaryParts.push('💬 Necesidad: Busca solución a un problema de salud/bienestar específico');
    } else if (detectedSignals.includes('consulta despacho')) {
      summaryParts.push('💬 Necesidad: Interesado en recibir el producto, consulta logística');
    } else if (detectedSignals.includes('compara productos')) {
      summaryParts.push('💬 Necesidad: Está decidiendo entre opciones, necesita orientación');
    } else if (detectedSignals.includes('pregunta beneficios') || detectedSignals.includes('pregunta ingredientes')) {
      summaryParts.push('💬 Necesidad: En etapa de investigación, busca información detallada');
    }
  }

  // ===================================================================
  // 5. Eventos especiales
  // ===================================================================
  if (events) {
    if (events.includes('MEDICAL_WARNING')) summaryParts.push('⚠️ Mencionó síntomas de alarma médica');
    if (events.includes('ADVISOR_DECLINED')) summaryParts.push('🚫 Rechazó oferta de asesor humano');
  }

  // ===================================================================
  // 6. Métricas de conversación
  // ===================================================================
  if (durationMinutes > 0) {
    summaryParts.push(`⏱ Duración: ${durationMinutes} min activa`);
  }
  if (questions > 0) {
    summaryParts.push(`❓ ${questions} preguntas realizadas`);
  }

  return {
    session: sessionId,
    product: uniqueProducts,
    score,
    minutes: durationMinutes,
    questions,
    advisor_declined: advisorDeclined ? 'Sí' : 'No',
    summary: summaryParts.length > 0 ? summaryParts.join(' · ') : 'Ningún evento relevante detectado',
    datetime: new Date().toLocaleString('es-CL'),
    lastMessage: lastMessage || '',
    isBusinessIntent: Boolean(isBusinessIntent)
  };
};

export const buildTelegramMessage = (payload) => {
  // Seleccionar template según nivel de intención
  let template;
  if (payload.isBusinessIntent) {
    template = TELEGRAM_BUSINESS_TEMPLATE;
  } else if (payload.score >= 70) {
    template = TELEGRAM_BUYING_TEMPLATE;
  } else {
    template = TELEGRAM_INTERESTED_TEMPLATE;
  }

  let message = template;
  message = message.replaceAll('{nombre}', payload.session || 'Visitante anónimo');
  message = message.replaceAll('{product}', payload.product);
  message = message.replaceAll('{score}', String(payload.score));
  message = message.replaceAll('{minutes}', String(payload.minutes));
  message = message.replaceAll('{questions}', String(payload.questions));
  message = message.replaceAll('{summary}', payload.summary);
  message = message.replaceAll('{lastMessage}', payload.lastMessage);
  message = message.replaceAll('{datetime}', payload.datetime);

  return message;
};


export const evaluateChatEvents = ({ conversation, startedAt, sessionId, response, cacheHit = false, provider = null, latencyMs = 0 }) => {
  const normalizedMessages = conversation.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: String(msg.content || msg.text || ''),
    timestamp: msg.timestamp || msg.created_at || null
  }));

  const productNames = [];
  const advisorDeclined = normalizedMessages.some((message) => CHAT_RULE_PATTERNS.advisorDecline.test(message.content));

  // Detectar productos mencionados
  normalizedMessages.forEach((message) => {
    if (message.role !== 'user') return;
    const matches = extractProductMatches(message.content);
    productNames.push(...matches);
  });

  // Detectar eventos médicos
  const events = [];
  normalizedMessages.forEach((message) => {
    if (message.role !== 'user') return;
    if (CHAT_RULE_PATTERNS.medicalWarning.test(message.content)) {
      events.push('MEDICAL_WARNING');
    }
    if (CHAT_RULE_PATTERNS.advisorDecline.test(message.content)) {
      events.push('ADVISOR_DECLINED');
    }
  });

  // ===================================================================
  // NUEVO SISTEMA DE SCORING: BUY_INTENT_SCORE
  // ===================================================================

  // 1. Detectar intención de negocio (SEPARADO de compra)
  const isBusinessIntent = detectBusinessIntent(normalizedMessages);

  // 2. Calcular BUY_INTENT_SCORE (solo si NO es intención de negocio)
  const { score: buyIntentScore, detectedSignals } = isBusinessIntent
    ? { score: 0, detectedSignals: [] }
    : calculateBuyIntentScore(normalizedMessages, productNames);

  // 3. Calcular duración activa real
  const durationMinutes = calculateActiveDuration(normalizedMessages);

  // 4. Obtener último mensaje del usuario
  const userMessages = normalizedMessages.filter((msg) => msg.role === 'user');
  const lastMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';

  // 5. Determinar nivel de intención
  const intentLevel = getIntentLevel(buyIntentScore);

  // 6. Decidir si notificar por Telegram
  const shouldNotify = isBusinessIntent || intentLevel.notify;

  const questionCount = countQuestions(normalizedMessages);

  return {
    score: buyIntentScore,
    events: Array.from(new Set(events)),
    productNames,
    durationMinutes,
    advisorDeclined,
    questionCount,
    sessionId: sessionId || `session-${Date.now()}`,
    shouldNotify,
    normalizedMessages,
    cacheHit: Boolean(cacheHit),
    provider: provider || response?.apiUsed || response?.provider || 'unknown',
    latencyMs: Number(latencyMs || 0),
    responseSummary: response?.text ? String(response.text).slice(0, 500) : null,
    startedAt,
    detectedSignals,
    lastMessage,
    isBusinessIntent,
    intentLevel: intentLevel.label
  };
};

export const processChatConversation = async ({ conversation, startedAt, sessionId, response, cacheHit = false, provider = null, latencyMs = 0 }) => {
  const evaluation = evaluateChatEvents({ conversation, startedAt, sessionId, response, cacheHit, provider, latencyMs });

  debugLog('event_created', evaluation.events);
  debugLog('score_generated', evaluation.score);
  debugLog('intent_level', evaluation.intentLevel);
  debugLog('is_business_intent', evaluation.isBusinessIntent);

  if (!evaluation.shouldNotify) {
    return evaluation;
  }

  // ===================================================================
  // LEAD INTELLIGENCE ENGINE (Phase 2)
  // Construye perfil CRM enriquecido y aplica cooldown
  // ===================================================================
  const leadProfile = createLeadProfile({
    sessionId: evaluation.sessionId,
    userName: evaluation.userName || 'Visitante anónimo',
    userEmail: evaluation.userEmail || null,
    messages: evaluation.normalizedMessages,
    productNames: evaluation.productNames,
    durationMinutes: evaluation.durationMinutes,
    score: evaluation.score,
    detectedSignals: evaluation.detectedSignals,
    lastMessage: evaluation.lastMessage,
    isBusinessIntent: evaluation.isBusinessIntent
  });

  // Verificar cooldown antes de enviar
  const cooldownState = {
    score: evaluation.score,
    etapaId: leadProfile.etapa.id,
    isBusinessIntent: evaluation.isBusinessIntent,
    productPrincipal: leadProfile.productoPrincipal
  };

  const cooldownResult = checkCooldown(evaluation.sessionId, cooldownState);

  if (cooldownResult.permitido) {
    // Construir mensaje V2 enriquecido
    const message = buildTelegramMessageV2(leadProfile);
    const sent = await sendTelegramNotification({ text: message });

    // Registrar notificación enviada
    registerNotification(evaluation.sessionId, cooldownState);

    evaluation.telegramSent = sent;
    evaluation.telegramError = sent ? null : 'telegram_failed';
    evaluation.leadProfile = leadProfile;
    evaluation.cooldownInfo = cooldownResult;

    debugLog('telegram_v2_sent', sent);
    debugLog('lead_profile', leadProfile);
    if (!sent) {
      console.warn('[chatEvents] telegram_v2_failed');
    }
  } else {
    // Cooldown activo - no enviar Telegram pero registrar
    debugLog('telegram_cooldown', cooldownResult.razon);
    evaluation.telegramSent = false;
    evaluation.telegramError = 'cooldown_active';
    evaluation.cooldownInfo = cooldownResult;
    evaluation.leadProfile = leadProfile;

    // Fallback: si cooldown no permite pero shouldNotify es true,
    // enviar con formato antiguo como respaldo (solo si es primera vez)
    const payload = buildEventSummary({
      sessionId: evaluation.sessionId,
      events: evaluation.events,
      productNames: evaluation.productNames,
      score: evaluation.score,
      messages: evaluation.normalizedMessages,
      durationMinutes: evaluation.durationMinutes,
      advisorDeclined: evaluation.advisorDeclined,
      detectedSignals: evaluation.detectedSignals,
      lastMessage: evaluation.lastMessage,
      isBusinessIntent: evaluation.isBusinessIntent
    });

    const fallbackMessage = buildTelegramMessage(payload);
    const sent = await sendTelegramNotification({ text: fallbackMessage });

    evaluation.telegramSent = sent;
    evaluation.telegramError = sent ? null : 'telegram_failed';
    evaluation.leadProfile = leadProfile;
    evaluation.cooldownInfo = cooldownResult;

    debugLog('telegram_fallback_sent', sent);
    if (!sent) {
      console.warn('[chatEvents] telegram_fallback_failed');
    }
  }

  return evaluation;
};
