import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  Activity01Icon,
  ArrowReloadHorizontalIcon
} from '@hugeicons/core-free-icons';
import { useWellnessTwin } from '@/context/WellnessTwinContext';
import { digitalTwinService } from '@/lib/services/digitalTwinService';

export default function ActivePlanDashboard() {
  const { activePlan, resetEvaluation, twinData } = useWellnessTwin();
  const [completedToday, setCompletedToday] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const recommendations = activePlan?.active_recommendations || twinData?.recommendations || [];
  const twinState = twinData?.twin_state;

  useEffect(() => {
    async function loadToday() {
      if (activePlan) {
        try {
          const track = await digitalTwinService.getTodayTracking(activePlan.id);
          setCompletedToday(track.completed_habits || []);
        } catch (e) {
          console.error("Error loading today track:", e);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadToday();
  }, [activePlan]);

  const toggleHabit = async (ruleId) => {
    let newCompleted;
    if (completedToday.includes(ruleId)) {
      newCompleted = completedToday.filter(id => id !== ruleId);
    } else {
      newCompleted = [...completedToday, ruleId];
    }
    
    setCompletedToday(newCompleted); // Optimistic update

    try {
      await digitalTwinService.saveDailyTracking(activePlan.id, newCompleted);
    } catch (e) {
      console.error("Error saving track:", e);
      // Revert on error
      setCompletedToday(completedToday);
    }
  };

  const progressPercentage = recommendations.length > 0 
    ? Math.round((completedToday.length / recommendations.length) * 100)
    : 0;

  if (isLoading || !twinState) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Cargando tu plan...</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>🌱</span>
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Plan Activo</h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
              Día de seguimiento • {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
          borderRadius: 20, padding: 24, color: 'white', marginBottom: 32,
          boxShadow: '0 10px 30px rgba(34,197,94,0.2)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Progreso Diario</h2>
          <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{progressPercentage}%</span>
        </div>
        <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            style={{ height: '100%', background: 'white', borderRadius: 4 }}
          />
        </div>
      </motion.div>

      {/* Checklist */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374151', marginBottom: 16 }}>Tus Microhábitos de Hoy</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {recommendations.map((rec, i) => {
          const isDone = completedToday.includes(rec.rule_id);
          
          return (
            <motion.div
              key={rec.rule_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => toggleHabit(rec.rule_id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px', borderRadius: 16,
                backgroundColor: isDone ? '#f0fdf4' : 'white',
                border: `1px solid ${isDone ? '#bbf7d0' : '#e5e7eb'}`,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: isDone ? 'none' : '0 2px 10px rgba(0,0,0,0.02)'
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                border: `2px solid ${isDone ? '#22c55e' : '#d1d5db'}`,
                background: isDone ? '#22c55e' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {isDone && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} color="white" />}
              </div>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: isDone ? '#166534' : '#1f2937', textDecoration: isDone ? 'line-through' : 'none' }}>
                  {rec.action}
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: isDone ? '#16a34a' : '#6b7280' }}>
                  {rec.why}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={resetEvaluation}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            background: 'transparent', border: '1px solid #d1d5db', borderRadius: 12,
            color: '#4b5563', fontSize: '0.9rem', cursor: 'pointer'
          }}
        >
          <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={18} />
          Hacer Reevaluación Completa
        </button>
      </div>

    </div>
  );
}
