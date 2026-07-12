/**
 * NotificationContext — FuXion Store
 *
 * Contexto de React que gestiona el ciclo completo de notificaciones:
 *  • Carga inicial de notificaciones al autenticarse.
 *  • Suscripción en tiempo real vía Supabase Realtime.
 *  • Reproducción de sonido + toast al recibir una notificación nueva.
 *  • Limpieza automática al cerrar sesión.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import {
  playNotificationSound,
  requestSoundPermission,
} from '@/lib/notificationSound';
import {
  fetchNotifications as fetchNotificationsAPI,
  getUnreadCount as getUnreadCountAPI,
  markAsRead as markAsReadAPI,
  markAllAsRead as markAllAsReadAPI,
  deleteNotification as deleteNotificationAPI,
  subscribeToNotifications,
} from '@/services/notificationService';

// ─────────────────────────────────────────────────────────────────────────────
// Contexto y mapeo de tipos a variantes de toast
// ─────────────────────────────────────────────────────────────────────────────

const NotificationContext = createContext(null);

/**
 * Mapea el `type` de la notificación a la variante de toast correspondiente.
 * @param {string} type — Tipo de notificación.
 * @returns {string|undefined} Variante de toast.
 */
const toastVariantMap = (type) => {
  switch (type) {
    case 'warning':
      return 'destructive';
    case 'success':
    case 'order':
    case 'promo':
    case 'info':
    default:
      return undefined; // Variante por defecto del toast
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Referencia al unsubscribe de realtime para limpieza segura
  const unsubscribeRef = useRef(null);

  // Ref para controlar si el permiso de audio ya fue solicitado
  const soundPermissionRequested = useRef(false);

  // ─── Solicitar permiso de audio en primera interacción del usuario ──────
  useEffect(() => {
    if (soundPermissionRequested.current) return;

    const handleInteraction = () => {
      requestSoundPermission();
      soundPermissionRequested.current = true;

      // Remover listeners después de la primera interacción
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchend', handleInteraction);
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('touchend', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // ─── Carga inicial + suscripción realtime ──────────────────────────────
  useEffect(() => {
    // Limpiar suscripción anterior (si existe)
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // Si el usuario no está autenticado, reiniciar estado
    if (!isAuthenticated || !user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    const userId = user.id;
    let isMounted = true;

    // ── Carga inicial de notificaciones ────────────────────────────────
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [notifs, count] = await Promise.all([
          fetchNotificationsAPI(userId),
          getUnreadCountAPI(userId),
        ]);

        if (isMounted) {
          setNotifications(notifs);
          setUnreadCount(count);
        }
      } catch (err) {
        console.error('[NotificationContext] Error al cargar notificaciones:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadInitialData();

    // ── Suscripción en tiempo real ────────────────────────────────────
    const unsubscribe = subscribeToNotifications(userId, (payload) => {
      if (!isMounted) return;

      const { eventType } = payload;

      switch (eventType) {
        // ── Nueva notificación ────────────────────────────────────────
        case 'INSERT': {
          const newNotif = payload.new;

          // Agregar al inicio de la lista
          setNotifications((prev) => [newNotif, ...prev]);

          // Incrementar contador de no leídas si aplica
          if (!newNotif.is_read) {
            setUnreadCount((prev) => prev + 1);
          }

          // Reproducir sonido
          playNotificationSound();

          // Mostrar toast con título y cuerpo
          toast({
            title: newNotif.title || 'Nueva notificación',
            description: newNotif.body || '',
            variant: toastVariantMap(newNotif.type),
          });

          break;
        }

        // ── Actualización (ej. marcar como leída) ─────────────────────
        case 'UPDATE': {
          const updated = payload.new;

          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? { ...n, ...updated } : n)),
          );

          // Recalcular no leídas de forma optimista
          setNotifications((prev) => {
            const newUnread = prev.filter((n) => !n.is_read).length;
            // Usamos un setTimeout para evitar actualizar estado dentro de otro setState
            setTimeout(() => setUnreadCount(newUnread), 0);
            return prev;
          });

          break;
        }

        // ── Eliminación ───────────────────────────────────────────────
        case 'DELETE': {
          const deleted = payload.old;

          setNotifications((prev) => {
            const filtered = prev.filter((n) => n.id !== deleted.id);
            const newUnread = filtered.filter((n) => !n.is_read).length;
            setTimeout(() => setUnreadCount(newUnread), 0);
            return filtered;
          });

          break;
        }

        default:
          break;
      }
    });

    unsubscribeRef.current = unsubscribe;

    // Limpieza al desmontar o cambiar de usuario
    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isAuthenticated, user?.id]);

  // ─── Acciones expuestas ────────────────────────────────────────────────

  /**
   * Marca una notificación como leída.
   * Actualización optimista: modifica el estado local de inmediato.
   */
  const markAsRead = useCallback(async (notificationId) => {
    // Actualización optimista
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markAsReadAPI(notificationId);
    } catch (err) {
      console.error('[NotificationContext] Error al marcar como leída:', err);
      // Revertir en caso de error — recargar datos reales
      if (user?.id) {
        const notifs = await fetchNotificationsAPI(user.id);
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.is_read).length);
      }
    }
  }, [user?.id]);

  /**
   * Marca todas las notificaciones del usuario como leídas.
   */
  const markAllAsRead = useCallback(async () => {
    // Actualización optimista
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      if (user?.id) await markAllAsReadAPI(user.id);
    } catch (err) {
      console.error('[NotificationContext] Error al marcar todas como leídas:', err);
      // Revertir
      if (user?.id) {
        const notifs = await fetchNotificationsAPI(user.id);
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.is_read).length);
      }
    }
  }, [user?.id]);

  /**
   * Elimina una notificación.
   * Actualización optimista con rollback en caso de error.
   */
  const deleteNotification = useCallback(async (notificationId) => {
    // Guardar estado previo para posible rollback
    let previousNotifications;
    setNotifications((prev) => {
      previousNotifications = prev;
      const filtered = prev.filter((n) => n.id !== notificationId);
      setTimeout(() => {
        setUnreadCount(filtered.filter((n) => !n.is_read).length);
      }, 0);
      return filtered;
    });

    try {
      await deleteNotificationAPI(notificationId);
    } catch (err) {
      console.error('[NotificationContext] Error al eliminar notificación:', err);
      // Revertir al estado anterior
      if (previousNotifications) {
        setNotifications(previousNotifications);
        setUnreadCount(previousNotifications.filter((n) => !n.is_read).length);
      }
    }
  }, []);

  // ─── Valor del contexto ────────────────────────────────────────────────

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isLoading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook de acceso al contexto
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook para consumir el contexto de notificaciones.
 * Debe usarse dentro de un <NotificationProvider>.
 *
 * @returns {{
 *   notifications: Array,
 *   unreadCount: number,
 *   markAsRead: (id: string) => Promise<void>,
 *   markAllAsRead: () => Promise<void>,
 *   deleteNotification: (id: string) => Promise<void>,
 *   isLoading: boolean,
 * }}
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de un <NotificationProvider>');
  }
  return context;
};
