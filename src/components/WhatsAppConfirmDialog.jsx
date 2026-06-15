import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { openWhatsapp } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';

const WhatsAppConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleConfirmRequest = (event) => {
      setMessage(event.detail?.message || 'Hola, quiero hablar con un asesor Fuxion.');
      setIsOpen(true);
    };

    window.addEventListener('fuxion:confirm-whatsapp', handleConfirmRequest);
    return () => window.removeEventListener('fuxion:confirm-whatsapp', handleConfirmRequest);
  }, []);

  const handleContinue = () => {
    openWhatsapp(message);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md border-emerald-100 bg-white p-0 shadow-2xl dark:border-emerald-900 dark:bg-card">
        <div className="p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
            <WhatsAppIcon className="h-6 w-6" />
          </div>

          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Hablar con un asesor
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-muted-foreground">
              Te llevaremos a WhatsApp para conversar con un asesor Fuxion. No se realizará ningún cobro automático; podrás resolver dudas y coordinar tu pedido directamente.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700 dark:text-emerald-300" />
            <span>La conversación se abrirá en una nueva pestaña con el mensaje listo para enviar.</span>
          </div>
        </div>

        <DialogFooter className="gap-3 border-t border-border bg-secondary/40 p-4 sm:justify-between sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="h-11"
          >
            Volver
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            className="h-11 gap-2 bg-green-600 hover:bg-green-700"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Continuar a WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppConfirmDialog;
