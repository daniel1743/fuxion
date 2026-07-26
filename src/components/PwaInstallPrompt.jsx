import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { usePwaInstall } from '@/hooks/usePwaInstall';

const STORAGE_KEY = 'fuxion-pwa-install-prompt-next-at';
const COOKIE_CONSENT_KEY = 'fuxion_cookie_consent';
const DAY = 24 * 60 * 60 * 1000;

const PwaInstallPrompt = () => {
  const { canInstall, installed, isIos, install } = usePwaInstall();
  const [visible, setVisible] = useState(false);

  const postpone = (days) => {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now() + days * DAY));
    setVisible(false);
  };

  useEffect(() => {
    if (installed || (!canInstall && !isIos)) {
      setVisible(false);
      return undefined;
    }

    const nextAt = Number(window.localStorage.getItem(STORAGE_KEY) || 0);
    if (Date.now() < nextAt) return undefined;

    const showTimer = window.setTimeout(() => {
      if (!window.localStorage.getItem(COOKIE_CONSENT_KEY)) return;
      setVisible(true);
    }, 9000);
    return () => window.clearTimeout(showTimer);
  }, [canInstall, installed, isIos]);

  useEffect(() => {
    if (!visible) return undefined;

    const hideTimer = window.setTimeout(() => postpone(7), 15000);
    return () => window.clearTimeout(hideTimer);
  }, [visible]);

  const handleInstall = async () => {
    if (isIos && !canInstall) {
      toast({
        title: 'Instalar Bienestar en Claro',
        description: 'En Safari toca Compartir y luego “Añadir a pantalla de inicio”.',
        duration: 8000
      });
      postpone(14);
      return;
    }

    const result = await install();
    postpone(result.outcome === 'accepted' ? 90 : 14);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-5 left-4 z-toast w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-emerald-200 bg-background/95 p-4 shadow-2xl backdrop-blur-md sm:bottom-6 sm:left-6"
          aria-label="Instalar aplicación"
        >
          <button
            type="button"
            onClick={() => postpone(14)}
            className="absolute right-2 top-2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Cerrar aviso"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex gap-3 pr-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-foreground">Lleva Fuxion en tu teléfono</p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">
                Instala la aplicación para acceder más rápido.
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              onClick={handleInstall}
              className="h-9 flex-1 gap-2 bg-fuxion text-white hover:bg-fuxion-light"
            >
              <Download className="h-4 w-4" />
              Instalar app
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => postpone(14)}>
              Ahora no
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default PwaInstallPrompt;
