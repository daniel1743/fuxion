import React from 'react';

/**
 * AiRobotIcon — Avatar oficial del asistente FalconBot.
 * Usa la imagen local desde public/icons/cartoon-robot-avatar-vector-illustration.png
 */
export const AiRobotIcon = ({ className = '' }) => (
  <img
    src="/icons/cartoon-robot-avatar-vector-illustration.png"
    alt="Falcon Bot"
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
