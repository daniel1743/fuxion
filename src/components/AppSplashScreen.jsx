import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const shouldShowSplash = () => {
  if (typeof window === 'undefined') return false;

  const openedAsApp =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  const launchedFromPwa = new URLSearchParams(window.location.search).get('source') === 'pwa';

  return openedAsApp || launchedFromPwa;
};

/* ── FuXion X Green Logo como SVG inline ─────────────────── */
const FuxionXLogo = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="xGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#34D399" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#047857" />
        <stop offset="100%" stopColor="#6EE7B7" />
      </linearGradient>
      <filter id="logoSoftShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#059669" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* X principal - trazo caligráfico premium */}
    <motion.g filter="url(#logoSoftShadow)">
      {/* Trazo 1: diagonal principal \ */}
      <path
        d="M160 140 C200 180, 240 230, 256 256 C272 230, 312 180, 352 140"
        stroke="url(#xGrad)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Trazo 2: diagonal secundaria / */}
      <path
        d="M352 140 C312 190, 280 240, 256 256 C232 240, 200 190, 160 140"
        stroke="url(#xGrad)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Trazo 3: diagonal inversa \ (parte inferior) */}
      <path
        d="M160 372 C200 332, 240 282, 256 256 C272 282, 312 332, 352 372"
        stroke="url(#xGrad)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Trazo 4: diagonal inversa / (parte inferior) */}
      <path
        d="M352 372 C312 322, 280 272, 256 256 C232 272, 200 322, 160 372"
        stroke="url(#xGrad)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </motion.g>

    {/* Hoja / brote en la intersección superior */}
    <motion.g
      className="splash-leaf"
      initial={{ scale: 0, rotate: -15, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.25,
        ease: [0.34, 1.56, 0.64, 1], // spring suave
      }}
    >
      <path
        d="M256 140 C256 140, 220 110, 200 90 C180 70, 190 50, 210 55 C230 60, 256 90, 256 90"
        fill="url(#leafGrad)"
        opacity="0.9"
      />
      <path
        d="M256 140 C256 140, 292 110, 312 90 C332 70, 322 50, 302 55 C282 60, 256 90, 256 90"
        fill="url(#leafGrad)"
        opacity="0.7"
      />
      {/* Vena central de la hoja */}
      <line
        x1="256" y1="140" x2="256" y2="70"
        stroke="#047857"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </motion.g>

    {/* Light sweep overlay */}
    <motion.rect
      x="0" y="0" width="512" height="512"
      fill="url(#sweepGrad)"
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
      <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="white" stopOpacity="0" />
        <stop offset="40%" stopColor="white" stopOpacity="0.35" />
        <stop offset="60%" stopColor="white" stopOpacity="0.35" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Variantes de animación ──────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
};

const logoContainerVariants = {
  hidden: { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      ease: [0.34, 1.56, 0.64, 1], // spring-like
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const AppSplashScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(shouldShowSplash);
  const [closing, setClosing] = useState(false);
  const [showText, setShowText] = useState(false);
  const logoRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      onFinish?.();
      return;
    }

    // Mostrar texto después de la entrada del logo
    const textTimer = window.setTimeout(() => {
      setShowText(true);
    }, 600);

    // Iniciar cierre
    const closeTimer = window.setTimeout(() => {
      setClosing(true);
    }, 1800);

    // Remover del DOM
    const removeTimer = window.setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 2150);

    return () => {
      window.clearTimeout(textTimer);
      window.clearTimeout(closeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [visible, onFinish]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="app-splash"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="status"
          aria-label="Abriendo Nutrición de Verdad"
        >
          {/* Glow de fondo pulsante */}
          <motion.div
            className="app-splash__glow"
            aria-hidden="true"
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Logo con entrada premium */}
          <motion.div
            ref={logoRef}
            className="app-splash__logo"
            variants={logoContainerVariants}
            initial="hidden"
            animate="visible"
            aria-hidden="true"
          >
            <FuxionXLogo className="app-splash__logo-svg" />

            {/* Breathing sutil del logo */}
            <motion.div
              className="app-splash__breath"
              aria-hidden="true"
              animate={{
                scale: [1, 1.04, 1],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.6,
              }}
            />
          </motion.div>

          {/* Texto "Nutrición de verdad" */}
          <AnimatePresence>
            {showText && (
              <motion.div
                className="app-splash__text-group"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <h1 className="app-splash__title">
                  Nutrición
                  <span className="app-splash__title-accent"> de verdad</span>
                </h1>
                <p className="app-splash__subtitle">
                  Bienestar inteligente{' '}
                  <span className="app-splash__emoji" aria-hidden="true">🌱</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loader minimalista: barra delgada */}
          <motion.div
            className="app-splash__loader"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            aria-hidden="true"
          >
            <motion.div
              className="app-splash__loader-bar"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1.4,
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppSplashScreen;
