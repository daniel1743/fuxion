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
import { QUESTION_ORDER } from '@/lib/engine/questionTree';

const IS_DEVELOPMENT = import.meta.env.DEV;

const DEV_SCENARIOS = {
  normal_control: {
    label: 'Normal control',
    desc: 'Perfil equilibrado para validar un informe sano.',
    answers: {
      name: 'Perfil Control Desarrollo',
      age: 38,
      gender: 'male',
      weight: 76,
      height: 176,
      waistCm: 84,
      activityLevel: 'moderate',
      exerciseMinutesPerWeek: 180,
      dailySteps: 8500,
      sedentaryHours: 6,
      sleepHours: 7.4,
      sleepQuality: 4,
      awakeningsPerNight: 1,
      screensBeforeBed: false,
      waterLiters: 2.5,
      fruitVegServings: 4,
      ultraprocessedPerWeek: 2,
      bristolType: 4,
      bowelFrequency: 'daily',
      bloating: 'sometimes',
      stressLevel: 4,
      moodLevel: 4,
      sunExposure: 'some',
      smokes: false,
      alcoholPerWeek: 1,
      coffeePerDay: 2,
      goal: 'maintain',
      knownConditions: 'Sin condiciones relevantes declaradas.',
    },
  },
  muy_delgada_malos_habitos: {
    label: 'Muy delgada, malos hábitos',
    desc: 'Bajo peso, sueño pobre, mala hidratación y digestión lenta.',
    answers: {
      name: 'Perfil Delgado Riesgo Desarrollo',
      age: 29,
      gender: 'female',
      weight: 46,
      height: 168,
      waistCm: 64,
      activityLevel: 'sedentary',
      exerciseMinutesPerWeek: 0,
      dailySteps: 2300,
      sedentaryHours: 10,
      sleepHours: 5.4,
      sleepQuality: 2,
      awakeningsPerNight: 3,
      screensBeforeBed: true,
      waterLiters: 0.5,
      fruitVegServings: 1,
      ultraprocessedPerWeek: 9,
      bristolType: 2,
      bowelFrequency: 'few_per_week',
      bloating: 'often',
      stressLevel: 8,
      moodLevel: 2,
      sunExposure: 'none',
      smokes: true,
      alcoholPerWeek: 3,
      coffeePerDay: 4,
      goal: 'gain',
      knownConditions: 'Bajo peso percibido, fatiga frecuente y tránsito intestinal lento.',
    },
  },
  sobrepeso_moderado: {
    label: 'Sobrepeso moderado',
    desc: 'Riesgo metabólico medio con margen claro de mejora.',
    answers: {
      name: 'Perfil Sobrepeso Desarrollo',
      age: 42,
      gender: 'male',
      weight: 92,
      height: 173,
      waistCm: 105,
      activityLevel: 'light',
      exerciseMinutesPerWeek: 60,
      dailySteps: 4600,
      sedentaryHours: 9,
      sleepHours: 6.2,
      sleepQuality: 3,
      awakeningsPerNight: 2,
      screensBeforeBed: true,
      waterLiters: 1,
      fruitVegServings: 2,
      ultraprocessedPerWeek: 6,
      bristolType: 3,
      bowelFrequency: 'daily',
      bloating: 'sometimes',
      stressLevel: 6,
      moodLevel: 3,
      sunExposure: 'some',
      smokes: false,
      alcoholPerWeek: 4,
      coffeePerDay: 3,
      goal: 'lose',
      knownConditions: 'Aumento de cintura, cansancio vespertino y baja regularidad de entrenamiento.',
    },
  },
  obesidad_alto_riesgo: {
    label: 'Obesidad alto riesgo',
    desc: 'Caso exigente para revisar alertas, prioridades y tono responsable.',
    answers: {
      name: 'Perfil Riesgo Alto Desarrollo',
      age: 51,
      gender: 'male',
      weight: 118,
      height: 170,
      waistCm: 124,
      activityLevel: 'sedentary',
      exerciseMinutesPerWeek: 0,
      dailySteps: 1800,
      sedentaryHours: 12,
      sleepHours: 5.2,
      sleepQuality: 1,
      awakeningsPerNight: 4,
      screensBeforeBed: true,
      waterLiters: 0.5,
      fruitVegServings: 0,
      ultraprocessedPerWeek: 11,
      bristolType: 6,
      bowelFrequency: 'multiple_daily',
      bloating: 'always',
      stressLevel: 9,
      moodLevel: 2,
      sunExposure: 'none',
      smokes: true,
      alcoholPerWeek: 8,
      coffeePerDay: 5,
      goal: 'lose',
      knownConditions: 'Hipertensión declarada, ronquidos frecuentes, cansancio matinal y perímetro abdominal elevado.',
    },
  },
  adulto_mayor_obeso: {
    label: 'Adulto mayor obeso',
    desc: 'Más edad, sedentarismo, tránsito lento y prioridad de seguridad.',
    answers: {
      name: 'Perfil Adulto Mayor Desarrollo',
      age: 68,
      gender: 'female',
      weight: 104,
      height: 165,
      waistCm: 118,
      activityLevel: 'sedentary',
      exerciseMinutesPerWeek: 0,
      dailySteps: 1500,
      sedentaryHours: 11,
      sleepHours: 5.8,
      sleepQuality: 2,
      awakeningsPerNight: 4,
      screensBeforeBed: true,
      waterLiters: 1,
      fruitVegServings: 1,
      ultraprocessedPerWeek: 5,
      bristolType: 2,
      bowelFrequency: 'less',
      bloating: 'often',
      stressLevel: 7,
      moodLevel: 2,
      sunExposure: 'none',
      smokes: false,
      alcoholPerWeek: 0,
      coffeePerDay: 2,
      goal: 'lose',
      knownConditions: 'Dolor articular, presión alta controlada y baja tolerancia al ejercicio.',
    },
  },
  digestion_critica: {
    label: 'Digestión crítica',
    desc: 'Peso medio, pero digestión e hidratación muy comprometidas.',
    answers: {
      name: 'Perfil Digestivo Desarrollo',
      age: 35,
      gender: 'female',
      weight: 70,
      height: 170,
      waistCm: 82,
      activityLevel: 'light',
      exerciseMinutesPerWeek: 45,
      dailySteps: 4200,
      sedentaryHours: 9,
      sleepHours: 6,
      sleepQuality: 2,
      awakeningsPerNight: 3,
      screensBeforeBed: true,
      waterLiters: 0.5,
      fruitVegServings: 1,
      ultraprocessedPerWeek: 8,
      bristolType: 1,
      bowelFrequency: 'less',
      bloating: 'always',
      stressLevel: 7,
      moodLevel: 3,
      sunExposure: 'some',
      smokes: false,
      alcoholPerWeek: 2,
      coffeePerDay: 4,
      goal: 'maintain',
      knownConditions: 'Distensión abdominal diaria, estreñimiento marcado y baja tolerancia a ciertos alimentos.',
    },
  },
};

