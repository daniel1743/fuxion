/**
 * Conversation Profile
 *
 * Perfil dinámico del cliente que se construye durante la sesión.
 * Se actualiza en cada interacción y se utiliza para enriquecer
 * el prompt enviado a la IA.
 *
 * El perfil permite al asistente:
 * - Recordar objetivos y síntomas previos
 * - Evitar repetir explicaciones completas
 * - Conectar productos con necesidades acumulativas
 * - Detectar intención de compra
 * - Personalizar cada respuesta
 */

// ===================================================================
// PERFIL DE CONVERSACIÓN
// ===================================================================
export const createEmptyProfile = () => ({
  objectives: [],
  symptoms: [],
  conditions: [],
  productsViewed: [],
  productsRecommended: [],
  productsRejected: [],
  explainedTopics: {},
  purchaseSignals: [],
  objections: [],
  preferences: [],
  questionsAsked: [],
  currentFocus: null,
  confidenceLevel: 0,
  purchaseProbability: 0,
  lastRecommendedProduct: null,
  conversationStage: 'greeting',
  messageCount: 0,
  userTone: 'neutral',
  urgencyLevel: 0,
  repeatedInterests: [],
  conversationMode: 'neutral' // 'catalog', 'advisor', or 'neutral'
});

// ===================================================================
// DETECCIÓN DE INTENCIONES Y SEÑALES
// ===================================================================
const OBJECTIVE_PATTERNS = [
  { pattern: /\b(colon|estreñimiento|estrenimiento|constipacion|constipación|limpiar|limpieza|evacuar|ir al baño|transito|tránsito)\b/i, objective: 'mejorar salud digestiva', category: 'digestión' },
  { pattern: /\b(higado|hígado|higado graso|desintoxicar|desintoxicacion|desintoxicación|detox|rexet)\b/i, objective: 'apoyar salud hepática', category: 'hígado' },
  { pattern: /\b(peso|bajar|perder|adelgazar|dieta|rebajar|grasa|cardio|fit|fitness|control de peso)\b/i, objective: 'control de peso', category: 'peso' },
  { pattern: /\b(sueno|sueño|dormir|insomnio|descansar|relajar|relajacion|relajación)\b/i, objective: 'mejorar descanso', category: 'sueño' },
  { pattern: /\b(estres|estrés|ansiedad|nervios|calma|tranquilidad|relajado)\b/i, objective: 'manejo del estrés', category: 'estrés' },
  { pattern: /\b(energia|energía|cansancio|fatiga|agotamiento|vitalidad|activar)\b/i, objective: 'aumentar energía', category: 'energía' },
  { pattern: /\b(concentracion|concentración|enfoque|memoria|mente|cerebro|estudiar|aprendizaje)\b/i, objective: 'mejorar concentración', category: 'concentración' },
  { pattern: /\b(defensas|inmunidad|inmunologico|inmunológico|resfriado|gripe|proteccion|protección)\b/i, objective: 'fortalecer defensas', category: 'defensas' },
  { pattern: /\b(piel|colageno|colágeno|belleza|arrugas|juvenil|juventud|anti edad)\b/i, objective: 'cuidado de la piel', category: 'piel' },
  { pattern: /\b(digestion|digestión|digestivo|estomago|estómago|hinchazon|hinchazón|pesadez|gastritis|reflujo|colitis|colon irritable|probiótico|probióticos|flora intestinal)\b/i, objective: 'mejorar digestión', category: 'digestión' },
  { pattern: /\b(articulacion|articulaciones|dolor articular|movilidad|dorado|golden|inflamacion)\b/i, objective: 'cuidado articular', category: 'articulaciones' },
  { pattern: /\b(urinario|urinaria|vias urinarias|cistitis|cranberry|berry)\b/i, objective: 'salud urinaria', category: 'urinario' },
];

const SYMPTOM_PATTERNS = [
  { pattern: /\b(dolor|molestia|malestar|inflamación|inflamacion|ardor|acidez)\b/i, symptom: 'dolor o molestia' },
  { pattern: /\b(hinchazón|hinchazon|pesadez|inflado|distendido)\b/i, symptom: 'hinchazón abdominal' },
  { pattern: /\b(cansancio|fatiga|agotamiento|sin energía|sin energías|debilitado)\b/i, symptom: 'fatiga' },
  { pattern: /\b(estreñimiento|estrenimiento|constipacion|constipación|difícil evacuar|no puedo ir al baño)\b/i, symptom: 'estreñimiento' },
  { pattern: /\b(insomnio|no duermo|mal dormir|despertar|difícil dormir)\b/i, symptom: 'problemas de sueño' },
  { pattern: /\b(estrés|estrés|ansiedad|nervios|preocupación|preocupacion|tensión|tension)\b/i, symptom: 'estrés o ansiedad' },
  { pattern: /\b(sobrepeso|subido de peso|aumentado de peso|grasa abdominal|rollitos)\b/i, symptom: 'sobrepeso' },
];

