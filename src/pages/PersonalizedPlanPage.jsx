import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Rocket01Icon,
  Clock01Icon,
  Shield01Icon,
  HeartIcon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import { useWellnessTwin } from '@/context/WellnessTwinContext';
import WellnessQuestionnaire from '@/components/wellness-plan/WellnessQuestionnaire';
import DigitalTwinDashboard from '@/components/wellness-plan/DigitalTwinDashboard';
import ActivePlanDashboard from '@/components/wellness-plan/ActivePlanDashboard';
import EvaluationLimitBadge from '@/components/wellness-plan/EvaluationLimitBadge';
import { useAuth } from '@/context/AuthContext';

// ── Vista de Carga / Análisis Conversacional ─────────────────
function AnalysisScreen({ onDone, userName }) {
  const messages = [
    `Terminé de leer lo que me contaste, ${userName || 'amigo'}…`,
    'Ahora estoy cruzando tus datos. Hay señales interesantes.',
    'Voy a preparar un informe que va a tener sentido solo para vos.',
    'Ya tengo tu lectura. Abrila cuando estés listo.',
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const totalDuration = messages.length * 1200 + 600;
    const timers = [];

    messages.forEach((_, i) => {
      if (i === 2) {
        timers.push(setTimeout(() => setShowProgress(true), i * 1200));
      }
      timers.push(setTimeout(() => {
        setMessageIndex(prev => {
          if (prev >= messages.length - 1) {
            setTimeout(onDone, 800);
            return prev;
          }
          return prev + 1;
        });
      }, i * 1200 + 1200));
    });

    return () => timers.forEach(clearTimeout);
  }, [onDone, messages.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '70vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      {/* Breathing orb */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 40,
          boxShadow: '0 0 40px rgba(34,197,94,0.25)',
        }}
      >
        <HugeiconsIcon icon={SparklesIcon} size={36} color="white" />
      </motion.div>

      {/* Conversational message */}
      <div style={{ height: 60, overflow: 'hidden', textAlign: 'center', marginBottom: 32 }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              fontSize: '1.15rem',
              color: '#1f2937',
              margin: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              lineHeight: 1.5,
              maxWidth: 480,
            }}
          >
            "{messages[messageIndex]}"
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Subtle progress */}
      {showProgress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          style={{ width: '100%', maxWidth: 200, height: 2, backgroundColor: '#e5e7eb', borderRadius: 1, overflow: 'hidden' }}
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ height: '100%', backgroundColor: '#22c55e', borderRadius: 1 }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Vista de Introducción / Landing ───────────────────────────
function LandingView({ onStart }) {
  const benefits = [
    { icon: HeartIcon, title: 'Análisis integral', desc: 'Evaluamos 7 dominios de tu bienestar: nutrición, sueño, actividad, estrés, digestión, biometría y hábitos.' },
    { icon: SparklesIcon, title: 'Recomendaciones inteligentes', desc: 'Recibes los 3 microhábitos de mayor impacto para tu perfil específico.' },
    { icon: Rocket01Icon, title: 'Gemelo Digital', desc: 'Se crea una representación dinámica de tu bienestar que evoluciona contigo.' },
    { icon: Shield01Icon, title: 'Completamente seguro', desc: 'No diagnosticamos enfermedades. Tu información es privada y protegida.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        width: 'calc(100vw - 32px)',
        maxWidth: 640,
        margin: '0 auto',
        padding: '40px 0',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 32px rgba(34,197,94,0.3)',
          }}
        >
          <HugeiconsIcon icon={Rocket01Icon} size={36} color="white" />
        </motion.div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2.2rem', fontWeight: 600, color: '#1f2937',
          margin: '0 0 12px', lineHeight: 1.2,
          maxWidth: '320px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Tu Plan a Medida
        </h1>
        <p style={{
          fontSize: '1rem', color: '#6b7280', lineHeight: 1.6,
          margin: '0 auto',
          width: '320px',
          maxWidth: '100%',
          overflowWrap: 'anywhere',
        }}>
          Descubre cómo está tu bienestar mediante una evaluación integral y recibe
          recomendaciones personalizadas basadas en evidencia científica.
        </p>
      </motion.div>

      {/* Benefits grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
        gap: 16, marginBottom: 32,
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.12 }}
            style={{
              background: 'white', borderRadius: 16,
              padding: '20px 24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              display: 'flex', alignItems: 'flex-start', gap: 14,
              minWidth: 0,
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              backgroundColor: '#f0fdf4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <HugeiconsIcon icon={b.icon} size={20} color="#22c55e" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1f2937', margin: '0 0 4px' }}>
                {b.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.5, margin: 0, overflowWrap: 'anywhere' }}>
                {b.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Time estimate & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={{ textAlign: 'center' }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: '0.82rem', color: '#9ca3af', marginBottom: 16,
        }}>
          <HugeiconsIcon icon={Clock01Icon} size={16} color="#9ca3af" />
          Tiempo estimado: 5 minutos
        </div>

        <div>
          <button
            onClick={onStart}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white', border: 'none', borderRadius: 16,
              fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(34,197,94,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(34,197,94,0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(34,197,94,0.35)';
            }}
          >
            Comenzar evaluación
            <HugeiconsIcon icon={Rocket01Icon} size={20} color="white" />
          </button>
        </div>

        <p style={{
          fontSize: '0.75rem', color: '#9ca3af', marginTop: 16,
          maxWidth: 400, margin: '16px auto 0',
        }}>
          Esta evaluación es completamente opcional y gratuita. No forma parte del
          proceso de registro y puedes realizarla cuando lo desees.
        </p>

        {isAuthenticated && user && (
          <EvaluationLimitBadge userId={user.id} />
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Página Contenedora ────────────────────────────────────────
export default function PersonalizedPlanPage() {
  const wellnessTwinContextData = useWellnessTwin();
  const { hasCompletedEvaluation, activePlan, answers } = wellnessTwinContextData;
  const { user, isAuthenticated } = useAuth();
  
  // Views: 'landing' | 'questionnaire' | 'analyzing' | 'dashboard' | 'active-plan'
  const determineInitialView = () => {
    if (activePlan) return 'active-plan';
    if (hasCompletedEvaluation) return 'dashboard';
    return 'landing';
  };
  
  const [view, setView] = useState(determineInitialView());

  const handleStartQuestionnaire = useCallback(() => setView('questionnaire'), []);
  const handleQuestionnaireComplete = useCallback(() => setView('analyzing'), []);
  const handleAnalysisDone = useCallback(() => setView('dashboard'), []);

  // Sync state if it loads asynchronously
  React.useEffect(() => {
    if (activePlan) {
      setView('active-plan');
    } else if (hasCompletedEvaluation && view === 'landing') {
      setView('dashboard');
    }
  }, [hasCompletedEvaluation, activePlan, view]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FCFBF8',
        paddingTop: '80px',
        overflowX: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <LandingView key="landing" onStart={handleStartQuestionnaire} />
        )}
        {view === 'questionnaire' && (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ padding: '24px 16px' }}
          >
            <WellnessQuestionnaire onComplete={handleQuestionnaireComplete} />
          </motion.div>
        )}
        {view === 'analyzing' && (
          <AnalysisScreen key="analyzing" onDone={handleAnalysisDone} userName={wellnessTwinContextData.answers?.name} />
        )}
        {view === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DigitalTwinDashboard />
          </motion.div>
        )}
        {view === 'active-plan' && (
          <motion.div key="active-plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ActivePlanDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
