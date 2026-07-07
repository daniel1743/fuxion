/**
 * Lead Intelligence Engine - Phase 2
 * 
 * Convierte alertas Telegram en reportes inteligentes tipo CRM.
 * Extiende la información existente sin modificar respuestas del bot,
 * DeepSeek, UI ni productos.
 * 
 * Módulos:
 *   1. leadProfile - Resumen del cliente
 *   2. customerStage - Etapa del cliente en el ciclo de compra
 *   3. contactDetection - Detección de datos de contacto
 *   4. spamPrevention - Cooldown para evitar spam
 *   5. businessOpportunity - Detección de oportunidad negocio
 *   6. interestScore - Cálculo de interés mejorado
 */

// ===================================================================
// 1. LEAD PROFILE - Resumen del cliente
// ===================================================================

/**
 * Crea un perfil de lead enriquecido con toda la información disponible.
 * 
 * @param {Object} options
 * @param {string} options.sessionId - ID de sesión
 * @param {string} options.userName - Nombre del usuario (si registrado)
 * @param {string} options.userEmail - Email del usuario (si registrado)
 * @param {Array} options.messages - Mensajes de la conversación
 * @param {Array} options.productNames - Productos detectados
 * @param {number} options.durationMinutes - Minutos activos
 * @param {number} options.score - Buy intent score
 * @param {Array} options.detectedSignals - Señales detectadas
 * @param {string} options.lastMessage - Último mensaje del usuario
 * @param {boolean} options.isBusinessIntent - Si es intención de negocio
 * @returns {Object} Perfil de lead enriquecido
 */
export const createLeadProfile = ({
  sessionId,
  userName,
  userEmail,
  messages = [],
  productNames = [],
  durationMinutes = 0,
  score = 0,
  detectedSignals = [],
  lastMessage = '',
  isBusinessIntent = false
}) => {
  // --- Cliente ---
  const cliente = userName && userName !== 'Visitante anónimo'
    ? { tipo: 'registrado', nombre: userName, email: userEmail || null }
    : { tipo: 'anonimo', nombre: 'Cliente anónimo', email: null };

  // --- Tiempo de chat ---
  const tiempoChat = calcularTiempoChat(messages, durationMinutes);

  // --- Mensajes / preguntas ---
  const mensajes = contarMensajes(messages);

  // --- Producto principal (solo mencionado por usuario) ---
  const { principal, secundarios } = clasificarProductos(messages, productNames);

  // --- Etapa del cliente ---
  const etapa = detectarCustomerStage(messages, detectedSignals, score, isBusinessIntent);

  // --- Interés ---
  const interes = calcularInteres(score, detectedSignals, isBusinessIntent);

  // --- Contacto ---
  const contacto = detectarContacto(messages);

  // --- Sugerencia ---
  const sugerencia = generarSugerencia(etapa, principal, detectedSignals, isBusinessIntent, contacto);

  return {
    cliente,
    tiempoChat,
    mensajes,
    productoPrincipal: principal,
    productosSecundarios: secundarios,
    etapa,
    interes,
    contacto,
    ultimaFrase: lastMessage,
    sugerencia,
    // Datos crudos para uso interno
    raw: {
      score,
      detectedSignals,
      isBusinessIntent,
      sessionId
    }
  };
};

/**
 * Calcula el tiempo de chat en minutos.
 */
const calcularTiempoChat = (messages, durationMinutes) => {
  if (durationMinutes > 0) return durationMinutes;
  
  const userMessages = messages.filter(m => m.role === 'user');
  if (userMessages.length < 2) return userMessages.length > 0 ? 1 : 0;
  
  // Estimar basado en timestamps si existen
  const timestamps = userMessages
    .map(m => m.timestamp || m.created_at || null)
    .filter(Boolean)
    .map(t => new Date(t).getTime())
    .filter(t => !Number.isNaN(t));
  
  if (timestamps.length >= 2) {
    const diff = Math.max(0, Math.round((Math.max(...timestamps) - Math.min(...timestamps)) / 60000));
    return diff || 1;
  }
  
  return Math.max(1, userMessages.length - 1);
};

/**
 * Cuenta la cantidad de mensajes y preguntas del usuario.
 */