const PURCHASE_SIGNAL_PATTERNS = [
  // REGLA: "quiero saber", "quiero información", "quiero conocer" NO son compra
  // Solo "quiero" seguido de acción de compra explícita
  { pattern: /\b(quiero comprar|quiero pedir|quiero hacer pedido|quiero pagarlo|necesito comprar|necesito pedir)\b/i, signal: 'intención de compra', weight: 10 },
  { pattern: /\b(comprar|adquirir|ordenar|pedir|encargar)\b/i, signal: 'intención de compra', weight: 10 },
  { pattern: /\b(cuánto cuesta|cuanto cuesta|precio|valor|costo|tarifa)\b/i, signal: 'consulta de precio', weight: 8 },
  { pattern: /\b(dónde|donde|retiro|despacho|envío|envio|entrega|domicilio)\b/i, signal: 'logística', weight: 7 },
  { pattern: /\b(pago|pagar|transferencia|tarjeta|efectivo|cuotas|cuota)\b/i, signal: 'consulta de pago', weight: 7 },
  { pattern: /\b(disponible|stock|hay existencias|agotado|quedan)\b/i, signal: 'disponibilidad', weight: 6 },
];


const OBJECTION_PATTERNS = [
  { pattern: /\b(caro|caro|costoso|económico|barato|no tengo plata|no me alcanza)\b/i, objection: 'precio' },
  { pattern: /\b(no sé|no estoy seguro|dudas|tal vez|quizás|quizá|capaz)\b/i, objection: 'indecisión' },
  { pattern: /\b(funciona|resultado|efectividad|realmente|verdad|seguro)\b/i, objection: 'efectividad' },
  { pattern: /\b(efectos secundarios|contraindicaciones|daño|malo|seguro|peligroso)\b/i, objection: 'seguridad' },
  { pattern: /\b(ya probé|no funcionó|no me sirvió|intenté|intente)\b/i, objection: 'experiencia previa' },
];

