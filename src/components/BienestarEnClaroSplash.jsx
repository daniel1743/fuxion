import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPLASH_KEY = 'splash_shown_v2';

function isPwaStandalone() {
  if (typeof window === 'undefined') return false;
  try {
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
    if (window.navigator.standalone === true) return true;
  } catch (_) {}
  return false;
}

function shouldBypassSplash() {
  try {
    return !!localStorage.getItem(SPLASH_KEY) || !isPwaStandalone();
  } catch (_) {
    return !isPwaStandalone();
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

    try { localStorage.setItem(SPLASH_KEY, 'true'); } catch (_) {}

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

  return (
    <>
      <style>{`
        @keyframes logoGrow {
          0% { opacity: 0; transform: scale(0.985) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes logoBreathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.012); }
          100% { transform: scale(1); }
        }
        @keyframes contentFade {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-logo-grow {
          animation: logoGrow 520ms cubic-bezier(0.33, 1, 0.68, 1) both;
        }
        .animate-logo-breathe {
          animation: logoBreathe 550ms cubic-bezier(0.42, 0, 0.58, 1) both;
        }
        .animate-content-fade {
          animation: contentFade 200ms cubic-bezier(0.33, 1, 0.68, 1) both;
        }
      `}</style>

      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'fade' ? 0 : 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
        <div className="flex items-center justify-center">
          <img
            src="/animacion para bienestar en claro.svg"
            alt="Bienestar en Claro"
            className={phase === 'grow' ? 'animate-logo-grow' : phase === 'pulse' ? 'animate-logo-breathe' : ''}
            style={{
              transformOrigin: 'center',
              display: 'block',
            }}
          />
        </div>

        <div
          className={`animate-content-fade ${phase === 'pulse' || phase === 'fade' ? '' : 'opacity-0'}`}
          style={{
            textAlign: 'center',
            marginTop: '20px',
          }}
        >
          <h1
            className="font-light tracking-[0.25em] text-gray-700"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)' }}
          >
            Bienestar
          </h1>
          <h2
            className="font-light tracking-[0.5em] text-emerald-600"
            style={{ fontSize: 'clamp(0.65rem, 2vw, 0.875rem)', marginTop: '6px' }}
          >
            en Claro
          </h2>
        </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default BienestarEnClaroSplash;
