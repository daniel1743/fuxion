import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';

const floatKeyframes = {
  y: [0, -8, 0],
  rotate: [0, 2, -2, 0],
};

const MobileHero = ({ onExplore }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    if (onExplore) onExplore();
    navigate('/explorar');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 pt-4"
    >
      {/* Hero Card */}
      <div
        className="relative overflow-hidden rounded-3xl p-6"
        style={{
          backgroundColor: '#0F5D52',
          boxShadow:
            '0 8px 32px rgba(15, 93, 82, 0.25), 0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: '#34d399' }}
        />

        <div className="relative flex items-stretch gap-4">
          {/* Left content — ~60% */}
          <div className="flex w-[60%] flex-col justify-between">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-xl font-bold leading-tight text-white"
              >
                Nutrición natural para sentirte mejor
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="mt-2 text-xs leading-relaxed text-white/70"
              >
                Encuentra productos para energía, digestión, control de peso y
                bienestar.
              </motion.p>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExplore}
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold transition-shadow hover:shadow-lg"
              style={{ color: '#0F5D52' }}
            >
              Explorar productos
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
            </motion.button>
          </div>

          {/* Right decorative shape — ~40% */}
          <motion.div
            className="flex w-[40%] items-center justify-center"
            animate={floatKeyframes}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div
              className="flex h-28 w-28 items-center justify-center relative overflow-hidden"
              style={{
                backgroundColor: 'rgba(26, 122, 109, 0.40)',
                clipPath:
                  'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
              }}
            >
              <img 
                src="/prunex-principal.jpeg" 
                alt="Producto Fuxion" 
                className="w-full h-full object-cover opacity-90 scale-110"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className={`block rounded-full ${
              i === 0 ? 'h-2 w-2 bg-white' : 'h-1.5 w-1.5 bg-white/40'
            }`}
            style={
              i === 0
                ? { boxShadow: '0 0 6px rgba(255,255,255,0.5)' }
                : undefined
            }
          />
        ))}
      </div>
    </motion.section>
  );
};

export default MobileHero;
