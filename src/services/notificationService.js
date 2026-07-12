/**
 * Servicio de notificaciones — FuXion Store
 *
 * Provee operaciones CRUD sobre la tabla `notifications` de Supabase
 * y suscripción en tiempo real para recibir notificaciones nuevas al instante.
 */

import { supabase } from '@/lib/supabaseClient';

/** Límite máximo de notificaciones a traer por consulta */
const FETCH_LIMIT = 50;

// ─────────────────────────────────────────────────────────────────────────────
// Consultas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene las notificaciones del usuario ordenadas por fecha descendente.
 * @param {string} userId — UUID del usuario autenticado.
 * @returns {Promise<Array>} Lista de notificaciones.
 */
export const fetchNotifications = async (userId) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(FETCH_LIMIT);

    if (error) {
      if (error.code === 'PGRST205' || error.code === '42P01' || error.message?.includes('notifications')) {
        console.warn(
          "[NotificationService] La tabla 'notifications' no existe en Supabase o el caché del esquema no se ha actualizado. Por favor aplica la migración: 'supabase/migrations/20260711_notifications.sql' en tu panel de Supabase."
        );
        return [];
      }
      console.error('[NotificationService] Error al obtener notificaciones:', error);
      throw error;
    }

    return data ?? [];
  } catch (err) {
    if (err.code === 'PGRST205' || err.code === '42P01' || err.message?.includes('notifications')) {
      return [];
    }
    throw err;
  }
};

/**
 * Devuelve la cantidad de notificaciones no leídas del usuario.
 * Usa `count: 'exact'` para evitar traer las filas completas.
 * @param {string} userId — UUID del usuario autenticado.
 * @returns {Promise<number>} Cantidad de no leídas.
 */
export const getUnreadCount = async (userId) => {
  if (!userId) return 0;

  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      if (error.code === 'PGRST205' || error.code === '42P01' || error.message?.includes('notifications')) {
        return 0;
      }
      console.error('[NotificationService] Error al contar no leídas:', error);
      return 0;
    }

    return count ?? 0;
  } catch (err) {
    return 0;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Mutaciones
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Marca una notificación individual como leída.
 * @param {string} notificationId — UUID de la notificación.
 * @returns {Promise<Object|null>} Notificación actualizada o null.
 */
export const markAsRead = async (notificationId) => {
  if (!notificationId) return null;

  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) {
    console.error('[NotificationService] Error al marcar como leída:', error);
    throw error;
  }

  return data;
};

/**
 * Marca TODAS las notificaciones del usuario como leídas.
 * @param {string} userId — UUID del usuario autenticado.
 * @returns {Promise<void>}
 */
export const markAllAsRead = async (userId) => {
  if (!userId) return;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('[NotificationService] Error al marcar todas como leídas:', error);
    throw error;
  }
};

/**
 * Elimina una notificación por su ID.
 * @param {string} notificationId — UUID de la notificación.
 * @returns {Promise<void>}
 */
export const deleteNotification = async (notificationId) => {
  if (!notificationId) return;

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) {
    console.error('[NotificationService] Error al eliminar notificación:', error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Suscripción en tiempo real (Realtime)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Se suscribe al canal de realtime de Supabase para recibir notificaciones
 * nuevas del usuario. Filtra por `user_id` usando el filtro de Postgres.
 *
 * @param {string} userId — UUID del usuario autenticado.
 * @param {(payload: { eventType: string, new: Object, old: Object }) => void} callback
 *        Función invocada cada vez que hay un cambio (INSERT, UPDATE, DELETE).
 * @returns {() => void} Función para desuscribirse y limpiar el canal.
 */
export const subscribeToNotifications = (userId, callback) => {
  if (!userId || !callback) {
    return () => {}; // Retorna no-op si faltan parámetros
  }

  const channelName = `notifications:${userId}`;

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',               // Escuchar INSERT, UPDATE y DELETE
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        try {
          callback(payload);
        } catch (err) {
          console.error('[NotificationService] Error en callback de realtime:', err);
        }
      },
    )
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.info('[NotificationService] Suscrito al canal de notificaciones.');
      }
      if (err) {
        console.error('[NotificationService] Error al suscribirse:', err);
      }
    });

  // Función de limpieza — desuscribe y elimina el canal
  return () => {
    supabase.removeChannel(channel);
  };
};
