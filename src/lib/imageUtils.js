/**
 * Utilidad para obtener rutas de imágenes que funcionan en desarrollo y producción
 * En Vite, los archivos de la carpeta public/ se sirven desde la raíz
 */

/**
 * Mapeo de nombres de productos a nombres de archivos reales
 * Esto resuelve discrepancias entre nombres normalizados y archivos reales
 */
const PRODUCT_IMAGE_MAP = {
  // Sistema Base - Limpia tu Cuerpo
  'PRUNEX 1': 'prunex-1.png',
  'LIQUID FIBER': 'liquid-fiber.png',
  'FLORA LIV': 'flora-liv.png',
  'BERRY BALANCE': 'berry-balance.png',
  'ALPHA BALANCE': 'alpha-balance.png',
  'BALANCE': 'alpha-balance.png',
  'REXET': 'rexet.png',

  // Sistema Base - Nutre y Regenera
  'BIOPRO+ TECT': 'biopro+-tect.png',
  'BIOPROTEIN ACTIVE': 'bioprotein-active.png',

  // Sistema Base - Revitaliza tu Energía
  'VITA XTRA T+': 'vita-xtra-t+.png',
  'VITAENERGÍA': 'vitaenergia.png',
  'VITAENERGIA': 'vitaenergia.png',
  'NUTRADAY': 'nutraday.png',

  // Línea Inmunológica
  'VERA+': 'vera+.png',
  'GANO+ CAPPUCCINO': 'gano+-cappuccino.png',

  // Línea Control de Peso
  'THERMO T3': 'thermo-t3.png',
  'NOCARB-T': 'nocarb-t.png',
  'BIOPRO+ FIT': 'biopro+-fit.png',
  'PROTEIN ACTIVE FIT': 'protein-active-fit.png',

  // Línea Anti-Edad
  'YOUTH ELIXIR HGH': 'youth-elixir-hgh.png',
  'BEAUTY-IN': 'beauty-in.png',
  'COOL AGE': 'beauty-in.png',
  'PROBAL': 'probal.png',
  'PASSION': 'passion.png',
  'GOLDEN FLX': 'golden-flx.png',

  // Línea Vigor Mental
  'ON': 'on.png',
  'NO STRESS': 'no-stress.png',
  'OFF': 'no-stress.png',

  // Línea Sport
  'BIOPRO+ SPORT': 'biopro+-sport.png',
  'PRE SPORT': 'pre-sport.png',
  'POST SPORT': 'post-sport.png',

  // Kits
  'PACK 5/14': 'kit-514-active.png',
  'KIT 514 ACTIVE': 'kit-514-active.png',
  'KIT DETOX 5 DIAS': 'kit-detox-5-dias.png',
};

/**
 * Obtiene la URL completa de una imagen desde la carpeta public/
 * @param {string} imagePath - Ruta de la imagen (ej: '/img/productos/prunex-1.png')
 * @returns {string} - URL completa de la imagen
 */
export const getImageUrl = (imagePath) => {
  // Validar entrada
  if (!imagePath || typeof imagePath !== 'string') {
    console.warn('getImageUrl: imagePath inválido', imagePath);
    return getPlaceholderImage('product');
  }

  // Si ya es una URL completa (http/https), devolverla tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // En Vite, los archivos de public/ se sirven desde la raíz del dominio
  // No necesitamos BASE_URL a menos que esté en un subdirectorio
  const baseUrl = import.meta.env.BASE_URL || '';
  
  // Normalizar la ruta: asegurar que empiece con /
  let normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // NOTA: No codificamos el + porque es parte del nombre del archivo real
  // El navegador y el servidor deberían manejar esto correctamente
  // Si hay problemas, podemos usar encodeURIComponent solo para caracteres problemáticos
  
  // Limpiar baseUrl: eliminar barra final si existe
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Construir URL final: baseUrl + path normalizado
  // Ejemplo: '' + '/img/productos/prunex-1.png' = '/img/productos/prunex-1.png'
  const finalUrl = `${cleanBaseUrl}${normalizedPath}`;
  
  // Log en desarrollo para debugging
  if (import.meta.env.DEV) {
    console.log('getImageUrl:', { imagePath, baseUrl, finalUrl });
  }
  
  return finalUrl;
};

