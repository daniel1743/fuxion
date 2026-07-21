-- Migrate existing wellness_articles to modern category taxonomy
UPDATE public.wellness_articles SET category = 'Salud Digestiva' WHERE category IN ('Bienestar gástrico', 'Digestión');
UPDATE public.wellness_articles SET category = 'Hígado Graso' WHERE category IN ('Salud hepática', 'Hígado');
UPDATE public.wellness_articles SET category = 'Control de Peso' WHERE category IN ('Control de peso');
UPDATE public.wellness_articles SET category = 'Belleza y Piel' WHERE category IN ('Belleza');
UPDATE public.wellness_articles SET category = 'Bienestar' WHERE category IN ('Bienestar General', 'Bienestar');
UPDATE public.wellness_articles SET category = 'Bienestar Mental' WHERE category IN ('Salud emocional', 'Estrés y Sueño');
UPDATE public.wellness_articles SET category = 'Nutrición' WHERE category IN ('Nutrición Celular', 'Nutrición');
UPDATE public.wellness_articles SET category = 'Metabolismo' WHERE category IN ('Hábitos saludables');
UPDATE public.wellness_articles SET category = 'Microbiota' WHERE category IN ('Microbioma');
UPDATE public.wellness_articles SET category = 'Sistema Inmunitario' WHERE category IN ('Defensas', 'Sistema inmune');
UPDATE public.wellness_articles SET category = 'Salud Cardiovascular' WHERE category IN ('Corazón', 'Cardiovascular');

-- Drop old constraint
ALTER TABLE public.wellness_articles DROP CONSTRAINT IF EXISTS wellness_articles_category_check;

-- Add expanded constraint
ALTER TABLE public.wellness_articles ADD CONSTRAINT wellness_articles_category_check CHECK (category IN (
  'Salud Digestiva',
  'Microbiota',
  'Hígado Graso',
  'Salud del Hígado',
  'Sistema Inmunitario',
  'Inmunidad',
  'Diabetes',
  'Inflamación',
  'Metabolismo',
  'Nutrición',
  'Pérdida de Peso',
  'Sobrepeso',
  'Salud Cardiovascular',
  'Salud Hormonal',
  'Bienestar Mental',
  'Bienestar',
  'Motivación',
  'Hidratación',
  'Sueño y Descanso',
  'Estrés y Ansiedad'
));
