/**
 * Medical Risk Assessment (MRA)
 *
 * Evalúa el nivel de riesgo de las condiciones médicas mencionadas
 * por el usuario y determina si se debe derivar o continuar.
 *
 * Filosofía:
 * - NO derivar por el nombre de una enfermedad.
 * - Derivar únicamente por el nivel de riesgo.
 * - Una condición médica estable NO es una urgencia.
 * - El chatbot puede continuar asesorando mientras sea seguro.
 *
 * Niveles de riesgo:
 *   1 - Bienestar general (continuar normalmente)
 *   2 - Condición médica estable (continuar con advertencia)
 *   3 - Riesgo elevado (derivar a atención médica inmediata)
 */

// ===================================================================
// ADVERTENCIAS DINÁMICAS NIVEL 2 (rotación + memoria de disclaimer)
// ===================================================================
const LEVEL2_WARNING_VARIANTS = [
  `Gracias por compartir esa informacion. Eso me ayuda a comprender mejor tu situacion.

Como mencionas una condicion relacionada con tu salud, quiero ser cuidadoso con las recomendaciones. Todo lo que te comente tiene fines educativos y de bienestar, y no reemplaza las indicaciones de tu profesional de salud.

Dicho esto, puedo orientarte sobre como funcionan los productos FUXION y como suelen integrarse dentro de un estilo de vida saludable.`,

  `Aprecio que me cuentes sobre tu situacion. Es importante para orientarte mejor.

Quiero mencionarte que las sugerencias que comparto son de bienestar general y no sustituyen la opinion de tu medico. Con eso en mente, puedo explicarte como ciertos productos FuXion pueden complementar tu rutina saludable.`,

  `Entiendo tu situacion y me alegra que busques alternativas de bienestar.

Todo lo que conversemos tiene un enfoque educativo y de acompanamiento. Si tienes un tratamiento medico vigente, lo ideal es que confirmes cualquier cambio con tu profesional de salud. Puedo compartirte informacion sobre los productos FuXion que podrian interesarte.`,

  `Gracias por la confianza. Tener esa informacion me ayuda a darte una orientacion mas adecuada.

Recuerda que mi rol es educativo y de bienestar. Las opciones que te comparta no reemplazan la atencion medica profesional. Puedo ayudarte a conocer alternativas FuXion que se integran en una rutina de bienestar.`
];

const LEVEL2_SHORT_REMINDER = `Recuerda que estas sugerencias son educativas y complementan las indicaciones de tu profesional de salud.`;

// Registro de sesiones que ya recibieron el disclaimer completo
const sessionDisclaimerShown = new Map();

// Limpieza periódica de registros de disclaimer (cada 30 minutos)
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of sessionDisclaimerShown.entries()) {
    if (now - timestamp > 60 * 60 * 1000) { // 1 hora
      sessionDisclaimerShown.delete(key);
    }
  }
}, 30 * 60 * 1000);

/**
 * Obtiene el mensaje de advertencia Nivel 2 apropiado:
 * - Primera vez en la sesión: variante completa rotada
 * - Mensajes siguientes: recordatorio corto
 */
const getLevel2Warning = (sessionId = '') => {
  const key = sessionId || 'default';
  if (sessionDisclaimerShown.has(key)) {
    return LEVEL2_SHORT_REMINDER;
  }
  sessionDisclaimerShown.set(key, Date.now());
  const index = Math.floor(Math.random() * LEVEL2_WARNING_VARIANTS.length);
  return LEVEL2_WARNING_VARIANTS[index];
};