const contarMensajes = (messages) => {
  const userMessages = messages.filter(m => m.role === 'user');
  const preguntas = userMessages.filter(m => {
    const content = String(m.content || '');
    return /\b(qu[eé]|cu[aá]l|d[oó]nde|por qu[eé]|c[oó]mo|cu[aá]nto|qui[eé]n|cu[aá]ndo)\b/i.test(content);
  });
  
  return {
    total: userMessages.length,
    preguntas: preguntas.length
  };
};

/**
 * Clasifica productos en principal (primero mencionado por usuario) y secundarios.
 * SOLO usa productos mencionados por el usuario, NO sugeridos por IA.
 */
const clasificarProductos = (messages, productNames) => {
  const uniqueProducts = [...new Set(productNames)];
  
  if (uniqueProducts.length === 0) {
    return { principal: 'Sin producto específico', secundarios: [] };
  }
  
  // El primer producto mencionado por el usuario es el principal
  const principal = uniqueProducts[0];
  const secundarios = uniqueProducts.slice(1);
  
  return { principal, secundarios };
};

// ===================================================================
// 2. CUSTOMER STAGE - Etapa del cliente
// ===================================================================

/**
 * Patrones para detectar la etapa del cliente.
 * NO se mezcla con intención de negocio.
 */
const STAGE_PATTERNS = {
  explorando: {
    patterns: [
      /\b(qu[eé] es|qu[eé] son|qu[eé] contiene|qu[eé] tiene)\b/i,
      /\b(para qu[eé] sirve|para qu[eé] es)\b/i,
      /\b(c[oó]mo funciona|en qu[eé] consiste)\b/i,
      /\b(quiere decir|significa|consiste)\b/i,
      /\b(informaci[oó]n|info|datos|detalles)\b/i,
      /\b(expl[ií]came|cu[eé]ntame|dime)\b/i
    ],
    significado: 'Aprendiendo sobre producto'
  },
  
  evaluando: {
    patterns: [
      /\b(precio|cu[aá]nto cuesta|cu[aá]nto vale|valor|costo|tarifa)\b/i,
      /\b(cu[aá]nto dura|cu[aá]nto tiempo|duracion|duración)\b/i,
      /\b(c[oó]mo se toma|c[oó]mo se usa|c[oó]mo se consume|modo de uso|dosis)\b/i,
      /\b(beneficios?|sirve|ayuda|funciona|resultados)\b/i,
      /\b(comparar|comparaci[oó]n|vs|versus|diferencia|mejor que)\b/i,
      /\b(ingredientes?|contiene|composici[oó]n|efectos secundarios)\b/i,
      /\b(env[ií]o|despacho|retiro|entrega|llega|domicilio)\b/i,
      /\b(disponible|stock|hay existencias|quedan)\b/i
    ],
    significado: 'Evaluando posible compra'
  },
  
  compra: {
    patterns: [
      /\b(quiero comprar|deseo comprar|necesito comprar)\b/i,
      /\b(c[oó]mo pago|c[oó]mo puedo pagar|forma de pago|m[eé]todo de pago)\b/i,
      /\b(tienes disponible|lo quiero|lo necesito)\b/i,
      /\b(entrega hoy|hoy mismo|ahora mismo|lo antes posible)\b/i,
      /\b(quiero pedir|quiero hacer pedido|hacer un pedido)\b/i,
      /\b(comprar|adquirir|ordenar|encargar)\b/i,
      /\b(pagar|transferencia|tarjeta|efectivo|cuotas)\b/i
    ],
    significado: 'Listo para comprar'
  },
  
  negocio: {
    patterns: [
      /\b(quiero vender|vender productos|vender fuxion|vender fuXion)\b/i,
      /\b(oportunidad|oportunidad de negocio|oportunidad fuxion|oportunidad fuXion)\b/i,
      /\b(distribuidor|ser distribuidor|hacerme distribuidor)\b/i,
      /\b(ganar dinero|c[oó]mo ganar dinero|ganar dinero con fuxion|ganar dinero con fuXion)\b/i,
      /\b(ingresos extra|ingreso extra|dinero extra|ingreso adicional)\b/i,
      /\b(bonos|bono auto|bono|fondo pa[ií]s|rangos|plan de compensaci[oó]n)\b/i,
      /\b(emprender|emprendimiento|negocio propio|negocio desde casa)\b/i,
      /\b(independencia financiera|libertad financiera|trabajo desde casa)\b/i,
      /\b(ingreso pasivo|ingresos pasivos|afiliarme|ser socio|asociarme)\b/i,
      /\b(unirme a fuxion|unirme a fuXion|ser parte de fuxion|ser parte de fuXion)\b/i,
      /\b(modelo de negocio|plan de negocio|c[oó]mo funciona el negocio)\b/i,
      /\b(trabajar con fuxion|trabajar con fuXion|emprender con fuxion|emprender con fuXion)\b/i
    ],
    significado: 'Interesado en negocio FuXion'
  }
};

