/**
 * Conversation Reasoning Engine (CRE)
 *
 * Capa de razonamiento que se ubica encima del CIE.
 *
 * El CIE recuerda.
 * El CRE piensa.
 *
 * Responsabilidades:
 * - Comprender objetivos y priorizarlos
 * - Relacionar productos entre sí
 * - Construir planes de bienestar personalizados
 * - Detectar oportunidad de conversión
 * - Decidir qué información entregar y qué NO repetir
 * - Adaptar tono y profundidad según el perfil del usuario
 *
 * Se integra en api/chat.js entre el CIE y el Prompt Builder.
 */

import { generateProfileSummary } from '../conversationProfile.js';
import {
  generateRelationshipSummary,
  getComplementaryProducts,
  getAlternativeProducts,
  generateUsagePlan
} from './productRelationshipEngine.js';
import {
  prioritizeObjectives,
  generateWellnessPlan,
  generatePlanSummary,
  detectRelatedObjectives
} from './objectivePlanner.js';

// ===================================================================
// SEÑALES DE COMPRA
// ===================================================================
const PURCHASE_SIGNAL_LEVELS = {
  weak: ['curiosidad', 'qué es', 'ingredientes', 'beneficios', 'cómo funciona'],
  medium: ['comparación', 'modo de uso', 'resultados', 'experiencias', 'opiniones'],
  strong: ['precio', 'cuánto cuesta', 'envío', 'despacho', 'disponibilidad', 'comprar', 'WhatsApp', 'retiro', 'pago', 'transferencia']
};

// ===================================================================
// MAPA DE PERSONALIDADES
// ===================================================================
const PERSONALITY_MAP = {
  tecnico: {
    keywords: ['ingredientes', 'composición', 'mg', 'gramos', 'dosis', 'científico', 'estudio', 'investigación'],
    style: 'Técnico, detallado, basado en evidencia',
    depth: 'Alta profundidad técnica'
  },
  emocional: {
    keywords: ['siento', 'molestia', 'malestar', 'preocupado', 'ansioso', 'necesito ayuda', 'no sé qué hacer'],
    style: 'Empático, cálido, comprensivo',
    depth: 'Enfocado en contención emocional'
  },
  directo: {
    keywords: ['rápido', 'directo', 'concreto', 'específico', 'solo quiero saber', 'dime'],
    style: 'Directo, conciso, sin rodeos',
    depth: 'Respuestas cortas y al grano'
  },
  curioso: {
    keywords: ['cómo', 'por qué', 'qué pasa si', 'explica', 'cuéntame', 'dime más'],
    style: 'Informativo, didáctico, paciente',
    depth: 'Explicaciones detalladas'
  }
};

// ===================================================================
// FUNCIONES PRINCIPALES DEL CRE
// ===================================================================

/**
 * Analiza el perfil del usuario y genera razonamiento estructurado
 */
