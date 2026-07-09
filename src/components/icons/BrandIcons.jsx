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
 * WhatsAppIcon — Icono de WhatsApp premium.
 * Carga el SVG real desde public/icons/whatsapp.svg
 */
export const WhatsAppIcon = ({ className = '' }) => (
  <img
    src="/icons/whatsapp.svg"
    alt="WhatsApp"
    className={className}
  />
);
