import { supabase } from '../supabaseClient';

export const digitalTwinService = {
  
  // 1. Obtener o crear el perfil principal del gemelo
  async getOrCreateTwin(userId, behaviorProfile = {}) {
    try {
      // Intentar obtener
      let { data: twin, error } = await supabase
        .from('wellness_twins')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      // Si no existe, crearlo
      if (!twin) {
        const { data: newTwin, error: createError } = await supabase
          .from('wellness_twins')
          .insert([{ user_id: userId, behavior_profile: behaviorProfile }])
          .select()
          .single();
          
        if (createError) throw createError;
        twin = newTwin;
      }
      
      return twin;
    } catch (error) {
      console.error('Error en getOrCreateTwin:', error);
      throw error;
    }
  },

  // 2. Guardar una nueva evaluación (historial)
  async saveEvaluation(twinId, rawAnswers, twinState) {
    try {
      const { data, error } = await supabase
        .from('wellness_evaluations')
        .insert([{
          twin_id: twinId,
          raw_answers: rawAnswers,
          twin_state: twinState,
          iib_score: twinState.iib?.score || twinState.twin_state?.iib?.score || 0
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en saveEvaluation:', error);
      throw error;
    }
  },

  // 3. Activar un nuevo plan (desactiva el anterior automáticamente)
  async activatePlan(twinId, evaluationId, recommendations) {
    try {
      // Desactivar planes anteriores
      await supabase
        .from('wellness_active_plans')
        .update({ is_active: false })
        .eq('twin_id', twinId)
        .eq('is_active', true);
        
      // Insertar nuevo
      const { data, error } = await supabase
        .from('wellness_active_plans')
        .insert([{
          twin_id: twinId,
          evaluation_id: evaluationId,
          active_recommendations: recommendations,
          is_active: true
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en activatePlan:', error);
      throw error;
    }
  },

  // 4. Obtener el plan activo actual
  async getActivePlan(twinId) {
    try {
      const { data, error } = await supabase
        .from('wellness_active_plans')
        .select(`
          *,
          wellness_evaluations (
            twin_state,
            iib_score,
            created_at
          )
        `)
        .eq('twin_id', twinId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error en getActivePlan:', error);
      throw error;
    }
  },

  // 5. Guardar Check-in Diario
  async saveDailyTracking(planId, completedHabits, notes = "") {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('wellness_tracking_logs')
        .upsert({
          plan_id: planId,
          tracking_date: today,
          completed_habits: completedHabits,
          notes: notes
        }, { onConflict: 'plan_id, tracking_date' })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en saveDailyTracking:', error);
      throw error;
    }
  },
  
  // 6. Obtener Check-in Diario (para mostrar checkboxes marcados)
  async getTodayTracking(planId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('wellness_tracking_logs')
        .select('*')
        .eq('plan_id', planId)
        .eq('tracking_date', today)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data || { completed_habits: [] };
    } catch (error) {
      console.error('Error en getTodayTracking:', error);
      throw error;
    }
  }
};
