import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cookie, Settings, Check, X } from 'lucide-react';

const STORAGE_KEY = 'fuxion_cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

// ── Get consent from localStorage ─────────────────────────────
const getStoredConsent = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    // Check if expired
    if (parsed.expires && Date.now() > parsed.expires) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

// ── Save consent to localStorage ──────────────────────────────
const saveConsent = (preferences) => {
  const data = {
    ...preferences,
    expires: Date.now() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// ── Apply cookie preferences ──────────────────────────────────
const applyPreferences = (preferences) => {
  // Analytics cookies (Google Analytics gtag)
  if (preferences.analytics) {
    window['ga-disable-GA_MEASUREMENT_ID'] = false;
    // Enable analytics
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  } else {
    window['ga-disable-GA_MEASUREMENT_ID'] = true;
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  }

  // Experience cookies
  if (preferences.experience) {
    localStorage.setItem('fuxion_experience_consent', 'granted');
  } else {
    localStorage.removeItem('fuxion_experience_consent');
  }
};

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, locked
    experience: true,
    analytics: true,
  });

  // ── Check consent on mount ──────────────────────────────────
  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Show banner after a small delay for smooth UX
      const timer = setTimeout(() => setShowBanner(true), 800);
      return () => clearTimeout(timer);
    }
    // Apply stored preferences
    applyPreferences(stored);
  }, []);

  // ── Handle accept all ───────────────────────────────────────
  const handleAcceptAll = useCallback(() => {
    const allAccepted = { necessary: true, experience: true, analytics: true };
    saveConsent(allAccepted);
    applyPreferences(allAccepted);
    setShowBanner(false);
    setShowModal(false);
  }, []);

  // ── Handle reject all (only necessary) ──────────────────────
  const handleRejectAll = useCallback(() => {
    const onlyNecessary = { necessary: true, experience: false, analytics: false };
    saveConsent(onlyNecessary);
    applyPreferences(onlyNecessary);
    setShowBanner(false);
    setShowModal(false);
  }, []);

  // ── Handle save preferences from modal ──────────────────────
  const handleSavePreferences = useCallback(() => {
    saveConsent(preferences);
    applyPreferences(preferences);
    setShowBanner(false);
    setShowModal(false);
  }, [preferences]);

  // ── Toggle modal ────────────────────────────────────────────
  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // ── Toggle preference switch ────────────────────────────────
  const togglePreference = useCallback((key) => {
    if (key === 'necessary') return; // Cannot toggle necessary
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          BANNER — Bottom Sheet
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showBanner && !showModal && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-max p-4 sm:p-6 pointer-events-none"
          >
            <div className="max-w-2xl mx-auto pointer-events-auto">
              <div
                className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/30"
                style={{
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                {/* Decorative gradient */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-100/30 dark:bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative p-5 sm:p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                      <Cookie className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-base mb-1">
                        🍪 Mejora de Experiencia
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Utilizamos cookies estrictamente necesarias para el funcionamiento de la tienda, y cookies analíticas para mejorar tu experiencia de navegación y ofrecerte un servicio más personalizado. No usamos cookies de publicidad. Puedes elegir cómo interactuar con ellas.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <Button
                      onClick={handleAcceptAll}
                      className="flex-1 shadow-premium-soft hover:shadow-md"
                      size="default"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Aceptar Todo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={openModal}
                      size="default"
                      className="flex-1"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configurar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════
          MODAL — Cookie Preferences
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-max flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden"
              style={{ borderRadius: '20px' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-bold text-foreground text-base">Configurar Cookies</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Necessary — Always on */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                  <div>
                    <p className="font-semibold text-foreground text-sm">Cookies Necesarias</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Siempre activas — Requeridas para el funcionamiento</p>
                  </div>
                  <div className="relative">
                    <div className="w-11 h-6 rounded-full bg-emerald-500 flex items-center px-0.5 opacity-80">
                      <div className="w-5 h-5 rounded-full bg-white shadow-sm ml-auto" />
                    </div>
                  </div>
                </div>

                {/* Experience — Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-blue-200/60 dark:hover:border-blue-800/40 transition-colors duration-200">
                  <div>
                    <p className="font-semibold text-foreground text-sm">Cookies de Experiencia</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Personalización de idioma y preferencias visuales</p>
                  </div>
                  <button
                    onClick={() => togglePreference('experience')}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                      preferences.experience ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                    }`}
                    aria-label={preferences.experience ? 'Desactivar cookies de experiencia' : 'Activar cookies de experiencia'}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        preferences.experience ? 'translate-x-[22px]' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Analytics — Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-purple-200/60 dark:hover:border-purple-800/40 transition-colors duration-200">
                  <div>
                    <p className="font-semibold text-foreground text-sm">Cookies de Análisis</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Estadísticas anónimas para mejorar la plataforma</p>
                  </div>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                      preferences.analytics ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                    }`}
                    aria-label={preferences.analytics ? 'Desactivar cookies de análisis' : 'Activar cookies de análisis'}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        preferences.analytics ? 'translate-x-[22px]' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 p-5 border-t border-border/60 bg-muted/30">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRejectAll}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Rechazar todo
                </Button>
                <div className="flex-1" />
                <Button
                  size="sm"
                  onClick={handleSavePreferences}
                  className="shadow-premium-soft"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Guardar Preferencias
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CookieConsentBanner;
