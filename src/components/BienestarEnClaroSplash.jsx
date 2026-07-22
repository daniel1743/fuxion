import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPLASH_SESSION_KEY = 'splash_shown_this_launch_v1';

function isPwaStandalone() {
  if (typeof window === 'undefined') return false;
  try {
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
    if (window.navigator.standalone === true) return true;
  } catch (_) {}
  return false;
}

function isMobileOrTabletSurface() {
  if (typeof window === 'undefined') return false;
  try {
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const mobileWidth = window.matchMedia('(max-width: 1024px)').matches;
    return coarsePointer || mobileWidth || isPwaStandalone();
  } catch (_) {
    return false;
  }
}

function shouldBypassSplash() {
  try {
    return !!sessionStorage.getItem(SPLASH_SESSION_KEY) || !isMobileOrTabletSurface();
  } catch (_) {
    return !isMobileOrTabletSurface();
  }
}

const BienestarEnClaroSplash = () => {
  const [phase, setPhase] = useState('idle');
  const [bypass, setBypass] = useState(() => shouldBypassSplash());
  const onFinishRef = useRef(() => {});

  const shouldShow = !bypass;

  useEffect(() => {
    if (bypass) {
      onFinishRef.current();
      return;
    }

    try { sessionStorage.setItem(SPLASH_SESSION_KEY, 'true'); } catch (_) {}

    const t1 = setTimeout(() => setPhase('grow'), 180);
    const t2 = setTimeout(() => setPhase('pulse'), 700);
    const t3 = setTimeout(() => setPhase('fade'), 2800);
    const t4 = setTimeout(() => {
      setPhase('done');
      onFinishRef.current();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!shouldShow) return null;
  if (phase === 'done') return null;

  const brandTitle = 'Bienestar en Claro';

  return (
    <>
      <style>{`
        @keyframes markEnter {
          0% { opacity: 0; transform: scale(0.82) rotate(-8deg); filter: blur(8px); }
          58% { opacity: 1; transform: scale(1.035) rotate(1deg); filter: blur(0); }
          100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); }
        }
        @keyframes logoBreathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.018); }
          100% { transform: scale(1); }
        }
        @keyframes leafReveal {
          0% { opacity: 0; transform: translateY(18px) scale(0.86) rotate(-7deg); filter: blur(6px); }
          70% { opacity: 1; transform: translateY(-2px) scale(1.035) rotate(1deg); filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); filter: blur(0); }
        }
        @keyframes wordReveal {
          0% { opacity: 0; transform: translateY(16px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes caretSweep {
          0% { transform: translateX(-110%); opacity: 0; }
          18% { opacity: 1; }
          82% { opacity: 1; }
          100% { transform: translateX(110%); opacity: 0; }
        }
        @keyframes ambientGlow {
          0% { opacity: 0.42; transform: scale(0.92); }
          50% { opacity: 0.72; transform: scale(1.06); }
          100% { opacity: 0.42; transform: scale(0.92); }
        }
        .premium-mark {
          animation: markEnter 780ms cubic-bezier(0.34, 1.56, 0.64, 1) 120ms both;
        }
        .animate-logo-breathe {
          animation: logoBreathe 1100ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .premium-mark path {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation: leafReveal 720ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .premium-mark path:nth-of-type(1) { animation-delay: 240ms; }
        .premium-mark path:nth-of-type(2) { animation-delay: 390ms; }
        .premium-mark path:nth-of-type(3) { animation-delay: 560ms; }
        .premium-mark path:nth-of-type(4) { animation-delay: 720ms; }
        .premium-mark path:nth-of-type(5) { animation-delay: 880ms; }
        .brand-word {
          display: inline-block;
          opacity: 0;
          animation: wordReveal 460ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .brand-word:nth-child(1) { animation-delay: 920ms; }
        .brand-word:nth-child(2) { animation-delay: 1080ms; }
        .brand-word:nth-child(3) { animation-delay: 1240ms; }
        .brand-type-mask {
          position: relative;
          display: inline-flex;
          gap: 0.32em;
          overflow: hidden;
        }
        .brand-type-mask::after {
          content: '';
          position: absolute;
          inset: -10% 0;
          width: 48%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.82), transparent);
          animation: caretSweep 1150ms cubic-bezier(0.22, 1, 0.36, 1) 920ms both;
        }
        .ambient-glow {
          animation: ambientGlow 2200ms ease-in-out infinite;
        }
      `}</style>

      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#fcfbf8]"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'fade' ? 0 : 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
        <div
          className="ambient-glow absolute rounded-full"
          style={{
            width: 'min(72vw, 340px)',
            height: 'min(72vw, 340px)',
            background: 'radial-gradient(circle, rgba(34,197,94,0.18), rgba(20,184,166,0.08) 42%, transparent 70%)',
          }}
        />

        <motion.div
          className="relative flex items-center justify-center"
          animate={phase === 'pulse' ? { y: [0, -3, 0] } : {}}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="/animacion para bienestar en claro.svg"
            alt="Bienestar en Claro"
            className={`premium-mark ${phase === 'pulse' ? 'animate-logo-breathe' : ''}`}
            style={{
              transformOrigin: 'center',
              display: 'block',
              width: 'min(64vw, 280px)',
              height: 'auto',
              filter: 'drop-shadow(0 22px 42px rgba(20, 83, 45, 0.16))',
            }}
          />
        </motion.div>

        <div
          className="relative"
          style={{
            textAlign: 'center',
            marginTop: '22px',
          }}
        >
          <h1
            className="brand-type-mask font-light text-gray-800"
            style={{
              fontSize: 'clamp(1.35rem, 5vw, 2rem)',
              letterSpacing: '0.08em',
              lineHeight: 1.1,
            }}
          >
            {brandTitle.split(' ').map((word) => (
              <span key={word} className="brand-word">{word}</span>
            ))}
          </h1>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.45, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              width: 96,
              height: 1,
              background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
              margin: '14px auto 0',
              transformOrigin: 'center',
            }}
          />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            className="font-medium uppercase text-emerald-700"
            style={{ fontSize: 'clamp(0.62rem, 2vw, 0.78rem)', letterSpacing: '0.32em', marginTop: '12px' }}
          >
            Bienestar inteligente
          </motion.p>
        </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default BienestarEnClaroSplash;
