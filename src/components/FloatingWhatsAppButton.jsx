import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { confirmAndOpenWhatsapp } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import { useScrollAware } from '@/components/ScrollAwareFloating';
import { Button } from '@/components/ui/button';

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
          className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] md:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-4 z-floating sm:left-6"
          onMouseEnter={() => { setIsPaused(true); setIsHovered(true); }}
          onMouseLeave={() => { setIsPaused(false); setIsHovered(false); }}
          onFocus={() => { setIsPaused(true); setIsHovered(true); }}
          onBlur={() => { setIsPaused(false); setIsHovered(false); }}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/95 p-1.5 pr-2 shadow-xl backdrop-blur dark:bg-neutral-950/95">
            <Button
              type="button"
              variant="whatsapp"
              size="sm"
              onClick={handleOpenWhatsapp}
              className="group rounded-full pl-3 pr-4"
              aria-label="Hablar por WhatsApp con un asesor"
            >
              <WhatsAppIcon className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Asesor por WhatsApp</span>
              <MessageCircle className="h-4 w-4 opacity-80 transition group-hover:translate-x-0.5 ml-1" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8 rounded-full"
              aria-label="Ocultar botón de WhatsApp"
              title="Ocultar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingWhatsAppButton;
