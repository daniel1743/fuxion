-- Evolución de Arquitectura: Gemelo Digital Fase 2
-- Ejecuta este script en el SQL Editor de tu panel de Supabase.

-- 1. Crear tabla para el Gemelo (identidad y perfil a largo plazo)
CREATE TABLE public.wellness_twins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    twin_version VARCHAR(10) DEFAULT '2.0',
    behavior_profile JSONB DEFAULT '{}'::jsonb,
    trend_data JSONB DEFAULT '{}'::jsonb,
    prediction_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id) -- Un usuario solo puede tener un gemelo activo
);

-- 2. Crear tabla para Evaluaciones (historial inmutable de cada toma del cuestionario)
CREATE TABLE public.wellness_evaluations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    twin_id UUID REFERENCES public.wellness_twins(id) ON DELETE CASCADE,
    raw_answers JSONB NOT NULL,
    twin_state JSONB NOT NULL, -- biometría, iib, etc en ese momento
    iib_score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Crear tabla para el Plan Activo (recomendaciones en curso)
CREATE TABLE public.wellness_active_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    twin_id UUID REFERENCES public.wellness_twins(id) ON DELETE CASCADE,
    evaluation_id UUID REFERENCES public.wellness_evaluations(id) ON DELETE CASCADE,
    active_recommendations JSONB NOT NULL, -- array de los microhábitos (las reglas json)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Crear tabla para Seguimiento (Check-ins diarios)
CREATE TABLE public.wellness_tracking_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID REFERENCES public.wellness_active_plans(id) ON DELETE CASCADE,
    tracking_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_habits JSONB DEFAULT '[]'::jsonb, -- array de IDs de hábitos completados (ej. ["R_SLEEP_EXTEND"])
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(plan_id, tracking_date) -- Solo un check-in por plan por día
);

-- Añadir políticas RLS (Row Level Security) para seguridad básica
ALTER TABLE public.wellness_twins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_active_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_tracking_logs ENABLE ROW LEVEL SECURITY;

-- Políticas (Asumiendo que el usuario autenticado solo ve lo suyo)
CREATE POLICY "Users can view own twin" ON public.wellness_twins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own twin" ON public.wellness_twins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own twin" ON public.wellness_twins FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own evaluations" ON public.wellness_evaluations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.wellness_twins WHERE id = wellness_evaluations.twin_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own evaluations" ON public.wellness_evaluations FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.wellness_twins WHERE id = wellness_evaluations.twin_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view own plans" ON public.wellness_active_plans FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.wellness_twins WHERE id = wellness_active_plans.twin_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own plans" ON public.wellness_active_plans FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.wellness_twins WHERE id = wellness_active_plans.twin_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update own plans" ON public.wellness_active_plans FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.wellness_twins WHERE id = wellness_active_plans.twin_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view own tracking" ON public.wellness_tracking_logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.wellness_active_plans 
        JOIN public.wellness_twins ON public.wellness_twins.id = public.wellness_active_plans.twin_id
        WHERE public.wellness_active_plans.id = wellness_tracking_logs.plan_id AND public.wellness_twins.user_id = auth.uid()
    )
);
CREATE POLICY "Users can insert own tracking" ON public.wellness_tracking_logs FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.wellness_active_plans 
        JOIN public.wellness_twins ON public.wellness_twins.id = public.wellness_active_plans.twin_id
        WHERE public.wellness_active_plans.id = wellness_tracking_logs.plan_id AND public.wellness_twins.user_id = auth.uid()
    )
);
CREATE POLICY "Users can update own tracking" ON public.wellness_tracking_logs FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.wellness_active_plans 
        JOIN public.wellness_twins ON public.wellness_twins.id = public.wellness_active_plans.twin_id
        WHERE public.wellness_active_plans.id = wellness_tracking_logs.plan_id AND public.wellness_twins.user_id = auth.uid()
    )
);
