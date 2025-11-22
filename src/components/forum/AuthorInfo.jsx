import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VerifiedBadge from './VerifiedBadge';

/**
 * Componente para mostrar información del autor
 * Incluye verificación y controles de moderación
 */
const AuthorInfo = ({
  author,
  authorAvatar,
  createdAt,
  verified = false,
  isOwner = false,
  onDelete = null,
  showModeration = false
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Hace poco';

    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">{authorAvatar}</span>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {author}
            </span>
            {(verified || isOwner || author === 'Fuxion Shop') && (
              <VerifiedBadge size="sm" />
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(createdAt)}
          </span>
        </div>
      </div>

      {showModeration && onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('¿Estás seguro de eliminar este contenido?')) {
              onDelete();
            }
          }}
          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default AuthorInfo;
