// Script para generar 15 preguntas iniciales del foro
// Basado en la base de datos de FAQ de Fuxion

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Importar base de datos FAQ
const faqDataRaw = fs.readFileSync('./src/data/fuxionForumData.json', 'utf-8');
const faqData = JSON.parse(faqDataRaw);

// Perfiles de usuarios (bots)
const profiles = [
  { name: 'ConsumidorRegular', avatar: '👤' },
  { name: 'NutricionistaExp', avatar: '👨‍⚕️' },
  { name: 'CuriosoPreguntón', avatar: '🤔' },
  { name: 'Sabelotodo', avatar: '🧠' },
  { name: 'NeuroticoPreocupado', avatar: '😰' },
  { name: 'VendedorInformado', avatar: '💼' },
  { name: 'PrincipianteInseguro', avatar: '🆕' },
  { name: 'María González', avatar: '👩‍💼' },
  { name: 'Carlos Ruiz', avatar: '👨‍💻' },
  { name: 'Ana Silva', avatar: '👩‍🎓' },
];

// Categorías
const categories = [
  'Línea Anti-Edad',
  'Sistema DETOX',
  'Vigor Mental',
  'Control de Peso',
  'Sport',
  'Línea Inmunológica'
];

// Generar fecha aleatoria en las últimas 3 semanas
function getRandomDate() {
  const now = new Date();
  const threeWeeksAgo = new Date(now.getTime() - (21 * 24 * 60 * 60 * 1000));
  const randomTime = threeWeeksAgo.getTime() + Math.random() * (now.getTime() - threeWeeksAgo.getTime());
  return new Date(randomTime).toISOString();
}

// Generar número aleatorio de respuestas (0-4)
function getRandomAnswerCount() {
  const weights = [0.2, 0.3, 0.25, 0.15, 0.1]; // Probabilidades: 0, 1, 2, 3, 4
  const rand = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (rand < sum) return i;
  }
  return 0;
}

// Seleccionar FAQ aleatorio
function getRandomFAQ() {
  const allCategories = Object.values(faqData.porCategoria).flat();
  return allCategories[Math.floor(Math.random() * allCategories.length)];
}

// Seleccionar perfil aleatorio
function getRandomProfile() {
  return profiles[Math.floor(Math.random() * profiles.length)];
}

// Generar variación de pregunta
function generateQuestionVariation(originalQuestion) {
  const variations = [
    originalQuestion,
    `Hola! ${originalQuestion}`,
    `Alguien sabe ${originalQuestion.toLowerCase()}`,
    `Tengo una duda: ${originalQuestion.toLowerCase()}`,
    `${originalQuestion} ??`,
    `Por favor ayuda: ${originalQuestion.toLowerCase()}`,
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

// Generar variación de respuesta
function generateAnswerVariation(originalAnswer) {
  const variations = [
    originalAnswer,
    `${originalAnswer} 👍`,
    `Mira, ${originalAnswer}`,
    `En mi experiencia, ${originalAnswer.toLowerCase()}`,
    `${originalAnswer} Espero que te sirva!`,
    `Te cuento: ${originalAnswer.toLowerCase()}`,
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

// Generar preguntas
function generateQuestions() {
  const questions = [];
  const usedFAQs = new Set();

  for (let i = 0; i < 15; i++) {
    let faq;
    do {
      faq = getRandomFAQ();
    } while (usedFAQs.has(faq.pregunta));
    usedFAQs.add(faq.pregunta);

    const author = getRandomProfile();
    const createdAt = getRandomDate();
    const answerCount = getRandomAnswerCount();

    const question = {
      id: Date.now() + i,
      author: author.name,
      authorAvatar: author.avatar,
      title: generateQuestionVariation(faq.pregunta),
      content: `Hola! ${faq.pregunta}`,
      category: faq.categoria,
      tags: faq.etiquetas,
      votes: Math.floor(Math.random() * 10) + 1,
      answers: answerCount,
      views: Math.floor(Math.random() * 50) + answerCount * 5,
      solved: answerCount > 0 && Math.random() > 0.6,
      createdAt: createdAt,
    };

    questions.push({
      question,
      faqAnswer: faq.respuesta,
      answerCount
    });
  }

  return questions.sort((a, b) =>
    new Date(b.question.createdAt) - new Date(a.question.createdAt)
  );
}

// Generar respuestas para una pregunta
function generateAnswers(questionId, faqAnswer, count) {
  const answers = [];

  for (let i = 0; i < count; i++) {
    const author = getRandomProfile();
    const answer = {
      id: Date.now() + questionId + i,
      questionId: questionId,
      author: author.name,
      authorAvatar: author.avatar,
      content: generateAnswerVariation(faqAnswer),
      votes: Math.floor(Math.random() * 8) + 1,
      isAccepted: i === 0 && Math.random() > 0.5, // Primera respuesta tiene chance de ser aceptada
      createdAt: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
    };
    answers.push(answer);
  }

  return answers;
}

// Generar todo
function generateAllData() {
  const questionsData = generateQuestions();
  const questions = questionsData.map(q => q.question);
  const answers = {};

  questionsData.forEach(({ question, faqAnswer, answerCount }) => {
    if (answerCount > 0) {
      answers[question.id] = generateAnswers(question.id, faqAnswer, answerCount);
    }
  });

  return { questions, answers };
}

// Guardar en localStorage formato
function saveToFile() {
  const data = generateAllData();

  const output = {
    forumQuestions: data.questions,
    forumAnswers: data.answers,
    forumBotsInitialized: new Date().toISOString(),
  };

  // Guardar como JSON
  const outputPath = path.join(__dirname, 'forum-initial-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

  console.log('✅ Datos del foro generados exitosamente!');
  console.log(`📄 Archivo: ${outputPath}`);
  console.log(`📊 ${data.questions.length} preguntas generadas`);

  let totalAnswers = 0;
  Object.keys(data.answers).forEach(key => {
    totalAnswers += data.answers[key].length;
  });
  console.log(`💬 ${totalAnswers} respuestas generadas`);

  console.log('\n🔄 Para cargar estos datos en tu aplicación:');
  console.log('1. Copia el contenido de forum-initial-data.json');
  console.log('2. Abre la consola del navegador (F12) en tu aplicación');
  console.log('3. Pega estos comandos:');
  console.log('\nconst data = ' + JSON.stringify(output, null, 2) + ';');
  console.log('localStorage.setItem("forumQuestions", JSON.stringify(data.forumQuestions));');
  console.log('localStorage.setItem("forumAnswers", JSON.stringify(data.forumAnswers));');
  console.log('localStorage.setItem("forumBotsInitialized", data.forumBotsInitialized);');
  console.log('location.reload();');
}

// Ejecutar
saveToFile();
