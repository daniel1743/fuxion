import React, { useMemo, useState } from 'react';
import { generatePremiumReportContent } from '@/lib/engine/AiReportGenerator';
import PremiumReportTemplate, { downloadPremiumPDF } from './PremiumReportTemplate';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Download04Icon,
  ArrowReloadHorizontalIcon,
  Leaf01Icon,
  Rocket01Icon,
  InformationCircleIcon,
  EnergyIcon,
  Target01Icon,
  Shield01Icon,
  StarIcon,
  HelpCircleIcon,
  InstagramIcon,
} from '@hugeicons/core-free-icons';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import { useWellnessTwin } from '@/context/WellnessTwinContext';
import { classifyIIBLevel, classifyBMI } from '@/lib/wellnessAlgorithms';
import { generateWellnessPDF } from '@/lib/generateWellnessPDF';

const DOMAIN_CONFIG = {
  nutrition:  { label: 'Nutrición e Hidratación', icon: Leaf01Icon, color: '#22c55e' },
  activity:   { label: 'Actividad Física',        icon: EnergyIcon, color: '#3b82f6' },
  sleep:      { label: 'Calidad del Sueño',        icon: StarIcon,    color: '#8b5cf6' },
  mental:     { label: 'Salud Mental y Estrés',    icon: HelpCircleIcon,   color: '#ec4899' },
  biometry:   { label: 'Biometría y Riesgo',       icon: Target01Icon, color: '#f59e0b' },
  digestion:  { label: 'Salud Digestiva',          icon: Shield01Icon,  color: '#14b8a6' },
  habits:     { label: 'Hábitos y Prevención',     icon: Rocket01Icon,    color: '#6366f1' },
};

