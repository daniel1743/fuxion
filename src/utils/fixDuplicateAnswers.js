/**
 * Script para corregir respuestas duplicadas en el foro
 * Reemplaza respuestas similares con variaciones únicas según personalidades de bots
 */

import faqDatabase from '@/data/fuxionForumData.json';

// Perfiles de bots (copiados del servicio)
const BOT_PROFILES = [
  {
    name: 'ConsumidorRegular',
    avatar: '👤',
    style: 'casual',
    tone: 'amigable',
  },
  {
    name: 'NutricionistaExp',
    avatar: '👨‍⚕️',
    style: 'profesional',
    tone: 'técnico',
  },
  {
    name: 'CuriosoPreguntón',
    avatar: '🤔',
    style: 'inquisitivo',
    tone: 'curioso',
  },
  {
    name: 'Sabelotodo',
    avatar: '🧠',
    style: 'autoritario',
    tone: 'confiado',
  },
  {
    name: 'NeuroticoPreocupado',
    avatar: '😰',
    style: 'ansioso',
    tone: 'preocupado',
  },
  {
    name: 'VendedorInformado',
    avatar: '💼',
    style: 'comercial',
    tone: 'servicial',
  },
  {
    name: 'PrincipianteInseguro',
    avatar: '🆕',
    style: 'tímido',
    tone: 'dudoso',
  },
];

/**
 * Genera variaciones por personalidad
 */
function generateVariationsByPersonality(bot, faqItem) {
  const base = faqItem.respuesta;
  const baseLower = faqItem.respuesta.toLowerCase();
  
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
    'Sabelotodo': [
      `Exacto! ${base} Eso es correcto.`,
      `${base} Así es como funciona, lo sé porque lo he estudiado.`,
      `Efectivamente: ${base} Esto lo sé por experiencia propia y documentada.`,
      `${base} Puedo confirmarlo, es la información correcta.`,
      `Correcto. ${base} Esto es así porque los componentes trabajan de esa forma.`,
      `${base} Lo sé con certeza, esta es la respuesta precisa.`,
    ],
    'VendedorInformado': [
      `${base} Si necesitas más info o combos, pregúntame!`,
      `${base} Yo lo vendo y he visto excelentes resultados. Te puedo ayudar si quieres.`,
      `${base} He ayudado a muchas personas con esto. Si te interesa, conversamos!`,
      `Excelente pregunta! ${base} Si quieres te ayudo a armar tu plan.`,
      `${base} Como vendedor, he visto casos exitosos. ¿Te interesa?`,
      `${base} Lo tengo disponible si te sirve. Con gusto te ayudo!`,
    ],
    'CuriosoPreguntón': [
      `${base} Alguien sabe más sobre esto?`,
      `Interesante! ${base} X eso funciona entonces?`,
      `${base} Tb hay otras opciones o solo esa?`,
      `Oka, ${baseLower} Pero xq funciona así?`,
      `${base} Alguien más lo probó? Quiero confirmar`,
      `Gracias! ${base} Tb funciona para otras cosas?`,
    ],
    'NeuroticoPreocupado': [
      `${base} Pero no tiene efectos secundarios cierto??`,
      `Ok pero ${baseLower} Es seguro?? No me hará mal??`,
      `${base} Alguien tuvo algún problema con esto??`,
      `Gracias! ${base} Seguro que no tiene contraindicaciones??`,
      `${base} Estoy preocupado, será que me cae mal??`,
      `Agradezco la info pero ${baseLower} Es realmente seguro??`,
    ],
    'PrincipianteInseguro': [
      `${base} No sé si será así pero espero que sí...`,
      `Gracias! ${base} Será que funciona para mi caso??`,
      `${base} Espero que funcione, estoy un poco inseguro...`,
      `Ok, ${baseLower} No sé si lo entiendo bien pero gracias!`,
      `${base} Será que es seguro? No quiero que me haga mal...`,
      `Gracias por la info! ${base} Confío en que me servirá...`,
    ],
  };

  if (personalityVariations[bot.name]) {
    const variations = personalityVariations[bot.name];
    return variations[Math.floor(Math.random() * variations.length)];
  }

  // Fallback genérico
  const genericVariations = [
    `${base}`,
    `${base} 👍`,
    `Mira, ${baseLower}`,
    `En mi experiencia, ${baseLower}`,
    `${base} Espero que te sirva!`,
    `Según lo que sé: ${base}`,
    `${base} Probablemente te sirva.`,
  ];

  return genericVariations[Math.floor(Math.random() * genericVariations.length)];
}

/**
 * Calcula similitud entre dos textos
 */
function calculateSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const commonWords = words1.filter(w => words2.includes(w));
  const totalWords = Math.max(words1.length, words2.length);
  return totalWords > 0 ? commonWords.length / totalWords : 0;
}

/**
 * Encuentra FAQ relacionada por tags o categoría
 */
function findRelatedFAQ(tags, category) {
  if (tags && tags.length > 0) {
    const allFAQs = Object.values(faqDatabase.porCategoria).flat();
    // Buscar FAQ que tenga al menos un tag en común
    const relatedFAQs = allFAQs.filter(faq =>
      faq.etiquetas && faq.etiquetas.some(tag =>
        tags.some(qTag =>
          qTag.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(qTag.toLowerCase())
        )
      )
    );
    if (relatedFAQs.length > 0) {
      return relatedFAQs[Math.floor(Math.random() * relatedFAQs.length)];
    }
  }

  // Buscar por categoría
  if (category && faqDatabase.porCategoria[category]) {
    const categoryItems = faqDatabase.porCategoria[category];
    if (categoryItems.length > 0) {
      return categoryItems[Math.floor(Math.random() * categoryItems.length)];
    }
  }

  // Fallback: cualquier FAQ aleatoria
  const allFAQs = Object.values(faqDatabase.porCategoria).flat();
  if (allFAQs.length > 0) {
    return allFAQs[Math.floor(Math.random() * allFAQs.length)];
  }

  // Si no hay FAQs, devolver null
  return null;
}

