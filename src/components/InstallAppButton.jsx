import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { usePwaInstall } from '@/hooks/usePwaInstall';

const InstallAppButton = ({ className, onClick, compact = false }) => {
  const { canInstall, installed, isIos, install } = usePwaInstall();

  if (installed || (!canInstall && !isIos)) {
    return null;
  }

  const handleInstall = async () => {
    onClick?.();

    if (isIos && !canInstall) {
      toast({
        title: 'Instalar Bienestar en Claro',
        description: 'En Safari toca Compartir y luego “Añadir a pantalla de inicio”.',
        duration: 8000
      });
      return;
    }

    const result = await install();
    if (result.outcome === 'accepted') {
      toast({
        title: 'Instalando aplicación',
        description: 'Bienestar en Claro se añadirá a tu dispositivo.'
      });
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size={compact ? 'icon' : 'sm'}
      onClick={handleInstall}
      className={cn(
        'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 hover:text-emerald-800',
        className
      )}
      title="Instalar Bienestar en Claro como aplicación"
    >
      <Download className="h-4 w-4 shrink-0" />
      {!compact && <span>Instalar app</span>}
    </Button>
  );
};

export default InstallAppButton;
