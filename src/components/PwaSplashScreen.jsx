import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FuxionXLogo } from '@/components/icons/BrandIcons';

const shouldShowSplash = () => {
  if (typeof window === 'undefined') return false;

  const openedAsApp =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  const launchedFromPwa = new URLSearchParams(window.location.search).get('source') === 'pwa';

  return openedAsApp || launchedFromPwa;
};



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

const PwaSplashScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(shouldShowSplash);
  const [closing, setClosing] = useState(false);
  const [showText, setShowText] = useState(false);

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
          className="pwa-splash"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="status"
          aria-label="Abriendo Tienda Fuxion"
        >
          {/* Glow de fondo pulsante */}
          <motion.div
            className="pwa-splash__glow"
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
            className="pwa-splash__logo"
            variants={logoContainerVariants}
            initial="hidden"
            animate="visible"
            aria-hidden="true"
          >
            <FuxionXLogo className="pwa-splash__logo-svg" />

            {/* Breathing sutil del logo */}
            <motion.div
              className="pwa-splash__breath"
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

          {/* Texto "Tienda Fuxion" */}
          <AnimatePresence>
            {showText && (
              <motion.div
                className="pwa-splash__text-group"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <h1 className="pwa-splash__title">
                  Tienda
                  <span className="pwa-splash__title-accent"> Fuxion</span>
                </h1>
                <p className="pwa-splash__subtitle">
                  Salud verdadera{' '}
                  <span className="pwa-splash__emoji" aria-hidden="true">🌱</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loader minimalista: barra delgada */}
          <motion.div
            className="pwa-splash__loader"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            aria-hidden="true"
          >
            <motion.div
              className="pwa-splash__loader-bar"
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

export default PwaSplashScreen;
