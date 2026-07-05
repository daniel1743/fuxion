/**
 * Servicio de Chat para Fuxion Assistant
 *
 * MODO AHORRADOR: El frontend SOLO envía el mensaje del usuario al backend.
 * Toda la lógica de detección de productos, construcción de contexto y
 * llamadas a APIs de IA se maneja en el backend (api/chat.js).
 *
 * Esto reduce el tamaño del prompt, evita cargar JSON en el frontend,
 * y centraliza la lógica en el servidor.
 */

const BACKEND_API_URL = '/api/chat';
const SESSION_STORAGE_KEY = 'fuxion_chat_session_id';
const STARTED_AT_STORAGE_KEY = 'fuxion_chat_started_at';

const getStoredSessionId = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(SESSION_STORAGE_KEY);
};

const getStoredStartedAt = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STARTED_AT_STORAGE_KEY);
};

const saveSessionMetadata = ({ sessionId, startedAt }) => {
  if (typeof window === 'undefined') return;
  if (sessionId) window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  if (startedAt) window.localStorage.setItem(STARTED_AT_STORAGE_KEY, startedAt);
};

const ensureSessionMetadata = () => {
  const currentSessionId = getStoredSessionId();
  const currentStartedAt = getStoredStartedAt();
  const sessionId = currentSessionId || `session-${Date.now()}`;
  const startedAt = currentStartedAt || new Date().toISOString();
  saveSessionMetadata({ sessionId, startedAt });
  return { sessionId, startedAt };
};

const cleanBotResponse = (text = '') => {
  return String(text)
    // Eliminar **negritas**
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Eliminar __subrayado__
    .replace(/__(.*?)__/g, '$1')
    // Eliminar *cursivas* (sin confundir con asteriscos de listas)
    .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '$1')
    // Eliminar ~~tachado~~
    .replace(/~~(.*?)~~/g, '$1')
    // Eliminar # títulos
    .replace(/^#{1,6}\s*/gm, '')
    // Eliminar bloques de código (```...```)
    .replace(/```[\s\S]*?```/g, '')
    // Eliminar `código inline`
    .replace(/`([^`]+)`/g, '$1')
    // Eliminar listas Markdown (- o * al inicio de línea)
    .replace(/^\s*[-*]\s+/gm, '')
    // Eliminar listas numeradas Markdown (1. 2. etc)
    .replace(/^\s*\d+\.\s+/gm, '')
    // Eliminar tablas Markdown (líneas con |)
    .replace(/^.*\|.*$/gm, '')
    // Eliminar líneas de separación (---, ***, ___)
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Eliminar comillas decorativas (>)
    .replace(/^>\s*/gm, '')
    // Eliminar espacios duplicados
    .replace(/[ \t]+/g, ' ')
    // Eliminar saltos de línea excesivos (más de 2 seguidos)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

/**
 * Envía un mensaje al backend de chat.
 * El backend se encarga de:
 * 1. Detectar el producto mencionado (con fuzzy matching)
 * 2. Buscar los detalles del producto en la base de datos
 * 3. Construir el contexto mínimo para la IA
 * 4. Llamar a la API de IA (DeepSeek > Qwen > Gemini)
 * 5. Cachear la respuesta en Supabase
 * 6. Registrar eventos de la conversación
 */
export const sendMessageToDeepSeek = async (userMessage, botType = 'ventas', conversationHistory = []) => {
  try {
    const sessionData = ensureSessionMetadata();

    // El frontend SOLO envía el mensaje y el historial
    // El backend construye el prompt con contexto de producto
    const messages = [
      { role: 'user', content: userMessage }
    ];

    // Incluir historial para contexto conversacional
    const historyMessages = (conversationHistory || []).slice(-10).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: String(msg.text || msg.content || '')
    }));

    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...historyMessages, ...messages],
        preferredProvider: 'deepseek',
        sessionId: sessionData.sessionId,
        startedAt: sessionData.startedAt
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData?.text) {
        const cleanedText = cleanBotResponse(errorData.text);
        return {
          text: cleanedText,
          usage: errorData.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
          model: errorData.model || 'fallback',
          apiUsed: errorData.apiUsed || 'fallback',
          showWhatsApp: errorData.showWhatsApp === true,
          advisorReason: errorData.advisorReason || null,
          healthRisk: errorData.healthRisk || null,
          purchaseIntent: errorData.purchaseIntent || null,
          conversationStage: errorData.conversationStage || null,
          advisorRecommendation: errorData.advisorRecommendation || null
        };
      }
      const details = Array.isArray(errorData.details)
        ? ` ${errorData.details.map(detail => `${detail.api}: ${detail.error}`).join(' | ')}`
        : '';
      throw new Error(`${errorData.error || `Error del servidor: ${response.status}`}${details}`);
    }

    const data = await response.json();
    const cleanedText = cleanBotResponse(data.text);

    return {
      text: cleanedText,
      usage: data.usage,
      model: data.model,
      apiUsed: data.apiUsed,
      // Response Contract: el backend decide cuándo mostrar WhatsApp
      showWhatsApp: data.showWhatsApp === true,
      advisorReason: data.advisorReason || null,
      healthRisk: data.healthRisk || null,
      purchaseIntent: data.purchaseIntent || null,
      conversationStage: data.conversationStage || null,
      advisorRecommendation: data.advisorRecommendation || null
    };

  } catch (error) {
    console.error('❌ Error al comunicarse con el backend:', error);
    throw new Error(error.message || 'Error al procesar tu mensaje. Por favor, intenta de nuevo.');
  }
};

export const getProductRecommendations = async (userQuery) => {
  try {
    const response = await sendMessageToDeepSeek(userQuery, 'asesor');
    return response.text;
  } catch (error) {
    return 'No pude generar recomendaciones en este momento. Por favor, intenta de nuevo.';
  }
};

export const answerProductQuestion = async (question) => {
  try {
    const response = await sendMessageToDeepSeek(question, 'soporte');
    return response.text;
  } catch (error) {
    return 'No pude procesar tu pregunta sobre productos Fuxion. Por favor, intenta de nuevo.';
  }
};

export default {
  sendMessageToDeepSeek,
  getProductRecommendations,
  answerProductQuestion
};