/**
 * Detecta la etapa del cliente basada en sus mensajes y señales.
 * 
 * @param {Array} messages - Mensajes de la conversación
 * @param {Array} detectedSignals - Señales detectadas
 * @param {number} score - Buy intent score
 * @param {boolean} isBusinessIntent - Si es intención de negocio
 * @returns {Object} Etapa detectada
 */
export const detectarCustomerStage = (messages, detectedSignals = [], score = 0, isBusinessIntent = false) => {
  const userMessages = messages.filter(m => m.role === 'user');
  const allText = userMessages.map(m => String(m.content || '')).join(' ');
  
  // 1. Business intent tiene prioridad absoluta
  if (isBusinessIntent) {
    // Verificar si realmente hay patrones de negocio
    for (const pattern of STAGE_PATTERNS.negocio.patterns) {
      if (pattern.test(allText)) {
        return {
          id: 'negocio',
          label: '🚀 Oportunidad negocio',
          significado: STAGE_PATTERNS.negocio.significado,
          prioridad: 1
        };
      }
    }
  }
  
  // 2. Detectar compra (señales fuertes)
  if (score >= 70) {
    for (const pattern of STAGE_PATTERNS.compra.patterns) {
      if (pattern.test(allText)) {
        return {
          id: 'compra',
          label: '🔥 Listo para comprar',
          significado: STAGE_PATTERNS.compra.significado,
          prioridad: 2
        };
      }
    }
  }
  
  // 3. Detectar evaluación (señales medias-altas)
  if (score >= 30) {
    for (const pattern of STAGE_PATTERNS.evaluando.patterns) {
      if (pattern.test(allText)) {
        return {
          id: 'evaluando',
          label: '💭 Evaluando compra',
          significado: STAGE_PATTERNS.evaluando.significado,
          prioridad: 3
        };
      }
    }
  }
  
  // 4. Por defecto: explorando
  return {
    id: 'explorando',
    label: '🔍 Explorando',
    significado: STAGE_PATTERNS.explorando.significado,
    prioridad: 4
  };
};

// ===================================================================
// 3. INTEREST SCORE - Cálculo de interés mejorado
// ===================================================================

/**
 * Calcula el nivel de interés del cliente (0-100%).
 * Combina score de compra + señales + etapa.
 */
const calcularInteres = (score, detectedSignals, isBusinessIntent) => {
  if (isBusinessIntent) return 85; // Alto interés en negocio
  
  let interes = score;
  
  // Ajustes por señales
  if (detectedSignals.includes('quiere comprar')) interes = Math.max(interes, 80);
  if (detectedSignals.includes('pregunta precio') && detectedSignals.includes('consulta despacho')) {
    interes = Math.max(interes, 65);
  }
  if (detectedSignals.includes('problema específico')) interes = Math.max(interes, 50);
  if (detectedSignals.includes('compara productos')) interes = Math.max(interes, 40);
  
  return Math.min(Math.max(interes, 0), 100);
};

// ===================================================================
// 4. CONTACT DETECTION - Detección de datos de contacto
// ===================================================================

/**
 * Patrones para detectar datos de contacto en mensajes del usuario.
 */