const DEV_SEVERITIES = {
  base: { label: 'Base', desc: 'Usa el perfil tal como está definido.' },
  medio: { label: 'Más grave', desc: 'Empeora hábitos y métricas clave.' },
  severo: { label: 'Extremo', desc: 'Caso límite para probar alertas y fallback.' },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyDevSeverity(baseAnswers, severity) {
  const next = { ...baseAnswers };

  if (severity === 'medio' || severity === 'severo') {
    next.weight = Math.round(next.weight * 1.04);
    next.waistCm = Math.round((next.waistCm || 80) + 4);
    next.dailySteps = Math.max(500, Math.round((next.dailySteps || 3000) - 1000));
    next.sedentaryHours = clamp((next.sedentaryHours || 8) + 1, 1, 16);
    next.sleepHours = clamp(Number((Number(next.sleepHours || 7) - 0.7).toFixed(1)), 3, 10);
    next.sleepQuality = clamp((next.sleepQuality || 3) - 1, 1, 5);
    next.awakeningsPerNight = clamp((next.awakeningsPerNight || 0) + 1, 0, 8);
    next.waterLiters = clamp(Number((Number(next.waterLiters || 1) - 0.5).toFixed(2)), 0.25, 3.5);
    next.fruitVegServings = clamp((next.fruitVegServings || 0) - 1, 0, 8);
    next.ultraprocessedPerWeek = clamp((next.ultraprocessedPerWeek || 0) + 2, 0, 21);
    next.stressLevel = clamp((next.stressLevel || 5) + 1, 1, 10);
    next.moodLevel = clamp((next.moodLevel || 3) - 1, 1, 5);
    next.screensBeforeBed = true;
  }

  if (severity === 'severo') {
    next.weight = Math.round(next.weight * 1.06);
    next.waistCm = Math.round((next.waistCm || 80) + 6);
    next.dailySteps = Math.max(300, Math.round((next.dailySteps || 2000) - 1200));
    next.sedentaryHours = clamp((next.sedentaryHours || 10) + 2, 1, 16);
    next.sleepHours = clamp(Number((Number(next.sleepHours || 6) - 0.8).toFixed(1)), 3, 10);
    next.waterLiters = clamp(Number((Number(next.waterLiters || 0.75) - 0.25).toFixed(2)), 0.25, 3.5);
    next.ultraprocessedPerWeek = clamp((next.ultraprocessedPerWeek || 0) + 3, 0, 21);
    next.stressLevel = clamp((next.stressLevel || 7) + 1, 1, 10);
    next.moodLevel = clamp((next.moodLevel || 2) - 1, 1, 5);
    next.smokes = next.smokes || next.age < 60;
    next.bloating = next.bloating === 'never' ? 'sometimes' : next.bloating;
    next.knownConditions = `${next.knownConditions || ''} Caso extremo de desarrollo: priorizar tono prudente, alertas y recomendaciones progresivas.`.trim();
  }

  return next;
}

function buildDevAnswers(scenarioId, severity) {
  const scenario = DEV_SCENARIOS[scenarioId] || DEV_SCENARIOS.normal_control;
  return applyDevSeverity(scenario.answers, severity);
}

function DevScenarioPanel({ onLoadQuestionnaire, onGenerateReport, isGenerating }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scenarioId, setScenarioId] = useState('sobrepeso_moderado');
  const [severity, setSeverity] = useState('base');

  if (!IS_DEVELOPMENT) return null;

  const scenario = DEV_SCENARIOS[scenarioId];

  return (
    <div
      style={{
        position: 'fixed',
        right: 18,
        bottom: 18,
        width: isOpen ? 'min(420px, calc(100vw - 36px))' : 'auto',
        zIndex: 80,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            border: '1px solid rgba(20,184,166,0.35)',
            background: '#0f766e',
            color: 'white',
            borderRadius: 999,
            padding: '11px 16px',
            fontWeight: 800,
            fontSize: '0.78rem',
            letterSpacing: '0.04em',
            boxShadow: '0 16px 38px rgba(15,118,110,0.28)',
            cursor: 'pointer',
          }}
        >
          DEV perfiles
        </button>
      ) : (
        <section
          style={{
            background: 'rgba(255,255,255,0.97)',
            border: '1px solid rgba(20,184,166,0.25)',
            borderRadius: 14,
            boxShadow: '0 24px 70px rgba(15,23,42,0.18)',
            padding: 16,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ color: '#0f766e', fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Solo desarrollo
              </div>
              <h3 style={{ margin: '4px 0 0', color: '#0f172a', fontSize: '1rem' }}>
                Perfiles rápidos de prueba
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar panel de desarrollo"
              style={{
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#475569',
                borderRadius: 8,
                width: 30,
                height: 30,
                cursor: 'pointer',
                fontWeight: 800,
              }}
            >
              x
            </button>
          </div>

          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: 6 }}>
            Caso clínico simulado
          </label>
          <select
            value={scenarioId}
            onChange={(event) => setScenarioId(event.target.value)}
            style={{
              width: '100%',
              border: '1px solid #dbe4ee',
              borderRadius: 10,
              padding: '10px 12px',
              color: '#0f172a',
              marginBottom: 10,
              background: 'white',
            }}
          >
            {Object.entries(DEV_SCENARIOS).map(([id, item]) => (
              <option key={id} value={id}>{item.label}</option>
            ))}
          </select>

          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: 6 }}>
            Gravedad opcional
          </label>
          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
            style={{
              width: '100%',
              border: '1px solid #dbe4ee',
              borderRadius: 10,
              padding: '10px 12px',
              color: '#0f172a',
              marginBottom: 10,
              background: 'white',
            }}
          >
            {Object.entries(DEV_SEVERITIES).map(([id, item]) => (
              <option key={id} value={id}>{item.label}</option>
            ))}
          </select>

          <p style={{ margin: '0 0 14px', color: '#64748b', fontSize: '0.78rem', lineHeight: 1.45 }}>
            {scenario.desc} {DEV_SEVERITIES[severity].desc}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              onClick={() => onLoadQuestionnaire(scenarioId, severity)}
              disabled={isGenerating}
              style={{
                border: '1px solid #99f6e4',
                background: '#f0fdfa',
                color: '#0f766e',
                borderRadius: 10,
                padding: '11px 12px',
                fontWeight: 850,
                cursor: isGenerating ? 'wait' : 'pointer',
              }}
            >
              Cargar formulario
            </button>
            <button
              type="button"
              onClick={() => onGenerateReport(scenarioId, severity)}
              disabled={isGenerating}
              style={{
                border: '1px solid #0f766e',
                background: '#0f766e',
                color: 'white',
                borderRadius: 10,
                padding: '11px 12px',
                fontWeight: 850,
                cursor: isGenerating ? 'wait' : 'pointer',
              }}
            >
              {isGenerating ? 'Generando...' : 'Generar informe'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

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
function LandingView({ onStart, user, isAuthenticated }) {
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
  const {
    hasCompletedEvaluation,
    activePlan,
    setAnswers,
    setCurrentQuestionId,
    setCompletedQuestions,
    submitEvaluation,
    resetEvaluation,
  } = wellnessTwinContextData;
  const { user, isAuthenticated } = useAuth();
  const [isDevGenerating, setIsDevGenerating] = useState(false);
  
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

  const handleLoadDevScenario = useCallback((scenarioId, severity) => {
    const devAnswers = buildDevAnswers(scenarioId, severity);
    resetEvaluation();
    setAnswers(devAnswers);
    setCompletedQuestions([]);
    setCurrentQuestionId('q_name');
    setView('questionnaire');
    console.info('[dev-plan] Perfil cargado en cuestionario', {
      scenarioId,
      severity,
      answers: devAnswers,
    });
  }, [resetEvaluation, setAnswers, setCompletedQuestions, setCurrentQuestionId]);

  const handleGenerateDevScenario = useCallback(async (scenarioId, severity) => {
    const devAnswers = buildDevAnswers(scenarioId, severity);
    const startedAt = performance.now();

    setIsDevGenerating(true);
    resetEvaluation();
    setAnswers(devAnswers);
    setCompletedQuestions(QUESTION_ORDER);
    setCurrentQuestionId(null);
    setView('analyzing');

    console.info('[dev-plan] Generando evaluación con perfil rápido', {
      scenarioId,
      severity,
      answers: devAnswers,
    });

    try {
      await submitEvaluation(devAnswers);
      console.info('[dev-plan] Evaluación dev completada', {
        scenarioId,
        severity,
        elapsedMs: Math.round(performance.now() - startedAt),
      });
    } catch (error) {
      console.error('[dev-plan] Falló la evaluación dev', {
        scenarioId,
        severity,
        elapsedMs: Math.round(performance.now() - startedAt),
        error: error?.message || String(error),
      });
    } finally {
      setIsDevGenerating(false);
    }
  }, [
    resetEvaluation,
    setAnswers,
    setCompletedQuestions,
    setCurrentQuestionId,
    submitEvaluation,
  ]);

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
          <LandingView key="landing" onStart={handleStartQuestionnaire} user={user} isAuthenticated={isAuthenticated} />
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
      <DevScenarioPanel
        onLoadQuestionnaire={handleLoadDevScenario}
        onGenerateReport={handleGenerateDevScenario}
        isGenerating={isDevGenerating}
      />
    </div>
  );
}
