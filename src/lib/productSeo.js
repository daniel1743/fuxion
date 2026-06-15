import fuxionDatabase from '@/data/fuxion_database.json';
import { getProductImageUrl } from '@/lib/imageUtils';

export const SITE_URL = 'https://tiendafuxion.space';
export const STORE_NAME = 'Tienda Fuxion Chile';

export const slugifyProduct = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const normalizeProductForSeo = (productKey, productData) => {
  const name = productData.nombre || productKey;
  const slug = slugifyProduct(name);
  const benefits = productData.beneficios || [];
  const description = benefits.length
    ? benefits.join('. ')
    : `${name} de Fuxion Biotech para nutricion, bienestar y habitos saludables.`;
  const image = getProductImageUrl(name);

  return {
    id: productKey,
    slug,
    name,
    category: productData.categoria,
    line: productData.linea,
    presentation: productData.presentacion,
    price: productData.precio || 0,
    flavor: productData.sabor,
    flavors: productData.sabores || [],
    ingredients: productData.ingredientes || [],
    benefits,
    usage: productData.modo_uso,
    schedule: productData.horario,
    effect: productData.efecto,
    keyword: productData.palabra_clave,
    image,
    imageUrl: image.startsWith('http') ? image : `${SITE_URL}${image}`,
    url: `${SITE_URL}/producto/${slug}`,
    description
  };
};

export const getAllSeoProducts = () =>
  Object.entries(fuxionDatabase.productos || {}).map(([key, product]) =>
    normalizeProductForSeo(key, product)
  );

export const getSeoProductBySlug = (slug) =>
  getAllSeoProducts().find((product) => product.slug === slug);

export const buildProductMetaDescription = (product) => {
  const firstBenefit = product.benefits[0] || 'nutricion y bienestar natural';
  return `${product.name} Fuxion en Chile: ${firstBenefit}. Precio $${product.price.toLocaleString('es-CL')}, presentacion ${product.presentation || 'en sobres'} y asesoria personalizada.`;
};

export const buildProductKeywords = (product) => [
  product.name,
  `${product.name} Fuxion`,
  `${product.name} precio`,
  `${product.name} Chile`,
  `comprar ${product.name}`,
  product.category,
  product.keyword,
  'Fuxion',
  'productos Fuxion',
  'nutricion natural',
  'bienestar natural',
  'productos nutraceuticos'
].filter(Boolean).join(', ');

export const buildProductSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: [product.imageUrl],
  description: buildProductMetaDescription(product),
  sku: product.slug,
  brand: {
    '@type': 'Brand',
    name: 'Fuxion'
  },
  category: product.category,
  offers: {
    '@type': 'Offer',
    url: product.url,
    priceCurrency: 'CLP',
    price: product.price,
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      name: STORE_NAME,
      url: SITE_URL
    }
  }
});

export const buildStoreSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: STORE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/img/familia.fuxion.png`,
  description: 'Tienda Fuxion en Chile con productos nutraceuticos para nutricion, bienestar, energia, digestion, control de peso y cuidado natural.',
  areaServed: {
    '@type': 'Country',
    name: 'Chile'
  },
  brand: {
    '@type': 'Brand',
    name: 'Fuxion'
  },
  sameAs: [
    SITE_URL
  ]
});
