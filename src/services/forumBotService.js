// Servicio de Bots Automáticos para el Foro de Fuxion
// Genera interacciones realistas cada 3-4 horas usando la base de datos de FAQ

import faqDatabase from '@/data/fuxionForumData.json';
import { sendMessageToDeepSeek } from './deepseekService';

// Perfil especial del dueño de la página (verificado)
export const OWNER_PROFILE = {
  name: 'Fuxion Shop',
  avatar: '✅',
  style: 'profesional-oficial',
  tone: 'autorizado',
  verified: true,
  isOwner: true,
  prompt: 'Eres el dueño oficial de Fuxion Shop. Respondes con autoridad y conocimiento profundo. Usas un tono profesional pero cercano. Das información precisa sobre productos, envíos, garantías y políticas.'
};

// Perfiles de usuarios del foro con personalidades distintas
const BOT_PROFILES = [
  {
    name: 'ConsumidorRegular',
    avatar: '👤',
    style: 'casual',
    tone: 'amigable',
    prompt: 'Eres un consumidor regular de Fuxion. Hablas de forma casual con "jajaja", "weon", "hermano". Compartes tu experiencia personal con los productos.'
  },
  {
    name: 'NutricionistaExp',
    avatar: '👨‍⚕️',
    style: 'profesional',
    tone: 'técnico',
    prompt: 'Eres nutricionista experto. Das respuestas técnicas pero entendibles. Mencionas ingredientes activos y cómo funcionan. Usas términos como "bioactivo", "absorción", "metabolismo".'
  },
  {
    name: 'CuriosoPreguntón',
    avatar: '🤔',
    style: 'inquisitivo',
    tone: 'curioso',
    prompt: 'Eres muy curioso y haces muchas preguntas. Escribes con errores naturales, sin todos los acentos. Usas "x" en vez de "por", "tb" en vez de "también".'
  },
  {
    name: 'Sabelotodo',
    avatar: '🧠',
    style: 'autoritario',
    tone: 'confiado',
    prompt: 'Crees saberlo todo sobre Fuxion. A veces corriges a otros (con respeto). Compartes datos específicos y hablas con mucha confianza.'
  },
  {
    name: 'NeuroticoPreocupado',
    avatar: '😰',
    style: 'ansioso',
    tone: 'preocupado',
    prompt: 'Eres muy preocupado por efectos secundarios y contraindicaciones. Preguntas mucho sobre seguridad. Escribes con signos de exclamación.'
  },
  {
    name: 'VendedorInformado',
    avatar: '💼',
    style: 'comercial',
    tone: 'servicial',
    prompt: 'Eres vendedor de Fuxion. Ayudas genuinamente pero también vendes. Compartes combos y promociones. Hablas de tu experiencia vendiendo.'
  },
  {
    name: 'PrincipianteInseguro',
    avatar: '🆕',
    style: 'tímido',
    tone: 'dudoso',
    prompt: 'Eres nuevo en Fuxion. Haces preguntas básicas con inseguridad. Usas "no sé si...", "será que...". Pides confirmación constantemente.'
  }
];

// Categorías de temas del foro
const CATEGORIES = [
  'Línea Anti-Edad',
  'Sistema DETOX',
  'Vigor Mental',
  'Control de Peso',
  'Sport',
  'Línea Inmunológica'
];

/**
 * Selecciona un bot aleatorio con personalidad
 */
function getRandomBot() {
  return BOT_PROFILES[Math.floor(Math.random() * BOT_PROFILES.length)];
}

/**
 * Selecciona una categoría aleatoria
 */
