/**
 * productJourney.js
 * 
 * Smart Product Interest Memory
 * Rastrea el recorrido del usuario por productos FuXion durante la sesión actual.
 * 
 * Almacenamiento: sessionStorage (no persiste entre sesiones, no guarda datos personales).
 * 
 * Estructura:
 *   productJourney: {
 *     viewedProducts: [
 *       { slug: "prunex-1", name: "PRUNEX 1", category: "Limpieza del Colon", timestamp: 1234567890 },
 *       { slug: "thermo-t3", name: "THERMO T3", category: "Control de Peso", timestamp: 1234567891 }
 *     ],
 *     mainInterest: "digestivo"  // categoría inferida de la mayoría de productos vistos
 *   }
 * 
 * Reglas:
 *   - Máximo 5 productos guardados (los más recientes)
 *   - Sin duplicados (si ya existe, se mueve al inicio)
 *   - mainInterest se infiere de la categoría más frecuente
 */

const PRODUCT_JOURNEY_KEY = 'productJourney';
const MAX_PRODUCTS = 5;

/**
 * Mapa de categorías a intereses principales (para inferir mainInterest)
 */
const CATEGORY_INTEREST_MAP = {
  'Limpieza del Colon': 'digestivo',
  'Limpieza del Sistema Digestivo': 'digestivo',
  'Regeneración Flora Intestinal': 'digestivo',
  'Salud del Tracto Urinario': 'urinario',
  'Limpieza de Sangre': 'desintoxicacion',
  'Limpieza Hígado y Sistema Hepatobiliar': 'desintoxicacion',
  'Energizante Natural': 'energia',
  'Multivitamínico Energizante': 'energia',
  'Hidratación Nutricional para la Familia': 'hidratacion',
  'Inmunológica - Defensas': 'defensas',
  'Control de Peso': 'control_peso',
  'Anti-Edad': 'anti_edad',
  'Vigor Mental': 'mental',
  'Sport': 'sport',
  'Proteína 100% Vegetal': 'nutricion',
};

/**
 * Obtiene el journey de productos desde sessionStorage
 * @returns {object} { viewedProducts: [], mainInterest: null }
 */
export const getProductJourney = () => {
  try {
    const raw = sessionStorage.getItem(PRODUCT_JOURNEY_KEY);
    if (!raw) return getDefaultJourney();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return getDefaultJourney();
    return {
      viewedProducts: Array.isArray(parsed.viewedProducts) ? parsed.viewedProducts : [],
      mainInterest: parsed.mainInterest || null,
    };
  } catch {
    return getDefaultJourney();
  }
};

const getDefaultJourney = () => ({
  viewedProducts: [],
  mainInterest: null,
});

/**
 * Guarda el journey en sessionStorage
 */
const saveProductJourney = (journey) => {
  try {
    sessionStorage.setItem(PRODUCT_JOURNEY_KEY, JSON.stringify(journey));
  } catch {
    // sessionStorage lleno o no disponible — ignorar silenciosamente
  }
};

/**
 * Infiere el interés principal basado en la categoría más frecuente
 * @param {Array} products - Lista de productos vistos
 * @returns {string|null} Interés principal inferido o null
 */
const inferMainInterest = (products) => {
  if (!products || products.length === 0) return null;

  // Contar frecuencias de categorías
  const categoryCount = {};
  products.forEach(p => {
    if (p.category) {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    }
  });

  // Encontrar la categoría más frecuente
  let maxCount = 0;
  let topCategory = null;
  for (const [category, count] of Object.entries(categoryCount)) {
    if (count > maxCount) {
      maxCount = count;
      topCategory = category;
    }
  }

  if (!topCategory) return null;

  // Mapear a interés principal
  return CATEGORY_INTEREST_MAP[topCategory] || topCategory?.toLowerCase() || null;
};

/**
 * Registra la vista de un producto en el journey
 * 
 * @param {object} productData - { slug, name, category }
 */
export const trackProductView = (productData) => {
  if (!productData || !productData.slug || !productData.name) return;

  const journey = getProductJourney();

  // Remover duplicado si existe (para moverlo al inicio)
  const filteredProducts = journey.viewedProducts.filter(
    p => p.slug !== productData.slug
  );

  // Agregar al inicio (más reciente)
  const updatedProducts = [
    {
      slug: productData.slug,
      name: productData.name,
      category: productData.category || 'general',
      timestamp: Date.now(),
    },
    ...filteredProducts,
  ].slice(0, MAX_PRODUCTS);

  journey.viewedProducts = updatedProducts;
  journey.mainInterest = inferMainInterest(updatedProducts);

  saveProductJourney(journey);
  return journey;
};

