/**
 * OGImageGenerator — Genera imágenes Open Graph dinámicas por artículo
 *
 * En producción, estas imágenes se generan en el servidor (Vercel Edge Functions, Cloudflare Workers, etc.)
 * Para desarrollo, usa el placeholder con parámetros de URL
 */

export const OG_IMAGE_BASE = '/branding/social/og-image.png';
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * Genera la URL de una imagen OG dinámica
 * En producción, esto debe apuntar a un endpoint que genere imágenes
 * Ejemplo: /api/og?title=Artículo&category=Hígado
 */
export function generateDynamicOgImage(params) {
  const { title, category, product, author } = params;

  // En producción, usar un endpoint de generación de imágenes
  // return `/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`;

  // Para desarrollo, usar el placeholder
  return OG_IMAGE_BASE;
}

/**
 * Parámetros de imagen OG válidos para todas las páginas
 */
export const OG_IMAGE_PARAMS = {
  // Todos los OG images deben cumplir:
  // - 1200x630px mínimo
  // - Formato PNG o JPEG
  // - Menos de 5MB
  // - Alt text descriptivo
  // - Color de fondo consistente con la marca

  MIN_WIDTH: 1200,
  MIN_HEIGHT: 630,
  MAX_SIZE_MB: 5,
  RECOMMENDED_FORMAT: 'PNG',
  RECOMMENDED_COLORS: {
    primary: '#10b981', // emerald-500
    secondary: '#059669', // emerald-600
    background: '#f7faf4', // light green
    text: '#111827', // gray-900
  },
};

/**
 * Template de imagen OG para cada tipo de página
 */
export const OG_TEMPLATES = {
  home: {
    title: 'Bienestar en Claro',
    subtitle: 'Nutrición de verdad y bienestar natural',
    backgroundColor: '#10b981',
    textColor: '#ffffff',
  },
  article: {
    title: 'Artículo de Bienestar',
    subtitle: 'Bienestar en Claro',
    backgroundColor: '#10b981',
    textColor: '#ffffff',
  },
  product: {
    title: 'Producto Fuxion',
    subtitle: 'Bienestar en Claro',
    backgroundColor: '#059669',
    textColor: '#ffffff',
  },
  hub: {
    title: 'Centro de Conocimiento',
    subtitle: 'Bienestar en Claro',
    backgroundColor: '#047857',
    textColor: '#ffffff',
  },
  opportunity: {
    title: 'Oportunidad de Negocio',
    subtitle: 'Bienestar en Claro',
    backgroundColor: '#065f46',
    textColor: '#ffffff',
  },
};

/**
 * Metadatos de imagen OG para cada página
 */
export function getPageOgMetadata(pageType, params = {}) {
  const template = OG_TEMPLATES[pageType] || OG_TEMPLATES.home;

  return {
    ogImage: generateDynamicOgImage({ ...params, title: template.title }),
    ogImageAlt: params.alt || `${template.title} — Bienestar en Claro`,
    ogImageWidth: OG_IMAGE_SIZE.width,
    ogImageHeight: OG_IMAGE_SIZE.height,
    ogImageType: 'image/png',
  };
}