const CONTACT_PATTERNS = {
  telefono: {
    patterns: [
      /\b(\+?\d{1,3}[\s.-]?\d{7,10})\b/,           // +56 9 12345678
      /\b(\d{9,12})\b/,                               // 912345678
      /\b(\d{3,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4})\b/   // 9 1234 5678
    ],
    label: 'Teléfono'
  },
  whatsapp: {
    patterns: [
      /\b(whatsapp|wa|wp)\s*:?\s*(\+?\d{1,3}[\s.-]?\d{7,10})\b/i,
      /\b(whatsapp|wa|wp)\s*:?\s*(\d{9,12})\b/i,
      /\bmi\s*(whatsapp|wa|wp|n[uú]mero|tel[eé]fono)\b/i,
      /\b(whatsapp|wa|wp)\s*(app|aplicaci[oó]n)\b/i
    ],
    label: 'WhatsApp'
  },
  correo: {
    patterns: [
      /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/
    ],
    label: 'Correo'
  }
};

/**
 * Detecta si el usuario ha proporcionado datos de contacto.
 * 
 * @param {Array} messages - Mensajes de la conversación
 * @returns {Object} Información de contacto detectada
 */
export const detectarContacto = (messages) => {
  const userMessages = messages.filter(m => m.role === 'user');
  const contactos = [];
  
  for (const msg of userMessages) {
    const content = String(msg.content || '');
    
    // Detectar teléfono
    for (const pattern of CONTACT_PATTERNS.telefono.patterns) {
      const match = content.match(pattern);
      if (match) {
        contactos.push({
          tipo: 'telefono',
          valor: match[1] || match[0],
          detectadoEn: msg.content
        });
        break;
      }
    }
    
    // Detectar WhatsApp
    for (const pattern of CONTACT_PATTERNS.whatsapp.patterns) {
      const match = content.match(pattern);
      if (match) {
        contactos.push({
          tipo: 'whatsapp',
          valor: match[2] || match[1] || match[0],
          detectadoEn: msg.content
        });
        break;
      }
    }
    
    // Detectar correo
    for (const pattern of CONTACT_PATTERNS.correo.patterns) {
      const match = content.match(pattern);
      if (match) {
        contactos.push({
          tipo: 'correo',
          valor: match[1],
          detectadoEn: msg.content
        });
        break;
      }
    }
  }
  
  // Eliminar duplicados por tipo
  const tiposUnicos = new Map();
  for (const c of contactos) {
    if (!tiposUnicos.has(c.tipo)) {
      tiposUnicos.set(c.tipo, c);
    }
  }
  
  const contactosUnicos = Array.from(tiposUnicos.values());
  
  return {
    disponible: contactosUnicos.length > 0,
    contactos: contactosUnicos,
    resumen: contactosUnicos.length > 0
      ? '✅ Contacto disponible'
      : '⚠️ Sin datos de contacto todavía'
  };
};

// ===================================================================
// 5. SPAM PREVENTION - Cooldown system
// ===================================================================

/**
 * Cache de sesiones notificadas para evitar spam.
 * Almacena en memoria el último estado de cada sesión.
 */
const notifiedSessions = new Map();
const COOLDOWN_MINUTES = 5; // 5 minutos de cooldown

/**
 * Verifica si se debe permitir una nueva notificación para esta sesión.
 * 
 * Reglas:
 * - Misma conversación: no enviar múltiples Telegram iguales
 * - Permitir nueva alerta si:
 *   - Cambia la etapa del cliente
 *   - Aumenta la intención +20 puntos
 *   - Pasa de producto a compra
 *   - Pasa a oportunidad negocio
 * 
 * @param {string} sessionId - ID de sesión
 * @param {Object} currentState - Estado actual de la evaluación
 * @returns {Object} { permitido: boolean, razon: string }
 */
