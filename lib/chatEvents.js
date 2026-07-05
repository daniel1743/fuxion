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
  TELEGRAM_MESSAGE_TEMPLATE,
  TELEGRAM_BUSINESS_TEMPLATE
} from '../config/chatAlertRules.js';
import { sendTelegramNotification } from './telegramNotifier.js';

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
 */
const extractProductMatches = (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return [];

  const userWords = getWords(normalized);
  const matchedProducts = new Set();

  for (const product of CHAT_RULE_PATTERNS.products) {
    if (normalized.includes(product)) {
      matchedProducts.add(product);
    }
  }

  if (matchedProducts.size === 0) {
    for (const product of CHAT_RULE_PATTERNS.products) {
      const productWords = getWords(product);
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

  return { score, detectedSignals: Array.from(new Set(detectedSignals)) };
};

/**
 * Detecta si hay intención de negocio (oportunidad FuXion).
 * NO se mezcla con compra de producto.
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
 * Determina el nivel de intención según el score.
 */
const getIntentLevel = (score) => {
  if (score >= INTENT_LEVELS.hot.min) return INTENT_LEVELS.hot;
  if (score >= INTENT_LEVELS.interested.min) return INTENT_LEVELS.interested;
  return INTENT_LEVELS.curious;
};

export const buildEventSummary = ({ sessionId, events, productNames, score, messages, durationMinutes, advisorDeclined, detectedSignals, lastMessage, isBusinessIntent }) => {
  const uniqueProducts = Array.from(new Set(productNames)).join(', ') || 'Sin producto específico';
  const questions = countQuestions(messages);
  const summaryParts = [];

  if (isBusinessIntent) {
    summaryParts.push('interés en oportunidad de negocio');
  }

  if (detectedSignals && detectedSignals.length > 0) {
    summaryParts.push(...detectedSignals);
  }

  if (events) {
    if (events.includes('MEDICAL_WARNING')) summaryParts.push('síntomas de alarma');
    if (events.includes('ADVISOR_DECLINED')) summaryParts.push('rechazó asesor');
  }

  return {
    session: sessionId,
    product: uniqueProducts,
    score,
    minutes: durationMinutes,
    questions,
    advisor_declined: advisorDeclined ? 'Sí' : 'No',
    summary: summaryParts.length > 0 ? summaryParts.join(', ') : 'Ningún evento relevante detectado',
    datetime: new Date().toLocaleString('es-CL'),
    lastMessage: lastMessage || '',
    isBusinessIntent: Boolean(isBusinessIntent)
  };
};

export const buildTelegramMessage = (payload) => {
  const template = payload.isBusinessIntent ? TELEGRAM_BUSINESS_TEMPLATE : TELEGRAM_MESSAGE_TEMPLATE;
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

  console.log('event_created', evaluation.events);
  console.log('score_generated', evaluation.score);
  console.log('intent_level', evaluation.intentLevel);
  console.log('is_business_intent', evaluation.isBusinessIntent);

  if (!evaluation.shouldNotify) {
    return evaluation;
  }

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

  const message = buildTelegramMessage(payload);
  const sent = await sendTelegramNotification({ text: message });

  evaluation.telegramSent = sent;
  evaluation.telegramError = sent ? null : 'telegram_failed';

  console.log('telegram_sent', sent);
  if (!sent) {
    console.log('telegram_failed');
  }

  return evaluation;
};
