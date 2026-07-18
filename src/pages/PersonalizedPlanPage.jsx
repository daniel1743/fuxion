import React, { useState, useCallback } from 'react';
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

// ── Vista de Carga / Análisis ─────────────────────────────────
function AnalysisScreen({ onDone }) {
  const messages = [
    'Procesando tus datos biométricos…',
    'Evaluando tu perfil nutricional…',
    'Analizando calidad de sueño y recuperación…',
    'Calculando tu Índice Integral de Bienestar…',
    'Generando microhábitos personalizados…',
    'Construyendo tu Gemelo Digital de Bienestar…',
  ];

  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => {
        if (prev >= messages.length - 1) {
          clearInterval(interval);
          setTimeout(onDone, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
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
      {/* Pulsing orb */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          boxShadow: [
            '0 0 0px rgba(34,197,94,0.3)',
            '0 0 40px rgba(34,197,94,0.5)',
            '0 0 0px rgba(34,197,94,0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        <HugeiconsIcon icon={SparklesIcon} size={44} color="white" />
      </motion.div>

      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.5rem', fontWeight: 600, color: '#1f2937',
        marginBottom: 24, textAlign: 'center',
      }}>
        Analizando tu bienestar…
      </h2>

      {/* Progress messages */}
      <div style={{ height: 30, overflow: 'hidden', textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}
          >
            {messages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Animated progress bar */}
      <div style={{
        width: '100%', maxWidth: 320, height: 4,
        backgroundColor: '#e5e7eb', borderRadius: 2,
        marginTop: 24, overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: messages.length * 0.6 + 0.5, ease: 'easeInOut' }}
          style={{ height: '100%', backgroundColor: '#22c55e', borderRadius: 2 }}
        />
      </div>
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
      style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px' }}
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
        }}>
          Tu Plan a Medida
        </h1>
        <p style={{
          fontSize: '1rem', color: '#6b7280', lineHeight: 1.6,
          margin: '0 auto', maxWidth: 480,
        }}>
          Descubre cómo está tu bienestar mediante una evaluación integral y recibe
          recomendaciones personalizadas basadas en evidencia científica.
        </p>
      </motion.div>

      {/* Benefits grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16, marginBottom: 32,
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
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1f2937', margin: '0 0 4px' }}>
                {b.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
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
      </motion.div>
    </motion.div>
  );
}

// ── Página Contenedora ────────────────────────────────────────
export default function PersonalizedPlanPage() {
  const wellnessTwinContextData = useWellnessTwin();
  const { hasCompletedEvaluation, activePlan } = wellnessTwinContextData;
  
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
  <div style={{ minHeight: '100vh', backgroundColor: '#FCFBF8' }}>
    <LandingView onStart={() => console.log("Start")} />
  </div>
);
}
