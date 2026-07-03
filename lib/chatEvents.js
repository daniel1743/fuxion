import { CHAT_RULE_PATTERNS, CHAT_EVENT_SCORES, NOTIFICATION_RULES, TELEGRAM_MESSAGE_TEMPLATE } from '../config/chatAlertRules.js';
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
 * Usa un umbral de similitud relativo (porcentaje) para evitar falsos positivos.
 */
const isFuzzyMatch = (userWord, productWord) => {
  if (!userWord || !productWord) return false;

  // Match exacto: una palabra contiene completamente a la otra
  if (productWord.includes(userWord) || userWord.includes(productWord)) {
    // Evitar falso positivo cuando una palabra corta (<=3) está contenida
    // dentro de una palabra más larga del usuario
    // Ej: "on" dentro de "pronex" NO debe coincidir
    if (productWord.length <= 3 && userWord.length > productWord.length + 2) {
      return false;
    }
    return true;
  }

  // Fuzzy matching con umbral relativo (40% de la longitud de la palabra más larga)
  // pero mínimo 2 para palabras medianas y máximo 3 para palabras largas
  const maxLen = Math.max(userWord.length, productWord.length);
  const minLen = Math.min(userWord.length, productWord.length);
  if (minLen <= 3 && maxLen > minLen + 2) return false;
  const distance = levenshteinDistance(userWord, productWord);
  const maxDistance = Math.max(Math.min(Math.floor(maxLen * 0.4), 3), maxLen >= 5 ? 2 : 1);
  return distance > 0 && distance <= maxDistance;
};

/**
 * Extrae palabras individuales del texto normalizado.
 */
const getWords = (text) => text.split(/\s+/).filter(Boolean);

/**
 * Detecta productos mencionados en un texto, incluso si están mal escritos.
 * Usa fuzzy matching para tolerar errores tipográficos.
 */
const extractProductMatches = (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return [];

  const userWords = getWords(normalized);
  const matchedProducts = new Set();

  // 1. Match exacto del texto completo contra nombres de productos
  for (const product of CHAT_RULE_PATTERNS.products) {
    if (normalized.includes(product)) {
      matchedProducts.add(product);
    }
  }

  // 2. Si no hay match exacto, intentar fuzzy matching palabra por palabra
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

const minutesBetween = (start, end) =>
  Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000));

export const buildEventSummary = ({ sessionId, events, productNames, score, messages, durationMinutes, advisorDeclined }) => {
  const uniqueProducts = Array.from(new Set(productNames)).join(', ') || 'Sin producto específico';
  const questions = countQuestions(messages);
  const summaryParts = [];

  if (events.includes('PRODUCT_INTEREST')) summaryParts.push('interés por producto');
  if (events.includes('PRICE')) summaryParts.push('consulta de precio');
  if (events.includes('SHIPPING')) summaryParts.push('consulta de despacho');
  if (events.includes('STOCK')) summaryParts.push('consulta de stock');
  if (events.includes('BENEFITS')) summaryParts.push('pide beneficios');
  if (events.includes('INGREDIENTS')) summaryParts.push('pide ingredientes');
  if (events.includes('MULTIPLE_PRODUCT_COMPARISON')) summaryParts.push('comparación de productos');
  if (events.includes('ADVISOR_DECLINED')) summaryParts.push('rechazó asesor');
  if (events.includes('LONG_CONVERSATION')) summaryParts.push('conversación larga');
  if (events.includes('CART_INTEREST')) summaryParts.push('intención de compra');
  if (events.includes('MEDICAL_WARNING')) summaryParts.push('síntomas de alarma');
  if (events.includes('REPEATED_PRODUCT')) summaryParts.push('consulta repetida del mismo producto');

  return {
    session: sessionId,
    product: uniqueProducts,
    score,
    minutes: durationMinutes,
    questions,
    advisor_declined: advisorDeclined ? 'Sí' : 'No',
    summary: summaryParts.length > 0 ? summaryParts.join(', ') : 'Ningún evento relevante detectado',
    datetime: new Date().toLocaleString('es-CL')
  };
};

/**
 * Escapa caracteres especiales para Telegram MarkdownV2.
 * Se aplica SOLO a valores dinámicos para no romper la estructura del template.
 */
const escapeTelegramText = (text = '') =>
  String(text).replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');

