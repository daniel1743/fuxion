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
  
  // 1. Efecto wipe para reemplazar stroke-reveal (draw + fill = 2.4s)
  const maskVariants = {
    hidden: { 
      clipPath: shouldReduceMotion ? undefined : "inset(100% 0% 0% 0%)",
      opacity: shouldReduceMotion ? 0 : 1
    },
    visible: { 
      clipPath: shouldReduceMotion ? undefined : "inset(0% 0% 0% 0%)",
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 1.5 : 2.4, // duration covers draw (1.8s) + fill (0.6s)
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
        delay: 0.4 // intro delay
      }
    }
  };

  // 2. Efecto bloom: Scale (0.96 -> 1) and Glow
  const bloomVariants = {
    hidden: { 
      scale: shouldReduceMotion ? 1 : 0.96,
      filter: "drop-shadow(0px 0px 0px rgba(183, 216, 176, 0))" 
    },
    visible: {
      scale: 1.0,
      filter: shouldReduceMotion 
        ? "drop-shadow(0px 0px 0px rgba(183, 216, 176, 0))"
        : "drop-shadow(0px 0px 12px rgba(183, 216, 176, 0.22))",
      transition: { 
        duration: 0.9, 
        ease: "easeOut", 
        delay: 2.8 
      }
    }
  };

  // 3. Tipografía premium
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
        delay: 2.2, 
        duration: 1.5, 
        ease: "easeOut" 
      }
    }
  };

  // 4. Salida (Exit)
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4 } }}
          exit="exit"
          variants={exitVariants}
        >
          {/* Contenedor con efecto de respiración (breathing loop) */}
          <motion.div
            style={{ willChange: 'transform' }}
            animate={shouldReduceMotion ? {} : {
              scale: [1, 1.012, 1],
              y: [0, -2, 0]
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 3.7 // Empieza después de que termine el bloom
            }}
            className="flex flex-col items-center"
          >
            {/* Capa de Bloom */}
            <motion.div variants={bloomVariants} initial="hidden" animate="visible" style={{ willChange: 'transform, filter' }}>
              {/* Capa de Draw (Wipe Reveal) */}
              <motion.div variants={maskVariants} initial="hidden" animate="visible" style={{ willChange: 'clip-path' }}>
                <img 
                  src={logoPath} 
                  alt="Bienestar en Claro Logo" 
                  style={{ width: '320px', height: 'auto', display: 'block' }} 
                />
              </motion.div>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BienestarEnClaroSplash;
