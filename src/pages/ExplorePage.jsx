
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import ProductModal from '@/components/ProductModal';
import fuxionDatabase from '@/data/fuxion_database.json';
import { getImageUrl, getPlaceholderImage, getProductImageUrl } from '@/lib/imageUtils';

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

// Función helper para generar el nombre correcto de la imagen
// Ahora usa getProductImageUrl que tiene el mapeo completo
const getImagePath = (productKey) => {
  // Usar getProductImageUrl que maneja el mapeo y normalización
  return getProductImageUrl(productKey);
};

// Convertir productos de la base de datos al formato del componente
const convertProductFromDB = (productKey, productData) => {
  const basePrice = productData.precio || 0;
  const description = productData.beneficios?.join('. ') || productData.descripcion || '';
  const imagePath = getImagePath(productKey);
  
  // Si tiene múltiples sabores, crear productos separados
  if (productData.sabores && Array.isArray(productData.sabores) && productData.sabores.length > 1) {
    return productData.sabores.map((sabor, index) => {
      // Vainilla y Canela es un poco más cara (aprox 5% más)
      const priceMultiplier = sabor.toLowerCase().includes('vainilla') ? 1.05 : 1.0;
      const price = Math.round(basePrice * priceMultiplier);
      const saborSlug = sabor.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      return {
        id: `${productKey}-${saborSlug}`,
        name: `${productData.nombre} - ${sabor}`,
        slug: `${productKey.toLowerCase().replace(/\s+/g, '-')}-${saborSlug}`,
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
    slug: productKey.toLowerCase().replace(/\s+/g, '-'),
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
  const [searchParams] = useSearchParams();
  const categoriaParam = searchParams.get('categoria');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener todos los productos de la base de datos
  const allProducts = useMemo(() => {
    const products = [];
    Object.entries(fuxionDatabase.productos).forEach(([key, product]) => {
      const converted = convertProductFromDB(key, product);
      // Si es un array (múltiples sabores), agregar todos
      if (Array.isArray(converted)) {
        products.push(...converted);
      } else {
        products.push(converted);
      }
    });
    return products;
  }, []);

  // Filtrar productos por categoría si hay parámetro
  const filteredProducts = useMemo(() => {
    if (!categoriaParam || !categoryMapping[categoriaParam]) {
      return allProducts;
    }

    const categoriasDB = categoryMapping[categoriaParam];
    return allProducts.filter(product =>
      categoriasDB.includes(product.categoria)
    );
  }, [allProducts, categoriaParam]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
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

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 py-28"
    >
      <Helmet>
        <title>{categoriaParam ? `${getCategoryName(categoriaParam)} — ` : ''}Productos — Fuxion Shop</title>
        <meta name="description" content="Descubre la colección completa de productos Fuxion Biotech." />
      </Helmet>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tighter">
          {categoriaParam ? getCategoryName(categoriaParam) : 'Todos los Productos'}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          {categoriaParam 
            ? `Explora ${filteredProducts.length} productos de ${getCategoryName(categoriaParam).toLowerCase()}.`
            : `Sumérgete en nuestro catálogo de ${filteredProducts.length} productos Fuxion Biotech.`
          }
        </p>
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
              <div className="group relative bg-card rounded-xl overflow-hidden border border-border transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 flex flex-col h-full">
                <div className="absolute inset-0 radial-gradient-glow opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>

                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-secondary flex-shrink-0">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={product.name}
                    src={product.image || getPlaceholderImage('product')}
                    loading="lazy"
                    onError={(e) => {
                      if (e.target.src !== getPlaceholderImage('product')) {
                        e.target.src = getPlaceholderImage('product');
                      }
                    }}
                  />
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      ¡Últimas {product.stock}!
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-base font-semibold text-foreground truncate mb-2">{product.name}</h3>
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
                      className="flex-1 h-9 text-sm gap-1 cursor-pointer"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {product.stock === 0 ? 'Agotado' : 'Agregar'}
                    </Button>
                    <Button
                      onClick={() => handleViewDetails(product)}
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 cursor-pointer"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.div>
  );
};

export default ExplorePage;
