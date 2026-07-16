import { supabase } from '@/lib/supabaseClient';

/**
 * Obtener todos los comentarios de un artículo por su slug
 */
export const getCommentsByArticle = async (slug) => {
  const { data, error } = await supabase
    .from('article_comments')
    .select('*')
    .eq('article_slug', slug)
    .eq('is_approved', true) 
    .order('created_at', { ascending: false }); // Más nuevos primero

  if (error) {
    console.error('Error fetching article comments:', error);
    return [];
  }
  return data || [];
};

/**
 * Añadir un nuevo comentario a un artículo
 */
export const addArticleComment = async (commentData) => {
  const { data, error } = await supabase
    .from('article_comments')
    .insert([
      {
        article_slug: commentData.article_slug,
        author_name: commentData.author_name,
        title: commentData.title || null,
        content: commentData.content,
        is_approved: true // Autopublicación
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};
