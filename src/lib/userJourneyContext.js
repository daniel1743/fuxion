/**
 * userJourneyContext.js
 * 
 * Rastrea el contexto de navegación del usuario durante la sesión actual.
 * Almacenamiento: sessionStorage (no persiste entre sesiones, no guarda datos personales).
 * 
 * Eventos:
 *   PRODUCT_VIEW     → Usuario ve un producto
 *   CATEGORY_INTEREST → Usuario explora una categoría
 *   BUSINESS_INTEREST → Usuario visita página de oportunidad
 *   SEARCH_QUERY     → Usuario busca productos
 * 
 * Uso:
 *   import { trackEvent, getContext, getContextualGreeting } from '@/lib/userJourneyContext';
 *   trackEvent('PRODUCT_VIEW', { product: 'Prunex', category: 'digestivo' });
 *   const ctx = getContext();
 *   const greeting = getContextualGreeting();
 */

const STORAGE_KEY = 'fuxion-journey-context';
const USER_JOURNEY_KEY = 'userJourneyContext';
const MAX_PRODUCTS = 5;
const MAX_CATEGORIES = 3;

/**
 * Obtiene el contexto actual desde sessionStorage
 */
export const getContext = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultContext();
    const parsed = JSON.parse(raw);
    // Validar estructura mínima
    if (!parsed || typeof parsed !== 'object') return getDefaultContext();
    return {
      currentPage: parsed.currentPage || null,
      products: Array.isArray(parsed.products) ? parsed.products : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      businessInterest: parsed.businessInterest || false,
      lastActivity: parsed.lastActivity || Date.now(),
      greetingShown: parsed.greetingShown || false,
      lastGreetingContext: parsed.lastGreetingContext || null,
      searchQueries: Array.isArray(parsed.searchQueries) ? parsed.searchQueries : [],
    };
  } catch {
    return getDefaultContext();
  }
};

const getDefaultContext = () => ({
  currentPage: null,
  products: [],
  categories: [],
  businessInterest: false,
  lastActivity: Date.now(),
  greetingShown: false,
  searchQueries: [],
  // -- Fase 2: Contexto editorial (campos nuevos, no afectan lógica existente) --
  pageMode: 'MODE_HOME',
  currentArticle: null,
  currentReading: {},
  currentEditorialContext: {},
});

/**
 * Guarda el contexto en sessionStorage
 */
const saveContext = (context) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...context,
      lastActivity: Date.now(),
    }));
  } catch {
    // sessionStorage lleno o no disponible — ignorar silenciosamente
  }
};

/**
 * Registra un evento de navegación del usuario.
 * 
 * @param {string} eventType - Tipo de evento: PRODUCT_VIEW | CATEGORY_INTEREST | BUSINESS_INTEREST | SEARCH_QUERY
 * @param {object} data - Datos del evento
 */
