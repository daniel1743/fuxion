import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

/**
 * ProductGridSkeleton — Grid de skeletons para productos
 * 
 * Muestra una cuadrícula de ProductCardSkeleton mientras carga.
 * Por defecto: 6 skeletons en grid responsive.
 */
const ProductGridSkeleton = ({ count = 6, compact = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            animationDelay: `${i * 0.05}s`,
            opacity: 0,
            animation: `fadeInUp 0.3s ease-out ${i * 0.05}s forwards`,
          }}
        >
          <ProductCardSkeleton compact={compact} />
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