/**
 * Obtiene el contexto formateado para el saludo contextual de Falcon Assistant
 * @returns {string|null} Mensaje de saludo contextual o null
 */
export const getJourneyGreeting = () => {
  const journey = getProductJourney();
  const { viewedProducts, mainInterest } = journey;

  if (!viewedProducts || viewedProducts.length === 0) return null;

  // Caso 1: Solo 1 producto visto
  if (viewedProducts.length === 1) {
    const product = viewedProducts[0];
    return `Veo que estás revisando ${product.name} 🌱`;
  }

  // Caso 2: Múltiples productos - detectar si están relacionados
  const categories = [...new Set(viewedProducts.map(p => p.category).filter(Boolean))];

  // Si todos los productos son de categorías relacionadas a un mismo interés
  if (mainInterest) {
    const interestLabels = {
      'digestivo': 'bienestar digestivo',
      'urinario': 'salud urinaria',
      'desintoxicacion': 'desintoxicación',
      'energia': 'energía y vitalidad',
      'defensas': 'defensas e inmunidad',
      'control_peso': 'control de peso',
      'anti_edad': 'anti-edad y vitalidad',
      'mental': 'concentración y enfoque mental',
      'sport': 'rendimiento deportivo',
      'nutricion': 'nutrición',
      'hidratacion': 'hidratación',
    };
    const label = interestLabels[mainInterest] || mainInterest;
    return `Veo que has estado mirando opciones enfocadas en ${label} 🌱`;
  }

  // Caso 3: Productos de categorías diferentes (comparación)
  if (categories.length > 1) {
    return `Veo que estás comparando algunos productos FuXion. Puedo ayudarte a elegir según tu objetivo.`;
  }

  // Fallback: varios productos de misma categoría
  if (categories.length === 1) {
    return `Veo que has estado mirando opciones de ${categories[0].toLowerCase()} 🌱`;
  }

  return null;
};

/**
 * Obtiene el contexto formateado para incluirlo en el prompt de la IA
 * @returns {string} Contexto formateado para la IA
 */
export const getJourneyContextForAI = () => {
  const journey = getProductJourney();
  const { viewedProducts, mainInterest } = journey;

  if (!viewedProducts || viewedProducts.length === 0) return '';

  const parts = [];

  // Lista de productos vistos
  const productNames = viewedProducts.map(p => p.name);
  parts.push(`Productos vistos:`);
  productNames.forEach(name => parts.push(`- ${name}`));

  // Interés principal inferido
  if (mainInterest) {
    const interestLabels = {
      'digestivo': 'digestivo',
      'urinario': 'urinario',
      'desintoxicacion': 'desintoxicación',
      'energia': 'energía',
      'defensas': 'defensas',
      'control_peso': 'control de peso',
      'anti_edad': 'anti-edad',
      'mental': 'mental',
      'sport': 'deportivo',
      'nutricion': 'nutrición',
      'hidratacion': 'hidratación',
    };
    parts.push('');
    parts.push(`Posible interés:`);
    parts.push(interestLabels[mainInterest] || mainInterest);
  }

  return parts.join('\n');
};

/**
 * Obtiene los nombres de productos vistos (para enviar al backend)
 * @returns {Array} Lista de nombres de productos
 */
export const getViewedProductNames = () => {
  const journey = getProductJourney();
  return journey.viewedProducts.map(p => p.name);
};

/**
 * Obtiene el interés principal inferido
 * @returns {string|null}
 */
export const getMainInterest = () => {
  const journey = getProductJourney();
  return journey.mainInterest;
};

/**
 * Limpia el journey de productos (para testing o reset)
 */
export const clearProductJourney = () => {
  try {
    sessionStorage.removeItem(PRODUCT_JOURNEY_KEY);
  } catch {
    // ignorar
  }
};

export default {
  getProductJourney,
  trackProductView,
  getJourneyGreeting,
  getJourneyContextForAI,
  getViewedProductNames,
  getMainInterest,
  clearProductJourney,
};
