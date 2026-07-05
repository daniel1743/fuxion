/**
 * Conversation Intelligence Engine (CIE)
 *
 * Motor de inteligencia conversacional que permite al asistente
 * recordar, comprender y evolucionar durante toda la sesión del usuario.
 *
 * Funciona como una capa intermedia entre buildDynamicPrompt() y la IA.
 * Mantiene un perfil dinámico del cliente que se actualiza en cada
 * interacción y se utiliza para enriquecer el prompt.
 *
 * El perfil se almacena en memoria (Map) por sessionId.
 * No persiste entre sesiones (no es necesario para el caso de uso).
 */

import {
  createEmptyProfile,
  updateProfile,
  registerProductViewed,
  registerProductRecommended,
  registerProductRejected,
  registerExplainedTopic,
  generateProfileSummary,
  generatePendingQuestions
} from './conversationProfile.js';

// ===================================================================
// ALMACENAMIENTO EN MEMORIA (por sessionId)
// ===================================================================
const sessionProfiles = new Map();

// Limpieza periódica de sesiones inactivas (cada 30 minutos)
const CLEANUP_INTERVAL = 30 * 60 * 1000;
const SESSION_TTL = 60 * 60 * 1000; // 1 hora

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, profile] of sessionProfiles.entries()) {
    if (profile._lastActivity && (now - profile._lastActivity) > SESSION_TTL) {
      sessionProfiles.delete(sessionId);
    }
  }
}, CLEANUP_INTERVAL);

// ===================================================================
// FUNCIONES PRINCIPALES DEL ENGINE
// ===================================================================

/**
 * Obtiene o crea el perfil para una sesión
 */
export const getOrCreateProfile = (sessionId) => {
  if (!sessionId) return null;
  if (!sessionProfiles.has(sessionId)) {
    const profile = createEmptyProfile();
    profile._lastActivity = Date.now();
    sessionProfiles.set(sessionId, profile);
  }
  return sessionProfiles.get(sessionId);
};

/**
 * Procesa un mensaje del usuario y actualiza el perfil
 */
export const processUserMessage = (sessionId, userMessage, detectedProducts = []) => {
  const profile = getOrCreateProfile(sessionId);
  if (!profile) return null;

  // Actualizar timestamp de actividad
  profile._lastActivity = Date.now();

  // Actualizar perfil con el mensaje del usuario
  updateProfile(profile, userMessage);

  // Registrar productos detectados como "vistos"
  if (detectedProducts.length > 0) {
    detectedProducts.forEach(product => {
      registerProductViewed(profile, product);
    });
  }

  return profile;
};

/**
 * Registra que se recomendó un producto
 */
export const markProductRecommended = (sessionId, productName) => {
  const profile = getOrCreateProfile(sessionId);
  if (!profile) return;
  registerProductRecommended(profile, productName);
};

/**
 * Registra que se explicó un tema de un producto
 */
export const markTopicExplained = (sessionId, productName, topic) => {
  const profile = getOrCreateProfile(sessionId);
  if (!profile) return;
  registerExplainedTopic(profile, productName, topic);
};

/**
 * Genera el contexto de perfil para inyectar en el prompt
 * Máximo 15 líneas para no aumentar significativamente el consumo de tokens
 */
export const generateProfileContext = (sessionId) => {
  const profile = getOrCreateProfile(sessionId);
  if (!profile) return '';

  const summary = generateProfileSummary(profile);
  const pending = generatePendingQuestions(profile);

  const lines = [];
  if (summary) lines.push(summary);
  if (pending) lines.push(pending);

  // Limitar a 15 líneas máximo
  const result = lines.join('\n');
  const resultLines = result.split('\n');
  if (resultLines.length > 15) {
    return resultLines.slice(0, 15).join('\n');
  }

  return result;
};

/**
 * Obtiene el perfil completo (para debug)
 */
export const getProfile = (sessionId) => {
  return sessionProfiles.get(sessionId) || null;
};

/**
 * Limpia el perfil de una sesión
 */
export const clearProfile = (sessionId) => {
  sessionProfiles.delete(sessionId);
};

export default {
  getOrCreateProfile,
  processUserMessage,
  markProductRecommended,
  markTopicExplained,
  generateProfileContext,
  getProfile,
  clearProfile
};
