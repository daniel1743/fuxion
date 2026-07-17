import { supabase } from '@/lib/supabaseClient';

export const WELLNESS_CATEGORIES = [
  'Belleza y Piel',
  'Bienestar General',
  'Control de Peso',
  'Ejercicio',
  'Energía',
  'Estrés y Sueño',
  'Grasa Corporal',
  'Hígado Graso',
  'Inmunidad',
  'Metabolismo',
  'Microbioma',
  'Nutrición Celular',
  'Salud Digestiva',
  'Salud Emocional',
];

export const slugifyWellnessArticle = (value = '') => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export const fetchWellnessArticles = async ({ includeDrafts = false } = {}) => {
  let query = supabase
    .from('wellness_articles')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (!includeDrafts) query = query.eq('is_published', true);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const fetchWellnessArticleBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('wellness_articles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const saveWellnessArticle = async (article, editor) => {
  const { data: authData } = await supabase.auth.getUser();
  const authUser = authData.user;

  if (!authUser?.id) throw new Error('Debes iniciar sesión como administrador.');

  const title = article.title?.trim();
  const excerpt = article.excerpt?.trim();
  const content = article.content?.trim();

  if (!title || !excerpt || !content || !article.category) {
    throw new Error('Completa título, bajada editorial, categoría y artículo.');
  }

  const payload = {
    title,
    excerpt,
    content,
    category: article.category,
    image_url: article.image_url?.trim() || null,
    is_published: Boolean(article.is_published),
  };

  if (article.id) {
    const { data, error } = await supabase
      .from('wellness_articles')
      .update(payload)
      .eq('id', article.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const slugBase = slugifyWellnessArticle(title);
  const slug = `${slugBase}-${Date.now().toString(36)}`;
  const editorName = editor?.name
    || authUser.user_metadata?.name
    || authUser.user_metadata?.full_name
    || authUser.email?.split('@')[0]
    || 'Editor Fuxion';

  const { data, error } = await supabase
    .from('wellness_articles')
    .insert([{
      ...payload,
      slug,
      owner_user_id: authUser.id,
      editor_name: editorName,
      editor_email: authUser.email,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteWellnessArticle = async (id) => {
  const { error } = await supabase
    .from('wellness_articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

