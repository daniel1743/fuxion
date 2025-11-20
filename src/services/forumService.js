import { supabase } from '@/lib/supabaseClient';

// ============================================
// PREGUNTAS (Questions)
// ============================================

/**
 * Obtener todas las preguntas
 */
export const getAllQuestions = async () => {
  const { data, error } = await supabase
    .from('forum_questions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener preguntas:', error);
    return [];
  }
  return data || [];
};

/**
 * Crear nueva pregunta
 */
export const createQuestion = async (questionData) => {
  const { data, error } = await supabase
    .from('forum_questions')
    .insert([
      {
        author: questionData.author,
        author_avatar: questionData.authorAvatar,
        title: questionData.title,
        content: questionData.content,
        category: questionData.category,
        tags: questionData.tags || [],
        votes: 0,
        answers_count: 0,
        views: 0,
        solved: false,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error al crear pregunta:', error);
    throw error;
  }
  return data;
};

/**
 * Votar pregunta (incrementar/decrementar)
 */
export const voteQuestion = async (questionId, increment = 1) => {
  // Primero obtener el valor actual
  const { data: current } = await supabase
    .from('forum_questions')
    .select('votes')
    .eq('id', questionId)
    .single();

  if (!current) return null;

  const { data, error } = await supabase
    .from('forum_questions')
    .update({ votes: current.votes + increment })
    .eq('id', questionId)
    .select()
    .single();

  if (error) {
    console.error('Error al votar pregunta:', error);
    return null;
  }
  return data;
};

/**
 * Incrementar vistas de una pregunta
 */
export const incrementQuestionViews = async (questionId) => {
  const { data: current } = await supabase
    .from('forum_questions')
    .select('views')
    .eq('id', questionId)
    .single();

  if (!current) return null;

  const { data, error } = await supabase
    .from('forum_questions')
    .update({ views: current.views + 1 })
    .eq('id', questionId)
    .select()
    .single();

  if (error) {
    console.error('Error al incrementar vistas:', error);
    return null;
  }
  return data;
};

/**
 * Marcar pregunta como resuelta
 */
export const markQuestionAsSolved = async (questionId) => {
  const { data, error } = await supabase
    .from('forum_questions')
    .update({ solved: true })
    .eq('id', questionId)
    .select()
    .single();

  if (error) {
    console.error('Error al marcar como resuelta:', error);
    return null;
  }
  return data;
};

// ============================================
// RESPUESTAS (Answers)
// ============================================

/**
 * Obtener respuestas de una pregunta
 */
export const getAnswersByQuestionId = async (questionId) => {
  const { data, error } = await supabase
    .from('forum_answers')
    .select('*')
    .eq('question_id', questionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error al obtener respuestas:', error);
    return [];
  }
  return data || [];
};

/**
 * Crear nueva respuesta
 */
export const createAnswer = async (questionId, answerData) => {
  const { data, error } = await supabase
    .from('forum_answers')
    .insert([
      {
        question_id: questionId,
        author: answerData.author,
        author_avatar: answerData.authorAvatar,
        content: answerData.content,
        votes: 0,
        is_accepted: false,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error al crear respuesta:', error);
    throw error;
  }

  // Incrementar contador de respuestas en la pregunta
  await incrementAnswersCount(questionId);

  return data;
};

/**
 * Incrementar contador de respuestas
 */
const incrementAnswersCount = async (questionId) => {
  const { data: current } = await supabase
    .from('forum_questions')
    .select('answers_count')
    .eq('id', questionId)
    .single();

  if (!current) return;

  await supabase
    .from('forum_questions')
    .update({ answers_count: current.answers_count + 1 })
    .eq('id', questionId);
};

/**
 * Votar respuesta
 */
export const voteAnswer = async (answerId, increment = 1) => {
  const { data: current } = await supabase
    .from('forum_answers')
    .select('votes')
    .eq('id', answerId)
    .single();

  if (!current) return null;

  const { data, error } = await supabase
    .from('forum_answers')
    .update({ votes: current.votes + increment })
    .eq('id', answerId)
    .select()
    .single();

  if (error) {
    console.error('Error al votar respuesta:', error);
    return null;
  }
  return data;
};

/**
 * Marcar respuesta como aceptada
 */
export const acceptAnswer = async (questionId, answerId) => {
  // Primero, desmarcar todas las respuestas de esta pregunta
  await supabase
    .from('forum_answers')
    .update({ is_accepted: false })
    .eq('question_id', questionId);

  // Marcar esta respuesta como aceptada
  const { data, error } = await supabase
    .from('forum_answers')
    .update({ is_accepted: true })
    .eq('id', answerId)
    .select()
    .single();

  if (error) {
    console.error('Error al aceptar respuesta:', error);
    return null;
  }

  // Marcar pregunta como resuelta
  await markQuestionAsSolved(questionId);

  return data;
};

// ============================================
// RESEÑAS (Reviews)
// ============================================

/**
 * Obtener todas las reseñas
 */
export const getAllReviews = async () => {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener reseñas:', error);
    return [];
  }
  return data || [];
};

/**
 * Obtener reseñas de un producto específico
 */
export const getReviewsByProduct = async (productName) => {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('*')
    .eq('product_name', productName)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener reseñas del producto:', error);
    return [];
  }
  return data || [];
};

/**
 * Crear nueva reseña
 */
export const createReview = async (reviewData) => {
  const { data, error } = await supabase
    .from('product_reviews')
    .insert([
      {
        author: reviewData.author,
        rating: reviewData.rating,
        comment: reviewData.comment,
        product_name: reviewData.productName || null,
        likes: 0,
        replies_count: 0,
        verified: false,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error al crear reseña:', error);
    throw error;
  }
  return data;
};

/**
 * Dar like a una reseña
 */
export const likeReview = async (reviewId) => {
  const { data: current } = await supabase
    .from('product_reviews')
    .select('likes')
    .eq('id', reviewId)
    .single();

  if (!current) return null;

  const { data, error } = await supabase
    .from('product_reviews')
    .update({ likes: current.likes + 1 })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error al dar like:', error);
    return null;
  }
  return data;
};

/**
 * Calcular promedio de rating de un producto
 */
export const getAverageRating = async (productName) => {
  const reviews = await getReviewsByProduct(productName);
  if (reviews.length === 0) return 0;

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
};