function getRandomCategory() {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

/**
 * Obtiene una pregunta/respuesta aleatoria de la base de datos
 */
function getRandomFAQ(category = null) {
  if (category && faqDatabase.porCategoria[category]) {
    const categoryItems = faqDatabase.porCategoria[category];
    return categoryItems[Math.floor(Math.random() * categoryItems.length)];
  }

  // Si no hay categoría, tomar de todas
  const allCategories = Object.values(faqDatabase.porCategoria).flat();
  return allCategories[Math.floor(Math.random() * allCategories.length)];
}

/**
 * Genera una pregunta usando DeepSeek basada en la base de datos
 */
async function generateQuestion(bot, faqItem) {
  // Fallback: usar variaciones de la pregunta original
  const variations = [
    faqItem.pregunta,
    `Hola! ${faqItem.pregunta}`,
    `Alguien sabe ${faqItem.pregunta.toLowerCase()}`,
    `Tengo una duda: ${faqItem.pregunta.toLowerCase()}`,
    `${faqItem.pregunta} ??`,
  ];

  const prompt = `${bot.prompt}

Basándote en este tema de Fuxion: "${faqItem.pregunta}"

Genera UNA pregunta similar pero con tus propias palabras, como si fueras este usuario.
La pregunta debe ser:
- Corta (1-2 líneas máximo)
- Coloquial y natural
- Relacionada con: ${faqItem.etiquetas.join(', ')}
- En el tono de: ${bot.tone}

IMPORTANTE: Solo devuelve la pregunta, nada más. Sin explicaciones.`;

  try {
    const response = await sendMessageToDeepSeek(prompt, 'asesor');
    return response.text.trim();
  } catch (error) {
    console.warn('⚠️ DeepSeek no disponible, usando pregunta de base de datos:', error.message);
    // Fallback: usar una variación aleatoria
    return variations[Math.floor(Math.random() * variations.length)];
  }
}

/**
 * Genera variaciones más naturales de respuestas según la personalidad del bot
 */
function generateVariationsByPersonality(bot, faqItem) {
  const base = faqItem.respuesta;
  const baseLower = faqItem.respuesta.toLowerCase();
  
  // Variaciones específicas por personalidad
  const personalityVariations = {
    'ConsumidorRegular': [
      `Yo uso eso! ${base} La verdad que funciona bien 👍`,
      `A mi me sirvió! ${base} Pruébalo hermano`,
      `Weon, ${baseLower} Yo lo tomo hace rato y me va súper bien`,
      `${base} Yo lo recomiendo, funciona re bien`,
      `A mi me pasó lo mismo. ${base} Pruébalo y me cuentas`,
      `Mi experiencia: ${baseLower} Dale una oportunidad`,
      `${base} En mi opinión es bueno, vale la pena`,
    ],
    'NutricionistaExp': [
      `${base} El mecanismo de acción es bastante efectivo según estudios.`,
      `Desde el punto de vista nutricional: ${base} Los componentes activos son bien absorbidos.`,
      `Técnicamente hablando, ${baseLower} La biodisponibilidad es adecuada.`,
      `${base} Los bioactivos funcionan correctamente en el organismo.`,
      `Según los principios de nutrición: ${base} El metabolismo los procesa bien.`,
      `${base} Los nutrientes están en formas que el cuerpo asimila mejor.`,
    ],
    'CuriosoPreguntón': [
      `${base} Alguien sabe más sobre esto?`,
      `Interesante! ${base} X eso funciona entonces?`,
      `${base} Tb hay otras opciones o solo esa?`,
      `Oka, ${baseLower} Pero xq funciona así?`,
      `${base} Alguien más lo probó? Quiero confirmar`,
      `Gracias! ${base} Tb funciona para otras cosas?`,
    ],
    'Sabelotodo': [
      `Exacto! ${base} Eso es correcto.`,
      `${base} Así es como funciona, lo sé porque lo he estudiado.`,
      `Efectivamente: ${base} Esto lo sé por experiencia propia y documentada.`,
      `${base} Puedo confirmarlo, es la información correcta.`,
      `Correcto. ${base} Esto es así porque los componentes trabajan de esa forma.`,
      `${base} Lo sé con certeza, esta es la respuesta precisa.`,
    ],
    'NeuroticoPreocupado': [
      `${base} Pero no tiene efectos secundarios cierto??`,
      `Ok pero ${baseLower} Es seguro?? No me hará mal??`,
      `${base} Alguien tuvo algún problema con esto??`,
      `Gracias! ${base} Seguro que no tiene contraindicaciones??`,
      `${base} Estoy preocupado, será que me cae mal??`,
      `Agradezco la info pero ${baseLower} Es realmente seguro??`,
    ],
    'VendedorInformado': [
      `${base} Si necesitas más info o combos, pregúntame!`,
      `${base} Yo lo vendo y he visto excelentes resultados. Te puedo ayudar si quieres.`,
      `${base} He ayudado a muchas personas con esto. Si te interesa, conversamos!`,
      `Excelente pregunta! ${base} Si quieres te ayudo a armar tu plan.`,
      `${base} Como vendedor, he visto casos exitosos. ¿Te interesa?`,
      `${base} Lo tengo disponible si te sirve. Con gusto te ayudo!`,
    ],
    'PrincipianteInseguro': [
      `${base} No sé si será así pero espero que sí...`,
      `Gracias! ${base} Será que funciona para mi caso??`,
      `${base} Espero que funcione, estoy un poco inseguro...`,
      `Ok, ${baseLower} No sé si lo entiendo bien pero gracias!`,
      `${base} Será que es seguro? No quiero que me haga mal...`,
      `Gracias por la info! ${base} Confío en que me servirá...`,
    ]
  };

  // Si tenemos variaciones específicas para esta personalidad, usarlas
  if (personalityVariations[bot.name]) {
    const variations = personalityVariations[bot.name];
    return variations[Math.floor(Math.random() * variations.length)];
  }

  // Fallback genérico con más variación
  const genericVariations = [
    `${base}`,
    `${base} 👍`,
    `Mira, ${baseLower}`,
    `En mi experiencia, ${baseLower}`,
    `${base} Espero que te sirva!`,
    `Según lo que sé: ${base}`,
    `${base} Probablemente te sirva.`,
    `Puedo confirmar que ${baseLower}`,
    `${base} Esa es mi experiencia al menos.`,
    `Yo diría que ${baseLower}`,
  ];

  return genericVariations[Math.floor(Math.random() * genericVariations.length)];
}

/**
 * Genera una respuesta usando DeepSeek basada en la base de datos
 */
async function generateAnswer(bot, question, faqItem) {
  // Intentar usar DeepSeek primero para generar respuesta única
  const prompt = `${bot.prompt}

Alguien preguntó: "${question}"

Información de referencia:
- Respuesta base: ${faqItem.respuesta}
- Categoría: ${faqItem.categoria}
- Etiquetas: ${faqItem.etiquetas.join(', ')}

IMPORTANTE: Genera UNA respuesta corta (2-3 líneas máximo) como si fueras este usuario.
La respuesta DEBE:
- Ser completamente ÚNICA y diferente a otras respuestas sobre el mismo tema
- Usar tus propias palabras, NO repetir literalmente la información de referencia
- Reflejar tu personalidad: ${bot.tone}
- Incluir expresiones naturales según tu estilo (${bot.style})
- Ser natural y conversacional
- Variar la estructura y el enfoque de respuesta

EJEMPLOS de cómo variar:
- Si otros dijeron "Producto X + Producto Y = $100", tú podrías decir "Entre Producto X e Y son como $100, vale la pena" o "El combo cuesta alrededor de $100"
- Agrega contexto personal: "A mi me funcionó", "Yo lo uso así", "He visto que..."

IMPORTANTE: Crea una respuesta completamente original, no uses la respuesta base literalmente.`;

  try {
    const response = await sendMessageToDeepSeek(prompt, 'soporte');
    const generatedText = response.text.trim();
    
    // Verificar que la respuesta no sea muy similar a la base
    if (generatedText && generatedText.length > 20) {
      return generatedText;
    }
    // Si DeepSeek devuelve algo muy corto, usar variaciones
    throw new Error('Respuesta muy corta de DeepSeek');
  } catch (error) {
    console.warn('⚠️ DeepSeek no disponible, usando variaciones por personalidad:', error.message);
    // Usar variaciones más inteligentes según personalidad
    return generateVariationsByPersonality(bot, faqItem);
  }
}

/**
 * Crea una pregunta automática en el foro
 */
export async function createAutoBotQuestion(addQuestion) {
  const bot = getRandomBot();
  const category = getRandomCategory();
  const faqItem = getRandomFAQ(category);

  console.log(`🤖 Bot ${bot.name} está creando una pregunta...`);

  const questionText = await generateQuestion(bot, faqItem);

  const questionData = {
    author: bot.name,
    authorAvatar: bot.avatar,
    title: questionText,
    content: `Hola! ${questionText}`,
    category: category,
    tags: faqItem.etiquetas || []
  };

  const newQuestion = addQuestion(questionData);
  console.log(`✅ Pregunta creada por ${bot.name}:`, questionText);

  return newQuestion;
}

/**
 * Crea una respuesta automática a una pregunta existente
 */
export async function createAutoBotAnswer(question, addAnswer, existingAnswers = []) {
  // Evitar que múltiples bots respondan lo mismo
  // Seleccionar un bot que no haya respondido ya a esta pregunta
  let bot = getRandomBot();
  const usedBots = existingAnswers.map(a => a.author);
  
  // Si ya hay respuestas, intentar usar un bot diferente
  let attempts = 0;
  while (usedBots.includes(bot.name) && attempts < 5) {
    bot = getRandomBot();
    attempts++;
  }

  // Buscar FAQ relacionada por tags
  let relatedFAQ = null;
  if (question.tags && question.tags.length > 0) {
    const allFAQs = Object.values(faqDatabase.porCategoria).flat();
    relatedFAQ = allFAQs.find(faq =>
      faq.etiquetas.some(tag =>
        question.tags.some(qTag =>
          qTag.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(qTag.toLowerCase())
        )
      )
    );
  }

  // Si no hay relacionada, tomar una aleatoria de la misma categoría
  if (!relatedFAQ) {
    relatedFAQ = getRandomFAQ(question.category);
  }

  // Generar respuesta única, diferente a las existentes
  console.log(`🤖 Bot ${bot.name} está respondiendo...`);

  let answerText = await generateAnswer(bot, question.title, relatedFAQ);
  
  // Verificar que la respuesta no sea muy similar a las existentes
  const existingTexts = existingAnswers.map(a => a.content.toLowerCase());
  const answerLower = answerText.toLowerCase();
  
  // Si la respuesta es muy similar a alguna existente, generar otra variación
  const isTooSimilar = existingTexts.some(existing => {
    // Calcular similitud simple (palabras en común)
    const existingWords = existing.split(' ').filter(w => w.length > 3);
    const answerWords = answerLower.split(' ').filter(w => w.length > 3);
    const commonWords = existingWords.filter(w => answerWords.includes(w));
    const similarity = commonWords.length / Math.max(existingWords.length, answerWords.length);
    return similarity > 0.7; // Más del 70% de similitud
  });

  // Si es muy similar, usar variación más diferente
  if (isTooSimilar && attempts < 3) {
    console.log(`⚠️ Respuesta muy similar, generando variación...`);
    answerText = generateVariationsByPersonality(bot, relatedFAQ);
    
    // Intentar hacerla más única agregando contexto del bot
    const additions = [
      'Desde mi experiencia personal',
      'En mi caso',
      'Yo lo he visto así',
      'Según lo que he notado',
      'Basándome en lo que sé',
      'A mi me pasó que',
    ];
    const randomAddition = additions[Math.floor(Math.random() * additions.length)];
    
    // Solo agregar si no está ya incluido
    if (!answerText.toLowerCase().includes(randomAddition.toLowerCase().split(' ')[0])) {
      answerText = `${randomAddition}, ${answerText.toLowerCase()}`;
    }
  }

  const answerData = {
    author: bot.name,
    authorAvatar: bot.avatar,
    content: answerText
  };

  const newAnswer = addAnswer(question.id, answerData);
  console.log(`✅ Respuesta única creada por ${bot.name}:`, answerText.substring(0, 50) + '...');

  return newAnswer;
}

/**
 * Simula actividad en el foro (pregunta O respuesta)
 */
export async function simulateForumActivity(forumContext) {
  const { questions, addQuestion, addAnswer, getAnswersByQuestionId } = forumContext;

  // 70% probabilidad de responder a pregunta existente sin respuesta
  // 30% probabilidad de crear nueva pregunta
  const shouldAnswer = Math.random() > 0.3 && questions.length > 0;

  if (shouldAnswer) {
    // Buscar preguntas sin resolver o con pocas respuestas
    const questionsNeedingAnswers = questions.filter(q =>
      !q.solved && q.answers < 3
    );

    if (questionsNeedingAnswers.length > 0) {
      const randomQuestion = questionsNeedingAnswers[
        Math.floor(Math.random() * questionsNeedingAnswers.length)
      ];

      // Obtener respuestas existentes para evitar duplicados
      const existingAnswers = getAnswersByQuestionId ? 
        getAnswersByQuestionId(randomQuestion.id) || [] : 
        [];

      await createAutoBotAnswer(randomQuestion, addAnswer, existingAnswers);
      return 'answer';
    }
  }

  // Si no hay preguntas para responder, crear nueva pregunta
  await createAutoBotQuestion(addQuestion);
  return 'question';
}

/**
 * Inicia el sistema de bots automáticos
 * Primeras 24 horas: cada 45 minutos
 * Después: cada 3-5 horas
 */
export function startForumBots(forumContext) {
  const startTime = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  const FORTY_FIVE_MINUTES = 45 * 60 * 1000;

  // Determinar si estamos en las primeras 24 horas
  const isWithinFirst24Hours = () => {
    const elapsed = Date.now() - startTime;
    return elapsed < TWENTY_FOUR_HOURS;
  };

  // Intervalo aleatorio según el tiempo transcurrido
  const getRandomInterval = () => {
    if (isWithinFirst24Hours()) {
      // Primeras 24 horas: 45 minutos fijos
      return FORTY_FIVE_MINUTES;
    } else {
      // Después: entre 3-5 horas
      const threeHours = 3 * 60 * 60 * 1000;
      const fiveHours = 5 * 60 * 60 * 1000;
      return Math.floor(Math.random() * (fiveHours - threeHours + 1)) + threeHours;
    }
  };

  const scheduleNext = () => {
    const interval = getRandomInterval();
    const minutes = (interval / (60 * 1000)).toFixed(0);
    const hours = (interval / (60 * 60 * 1000)).toFixed(1);

    const timeDisplay = interval < 3600000 ? `${minutes} minutos` : `${hours} horas`;
    const mode = isWithinFirst24Hours() ? '🔥 MODO RÁPIDO (primeras 24h)' : '⏱️ MODO NORMAL';

    console.log(`${mode} - Próxima actividad en ${timeDisplay}`);

    setTimeout(async () => {
      console.log('⏰ Ejecutando actividad programada...');
      try {
        const activityType = await simulateForumActivity(forumContext);
        console.log(`✅ Actividad de bot completada: ${activityType}`);
      } catch (error) {
        console.error('❌ Error en actividad de bot:', error);
        console.error('Stack:', error.stack);
      }

      // Programar la siguiente actividad
      scheduleNext();
    }, interval);
  };

  console.log('🚀 Sistema de bots del foro iniciado');
  console.log('📊 Base de datos cargada:', faqDatabase.metadata.total, 'FAQs');
  console.log('👥 Perfiles disponibles:', BOT_PROFILES.length);
  console.log('⚡ Primeras 24 horas: cada 45 minutos');
  console.log('💤 Después de 24 horas: cada 3-5 horas');

  // Ejecutar primera actividad inmediatamente como prueba
  console.log('🎬 Ejecutando primera actividad inmediatamente...');
  setTimeout(async () => {
    try {
      const activityType = await simulateForumActivity(forumContext);
      console.log(`✅ Primera actividad completada: ${activityType}`);
      console.log('🔄 Recarga la página para ver el nuevo contenido');
    } catch (error) {
      console.error('❌ Error en primera actividad:', error);
      console.error('Stack:', error.stack);
    }

    // Iniciar el ciclo normal
    scheduleNext();
  }, 5000); // 5 segundos después de cargar
}

export default {
  startForumBots,
  simulateForumActivity,
  createAutoBotQuestion,
  createAutoBotAnswer,
  BOT_PROFILES
};