// ===================================================================
// CLASIFICACIÓN DE TÉRMINOS POR NIVEL DE RIESGO
// ===================================================================
const RISK_LEVELS = [
  {
    level: 1,
    label: 'Bienestar general',
    action: 'continue_normally',
    warningMessage: null,
    keywords: [
      'gases', 'gas', 'inflamacion', 'inflamación', 'hinchazon', 'hinchazón',
      'estreñimiento', 'estrenimiento', 'constipacion', 'constipación',
      'digestion lenta', 'digestión lenta', 'pesadez', 'malestar estomacal',
      'acidez', 'ardor', 'eructos', 'reflujo ocasional',
      'cansancio', 'fatiga', 'agotamiento', 'sin energia', 'sin energía',
      'energia baja', 'energía baja', 'falta de energia', 'falta de energía',
      'sueño', 'insomnio', 'dormir mal', 'descansar',
      'estres', 'estrés', 'nervios', 'ansiedad', 'preocupacion', 'preocupación',
      'concentracion', 'concentración', 'enfoque', 'memoria',
      'piel seca', 'piel grasa', 'acné', 'acne', 'barros', 'espinillas',
      'uñas quebradizas', 'cabello debil', 'cabello débil', 'caida del cabello', 'caída del cabello',
      'articulaciones', 'dolor articular leve', 'molestias articulares',
      'colon irritable', 'sindrome de colon irritable', 'síndrome de colon irritable',
      'intolerancia', 'lactosa', 'gluten',
      'retencion de liquidos', 'retención de líquidos', 'celulitis',
      'antojos', 'ansiedad por comer', 'apetito',
      'defensas bajas', 'inmunidad baja', 'resfriados frecuentes',
      'mal aliento', 'halitosis',
      'orina turbia', 'olor fuerte orina',
      'menopausia', 'sintomas menopausia', 'síntomas menopausia',
      'regla dolorosa', 'menstruacion dolorosa', 'menstruación dolorosa',
      'bajo deseo', 'falta de libido', 'baja libido'
    ]
  },
  {
    level: 2,
    label: 'Condición médica estable',
    action: 'continue_with_care',
    // warningMessage se genera dinámicamente mediante getLevel2Warning()
    warningMessage: null,
    keywords: [
      'higado graso', 'hígado graso', 'higado graso no alcoholico', 'hígado graso no alcohólico',
      'esteatosis hepatica', 'esteatosis hepática', 'enfermedad hepatica', 'enfermedad hepática',
      'colesterol alto', 'colesterol elevado', 'hipercolesterolemia',
      'trigliceridos altos', 'triglicéridos altos',
      'hipertension', 'hipertensión', 'presion alta', 'presión alta', 'tension alta', 'tensión alta',
      'diabetes', 'diabetes tipo 2', 'diabetes controlada', 'prediabetes',
      'azucar alta', 'azúcar alta', 'glucosa alta',
      'gastritis', 'gastritis cronica', 'gastritis crónica',
      'reflujo', 'reflujo gastroesofagico', 'reflujo gastroesofágico', 'hernia hiatal',
      'colon irritable', 'sindrome de intestino irritable', 'síndrome de intestino irritable', 'SII',
      'tiroides', 'hipotiroidismo', 'hipertiroidismo', 'tiroides lenta', 'tiroides acelerada',
      'higado graso', 'hígado graso',
      'higado graso no alcoholico', 'hígado graso no alcohólico',
      'enfermedad hepatica', 'enfermedad hepática'
    ]
  },
  {
    level: 3,
    label: 'Riesgo elevado',
    action: 'refer_to_emergency',
    warningMessage: `Lo que mencionas requiere atencion medica inmediata. No soy la persona indicada para ayudarte con esto.

Por favor, contacta a un servicio de urgencia o acude al centro de salud mas cercano.

Tu salud es lo mas importante.`,
    keywords: [
      'dolor intenso en el pecho', 'dolor en el pecho', 'dolor toracico', 'dolor torácico',
      'dificultad para respirar', 'falta de aire', 'ahogo', 'asfixia',
      'sangrado importante', 'hemorragia', 'sangrado abundante',
      'perdida de conciencia', 'pérdida de conciencia', 'desmayo', 'inconsciente',
      'convulsiones', 'ataque epileptico', 'ataque epiléptico',
      'fiebre alta persistente', 'fiebre muy alta', 'hipertermia',
      'sintomas neurologicos agudos', 'síntomas neurológicos agudos',
      'paralisis', 'parálisis', 'entumecimiento repentino',
      'dificultad para hablar', 'habla arrastrada',
      'dolor abdominal intenso', 'dolor insoportable',
      'traumatismo', 'accidente grave', 'quemadura grave',
      'sobredosis', 'intoxicacion grave', 'intoxicación grave',
      'reaccion alergica grave', 'reacción alérgica grave', 'anafilaxia',
      'intento de suicidio', 'pensamientos suicidas',
      'emergencia', 'urgencia medica', 'urgencia médica'
    ]
  }
];

