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

/* ── Gota Botánica Logo como SVG inline ─────────────────── */
const BotanicalDropLogo = ({ className, isActive = true }) => (
  <svg
    className={className}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="dropGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#047857" />
        <stop offset="100%" stopColor="#6EE7B7" />
      </linearGradient>
      <linearGradient id="leafFillGrad" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#047857" stopOpacity="0" />
        <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
      </linearGradient>
      <filter id="logoSoftShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#059669" floodOpacity="0.3" />
      </filter>
    </defs>

    <motion.g filter="url(#logoSoftShadow)">
      {/* Contorno de la Gota de Agua */}
      <motion.path
        d="M256,60 C256,60 400,240 400,360 C400,439.5 335.5,504 256,504 C176.5,504 112,439.5 112,360 C112,240 256,60 256,60 Z"
        stroke="url(#dropGrad)"
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          duration: 1.0,
          delay: 0.1,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
      
      {/* Hoja Interior Central (Tallo) */}
      <motion.path
        d="M256,480 C256,380 256,220 256,160"
        stroke="url(#leafGrad)"
        strokeWidth="16"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />

      {/* Curva Derecha de la Hoja */}
      <motion.path
        d="M256,420 C360,400 360,250 256,180"
        stroke="url(#leafGrad)"
        strokeWidth="16"
        strokeLinecap="round"
        fill="url(#leafFillGrad)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          duration: 0.7,
          delay: 0.7,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      />

      {/* Curva Izquierda de la Hoja */}
      <motion.path
        d="M256,360 C180,340 180,260 256,210"
        stroke="url(#leafGrad)"
        strokeWidth="12"
        strokeLinecap="round"
        fill="url(#leafFillGrad)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          duration: 0.6,
          delay: 0.9,
          ease: [0.34, 1.56, 0.64, 1],
        }}
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
        duration: 0.9,
        delay: 1.2,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ pointerEvents: 'none' }}
    />
    <defs>
      <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="white" stopOpacity="0" />
        <stop offset="40%" stopColor="white" stopOpacity="0.4" />
        <stop offset="60%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0, scale: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 1.06, // Depth reveal (Zoom hacia el usuario)
    filter: 'blur(10px)',
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }, // Springy exit
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

    // Mostrar texto después de la entrada del logo (antes: 600ms, ahora: 700ms)
    const textTimer = window.setTimeout(() => {
      setShowText(true);
    }, 700);

    // Iniciar cierre: darle más tiempo al cerebro para leer. (antes: 1800ms, ahora: 2600ms)
    const closeTimer = window.setTimeout(() => {
      setClosing(true);
      setLogoActive(false);
    }, 2600);

    // Remover del DOM (antes: 2150ms, ahora: 3200ms)
    const removeTimer = window.setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 3200);

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
            <BotanicalDropLogo
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

          {/* Loader minimalista suavizado para 2026 */}
          <motion.div
            className="app-splash__loader"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            aria-hidden="true"
          >
            <motion.div
              className="app-splash__loader-bar"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 2.2, // Más tiempo, calza con la ventana de 2600ms
                delay: 0.5,
                ease: [0.4, 0, 0.2, 1], // Curva Bezier más orgánica
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppSplashScreen;
