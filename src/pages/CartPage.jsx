
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, Send, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { toast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';
import { getPlaceholderImage } from '@/lib/imageUtils';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const DEFAULT_WHATSAPP_NUMBER = '56989639088';

const resolveWhatsappBase = () => {
  const envUrl = import.meta.env.VITE_WHATSAPP_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  const envNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/[^\d]/g, '');
  if (envNumber) {
    return `https://wa.me/${envNumber}`;
  }

  return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`;
};

const buildWhatsappUrl = (encodedMessage) => {
  const base = resolveWhatsappBase();

  // Si ya tiene el formato wa.me/message/XXX, agregar el parámetro correctamente
  if (base.includes('/message/')) {
    return `${base}?text=${encodedMessage}`;
  }

  // Si es un número directo wa.me/56912345678
  if (base.includes('wa.me/')) {
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}text=${encodedMessage}`;
  }

  // Fallback: construir desde el número
  const number = base.replace(/[^\d]/g, '') || DEFAULT_WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodedMessage}`;
};

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, generateWhatsAppMessage, clearCart } = useCart();
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    commune: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendWhatsApp = () => {
    // Validaciones
    if (!customerData.name.trim()) {
      toast({
        title: "⚠️ Nombre requerido",
        description: "Por favor ingresa tu nombre",
        variant: "destructive",
      });
      return;
    }

    if (!customerData.phone.trim()) {
      toast({
        title: "⚠️ Teléfono requerido",
        description: "Por favor ingresa tu teléfono",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "⚠️ Carrito vacío",
        description: "Agrega productos antes de enviar el pedido",
        variant: "destructive",
      });
      return;
    }

    // Generar mensaje y abrir WhatsApp
    const message = generateWhatsAppMessage(customerData);
    const whatsappUrl = buildWhatsappUrl(message);

    window.open(whatsappUrl, '_blank');

    toast({
      title: "✅ Pedido enviado",
      description: "Se abrió WhatsApp con tu pedido",
    });
  };

  if (cartItems.length === 0) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={{ duration: 0.3 }}
        className="min-h-screen flex items-center justify-center bg-background pt-20 pb-12 px-4"
      >
        <Helmet>
          <title>Carrito - Fuxion Shop</title>
          <meta name="description" content="Tu carrito de compras en Fuxion Shop" />
        </Helmet>

        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-8">
            Explora nuestro catálogo y encuentra los productos que necesitas
          </p>
          <Link to="/explorar">
            <Button size="lg" className="gap-2">
              <ShoppingCart className="h-5 w-5" />
              Explorar Productos
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background pt-24 pb-12 px-4"
    >
      <Helmet>
        <title>{`Carrito (${getCartCount()}) - Fuxion Shop`}</title>
        <meta name="description" content="Revisa tu carrito y envía tu pedido por WhatsApp" />
      </Helmet>

      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Tu Carrito</h1>
          <p className="text-muted-foreground">
            {getCartCount()} {getCartCount() === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-card border border-border rounded-xl p-4 flex gap-4"
                >
                  {/* Imagen */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    <img
                      src={item.image || getPlaceholderImage('product')}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (e.target.src !== getPlaceholderImage('product')) {
                          e.target.src = getPlaceholderImage('product');
                        }
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-lg font-bold text-primary">
                          ${typeof item.price === 'number' ? item.price.toLocaleString('es-CL') : item.price}
                        </p>
                      </div>
                    </div>

                    {/* Controles */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
                    <p className="text-lg font-bold text-foreground">
                      ${((typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Formulario y resumen */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Formulario de datos del cliente */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Tus Datos</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Juan Pérez"
                      value={customerData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={customerData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={customerData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Calle 123, Depto 456"
                      value={customerData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commune">Comuna / Ciudad</Label>
                    <Input
                      id="commune"
                      name="commune"
                      placeholder="Santiago Centro"
                      value={customerData.commune}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Resumen del pedido */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Resumen</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Productos ({getCartCount()})</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-primary">${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSendWhatsApp}
                  className="w-full h-12 text-lg gap-2 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Send className="h-5 w-5" />
                  Enviar Pedido por WhatsApp
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Al enviar, se abrirá WhatsApp con tu pedido completo
                </p>
              </div>

              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vaciar Carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