/**
 * Corrige respuestas duplicadas en el foro
 */
export function fixDuplicateAnswers() {
  try {
    // Cargar datos del localStorage
    const savedQuestions = localStorage.getItem('forumQuestions');
    const savedAnswers = localStorage.getItem('forumAnswers');

    if (!savedQuestions || !savedAnswers) {
      console.log('⚠️ No hay datos del foro para corregir');
      return { fixed: 0, total: 0 };
    }

    const questions = JSON.parse(savedQuestions);
    const answers = JSON.parse(savedAnswers);

    let fixedCount = 0;
    const newAnswers = { ...answers };

    // Revisar cada pregunta
    Object.keys(newAnswers).forEach(questionId => {
      const questionAnswers = [...newAnswers[questionId]];
      const question = questions.find(q => q.id === parseInt(questionId));
      
      if (!question || !questionAnswers.length) return;

      // Encontrar respuestas duplicadas o muy similares
      const duplicates = [];
      for (let i = 0; i < questionAnswers.length; i++) {
        for (let j = i + 1; j < questionAnswers.length; j++) {
          const similarity = calculateSimilarity(
            questionAnswers[i].content,
            questionAnswers[j].content
          );

          // Si son más del 70% similares, marcar como duplicados
          if (similarity > 0.7) {
            duplicates.push({
              index: j,
              answer: questionAnswers[j],
              similarity: similarity
            });
          }
        }
      }

      // Reemplazar duplicados con variaciones únicas
      if (duplicates.length > 0) {
        console.log(`🔍 Pregunta ${questionId}: Encontrados ${duplicates.length} duplicados`);

        // Ordenar duplicados por similitud (mayor primero)
        duplicates.sort((a, b) => b.similarity - a.similarity);
        
        // Obtener índices únicos para evitar procesar el mismo índice dos veces
        const processedIndices = new Set();

        duplicates.forEach(({ index, answer }) => {
          if (processedIndices.has(index)) return;
          // Seleccionar un bot diferente al original
          let bot = BOT_PROFILES.find(b => b.name === answer.author) || BOT_PROFILES[0];
          let attempts = 0;
          
          // Intentar usar un bot diferente
          while (bot.name === answer.author && attempts < 5) {
            bot = BOT_PROFILES[Math.floor(Math.random() * BOT_PROFILES.length)];
            attempts++;
          }

          // Si aún es el mismo, seleccionar uno específico diferente
          if (bot.name === answer.author) {
            const otherBots = BOT_PROFILES.filter(b => b.name !== answer.author);
            if (otherBots.length > 0) {
              bot = otherBots[Math.floor(Math.random() * otherBots.length)];
            }
          }

          // Encontrar FAQ relacionada
          let relatedFAQ = findRelatedFAQ(question.tags, question.category);
          
          // Si no se encontró FAQ, crear una básica con la respuesta original
          if (!relatedFAQ) {
            relatedFAQ = {
              respuesta: questionAnswers[0]?.content || 'No hay información disponible sobre esto.',
              etiquetas: question.tags || []
            };
          }

          // Generar nueva respuesta variada
          const newContent = generateVariationsByPersonality(bot, relatedFAQ);

          // Verificar que la nueva respuesta no sea similar a otras existentes
          const isSimilarToOthers = questionAnswers.some((a, idx) => {
            if (idx === index) return false;
            return calculateSimilarity(newContent, a.content) > 0.6;
          });

          // Si sigue siendo similar, generar otra variación
          let finalContent = newContent;
          let retryCount = 0;
          while (isSimilarToOthers && retryCount < 3) {
            finalContent = generateVariationsByPersonality(bot, relatedFAQ);
            retryCount++;
          }

          // Actualizar la respuesta
          questionAnswers[index] = {
            ...answer,
            author: bot.name,
            authorAvatar: bot.avatar,
            content: finalContent
          };

          console.log(`✅ Respuesta ${index} reemplazada por ${bot.name}`);
          fixedCount++;
          processedIndices.add(index);
        });

        // Actualizar las respuestas de esta pregunta
        newAnswers[questionId] = questionAnswers;
      }
    });

    // Guardar las respuestas corregidas
    if (fixedCount > 0) {
      localStorage.setItem('forumAnswers', JSON.stringify(newAnswers));
      console.log(`✨ Total de respuestas corregidas: ${fixedCount}`);
    } else {
      console.log('✅ No se encontraron respuestas duplicadas para corregir');
    }

    return {
      fixed: fixedCount,
      total: Object.values(newAnswers).reduce((sum, arr) => sum + arr.length, 0)
    };
  } catch (error) {
    console.error('❌ Error al corregir respuestas duplicadas:', error);
    return { fixed: 0, total: 0, error: error.message };
  }
}

// Hacer disponible globalmente para ejecutar desde la consola
if (typeof window !== 'undefined') {
  window.fixDuplicateAnswers = fixDuplicateAnswers;
  console.log('✅ Función fixDuplicateAnswers disponible. Ejecuta: fixDuplicateAnswers()');
}

export default fixDuplicateAnswers;

