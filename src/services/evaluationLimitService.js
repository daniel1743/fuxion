/**
 * Evaluations Limit Service
 *
 * Controla cuántas evaluaciones completas puede generar un usuario por mes calendario.
 *
 * Límites actuales:
 *   - Gratis: 2 evaluaciones por mes calendario
 *
 * Arquitectura preparada para planes futuros:
 *   - Premium: 4/mes
 *   - VIP: ilimitado
 *
 * Todo se guarda en Supabase para ser persistente entre sesiones.
 */

import { supabase } from '@/lib/supabaseClient';

const FREE_EVALUATIONS_PER_MONTH = 2;

/**
 * Obtiene el mes calendario actual como string YYYY-MM.
 */
export function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Cuenta cuántas evaluaciones completas hizo el usuario este mes.
 */
export async function countEvaluationsThisMonth(userId) {
  const month = getCurrentMonth();
  const [year, monthNum] = month.split('-').map(Number);

  const startOfMonth = new Date(year, monthNum - 1, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59, 999);

  const { data, error } = await supabase
    .from('wellness_evaluations')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString())
    .lte('created_at', endOfMonth.toISOString());

  if (error) {
    console.error('Error counting evaluations:', error);
    return 0;
  }

  return data?.length || 0;
}

/**
 * Verifica si el usuario puede generar otra evaluación este mes.
 */
export async function canEvaluate(userId) {
  const count = await countEvaluationsThisMonth(userId);
  return {
    canEvaluate: count < FREE_EVALUATIONS_PER_MONTH,
    remaining: Math.max(0, FREE_EVALUATIONS_PER_MONTH - count),
    total: FREE_EVALUATIONS_PER_MONTH,
    currentMonth: getCurrentMonth(),
  };
}

/**
 * Registra que el usuario consumió una evaluación este mes.
 * Esto se hace cuando finaliza una evaluación completa exitosamente.
 */
export async function registerEvaluation(userId) {
  // La evaluación ya se registró en wellness_evaluations
  // Este registro es solo para tracking de límites
  const { error } = await supabase
    .from('wellness_evaluation_limits')
    .upsert({
      user_id: userId,
      month: getCurrentMonth(),
      evaluations_used: 1,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,month' });

  return !error;
}

/**
 * Calcula cuándo se reinicia el contador (1 del próximo mes).
 */
export function getRenewalDate() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth;
}

/**
 * Formatea el mensaje para el usuario cuando alcanzó el límite.
 */
export function getLimitReachedMessage(remaining) {
  if (remaining === 0) {
    const renewal = getRenewalDate();
    const formatted = renewal.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return {
      title: 'Evaluaciones agotadas',
      message: `Tu límite de evaluaciones se renovará el ${formatted}. Mientras tanto, seguimos trabajando con lo que ya sabemos.`,
      action: 'Ver mi informe',
    };
  }

  return {
    title: 'Evaluaciones restantes',
    message: `Te queda ${remaining} evaluación${remaining > 1 ? 'es' : ''} este mes.`,
    action: 'Comenzar evaluación',
  };
}
