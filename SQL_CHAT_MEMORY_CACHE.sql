-- Tabla para cachear respuestas compartidas de preguntas frecuentes y productos
CREATE TABLE IF NOT EXISTS public.chat_memory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  normalized_question TEXT NOT NULL,
  question_text TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  provider TEXT,
  api_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_memory_normalized_question
  ON public.chat_memory(normalized_question);

CREATE OR REPLACE FUNCTION public.update_chat_memory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_chat_memory_updated_at ON public.chat_memory;
CREATE TRIGGER update_chat_memory_updated_at
  BEFORE UPDATE ON public.chat_memory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_chat_memory_updated_at();
