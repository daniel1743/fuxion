/**
 * Product Recommendation Engine (PRE)
 *
 * Motor de Recomendación Gobernado por Reglas de Negocio.
 *
 * El PRE es el ÚNICO responsable de:
 * - Elegir el producto principal
 * - Elegir productos complementarios
 * - Evitar productos incorrectos
 * - Establecer prioridades
 * - Impedir recomendaciones inconsistentes
 *
 * La IA NUNCA debe elegir el producto principal.
 * La IA solo recibe: recommendedProduct, secondaryProducts,
 * complementaryProducts, reason, businessRules.
 *
 * Flujo:
 * 1. Recibir el mensaje del usuario
 * 2. Evaluar reglas de negocio (recommendationRules)
 * 3. Validar la recomendación (recommendationValidator)
 * 4. Si es inválida, recalcular
 * 5. Devolver la recomendación final
 */

import { getBestRecommendation, getMatchedRules } from './recommendationRules.js';
import { validateRecommendation, generateValidationReport } from './recommendationValidator.js';
import { getProductSpecialty, getProductNotes } from './productPriority.js';

// ===================================================================
// MOTOR DE RECOMENDACIÓN
// ===================================================================

/**
 * Genera una recomendación de producto basada en reglas de negocio.
 * Esta es la función principal del PRE.
 *
 * @param {string} userMessage - El mensaje del usuario
 * @param {Array} conversationHistory - Historial de la conversación
 * @returns {Object|null} La recomendación o null si no aplica
 */
export const generateRecommendation = (userMessage, conversationHistory = []) => {
  if (!userMessage) return null;

  // 1. Evaluar reglas de negocio contra el mensaje actual
  let recommendation = getBestRecommendation(userMessage);

  // 2. Si no hay reglas que apliquen, evaluar contra el historial
  if (!recommendation && conversationHistory.length > 0) {
    const lastMessages = conversationHistory.slice(-3).map(m => m.text || m.content || '').join(' ');
    recommendation = getBestRecommendation(lastMessages);
  }

  // 3. Si sigue sin haber recomendación, retornar null
  if (!recommendation) {
    return null;
  }

  // 4. Validar la recomendación
  const validation = validateRecommendation(recommendation, userMessage);

  if (!validation.valido) {
    console.warn('⚠️ [PRE] Recomendación inválida, recalculando...');
    console.warn(generateValidationReport(recommendation, userMessage));

    // Recalcular: buscar la siguiente mejor regla
    const allRules = getMatchedRules(userMessage);
    for (const rule of allRules.slice(1)) { // saltar la primera (ya falló)
      const altRecommendation = rule.accion;
      const altValidation = validateRecommendation(altRecommendation, userMessage);
      if (altValidation.valido) {
        console.log(`✅ [PRE] Recomendación alternativa encontrada: ${altRecommendation.productoPrincipal}`);
        return altRecommendation;
      }
    }

    // Si no hay alternativa válida, retornar la original con advertencia
    console.warn('⚠️ [PRE] No se encontró alternativa válida. Usando recomendación original con advertencias.');
  }

  return recommendation;
};

/**
 * Genera el contexto de recomendación para inyectar en el prompt de la IA.
 * La IA SOLO recibe esta información, NO decide el producto.
 *
 * @param {Object} recommendation - La recomendación del PRE
 * @returns {string} Contexto formateado para el prompt
 */
export const buildRecommendationContext = (recommendation) => {
  if (!recommendation) return '';

  const { productoPrincipal, productosSecundarios = [], productosComplementarios = [], productosAEVitar = [] } = recommendation;
  const notes = getProductNotes(productoPrincipal);
  const specialties = getProductSpecialty(productoPrincipal);

  const lines = [
    '=== RECOMENDACION DEL SISTEMA (NO MODIFICAR) ===',
    '',
    `Producto Principal: ${productoPrincipal}`,
    `Especialidad: ${specialties.join(', ')}`,
    `Nota: ${notes}`,
    '',
  ];

  if (productosSecundarios.length > 0) {
    lines.push(`Productos Secundarios: ${productosSecundarios.join(', ')}`);
  }

  if (productosComplementarios.length > 0) {
    lines.push(`Productos Complementarios: ${productosComplementarios.join(', ')}`);
  }

  if (productosAEVitar.length > 0) {
    lines.push(`Productos a EVITAR en esta recomendacion: ${productosAEVitar.join(', ')}`);
  }

  lines.push('');
  lines.push('INSTRUCCION: El producto principal ya fue seleccionado por el sistema.');
  lines.push('Tu tarea es SOLO explicar este producto, sus beneficios y responder preguntas.');
  lines.push('NO puedes cambiar el producto principal ni recomendar otro en su lugar.');
  lines.push('Si el usuario pregunta por otro producto, puedes mencionarlo como alternativa');
  lines.push('pero siempre manteniendo el producto principal como la recomendacion principal.');
  lines.push('=== FIN RECOMENDACION DEL SISTEMA ===');

  return lines.join('\n');
};

/**
 * Genera un resumen de las reglas de negocio que aplicaron
 */
export const buildBusinessRulesContext = (userMessage) => {
  const matchedRules = getMatchedRules(userMessage);

  if (matchedRules.length === 0) return '';

  const lines = [
    '=== REGLAS DE NEGOCIO APLICADAS ===',
    ...matchedRules.map((rule, i) =>
      `${i + 1}. ${rule.razon}`
    ),
    '=== FIN REGLAS DE NEGOCIO ==='
  ];

  return lines.join('\n');
};

/**
 * Función principal del PRE.
 * Orquesta: evaluar reglas → validar → generar contexto
 */
export const processRecommendation = (userMessage, conversationHistory = []) => {
  const startTime = Date.now();

  // 1. Generar recomendación
  const recommendation = generateRecommendation(userMessage, conversationHistory);

  // 2. Si no hay recomendación, retornar null
  if (!recommendation) {
    console.log('[PRE] No se encontró recomendación para este mensaje');
    return null;
  }

  // 3. Construir contexto para la IA
  const recommendationContext = buildRecommendationContext(recommendation);
  const businessRulesContext = buildBusinessRulesContext(userMessage);

  // 4. Log de depuración
  const elapsed = Date.now() - startTime;
  console.log(`✅ [PRE] Recomendación: ${recommendation.productoPrincipal} (${elapsed}ms)`);

  return {
    recommendation,
    recommendationContext,
    businessRulesContext,
    productoPrincipal: recommendation.productoPrincipal,
    productosSecundarios: recommendation.productosSecundarios || [],
    productosComplementarios: recommendation.productosComplementarios || [],
    productosAEVitar: recommendation.productosAEVitar || []
  };
};

export default {
  generateRecommendation,
  buildRecommendationContext,
  buildBusinessRulesContext,
  processRecommendation
};
