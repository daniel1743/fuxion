import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingCart01Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import ProductModal from '@/components/ProductModal';
import fuxionDatabase from '@/data/fuxion_database.json';
import { buildStoreSchema, buildBreadcrumbSchema, SITE_URL, slugifyProduct } from '@/lib/productSeo';
// Importamos las funciones del archivo cerebro que creamos
import { getPlaceholderImage, getProductImageUrl } from '@/lib/imageUtils';
import { confirmAndOpenWhatsapp } from '@/lib/whatsapp';
import ProductNeedSearch from '@/components/ProductNeedSearch';
import MobileAppShell from '@/components/mobile/MobileAppShell';
import SEO from '@/components/SEO';
import { getRelatedProducts, searchProductsByNeed } from '@/lib/productSearch';
import { AiRobotIcon, WhatsAppIcon } from '@/components/icons/BrandIcons';
import { trackEvent } from '@/lib/userJourneyContext';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

// Mapeo de categorías amigables a categorías reales de la base de datos
const categoryMapping = {
  'limpieza-desintoxicacion': [
    'Limpieza del Colon',
    'Limpieza del Sistema Digestivo',
    'Regeneración Flora Intestinal',
    'Limpieza Vías Urinarias',
    'Limpieza de Sangre',
    'Limpieza Hígado y Sistema Hepatobiliar'
  ],
  'proteinas-nutricion': [
    'Proteína Premium con Colostrum',
    'Proteína 100% Vegetal',
    'Hidratación Nutricional para la Familia'
  ],
  'energia-natural': [
    'Energizante Natural',
    'Multivitamínico Energizante'
  ],
  'sistema-inmune': [
    'Inmunológica - Defensas'
  ],
  'control-peso': [
    'Control de Peso'
  ],
  'anti-edad-belleza': [
    'Anti-Edad'
  ],
  'vigor-mental': [
    'Vigor Mental'
  ],
  'deportes': [
    'Sport'
  ]
};

// Convertir productos de la base de datos al formato del componente
const convertProductFromDB = (productKey, productData) => {
  const basePrice = productData.precio || 0;
  const description = productData.beneficios?.join('. ') || productData.descripcion || '';
  
  // --- CORRECCIÓN CRÍTICA AQUÍ ---
  // Usamos el NOMBRE (ej: "Prunex 1") en lugar de la key para buscar la imagen
  // Esto asegura que coincida con el mapa de imageUtils.js
  const imagePath = getProductImageUrl(productData.nombre || productKey); 
  // -------------------------------
  
  // Si tiene múltiples sabores, crear productos separados
  if (productData.sabores && Array.isArray(productData.sabores) && productData.sabores.length > 1) {
    return productData.sabores.map((sabor, index) => {
      const price = productData.precios_sabores?.[sabor] || basePrice;
      const saborSlug = sabor.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      return {
        id: `${productKey}-${saborSlug}`,
        name: `${productData.nombre} - ${sabor}`,
        slug: `${slugifyProduct(productData.nombre || productKey)}-${saborSlug}`,
        price: price,
        stock: 50,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 200) + 50,
        description: description,
        categoria: productData.categoria,
        // Misma imagen para ambos sabores
        image: imagePath,
        sabor: sabor,
        specs: [
          { label: 'Presentación', value: productData.presentacion || 'Consultar' },
          { label: 'Modo de uso', value: productData.modo_uso || 'Consultar' },
          { label: 'Horario', value: productData.horario || 'Consultar' },
          { label: 'Sabor', value: sabor }
        ],
        beneficios: productData.beneficios || [],
        ingredientes: productData.ingredientes || []
      };
    });
  }
  
  // Producto normal sin múltiples sabores
  return {
    id: productKey,
    name: productData.nombre,
    slug: slugifyProduct(productData.nombre || productKey),
    price: basePrice,
    stock: 50,
    rating: 4.5,
    reviews: Math.floor(Math.random() * 200) + 50,
    description: description,
    categoria: productData.categoria,
    image: imagePath,
    specs: [
      { label: 'Presentación', value: productData.presentacion || 'Consultar' },
      { label: 'Modo de uso', value: productData.modo_uso || 'Consultar' },
      { label: 'Horario', value: productData.horario || 'Consultar' },
      ...(productData.sabor ? [{ label: 'Sabor', value: productData.sabor }] : [])
    ],
    beneficios: productData.beneficios || [],
    ingredientes: productData.ingredientes || []
  };
};

