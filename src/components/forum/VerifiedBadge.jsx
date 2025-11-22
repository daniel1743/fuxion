import React from 'react';
import { BadgeCheck } from 'lucide-react';

/**
 * Badge de verificación para el dueño de la página
 * Se muestra junto al nombre "Fuxion Shop"
 */
const VerifiedBadge = ({ size = 'sm' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <BadgeCheck
      className={`${sizeClasses[size]} text-blue-500 fill-blue-500/20 inline-block`}
      title="Cuenta Oficial Verificada"
    />
  );
};

export default VerifiedBadge;
