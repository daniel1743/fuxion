/**
 * Utilidad para probar los bots del foro manualmente
 * Ejecuta en la consola del navegador: window.testBotNow()
 */

import { simulateForumActivity } from '@/services/forumBotService';

export const testBotNow = async () => {
  console.log('🤖 Probando bot manualmente...');

  // Obtener el contexto del foro desde localStorage
  const questions = JSON.parse(localStorage.getItem('forumQuestions') || '[]');

  console.log(`📊 Preguntas actuales: ${questions.length}`);

  // Crear funciones mock para probar
  const mockAddQuestion = (questionData) => {
    console.log('✅ Nueva pregunta creada:', questionData.title);
    const newQuestion = {
      id: Date.now(),
      ...questionData,
      votes: 0,
      answers: 0,
      views: 0,
      solved: false,
      createdAt: new Date().toISOString(),
    };

    const currentQuestions = JSON.parse(localStorage.getItem('forumQuestions') || '[]');
    currentQuestions.push(newQuestion);
    localStorage.setItem('forumQuestions', JSON.stringify(currentQuestions));

    console.log('💾 Guardado en localStorage');
    return newQuestion;
  };

  const mockAddAnswer = (questionId, answerData) => {
    console.log('✅ Nueva respuesta creada para pregunta', questionId);
    const newAnswer = {
      id: Date.now(),
      questionId,
      ...answerData,
      votes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString(),
    };

    const currentAnswers = JSON.parse(localStorage.getItem('forumAnswers') || '{}');
    if (!currentAnswers[questionId]) {
      currentAnswers[questionId] = [];
    }
    currentAnswers[questionId].push(newAnswer);
    localStorage.setItem('forumAnswers', JSON.stringify(currentAnswers));

    console.log('💾 Respuesta guardada en localStorage');
    return newAnswer;
  };

  const mockContext = {
    questions,
    addQuestion: mockAddQuestion,
    addAnswer: mockAddAnswer
  };

  try {
    const result = await simulateForumActivity(mockContext);
    console.log(`🎉 Bot completó actividad: ${result}`);
    console.log('🔄 Recarga la página para ver los cambios');
  } catch (error) {
    console.error('❌ Error ejecutando bot:', error);
  }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
  window.testBotNow = testBotNow;
}

export default testBotNow;
