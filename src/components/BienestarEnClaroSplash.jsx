import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BienestarEnClaroSplash = ({ onFinish = () => console.log('Splash finalizado') }) => {
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('grow'), 400);
    const t2 = setTimeout(() => setPhase('pulse'), 1600);
    const t3 = setTimeout(() => setPhase('fade'), 2800);
    const t4 = setTimeout(() => {
      setPhase('done');
      onFinish?.();
    }, 3400);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, [onFinish]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(165deg, #f8fdf9 0%, #f0fdf4 30%, #ffffff 60%, #fafdf6 100%)',
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'fade' ? 0 : 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Subtle ambient glow */}
          <motion.div
            className="absolute"
            style={{
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Logo */}
          <motion.img
            src="/branding/mujer logo.svg"
            alt="Bienestar en Claro"
            className="w-48 h-auto"
            animate={{
              scale: phase === 'grow'
                ? [0.7, 1]
                : phase === 'pulse'
                  ? [1, 1.03, 0.97, 1]
                  : 1,
              opacity: phase === 'grow' ? [0, 1] : 1,
            }}
            transition={{
              scale: phase === 'grow'
                ? { duration: 1.2, times: [0, 1], ease: [0.25, 0.1, 0.25, 1] }
                : phase === 'pulse'
                  ? { duration: 1.2, times: [0, 0.2, 0.6, 1], ease: 'easeInOut' }
                  : { duration: 0.8 },
              opacity: { duration: 0.8, ease: 'easeOut' },
            }}
          />

          {/* Breathing glow behind logo during pulse */}
          {phase === 'pulse' && (
            <motion.div
              className="absolute"
              style={{
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Title */}
          <motion.h1
            className="text-3xl md:text-5xl font-light tracking-[0.3em] text-gray-800/90 uppercase mt-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: phase === 'pulse' ? 1 : 0,
              y: phase === 'pulse' ? 0 : 12,
            }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Bienestar
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            className="text-xs md:text-sm tracking-[0.5em] text-emerald-600/80 font-light uppercase mt-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: phase === 'pulse' ? 1 : 0,
              y: phase === 'pulse' ? 0 : 8,
            }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            en Claro
          </motion.h2>

          {/* Bottom loader */}
          <motion.div
            className="absolute bottom-16 w-32 h-[1px] bg-gray-200/40 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'pulse' || phase === 'fade' ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-emerald-400/40"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BienestarEnClaroSplash;
