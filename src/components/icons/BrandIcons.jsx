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
 * WhatsAppIcon — Icono personalizado de WhatsApp.
 * Usa el logo oficial desde public/icons/whatsapp-logo-tohin.svg
 */
export const WhatsAppIcon = ({ className = 'h-4 w-4' }) => (
  <img
    src="/icons/whatsapp-logo-tohin.svg"
    alt="WhatsApp"
    className={`${className} object-contain`}
  />
);
