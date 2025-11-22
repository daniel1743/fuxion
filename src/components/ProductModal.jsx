import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Package, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { getPlaceholderImage } from '@/lib/imageUtils';

const ProductModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-foreground">Detalles del Producto</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image */}
                  <div className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
                      <img
                        src={product.image || getPlaceholderImage('product')}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          if (e.target.src !== getPlaceholderImage('product')) {
                            e.target.src = getPlaceholderImage('product');
                          }
                        }}
                      />
                    </div>
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ¡Solo {product.stock} disponibles!
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-foreground mb-4">{product.name}</h3>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-primary">
                          ${typeof product.price === 'number' ? product.price.toLocaleString('es-CL') : product.price}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Características destacadas:</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {product.features && product.features.length > 0 ? (
                          product.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                {index === 0 && <Package className="h-5 w-5 text-primary" />}
                                {index === 1 && <Shield className="h-5 w-5 text-primary" />}
                                {index === 2 && <Zap className="h-5 w-5 text-primary" />}
                              </div>
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Package className="h-5 w-5 text-primary" />
                              </div>
                              <span className="text-muted-foreground">100% Natural y Orgánico</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-primary" />
                              </div>
                              <span className="text-muted-foreground">Certificado por Fuxion Biotech</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Zap className="h-5 w-5 text-primary" />
                              </div>
                              <span className="text-muted-foreground">Resultados visibles en semanas</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="pt-4 space-y-3">
                      <Button
                        onClick={() => {
                          addToCart(product);
                          onClose();
                        }}
                        className="w-full h-12 text-lg gap-2"
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                      </Button>
                      {product.stock > 0 && product.stock < 5 && (
                        <p className="text-sm text-orange-500 text-center font-medium">
                          ⚠️ ¡Quedan pocas unidades!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-8 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-4">Especificaciones técnicas:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    {product.specs?.map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">{spec.label}:</span>
                        <span className="text-foreground font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
