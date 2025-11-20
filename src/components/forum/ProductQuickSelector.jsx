import React, { useState } from 'react';
import { ChevronDown, MessageSquare, Star, FileText, X } from 'lucide-react';
import { PRODUCT_EMOJIS, ProductEmoji } from './ProductEmojiPicker';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// COMPONENTE: ProductQuickSelector
// Desplegable con mini fotos de productos
// Al hacer click en un producto, muestra opciones de acción
// ============================================

const ProductQuickSelector = ({ onActionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = PRODUCT_EMOJIS.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleActionSelect = (action) => {
    if (selectedProduct) {
      onActionSelect({
        product: selectedProduct,
        action: action
      });
      setIsOpen(false);
      setSelectedProduct(null);
    }
  };

  const actions = [
    {
      id: 'review',
      label: 'Reseñar este producto',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'hover:bg-yellow-50'
    },
    {
      id: 'comment',
      label: 'Comentar este producto',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50'
    },
    {
      id: 'opinion',
      label: 'Opinar sobre este producto',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'hover:bg-green-50'
    }
  ];

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
      >
        <Star className="w-5 h-5" />
        <span className="font-medium">Seleccionar Producto</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Header con búsqueda */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  {selectedProduct ? 'Selecciona una acción' : 'Selecciona un producto'}
                </h3>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {!selectedProduct && (
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Contenido */}
            <div className="p-4 max-h-[500px] overflow-y-auto">
              {!selectedProduct ? (
                // Grid de productos
                <div className="grid grid-cols-6 gap-3">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-all group border border-transparent hover:border-blue-300"
                      title={product.name}
                    >
                      <div className="relative">
                        <ProductEmoji productId={product.id} size="mini" />
                        <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 rounded-full transition-opacity" />
                      </div>
                      <span className="text-xs text-gray-600 mt-2 text-center line-clamp-2 group-hover:text-blue-600 font-medium">
                        {product.name}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">
                        {product.category}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                // Producto seleccionado con acciones
                <div>
                  {/* Producto seleccionado */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-4">
                    <ProductEmoji productId={selectedProduct.id} size="mini" className="flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{selectedProduct.name}</h4>
                      <p className="text-sm text-gray-500">{selectedProduct.category}</p>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Acciones */}
                  <div className="space-y-2">
                    {actions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleActionSelect(action.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-lg border border-gray-200 ${action.bgColor} transition-all group`}
                      >
                        <div className={`${action.color} bg-white p-2 rounded-full group-hover:scale-110 transition-transform`}>
                          <action.icon size={20} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900">{action.label}</p>
                          <p className="text-sm text-gray-500">
                            {action.id === 'review' && 'Califica con estrellas y escribe una reseña'}
                            {action.id === 'comment' && 'Deja un comentario rápido sobre tu experiencia'}
                            {action.id === 'opinion' && 'Comparte tu opinión detallada'}
                          </p>
                        </div>
                        <ChevronDown className="rotate-[-90deg] text-gray-400 group-hover:text-gray-600" size={20} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t text-xs text-gray-500 text-center">
              {!selectedProduct && `${filteredProducts.length} productos disponibles`}
              {selectedProduct && 'Selecciona una acción para continuar'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductQuickSelector;
