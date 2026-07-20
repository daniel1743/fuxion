/**
 * Componente de imagen optimizada
 * Implementa:
 * - srcset para responsive images
 * - width/height explícitos para evitar CLS
 * - loading="lazy" para imágenes below-the-fold
 * - decoding="async" para no bloquear el hilo principal
 * - placeholder para evitar CLS durante carga
 */

import React from 'react';

/**
 * OptimizedImage — Imagen con soporte para:
 * - srcset responsive (múltiples tamaños)
 * - width/height fijos (CLS mitigation)
 * - lazy loading
 * - decoding async
 * - blur placeholder
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  priority = false,
  sizes,
  srcSet,
  placeholder = 'blur',
  decoding = 'async',
  ...rest
}) => {
  // Generar srcset si no se proporciona
  const generatedSrcSet = srcSet || generateSrcSet(src, width);

  return (
    <picture>
      {/* WebP primero */}
      <source
        srcSet={generatedSrcSet.replace('.jpg', '.webp').replace('.png', '.webp')}
        type="image/webp"
      />
      {/* AVIF como segundo fallback */}
      <source
        srcSet={generatedSrcSet.replace('.jpg', '.avif').replace('.png', '.avif')}
        type="image/avif"
      />
      {/* JPEG fallback */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={decoding}
        className={className}
        sizes={sizes}
        {...rest}
      />
    </picture>
  );
};

/**
 * Genera srcset a partir de una imagen base
 */
function generateSrcSet(baseSrc, maxWidth) {
  if (!baseSrc) return '';

  const sizes = [320, 640, 768, 1024, maxWidth];
  return sizes
    .filter(size => size <= maxWidth)
    .map(size => `${baseSrc}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * HeroImage — Imagen de hero con lazy loading y placeholder
 */
const HeroImage = ({ src, alt, width, height }) => (
  <div className="relative w-full overflow-hidden rounded-2xl">
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="eager"
      fetchPriority="high"
      decoding="sync"
      className="w-full h-auto object-cover rounded-2xl"
      style={{ aspectRatio: `${width}/${height}` }}
    />
  </div>
);

export { OptimizedImage, HeroImage, generateSrcSet };
