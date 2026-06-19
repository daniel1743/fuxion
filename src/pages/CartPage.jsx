
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, Send, ShoppingBag, ShieldCheck, Gift, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { toast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';
import { getPlaceholderImage } from '@/lib/imageUtils';
import { buildWhatsappUrl, confirmAndOpenWhatsapp, getActiveAdvisor } from '@/lib/whatsapp';
import { recordAdvisorEvent } from '@/services/advisorService';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import { useAuth } from '@/context/AuthContext';
import { useLoyalty } from '@/context/LoyaltyContext';
import { GIFT_PRODUCTS } from '@/services/loyaltyService';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, generateWhatsAppMessage, clearCart } = useCart();
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const { account, registerOrder } = useLoyalty();
  const [selectedGift, setSelectedGift] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: user?.name || '',
    address: '',
    commune: '',
  });

  useEffect(() => {
    if (user?.name) {
      setCustomerData((current) => ({ ...current, name: current.name || user.name }));
    }
  }, [user?.name]);

  const projectedProgress = account.progress_products + getCartCount();
  const newlyEarnedRewards = Math.floor(projectedProgress / 4);
  const projectedAvailableRewards = account.available_rewards + newlyEarnedRewards;
  const projectedRemainder = projectedProgress % 4;
  const productsNeeded = projectedRemainder === 0 ? 4 : 4 - projectedRemainder;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductWhatsapp = (item) => {
    confirmAndOpenWhatsapp(`Hola, quiero hablar con un asesor sobre ${item.name}.`);
  };

  const handleSendWhatsApp = async () => {
    // Validaciones
    if (!customerData.name.trim()) {
      toast({
        title: "⚠️ Nombre requerido",
        description: "Por favor ingresa tu nombre",
        variant: "destructive",
      });
      return;
    }

    if (!customerData.address.trim()) {
      toast({
        title: "⚠️ Dirección requerida",
        description: "Por favor ingresa tu dirección",
        variant: "destructive",
      });
      return;
    }

    if (!customerData.commune.trim()) {
      toast({
        title: "⚠️ Comuna requerida",
        description: "Por favor ingresa tu comuna",
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

    if (isAuthenticated && projectedAvailableRewards > 0 && !selectedGift) {
      toast({
        title: "🎁 Elige tu regalo",
        description: "Ya tienes un regalo disponible. Selecciona uno antes de enviar el pedido.",
      });
      return;
    }

    setIsSending(true);

    // Generar mensaje y abrir WhatsApp
    const giftName = GIFT_PRODUCTS.find((gift) => gift.id === selectedGift)?.name || '';
    const message = generateWhatsAppMessage(customerData, giftName);
    const whatsappUrl = buildWhatsappUrl(message);
    const advisor = getActiveAdvisor();
    recordAdvisorEvent(advisor.id, 'cart_whatsapp', {
      customerName: customerData.name,
      total: getCartTotal(),
      products: cartItems.map(item => ({ name: item.name, quantity: item.quantity }))
    });

    if (isAuthenticated) {
      try {
        await registerOrder({
          orderId: crypto.randomUUID(),
          quantity: getCartCount(),
          giftProduct: selectedGift || null,
        });
      } catch (error) {
        toast({
          title: "No se pudo registrar el progreso",
          description: error.message,
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }
    }

    window.open(whatsappUrl, '_blank');
    setIsSending(false);
    clearCart(true);

    toast({
      title: "✅ Pedido enviado",
      description: "Se abrió WhatsApp con tu pedido para coordinar con un asesor",
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

      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Tu Carrito</h1>
          <p className="text-muted-foreground">
            {getCartCount()} {getCartCount() === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
          <div className="mt-4 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-left text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
            <ShieldCheck className="h-5 w-5 flex-shrink-0 text-emerald-700 dark:text-emerald-300" />
            <p>
              Este carrito no realiza cobros automáticos. Al enviarlo serás derivado a un asesor por WhatsApp para confirmar disponibilidad, resolver dudas, coordinar pago y despacho.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
            <div className="flex gap-3">
              <Gift className="h-6 w-6 shrink-0 text-amber-700" />
              <div className="min-w-0">
                <p className="font-bold text-amber-950 dark:text-amber-100">Programa 4 productos + 1 regalo</p>
                {isAuthenticated ? (
                  <>
                    <p className="mt-1 text-sm text-amber-900 dark:text-amber-200">
                      Con este carrito quedarás con {projectedRemainder} de 4 productos.
                      {projectedAvailableRewards > 0
                        ? ` Tendrás ${projectedAvailableRewards} regalo${projectedAvailableRewards === 1 ? '' : 's'} disponible${projectedAvailableRewards === 1 ? '' : 's'}; puedes usar uno en este pedido.`
                        : ` Te faltarán ${productsNeeded} para obtener uno gratis.`}
                    </p>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-amber-200">
                      <div className="h-full rounded-full bg-amber-600" style={{ width: `${(projectedRemainder / 4) * 100}%` }} />
                    </div>
                  </>
                ) : (
                  <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      Inicia sesión para acumular tus compras aunque sean en meses distintos.
                    </p>
                    <Button type="button" size="sm" variant="outline" onClick={openAuthModal}>
                      <LockKeyhole className="mr-2 h-4 w-4" />
                      Iniciar sesión
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 justify-items-stretch">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4 w-full">
            {cartItems.map((item) => {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-card border border-border rounded-xl p-3 sm:p-4 w-full"
                >
                  {/* Layout responsive: columna en móvil, fila en desktop */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                    {/* Imagen y info básica */}
                    <div className="flex gap-3 sm:flex-1">
                      {/* Imagen */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
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
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base truncate">{item.name}</h3>
                        <p className="text-base sm:text-lg font-bold text-primary">
                          ${typeof item.price === 'number' ? item.price.toLocaleString('es-CL') : item.price}
                        </p>
                      </div>
                    </div>

                    {/* Controles y subtotal */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <span className="w-8 sm:w-12 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:bg-destructive/10 ml-1"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-green-700 hover:bg-green-600/10"
                          onClick={() => handleProductWhatsapp(item)}
                          title="Hablar con asesor"
                          aria-label={`Hablar con asesor por WhatsApp sobre ${item.name}`}
                        >
                          <WhatsAppIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-0.5 hidden sm:block">Subtotal</p>
                        <p className="text-base sm:text-lg font-bold text-foreground whitespace-nowrap">
                          ${((typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0) * item.quantity).toLocaleString('es-CL')}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Formulario y resumen */}
          <div className="lg:col-span-1 w-full max-w-full">
            <div className="sticky top-24 space-y-6 w-full">
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
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Calle 123, Depto 456"
                      value={customerData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commune">Comuna *</Label>
                    <Input
                      id="commune"
                      name="commune"
                      placeholder="Providencia"
                      value={customerData.commune}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {isAuthenticated && projectedAvailableRewards > 0 && (
                <div className="rounded-xl border border-amber-300 bg-card p-5">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <Gift className="h-5 w-5 text-amber-600" />
                    Elige tu regalo
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Selecciona uno para incluirlo en este pedido.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {GIFT_PRODUCTS.map((gift) => (
                      <button
                        type="button"
                        key={gift.id}
                        onClick={() => setSelectedGift(gift.id)}
                        className={`rounded-xl border p-3 text-center transition ${
                          selectedGift === gift.id
                            ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300 dark:bg-amber-950/30'
                            : 'border-border hover:border-amber-300'
                        }`}
                      >
                        <img src={gift.image} alt={gift.name} className="mx-auto h-20 w-20 object-contain" />
                        <span className="mt-2 block text-sm font-semibold">{gift.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Resumen del pedido */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Resumen</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Productos ({getCartCount()})</span>
                    <span>${getCartTotal().toLocaleString('es-CL')}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-primary">${getCartTotal().toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSendWhatsApp}
                  disabled={isSending}
                  className="w-full h-12 text-lg gap-2 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Send className="h-5 w-5" />
                  {isSending ? 'Registrando pedido...' : 'Enviar pedido a un asesor'}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">O revisa la tienda oficial</span>
                  </div>
                </div>

                <Button
                  onClick={() => window.open('https://ifuxion.com/daniel/enrollment/chooseperson', '_blank')}
                  variant="outline"
                  className="w-full h-12 text-lg gap-2"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Ir a Tienda Oficial Fuxion
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  No se cobrará nada en esta página. WhatsApp se abrirá con tu pedido para que un asesor confirme los detalles contigo.
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
