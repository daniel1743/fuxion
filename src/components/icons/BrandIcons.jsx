import React from 'react';
import { motion } from 'framer-motion';

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

export const TiktokIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.9 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.32 0 .63.06.92.16V8.77a6.35 6.35 0 0 0-.92-.07A6.34 6.34 0 0 0 3 15.04a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.95a8.24 8.24 0 0 0 4.58 1.5v-3.4a4.87 4.87 0 0 1-.67-.36Z"/>
  </svg>
);

export const FacebookIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const FuxionXLogo = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="xGradPwa" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#34D399" />
      </linearGradient>
      <linearGradient id="leafGradPwa" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#047857" />
        <stop offset="100%" stopColor="#6EE7B7" />
      </linearGradient>
      <filter id="logoSoftShadowPwa">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#059669" floodOpacity="0.25" />
      </filter>
    </defs>

    <motion.g filter="url(#logoSoftShadowPwa)">
      <path
        d="M160 140 C200 180, 240 230, 256 256 C272 230, 312 180, 352 140"
        stroke="url(#xGradPwa)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M352 140 C312 190, 280 240, 256 256 C232 240, 200 190, 160 140"
        stroke="url(#xGradPwa)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M160 372 C200 332, 240 282, 256 256 C272 282, 312 332, 352 372"
        stroke="url(#xGradPwa)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M352 372 C312 322, 280 272, 256 256 C232 272, 200 322, 160 372"
        stroke="url(#xGradPwa)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </motion.g>

    <motion.g
      className="splash-leaf"
      initial={{ scale: 0, rotate: -15, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.25,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <path
        d="M256 140 C256 140, 220 110, 200 90 C180 70, 190 50, 210 55 C230 60, 256 90, 256 90"
        fill="url(#leafGradPwa)"
        opacity="0.9"
      />
      <path
        d="M256 140 C256 140, 292 110, 312 90 C332 70, 322 50, 302 55 C282 60, 256 90, 256 90"
        fill="url(#leafGradPwa)"
        opacity="0.7"
      />
      <line
        x1="256" y1="140" x2="256" y2="70"
        stroke="#047857"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </motion.g>

    <motion.rect
      x="0" y="0" width="512" height="512"
      fill="url(#sweepGradPwa)"
      className="splash-light-sweep"
      initial={{ x: '-100%' }}
      animate={{ x: '200%' }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ pointerEvents: 'none' }}
    />
    <defs>
      <linearGradient id="sweepGradPwa" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="white" stopOpacity="0" />
        <stop offset="40%" stopColor="white" stopOpacity="0.35" />
        <stop offset="60%" stopColor="white" stopOpacity="0.35" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);