export const checkCooldown = (sessionId, currentState) => {
  if (!sessionId) {
    return { permitido: true, razon: 'Sin sessionId, permitir' };
  }
  
  const previous = notifiedSessions.get(sessionId);
  
  // Primera vez que se notifica esta sesión
  if (!previous) {
    return { permitido: true, razon: 'Primera notificación de la sesión' };
  }
  
  const now = Date.now();
  const elapsed = now - previous.timestamp;
  const elapsedMinutes = elapsed / 60000;
  
  // Si ha pasado el cooldown, permitir
  if (elapsedMinutes >= COOLDOWN_MINUTES) {
    return { permitido: true, razon: `Cooldown superado (${Math.round(elapsedMinutes)} min)` };
  }
  
  // --- Reglas para permitir dentro del cooldown ---
  
  // 1. Cambió a oportunidad negocio (siempre permitir)
  if (currentState.isBusinessIntent && !previous.isBusinessIntent) {
    return { permitido: true, razon: 'Nueva detección de oportunidad negocio' };
  }
  
  // 2. Cambió la etapa del cliente
  if (currentState.etapaId && previous.etapaId && currentState.etapaId !== previous.etapaId) {
    return { permitido: true, razon: `Cambio de etapa: ${previous.etapaId} → ${currentState.etapaId}` };
  }
  
  // 3. Aumentó la intención +20 puntos
  if (currentState.score && previous.score && (currentState.score - previous.score) >= 20) {
    return { permitido: true, razon: `Aumento de intención: ${previous.score} → ${currentState.score}` };
  }
  
  // 4. Pasó de producto a compra
  if (currentState.etapaId === 'compra' && previous.etapaId !== 'compra') {
    return { permitido: true, razon: 'Transición a etapa de compra' };
  }
  
  // No permitir: misma conversación, misma etapa, sin cambios significativos
  return {
    permitido: false,
    razon: `Cooldown activo (${Math.round(elapsedMinutes)}/${COOLDOWN_MINUTES} min). Sin cambios significativos.`
  };
};

/**
 * Registra una notificación enviada para una sesión.
 */
export const registerNotification = (sessionId, state) => {
  notifiedSessions.set(sessionId, {
    timestamp: Date.now(),
    score: state.score || 0,
    etapaId: state.etapaId || 'explorando',
    isBusinessIntent: Boolean(state.isBusinessIntent),
    productPrincipal: state.productPrincipal || ''
  });
  
  // Limpiar sesiones antiguas (más de 1 hora)
  const oneHourAgo = Date.now() - 3600000;
  for (const [key, value] of notifiedSessions) {
    if (value.timestamp < oneHourAgo) {
      notifiedSessions.delete(key);
    }
  }
};

// ===================================================================
// 6. BUSINESS OPPORTUNITY - Categoría independiente
// ===================================================================

/**
 * Detecta señales de oportunidad de negocio de forma independiente.
 * NO se mezcla con compra de producto.
 * 
 * @param {Array} messages - Mensajes de la conversación
 * @returns {Object|null} Información de oportunidad detectada
 */
export const detectBusinessOpportunity = (messages) => {
  const userMessages = messages.filter(m => m.role === 'user');
  const allText = userMessages.map(m => String(m.content || '')).join(' ');
  const señalesEncontradas = [];
  
  for (const pattern of STAGE_PATTERNS.negocio.patterns) {
    const match = allText.match(pattern);
    if (match) {
      señalesEncontradas.push(match[0]);
    }
  }
  
  if (señalesEncontradas.length === 0) return null;
  
  return {
    detectado: true,
    señales: [...new Set(señalesEncontradas)],
    fraseDetectada: señalesEncontradas[0],
    tiempoHablando: userMessages.length,
    requiereContactoHumano: true
  };
};

// ===================================================================
// 7. SUGGESTION GENERATOR - Generar sugerencia para el asesor
// ===================================================================

/**
 * Genera una sugerencia de acción para el asesor humano.
 */
const generarSugerencia = (etapa, productoPrincipal, detectedSignals, isBusinessIntent, contacto) => {
  if (isBusinessIntent) {
    return 'Contactar para explicar oportunidad de negocio FuXion';
  }
  
  if (etapa.id === 'compra') {
    if (!contacto.disponible) {
      return 'Cliente listo para comprar. Solicitar datos de contacto para procesar pedido.';
    }
    return 'Cliente listo para comprar. Contactar para cerrar venta.';
  }
  
  if (etapa.id === 'evaluando') {
    if (detectedSignals.includes('pregunta precio') && detectedSignals.includes('consulta despacho')) {
      return 'Resolver dudas de precio y despacho. Ofrecer ayuda humana.';
    }
    if (detectedSignals.includes('compara productos')) {
      return 'Ayudar a decidir entre opciones. Ofrecer recomendación personalizada.';
    }
    return 'Resolver dudas y ofrecer ayuda humana.';
  }
  
  if (etapa.id === 'explorando') {
    return 'Cliente en etapa informativa. No requiere contacto urgente.';
  }
  
  return 'Monitorear conversación.';
};

