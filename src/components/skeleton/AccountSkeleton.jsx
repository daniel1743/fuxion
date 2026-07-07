import React from 'react';
import SkeletonBase from './SkeletonBase';

/**
 * AccountSkeleton — Estructura temporal de la página de cuenta
 * 
 * Se muestra mientras se verifica la autenticación.
 */
const AccountSkeleton = () => {
  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-24">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <SkeletonBase variant="text" className="h-4 w-20" />
            <SkeletonBase variant="text" className="h-8 w-48" />
            <SkeletonBase variant="text" className="h-4 w-64" />
          </div>

          {/* Wellness plan card */}
          <SkeletonBase variant="text" className="h-32 w-full rounded-2xl" />

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-4 space-y-2">
                <SkeletonBase variant="circular" className="h-5 w-5" />
                <SkeletonBase variant="text" className="h-8 w-12" />
                <SkeletonBase variant="text" className="h-4 w-24" />
              </div>
            ))}
          </div>

          {/* Progress card */}
          <SkeletonBase variant="text" className="h-28 w-full rounded-xl" />

          {/* Gifts */}
          <SkeletonBase variant="text" className="h-6 w-48" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-3 space-y-2">
                <SkeletonBase variant="rectangular" className="h-24 w-full" />
                <SkeletonBase variant="text" className="h-4 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountSkeleton;
