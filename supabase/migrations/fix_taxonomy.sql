-- 1. Actualizar los registros existentes a la nueva taxonomía
UPDATE public.wellness_articles SET category = 'Salud Digestiva' WHERE category = 'Bienestar gástrico';
UPDATE public.wellness_articles SET category = 'Hígado Graso' WHERE category = 'Salud hepática';
UPDATE public.wellness_articles SET category = 'Control de Peso' WHERE category = 'Control de peso';
UPDATE public.wellness_articles SET category = 'Belleza y Piel' WHERE category = 'Belleza';
UPDATE public.wellness_articles SET category = 'Bienestar General' WHERE category = 'Bienestar';
UPDATE public.wellness_articles SET category = 'Estrés y Sueño' WHERE category = 'Salud emocional';
UPDATE public.wellness_articles SET category = 'Nutrición Celular' WHERE category = 'Nutrición';
UPDATE public.wellness_articles SET category = 'Metabolismo' WHERE category = 'Hábitos saludables';

-- 2. Eliminar la restricción CHECK antigua
ALTER TABLE public.wellness_articles DROP CONSTRAINT IF EXISTS wellness_articles_category_check;

-- 3. Crear la nueva restricción CHECK con las 14 categorías modernas
ALTER TABLE public.wellness_articles ADD CONSTRAINT wellness_articles_category_check CHECK (category IN (
  'Belleza y Piel',
  'Bienestar General',
  'Control de Peso',
  'Ejercicio',
  'Energía',
  'Estrés y Sueño',
  'Grasa Corporal',
  'Hígado Graso',
  'Inmunidad',
  'Metabolismo',
  'Microbioma',
  'Nutrición Celular',
  'Salud Digestiva',
  'Salud Emocional'
));
