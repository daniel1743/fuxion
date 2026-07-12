-- ============================================================
-- SOLUCIÓN: Agregar columna 'products' a loyalty_orders
-- ============================================================
-- Ejecutar este script en el SQL Editor de Supabase
-- (https://supabase.com/dashboard/project/_/sql/new)
-- ============================================================

-- Agregar la columna products si no existe
ALTER TABLE public.loyalty_orders
ADD COLUMN IF NOT EXISTS products JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Verificar que la columna se haya agregado correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'loyalty_orders' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
