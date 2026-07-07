import React from 'react';
import SkeletonBase from './SkeletonBase';

/**
 * ArticleSkeleton — Imita la estructura de un artículo de blog/bienestar
 * 
 * Layout:
 * - Imagen del artículo
 * - Título
 * - Extracto (2-3 líneas)
 * - Meta información
 */
const ArticleSkeleton = ({ variant = 'card' }) => {
  if (variant === 'featured') {
    return (
      <div className="relative mx-auto mt-10 grid max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-2">
        {/* Image */}
        <div className="min-h-64 bg-muted relative">
          <SkeletonBase variant="rectangular" className="absolute inset-0 !rounded-none" />
        </div>
        {/* Content */}
        <div className="flex flex-col justify-center p-6 sm:p-10 space-y-4">
          <SkeletonBase variant="text" className="h-6 w-24 rounded-full" />
          <SkeletonBase variant="text" className="h-4 w-32" />
          <SkeletonBase variant="text" className="h-8 w-3/4" />
          <SkeletonBase variant="text" className="h-4 w-full" />
          <SkeletonBase variant="text" className="h-4 w-5/6" />
          <SkeletonBase variant="text" className="h-4 w-2/3" />
          <SkeletonBase variant="text" className="h-4 w-48" />
          <SkeletonBase variant="text" className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Image */}
      <div className="relative aspect-[16/10] bg-muted">
        <SkeletonBase variant="rectangular" className="absolute inset-0 !rounded-none" />
      </div>
      {/* Content */}
      <div className="p-5 space-y-3">
        <SkeletonBase variant="text" className="h-5 w-20 rounded-full" />
        <SkeletonBase variant="text" className="h-5 w-full" />
        <SkeletonBase variant="text" className="h-4 w-5/6" />
        <SkeletonBase variant="text" className="h-4 w-4/6" />
        <SkeletonBase variant="text" className="h-4 w-2/6" />
        <SkeletonBase variant="text" className="h-4 w-32" />
        <SkeletonBase variant="text" className="h-4 w-24 text-primary" />
      </div>
    </div>
  );
};

export default ArticleSkeleton;