// ===================================================================
// FUNCIONES PRINCIPALES DEL MRA
// ===================================================================

/**
 * Normaliza texto para comparación de keywords
 */
const normalizeText = (text = '') => {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Evalúa el nivel de riesgo del mensaje del usuario
 *
 * @param {string} userMessage - El mensaje del usuario
 * @param {string} sessionId - ID de sesión para tracking de disclaimers
 * @returns {object} Resultado con nivel de riesgo, acción y mensaje de advertencia
 */
export const assessRisk = (userMessage = '', sessionId = '') => {
  if (!userMessage) {
    return {
      level: 1,
      label: 'Bienestar general',
      action: 'continue_normally',
      warningMessage: null,
      detectedConditions: [],
      shouldWarn: false
    };
  }

  const normalized = normalizeText(userMessage);
  const detectedConditions = [];

  // Evaluar de mayor a menor riesgo
  for (const riskLevel of RISK_LEVELS) {
    for (const keyword of riskLevel.keywords) {
      const normalizedKeyword = normalizeText(keyword);
      if (normalized.includes(normalizedKeyword)) {
        detectedConditions.push({
          condition: keyword,
          level: riskLevel.level,
          label: riskLevel.label
        });
      }
    }
  }

  // Determinar el nivel máximo de riesgo
  const maxRisk = detectedConditions.length > 0
    ? Math.max(...detectedConditions.map(c => c.level))
    : 1;

  const riskConfig = RISK_LEVELS.find(r => r.level === maxRisk) || RISK_LEVELS[0];

  // Para nivel 2, generar advertencia dinámica (rotada + con memoria)
  let warningMessage = riskConfig.warningMessage;
  if (maxRisk === 2) {
    warningMessage = getLevel2Warning(sessionId);
  }

  return {
    level: maxRisk,
    label: riskConfig.label,
    action: riskConfig.action,
    warningMessage,
    detectedConditions: detectedConditions.map(c => c.condition),
    shouldWarn: maxRisk >= 2 && warningMessage !== null
  };
};

/**
 * Genera el contexto de riesgo para inyectar en el prompt
 */
export const generateRiskContext = (userMessage = '', sessionId = '') => {
  const assessment = assessRisk(userMessage, sessionId);
  if (!assessment) return '';

  const lines = [];
  lines.push('=== EVALUACION DE RIESGO MEDICO ===');
  lines.push(`Nivel de riesgo: ${assessment.level}`);
  lines.push(`Clasificacion: ${assessment.label}`);

  if (assessment.detectedConditions.length > 0) {
    lines.push(`Condiciones detectadas: ${assessment.detectedConditions.join(', ')}`);
  }

  lines.push(`Accion: ${assessment.action}`);

  if (assessment.level === 1) {
    lines.push('Instruccion: Continuar normalmente. No se requiere advertencia medica.');
  } else if (assessment.level === 2) {
    lines.push('Instruccion: Incluir advertencia de precaucion al inicio de la respuesta.');
    lines.push('Instruccion: NO derivar a WhatsApp. NO cortar la conversacion.');
    lines.push('Instruccion: Continuar con el plan de bienestar despues de la advertencia.');
    lines.push('Instruccion: No realizar diagnosticos ni recomendar tratamientos.');
    if (assessment.warningMessage) {
      lines.push(`Advertencia sugerida: ${assessment.warningMessage}`);
    }
  } else if (assessment.level === 3) {
    lines.push('Instruccion: PRIORIDAD MAXIMA. Sugerir atencion medica inmediata.');
    lines.push('Instruccion: Detener recomendaciones comerciales.');
  }

  lines.push('=== FIN EVALUACION DE RIESGO ===');

  return lines.join('\n');
};

/**
 * Obtiene el mensaje de advertencia para nivel 2 (condición estable)
 */
export const getWarningMessage = (userMessage = '', sessionId = '') => {
  const assessment = assessRisk(userMessage, sessionId);
  return assessment.warningMessage;
};

export default {
  assessRisk,
  generateRiskContext,
  getWarningMessage,
  getLevel2Warning
};