export const analyzeConversation = (profile) => {
  if (!profile) return null;

  const analysis = {
    objectives: [],
    priorities: [],
    relatedGroups: [],
    plan: null,
    purchaseReadiness: 0,
    purchaseSignalLevel: 'none',
    personality: 'neutral',
    recommendedDepth: 'normal',
    conversationMode: 'neutral',
    pendingTopics: [],
    dontRepeat: [],
    nextAction: 'continue_advising'
  };

  // 1. Analizar objetivos
  if (profile.objectives.length > 0) {
    analysis.objectives = profile.objectives.map(o => o.objective);
    analysis.priorities = prioritizeObjectives(profile.objectives);
    analysis.relatedGroups = detectRelatedObjectives(profile.objectives);
  }

  // 2. Generar plan de bienestar
  analysis.plan = generateWellnessPlan(profile);

  // 3. Detectar nivel de señal de compra
  const allSignals = profile.purchaseSignals || [];
  const hasStrong = allSignals.some(s => PURCHASE_SIGNAL_LEVELS.strong.includes(s.signal));
  const hasMedium = allSignals.some(s => PURCHASE_SIGNAL_LEVELS.medium.includes(s.signal));
  const hasWeak = allSignals.some(s => PURCHASE_SIGNAL_LEVELS.weak.includes(s.signal));

  if (hasStrong) {
    analysis.purchaseSignalLevel = 'strong';
    analysis.purchaseReadiness = Math.min(profile.purchaseProbability || 0, 95);
  } else if (hasMedium) {
    analysis.purchaseSignalLevel = 'medium';
    analysis.purchaseReadiness = Math.min((profile.purchaseProbability || 0) * 0.7, 60);
  } else if (hasWeak) {
    analysis.purchaseSignalLevel = 'weak';
    analysis.purchaseReadiness = Math.min((profile.purchaseProbability || 0) * 0.4, 30);
  }

  // 4. Decidir siguiente acción según probabilidad de compra
  if (analysis.purchaseReadiness >= 80) {
    analysis.nextAction = 'offer_purchase_help';
  } else if (analysis.purchaseReadiness >= 50) {
    analysis.nextAction = 'guide_to_purchase';
  } else {
    analysis.nextAction = 'continue_advising';
  }

  // 5. Detectar personalidad del usuario
  const userMessages = profile.repeatedInterests || [];
  for (const [personality, config] of Object.entries(PERSONALITY_MAP)) {
    const matchCount = config.keywords.filter(kw =>
      userMessages.some(m => m.word.includes(kw) || kw.includes(m.word))
    ).length;
    if (matchCount >= 2) {
      analysis.personality = personality;
      break;
    }
  }

  // 6. Determinar profundidad recomendada
  if (analysis.personality === 'directo') {
    analysis.recommendedDepth = 'superficial';
  } else if (analysis.personality === 'curioso' || analysis.personality === 'tecnico') {
    analysis.recommendedDepth = 'profundo';
  } else {
    analysis.recommendedDepth = 'normal';
  }

  // 6b. Detectar modo de conversación (catálogo vs asesor)
  const catalogKeywords = ['producto', 'productos', 'catalogo', 'catálogo', 'precio', 'precios', 'quiero ver', 'muestrame', 'tienes', 'venden', 'comprar'];
  const advisorKeywords = ['ayuda', 'necesito', 'recomienda', 'recomiéndame', 'sugiere', 'sugiéreme', 'cual', 'cuál', 'mejor', 'duda', 'no sé', 'orientame', 'orientación', 'bienestar', 'sentir', 'siento', 'molestia', 'malestar'];
  
  const hasCatalogIntent = userMessages.some(m => 
    catalogKeywords.some(kw => m.word.includes(kw))
  );
  const hasAdvisorIntent = userMessages.some(m => 
    advisorKeywords.some(kw => m.word.includes(kw))
  );
  
  if (hasCatalogIntent && !hasAdvisorIntent) {
    analysis.conversationMode = 'catalog';
  } else if (hasAdvisorIntent) {
    analysis.conversationMode = 'advisor';
  } else {
    analysis.conversationMode = 'neutral';
  }

  // 7. Identificar temas que NO repetir
  const explainedTopics = profile.explainedTopics || {};
  Object.entries(explainedTopics).forEach(([product, topics]) => {
    if (topics.includes('beneficios') || topics.includes('beneficios')) {
      analysis.dontRepeat.push(`${product}: beneficios`);
    }
    if (topics.includes('ingredientes')) {
      analysis.dontRepeat.push(`${product}: ingredientes`);
    }
    if (topics.includes('preparacion') || topics.includes('uso')) {
      analysis.dontRepeat.push(`${product}: preparacion`);
    }
  });

  // 8. Identificar temas pendientes
  const viewedProducts = profile.productsViewed || [];
  viewedProducts.forEach(product => {
    const explained = explainedTopics[product] || [];
    if (!explained.includes('beneficios')) {
      analysis.pendingTopics.push(`Explicar beneficios de ${product}`);
    }
    if (!explained.includes('uso') && !explained.includes('preparacion')) {
      analysis.pendingTopics.push(`Explicar uso de ${product}`);
    }
  });

  return analysis;
};