export const trackEvent = (eventType, data = {}) => {
  const context = getContext();

  switch (eventType) {
    case 'PRODUCT_VIEW': {
      const { product, category } = data;
      if (!product) return;
      // Agregar producto al inicio (más reciente primero)
      const updatedProducts = [
        { name: product, category: category || 'general', timestamp: Date.now() },
        ...context.products.filter(p => p.name !== product),
      ].slice(0, MAX_PRODUCTS);
      context.products = updatedProducts;
      context.currentPage = 'product';
      // También registrar categoría de interés
      if (category) {
        trackEvent('CATEGORY_INTEREST', { category });
      }
      break;
    }

    case 'CATEGORY_INTEREST': {
      const { category } = data;
      if (!category) return;
      const updatedCategories = [
        category,
        ...context.categories.filter(c => c !== category),
      ].slice(0, MAX_CATEGORIES);
      context.categories = updatedCategories;
      context.currentPage = 'category';
      break;
    }

    case 'BUSINESS_INTEREST': {
      context.businessInterest = true;
      context.currentPage = 'opportunity';
      break;
    }

    case 'SEARCH_QUERY': {
      const { query } = data;
      if (!query) return;
      const updatedQueries = [
        query,
        ...context.searchQueries.filter(q => q !== query),
      ].slice(0, 3);
      context.searchQueries = updatedQueries;
      context.currentPage = 'search';
      break;
    }

    // -- Fase 1: Eventos editoriales (nuevos, no afectan lógica existente) --
    case 'ARTICLE_VIEW': {
      const { title, slug, category, type, entities, taxonomy } = data;
      if (!title) return;
      context.currentArticle = {
        title,
        slug: slug || null,
        category: category || 'General',
        entities: Array.isArray(entities) ? entities : [],
        taxonomy: taxonomy || null,
        type: type || 'blog',
      };
      context.currentPage = type === 'wellness' ? 'wellness_article' : 'blog_article';
      context.pageMode = 'MODE_ARTICLE';
      context.currentReading = {
        progress: 0,
        startTime: Date.now(),
      };
      context.currentEditorialContext = {
        lastScroll: 0,
        totalTime: 0,
        internalLinks: 0,
        shared: false,
      };
      break;
    }

    // -- Fase 1 (stubs): Eventos de lectura preparados para fase futura --
    // TODO: Fase futura — requiere IntersectionObserver en el componente
    case 'ARTICLE_SCROLL_25':
    case 'ARTICLE_SCROLL_50':
    case 'ARTICLE_SCROLL_75':
    case 'ARTICLE_SCROLL_100': {
      if (context.currentReading) {
        const progMap = {
          'ARTICLE_SCROLL_25': 25,
          'ARTICLE_SCROLL_50': 50,
          'ARTICLE_SCROLL_75': 75,
          'ARTICLE_SCROLL_100': 100,
        };
        context.currentReading.progress = progMap[eventType] || 0;
      }
      break;
    }

    case 'ARTICLE_TIME_60S': {
      if (context.currentReading) {
        context.currentReading.totalTime = (context.currentReading.totalTime || 0) + 60;
        context.currentEditorialContext.totalTime = context.currentReading.totalTime;
      }
      break;
    }

    case 'ARTICLE_INTERNAL_LINK': {
      if (context.currentEditorialContext) {
        context.currentEditorialContext.internalLinks = (context.currentEditorialContext.internalLinks || 0) + 1;
      }
      break;
    }

    case 'ARTICLE_SHARE': {
      if (context.currentEditorialContext) {
        context.currentEditorialContext.shared = true;
      }
      break;
    }

    case 'PAGE_VIEW': {
      context.currentPage = data.page || null;
      break;
    }

    default:
      break;
  }

  saveContext(context);
  return context;
};

/**
 * Marca el saludo contextual como mostrado.
 * Guarda el contexto actual (page + slug) para detectar cambios de producto.
 * Si el usuario cambia a un producto diferente, se permitirá un nuevo saludo.
 * 
 * @param {object} greetingContext - { page, slug } del contexto actual
 */
export const markGreetingShown = (greetingContext = null) => {
  const context = getContext();
  context.greetingShown = true;
  if (greetingContext) {
    context.lastGreetingContext = {
      page: greetingContext.page || null,
      slug: greetingContext.slug || null,
    };
  }
  saveContext(context);
};

/**
 * Lee el contexto directo de producto desde userJourneyContext (sessionStorage)
 * Esta es la fuente más confiable porque ProductPage.jsx lo escribe al cargar.
 * 
 * @returns {object|null} { page, product, slug, category } o null
 */