const ExplorePage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoriaParam = searchParams.get('categoria');
  const searchQuery = searchParams.get('search');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener todos los productos de la base de datos
  const allProducts = useMemo(() => {
    const products = [];
    // Verificamos que fuxionDatabase y fuxionDatabase.productos existan
    if (fuxionDatabase && fuxionDatabase.productos) {
        Object.entries(fuxionDatabase.productos).forEach(([key, product]) => {
        const converted = convertProductFromDB(key, product);
        // Si es un array (múltiples sabores), agregar todos
        if (Array.isArray(converted)) {
            products.push(...converted);
        } else {
            products.push(converted);
        }
        });
    }
    return products;
  }, []);

  // Filtrar productos por categoría y búsqueda
  const filteredProducts = useMemo(() => {
    let products = allProducts;

    // Filtrar por categoría
    if (categoriaParam && categoryMapping[categoriaParam]) {
      const categoriasDB = categoryMapping[categoriaParam];
      products = products.filter(product =>
        categoriasDB.includes(product.categoria)
      );
    }

    if (searchQuery) {
      products = searchProductsByNeed(products, searchQuery);
    }

    return products;
  }, [allProducts, categoriaParam, searchQuery]);

  const relatedProducts = useMemo(() => {
    if (!searchQuery || filteredProducts.length === 0) return [];
    return getRelatedProducts(allProducts, filteredProducts, searchQuery);
  }, [allProducts, filteredProducts, searchQuery]);

  const handleNeedSearch = (query) => {
    navigate(`/explorar?search=${encodeURIComponent(query)}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAskAi = (product) => {
    window.dispatchEvent(new CustomEvent('fuxion:open-product-ai', {
      detail: { product }
    }));
  };

  const handleProductWhatsapp = (product) => {
    confirmAndOpenWhatsapp(`Hola, quiero hablar con un asesor sobre ${product.name}.`);
  };

  const getCategoryName = (slug) => {
    const names = {
      'limpieza-desintoxicacion': 'Limpieza y Desintoxicación',
      'proteinas-nutricion': 'Proteínas y Nutrición',
      'energia-natural': 'Energía Natural',
      'sistema-inmune': 'Sistema Inmune',
      'control-peso': 'Control de Peso',
      'anti-edad-belleza': 'Anti-Edad y Belleza',
      'vigor-mental': 'Vigor Mental',
      'deportes': 'Deportes'
    };
    return names[slug] || 'Todos los Productos';
  };

  // Track category interest and search queries for Falcon Assistant context
  React.useEffect(() => {
    if (categoriaParam) {
      const categoryName = getCategoryName(categoriaParam);
      trackEvent('CATEGORY_INTEREST', { category: categoryName });
    }
  }, [categoriaParam]);

  React.useEffect(() => {
    if (searchQuery) {
      trackEvent('SEARCH_QUERY', { query: searchQuery });
    }
  }, [searchQuery]);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-950 md:bg-background pb-20"
    >
      <SEO
        title={categoriaParam ? `${getCategoryName(categoriaParam)} Fuxion` : 'Productos Fuxion Chile — Nutrición, Bienestar y Salud Natural'}
        description={categoriaParam
          ? `Catálogo de productos ${getCategoryName(categoriaParam).toLowerCase()} Fuxion en Chile. Encuentra precios, beneficios y asesoría personalizada.`
          : 'Catálogo completo de productos Fuxion en Chile para nutrición, bienestar natural, energía, digestión, control de peso, defensas, deporte y belleza. Envíos a todo Chile.'
        }
        canonical={categoriaParam ? `/categoria/${categoriaParam}` : '/explorar'}
        schema={[
          buildStoreSchema(),
          ...(categoriaParam
            ? [buildBreadcrumbSchema([
                { name: 'Inicio', url: '/' },
                { name: 'Categorías', url: '/categorias' },
                { name: getCategoryName(categoriaParam), url: `/categoria/${categoriaParam}` }
              ])]
            : [])
        ]}
      />

      {/* ── MOBILE SHELL ── */}
      <div className="md:hidden">
        <MobileAppShell 
          variant="compact"
          title={categoriaParam ? getCategoryName(categoriaParam) : 'Explora nuestros productos'}
          description={categoriaParam 
            ? `Explora ${filteredProducts.length} productos de ${getCategoryName(categoriaParam).toLowerCase()}.`
            : `Descubre nuestro catálogo de ${filteredProducts.length} productos.`}
          showSearch={true}
          onSearchClick={() => {
            // Focus or scroll to a search bar, or just let it navigate/open a modal
            // For now, it will use the default navigation to /explorar which is fine
          }}
        >
          {/* Categorías Pills (Scroll horizontal) */}
          <div className="flex overflow-x-auto gap-2 pb-2 mt-4 scrollbar-hide -mx-5 snap-x before:content-[''] before:w-5 before:shrink-0 before:block after:content-[''] after:w-5 after:shrink-0 after:block">
            <button
              onClick={() => navigate('/explorar')}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-colors snap-start shrink-0 ${
                !categoriaParam 
                  ? 'bg-white text-emerald-900 border-white shadow-sm' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              Todos
            </button>
            {Object.keys(categoryMapping).map(slug => (
              <button
                key={slug}
                onClick={() => navigate(`/categoria/${slug}`)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-colors snap-start shrink-0 ${
                  categoriaParam === slug 
                    ? 'bg-white text-emerald-900 border-white shadow-sm' 
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                {getCategoryName(slug)}
              </button>
            ))}
          </div>
        </MobileAppShell>
      </div>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="container mx-auto px-4 sm:px-6 pt-6 md:pt-28">
        
        {/* DESKTOP HEADER (Oculto en móvil) */}
        <div className="hidden md:block text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tighter">
            {searchQuery
              ? `Resultados para "${searchQuery}"`
              : categoriaParam
              ? getCategoryName(categoriaParam)
              : 'Todos los Productos'}
          </h1>
          {searchQuery && (
            <p className="mt-4 text-muted-foreground">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          )}
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            {categoriaParam 
              ? `Explora ${filteredProducts.length} productos de ${getCategoryName(categoriaParam).toLowerCase()}.`
              : `Sumérgete en nuestro catálogo de ${filteredProducts.length} productos Fuxion Biotech.`
            }
          </p>
          <ProductNeedSearch
            initialValue={searchQuery || ''}
            onSearch={handleNeedSearch}
            compact
            className="mt-8"
          />
        </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            No se encontraron productos en esta categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.01, 0.3) }}
            >
              <Card variant="product">
                <div className="absolute inset-0 radial-gradient-glow opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>

                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-secondary flex-shrink-0">
                  <Link to={`/producto/${product.slug}`} aria-label={`Ver ${product.name} Fuxion`}>
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={`${product.name} Fuxion`}
                      // Aquí ya usamos la ruta correcta generada por getProductImageUrl
                      src={product.image}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback final por si la imagen no existe ni en el mapa
                        if (e.target.src !== getPlaceholderImage('product')) {
                          e.target.src = getPlaceholderImage('product');
                        }
                      }}
                    />
                  </Link>
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      ¡Últimas {product.stock}!
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardContent className="p-4 flex flex-col flex-grow">
                  <Link to={`/producto/${product.slug}`} className="text-base font-semibold text-foreground hover:text-primary truncate mb-2">
                    {product.name}
                  </Link>
                  <div className="mb-3">
                    <p className="text-xl font-bold text-primary">
                      ${product.price.toLocaleString('es-CL')}
                    </p>
                  </div>

                  {/* Category badge */}
                  <div className="mb-3">
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {product.categoria}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      size="sm"
                      className="flex-1 cursor-pointer font-bold bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20 shadow-lg border-emerald-600 hover:border-emerald-500"
                      disabled={product.stock === 0}
                    >
                      <HugeiconsIcon icon={ShoppingCart01Icon} className="h-4 w-4" />
                      {product.stock === 0 ? 'Agotado' : 'Agregar'}
                    </Button>
                    <Button
                      onClick={() => handleAskAi(product)}
                      variant="outline"
                      size="icon"
                      className="cursor-pointer border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                      title={`Preguntar a la IA sobre ${product.name}`}
                      aria-label={`Preguntar a la IA sobre ${product.name}`}
                    >
                      <AiRobotIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleProductWhatsapp(product)}
                      variant="outline"
                      size="icon"
                      className="cursor-pointer border-green-200 text-green-700 hover:bg-green-600 hover:text-white"
                      title="Hablar con asesor"
                      aria-label={`Hablar con asesor por WhatsApp sobre ${product.name}`}
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleViewDetails(product)}
                      variant="outline"
                      size="icon"
                      className="cursor-pointer border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      title="Ver detalles"
                    >
                      <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-16 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 dark:border-emerald-900 dark:bg-emerald-950/20">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Recomendación complementaria
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">
              También puedes ver estos otros productos
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Según lo que escribiste, estos productos pueden complementar tu objetivo. Un asesor puede ayudarte a elegir la combinación más adecuada.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((product) => (
              <Card key={product.id} variant="trust" className="p-4 bg-card dark:bg-card hover:border-primary">
                <Link
                  to={`/producto/${product.slug}`}
                  className="block h-full"
                >
                  <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-secondary">
                    <img
                      src={product.image}
                      alt={`${product.name} Fuxion`}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = getPlaceholderImage('product');
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{product.categoria}</p>
                  <p className="mt-2 font-bold text-primary">${product.price.toLocaleString('es-CL')}</p>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      </div>
    </motion.div>
  );
};

export default ExplorePage;
