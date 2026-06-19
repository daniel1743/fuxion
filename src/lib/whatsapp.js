import { fetchActiveAdvisorById, recordAdvisorEvent } from '@/services/advisorService';

const DEFAULT_WHATSAPP_NUMBER = '56989639088';
const ADVISOR_STORAGE_KEY = 'fuxion-active-advisor';
const ADVISOR_CACHE_KEY = 'fuxion-advisors-cache';

export const ADVISORS = {
  daniel: {
    id: 'daniel',
    name: 'Daniel Falcon',
    whatsappUrl: import.meta.env.VITE_WHATSAPP_DANIEL_URL?.trim() || '',
    whatsappNumber: import.meta.env.VITE_WHATSAPP_DANIEL_NUMBER?.replace(/[^\d]/g, '') || DEFAULT_WHATSAPP_NUMBER,
    isDefault: true
  },
  david: {
    id: 'david',
    name: 'David',
    whatsappUrl: import.meta.env.VITE_WHATSAPP_DAVID_URL?.trim() || '',
    whatsappNumber: import.meta.env.VITE_WHATSAPP_DAVID_NUMBER?.replace(/[^\d]/g, '') || ''
  },
  givo: {
    id: 'givo',
    name: 'Givo',
    whatsappUrl: import.meta.env.VITE_WHATSAPP_GIVO_URL?.trim() || '',
    whatsappNumber: import.meta.env.VITE_WHATSAPP_GIVO_NUMBER?.replace(/[^\d]/g, '') || ''
  },
  asesor3: {
    id: 'asesor3',
    name: 'Asesor 3',
    whatsappUrl: import.meta.env.VITE_WHATSAPP_ASESOR3_URL?.trim() || '',
    whatsappNumber: import.meta.env.VITE_WHATSAPP_ASESOR3_NUMBER?.replace(/[^\d]/g, '') || ''
  },
  asesor4: {
    id: 'asesor4',
    name: 'Asesor 4',
    whatsappUrl: import.meta.env.VITE_WHATSAPP_ASESOR4_URL?.trim() || '',
    whatsappNumber: import.meta.env.VITE_WHATSAPP_ASESOR4_NUMBER?.replace(/[^\d]/g, '') || ''
  },
  asesor5: {
    id: 'asesor5',
    name: 'Asesor 5',
    whatsappUrl: import.meta.env.VITE_WHATSAPP_ASESOR5_URL?.trim() || '',
    whatsappNumber: import.meta.env.VITE_WHATSAPP_ASESOR5_NUMBER?.replace(/[^\d]/g, '') || ''
  }
};

const getDefaultAdvisor = () => ADVISORS.daniel;

const mapDbAdvisor = (advisor) => {
  if (!advisor) return null;
  return {
    id: advisor.id,
    name: advisor.name,
    whatsappUrl: advisor.whatsapp_url || '',
    whatsappNumber: advisor.whatsapp_number?.replace(/[^\d]/g, '') || '',
    photoUrl: advisor.photo_url || '',
    instagramUrl: advisor.instagram_url || '',
    facebookUrl: advisor.facebook_url || '',
    isDefault: Boolean(advisor.is_default),
    isActive: advisor.is_active !== false
  };
};

const getCachedAdvisors = () => {
  if (typeof window === 'undefined') return {};

  try {
    return JSON.parse(window.localStorage.getItem(ADVISOR_CACHE_KEY) || '{}');
  } catch {
    return {};
  }
};

const cacheAdvisor = (advisor) => {
  if (typeof window === 'undefined' || !advisor?.id) return;
  const cached = getCachedAdvisors();
  cached[advisor.id] = advisor;
  window.localStorage.setItem(ADVISOR_CACHE_KEY, JSON.stringify(cached));
};

const getAdvisorBaseUrl = (advisor) => {
  if (advisor?.whatsappUrl) {
    return advisor.whatsappUrl;
  }

  if (advisor?.whatsappNumber) {
    return `https://wa.me/${advisor.whatsappNumber}`;
  }

  const defaultAdvisor = getDefaultAdvisor();
  if (defaultAdvisor.whatsappUrl) {
    return defaultAdvisor.whatsappUrl;
  }

  return `https://wa.me/${defaultAdvisor.whatsappNumber || DEFAULT_WHATSAPP_NUMBER}`;
};

export const getAdvisorById = (advisorId) => {
  const normalizedId = String(advisorId || '').trim().toLowerCase();
  const cached = getCachedAdvisors();
  return cached[normalizedId] || ADVISORS[normalizedId] || getDefaultAdvisor();
};

