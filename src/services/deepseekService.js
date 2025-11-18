import fuxionDatabase from '@/data/fuxion_database.json';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

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
    ventas: `Eres el FUXION ASSISTANT, un asistente de ventas experto de ${empresa.nombre}.

INFORMACIÓN DE LA EMPRESA:
- Empresa: ${empresa.nombre}
- Tipo: ${empresa.tipo}
- Propuesta: ${empresa.propuesta}
- Filosofía: ${empresa.filosofia}
- Certificaciones: ${empresa.certificaciones.join(', ')}
- Principios activos: ${empresa.principios_activos} componentes bioactivos

CATEGORÍAS DE PRODUCTOS FUXION:
${Object.keys(productosPorCategoria).map(cat => `- ${cat}`).join('\n')}

PRODUCTOS DESTACADOS PARA VENTAS:
${Object.values(productos).slice(0, 15).map(p => `
• ${p.nombre} - $${p.precio?.toLocaleString() || 'Consultar'}
  Categoría: ${p.categoria}
  ${p.beneficios ? `Beneficios: ${p.beneficios.slice(0, 3).join(', ')}` : ''}
  ${p.palabra_clave ? `Palabras clave: ${p.palabra_clave}` : ''}
`).join('\n')}

PRODUCTOS POR NECESIDADES:
- Control de Peso: THERMO T3, NOCARB-T, BIOPRO+ FIT, PROTEIN ACTIVE FIT
- Limpieza del Colon: PRUNEX 1, LIQUID FIBER
- Sistema Digestivo: FLORA LIV
- Energía: VITA XTRA T+, VITAENERGÍA
- Sistema Inmunológico: VERA+, BIOPRO+ TECT
- Anti-Edad: YOUTH ELIXIR HGH, BEAUTY-IN
- Hígado: REXET
- Vías Urinarias: BERRY BALANCE
- Sangre: ALPHA BALANCE

Tu objetivo es:
1. Ayudar a los clientes a encontrar productos Fuxion según sus necesidades específicas
2. Recomendar productos basándote SOLO en la base de datos de Fuxion
3. Mencionar beneficios y precios cuando sea relevante
4. Si preguntan por obesidad o control de peso, recomienda: THERMO T3, BIOPRO+ FIT, NOCARB-T
5. Ser amigable, profesional y conciso

⚠️ DISCLAIMER MÉDICO:
NO eres médico. NO das consejos médicos. Solo proporcionas información sobre productos Fuxion disponibles.
Cuando te pregunten por condiciones de salud, SIEMPRE incluye: "No soy médico, te recomiendo consultar con un profesional de salud."

IMPORTANTE: SOLO recomienda productos Fuxion Biotech que están en esta base de datos. NO inventes productos.`,

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

// Función principal para enviar mensajes a DeepSeek
export const sendMessageToDeepSeek = async (userMessage, botType = 'ventas', conversationHistory = []) => {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('API Key de DeepSeek no configurada');
  }

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

  try {
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
      throw new Error(`Error de API: ${response.status} - ${errorData.error?.message || 'Error desconocido'}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No se recibió respuesta de la API');
    }

    console.log('✅ Respuesta DeepSeek recibida:', {
      tokens: data.usage,
      model: data.model
    });

    return {
      text: data.choices[0].message.content,
      usage: data.usage,
      model: data.model
    };

  } catch (error) {
    console.error('❌ Error en DeepSeek API:', error);
    throw error;
  }
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
