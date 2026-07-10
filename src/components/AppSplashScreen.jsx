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

/* ── Particle system ────────────────────────────────────────── */
const ParticleField = () => {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 1,
    delay: Math.random() * 1.8,
    duration: Math.random() * 2 + 2,
    opacity: Math.random() * 0.25 + 0.05,
  }));

  return (
    <div className="splash-particles" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="splash-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0, p.opacity, 0],
            y: [0, -20 - Math.random() * 15],
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

/* ── FuXion X Green Logo como SVG inline ─────────────────── */
const FuxionXLogo = ({ className, isActive = true }) => (
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
      <linearGradient id="energyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34D399" stopOpacity="0" />
        <stop offset="50%" stopColor="#10B981" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* X principal - trazo caligráfico premium */}
    <motion.g filter="url(#logoSoftShadow)">
      {/* Trazo 1: diagonal principal \ */}
      <motion.path
        d="M160 140 C200 180, 240 230, 256 256 C272 230, 312 180, 352 140"
        stroke="url(#xGrad)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          duration: 0.7,
          delay: 0.2,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
      {/* Trazo 2: diagonal secundaria / */}
      <motion.path
        d="M352 140 C312 190, 280 240, 256 256 C232 240, 200 190, 160 140"
        stroke="url(#xGrad)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          duration: 0.7,
          delay: 0.35,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
      {/* Trazo 3: diagonal inversa \ (parte inferior) */}
      <motion.path
        d="M160 372 C200 332, 240 282, 256 256 C272 282, 312 332, 352 372"
        stroke="url(#xGrad)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          duration: 0.7,
          delay: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
      {/* Trazo 4: diagonal inversa / (parte inferior) */}
      <motion.path
        d="M352 372 C312 322, 280 272, 256 256 C232 272, 200 322, 160 372"
        stroke="url(#xGrad)"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          duration: 0.7,
          delay: 0.65,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
    </motion.g>

    {/* Flujo de energía que cruza el centro */}
    <motion.line
      x1="160" y1="140" x2="352" y2="372"
      stroke="url(#energyGrad)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: 1.0,
        ease: [0.4, 0, 0.6, 1],
      }}
      style={{ pointerEvents: 'none' }}
    />
    <motion.line
      x1="352" y1="140" x2="160" y2="372"
      stroke="url(#energyGrad)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: 1.15,
        ease: [0.4, 0, 0.6, 1],
      }}
      style={{ pointerEvents: 'none' }}
    />

    {/* Hoja / brote en la intersección superior */}
    <motion.g
      className="splash-leaf"
      style={{ transformOrigin: 'center bottom' }}
      initial={{ scale: 0, rotate: -15, opacity: 0 }}
      animate={isActive ? { scale: 1, rotate: 0, opacity: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.85,
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
      animate={isActive ? { x: '200%' } : {}}
      transition={{
        duration: 0.8,
        delay: 1.1,
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
  const [logoActive, setLogoActive] = useState(true);
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
      setLogoActive(false);
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
          {/* Partículas de naturaleza */}
          <ParticleField />

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
            <FuxionXLogo
              className="app-splash__logo-svg"
              isActive={logoActive}
            />

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