/**
 * Normaliza el nombre de un producto para buscar su imagen
 * Maneja caracteres especiales, tildes y variaciones de nombres
 * @param {string} productName - Nombre del producto (ej: 'PRUNEX 1', 'VITAENERGÍA')
 * @returns {string} - Nombre normalizado para buscar la imagen
 */
export const normalizeProductName = (productName) => {
  if (!productName || typeof productName !== 'string') {
    return '';
  }

  return productName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Espacios a guiones
    .replace(/á/g, 'a')              // Tildes
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9+_-]/g, '');  // Solo letras, números, +, _, -
};

/**
 * Obtiene la URL de una imagen de producto desde el nombre del producto
 * @param {string} productName - Nombre del producto (ej: 'PRUNEX 1', 'VITAENERGÍA', 'NO STRESS (OFF)')
 * @returns {string} - URL de la imagen del producto
 */
export const getProductImageUrl = (productName) => {
  if (!productName) {
    return getPlaceholderImage('product');
  }

  // Limpiar el nombre: eliminar paréntesis y su contenido, "PRO EDITION", etc.
  const cleanName = productName
    .toUpperCase()
    .replace(/\s*\([^)]*\)\s*/g, '') // Eliminar paréntesis y su contenido (ej: "(OFF)")
    .replace(/\s*PRO EDITION\s*/gi, '') // Eliminar "PRO EDITION"
    .trim();

  // Buscar en el mapeo primero con el nombre limpio
  let mappedFile = PRODUCT_IMAGE_MAP[cleanName];
  
  // Si no se encuentra, intentar con el nombre original en mayúsculas
  if (!mappedFile) {
    mappedFile = PRODUCT_IMAGE_MAP[productName.toUpperCase()];
  }

  // Si encontramos en el mapeo, usar esa imagen
  if (mappedFile) {
    const imagePath = getImageUrl(`/img/productos/${mappedFile}`);
    // Log para debugging
    if (import.meta.env.DEV) {
      console.log('getProductImageUrl - Mapeo encontrado:', { productName, cleanName, mappedFile, imagePath });
    }
    return imagePath;
  }

  // Si no está en el mapeo, normalizar el nombre limpio
  const normalized = normalizeProductName(cleanName);
  
  // Intentar .png primero, luego .jpg
  const extensions = ['.png', '.jpg'];
  for (const ext of extensions) {
    const imagePath = getImageUrl(`/img/productos/${normalized}${ext}`);
    // Log para debugging
    if (import.meta.env.DEV) {
      console.log('getProductImageUrl - Normalizado:', { productName, cleanName, normalized, ext, imagePath });
    }
    return imagePath;
  }

  // Log de advertencia si no se encuentra
  console.warn('getProductImageUrl - No se encontró imagen para:', productName, 'usando placeholder');
  
  // Si todo falla, usar placeholder local en lugar de Unsplash
  return getPlaceholderImage('product');
};

/**
 * Verifica si una imagen existe antes de usarla
 * Útil para mostrar placeholders si la imagen no existe
 */
export const checkImageExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Obtiene una URL de placeholder si la imagen no existe
 * Usa imágenes locales en lugar de Unsplash para mejor rendimiento y evitar dependencias externas
 */
export const getPlaceholderImage = (type = 'product') => {
  // Construir las rutas directamente para evitar recursión
  const baseUrl = import.meta.env.BASE_URL || '';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  const placeholders = {
    // Usar una imagen de producto local por defecto (vitaenergia que sabemos que funciona)
    product: `${cleanBaseUrl}/img/productos/vitaenergia.png`,
    woman: `${cleanBaseUrl}/img/familia.fuxion.png`,
    wellness: `${cleanBaseUrl}/img/productos/vitaenergia.png`
  };
  
  return placeholders[type] || placeholders.product;
};