// ===================================================================
// 8. TELEGRAM MESSAGE BUILDER - Mensaje enriquecido
// ===================================================================

/**
 * Construye el mensaje de Telegram enriquecido con toda la información CRM.
 * 
 * @param {Object} leadProfile - Perfil de lead generado por createLeadProfile()
 * @returns {string} Mensaje formateado para Telegram
 */
export const buildTelegramMessageV2 = (leadProfile) => {
  const { cliente, tiempoChat, mensajes, productoPrincipal, productosSecundarios, etapa, interes, contacto, ultimaFrase, sugerencia, raw } = leadProfile;
  
  // Determinar emoji y título según etapa
  let tituloEmoji = '💬';
  let tituloTexto = 'Cliente interesado FuXion';
  
  if (raw.isBusinessIntent) {
    tituloEmoji = '🚀';
    tituloTexto = 'Posible socio FuXion';
  } else if (etapa.id === 'compra') {
    tituloEmoji = '🔥';
    tituloTexto = 'Cliente listo para comprar';
  } else if (etapa.id === 'evaluando') {
    tituloEmoji = '💭';
    tituloTexto = 'Cliente evaluando compra';
  } else if (etapa.id === 'explorando') {
    tituloEmoji = '🔍';
    tituloTexto = 'Cliente explorando productos';
  }
  
  // Construir líneas del mensaje
  const lines = [];
  
  // Título
  lines.push(`${tituloEmoji} ${tituloTexto}`);
  lines.push('');
  
  // Cliente
  lines.push(`👤 Cliente:`);
  lines.push(cliente.nombre);
  if (cliente.email) {
    lines.push(`📧 ${cliente.email}`);
  }
  lines.push('');
  
  // Producto principal
  lines.push(`📦 Producto principal:`);
  lines.push(productoPrincipal);
  if (productosSecundarios.length > 0) {
    lines.push(`📎 También consultó: ${productosSecundarios.join(', ')}`);
  }
  lines.push('');
  
  // Etapa
  lines.push(`🧠 Etapa:`);
  lines.push(etapa.significado);
  lines.push('');
  
  // Interés
  lines.push(`🎯 Interés:`);
  lines.push(`${interes}%`);
  lines.push('');
  
  // Última frase
  if (ultimaFrase) {
    lines.push(`💬 Última frase:`);
    lines.push(`'${ultimaFrase.length > 100 ? ultimaFrase.substring(0, 100) + '...' : ultimaFrase}'`);
    lines.push('');
  }
  
  // Actividad
  lines.push(`📊 Actividad:`);
  lines.push(`${tiempoChat} minutos · ${mensajes.preguntas} preguntas`);
  lines.push('');
  
  // Detectado (señales)
  if (raw.detectedSignals && raw.detectedSignals.length > 0) {
    const signalMap = {
      'quiere comprar': 'quiere comprar',
      'pregunta precio': 'preguntó precio',
      'consulta despacho': 'preguntó despacho',
      'problema específico': 'tiene necesidad específica',
      'pregunta beneficios': 'preguntó beneficios',
      'pregunta ingredientes': 'preguntó ingredientes',
      'compara productos': 'comparó productos',
      'consulta repetida del mismo producto': 'insistió en mismo producto'
    };
    const humanSignals = raw.detectedSignals
      .map(s => signalMap[s] || s)
      .filter(Boolean);
    if (humanSignals.length > 0) {
      lines.push(`🤖 Detectado:`);
      lines.push(humanSignals.join(' + '));
      lines.push('');
    }
  }
  
  // Contacto
  lines.push(contacto.resumen);
  lines.push('');
  
  // Sugerencia
  lines.push(`💡 Sugerencia:`);
  lines.push(sugerencia);
  
  // Si es oportunidad de negocio, agregar info adicional
  if (raw.isBusinessIntent) {
    lines.push('');
    lines.push(`📞 Recomendación: Contactar personalmente para explicar oportunidad.`);
  }
  
  return lines.join('\n');
};

// ===================================================================
// EXPORT default
// ===================================================================
export default {
  createLeadProfile,
  detectarCustomerStage,
  detectarContacto,
  checkCooldown,
  registerNotification,
  detectBusinessOpportunity,
  buildTelegramMessageV2
};
