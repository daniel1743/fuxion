import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';

const shouldShowSplash = () => {
  if (typeof window === 'undefined') return false;

  const openedAsApp =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  const launchedFromPwa = new URLSearchParams(window.location.search).get('source') === 'pwa';

  return openedAsApp || launchedFromPwa;
};

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

const logoVariants = {
  hidden: { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      ease: [0.34, 1.56, 0.64, 1],
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

    const textTimer = window.setTimeout(() => {
      setShowText(true);
    }, 600);

    const closeTimer = window.setTimeout(() => {
      setClosing(true);
    }, 1800);

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

          <motion.div
            className="pwa-splash__logo"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            aria-hidden="true"
          >
            <Leaf />
          </motion.div>

          <AnimatePresence>
            {showText && (
              <motion.div
                className="pwa-splash__text-group"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <h1 className="pwa-splash__title">Tienda Fuxion</h1>
                <p className="pwa-splash__text">Salud verdadera</p>
              </motion.div>
            )}
          </AnimatePresence>

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
