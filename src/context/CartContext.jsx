
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { getActiveAdvisor } from '@/lib/whatsapp';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem('fuxion-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('fuxion-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Si ya existe, incrementar cantidad
        toast({
          title: "✅ Cantidad actualizada",
          description: `${product.name} - Cantidad: ${existingItem.quantity + 1}`,
        });
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si no existe, agregar nuevo
        toast({
          title: "🛒 Producto agregado",
          description: `${product.name} se agregó al carrito`,
        });
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
      title: "🗑️ Producto eliminado",
      description: "El producto se eliminó del carrito",
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "🧹 Carrito vaciado",
      description: "Todos los productos fueron eliminados",
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const generateWhatsAppMessage = (customerData) => {
    const formatPrice = (value) => Number(value || 0).toLocaleString('es-CL');
    const advisor = getActiveAdvisor();
    let message = `🛒 *NUEVO PEDIDO - FUXION SHOP*\n\n`;
    message += `Este pedido no ha sido pagado ni cobrado automáticamente. El cliente solicita asesoría para confirmar disponibilidad, resolver dudas, coordinar pago y despacho.\n\n`;
    message += `🧭 *ASESOR ASIGNADO:*\n`;
    message += `Nombre: ${advisor.name}\n`;
    message += `Código: ${advisor.id}\n`;
    message += `Origen: ${advisor.id === 'daniel' ? 'web / SEO / directo' : 'link personalizado'}\n\n`;
    message += `👤 *DATOS DEL CLIENTE:*\n`;
    message += `Nombre: ${customerData.name}\n`;
    message += `Teléfono: ${customerData.phone}\n`;
    message += `Email: ${customerData.email}\n`;
    if (customerData.address) {
      message += `Dirección: ${customerData.address}\n`;
    }
    if (customerData.commune) {
      message += `Comuna: ${customerData.commune}\n`;
    }
    message += `\n📦 *PRODUCTOS:*\n`;

    cartItems.forEach((item, index) => {
      const price = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      message += `${index + 1}. ${item.name}\n`;
      message += `   • Cantidad: ${item.quantity}\n`;
      message += `   • Precio unitario: $${formatPrice(price)}\n`;
      message += `   • Subtotal: $${formatPrice(price * item.quantity)}\n`;
      if (item.discount) {
        message += `   • Descuento aplicado: ${item.discount}%\n`;
      }
      message += `\n`;
    });

    message += `💰 *TOTAL REFERENCIAL: $${formatPrice(getCartTotal())}*\n\n`;
    message += `_Pedido generado desde Fuxion Shop_`;

    return message;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    generateWhatsAppMessage,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
