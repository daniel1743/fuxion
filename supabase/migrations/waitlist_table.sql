-- Crear tabla para la lista de espera premium
CREATE TABLE public.waitlist_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    weight_kg NUMERIC(5,2),
    height_cm NUMERIC(5,2),
    primary_goal TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.waitlist_subscriptions ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserciones anónimas (cualquiera puede suscribirse)
CREATE POLICY "Allow anonymous inserts to waitlist" 
ON public.waitlist_subscriptions
FOR INSERT 
TO public
WITH CHECK (true);

-- Política para que solo usuarios autenticados (o administradores) puedan ver los datos
CREATE POLICY "Allow authenticated users to read waitlist" 
ON public.waitlist_subscriptions
FOR SELECT 
TO authenticated
USING (true);
