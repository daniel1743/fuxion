/**
 * Generador programático de páginas de productos con SEO completo
 * Cuando un producto nuevo entra al catálogo, genera automáticamente:
 * - Página de producto con todos los schemas
 * - Página de "Beneficios de [producto]"
 * - Página de "Ingredientes de [producto]"
 * - Página de "Cómo tomar [producto]"
 * - Página de "Productos similares a [producto]"
 * - Página de "[condición] - productos recomendados"
 */

import {
  buildProductSchema,
  buildProductFaqSchema,
  buildBreadcrumbSchema,
  buildProductTitle,
  buildProductMetaDescription,
  getProductSeoContent,
  getSeoProductBySlug,
  getAllSeoProducts,
  SITE_URL,
  STORE_NAME,
} from '@/lib/productSeo';

/**
 * Genera el contenido programático para una página de producto
 */
export function generateProductSeoContent(product) {
  if (!product) return null;

  const seoContent = getProductSeoContent(product);
  if (!seoContent) return null;

  return {
    // SEO básico
    seoTitle: buildProductTitle(product),
    metaDescription: buildProductMetaDescription(product),
    canonicalUrl: `${SITE_URL}/producto/${product.slug}`,

    // Contenido principal
    intro: seoContent.intro,
    searchIntent: seoContent.searchIntent,
    deepSections: seoContent.deepSections,
    semanticTerms: seoContent.semanticTerms,
    faqs: seoContent.faqs,

    // Productos relacionados
    relatedProducts: (seoContent.relatedSlugs || [])
      .map(slug => getSeoProductBySlug(slug))
      .filter(Boolean),

    // Internal links
    internalLinks: (seoContent.internalLinks || [])
      .map(link => ({
        ...getSeoProductBySlug(link.slug),
        reason: link.reason,
      }))
      .filter(Boolean),
  };
}

/**
 * Genera una página de "Beneficios de [producto]"
 */
export function generateBenefitsPage(product) {
  if (!product) return null;

  return {
    title: `Beneficios de ${product.name} — Guía completa | Bienestar en Claro`,
    description: `Descubre todos los beneficios de ${product.name}: ingredientes, mecanismo de acción, evidencia científica y cómo integrarlo en tu rutina.`,
    canonicalUrl: `${SITE_URL}/producto/${product.slug}/beneficios`,
    ogImage: product.imageUrl,
    schema: [
      buildProductSchema(product),
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `Beneficios de ${product.name}`,
        author: {
          '@type': 'Person',
          name: 'Daniel Falcón',
        },
        publisher: {
          '@type': 'Organization',
          name: STORE_NAME,
        },
      },
    ],
  };
}

/**
 * Genera una página de "Ingredientes de [producto]"
 */
export function generateIngredientsPage(product) {
  if (!product) return null;

  return {
    title: `Ingredientes de ${product.name} — Análisis detallado | Bienestar en Claro`,
    description: `Conoce los ingredientes de ${product.name}: cada componente, su función y la evidencia científica que respalda su uso.`,
    canonicalUrl: `${SITE_URL}/producto/${product.slug}/ingredientes`,
    ogImage: product.imageUrl,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `Ingredientes de ${product.name}`,
        author: {
          '@type': 'Person',
          name: 'Daniel Falcón',
        },
        publisher: {
          '@type': 'Organization',
          name: STORE_NAME,
        },
      },
    ],
  };
}

/**
 * Genera una página de "Cómo tomar [producto]"
 */
export function generateDosagePage(product) {
  if (!product) return null;

  return {
    title: `Cómo tomar ${product.name} — Dosificación y horarios | Bienestar en Claro`,
    description: `Guía completa de dosificación de ${product.name}: cuándo tomarlo, cuántas veces, con qué y qué evitar.`,
    canonicalUrl: `${SITE_URL}/producto/${product.slug}/dosificacion`,
    ogImage: product.imageUrl,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `Cómo tomar ${product.name}`,
        step: product.usage ? [{
          '@type': 'HowToStep',
          name: 'Preparación',
          text: product.usage,
        }] : [],
      },
    ],
  };
}

/**
 * Genera una página de "Productos similares a [producto]"
 */
export function generateSimilarProductsPage(product) {
  if (!product) return null;

  const seoContent = getProductSeoContent(product);
  const similar = (seoContent?.relatedSlugs || [])
    .map(slug => getSeoProductBySlug(slug))
    .filter(Boolean);

  return {
    title: `Productos similares a ${product.name} — Comparación | Bienestar en Claro`,
    description: `Compara ${product.name} con productos similares: diferencias, similitudes y cuál elegir según tu objetivo.`,
    canonicalUrl: `${SITE_URL}/producto/${product.slug}/comparar`,
    ogImage: product.imageUrl,
    similarProducts: similar,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Productos similares a ${product.name}`,
        itemListElement: similar.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/producto/${p.slug}`,
        })),
      },
    ],
  };
}

/**
 * Genera una página de "[condición] - productos recomendados"
 */
export function generateConditionProductsPage(condition, products) {
  return {
    title: `${condition} — Productos recomendados | Bienestar en Claro`,
    description: `Productos recomendados para ${condition.toLowerCase()}. Asesoría personalizada por WhatsApp.`,
    canonicalUrl: `${SITE_URL}/condicion/${condition.toLowerCase().replace(/\s+/g, '-')}`,
    products,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Productos recomendados para ${condition}`,
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/producto/${p.slug}`,
        })),
      },
    ],
  };
}

/**
 * Genera TODAS las páginas programáticas para un producto
 */
export function generateAllProductPages(product) {
  if (!product) return [];

  return [
    generateProductSeoContent(product),
    generateBenefitsPage(product),
    generateIngredientsPage(product),
    generateDosagePage(product),
    generateSimilarProductsPage(product),
  ].filter(Boolean);
}

/**
 * Genera páginas de condiciones médicas con productos
 */
export function generateConditionPages() {
  const allProducts = getAllSeoProducts();

  const conditions = [
    { name: 'Hígado graso', products: allProducts.filter(p => ['rexet', 'omega-3', 'curcumina'].includes(p.slug)) },
    { name: 'Estreñimiento', products: allProducts.filter(p => ['prunex-1', 'liquid-fiber', 'flora-liv'].includes(p.slug)) },
    { name: 'Microbiota intestinal', products: allProducts.filter(p => ['flora-liv', 'liquid-fiber', 'prunex-1'].includes(p.slug)) },
    { name: 'Control de peso', products: allProducts.filter(p => ['thermo-t3', 'nocarb-t', 'protein-active-fit'].includes(p.slug)) },
    { name: 'Estrés y ansiedad', products: allProducts.filter(p => ['no-stress', 'on'].includes(p.slug)) },
    { name: 'Inmunidad', products: allProducts.filter(p => ['vera-plus', 'gano-plus-cappuccino'].includes(p.slug)) },
    { name: 'Energía diaria', products: allProducts.filter(p => ['vita-xtra-t-plus', 'vitaenergia', 'nutraday'].includes(p.slug)) },
    { name: 'Salud articular', products: allProducts.filter(p => ['golden-flx'].includes(p.slug)) },
    { name: 'Salud femenina', products: allProducts.filter(p => ['probal', 'beauty-in'].includes(p.slug)) },
    { name: 'Salud masculina', products: allProducts.filter(p => ['passion'].includes(p.slug)) },
  ];

  return conditions.map(c => generateConditionProductsPage(c.name, c.products)).filter(Boolean);
}
