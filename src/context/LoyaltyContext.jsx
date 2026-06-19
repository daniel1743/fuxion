import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { EMPTY_LOYALTY, fetchLoyaltyAccount, recordLoyaltyOrder } from '@/services/loyaltyService';

const LoyaltyContext = createContext(null);

export const LoyaltyProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [account, setAccount] = useState(EMPTY_LOYALTY);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user?.id) {
      setAccount(EMPTY_LOYALTY);
      return;
    }
    setLoading(true);
    try {
      setAccount(await fetchLoyaltyAccount(user.id));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [user?.id]);

  const registerOrder = async ({ orderId, quantity, giftProduct }) => {
    if (!user?.id) throw new Error('Debes iniciar sesión para acumular productos.');
    const updated = await recordLoyaltyOrder({
      userId: user.id,
      orderId,
      quantity,
      giftProduct,
    });
    setAccount(updated);
    return updated;
  };

  const value = useMemo(() => ({
    account,
    loading,
    isEligible: isAuthenticated,
    refresh,
    registerOrder,
    productsNeeded: account.progress_products === 0 ? 4 : 4 - account.progress_products,
  }), [account, loading, isAuthenticated]);

  return <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>;
};

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (!context) throw new Error('useLoyalty debe usarse dentro de LoyaltyProvider');
  return context;
};
