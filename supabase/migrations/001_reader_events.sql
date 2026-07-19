-- Tabla de eventos de lector (anónimos)
CREATE TABLE IF NOT EXISTS reader_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_view', 'article_open', 'article_close', 'scroll_depth',
    'time_on_paragraph', 'zoom_change', 'orientation_change',
    'image_click', 'text_copy', 'share', 'chat_open',
    'search_article', 'exit'
  )),
  payload JSONB,
  page_url TEXT,
  page_title TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index para consultas por sesión y por día
CREATE INDEX IF NOT EXISTS idx_reader_events_session ON reader_events (session_id);
CREATE INDEX IF NOT EXISTS idx_reader_events_timestamp ON reader_events (timestamp);
CREATE INDEX IF NOT EXISTS idx_reader_events_event_type ON reader_events (event_type);

-- Tabla de sesiones procesadas (resultado del análisis)
CREATE TABLE IF NOT EXISTS reader_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  reader_score INTEGER NOT NULL DEFAULT 0,
  lead_score INTEGER NOT NULL DEFAULT 0,
  ai_analysis JSONB,
  behavior_type TEXT,
  engagement_level TEXT,
  total_events INTEGER,
  total_time_reading INTEGER,
  articles_read TEXT[],
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notified BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_reader_sessions_processed_at ON reader_sessions (processed_at);
CREATE INDEX IF NOT EXISTS idx_reader_sessions_behavior ON reader_sessions (behavior_type);

-- Tabla de alertas (para historial)
CREATE TABLE IF NOT EXISTS reader_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('trend', 'problem', 'hot_lead')),
  severity TEXT NOT NULL CHECK (severity IN ('high', 'medium', 'low')),
  title TEXT,
  message TEXT,
  telegram_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reader_alerts_created_at ON reader_alerts (created_at);

-- Tabla de resumen diario
CREATE TABLE IF NOT EXISTS reader_daily_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date DATE NOT NULL UNIQUE,
  total_readers INTEGER DEFAULT 0,
  total_articles_read INTEGER DEFAULT 0,
  best_article_slug TEXT,
  best_article_count INTEGER DEFAULT 0,
  worst_retention_slug TEXT,
  worst_retention_pct INTEGER,
  chats_opened INTEGER DEFAULT 0,
  high_interest_count INTEGER DEFAULT 0,
  avg_reader_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reader_daily_summary_date ON reader_daily_summary (summary_date);
