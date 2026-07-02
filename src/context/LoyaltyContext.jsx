import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import { EMPTY_LOYALTY, fetchLoyaltyAccount, fetchLoyaltyOrders, recordLoyaltyOrder } from '@/services/loyaltyService';

const LoyaltyContext = createContext(null);

export const LoyaltyProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin, adminData } = useAdmin();
  const loyaltyUserId = user?.id || (isAdmin ? `admin:${adminData?.email || 'falcondaniel37@gmail.com'}` : '');
  const [account, setAccount] = useState(EMPTY_LOYALTY);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!loyaltyUserId) {
      setAccount(EMPTY_LOYALTY);
      setOrders([]);
      return;
    }
    setLoading(true);
    try {
      const [nextAccount, nextOrders] = await Promise.all([
        fetchLoyaltyAccount(loyaltyUserId),
        fetchLoyaltyOrders(loyaltyUserId),
      ]);
      setAccount(nextAccount);
      setOrders(nextOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [loyaltyUserId]);

  const registerOrder = async ({ orderId, quantity, giftProduct, products }) => {
    if (!loyaltyUserId) throw new Error('Debes iniciar sesión para acumular productos.');
    const updated = await recordLoyaltyOrder({
      userId: loyaltyUserId,
      orderId,
      quantity,
      giftProduct,
      products,
    });
    setAccount(updated);
    setOrders(await fetchLoyaltyOrders(loyaltyUserId));
    return updated;
  };

  const value = useMemo(() => ({
    account,
    orders,
    loading,
    isEligible: isAuthenticated || isAdmin,
    refresh,
    registerOrder,
    productsNeeded: account.progress_products === 0 ? 4 : 4 - account.progress_products,
  }), [account, orders, loading, isAuthenticated, isAdmin]);

  return <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>;
};

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (!context) throw new Error('useLoyalty debe usarse dentro de LoyaltyProvider');
  return context;
};