export const buildTelegramMessage = (payload) => {
  // Escapar solo los valores dinámicos, no la estructura del template
  const safeSession = escapeTelegramText(payload.session);
  const safeProduct = escapeTelegramText(payload.product);
  const safeScore = escapeTelegramText(String(payload.score));
  const safeMinutes = escapeTelegramText(String(payload.minutes));
  const safeQuestions = escapeTelegramText(String(payload.questions));
  const safeAdvisorDeclined = escapeTelegramText(payload.advisor_declined);
  const safeSummary = escapeTelegramText(payload.summary);
  const safeDatetime = escapeTelegramText(payload.datetime);

  // Usar replaceAll para reemplazar TODAS las ocurrencias de cada placeholder
  // (por si el template tiene el mismo placeholder en múltiples líneas)
  let message = TELEGRAM_MESSAGE_TEMPLATE;
  message = message.replaceAll('{session}', safeSession);
  message = message.replaceAll('{product}', safeProduct);
  message = message.replaceAll('{score}', safeScore);
  message = message.replaceAll('{minutes}', safeMinutes);
  message = message.replaceAll('{questions}', safeQuestions);
  message = message.replaceAll('{advisor_declined}', safeAdvisorDeclined);
  message = message.replaceAll('{summary}', safeSummary);
  message = message.replaceAll('{datetime}', safeDatetime);

  return message;
};

const ruleEvaluators = {
  PRODUCT_INTEREST: (message) => extractProductMatches(message.content).length > 0,
  PRICE: (message) => CHAT_RULE_PATTERNS.price.test(message.content),
  SHIPPING: (message) => CHAT_RULE_PATTERNS.shipping.test(message.content),
  STOCK: (message) => CHAT_RULE_PATTERNS.stock.test(message.content),
  BENEFITS: (message) => CHAT_RULE_PATTERNS.benefits.test(message.content),
  INGREDIENTS: (message) => CHAT_RULE_PATTERNS.ingredients.test(message.content),
  MULTIPLE_PRODUCT_COMPARISON: (conversation) => {
    const products = conversation.flatMap((msg) => extractProductMatches(msg.content));
    return new Set(products).size >= 2;
  },
  MEDICAL_WARNING: (message) => CHAT_RULE_PATTERNS.medicalWarning.test(message.content),
  ADVISOR_DECLINED: (message) => CHAT_RULE_PATTERNS.advisorDecline.test(message.content),
  CART_INTEREST: (message) => CHAT_RULE_PATTERNS.cartInterest.test(message.content)
};

export const evaluateChatEvents = ({ conversation, startedAt, sessionId, response, cacheHit = false, provider = null, latencyMs = 0 }) => {
  const normalizedMessages = conversation.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: String(msg.content || msg.text || '')
  }));

  const scoreEvents = [];
  const productNames = [];
  const advisorDeclined = normalizedMessages.some((message) => ruleEvaluators.ADVISOR_DECLINED(message));

  normalizedMessages.forEach((message) => {
    if (message.role !== 'user') return;

    Object.entries(ruleEvaluators).forEach(([eventType, evaluator]) => {
      if (eventType === 'MULTIPLE_PRODUCT_COMPARISON') return;
      if (evaluator(message)) {
        scoreEvents.push(eventType);
        if (eventType === 'PRODUCT_INTEREST') {
          productNames.push(...extractProductMatches(message.content));
        }
      }
    });
  });

  if (ruleEvaluators.MULTIPLE_PRODUCT_COMPARISON(normalizedMessages)) scoreEvents.push('MULTIPLE_PRODUCT_COMPARISON');

  const durationMinutes = minutesBetween(startedAt, new Date());
  if (durationMinutes >= 10) scoreEvents.push('LONG_CONVERSATION');

  const repeatedProducts = productNames.filter((item, index, array) => array.indexOf(item) !== index);
  if (repeatedProducts.length > 0) scoreEvents.push('REPEATED_PRODUCT');

  const uniqueEvents = Array.from(new Set(scoreEvents));
  const score = uniqueEvents.reduce((total, eventType) => total + (CHAT_EVENT_SCORES[eventType] || 0), 0);
  const questionCount = countQuestions(normalizedMessages);

  const shouldNotify = score >= NOTIFICATION_RULES.scoreThreshold
    || uniqueEvents.some((eventType) => NOTIFICATION_RULES.alwaysNotifyEvents.includes(eventType));

  return {
    score,
    events: uniqueEvents,
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
    startedAt
  };
};

export const processChatConversation = async ({ conversation, startedAt, sessionId, response, cacheHit = false, provider = null, latencyMs = 0 }) => {
  const evaluation = evaluateChatEvents({ conversation, startedAt, sessionId, response, cacheHit, provider, latencyMs });

  console.log('event_created', evaluation.events);
  console.log('score_generated', evaluation.score);

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
    advisorDeclined: evaluation.advisorDeclined
  });

  const message = buildTelegramMessage(payload);
  const sent = await sendTelegramNotification({ text: message, parseMode: 'MarkdownV2' });

  evaluation.telegramSent = sent;
  evaluation.telegramError = sent ? null : 'telegram_failed';

  console.log('telegram_sent', sent);
  if (!sent) {
    console.log('telegram_failed');
  }

  return evaluation;
};
