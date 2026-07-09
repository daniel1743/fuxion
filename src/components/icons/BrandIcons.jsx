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
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
