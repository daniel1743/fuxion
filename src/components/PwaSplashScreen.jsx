import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const playClinkSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2093.00, ctx.currentTime); // C7, ping de cristal muy agudo
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {
    // Ignorar errores si el navegador bloquea el audio
  }
};

const shouldShowSplash = () => {
  if (typeof window === 'undefined') return false;
  const openedAsApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const launchedFromPwa = new URLSearchParams(window.location.search).get('source') === 'pwa';
  return openedAsApp || launchedFromPwa;
};

const PwaSplashScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(shouldShowSplash);
  const [showDot, setShowDot] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!visible) {
      onFinish?.();
      return;
    }

    // El punto aparece a los 1.5s
    const dotTimer = window.setTimeout(() => {
      setShowDot(true);
      playClinkSound();
    }, 1500);

    // Iniciar cierre
    const closeTimer = window.setTimeout(() => {
      setClosing(true);
    }, 3200);

    // Remover del DOM
    const removeTimer = window.setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 3800);

    return () => {
      window.clearTimeout(dotTimer);
      window.clearTimeout(closeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [visible, onFinish]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05110d]" // Fondo verde muy oscuro, premium
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          role="status"
          aria-label="Abriendo Bienestar en Claro"
        >
          {/* Subtle background glow */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/15 via-transparent to-transparent"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          <div className="relative z-10 text-center flex flex-col items-center">
            {/* Título Principal - Bienestar */}
            <h1 className="text-3xl md:text-5xl font-serif tracking-[0.25em] text-white/90 uppercase font-light flex items-center justify-center ml-[0.25em]">
              <motion.span 
                initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }} 
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex"
              >
                B
                <span className="relative inline-flex justify-center mx-[1px]">
                  {/* Letra 'i' sin punto */}
                  <span>ı</span>
                  <AnimatePresence>
                    {showDot && (
                      <motion.span
                        initial={{ opacity: 0, y: -15, scale: 0, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 10,
                          mass: 0.8
                        }}
                        className="absolute -top-[0.8em] text-emerald-400 font-bold"
                        style={{ textShadow: '0 0 12px rgba(52, 211, 153, 0.8)' }}
                      >
                        .
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                enestar
              </motion.span>
            </h1>

            {/* Subtítulo - en Claro */}
            <motion.h2 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              className="mt-3 text-xs md:text-sm tracking-[0.5em] text-emerald-400/80 font-light uppercase ml-[0.5em]"
            >
              en Claro
            </motion.h2>
          </div>

          {/* Loader Line Minimalista */}
          <motion.div
            className="absolute bottom-16 w-32 h-[1px] bg-white/10 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.div
              className="h-full bg-emerald-400/50"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PwaSplashScreen;
