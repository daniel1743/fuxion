/**
 * Configuración de rendimiento y Core Web Vitals
 * Optimiza LCP, CLS e INP para móviles y desktop
 */

/**
 * Lista de recursos críticos que deben pre-cargarse
 */
export const PRELOAD_ASSETS = [
  // Fuentes críticas
  {
    href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap',
    as: 'style',
    crossorigin: 'anonymous',
  },
  // Imágenes above-the-fold
  {
    href: '/branding/social/og-image.png',
    as: 'image',
    type: 'image/png',
  },
  {
    href: '/branding/social/twitter-card.png',
    as: 'image',
    type: 'image/png',
  },
];

/**
 * Prefetch de rutas críticas
 */
export const PREFETCH_ROUTES = [
  '/explorar',
  '/blog',
  '/bienestar',
  '/oportunidad-fuxion',
  '/contacto',
  '/faq',
];

/**
 * Recursos que deben preconnectarse
 */
export const PRECONNECT_HOSTS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://cdn.jsdelivr.net',
  'https://cdn.supabase.io',
];

/**
 * Configuración de imágenes optimizadas
 */
export const IMAGE_CONFIG = {
  formats: ['webp', 'avif', 'jpeg'],
  breakpoints: [320, 640, 768, 1024, 1280, 1536],
  maxFileSize: 200000, // 200KB
  quality: 80,
  placeholder: 'blur',
};

/**
 * Tipografía con font-display: swap para evitar FOIT
 */
export const FONT_STRATEGY = {
  display: 'swap',
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
};
