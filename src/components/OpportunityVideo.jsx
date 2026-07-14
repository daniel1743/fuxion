import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Youtube, X, ExternalLink, AlertCircle } from 'lucide-react';

const VIDEO_ID = 'L_AIXB0MI8A';
const YOUTUBE_WATCH_URL = `https://youtu.be/${VIDEO_ID}`;
const EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;

const OpportunityVideo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef(null);
  const modalRef = useRef(null);

  // ── Track event ─────────────────────────────────────────────
  const trackClick = useCallback(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'OPPORTUNITY_VIDEO_CLICK', {
        event_category: 'opportunity',
        event_label: 'Video oportunidad FuXion'
      });
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fuxion:track', {
        detail: { event: 'OPPORTUNITY_VIDEO_CLICK', source: 'opportunity_page' }
      }));
    }
  }, []);

  // ── Open modal ──────────────────────────────────────────────
  const handleOpen = useCallback(() => {
    setIsModalOpen(true);
    setIframeError(false);
    setIframeLoaded(false);
    trackClick();
  }, [trackClick]);

  // ── Close modal ─────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setIframeError(false);
    setIframeLoaded(false);
  }, []);

  // ── Iframe error handler ────────────────────────────────────
  const handleIframeError = useCallback(() => {
    setIframeError(true);
  }, []);

  // ── Iframe load handler ─────────────────────────────────────
  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true);
  }, []);

  // ── Open in YouTube directly ────────────────────────────────
  const handleOpenInYouTube = useCallback(() => {
    window.open(YOUTUBE_WATCH_URL, '_blank', 'noopener,noreferrer');
  }, []);

  // ── Close on Escape key ─────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleClose]);

  // ── Lock body scroll when modal is open ─────────────────────
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // ── Close on backdrop click ─────────────────────────────────
  const handleBackdropClick = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          CARD PREVIEW
      ════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-3xl mx-auto">
        <div
          onClick={handleOpen}
          className="relative rounded-2xl overflow-hidden shadow-premium-soft bg-card border border-emerald-100 dark:border-border cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-0.5"
        >
          {/* Thumbnail */}
          <div className="aspect-video relative overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`}
              alt="Vista previa del video explicativo FuXion"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0.8 }}
                whileHover={{ scale: 1.05, opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-emerald-500/40"
              >
                <Play className="w-7 h-7 md:w-8 md:h-8 ml-1 fill-white" />
              </motion.div>
            </div>

            {/* Bottom text overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm md:text-base font-semibold drop-shadow-lg">
                ▶ Ver explicación
              </p>
              <p className="text-white/70 text-xs md:text-sm drop-shadow-md">
                2 minutos · Conoce cómo funciona
              </p>
            </div>
          </div>

          {/* Card info section */}
          <div className="p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
              Conoce cómo funciona la oportunidad FuXion
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Un video corto para entender el proyecto antes de decidir.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODAL
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-max flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 28 }}
              className="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden shadow-2xl border border-emerald-100 dark:border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Close button ──────────────────────────────── */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-content w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                aria-label="Cerrar video"
              >
                <X className="w-5 h-5" />
              </button>

              {/* ── Video container ───────────────────────────── */}
              <div className="aspect-video relative bg-black">
                {!iframeError ? (
                  <>
                    <iframe
                      ref={iframeRef}
                      src={EMBED_URL}
                      title="Video explicativo: Oportunidad FuXion"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                    />

                    {/* Loading spinner */}
                    {!iframeLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-white/80 text-sm font-medium">
                            Cargando video...
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* ── Fallback when iframe is blocked ────────── */
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 to-teal-900 p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-5">
                      <AlertCircle className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                      No pudimos cargar el video aquí
                    </h3>
                    <p className="text-emerald-100/80 text-sm md:text-base mb-6 max-w-sm">
                      Puedes verlo directamente en YouTube.
                    </p>
                    <button
                      onClick={handleOpenInYouTube}
                      className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 font-bold rounded-[20px] px-6 py-3 shadow-lg transition-all hover:shadow-xl active:scale-95"
                    >
                      <Youtube className="w-5 h-5" />
                      Ver video en YouTube
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* ── Modal footer ──────────────────────────────── */}
              <div className="p-4 md:p-5 bg-card border-t border-emerald-100 dark:border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Oportunidad FuXion
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Conoce cómo funciona el proyecto
                  </p>
                </div>
                <button
                  onClick={handleOpenInYouTube}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                  Ver en YouTube
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OpportunityVideo;
