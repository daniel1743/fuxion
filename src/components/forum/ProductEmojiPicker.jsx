import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

// ============================================
// CATÁLOGO DE PRODUCTOS FUXION (30 productos)
// ============================================
export const PRODUCT_EMOJIS = [
  { id: 'alpha-balance', name: 'Alpha Balance', category: 'Nutrición' },
  { id: 'beauty-in', name: 'Beauty In', category: 'Belleza' },
  { id: 'berry-balance', name: 'Berry Balance', category: 'Nutrición' },
  { id: 'biopro+-fit', name: 'BioPro+ Fit', category: 'Proteínas' },
  { id: 'biopro+-sport', name: 'BioPro+ Sport', category: 'Proteínas' },
  { id: 'biopro+-tect', name: 'BioPro+ Tect', category: 'Proteínas' },
  { id: 'bioprotein-active', name: 'BioProtein Active', category: 'Proteínas' },
  { id: 'flora-liv', name: 'Flora Liv', category: 'Digestión' },
  { id: 'gano+-cappuccino', name: 'Gano+ Cappuccino', category: 'Bebidas' },
  { id: 'golden-flx', name: 'Golden FLX', category: 'Articulaciones' },
  { id: 'kit-514-active', name: 'Kit 514 Active', category: 'Kits' },
  { id: 'kit-detox-5-dias', name: 'Kit Detox 5 Días', category: 'Detox' },
  { id: 'liquid-fiber', name: 'Liquid Fiber', category: 'Fibra' },
  { id: 'no-stress', name: 'No Stress', category: 'Bienestar' },
  { id: 'nocarb-t', name: 'NoCarb T', category: 'Control de Peso' },
  { id: 'nutraday', name: 'Nutraday', category: 'Multivitamínico' },
  { id: 'on', name: 'ON', category: 'Energía' },
  { id: 'passion', name: 'Passion', category: 'Bienestar' },
  { id: 'post-sport', name: 'Post Sport', category: 'Deportivo' },
  { id: 'pre-sport', name: 'Pre Sport', category: 'Deportivo' },
  { id: 'probal', name: 'Probal', category: 'Proteínas' },
  { id: 'protein-active-fit', name: 'Protein Active Fit', category: 'Proteínas' },
  { id: 'prunex-1', name: 'Prunex', category: 'Digestión' },
  { id: 'rexet', name: 'Rexet', category: 'Energía' },
  { id: 'thermo-t3', name: 'Thermo T3', category: 'Control de Peso' },
  { id: 'vera+', name: 'Vera+', category: 'Bienestar' },
  { id: 'vita-xtra-t+', name: 'Vita Xtra T+', category: 'Energía' },
  { id: 'vitaenergía', name: 'Vitaenergía', category: 'Energía' },
  { id: 'youth-elixir-hgh', name: 'Youth Elixir HGH', category: 'Anti-aging' }
];

// ============================================
// COMPONENTE: ProductEmoji
// Muestra un emoji de producto (versión tiny 32x32)
// ============================================
export const ProductEmoji = ({ productId, size = 'tiny', className = '' }) => {
  const product = PRODUCT_EMOJIS.find(p => p.id === productId);

  if (!product) return null;

  const sizeClass = size === 'mini' ? 'w-16 h-16' : 'w-8 h-8';
  const folder = size === 'mini' ? 'productos-mini' : 'productos-tiny';

  return (
    <img
      src={`/img/${folder}/${productId}.webp`}
      alt={product.name}
      title={product.name}
      className={`inline-block object-contain ${sizeClass} ${className}`}
      loading="lazy"
    />
  );
};

// ============================================
// COMPONENTE: ProductEmojiPicker
// Selector de emojis de productos para el foro
// ============================================
const ProductEmojiPicker = ({ onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', ...new Set(PRODUCT_EMOJIS.map(p => p.category))];

  const filteredProducts = PRODUCT_EMOJIS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectProduct = (productId) => {
    onSelect(productId);
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-gray-900">Productos Fuxion</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Búsqueda */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filtros de categoría */}
      <div className="p-3 border-b">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="p-3 max-h-80 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron productos
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product.id)}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                title={product.name}
              >
                <ProductEmoji productId={product.id} size="mini" />
                <span className="text-xs text-gray-600 mt-2 text-center line-clamp-2 group-hover:text-gray-900">
                  {product.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer con info */}
      <div className="p-3 bg-gray-50 border-t text-xs text-gray-500 text-center">
        {filteredProducts.length} productos disponibles
      </div>
    </div>
  );
};

export default ProductEmojiPicker;
