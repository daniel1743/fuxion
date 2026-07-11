import imageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabaseClient';

const SITE_MEDIA_BUCKET = 'site-media';

export const defaultSiteSettings = {
  id: 'main',
  site_name: 'Tienda Fuxion',
  logo_url: '/hoja-te-transparente.svg',
  owner_name: 'Daniel Falcon',
  tagline: 'Asesoría personalizada en productos Fuxion',
};

const normalizeEmail = (email = '') => email.trim().toLowerCase();

export const fetchSiteSettings = async () => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'main')
    .maybeSingle();

  if (error) throw error;
  return data || defaultSiteSettings;
};

export const saveSiteSettings = async (settings, updatedBy) => {
  const payload = {
    id: 'main',
    site_name: settings.site_name?.trim() || defaultSiteSettings.site_name,
    logo_url: settings.logo_url?.trim() || null,
    owner_name: settings.owner_name?.trim() || null,
    tagline: settings.tagline?.trim() || null,
    updated_by: updatedBy || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('site_settings')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const uploadSiteMedia = async (file, folder = 'uploads') => {
  if (!file) return '';

  const isImage = file.type.startsWith('image/');
  const finalFile = isImage
    ? await imageCompression(file, {
        maxSizeMB: 0.35,
        maxWidthOrHeight: 900,
        useWebWorker: true,
        fileType: file.type === 'image/png' ? 'image/png' : 'image/webp',
      })
    : file;

  const extension = finalFile.name?.split('.').pop() || (isImage ? 'webp' : 'bin');
  const cleanName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const path = `${folder}/${cleanName}`;

  const { error } = await supabase.storage
    .from(SITE_MEDIA_BUCKET)
    .upload(path, finalFile, {
      cacheControl: '31536000',
      upsert: false,
      contentType: finalFile.type || file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

export const fetchAdminUsers = async () => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const upsertAdminUser = async ({ email, name, is_active = true }, createdBy) => {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) throw new Error('El correo es obligatorio.');

  const { data, error } = await supabase
    .from('admin_users')
    .upsert({
      email: cleanEmail,
      name: name?.trim() || cleanEmail,
      is_active,
      created_by: createdBy || null,
    }, { onConflict: 'email' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAdminStatus = async (email, isActive) => {
  const cleanEmail = normalizeEmail(email);
  const { data, error } = await supabase
    .from('admin_users')
    .update({ is_active: Boolean(isActive), updated_at: new Date().toISOString() })
    .eq('email', cleanEmail)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteAdminUser = async (email) => {
  const cleanEmail = normalizeEmail(email);
  if (cleanEmail === 'falcondaniel37@gmail.com') {
    throw new Error('El admin principal no se puede eliminar.');
  }

  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('email', cleanEmail);

  if (error) throw error;
  return true;
};

export const fetchEvidencePosts = async (publishedOnly = false) => {
  let query = supabase
    .from('evidence_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (publishedOnly) query = query.eq('is_published', true);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const saveEvidencePost = async (post, author) => {
  const { data: authData } = await supabase.auth.getUser();
  const authUser = authData.user;

  if (!authUser?.id) {
    throw new Error('Debes iniciar sesión con tu cuenta para publicar o editar evidencias.');
  }

  const contentPayload = {
    title: post.title?.trim(),
    description: post.description?.trim(),
    image_url: post.image_url?.trim() || null,
    audio_url: post.audio_url?.trim() || null,
    is_published: Boolean(post.is_published),
  };

  if (!contentPayload.title || !contentPayload.description) {
    throw new Error('Título y descripción son obligatorios.');
  }

  const query = post.id
    ? supabase.from('evidence_posts').update(contentPayload).eq('id', post.id)
    : supabase.from('evidence_posts').insert([{
        ...contentPayload,
        owner_user_id: authUser.id,
        author_email: authUser.email || author?.email || null,
        author_name: author?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || null,
      }]);

  const { data, error } = await query.select().single();
  if (error) throw error;
  return data;
};

export const deleteEvidencePost = async (id) => {
  const { error } = await supabase
    .from('evidence_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const isAppAdmin = async (email) => {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return false;

  const { data, error } = await supabase.rpc('is_app_admin', {
    input_email: cleanEmail,
  });

  if (error) throw error;
  return Boolean(data);
};