/**
 * Genera el contexto razonado para inyectar en el prompt
 * Este es el output principal del CRE que alimenta al Prompt Builder
 */
export const generateReasonedContext = (profile) => {
  if (!profile) return '';

  const analysis = analyzeConversation(profile);
  if (!analysis) return '';

  const lines = [];

  // === RAZONAMIENTO DEL ASESOR ===
  lines.push('=== RAZONAMIENTO DEL ASESOR ===');

  // Objetivos y prioridades
  if (analysis.priorities.length > 0) {
    lines.push('Objetivos del cliente (priorizados):');
    analysis.priorities.forEach((obj, i) => {
      lines.push(`  ${i + 1}. ${obj.objective} (prioridad ${obj.priority}/10)`);
    });
  }

  // Grupos relacionados
  if (analysis.relatedGroups.length > 0) {
    lines.push('Grupos de objetivos relacionados:');
    analysis.relatedGroups.forEach(group => {
      lines.push(`  - ${group.name}: ${group.recommendation}`);
    });
  }

  // Plan de bienestar
  if (analysis.plan) {
    const planSummary = generatePlanSummary(profile);
    if (planSummary) {
      lines.push(planSummary);
    }
  }

  // Productos ya explicados (NO repetir)
  if (analysis.dontRepeat.length > 0) {
    lines.push('NO repetir informacion ya explicada:');
    analysis.dontRepeat.forEach(topic => lines.push(`  - ${topic}`));
  }

  // Temas pendientes
  if (analysis.pendingTopics.length > 0) {
    lines.push('Temas pendientes por explicar:');
    analysis.pendingTopics.forEach(topic => lines.push(`  - ${topic}`));
  }

  // Modo de conversación
  if (analysis.conversationMode === 'catalog') {
    lines.push('MODO: CATALOGO - El usuario quiere ver productos directamente. Responde rapido y directo.');
  } else if (analysis.conversationMode === 'advisor') {
    lines.push('MODO: ASESOR - El usuario busca orientacion. Aplica flujo premium: primero entiende, luego recomienda.');
  }

  // Señal de compra
  if (analysis.purchaseSignalLevel !== 'none') {
    lines.push(`Senal de compra: ${analysis.purchaseSignalLevel.toUpperCase()}`);
    lines.push(`Disposicion a comprar: ${analysis.purchaseReadiness}%`);
  }

  // Personalidad detectada
  if (analysis.personality !== 'neutral') {
    const personalityConfig = PERSONALITY_MAP[analysis.personality];
    lines.push(`Personalidad detectada: ${analysis.personality}`);
    lines.push(`Estilo recomendado: ${personalityConfig.style}`);
    lines.push(`Profundidad: ${analysis.recommendedDepth}`);
  }

  // Siguiente acción - Premium Advisor
  if (analysis.nextAction === 'offer_purchase_help') {
    lines.push('ACCION: El cliente esta listo para comprar. Ofrece ayuda con el proceso de compra de forma natural, sin presion.');
  } else if (analysis.nextAction === 'guide_to_purchase') {
    lines.push('ACCION: El cliente muestra interes. Presenta opciones y deja que el decida. Venta blanda.');
  } else {
    lines.push('ACCION: Continua asesorando como consultor. Primero entender, despues recomendar. No vendas, solo acompana.');
  }

  // === FIN RAZONAMIENTO ===
  lines.push('=== FIN RAZONAMIENTO ===');

  return lines.join('\n');
};

/**
 * Genera el contexto completo combinando CIE + CRE
 */
export const generateFullContext = (profile) => {
  if (!profile) return '';

  const parts = [];

  // Perfil del CIE (resumen)
  const profileSummary = generateProfileSummary(profile);
  if (profileSummary) {
    parts.push(profileSummary);
  }

  // Razonamiento del CRE
  const reasoning = generateReasonedContext(profile);
  if (reasoning) {
    parts.push(reasoning);
  }

  return parts.join('\n\n');
};

export default {
  analyzeConversation,
  generateReasonedContext,
  generateFullContext
};
