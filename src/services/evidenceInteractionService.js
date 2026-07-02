import { supabase } from '@/lib/supabaseClient';

const VISITOR_KEY_STORAGE = 'fuxion-evidence-visitor-key';

export const getEvidenceVisitorKey = () => {
  let visitorKey = localStorage.getItem(VISITOR_KEY_STORAGE);

  if (!visitorKey) {
    visitorKey = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VISITOR_KEY_STORAGE, visitorKey);
  }

  return visitorKey;
};

export const fetchEvidenceInteractions = async (evidenceId, visitorKey) => {
  const [{ data: comments, error: commentsError }, { data: reactions, error: reactionsError }] = await Promise.all([
    supabase
      .from('evidence_comments')
      .select('*')
      .eq('evidence_id', evidenceId)
      .order('created_at', { ascending: true }),
    supabase
      .from('evidence_reactions')
      .select('id, visitor_key')
      .eq('evidence_id', evidenceId)
      .eq('reaction_type', 'like'),
  ]);

  if (commentsError) throw commentsError;
  if (reactionsError) throw reactionsError;

  return {
    comments: comments || [],
    likes: reactions?.length || 0,
    likedByVisitor: Boolean(reactions?.some((reaction) => reaction.visitor_key === visitorKey)),
  };
};

export const addEvidenceComment = async ({ evidenceId, authorName, content }) => {
  const payload = {
    evidence_id: evidenceId,
    author_name: authorName.trim(),
    content: content.trim(),
  };

  if (payload.author_name.length < 2) {
    throw new Error('Escribe un nombre de al menos 2 caracteres.');
  }

  if (!payload.content) {
    throw new Error('Escribe un comentario.');
  }

  if (payload.content.length > 500) {
    throw new Error('El comentario puede tener hasta 500 caracteres.');
  }

  const { data, error } = await supabase
    .from('evidence_comments')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const toggleEvidenceLike = async ({ evidenceId, visitorKey, isLiked }) => {
  if (isLiked) {
    const { error } = await supabase
      .from('evidence_reactions')
      .delete()
      .eq('evidence_id', evidenceId)
      .eq('visitor_key', visitorKey)
      .eq('reaction_type', 'like');

    if (error) throw error;
    return false;
  }

  const { error } = await supabase
    .from('evidence_reactions')
    .insert([{
      evidence_id: evidenceId,
      visitor_key: visitorKey,
      reaction_type: 'like',
    }]);

  if (error && error.code !== '23505') throw error;
  return true;
};
