import { supabase } from '@/lib/supabaseClient';

export const GIFT_PRODUCTS = [
  { id: 'PASSION', name: 'Passion', image: '/img/productos/passion.png' },
  { id: 'LIQUID FIBER', name: 'Liquid Fiber', image: '/img/productos/liquid-fiber.png' },
  { id: 'GOLDEN FLX', name: 'Golden FLX', image: '/img/productos/golden-flx.png' },
  { id: 'NOCARB-T', name: 'NoCarb-T', image: '/img/productos/nocarb-t.png' },
];

export const EMPTY_LOYALTY = {
  total_products: 0,
  progress_products: 0,
  available_rewards: 0,
  redeemed_rewards: 0,
};

const localKey = (userId) => `fuxion-loyalty-${userId}`;

const readLocal = (userId) => {
  try {
    return {
      ...EMPTY_LOYALTY,
      ...JSON.parse(window.localStorage.getItem(localKey(userId)) || '{}'),
    };
  } catch {
    return EMPTY_LOYALTY;
  }
};

const saveLocal = (userId, value) => {
  window.localStorage.setItem(localKey(userId), JSON.stringify(value));
  return value;
};

export const fetchLoyaltyAccount = async (userId) => {
  const { data, error } = await supabase
    .from('loyalty_accounts')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!error) return data || readLocal(userId);
  if (error.code === 'PGRST205' || error.code === '42P01') return readLocal(userId);
  throw error;
};

export const recordLoyaltyOrder = async ({ userId, orderId, quantity, giftProduct }) => {
  const { data, error } = await supabase.rpc('record_loyalty_order', {
    input_order_id: orderId,
    input_product_quantity: quantity,
    input_gift_product: giftProduct || null,
  });

  if (!error) {
    const account = Array.isArray(data) ? data[0] : data;
    return saveLocal(userId, account || EMPTY_LOYALTY);
  }

  if (!['PGRST202', 'PGRST205', '42883', '42P01'].includes(error.code)) throw error;

  const current = readLocal(userId);
  const earned = Math.floor((current.progress_products + quantity) / 4);
  const available = current.available_rewards + earned;
  const next = {
    ...current,
    total_products: current.total_products + quantity,
    progress_products: (current.progress_products + quantity) % 4,
    available_rewards: available - (giftProduct && available > 0 ? 1 : 0),
    redeemed_rewards: current.redeemed_rewards + (giftProduct && available > 0 ? 1 : 0),
  };
  return saveLocal(userId, next);
};