// ── Anillo de Progreso SVG ────────────────────────────────────
function ScoreRing({ score, size = 180, strokeWidth = 12 }) {
  const level = classifyIIBLevel(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={level.color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.span
          style={{ fontSize: '2.5rem', fontWeight: 700, color: level.color, lineHeight: 1 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6, ease: 'easeOut' }}
        >
          {score}
        </motion.span>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>de 100</span>
      </div>
    </div>
  );
}

// ── Barra de Dominio ──────────────────────────────────────────
function DomainBar({ domainKey, score, delay = 0 }) {
  const config = DOMAIN_CONFIG[domainKey];
  if (!config) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + delay * 0.12, duration: 0.5 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 0', borderBottom: '1px solid #f3f4f6',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: `${config.color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <HugeiconsIcon icon={config.icon} size={18} color={config.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 4,
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>
            {config.label}
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: config.color }}>
            {Math.round(score)}/100
          </span>
        </div>
        <div style={{
          height: 6, borderRadius: 3, backgroundColor: '#e5e7eb', overflow: 'hidden',
        }}>
          <motion.div
            style={{ height: '100%', borderRadius: 3, backgroundColor: config.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, score)}%` }}
            transition={{ delay: 1 + delay * 0.12, duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function DomainRadarChart({ domains }) {
  const entries = Object.entries(DOMAIN_CONFIG)
    .filter(([key]) => domains[key] !== undefined)
    .map(([key, config]) => ({
      key,
      label: config.label,
      value: Math.round(domains[key]),
    }));

  if (entries.length === 0) return null;

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const values = params.value || [];
        return entries
          .map((entry, index) => `${entry.label}: <strong>${values[index]}/100</strong>`)
          .join('<br/>');
      },
    },
    radar: {
      radius: '68%',
      center: ['50%', '52%'],
      indicator: entries.map((entry) => ({ name: entry.label, max: 100 })),
      splitNumber: 4,
      axisName: {
        color: '#374151',
        fontSize: 11,
        lineHeight: 14,
      },
      splitLine: { lineStyle: { color: ['#e5e7eb'] } },
      splitArea: {
        areaStyle: {
          color: ['rgba(34,197,94,0.03)', 'rgba(20,184,166,0.06)'],
        },
      },
      axisLine: { lineStyle: { color: '#d1d5db' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: entries.map((entry) => entry.value),
            name: 'Perfil actual',
            areaStyle: { color: 'rgba(34,197,94,0.22)' },
            lineStyle: { color: '#16a34a', width: 3 },
            itemStyle: { color: '#16a34a' },
          },
        ],
      },
    ],
  };

  return (
    <div style={{ height: 320, width: '100%' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}

// ── Tarjeta de Recomendación ──────────────────────────────────
function RecommendationCard({ rec, index, isPriority = false }) {
  const categoryColors = {
    'nutrition': '#f59e0b',
    'activity': '#22c55e',
    'sleep': '#8b5cf6',
    'mental': '#ec4899',
    'digestion': '#14b8a6',
    'biometry': '#f97316',
    'habits': '#ef4444',
  };
  const categoryLabels = {
    'nutrition': 'Nutrición',
    'activity': 'Movimiento',
    'sleep': 'Sueño',
    'mental': 'Salud Mental',
    'digestion': 'Digestión',
    'biometry': 'Biometría',
    'habits': 'Prevención',
  };
  const color = categoryColors[rec.domain] || '#6b7280';
  const label = categoryLabels[rec.domain] || rec.domain;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 + index * 0.2, duration: 0.5 }}
      style={{
        background: isPriority ? `linear-gradient(to right, white, ${color}10)` : 'white',
        borderRadius: 16,
        padding: isPriority ? '24px' : '20px 24px',
        boxShadow: isPriority ? `0 8px 30px ${color}20` : '0 2px 12px rgba(0,0,0,0.06)',
        borderLeft: `4px solid ${color}`,
        border: isPriority ? `1px solid ${color}30` : 'none',
        borderLeftWidth: isPriority ? '6px' : '4px',
        borderLeftColor: color,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', color, backgroundColor: `${color}12`,
          padding: '3px 10px', borderRadius: 20,
        }}>
          {label}
        </span>
        {isPriority && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>
             ✨ Mayor Impacto
          </span>
        )}
      </div>
      <h4 style={{ fontSize: isPriority ? '1.2rem' : '1rem', fontWeight: 700, color: '#1f2937', margin: '0 0 8px' }}>
        {rec.action}
      </h4>
      <div style={{
        fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5,
        backgroundColor: isPriority ? 'white' : '#f9fafb', 
        borderRadius: 10, padding: '12px 16px',
        border: isPriority ? '1px solid #f3f4f6' : 'none'
      }}>
        <strong style={{ color: color, display: 'block', marginBottom: 4 }}>¿Por qué funciona?</strong> 
        {rec.reason}
      </div>
    </motion.div>
  );
}

// ── Dashboard Principal ───────────────────────────────────────

export default function DigitalTwinDashboard() {
  const { twinData, userData, resetEvaluation, activateUserPlan } = useWellnessTwin();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');

  const level = useMemo(
    () => twinData ? classifyIIBLevel(twinData.twin_state.iib.score) : null,
    [twinData]
  );

  if (!twinData) return null;

  const { twin_state, recommendations } = twinData;
  const { iib, biometrics } = twin_state;
  const activeDomains = iib?.domains || twin_state?.domains || {};
  const { tdee, protein, waterL, bmi, bmiClass } = biometrics;

  const handleDownload = async () => {
    if (!twinData || !userData) return;
    
    setIsGeneratingPDF(true);
    try {
      // 1. Verificar si ya tenemos el reporte en el estado (cache)
      let markdown = twinData.ai_report_markdown;
      
      if (!markdown) {
        // 2. Si no, llamar a la IA para generarlo a través de nuestro backend
        markdown = await generatePremiumReportContent(userData, twinData);
        
        // Lo guardamos temporalmente en el estado para no volver a generarlo si descarga 2 veces
        twinData.ai_report_markdown = markdown; 
      }
      
      setGeneratedMarkdown(markdown);
      
      // Damos un pequeño respiro a React para que renderice el markdown oculto
      setTimeout(async () => {
        const element = document.getElementById('premium-pdf-container');
        if (element) {
          await downloadPremiumPDF(element, `Plan_Bienestar_${userData.name.replace(/\s+/g, '_')}.pdf`);
        }
        setIsGeneratingPDF(false);
      }, 500);

    } catch (err) {
      console.error("Error al generar PDF Premium:", err);
      alert("Hubo un error al generar tu reporte premium: " + err.message);
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      {/* ── Overlay de Carga PDF ── */}
      {isGeneratingPDF && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.9)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            style={{ fontSize: '3rem', marginBottom: 20 }}
          >
            ⏳
          </motion.div>
          <h2 style={{ color: '#166534', fontFamily: "'Cormorant Garamond', serif" }}>
            Redactando tu libro personalizado...
          </h2>
          <p style={{ color: '#6b7280' }}>Nuestra IA está analizando tus resultados.</p>
        </div>
      )}

      {/* ── Contenedor Oculto para Renderizar el PDF ── */}
      <div style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0, pointerEvents: 'none' }}>
        <div id="premium-pdf-container">
          {generatedMarkdown && (
            <PremiumReportTemplate 
              markdownContent={generatedMarkdown} 
              userData={userData} 
            />
          )}
        </div>
      </div>

      {/* ── Header: Gemelo Digital ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 32 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
          }}
        >
          <HugeiconsIcon icon={Rocket01Icon} size={28} color="white" />
        </motion.div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.8rem', fontWeight: 600, color: '#1f2937', margin: '0 0 4px',
        }}>
          Tu Gemelo Digital de Bienestar
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
          {userData?.name ? `Hola ${userData.name}, este` : 'Este'} es tu análisis integral personalizado
        </p>
      </motion.div>

      {/* ── Tu Prioridad de Hoy ── */}
      {recommendations && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          style={{ marginBottom: 32 }}
        >
          <h3 style={{
            fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.12em', color: '#10b981', marginBottom: 16, textAlign: 'center',
          }}>
            🌟 Tu Prioridad de Hoy
          </h3>
          <RecommendationCard rec={recommendations[0]} index={0} isPriority={true} />
        </motion.div>
      )}

      {/* ── Otras Recomendaciones ── */}
      {recommendations && recommendations.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ marginBottom: 32 }}
        >
          <h3 style={{
            fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.12em', color: '#9ca3af', marginBottom: 16, textAlign: 'center',
          }}>
            Siguientes Pasos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recommendations.slice(1).map((rec, i) => (
              <RecommendationCard key={i} rec={rec} index={i + 1} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Score Ring ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          background: 'white', borderRadius: 20, padding: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h3 style={{
          fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.12em', color: '#9ca3af', marginBottom: 20,
        }}>
          Índice Integral de Bienestar
        </h3>
        <ScoreRing score={iib.score} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          style={{ textAlign: 'center', marginTop: 16 }}
        >
          <span style={{
            display: 'inline-block', padding: '4px 16px', borderRadius: 20,
            backgroundColor: `${level.color}15`, color: level.color,
            fontSize: '0.85rem', fontWeight: 700,
          }}>
            {level.emoji} {level.level}
          </span>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 10, lineHeight: 1.5 }}>
            {level.description}
          </p>
        </motion.div>
      </motion.div>

      {/* ── Datos Rápidos ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { label: 'Calorías/día', value: `${tdee || '—'} kcal`, color: '#f59e0b' },
          { label: 'Proteínas', value: `${protein || '—'} g`, color: '#3b82f6' },
          { label: 'Hidratación', value: `${waterL || '—'} L`, color: '#06b6d4' },
        ].map((item, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: 14, padding: '16px 12px',
            textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: item.color }}>
              {item.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 4 }}>
              {item.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Domain Bars ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          background: 'white', borderRadius: 20, padding: '24px 20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          marginBottom: 24,
        }}
      >
        <h3 style={{
          fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.12em', color: '#9ca3af', marginBottom: 12,
        }}>
          Análisis por Dominio
        </h3>
        {Object.keys(activeDomains).length > 0 ? (
          <>
            <DomainRadarChart domains={activeDomains} />
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 12,
              padding: '12px 14px',
              margin: '4px 0 12px',
            }}>
              <HugeiconsIcon icon={InformationCircleIcon} size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, color: '#166534', fontSize: '0.8rem', lineHeight: 1.5 }}>
                Este mapa muestra tus áreas fuertes y tus puntos de mayor oportunidad. El informe usa esta forma para priorizar hábitos con más impacto y menor fricción.
              </p>
            </div>
            {Object.entries(activeDomains).map(([key, score], i) => (
              <DomainBar key={key} domainKey={key} score={score} delay={i} />
            ))}
          </>
        ) : (
          <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
            Sin datos de dominios disponibles...
          </p>
        )}
      </motion.div>

      {/* ── Disclaimer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          backgroundColor: '#fef3c7', borderRadius: 12, padding: '14px 16px',
          marginBottom: 24,
        }}
      >
        <HugeiconsIcon icon={InformationCircleIcon} size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.78rem', color: '#92400e', lineHeight: 1.5, margin: 0 }}>
          Este análisis tiene fines exclusivamente informativos y no constituye un diagnóstico médico.
          Para consultas específicas de salud, acude a un profesional cualificado.
        </p>
      </motion.div>

      {/* ── Action Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        style={{
          display: 'flex', flexDirection: 'column', gap: 12,
          marginBottom: 32,
        }}
      >
        <button
          onClick={activateUserPlan}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '16px 24px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white', border: 'none', borderRadius: 14,
            fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(245,158,11,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.3)'; }}
        >
          <HugeiconsIcon icon={Rocket01Icon} size={22} color="white" />
          Activar mi Plan y Hacer Seguimiento
        </button>

        <button
          onClick={handleDownload}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '14px 24px',
            background: '#ffffff',
            color: '#16a34a', border: '2px solid #22c55e', borderRadius: 14,
            fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
        >
          <HugeiconsIcon icon={Download04Icon} size={20} color="#16a34a" />
          Descargar Plan en PDF
        </button>

        <button
          onClick={resetEvaluation}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '12px 24px',
            background: 'transparent',
            color: '#6b7280', border: '1px solid #d1d5db', borderRadius: 14,
            fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={18} color="#6b7280" />
          Realizar nueva evaluación
        </button>
      </motion.div>

      {/* ── Contact Footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{
          textAlign: 'center', padding: '20px 0',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 8 }}>
          <a
            href="https://wa.me/56989639088"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22c55e', textDecoration: 'none', fontSize: '0.8rem' }}
          >
            <WhatsAppIcon className="w-4 h-4" />
            +56 989 63 90 88
          </a>
          <a
            href="https://instagram.com/donde_mi_negro"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e1306c', textDecoration: 'none', fontSize: '0.8rem' }}
          >
            <HugeiconsIcon icon={InstagramIcon} size={16} color="#e1306c" />
            @donde_mi_negro
          </a>
        </div>
        <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: 0 }}>
          © 2026 Bienestar en Claro. Todos los derechos reservados.
        </p>
      </motion.div>
    </div>
  );
}