// ===================================================================
// ACTUALIZACIÓN DEL PERFIL
// ===================================================================
export const updateProfile = (profile, userMessage) => {
  if (!profile || !userMessage) return profile;
  const text = String(userMessage);

  // Incrementar contador de mensajes
  profile.messageCount = (profile.messageCount || 0) + 1;

  // Detectar objetivos
  for (const entry of OBJECTIVE_PATTERNS) {
    if (entry.pattern.test(text)) {
      const exists = profile.objectives.find(o => o.objective === entry.objective);
      if (!exists) {
        profile.objectives.push({
          objective: entry.objective,
          category: entry.category,
          detectedAt: profile.messageCount,
          weight: 10,
          explicit: true
        });
      } else {
        // Reforzar peso si se repite
        exists.weight = Math.min(exists.weight + 3, 20);
        exists.explicit = true;
      }
    }
  }

  // Detectar síntomas
  for (const entry of SYMPTOM_PATTERNS) {
    if (entry.pattern.test(text)) {
      const exists = profile.symptoms.find(s => s.symptom === entry.symptom);
      if (!exists) {
        profile.symptoms.push({
          symptom: entry.symptom,
          detectedAt: profile.messageCount,
          weight: 9
        });
      } else {
        exists.weight = Math.min(exists.weight + 2, 15);
      }
    }
  }

  // Detectar señales de compra
  for (const entry of PURCHASE_SIGNAL_PATTERNS) {
    if (entry.pattern.test(text)) {
      const exists = profile.purchaseSignals.find(s => s.signal === entry.signal);
      if (!exists) {
        profile.purchaseSignals.push({
          signal: entry.signal,
          weight: entry.weight,
          detectedAt: profile.messageCount
        });
      }
    }
  }

  // Calcular probabilidad de compra
  if (profile.purchaseSignals.length > 0) {
    const totalWeight = profile.purchaseSignals.reduce((sum, s) => sum + s.weight, 0);
    profile.purchaseProbability = Math.min(Math.round(totalWeight * 5), 95);
  }

  // Detectar objeciones
  for (const entry of OBJECTION_PATTERNS) {
    if (entry.pattern.test(text)) {
      const exists = profile.objections.find(o => o.objection === entry.objection);
      if (!exists) {
        profile.objections.push({
          objection: entry.objection,
          detectedAt: profile.messageCount
        });
      }
    }
  }

  // Detectar urgencia
  if (/\b(urgente|urge|necesito ya|lo antes posible|rapido|rápido|ahora mismo|hoy)\b/i.test(text)) {
    profile.urgencyLevel = Math.min((profile.urgencyLevel || 0) + 3, 10);
  }

  // Detectar tono del usuario
  if (/\b(gracias|por favor|amable|gentil)\b/i.test(text)) {
    profile.userTone = 'positive';
  } else if (/\b(mal|peor|fatal|horrible|terrible|enojado|molesto|fastidio)\b/i.test(text)) {
    profile.userTone = 'negative';
  }

  // Detectar intereses repetidos
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  for (const word of words) {
    const existing = profile.repeatedInterests.find(r => r.word === word);
    if (existing) {
      existing.count = (existing.count || 1) + 1;
    } else {
      profile.repeatedInterests.push({ word, count: 1 });
    }
  }

  // Actualizar nivel de confianza basado en cantidad de interacción
  profile.confidenceLevel = Math.min(
    Math.round(
      (profile.messageCount * 5) +
      (profile.objectives.length * 10) +
      (profile.symptoms.length * 5)
    ),
    100
  );

  // Detectar modo de conversación (catálogo vs asesor vs advisor_premium)
  const catalogKeywords = ['producto', 'productos', 'catalogo', 'catálogo', 'precio', 'precios', 'quiero ver', 'muestrame', 'tienes', 'venden', 'comprar'];
  const advisorKeywords = ['ayuda', 'necesito', 'recomienda', 'recomiéndame', 'sugiere', 'sugiéreme', 'cual', 'cuál', 'mejor', 'duda', 'no sé', 'orientame', 'orientación', 'bienestar', 'sentir', 'siento', 'molestia', 'malestar'];
  // Premium advisor signals: usuario que muestra mayor profundidad en su consulta
  const advisorPremiumKeywords = [
    'personalizado', 'personalizada', 'rutina', 'plan', 'combinar', 'combinación',
    'cuál es mejor', 'cual es mejor', 'diferencia', 'diferencia entre',
    'recomiéndame', 'recomiendame', 'sugiéreme', 'sugiéreme', 'qué me recomiendas',
    'que me recomiendas', 'qué tomas', 'que tomas', 'tú qué', 'tu que',
    'detalle', 'explicame', 'explícame', 'cuéntame', 'cuentame',
    'llevo tiempo', 'he probado', 'ya probé', 'ya intente', 'ya intenté',
    'quiero mejorar', 'quiero empezar', 'quiero cambiar',
    'resultados', 'funciona', 'efectividad', 'experiencia'
  ];
  
  const hasCatalogIntent = catalogKeywords.some(kw => text.toLowerCase().includes(kw));
  const hasAdvisorIntent = advisorKeywords.some(kw => text.toLowerCase().includes(kw));
  const hasPremiumAdvisorIntent = advisorPremiumKeywords.some(kw => text.toLowerCase().includes(kw));
  
  // Premium advisor: usuario que pide recomendación personalizada o muestra profundidad
  if (hasPremiumAdvisorIntent && (hasAdvisorIntent || profile.messageCount > 2)) {
    profile.conversationMode = 'advisor_premium';
  } else if (hasCatalogIntent && !hasAdvisorIntent && !hasPremiumAdvisorIntent) {
    profile.conversationMode = 'catalog';
  } else if (hasAdvisorIntent || hasPremiumAdvisorIntent) {
    profile.conversationMode = 'advisor';
  }
  // Si no hay intención clara, mantener el modo anterior (no cambiar a 'neutral' si ya estaba en catalog, advisor o advisor_premium)

  // Actualizar etapa de conversación
  if (profile.purchaseProbability >= 50) {
    profile.conversationStage = 'purchase';
  } else if (profile.objectives.length >= 2) {
    profile.conversationStage = 'diagnosis';
  } else if (profile.objectives.length >= 1) {
    profile.conversationStage = 'recommendation';
  } else if (profile.messageCount <= 2) {
    profile.conversationStage = 'discovery';
  }

  return profile;
};

