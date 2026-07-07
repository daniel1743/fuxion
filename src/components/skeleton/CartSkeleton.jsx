import React from 'react';
import SkeletonBase from './SkeletonBase';

/**
 * CartSkeleton — Estructura temporal del carrito mientras carga
 * 
 * Muestra la estructura del carrito con skeletons.
 */
const CartSkeleton = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 space-y-3">
          <SkeletonBase variant="text" className="h-10 w-48" />
          <SkeletonBase variant="text" className="h-5 w-32" />
          <SkeletonBase variant="text" className="h-20 w-full rounded-xl" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Product list */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex gap-3 sm:flex-1">
                    <SkeletonBase variant="rectangular" className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <SkeletonBase variant="text" className="h-5 w-3/4" />
                      <SkeletonBase variant="text" className="h-6 w-1/4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <SkeletonBase variant="circular" className="h-7 w-7 sm:h-8 sm:w-8" />
                      <SkeletonBase variant="text" className="h-6 w-8 sm:w-12" />
                      <SkeletonBase variant="circular" className="h-7 w-7 sm:h-8 sm:w-8" />
                      <SkeletonBase variant="circular" className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>
                    <SkeletonBase variant="text" className="h-6 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <SkeletonBase variant="text" className="h-6 w-24" />
              <SkeletonBase variant="text" className="h-5 w-full" />
              <SkeletonBase variant="text" className="h-5 w-full" />
              <SkeletonBase variant="text" className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
