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
 * Genera una respuesta usando DeepSeek basada en la base de datos
 */
async function generateAnswer(bot, question, faqItem) {
  // Fallback: usar variaciones de la respuesta original
  const variations = [
    faqItem.respuesta,
    `${faqItem.respuesta} 👍`,
    `Mira, ${faqItem.respuesta}`,
    `En mi experiencia, ${faqItem.respuesta.toLowerCase()}`,
    `${faqItem.respuesta} Espero que te sirva!`,
  ];

  const prompt = `${bot.prompt}

Alguien preguntó: "${question}"

Información de referencia:
- Respuesta base: ${faqItem.respuesta}
- Categoría: ${faqItem.categoria}
- Etiquetas: ${faqItem.etiquetas.join(', ')}

Genera UNA respuesta corta (2-3 líneas máximo) como si fueras este usuario.
La respuesta debe:
- Ser natural y coloquial
- Estar basada en la información de referencia pero con tus palabras
- Usar el tono de: ${bot.tone}
- Incluir expresiones como "jajaja", "weon", "hermano", "x", "tb" si es apropiado para tu personalidad

IMPORTANTE: Solo devuelve la respuesta, nada más. Sin explicaciones.`;

  try {
    const response = await sendMessageToDeepSeek(prompt, 'soporte');
    return response.text.trim();
  } catch (error) {
    console.warn('⚠️ DeepSeek no disponible, usando respuesta de base de datos:', error.message);
    // Fallback: usar una variación aleatoria
    return variations[Math.floor(Math.random() * variations.length)];
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
export async function createAutoBotAnswer(question, addAnswer) {
  const bot = getRandomBot();

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

  console.log(`🤖 Bot ${bot.name} está respondiendo...`);

  const answerText = await generateAnswer(bot, question.title, relatedFAQ);

  const answerData = {
    author: bot.name,
    authorAvatar: bot.avatar,
    content: answerText
  };

  const newAnswer = addAnswer(question.id, answerData);
  console.log(`✅ Respuesta creada por ${bot.name}`);

  return newAnswer;
}

/**
 * Simula actividad en el foro (pregunta O respuesta)
 */
export async function simulateForumActivity(forumContext) {
  const { questions, addQuestion, addAnswer } = forumContext;

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

      await createAutoBotAnswer(randomQuestion, addAnswer);
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
