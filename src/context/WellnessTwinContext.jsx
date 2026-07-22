import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { generateDigitalTwin } from '@/lib/engine/DigitalTwinEngine';
import { digitalTwinService } from '@/lib/services/digitalTwinService';
import { canEvaluate, registerEvaluation } from '@/services/evaluationLimitService';

const WellnessTwinContext = createContext(null);

export const WellnessTwinProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [answers, setAnswers] = useState({});
  const [twinData, setTwinData] = useState(null); // Nuevo estado unificado del Gemelo
  const [activePlan, setActivePlan] = useState(null); // Plan activo en curso
  const [hasCompletedEvaluation, setHasCompletedEvaluation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = 8;

  // Helper to normalize legacy twin data structure to Phase 3 structure
  const normalizeTwinData = (legacyData) => {
    if (!legacyData) return null;
    
    // Si ya viene con twin_state, asegurarnos de que la estructura interna sea correcta (ej. domains dentro de iib)
    if (legacyData.twin_state) {
      const ts = legacyData.twin_state;
      if (ts.domains && ts.iib && !ts.iib.domains) {
        ts.iib.domains = ts.domains;
        // Opcional: delete ts.domains; para mantenerlo limpio, pero no es estrictamente necesario
      }
      return legacyData;
    }

    // Estructura legacy muy antigua
    return {
      twin_state: {
        iib: legacyData.iib || { score: legacyData.iibScore || 0, domains: {} },
        biometrics: {
          tdee: legacyData.tdee || 0,
          protein: legacyData.protein || 0,
          waterL: legacyData.waterL || 0,
          bmi: legacyData.bmi || 0,
          bmiClass: legacyData.bmiClass || ''
        },
        behavior_profile: {}
      },
      recommendations: legacyData.recommendations || []
    };
  };

  const loadFromSupabase = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 1. Obtener Gemelo
      const twin = await digitalTwinService.getOrCreateTwin(user.id, {});
      
      // 2. Obtener plan activo si existe
      const plan = await digitalTwinService.getActivePlan(twin.id);
      
      if (plan) {
        setActivePlan(plan);
        setHasCompletedEvaluation(true);
        // Normalizamos el twin_state del active plan
        setTwinData(normalizeTwinData(plan.wellness_evaluations?.twin_state));
      } else {
        // Fallback al esquema viejo por retrocompatibilidad temporal
        const { data } = await supabase
          .from('wellness_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data && data.twin_data) {
          setAnswers(data.answers || data.twin_data.raw_answers || {});
          setTwinData(normalizeTwinData(data.twin_data));
          setHasCompletedEvaluation(true);
        }
      }
    } catch (err) {
      console.error('Error loading from supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadFromLocalStorage = useCallback(() => {
    const saved = localStorage.getItem('wellness_twin_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.twinData) setTwinData(parsed.twinData);
        if (parsed.completedAt) setHasCompletedEvaluation(true);
        return parsed;
      } catch (err) {
        console.error('Error parsing localStorage wellness data:', err);
      }
    }
    return null;
  }, []);

  const migrateLocalToSupabase = useCallback(async (localData) => {
    try {
      const { error } = await supabase.from('wellness_plans').upsert({
        user_id: user.id,
        full_name: localData.answers.name || 'Usuario',
        answers: localData.answers,
        recommendations: localData.twinData?.recommendations || [],
        iib_score: localData.twinData?.twin_state?.iib?.score || 0,
        twin_data: localData.twinData || {}
      });
      if (!error) {
        localStorage.removeItem('wellness_twin_data');
      }
    } catch (err) {
      console.error('Error migrating data:', err);
    }
  }, [user]);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      if (isAuthenticated && user) {
        const localData = loadFromLocalStorage();
        if (localData && localData.completedAt) {
          await migrateLocalToSupabase(localData);
          setAnswers(localData.answers || {});
          setTwinData(localData.twinData || null);
          setHasCompletedEvaluation(true);
        } else {
          await loadFromSupabase();
        }
      } else {
        loadFromLocalStorage();
      }
      setIsLoading(false);
    };

    initializeData();
  }, [isAuthenticated, user, loadFromSupabase, loadFromLocalStorage, migrateLocalToSupabase]);

  const submitEvaluation = async (finalAnswers) => {
    setIsLoading(true);
    try {
      // Check evaluation limit
      if (isAuthenticated && user) {
        const limitCheck = await canEvaluate(user.id);
        if (!limitCheck.canEvaluate) {
          alert(`Alcanzaste el límite de evaluaciones de este mes. Tu próxima evaluación estará disponible el 1 de ${new Date().toLocaleDateString('es-CL', { month: 'long' })}.`);
          setIsLoading(false);
          return;
        }
      }

      // 1. Ejecutar el nuevo motor
      const newTwin = generateDigitalTwin(finalAnswers);
      setTwinData(newTwin);
      setHasCompletedEvaluation(true);

      // 2. Guardar en BD o LocalStorage
      if (isAuthenticated && user) {
        // A. Obtener/crear Gemelo Base
        const twin = await digitalTwinService.getOrCreateTwin(user.id, newTwin.behavior_profile);

        // B. Guardar Evaluación en el historial
        const evaluation = await digitalTwinService.saveEvaluation(twin.id, finalAnswers, newTwin);

        // C. Registrar consumo de evaluación
        await registerEvaluation(user.id);

        // Guardamos las IDs en el objeto para usarlas al "Activar"
        newTwin._meta = { twinId: twin.id, evaluationId: evaluation.id };
        setTwinData(newTwin);
      } else {
        localStorage.setItem('wellness_twin_data', JSON.stringify({
          answers: finalAnswers,
          twinData: newTwin,
          completedAt: new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error('Error submitting evaluation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activateUserPlan = async () => {
    if (!isAuthenticated || !user || !twinData?._meta) {
      alert("Debes iniciar sesión para activar el plan y hacer seguimiento.");
      return;
    }
    
    setIsLoading(true);
    try {
      const plan = await digitalTwinService.activatePlan(
        twinData._meta.twinId,
        twinData._meta.evaluationId,
        twinData.recommendations
      );
      
      const loadedPlan = await digitalTwinService.getActivePlan(twinData._meta.twinId);
      setActivePlan(loadedPlan);
    } catch (err) {
      console.error('Error activating plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetEvaluation = () => {
    setAnswers({});
    setTwinData(null);
    setHasCompletedEvaluation(false);
    setCurrentStep(0);
    localStorage.removeItem('wellness_twin_data');
  };

  const userData = useMemo(() => ({
    name: answers?.name,
    age: answers?.age,
    gender: answers?.gender,
    weight: answers?.weight,
    height: answers?.height,
    waistCm: answers?.waistCm
  }), [answers]);

  const value = {
    answers,
    setAnswers,
    twinData,         // Reemplaza a planResults
    activePlan,       // Nuevo: Plan Activo
    planResults: twinData ? { // Proxy temporal para evitar romper componentes existentes de golpe
      ...twinData.twin_state.biometrics,
      iib: twinData.twin_state.iib,
      recommendations: twinData.recommendations
    } : null,
    hasCompletedEvaluation,
    isLoading,
    currentStep,
    setCurrentStep,
    totalSteps,
    submitEvaluation,
    activateUserPlan, // Nuevo: Activar Plan
    resetEvaluation,
    userData
  };

  return (
    <WellnessTwinContext.Provider value={value}>
      {children}
    </WellnessTwinContext.Provider>
  );
};

export const useWellnessTwin = () => {
  const context = useContext(WellnessTwinContext);
  if (!context) {
    throw new Error('useWellnessTwin must be used within a WellnessTwinProvider');
  }
  return context;
};
