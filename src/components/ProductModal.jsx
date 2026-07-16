import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, ShoppingCart01Icon, PackageIcon, Shield01Icon, EnergyIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { getPlaceholderImage } from '@/lib/imageUtils';
import { confirmAndOpenWhatsapp } from '@/lib/whatsapp';
import { AiRobotIcon, WhatsAppIcon } from '@/components/icons/BrandIcons';

const ProductModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  if (!product) return null;

  const handleAskAi = () => {
    window.dispatchEvent(new CustomEvent('fuxion:open-product-ai', {
      detail: { product }
    }));
    onClose();
  };

  const handleProductWhatsapp = () => {
    confirmAndOpenWhatsapp(`Hola, quiero hablar con un asesor sobre ${product.name}.`);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const modalVariants = {
    hidden: { opacity: 0, y: isMobile ? '100%' : 20, scale: isMobile ? 1 : 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: isMobile ? '100%' : 20, scale: isMobile ? 1 : 0.95 }
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-backdrop"
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-modal flex flex-col justify-end md:justify-center p-0 md:p-4 pointer-events-none"
          >
            <div className="bg-card border-t md:border border-border rounded-t-[32px] md:rounded-2xl max-w-4xl w-full h-[90vh] md:h-auto md:max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto mx-auto flex flex-col relative pb-[env(safe-area-inset-bottom,1rem)]">
              {/* Drag Handle for mobile */}
              <div className="md:hidden w-full flex justify-center pt-3 pb-1 sticky top-0 bg-card z-sticky" onClick={onClose}>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              
              {/* Header */}
              <div className="sticky top-0 md:top-auto bg-card/95 backdrop-blur-sm border-b border-border p-4 md:p-6 flex justify-between items-center z-content">
                <h2 className="text-xl md:text-2xl font-bold text-foreground truncate max-w-[80%]">{product.name}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={24} />
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
                                {index === 0 && <HugeiconsIcon icon={PackageIcon} className="h-5 w-5 text-primary" />}
                                {index === 1 && <HugeiconsIcon icon={Shield01Icon} className="h-5 w-5 text-primary" />}
                                {index === 2 && <HugeiconsIcon icon={EnergyIcon} className="h-5 w-5 text-primary" />}
                              </div>
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <HugeiconsIcon icon={PackageIcon} className="h-5 w-5 text-primary" />
                              </div>
                              <span className="text-muted-foreground">100% Natural y Orgánico</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <HugeiconsIcon icon={Shield01Icon} className="h-5 w-5 text-primary" />
                              </div>
                              <span className="text-muted-foreground">Certificado por Fuxion Biotech</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <HugeiconsIcon icon={EnergyIcon} className="h-5 w-5 text-primary" />
                              </div>
                              <span className="text-muted-foreground">Resultados visibles en semanas</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="pt-4 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                        <Button 
                          className="flex-1 rounded-full text-sm md:text-base h-12 md:h-14 font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                          onClick={() => {
                            addToCart(product, 1);
                            onClose();
                          }}
                          disabled={product.stock === 0}
                        >
                          <HugeiconsIcon icon={ShoppingCart01Icon} size={20} />
                          {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAskAi}
                          className="h-12 gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                        >
                          <AiRobotIcon className="h-4 w-4" />
                          IA
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleProductWhatsapp}
                          className="h-12 gap-2 border-green-200 text-green-700 hover:bg-green-600 hover:text-white"
                          title="Hablar con asesor"
                        >
                          <WhatsAppIcon className="h-4 w-4" />
                          Asesor
                        </Button>
                      </div>
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
