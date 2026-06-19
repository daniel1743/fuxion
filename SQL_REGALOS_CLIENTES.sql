-- Programa: por cada 4 productos registrados en pedidos, 1 regalo.
-- Ejecutar una vez en Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.loyalty_accounts (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  total_products INTEGER NOT NULL DEFAULT 0 CHECK (total_products >= 0),
  progress_products INTEGER NOT NULL DEFAULT 0 CHECK (progress_products BETWEEN 0 AND 3),
  available_rewards INTEGER NOT NULL DEFAULT 0 CHECK (available_rewards >= 0),
  redeemed_rewards INTEGER NOT NULL DEFAULT 0 CHECK (redeemed_rewards >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.loyalty_orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_quantity INTEGER NOT NULL CHECK (product_quantity > 0),
  gift_product TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "loyalty_account_own_read" ON public.loyalty_accounts;
CREATE POLICY "loyalty_account_own_read"
ON public.loyalty_accounts FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "loyalty_orders_own_read" ON public.loyalty_orders;
CREATE POLICY "loyalty_orders_own_read"
ON public.loyalty_orders FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.record_loyalty_order(
  input_order_id UUID,
  input_product_quantity INTEGER,
  input_gift_product TEXT DEFAULT NULL
)
RETURNS public.loyalty_accounts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  account public.loyalty_accounts;
  earned INTEGER;
  available_after INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión';
  END IF;

  IF input_product_quantity <= 0 THEN
    RAISE EXCEPTION 'Cantidad de productos inválida';
  END IF;

  IF input_gift_product IS NOT NULL AND input_gift_product NOT IN (
    'PASSION', 'LIQUID FIBER', 'GOLDEN FLX', 'NOCARB-T'
  ) THEN
    RAISE EXCEPTION 'Regalo no permitido';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.loyalty_orders
    WHERE id = input_order_id AND user_id = auth.uid()
  ) THEN
    SELECT * INTO account
    FROM public.loyalty_accounts
    WHERE user_id = auth.uid();
    RETURN account;
  END IF;

  INSERT INTO public.loyalty_accounts (user_id, email)
  VALUES (auth.uid(), auth.jwt() ->> 'email')
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO account
  FROM public.loyalty_accounts
  WHERE user_id = auth.uid()
  FOR UPDATE;

  earned := (account.progress_products + input_product_quantity) / 4;
  available_after := account.available_rewards + earned;

  IF input_gift_product IS NOT NULL AND available_after < 1 THEN
    RAISE EXCEPTION 'Todavía no tienes un regalo disponible';
  END IF;

  UPDATE public.loyalty_accounts
  SET
    total_products = total_products + input_product_quantity,
    progress_products = (progress_products + input_product_quantity) % 4,
    available_rewards = available_after - CASE WHEN input_gift_product IS NULL THEN 0 ELSE 1 END,
    redeemed_rewards = redeemed_rewards + CASE WHEN input_gift_product IS NULL THEN 0 ELSE 1 END,
    email = COALESCE(auth.jwt() ->> 'email', email),
    updated_at = NOW()
  WHERE user_id = auth.uid()
  RETURNING * INTO account;

  INSERT INTO public.loyalty_orders (id, user_id, product_quantity, gift_product)
  VALUES (input_order_id, auth.uid(), input_product_quantity, input_gift_product);

  RETURN account;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_loyalty_order(UUID, INTEGER, TEXT) TO authenticated;
