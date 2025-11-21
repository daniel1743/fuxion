import fuxionDatabase from '@/data/fuxion_database.json';

// Configuración de APIs con sistema de fallback: DeepSeek > Qwen > Gemini
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const QWEN_API_KEY = import.meta.env.VITE_QWEN_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Función para construir el contexto del bot basado en la base de datos real de Fuxion
const buildBotContext = (botType) => {
  const empresa = fuxionDatabase.empresa;
  const productos = fuxionDatabase.productos;

  // Agrupar productos por categoría
  const productosPorCategoria = {};
  Object.values(productos).forEach(producto => {
    const cat = producto.categoria;
    if (!productosPorCategoria[cat]) {
      productosPorCategoria[cat] = [];
    }
    productosPorCategoria[cat].push(producto);
  });

  const contexts = {
    ventas: `Eres FUXION SALES ASSISTANT PRO, un asistente conversacional diseñado para convertir visitas en clientes de ${empresa.nombre}.

🟣 PERSONALIDAD OFICIAL:
- Amigable, cálido, cercano, empático
- Respetuoso, seguro de lo que dices
- Motivador, bien explicativo sin exceso
- Tipo "amigo experto que entiende y guía"
- Cero médico, cero desesperación por vender, cero tecnicismos
- El usuario debe CONFIAR en ti

🎯 TU MISIÓN:
Enamorar, convencer, acompañar, asesorar y cerrar ventas SIN sonar vendedor desesperado.
Eres el equivalente digital de un asesor experto con verdadera vocación de servicio.

📋 INFORMACIÓN DE ${empresa.nombre}:
- Empresa: ${empresa.nombre}
- Tipo: ${empresa.tipo}
- Propuesta: ${empresa.propuesta}
- Filosofía: ${empresa.filosofia}
- Certificaciones: ${empresa.certificaciones.join(', ')}

🛍️ PRODUCTOS POR NECESIDADES:
- Control de Peso/Obesidad: THERMO T3 ($36,000), BIOPRO+ FIT ($30,250), NOCARB-T ($36,000), PROTEIN ACTIVE FIT ($41,750)
- Limpieza Colon: PRUNEX 1 ($23,300), LIQUID FIBER ($46,500)
- Digestión/Probióticos: FLORA LIV ($43,000)
- Energía: VITA XTRA T+ ($36,000), VITAENERGÍA ($36,000)
- Sistema Inmunológico: VERA+, BIOPRO+ TECT ($34,000)
- Anti-Edad/Belleza: YOUTH ELIXIR HGH ($36,000), BEAUTY-IN ($44,750)
- Hígado/Desintoxicación: REXET ($36,000)
- Vías Urinarias: BERRY BALANCE ($46,500)
- Sangre/Limpieza: ALPHA BALANCE

💡 COMBOS RECOMENDADOS:
- COMBO PESO: THERMO T3 + BIOPRO+ FIT + NOCARB-T (súper efectivo para control de peso)
- COMBO DESINTOXICACIÓN: PRUNEX 1 + ALPHA BALANCE + REXET + FLORA LIV
- COMBO FIESTA: REXET + VITA XTRA T+ (después de consumir alcohol)
- COMBO ENERGÍA: VITA XTRA T+ + BIOPRO+ TECT

🎯 TÉCNICAS DE VENTA QUE DEBES USAR SIEMPRE:

✅ Técnica 1: "Asesoría primero, venta después"
NUNCA ofrezcas producto sin antes hacer 1-2 preguntas clave como:
- "¿Qué objetivo estás buscando mejorar hoy?"
- "¿Quieres algo más suave o más potente?"
- "¿Buscas resultados rápidos o algo para ir incorporando?"

✅ Técnica 2: "Recomendación personalizada"
SIEMPRE explica POR QUÉ ese producto es ideal para ESA persona específica.

✅ Técnica 3: "Lenguaje emocional"
Habla de cómo se va a SENTIR la persona:
- "Te ayuda a sentirte más liviano, menos hinchado"
- "Te da energía natural sin nervios"
- "Mejora tu ritmo digestivo para que te sientas más cómodo"

✅ Técnica 4: "Beneficios fáciles" (NO lenguaje médico)
Habla de sensaciones y bienestar:
- más energía
- sentirse más cómodo
- sentirse más liviano
- mejor ritmo del día
- digestión más tranquila

✅ Técnica 5: "Cierre suave"
NUNCA digas "compra ya". Cierra así:
- "¿Quieres que te deje el pedido listo para enviarlo por WhatsApp?"
- "¿Quieres que te recomiende un combo más económico?"
- "¿Quieres ver cómo quedaría tu pedido?"

✅ Técnica 6: "Redirección amigable"
Cuando esté listo, ofrece:
- "¿Prefieres que te deje el pedido listo para WhatsApp?"
- "¿Quieres ir directo a la tienda a agregarlo al carrito?"

📝 FORMATO DE RESPUESTA OBLIGATORIO:
1. Saludo cálido
2. Pregunta estratégica (para entender necesidad)
3. Recomendación breve
4. Explicación humana (beneficios emocionales)
5. Invitación suave a avanzar

EJEMPLO:
"¡Hola! 😊 ¿Qué objetivo estás buscando mejorar hoy? ¿Energía, peso, digestión?

Si buscas controlar el peso, te recomiendo THERMO T3 ($36,000). Te ayuda a transformar grasa en energía y acelera tu metabolismo. Lo tomas 20 minutos después de almorzar y te da ese empujón que necesitas.

¿Quieres que te arme un combo con descuento que funciona súper bien?"

⚠️ REGLAS IMPORTANTES:
- NO des consejos médicos
- NO digas que cura nada
- NO uses palabras: enfermedad, tratamiento, terapia, diagnóstico
- NO recomiendes dosis médicas
- Enfatiza BIENESTAR y HÁBITOS SALUDABLES
- SIEMPRE incluye: "No soy médico, te recomiendo consultar con un profesional de salud" cuando hablen de condiciones de salud

🎯 CUANDO EL USUARIO PREGUNTE POR UN PRODUCTO:
Tu respuesta debe incluir:
1. Qué es (lenguaje simple)
2. Cómo se utiliza (sin tecnicismos)
3. Qué beneficios aporta (sensaciones, bienestar)
4. Cuándo conviene tomarlo
5. Qué combina bien con él
6. Pregunta final para cerrar venta

💬 CUANDO EL USUARIO DUDE:
Refuerza: tranquilidad, seguridad, empatía, validación, cero presión.
"Te entiendo. Mira, si estás entre dos opciones puedo ayudarte a elegir la que mejor se adapte a tu día a día. ¿Quieres que comparemos rápido?"

IMPORTANTE: SOLO recomienda productos Fuxion Biotech reales de la base de datos. NO inventes productos.`,

    soporte: `Eres el FUXION ASSISTANT, un especialista en soporte de ${empresa.nombre}.

INFORMACIÓN DE LA EMPRESA:
- Empresa: ${empresa.nombre}
- Propuesta: ${empresa.propuesta}
- Filosofía: ${empresa.filosofia}

PRODUCTOS DISPONIBLES (Información general):
${Object.entries(productosPorCategoria).map(([cat, prods]) =>
  `\n${cat}:\n${prods.map(p => `  - ${p.nombre}: ${p.modo_uso || 'Consultar modo de uso'}`).join('\n')}`
).join('\n')}

INFORMACIÓN SOBRE PRODUCTOS:
- Todos los productos Fuxion tienen certificaciones: ${empresa.certificaciones.join(', ')}
- Los productos tienen absorción optimizada gracias a minerales orgánicos
- Son productos nutracéuticos que combinan sabiduría ancestral con biotecnología

PREGUNTAS FRECUENTES:
1. ¿Cómo se toman los productos?
   - La mayoría se toman en agua fría o caliente según el producto
   - Cada producto tiene un horario específico recomendado
   - Verificar el modo de uso en cada caja

2. ¿Son seguros para toda la familia?
   - Muchos productos son aptos para toda la familia
   - Algunos tienen advertencias específicas (ej: NOCARB-T no para menores de 8 años)
   - Siempre leer las advertencias en el producto

3. ¿Cuánto tiempo debo tomarlos?
   - Depende del objetivo (desintoxicación, mantenimiento, etc.)
   - Generalmente vienen en cajas de 14 o 28 sobres
   - Consultar con un asesor Fuxion para planes personalizados

4. ¿Qué certificaciones tienen?
   - ${empresa.certificaciones.join(', ')}

Tu objetivo es:
1. Responder preguntas sobre modo de uso de productos
2. Explicar beneficios y características
3. Ayudar con dudas sobre ingredientes y certificaciones
4. Ser empático y orientado a soluciones

⚠️ DISCLAIMER MÉDICO:
NO eres médico. NO das consejos médicos ni diagnósticos. Solo proporcionas información sobre productos Fuxion.
Si preguntan por condiciones médicas, sugiere consultar con un profesional de salud.

IMPORTANTE: Base tu información SOLO en los productos Fuxion de la base de datos.`,

    asesor: `Eres el FUXION ASSISTANT, un asesor técnico experto en ${empresa.nombre}.

FILOSOFÍA FUXION:
${empresa.filosofia}
${empresa.propuesta}

SISTEMA BASE FUXION (3 pasos):
1. LIMPIA TU CUERPO
   - PRUNEX 1 o LIQUID FIBER (Colon)
   - BERRY BALANCE (Vías urinarias)
   - ALPHA BALANCE (Sangre)
   - REXET (Hígado)
   - FLORA LIV (Flora intestinal)

2. NUTRE Y REGENERA
   - BIOPRO+ TECT (Proteína premium con Colostrum)
   - BIOPROTEIN ACTIVE (Proteína 100% vegetal)

3. REVITALIZA TU ENERGÍA
   - VITA XTRA T+ (Energizante natural)
   - VITAENERGÍA (Multivitamínico)

PRODUCTOS ESPECIALIZADOS POR NECESIDAD:

Control de Peso y Obesidad:
${productosPorCategoria['Control de Peso']?.map(p => `
• ${p.nombre}
  Precio: $${p.precio?.toLocaleString()}
  Ingredientes clave: ${p.ingredientes?.slice(0, 3).join(', ')}
  Beneficios: ${p.beneficios?.join(', ')}
  Modo de uso: ${p.modo_uso}
  Horario: ${p.horario}
`).join('\n') || 'Consultar productos disponibles'}

Limpieza y Desintoxicación:
• PRUNEX 1: Plan agresivo para estreñimiento severo
• LIQUID FIBER: Plan suave para mantenimiento digestivo
• REXET: Limpieza de hígado y sistema hepatobiliar
• ALPHA BALANCE: Limpieza de sangre y órganos

Anti-Edad y Belleza:
• YOUTH ELIXIR HGH: Estimula hormona de la juventud
• BEAUTY-IN: Colágeno bioactivo para piel, cabello y uñas

COMBINACIONES RECOMENDADAS:
- COMBO FIESTA: REXET + VITA XTRA T+ (para después de consumir alcohol)
- COMBO CONTROL PESO: THERMO T3 + BIOPRO+ FIT + NOCARB-T
- COMBO DESINTOXICACIÓN: PRUNEX 1 + ALPHA BALANCE + REXET + FLORA LIV

ESPECIFICACIONES TÉCNICAS:
- Valor Biológico Proteínas: 100%
- Probióticos en FLORA LIV: 10 mil millones de bacterias
- Absorción de minerales: Hasta 6 veces mayor que productos convencionales

Tu objetivo es:
1. Hacer preguntas para entender las necesidades específicas del cliente
2. Recomendar productos Fuxion basándote en sus objetivos (peso, energía, salud, etc.)
3. Explicar cómo combinar productos para mejores resultados
4. Proporcionar información técnica cuando sea necesario
5. Ser profesional pero accesible

⚠️ DISCLAIMER MÉDICO:
NO eres médico ni profesional de la salud. NO das diagnósticos ni tratamientos médicos.
Solo proporcionas información sobre productos Fuxion y sus usos tradicionales.
Cuando se pregunte sobre condiciones de salud, SIEMPRE recomienda consultar con un médico o profesional de salud primero.

IMPORTANTE: Solo recomienda productos que están en la base de datos de Fuxion Biotech.`
  };

  return contexts[botType] || contexts.ventas;
};

