/**
 * formValidation.js
 *
 * Validación compartida para formularios de leads.
 * Regla de contacto mínimo: WhatsApp OR Email obligatorio.
 *
 * Uso:
 *   import { validateContact, validateWhatsApp, validateEmail } from '@/lib/formValidation';
 *
 *   const errors = validateContact({ whatsapp: '+569...', email: '' });
 *   if (errors.contact) { ... mostrar error }
 */

// ── Mensaje de error estándar ──────────────────────────────────
export const CONTACT_REQUIRED_MESSAGE = 'Déjanos un WhatsApp o correo para poder responderte 💚';

// ── Validación de WhatsApp ─────────────────────────────────────
export const validateWhatsApp = (value) => {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim();

  // Vacío o solo espacios → no hay error (se valida con email)
  if (!trimmed) return null;

  // Mínimo de caracteres reales (ej: "+56 9" ya son 5+)
  if (trimmed.length < 5) {
    return 'El número WhatsApp parece incompleto';
  }

  // Evitar solo números repetidos o inválidos
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length < 5) {
    return 'El número WhatsApp parece incompleto';
  }

  // No bloquear formatos internacionales válidos
  // Permitir: +56912345678, 56912345678, +56 9 1234 5678, etc.
  const validPattern = /^\+?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{0,4}$/;
  if (!validPattern.test(trimmed)) {
    return 'Formato de WhatsApp no válido';
  }

  return null; // Válido
};

// ── Validación de Email ────────────────────────────────────────
export const validateEmail = (value) => {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim();

  // Vacío o solo espacios → no hay error (se valida con WhatsApp)
  if (!trimmed) return null;

  // Formato básico de email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) {
    return 'El correo electrónico no es válido';
  }

  // Evitar textos inválidos comunes
  const invalidPatterns = [
    /^http/i,
    /^www\./i,
    /^tel:/i,
    /^\+/,
    /\s{2,}/,
    /\.{2,}/,
  ];

  for (const pattern of invalidPatterns) {
    if (pattern.test(trimmed)) {
      return 'El correo electrónico no es válido';
    }
  }

  return null; // Válido
};

// ── Validación de contacto mínimo ──────────────────────────────
export const validateContact = ({ whatsapp, email }) => {
  const waValue = (whatsapp || '').trim();
  const emailValue = (email || '').trim();

  // Ambos vacíos → error
  if (!waValue && !emailValue) {
    return {
      valid: false,
      field: 'contact',
      message: CONTACT_REQUIRED_MESSAGE,
      whatsappError: null,
      emailError: null,
    };
  }

  // Validar individualmente si tienen contenido
  const waError = waValue ? validateWhatsApp(waValue) : null;
  const emailErr = emailValue ? validateEmail(emailValue) : null;

  // Si ambos tienen contenido pero ambos son inválidos
  if (waValue && emailValue && waError && emailErr) {
    return {
      valid: false,
      field: 'both',
      message: 'Revisa los datos de contacto',
      whatsappError: waError,
      emailError: emailErr,
    };
  }

  // Si solo WhatsApp tiene contenido y es inválido
  if (waValue && !emailValue && waError) {
    return {
      valid: false,
      field: 'whatsapp',
      message: waError,
      whatsappError: waError,
      emailError: null,
    };
  }

  // Si solo email tiene contenido y es inválido
  if (emailValue && !waValue && emailErr) {
    return {
      valid: false,
      field: 'email',
      message: emailErr,
      whatsappError: null,
      emailError: emailErr,
    };
  }

  // Si ambos tienen contenido, al menos uno es válido
  if (waValue && emailValue) {
    // WhatsApp inválido pero email válido → OK
    if (waError && !emailErr) {
      return {
        valid: true,
        field: null,
        message: null,
        whatsappError: waError,
        emailError: null,
      };
    }
    // Email inválido pero WhatsApp válido → OK
    if (emailErr && !waError) {
      return {
        valid: true,
        field: null,
        message: null,
        whatsappError: null,
        emailError: emailErr,
      };
    }
  }

  // Al menos un contacto válido presente
  return {
    valid: true,
    field: null,
    message: null,
    whatsappError: waError,
    emailError: emailErr,
  };
};

// ── Validación completa de formulario ──────────────────────────
export const validateLeadForm = (formData) => {
  const errors = {};

  // Nombre
  if (!formData.nombre?.trim() && !formData.name?.trim()) {
    errors.nombre = 'Por favor ingresa tu nombre';
  }

  // Tipo de solicitud
  if (!formData.tipo && !formData.interest) {
    errors.tipo = 'Selecciona el motivo de tu mensaje';
  }

  // Contacto mínimo
  const contactResult = validateContact({
    whatsapp: formData.whatsapp || '',
    email: formData.email || '',
  });

  if (!contactResult.valid) {
    errors.contact = contactResult.message;
    if (contactResult.whatsappError) errors.whatsapp = contactResult.whatsappError;
    if (contactResult.emailError) errors.email = contactResult.emailError;
  } else {
    if (contactResult.whatsappError) errors.whatsapp = contactResult.whatsappError;
    if (contactResult.emailError) errors.email = contactResult.emailError;
  }

  // Mensaje
  if (!formData.mensaje?.trim()) {
    errors.mensaje = 'Cuéntanos cómo podemos ayudarte';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
