import React from 'react';
import SkeletonBase from './SkeletonBase';

/**
 * ProductCardSkeleton — Imita la estructura de una ProductCard
 * 
 * Layout:
 * - Imagen del producto (rectangular)
 * - Título
 * - Precio
 * - Botones de acción
 */
const ProductCardSkeleton = ({ compact = false }) => {
  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border flex flex-col h-full">
      {/* Image skeleton */}
      <div className={`relative overflow-hidden bg-muted flex-shrink-0 ${compact ? 'h-36' : 'h-48'}`}>
        <SkeletonBase
          variant="rectangular"
          className="absolute inset-0 !rounded-none"
          animate
        />
      </div>

      {/* Content skeleton */}
      <div className="p-4 flex flex-col flex-grow space-y-3">
        {/* Title */}
        <SkeletonBase variant="text" className="h-5 w-3/4" />
        
        {/* Price */}
        <SkeletonBase variant="text" className="h-6 w-1/3" />
        
        {/* Category badge */}
        <SkeletonBase variant="text" className="h-5 w-24 rounded-full" />
        
        {/* Spacer */}
        <div className="flex-grow" />
        
        {/* Buttons row */}
        <div className="flex gap-2">
          <SkeletonBase variant="text" className="h-9 flex-1 rounded-lg" />
          <SkeletonBase variant="circular" className="h-9 w-9" />
          <SkeletonBase variant="circular" className="h-9 w-9" />
          <SkeletonBase variant="circular" className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
