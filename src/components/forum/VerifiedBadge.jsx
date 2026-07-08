import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkBadge02Icon } from '@hugeicons/core-free-icons';

/**
 * Badge de verificación para el dueño de la página
 * Se muestra junto al nombre "Fuxion Shop"
 */
const VerifiedBadge = ({ size = 'sm' }) => {
  const sizeMap = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24
  };

  const iconSize = sizeMap[size] || 16;

  return (
    <HugeiconsIcon
      icon={CheckmarkBadge02Icon}
      size={iconSize}
      className="text-blue-500 inline-block"
      title="Cuenta Oficial Verificada"
    />
  );
};

export default VerifiedBadge;
