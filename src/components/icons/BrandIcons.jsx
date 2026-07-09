import React from 'react';

/**
 * AiRobotIcon — Icono personalizado del asistente Falcon IA.
 * Usa el logo oficial desde public/icons/svg_bot_falcon.svg
 */
export const AiRobotIcon = ({ className = 'h-4 w-4' }) => (
  <img
    src="/icons/svg_bot_falcon.svg"
    alt="Falcon IA"
    className={`${className} object-contain`}
  />
);

/**
 * WhatsAppIcon — Icono de WhatsApp con estilo outline (stroke-based)
 * para coherencia visual con el sistema Hugeicons del ecosistema premium.
 */
export const WhatsAppIcon = ({ className = 'h-4 w-4' }) => (
  <img
    src="/icons/whatsapp_logo.svg"
    alt="WhatsApp"
    className={`${className} object-contain brightness-0 invert`}
  />
);
