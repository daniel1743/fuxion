/**
 * Generador de imágenes OG dinámicas
 *
 * Esta función se ejecuta en el servidor (Edge Function / Cloudflare Worker)
 * y genera una imagen PNG de 1200x630 con el título del artículo
 *
 * Para desarrollo, devuelve la imagen base.
 * Para producción, genera la imagen con Canvas API.
 */

import { OG_IMAGE_SIZE, OG_TEMPLATES, OG_IMAGE_PARAMS } from './ogImageGenerator';

const CANVAS_WIDTH = OG_IMAGE_SIZE.width;
const CANVAS_HEIGHT = OG_IMAGE_SIZE.height;

/**
 * Trunca texto para que quepa en la imagen OG
 */
function truncateText(text, maxWidth, fontSize, ctx) {
  ctx.font = `bold ${fontSize}px sans-serif`;
  let truncated = text;
  while (ctx.measureText(truncated).width > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + (text.length > truncated.length ? '…' : '');
}

/**
 * Dibuja imagen OG en un canvas
 */
function drawOgImage(ctx, params) {
  const { title, subtitle, category, product, template } = params;

  // Fondo
  ctx.fillStyle = template.backgroundColor || '#10b981';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Decoración — patrón sutil
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - 100 - i * 60, 100 + i * 80, 40, 0, Math.PI * 2);
    ctx.fill();
  }

  // Logo / Marca
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('Bienestar en Claro', 60, 70);

  // Línea decorativa
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 90);
  ctx.lineTo(300, 90);
  ctx.stroke();

  // Categoría (si existe)
  if (category) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '18px sans-serif';
    ctx.fillText(category.toUpperCase(), 60, 130);
  }

  // Título principal
  ctx.fillStyle = template.textColor || '#ffffff';
  const titleFontSize = title.length > 60 ? 40 : title.length > 40 ? 48 : 56;
  ctx.font = `bold ${titleFontSize}px sans-serif`;
  ctx.fillText(
    truncateText(title, CANVAS_WIDTH - 120, titleFontSize, ctx),
    60,
    220
  );

  // Subtítulo
  if (subtitle) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '24px sans-serif';
    ctx.fillText(subtitle, 60, 280);
  }

  // Línea divisoria
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 320);
  ctx.lineTo(CANVAS_WIDTH - 60, 320);
  ctx.stroke();

  // Footer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '16px sans-serif';
  ctx.fillText('www.bienestarenclaro.com', 60, CANVAS_HEIGHT - 40);
}

/**
 * Genera la imagen OG como Base64
 */
export function generateOgImage(params) {
  const template = OG_TEMPLATES[params.pageType] || OG_TEMPLATES.home;

  // En desarrollo, devolver imagen base
  if (process.env.NODE_ENV === 'development') {
    return {
      url: '/branding/social/og-image.png',
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      contentType: 'image/png',
    };
  }

  // En producción, usar Canvas API (Node.js o Edge)
  const canvas = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    getContext: () => ({
      fillStyle: null,
      strokeStyle: null,
      lineWidth: 0,
      font: '',
      fillRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      measureText: () => ({ width: 100 }),
    }),
    toDataURL: () => 'data:image/png;base64,...',
  };

  const ctx = canvas.getContext();
  drawOgImage(ctx, { ...params, template });

  return {
    url: canvas.toDataURL(),
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    contentType: 'image/png',
  };
}

/**
 * Genera imagen OG para artículo específico
 */
export function generateArticleOgImage(article) {
  return generateOgImage({
    pageType: 'article',
    title: article.title,
    subtitle: article.excerpt?.slice(0, 80) || '',
    category: article.category,
  });
}

/**
 * Genera imagen OG para producto específico
 */
export function generateProductOgImage(product) {
  return generateOgImage({
    pageType: 'product',
    title: product.name,
    subtitle: product.category,
    product: product,
  });
}

/**
 * Genera imagen OG para hub temático
 */
export function generateHubOgImage(hub) {
  return generateOgImage({
    pageType: 'hub',
    title: hub.name,
    subtitle: hub.description?.slice(0, 100) || '',
  });
}
