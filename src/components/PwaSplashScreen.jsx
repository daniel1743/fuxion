import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PwaSplashScreen = ({ onFinish }) => {
  const [phase, setPhase] = useState('idle'); // idle → particles → logo → text → fade → done
  const particleRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // Generate floating particles (leaves/petals)
  useEffect(() => {
    const count = 18;
    const items = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 6 + Math.random() * 14,
      delay: Math.random() * 2.5,
      duration: 3 + Math.random() * 2,
      rotation: Math.random() * 360,
      opacity: 0.2 + Math.random() * 0.4,
    }));
    setParticles(items);
  }, []);

  // Phase timeline
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('particles'), 300);
    const t2 = setTimeout(() => setPhase('logo'), 1200);
    const t3 = setTimeout(() => setPhase('text'), 2200);
    const t4 = setTimeout(() => setPhase('fade'), 3200);
    const t5 = setTimeout(() => {
      setPhase('done');
      onFinish?.();
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onFinish]);

  if (phase === 'done') return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #064e3b 0%, #022c22 50%, #011410 100%)',
        willChange: 'opacity',
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: phase === 'fade' ? 0 : 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      onAnimationComplete={() => {}}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(52,211,153,0.12) 0%, transparent 55%)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating leaves / particles */}
      <div ref={particleRef} className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(52,211,153,${p.opacity}) 0%, transparent 70%)`,
              filter: `blur(${p.size > 10 ? 1 : 0}px)`,
            }}
            animate={{
              y: [-120, -400, -120],
              x: [0, 40 * (p.id % 2 === 0 ? 1 : -1), -30 * (p.id % 2 === 0 ? 1 : -1), 0],
              rotate: p.rotation,
              opacity: [0, p.opacity * 0.8, p.opacity * 0.8, 0],
              scale: [0.5, 1, 1, 0.5],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Central glow ring */}
      {(phase === 'logo' || phase === 'text') && (
        <motion.div
          className="absolute"
          style={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: '1px solid rgba(52,211,153,0.15)',
            boxShadow: '0 0 60px rgba(52,211,153,0.08)',
          }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.img
          src="/branding/mujer logo.svg"
          alt="Bienestar en Claro"
          className="w-52 h-auto"
          style={{
            filter: phase === 'logo' ? 'drop-shadow(0 0 20px rgba(52,211,153,0.5))' : 'none',
          }}
          initial={{ scale: 0.6, opacity: 0, filter: 'blur(10px)' }}
          animate={{
            scale: phase === 'logo' ? [0.6, 1, 1.03, 1] : 1,
            opacity: phase === 'logo' ? 1 : 1,
            filter: phase === 'logo'
              ? ['blur(10px)', 'blur(0px)']
              : 'drop-shadow(0 0 25px rgba(52,211,153,0.35))',
          }}
          transition={{
            scale: { duration: 1.2, times: [0, 0.4, 0.6, 1], ease: [0.25, 0.1, 0.25, 1] },
            opacity: { duration: 0.8, ease: 'easeOut' },
            filter: { duration: 1, ease: 'easeOut' },
          }}
        />

        {/* Breathing glow behind logo */}
        {phase === 'logo' && (
          <motion.div
            className="absolute"
            style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Title */}
        <motion.h1
          className="text-3xl md:text-5xl font-light tracking-[0.3em] text-white/90 uppercase mt-6"
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{
            opacity: phase === 'text' ? 1 : 0,
            y: phase === 'text' ? 0 : 20,
            filter: phase === 'text' ? 'blur(0px)' : 'blur(6px)',
          }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.span
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          >
            Bienestar
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          className="text-xs md:text-sm tracking-[0.5em] text-emerald-400/80 font-light uppercase mt-2"
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{
            opacity: phase === 'text' ? 1 : 0,
            y: phase === 'text' ? 0 : 10,
            filter: phase === 'text' ? 'blur(0px)' : 'blur(4px)',
          }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
        >
          en Claro
        </motion.h2>
      </div>

      {/* Bottom loader line */}
      <motion.div
        className="absolute bottom-16 w-32 h-[1px] bg-white/10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'text' || phase === 'fade' ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="h-full bg-emerald-400/50"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default PwaSplashScreen;
