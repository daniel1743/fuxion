import React from 'react';

/**
 * AiRobotIcon — Avatar oficial del asistente FalconBot.
 * Usa la imagen local desde public/icons/cartoon-robot-avatar-vector-illustration/81db92bc-1508-42d2-9ff5-6690a3d15300.jpg
 */
export const AiRobotIcon = ({ className = '' }) => (
  <img
    src="/icons/cartoon-robot-avatar-vector-illustration/81db92bc-1508-42d2-9ff5-6690a3d15300.jpg"
    alt="Falcon Bot"
    className={`${className} object-contain rounded-full`}
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