// ===================================================================
// REGISTRO DE PRODUCTOS EN EL PERFIL
// ===================================================================
export const registerProductViewed = (profile, productName) => {
  if (!profile || !productName) return;
  if (!profile.productsViewed.includes(productName)) {
    profile.productsViewed.push(productName);
  }
};

export const registerProductRecommended = (profile, productName) => {
  if (!profile || !productName) return;
  if (!profile.productsRecommended.includes(productName)) {
    profile.productsRecommended.push(productName);
  }
  profile.lastRecommendedProduct = productName;
};

export const registerProductRejected = (profile, productName) => {
  if (!profile || !productName) return;
  if (!profile.productsRejected.includes(productName)) {
    profile.productsRejected.push(productName);
  }
};

export const registerExplainedTopic = (profile, productName, topic) => {
  if (!profile || !productName || !topic) return;
  if (!profile.explainedTopics[productName]) {
    profile.explainedTopics[productName] = [];
  }
  if (!profile.explainedTopics[productName].includes(topic)) {
    profile.explainedTopics[productName].push(topic);
  }
};

// ===================================================================
// GENERACIÓN DE RESUMEN DEL PERFIL
// ===================================================================
export const generateProfileSummary = (profile) => {
  if (!profile) return '';
  const lines = [];

  // Solo incluir si hay información relevante
  if (profile.objectives.length > 0) {
    const objectives = profile.objectives
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 4)
      .map(o => o.objective);
    lines.push(`Objetivos del cliente: ${objectives.join(', ')}.`);
  }

  if (profile.symptoms.length > 0) {
    const symptoms = profile.symptoms
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map(s => s.symptom);
    lines.push(`Sintomas mencionados: ${symptoms.join(', ')}.`);
  }

  if (profile.productsViewed.length > 0) {
    lines.push(`Productos que ha consultado: ${profile.productsViewed.join(', ')}.`);
  }

  if (profile.productsRecommended.length > 0) {
    lines.push(`Productos que ya le recomendaste: ${profile.productsRecommended.join(', ')}.`);
  }

  if (profile.productsRejected.length > 0) {
    lines.push(`Productos que rechazo: ${profile.productsRejected.join(', ')}.`);
  }

  // Productos ya explicados
  const explained = Object.entries(profile.explainedTopics);
  if (explained.length > 0) {
    const explainedList = explained
      .map(([product, topics]) => `${product} (${topics.join(', ')})`)
      .join(', ');
    lines.push(`Ya explicaste sobre: ${explainedList}. No repitas la informacion completa.`);
  }

  if (profile.purchaseProbability >= 50) {
    lines.push(`Intencion de compra: ALTA (${profile.purchaseProbability}%).`);
  } else if (profile.purchaseProbability >= 20) {
    lines.push(`Intencion de compra: MEDIA (${profile.purchaseProbability}%).`);
  }

  if (profile.objections.length > 0) {
    const objections = profile.objections.map(o => o.objection).join(', ');
    lines.push(`Objeciones del cliente: ${objections}.`);
  }

  if (profile.urgencyLevel >= 5) {
    lines.push('El cliente muestra urgencia. Se directo y concreto.');
  }

  if (profile.conversationStage) {
    lines.push(`Etapa de la conversacion: ${profile.conversationStage}.`);
  }

  if (profile.conversationMode && profile.conversationMode !== 'neutral') {
    lines.push(`Modo de conversacion: ${profile.conversationMode}.`);
  }

  return lines.join(' ');

};

// ===================================================================
// GENERACIÓN DE PREGUNTAS PENDIENTES
// ===================================================================
export const generatePendingQuestions = (profile) => {
  if (!profile) return '';
  const lines = [];

  // Si hay objetivos pero no se ha profundizado
  if (profile.objectives.length > 0 && profile.messageCount <= 3) {
    lines.push('Aun no has profundizado en los objetivos del cliente. Pregunta si quiere mas detalles.');
  }

  // Si hay productos recomendados pero no se ha explicado el uso
  if (profile.productsRecommended.length > 0) {
    const pendingExplain = profile.productsRecommended.filter(p => {
      const explained = profile.explainedTopics[p] || [];
      return !explained.includes('uso') && !explained.includes('preparacion');
    });
    if (pendingExplain.length > 0) {
      lines.push(`Aun no explicas el uso practico de: ${pendingExplain.join(', ')}.`);
    }
  }

  return lines.join(' ');
};

export default {
  createEmptyProfile,
  updateProfile,
  registerProductViewed,
  registerProductRecommended,
  registerProductRejected,
  registerExplainedTopic,
  generateProfileSummary,
  generatePendingQuestions
};
