import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Mock del sistema de sonido para mantener el componente autónomo
class SoundIdentity {
  playEquilibriumSound() {
    console.log("🎵 [SoundIdentity]: Sonido 'Equilibrium' reproducido con éxito.");
  }
}

const BienestarEnClaroSplash = ({ onFinish = () => console.log('Splash finalizado') }) => {
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const logoPath = '/branding/mujer%20logo.svg';

  useEffect(() => {
    // Quita cualquier splash estático que pudiera quedar en el DOM
    const initialSplash = document.getElementById('initial-splash');
    if (initialSplash) initialSplash.style.display = 'none';

    const soundSystem = new SoundIdentity();

    // Reproducir sonido solo después de una interacción del usuario
    const handleInteraction = () => {
      soundSystem.playEquilibriumSound();
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('pointerdown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    // Ciclo de vida: Iniciar la salida tras 4.6s (exit.delay)
    const exitTimer = setTimeout(() => setIsVisible(false), 4600);
    return () => {
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      clearTimeout(exitTimer);
    };
  }, []);

  // Configuraciones de animación (Framer Motion)
  
  // 1. Efecto inicial: Inicia idéntico al splash nativo (sin wipe, escala 1) y luego respira
  const logoVariants = {
    hidden: { 
      scale: 1.0,
      filter: "drop-shadow(0px 0px 0px rgba(183, 216, 176, 0))" 
    },
    visible: {
      scale: shouldReduceMotion ? 1.0 : [1.0, 1.04, 1.0],
      filter: shouldReduceMotion 
        ? "drop-shadow(0px 0px 0px rgba(183, 216, 176, 0))"
        : ["drop-shadow(0px 0px 0px rgba(183, 216, 176, 0))", "drop-shadow(0px 0px 16px rgba(183, 216, 176, 0.35))", "drop-shadow(0px 0px 8px rgba(183, 216, 176, 0.15))"],
      transition: { 
        duration: 2.8, 
        ease: "easeInOut", 
        delay: 0.3 // Esperamos una fracción de segundo después del handoff de Android
      }
    }
  };

  // 2. Tipografía premium
  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 12, 
      filter: shouldReduceMotion ? "blur(0px)" : "blur(6px)" 
    },
    visible: {
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        delay: 0.8, // Entra suavemente mientras el logo hace su primera "respiración"
        duration: 1.5, 
        ease: "easeOut" 
      }
    }
  };

  // 3. Salida (Exit)
  const exitVariants = {
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 1.02,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ backgroundColor: '#FCFBF8', willChange: 'opacity, transform' }}
          // INICIO CRÍTICO: Opacidad 1 desde el ms 0 para empatar con Android
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit="exit"
          variants={exitVariants}
        >
          {/* Contenedor principal */}
          <div className="flex flex-col items-center">
            
            {/* Animación fluida del Logo */}
            <motion.div 
              variants={logoVariants} 
              initial="hidden" 
              animate="visible" 
              style={{ willChange: 'transform, filter' }}
            >
              <img 
                src={logoPath} 
                alt="Bienestar en Claro Logo" 
                // El tamaño debe ser aproximado a cómo Android renderiza el maskable icon
                style={{ width: '320px', height: 'auto', display: 'block' }} 
              />
            </motion.div>

            {/* Texto Premium */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 text-gray-800 uppercase"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
                letterSpacing: '0.18em',
                fontSize: '1.25rem', // text-xl equivalente
                willChange: 'opacity, transform, filter'
              }}
            >
              Bienestar en Claro
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BienestarEnClaroSplash;