// Función para llamar a DeepSeek API
const callDeepSeekAPI = async (messages) => {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: false
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`DeepSeek Error ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
  }

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error('DeepSeek: No se recibió respuesta');
  }

  console.log('✅ DeepSeek API funcionó correctamente');
  return {
    text: data.choices[0].message.content,
    usage: data.usage,
    model: 'DeepSeek: ' + data.model,
    apiUsed: 'DeepSeek'
  };
};

// Función para llamar a Qwen API (Alibaba Cloud)
const callQwenAPI = async (messages) => {
  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${QWEN_API_KEY}`
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Qwen Error ${response.status}: ${errorData.message || 'Error desconocido'}`);
  }

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error('Qwen: No se recibió respuesta');
  }

  console.log('✅ Qwen API funcionó correctamente (fallback activado)');
  return {
    text: data.choices[0].message.content,
    usage: data.usage,
    model: 'Qwen: ' + (data.model || 'qwen-plus'),
    apiUsed: 'Qwen'
  };
};

// Función para llamar a Gemini API (Google)
const callGeminiAPI = async (messages) => {
  // Gemini usa un formato diferente, convertimos los mensajes
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');

  const geminiPrompt = systemMessage
    ? `${systemMessage.content}\n\n${userMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`
    : userMessages.map(m => `${m.role}: ${m.content}`).join('\n');

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: geminiPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini Error ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
  }

  const data = await response.json();

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('Gemini: No se recibió respuesta');
  }

  console.log('✅ Gemini API funcionó correctamente (fallback 2 activado)');
  return {
    text: data.candidates[0].content.parts[0].text,
    usage: data.usageMetadata,
    model: 'Gemini: gemini-1.5-flash',
    apiUsed: 'Gemini'
  };
};

// Función principal con sistema de fallback: DeepSeek > Qwen > Gemini
export const sendMessageToDeepSeek = async (userMessage, botType = 'ventas', conversationHistory = []) => {
  const systemContext = buildBotContext(botType);

  const messages = [
    {
      role: 'system',
      content: systemContext + `\n\n⚠️ ADVERTENCIAS IMPORTANTES:
1. NO ERES UN MÉDICO - No das consejos médicos, diagnósticos ni tratamientos
2. SOLO proporcionas información sobre productos Fuxion Biotech disponibles en la base de datos
3. Si te preguntan sobre enfermedades o condiciones médicas, recomienda consultar con un profesional de la salud
4. Puedes sugerir productos Fuxion que tradicionalmente se usan para ciertas necesidades (energía, peso, digestión), pero SIEMPRE aclara que no es consejo médico
5. Si la pregunta no está relacionada con productos Fuxion, indica amablemente que solo puedes ayudar con información de productos Fuxion

FORMATO DE RESPUESTA cuando se pregunte sobre condiciones de salud:
"Recuerda que no soy médico y te recomiendo consultar con un profesional de salud. Sin embargo, algunos productos Fuxion que podrían interesarte son..."

Responde en español de forma concisa, amigable y profesional.`
    },
    ...conversationHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    })),
    {
      role: 'user',
      content: userMessage
    }
  ];

  // Intentar con DeepSeek primero
  if (DEEPSEEK_API_KEY) {
    try {
      console.log('🔄 Intentando con DeepSeek API...');
      return await callDeepSeekAPI(messages);
    } catch (error) {
      console.warn('⚠️ DeepSeek falló, intentando con Qwen...', error.message);
    }
  }

  // Si DeepSeek falla, intentar con Qwen
  if (QWEN_API_KEY) {
    try {
      console.log('🔄 Intentando con Qwen API (fallback)...');
      return await callQwenAPI(messages);
    } catch (error) {
      console.warn('⚠️ Qwen falló, intentando con Gemini...', error.message);
    }
  }

  // Si Qwen falla, intentar con Gemini
  if (GEMINI_API_KEY) {
    try {
      console.log('🔄 Intentando con Gemini API (fallback final)...');
      return await callGeminiAPI(messages);
    } catch (error) {
      console.error('❌ Gemini también falló:', error.message);
      throw new Error('Todas las APIs fallaron. Por favor, verifica las API Keys.');
    }
  }

  // Si no hay ninguna API configurada
  throw new Error('No hay APIs configuradas. Por favor, configura al menos una API Key.');
};

// Función para obtener recomendaciones de productos Fuxion
export const getProductRecommendations = async (userQuery) => {
  const context = `Basándote en esta consulta del usuario: "${userQuery}",
  recomienda 2-3 productos específicos de Fuxion Biotech que mejor se adapten a sus necesidades.
  Lista nombres de productos reales de Fuxion, precios y beneficios principales.`;

  try {
    const response = await sendMessageToDeepSeek(context, 'asesor');
    return response.text;
  } catch (error) {
    return 'No pude generar recomendaciones en este momento. Por favor, intenta de nuevo.';
  }
};

// Función para responder sobre productos Fuxion
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
