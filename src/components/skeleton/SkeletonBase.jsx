import React from 'react';

/**
 * SkeletonBase — Componente base reutilizable para skeleton loading.
 * 
 * Características:
 * - Shimmer animado premium (1.5s)
 * - Respeta prefers-reduced-motion
 * - Compatible con dark mode
 * - bg-muted + rounded-xl por defecto
 */

const SkeletonBase = ({
  className = '',
  variant = 'text', // 'text' | 'circular' | 'rectangular' | 'card'
  width,
  height,
  rounded = true,
  animate = true,
}) => {
  const baseClasses = 'bg-muted relative overflow-hidden';
  const roundedClasses = rounded ? 'rounded-xl' : '';
  
  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'h-10 w-10 rounded-full',
    rectangular: 'h-32 w-full',
    card: 'h-full w-full',
  };

  const motionSafe = animate ? '' : 'motion-safe:';

  return (
    <div
      className={`
        ${baseClasses}
        ${roundedClasses}
        ${variantClasses[variant] || variantClasses.text}
        ${className}
        ${motionSafe}animate-shimmer
      `}
      style={{
        width: width || undefined,
        height: height || undefined,
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
};

export default SkeletonBase;