export const getActiveAdvisor = () => {
  if (typeof window === 'undefined') {
    return getDefaultAdvisor();
  }

  return getAdvisorById(window.localStorage.getItem(ADVISOR_STORAGE_KEY));
};

export const setActiveAdvisor = (advisorId) => {
  if (typeof window === 'undefined') return getDefaultAdvisor();

  const advisor = getAdvisorById(advisorId);
  window.localStorage.setItem(ADVISOR_STORAGE_KEY, advisor.id);
  return advisor;
};

export const initializeAdvisorFromUrl = async () => {
  if (typeof window === 'undefined') return getDefaultAdvisor();

  const params = new URLSearchParams(window.location.search);
  const advisorParam = params.get('asesor') || params.get('advisor') || params.get('ref');
  const normalizedAdvisor = String(advisorParam || '').trim().toLowerCase();

  if (normalizedAdvisor) {
    if (ADVISORS[normalizedAdvisor]) {
      const advisor = setActiveAdvisor(normalizedAdvisor);
      recordAdvisorEvent(advisor.id, 'visit', { source: 'url', advisorParam: normalizedAdvisor });
      return advisor;
    }

    try {
      const dbAdvisor = await fetchActiveAdvisorById(normalizedAdvisor);
      const advisor = mapDbAdvisor(dbAdvisor);
      if (advisor) {
        cacheAdvisor(advisor);
        window.localStorage.setItem(ADVISOR_STORAGE_KEY, advisor.id);
        recordAdvisorEvent(advisor.id, 'visit', { source: 'url', advisorParam: normalizedAdvisor });
        return advisor;
      }
    } catch (error) {
      console.warn('No se pudo cargar asesor desde Supabase:', error.message);
    }
  }

  if (!window.localStorage.getItem(ADVISOR_STORAGE_KEY)) {
    const advisor = setActiveAdvisor('daniel');
    recordAdvisorEvent(advisor.id, 'visit', { source: 'default' });
    return advisor;
  }

  const advisor = getActiveAdvisor();
  recordAdvisorEvent(advisor.id, 'visit', { source: 'stored' });
  return advisor;
};

export const resolveWhatsappBase = () => {
  const activeAdvisor = getActiveAdvisor();
  const advisorBase = getAdvisorBaseUrl(activeAdvisor);
  if (advisorBase) {
    return advisorBase;
  }

  const envUrl = import.meta.env.VITE_WHATSAPP_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  const envNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/[^\d]/g, '');
  if (envNumber) {
    return `https://wa.me/${envNumber}`;
  }

  return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`;
};

export const getAdvisorChannelLabel = (advisor = getActiveAdvisor()) =>
  advisor?.id && advisor.id !== 'daniel'
    ? 'Enlace personalizado de asesor'
    : 'Sitio web oficial';

export const buildAdvisorContext = (advisor = getActiveAdvisor()) => {
  const lines = [
    '*Atención asignada*',
    `Asesor: ${advisor.name || 'Daniel Falcon'}`,
    `Canal: ${getAdvisorChannelLabel(advisor)}`
  ];

  if (advisor?.id && advisor.id !== 'daniel') {
    lines.push(`Referencia: ${advisor.id}`);
  }

  return lines.join('\n');
};

export const buildWhatsappUrl = (message) => {
  const base = resolveWhatsappBase();
  const advisor = getActiveAdvisor();
  const alreadyHasAdvisorContext = /Atención asignada|ASESOR ASIGNADO|Asesor asignado/i.test(message);
  const routedMessage = alreadyHasAdvisorContext
    ? message
    : `${message}\n\n${buildAdvisorContext(advisor)}`;
  const encodedMessage = encodeURIComponent(routedMessage);

  if (base.includes('/message/')) {
    return `${base}?text=${encodedMessage}`;
  }

  if (base.includes('wa.me/')) {
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}text=${encodedMessage}`;
  }

  const number = base.replace(/[^\d]/g, '') || DEFAULT_WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodedMessage}`;
};

export const openWhatsapp = (message) => {
  const advisor = getActiveAdvisor();
  recordAdvisorEvent(advisor.id, 'whatsapp_click', { messagePreview: String(message || '').slice(0, 120) });
  window.open(buildWhatsappUrl(message), '_blank');
};

export const confirmAndOpenWhatsapp = (message) => {
  window.dispatchEvent(new CustomEvent('fuxion:confirm-whatsapp', {
    detail: { message }
  }));
};
