-- =============================================================================
-- Migración: Sistema de notificaciones para FuXion Store
-- Fecha: 2026-07-11
-- Descripción: Crea la tabla de notificaciones con políticas RLS y realtime.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Crear la tabla de notificaciones
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID            NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      title       TEXT            NOT NULL,
        body        TEXT            NOT NULL,
          type        TEXT            NOT NULL DEFAULT 'info'
                                        CHECK (type IN ('info', 'success', 'warning', 'promo', 'order')),
                                          icon        TEXT,           -- Icono opcional (nombre o URL)
                                            action_url  TEXT,           -- URL de acción opcional al hacer clic
                                              is_read     BOOLEAN         NOT NULL DEFAULT FALSE,
                                                created_at  TIMESTAMPTZ     NOT NULL DEFAULT now()
                                                );

                                                -- Comentario descriptivo de la tabla
                                                COMMENT ON TABLE public.notifications IS 'Notificaciones del usuario (pedidos, promos, info, etc.)';

                                                -- ─────────────────────────────────────────────────────────────────────────────
                                                -- 2. Índice compuesto para consultas frecuentes
                                                --    Optimiza: "traer notificaciones no leídas del usuario, más recientes primero"
                                                -- ─────────────────────────────────────────────────────────────────────────────
                                                CREATE INDEX IF NOT EXISTS idx_notifications_user_read_date
                                                  ON public.notifications (user_id, is_read, created_at DESC);

                                                  -- ─────────────────────────────────────────────────────────────────────────────
                                                  -- 3. Habilitar Row Level Security (RLS)
                                                  -- ─────────────────────────────────────────────────────────────────────────────
                                                  ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

                                                  -- ─── Política SELECT: cada usuario solo ve sus propias notificaciones ────────
                                                  CREATE POLICY "Los usuarios pueden ver sus propias notificaciones"
                                                    ON public.notifications
                                                      FOR SELECT
                                                        USING (auth.uid() = user_id);

                                                        -- ─── Política UPDATE: cada usuario solo actualiza sus propias notificaciones ─
                                                        CREATE POLICY "Los usuarios pueden actualizar sus propias notificaciones"
                                                          ON public.notifications
                                                            FOR UPDATE
                                                              USING (auth.uid() = user_id)
                                                                WITH CHECK (auth.uid() = user_id);

                                                                -- ─── Política DELETE: cada usuario solo elimina sus propias notificaciones ───
                                                                CREATE POLICY "Los usuarios pueden eliminar sus propias notificaciones"
                                                                  ON public.notifications
                                                                    FOR DELETE
                                                                      USING (auth.uid() = user_id);

                                                                      -- ─── Política INSERT: abierta para service_role / admin / triggers ──────────
                                                                      -- Las inserciones se hacen desde el backend (service_role) o triggers,
                                                                      -- nunca directamente desde el cliente anónimo.
                                                                      CREATE POLICY "Inserción abierta para service_role y triggers"
                                                                        ON public.notifications
                                                                          FOR INSERT
                                                                            WITH CHECK (true);

                                                                            -- ─────────────────────────────────────────────────────────────────────────────
                                                                            -- 4. Habilitar Realtime para la tabla
                                                                            -- ─────────────────────────────────────────────────────────────────────────────
                                                                            ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
                                                                            