import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { confirmAndOpenWhatsapp } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import { useScrollAware } from '@/components/ScrollAwareFloating';

const SHOW_EVERY_MS = 90000;
const AUTO_HIDE_MS = 14000;
const INITIAL_DELAY_MS = 6000;

const FloatingWhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hideTimerRef = useRef(null);
  const showIntervalRef = useRef(null);
  const initialTimerRef = useRef(null);

  // Scroll awareness — reduce opacidad al hacer scroll
  const { isScrolling, style: scrollStyle } = useScrollAware();

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const scheduleAutoHide = () => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      if (!isPaused) {
        setIsVisible(false);
      }
    }, AUTO_HIDE_MS);
  };

  useEffect(() => {
    initialTimerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, INITIAL_DELAY_MS);

    showIntervalRef.current = setInterval(() => {
      setIsVisible(true);
    }, SHOW_EVERY_MS);

    return () => {
      clearTimeout(initialTimerRef.current);
      clearInterval(showIntervalRef.current);
      clearHideTimer();
    };
  }, []);

  useEffect(() => {
    if (isVisible && !isPaused) {
      scheduleAutoHide();
    }

    return clearHideTimer;
  }, [isVisible, isPaused]);

  const handleOpenWhatsapp = () => {
    confirmAndOpenWhatsapp('Hola, quiero hablar con un asesor Fuxion.');
    setIsVisible(false);
  };

  // Restaurar opacidad al hacer hover o touch
  const effectiveOpacity = isHovered ? 1 : scrollStyle.opacity;
  const effectiveScale = isHovered ? 1 : scrollStyle.scale;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{
            opacity: effectiveOpacity,
            y: 0,
            scale: effectiveScale,
          }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed bottom-6 left-4 z-50 sm:left-6 pb-[env(safe-area-inset-bottom)]"
          onMouseEnter={() => { setIsPaused(true); setIsHovered(true); }}
          onMouseLeave={() => { setIsPaused(false); setIsHovered(false); }}
          onFocus={() => { setIsPaused(true); setIsHovered(true); }}
          onBlur={() => { setIsPaused(false); setIsHovered(false); }}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/95 p-1.5 pr-2 shadow-xl backdrop-blur dark:bg-neutral-950/95">
            <button
              type="button"
              onClick={handleOpenWhatsapp}
              className="group inline-flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1fb85a] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40"
              aria-label="Hablar por WhatsApp con un asesor"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Asesor por WhatsApp</span>
              <MessageCircle className="h-4 w-4 opacity-80 transition group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Ocultar botón de WhatsApp"
              title="Ocultar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingWhatsAppButton;
