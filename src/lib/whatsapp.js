const DEFAULT_WHATSAPP_NUMBER = '56989639088';
const ADVISOR_STORAGE_KEY = 'fuxion-active-advisor';

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
  return ADVISORS[normalizedId] || getDefaultAdvisor();
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

export const initializeAdvisorFromUrl = () => {
  if (typeof window === 'undefined') return getDefaultAdvisor();

  const params = new URLSearchParams(window.location.search);
  const advisorParam = params.get('asesor') || params.get('advisor') || params.get('ref');

  if (advisorParam && ADVISORS[String(advisorParam).trim().toLowerCase()]) {
    return setActiveAdvisor(advisorParam);
  }

  if (!window.localStorage.getItem(ADVISOR_STORAGE_KEY)) {
    return setActiveAdvisor('daniel');
  }

  return getActiveAdvisor();
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

export const buildWhatsappUrl = (message) => {
  const base = resolveWhatsappBase();
  const advisor = getActiveAdvisor();
  const routedMessage = advisor?.id && advisor.id !== 'daniel'
    ? `${message}\n\nAsesor asignado: ${advisor.name}\nCódigo de asesor: ${advisor.id}`
    : `${message}\n\nAsesor asignado: ${advisor.name || 'Daniel Falcon'}\nOrigen: web / SEO / directo`;
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
  window.open(buildWhatsappUrl(message), '_blank');
};

export const confirmAndOpenWhatsapp = (message) => {
  window.dispatchEvent(new CustomEvent('fuxion:confirm-whatsapp', {
    detail: { message }
  }));
};