export const getUserJourneyContext = () => {
  try {
    const raw = sessionStorage.getItem(USER_JOURNEY_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch (e) {
    return null;
  }
};

/**
 * Determina si el contexto actual es el mismo que el último saludo mostrado.
 * Esto evita repetir saludos cuando el usuario no ha cambiado de contexto.
 * 
 * @param {object} currentCtx - Contexto actual { page, slug }
 * @param {object} lastCtx - Último contexto guardado { page, slug }
 * @returns {boolean} true si es el mismo contexto
 */
const isSameGreetingContext = (currentCtx, lastCtx) => {
  if (!currentCtx || !lastCtx) return false;
  // Si ambos tienen slug, comparar slug (más preciso para productos)
  if (currentCtx.slug && lastCtx.slug) {
    return currentCtx.slug === lastCtx.slug;
  }
  // Si ambos tienen page, comparar page
  if (currentCtx.page && lastCtx.page) {
    return currentCtx.page === lastCtx.page;
  }
  return false;
};

/**
 * Genera un saludo contextual para Falcon Assistant basado en el journey del usuario.
 * 
 * Lógica de contexto:
 * - Si es la primera vez que se abre el chat → muestra saludo contextual
 * - Si ya se mostró un saludo para el mismo producto → NO repetir (return null)
 * - Si el usuario cambió a un producto diferente → muestra nuevo saludo con "ahora estás revisando"
 * - Si cambió de página (ej: producto → categoría) → muestra nuevo saludo
 * 
 * @returns {object|null} { text: string, slug: string|null } o null si no aplica
 */
export const getContextualGreeting = () => {
  const context = getContext();
  const journeyCtx = getUserJourneyContext();

  // Determinar el contexto actual para comparación
  const currentContext = journeyCtx && journeyCtx.page === 'product' && journeyCtx.slug
    ? { page: 'product', slug: journeyCtx.slug }
    : context.currentPage
      ? { page: context.currentPage, slug: null }
      : null;

  // Si ya hay un lastGreetingContext, verificar si el contexto cambió
  if (context.lastGreetingContext) {
    // Si es el mismo contexto → no repetir saludo
    if (currentContext && isSameGreetingContext(currentContext, context.lastGreetingContext)) {
      return null;
    }
    // Si el contexto cambió y hay un producto nuevo → saludo de cambio
    if (journeyCtx && journeyCtx.page === 'product' && journeyCtx.product) {
      const greeting = `Veo que ahora estás revisando ${journeyCtx.product} 🌱. ¿Necesitas ayuda con beneficios, ingredientes o cómo incorporarlo a tu rutina?`;
      return { text: greeting, slug: journeyCtx.slug || null };
    }
  }

  // PRIORIDAD 1: userJourneyContext (escrito por ProductPage.jsx al cargar producto)
  if (journeyCtx && journeyCtx.page === 'product' && journeyCtx.product) {
    const greeting = `Veo que estás revisando ${journeyCtx.product} 🌱. Puedo ayudarte con beneficios, ingredientes o cómo incorporarlo a tu rutina.`;
    return { text: greeting, slug: journeyCtx.slug || null };
  }

  // PRIORIDAD 2: fuxion-journey-context (legacy, escrito por trackEvent)
  if (context.currentPage === 'product' && context.products.length > 0) {
    const lastProduct = context.products[0];
    const greeting = `Veo que estás revisando ${lastProduct.name} 🌱. Puedo ayudarte con beneficios, ingredientes o cómo incorporarlo a tu rutina.`;
    return { text: greeting, slug: null };
  }

  // 3. Si está en oportunidad de negocio
  if (context.currentPage === 'opportunity' || context.businessInterest) {
    const greeting = `Veo que estás conociendo la oportunidad FuXion 🚀. Puedo explicarte cómo funciona o resolver tus dudas.`;
    return { text: greeting, slug: null };
  }

  // 4. Si está explorando una categoría
  if (context.currentPage === 'category' && context.categories.length > 0) {
    const lastCategory = context.categories[0];
    const greeting = `Veo que estás explorando productos de ${lastCategory}. ¿Quieres que te ayude a encontrar uno según tu objetivo?`;
    return { text: greeting, slug: null };
  }

  // 5. Si buscó algo
  if (context.searchQueries.length > 0) {
    const greeting = `Veo que estabas buscando "${context.searchQueries[0]}". ¿Necesitas ayuda para encontrar lo que necesitas? 🌱`;
    return { text: greeting, slug: null };
  }

  // 6. -- Fase 4: Saludo contextual para artículos (añadido, no reemplaza nada) --
  if ((context.currentPage === 'blog_article' || context.currentPage === 'wellness_article') && context.currentArticle) {
    const article = context.currentArticle;
    const greeting = `Estoy aquí para ayudarte a entender mejor este tema. Si tienes dudas sobre lo que estás leyendo o quieres profundizar, puedo ayudarte.`;
    return { text: greeting, slug: article.slug || null };
  }

  return null;
};

/**
 * Obtiene sugerencias de chips inteligentes según el contexto actual
 * 
 * @returns {Array} Lista de chips { emoji, label, text }
 */
export const getSmartSuggestions = () => {
  const context = getContext();
  const journeyCtx = getUserJourneyContext();

  // PRIORIDAD: userJourneyContext (producto actual)
  if (journeyCtx && journeyCtx.page === 'product' && journeyCtx.product) {
    return [
      { emoji: '✨', label: 'Beneficios', text: '¿Cuáles son los beneficios?' },
      { emoji: '📖', label: 'Cómo se toma', text: '¿Cómo se toma?' },
      { emoji: '🧪', label: 'Ingredientes', text: '¿Qué ingredientes tiene?' },
      { emoji: '🛒', label: 'Comprar', text: 'Quiero comprar este producto' },
    ];
  }

  // Sugerencias para página de producto (legacy)
  if (context.currentPage === 'product' && context.products.length > 0) {
    return [
      { emoji: '✨', label: 'Beneficios', text: '¿Cuáles son los beneficios?' },
      { emoji: '📖', label: 'Cómo se toma', text: '¿Cómo se toma?' },
      { emoji: '🧪', label: 'Ingredientes', text: '¿Qué ingredientes tiene?' },
      { emoji: '🛒', label: 'Comprar', text: 'Quiero comprar este producto' },
    ];
  }

  // Sugerencias para oportunidad de negocio
  if (context.currentPage === 'opportunity' || context.businessInterest) {
    return [
      { emoji: '📋', label: 'Cómo funciona', text: '¿Cómo funciona la oportunidad FuXion?' },
      { emoji: '▶️', label: 'Ver video', text: 'Quiero ver el video explicativo' },
      { emoji: '💬', label: 'Hablar con asesor', text: 'Quiero hablar con un asesor sobre la oportunidad' },
    ];
  }

  // Sugerencias para categoría
  if (context.currentPage === 'category' && context.categories.length > 0) {
    return [
      { emoji: '🔥', label: 'Recomiéndame', text: `¿Qué me recomiendas para ${context.categories[0]}?` },
      { emoji: '⭐', label: 'Más popular', text: '¿Cuál es el producto más popular?' },
      { emoji: '💬', label: 'Hablar con asesor', text: 'Quiero hablar con un asesor' },
    ];
  }

  // -- Fase 5: Chips inteligentes para artículos (añadido, no reemplaza nada) --
  if ((context.currentPage === 'blog_article' || context.currentPage === 'wellness_article') && context.currentArticle) {
    const article = context.currentArticle;
    const chips = [];

    // Chips dinámicos según taxonomía
    if (article.taxonomy) {
      chips.push({ emoji: '🔬', label: 'Más sobre esto', text: `Profundiza sobre ${article.taxonomy}` });
    }

    // Chips dinámicos según entidades detectadas
    if (article.entities && article.entities.length > 0) {
      const firstEntity = article.entities[0];
      chips.push({ emoji: '🤔', label: `¿${firstEntity}?`, text: `¿Cómo sé si tengo problemas de ${firstEntity.toLowerCase()}?` });
      if (article.entities.length > 1) {
        const secondEntity = article.entities[1];
        chips.push({ emoji: '🍃', label: `Tratamiento`, text: `¿Hay alternativas naturales para ${secondEntity.toLowerCase()}?` });
      }
    }

    // Chips base (si no hay suficientes dinámicos)
    if (chips.length < 2) {
      chips.push({ emoji: '📚', label: 'Síntomas', text: '¿Cuáles son los síntomas principales?' });
    }
    if (chips.length < 3) {
      chips.push({ emoji: '🥗', label: 'Alimentación', text: '¿Qué alimentación ayuda con esto?' });
    }
    if (chips.length < 4) {
      chips.push({ emoji: '🌿', label: 'Productos', text: '¿Hay productos naturales que ayuden?' });
    }
    if (chips.length < 5) {
      chips.push({ emoji: '💬', label: 'Hablar con asesor', text: 'Quiero hablar con un asesor sobre esto' });
    }

    return chips;
  }

  // Sugerencias por defecto (genéricas)
  return [
    { emoji: '🔥', label: 'Controlar peso', text: 'Quiero productos para controlar mi peso' },
    { emoji: '😴', label: 'Estrés y descanso', text: 'Necesito ayuda para el estrés y dormir mejor' },
    { emoji: '⚡', label: 'Más energía', text: 'Busco productos para tener más energía' },
    { emoji: '🌿', label: 'Digestión', text: 'Quiero mejorar mi digestión' },
  ];
};

/**
 * Obtiene el contexto formateado para incluirlo en el prompt de la IA
 * Incluye datos de userJourneyContext (producto actual) si está disponible
 */
export const getContextForAI = () => {
  const context = getContext();
  const parts = [];

  // PRIORIDAD: userJourneyContext tiene el producto actual más preciso
  const journeyCtx = getUserJourneyContext();
  if (journeyCtx && journeyCtx.page === 'product' && journeyCtx.product) {
    parts.push(`Página actual: producto`);
    parts.push(`Producto actual: ${journeyCtx.product}`);
    if (journeyCtx.category) {
      parts.push(`Categoría del producto: ${journeyCtx.category}`);
    }
  } else {
    if (context.currentPage) {
      parts.push(`Página actual: ${context.currentPage}`);
    }
    if (context.products.length > 0) {
      const productNames = context.products.map(p => p.name).join(', ');
      parts.push(`Productos vistos en esta sesión: ${productNames}`);
    }
  }

  if (context.categories.length > 0) {
    parts.push(`Categorías de interés: ${context.categories.join(', ')}`);
  }

  if (context.businessInterest) {
    parts.push('El usuario mostró interés en la oportunidad de negocio FuXion');
  }

  if (context.searchQueries.length > 0) {
    parts.push(`Búsquedas recientes: ${context.searchQueries.join(', ')}`);
  }

  // -- Fase 6: Enriquecer frontendContext con pageMode y artículo (añadido) --
  if (context.pageMode && context.pageMode !== 'MODE_HOME') {
    parts.push(`Modo de página: ${context.pageMode}`);
  }

  if (context.currentArticle) {
    const article = context.currentArticle;
    parts.push(`Artículo actual: "${article.title}"`);
    if (article.category) parts.push(`Categoría del artículo: ${article.category}`);
    if (article.taxonomy) parts.push(`Taxonomía: ${article.taxonomy}`);
    if (article.entities && article.entities.length > 0) {
      parts.push(`Entidades del artículo: ${article.entities.join(', ')}`);
    }
    if (context.currentReading && context.currentReading.progress > 0) {
      parts.push(`Progreso de lectura: ${context.currentReading.progress}%`);
    }
    if (context.currentReading && context.currentReading.totalTime > 0) {
      parts.push(`Tiempo de lectura: ${context.currentReading.totalTime}s`);
    }
    parts.push(`Nota: El usuario está leyendo este artículo educativo. Puede estar informándose o tener una preocupación de salud real. Pregúntale con empatía si necesita orientación.`);
  }

  return parts.length > 0 ? parts.join('. ') : '';
};

export default {
  getContext,
  trackEvent,
  markGreetingShown,
  getContextualGreeting,
  getSmartSuggestions,
  getContextForAI,
  getUserJourneyContext,
};
