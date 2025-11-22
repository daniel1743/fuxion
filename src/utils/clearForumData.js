/**
 * Utilidad para limpiar datos del foro del localStorage
 * Úsalo si necesitas resetear el foro manualmente
 */

export const clearAllForumData = () => {
  console.log('🧹 Limpiando todos los datos del foro...');

  localStorage.removeItem('forumQuestions');
  localStorage.removeItem('forumAnswers');
  localStorage.removeItem('productReviews');
  localStorage.removeItem('forumBotsInitialized');

  console.log('✅ Datos del foro eliminados. Recarga la página para empezar limpio.');

  return true;
};

export const resetForumToAIOnly = () => {
  console.log('🤖 Reseteando foro para que solo los bots de IA generen contenido...');

  // Limpiar todo
  clearAllForumData();

  // Marcar que queremos empezar limpio
  localStorage.setItem('forumBotsInitialized', 'false');

  console.log('✅ Foro reseteado. Recarga la página y los bots comenzarán a generar contenido.');
  console.log('⏰ Primera interacción en 45 minutos...');

  return true;
};

// Exponer funciones globalmente para uso en consola del navegador
if (typeof window !== 'undefined') {
  window.clearAllForumData = clearAllForumData;
  window.resetForumToAIOnly = resetForumToAIOnly;
}

export default {
  clearAllForumData,
  resetForumToAIOnly
};
