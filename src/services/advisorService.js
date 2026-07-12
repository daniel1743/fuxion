import { supabase } from '@/lib/supabaseClient';

const METRICS_RETRY_KEY = 'fuxion-advisor-metrics-retry-at';
const METRICS_RETRY_DELAY = 24 * 60 * 60 * 1000;
let metricsAvailable = true;

const canRecordMetrics = () => {
  if (!metricsAvailable) return false;
  if (typeof window === 'undefined') return true;

  const retryAt = Number(window.localStorage.getItem(METRICS_RETRY_KEY) || 0);
  return Date.now() >= retryAt;
};

const pauseMissingMetricsTable = (error) => {
  // PGRST205 = table not found, PGRST204 = column not found in schema cache
  if (error?.code !== 'PGRST205' && error?.code !== 'PGRST204') return false;

  metricsAvailable = false;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(
      METRICS_RETRY_KEY,
      String(Date.now() + METRICS_RETRY_DELAY)
    );
  }
  return true;
};

export const normalizeAdvisorId = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const fetchAdvisors = async () => {
  const { data, error } = await supabase
    .from('advisors')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const fetchActiveAdvisorById = async (advisorId) => {
  const id = normalizeAdvisorId(advisorId);
  if (!id) return null;

  const { data, error } = await supabase
    .from('advisors')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data || null;
};

export const upsertAdvisor = async (advisor) => {
  const payload = {
    id: normalizeAdvisorId(advisor.id),
    name: advisor.name?.trim(),
    whatsapp_url: advisor.whatsapp_url?.trim() || null,
    whatsapp_number: advisor.whatsapp_number?.replace(/[^\d]/g, '') || null,
    photo_url: advisor.photo_url?.trim() || null,
    instagram_url: advisor.instagram_url?.trim() || null,
    facebook_url: advisor.facebook_url?.trim() || null,
    is_active: Boolean(advisor.is_active),
    is_default: Boolean(advisor.is_default),
    notes: advisor.notes?.trim() || null
  };

  const { data, error } = await supabase
    .from('advisors')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAdvisorStatus = async (advisorId, isActive) => {
  const { data, error } = await supabase
    .from('advisors')
    .update({ is_active: Boolean(isActive) })
    .eq('id', normalizeAdvisorId(advisorId))
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteAdvisor = async (advisorId) => {
  const id = normalizeAdvisorId(advisorId);
  if (id === 'daniel') {
    throw new Error('Daniel es el asesor principal y no se puede eliminar.');
  }

  const { error } = await supabase
    .from('advisors')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const recordAdvisorEvent = async (advisorId, eventType, metadata = {}) => {
  if (!canRecordMetrics()) return;

  try {
    const path = typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : null;

    const { error } = await supabase.from('chat_events').insert([{
      session_id: `adv_${normalizeAdvisorId(advisorId) || 'daniel'}`,
      event_type: eventType,
      product_name: metadata.productName || metadata.product_name || null,
      metadata: {
        ...metadata,
        advisor_id: normalizeAdvisorId(advisorId) || 'daniel',
        page_path: path
      }
    }]);

    if (error && !pauseMissingMetricsTable(error)) {
      console.warn('No se pudo registrar métrica de asesor:', error.message);
    }
  } catch (error) {
    console.warn('No se pudo registrar métrica de asesor:', error.message);
  }
};

export const fetchAdvisorMetrics = async () => {
  const [advisorsResult, eventsResult] = await Promise.all([
    fetchAdvisors(),
    supabase
      .from('chat_events')
      .select('event_type, created_at, product_name, metadata')
      .order('created_at', { ascending: false })
      .limit(1000)
  ]);

  // If the events query fails due to schema mismatch (e.g. missing column), skip gracefully
  if (eventsResult.error) {
    if (eventsResult.error.code === 'PGRST204' || eventsResult.error.code === 'PGRST205') {
      console.warn('chat_events schema mismatch — skipping metrics:', eventsResult.error.message);
      return Object.values({});
    }
    throw eventsResult.error;
  }

  const metricsByAdvisor = {};
  advisorsResult.forEach((advisor) => {
    metricsByAdvisor[advisor.id] = {
      advisor,
      total: 0,
      visits: 0,
      whatsapp: 0,
      cart: 0,
      products: 0,
      recent: []
    };
  });

  (eventsResult.data || []).forEach((event) => {
    const advisorId = event.metadata?.advisor_id || 'daniel';
    if (!metricsByAdvisor[advisorId]) {
      metricsByAdvisor[advisorId] = {
        advisor: { id: advisorId, name: advisorId },
        total: 0,
        visits: 0,
        whatsapp: 0,
        cart: 0,
        products: 0,
        recent: []
      };
    }

    const item = metricsByAdvisor[advisorId];
    item.total += 1;
    if (event.event_type === 'visit') item.visits += 1;
    if (event.event_type === 'whatsapp_click') item.whatsapp += 1;
    if (event.event_type === 'cart_whatsapp') item.cart += 1;
    if (event.event_type === 'product_ai') item.products += 1;
    if (item.recent.length < 5) item.recent.push(event);
  });

  return Object.values(metricsByAdvisor);
};
