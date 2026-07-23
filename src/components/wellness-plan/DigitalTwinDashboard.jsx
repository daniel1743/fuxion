import React, { Suspense, lazy, useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { generatePremiumReportContent } from '@/lib/engine/AiReportGenerator';
import { motion } from 'framer-motion';
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
import GemeloLetter from './GemeloLetter';
import EvaluationHistory from './EvaluationHistory';
import PremiumReportTemplate from './PremiumReportTemplate';

const ReactECharts = lazy(() => import('echarts-for-react'));
const REPORT_MARKDOWN_VERSION = 'executive-fallback-v3';
const PRINT_PAGE_STYLE = `
  @page {
    size: A4 portrait;
    margin: 0;
  }

  html, body {
    background: #ffffff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .premium-report-print,
  .premium-report-print * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .premium-report-print .avoid-page-break,
  .premium-report-print .print-chart,
  .premium-report-print blockquote,
  .premium-report-print table,
  .premium-report-print img {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .premium-report-print .print-page {
    break-inside: auto;
    page-break-inside: auto;
  }

  .premium-report-print .print-page-after {
    break-after: page;
    page-break-after: always;
  }

  .premium-report-print .roadmap-block {
    break-inside: auto;
    page-break-inside: auto;
  }

  .premium-report-print .roadmap-row,
  .premium-report-print .recommendation-block,
  .premium-report-print .metric-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .premium-report-print .markdown-section-heading {
    break-after: avoid;
    page-break-after: avoid;
  }

  .premium-report-print .premium-markdown-content {
    break-before: auto;
    page-break-before: auto;
  }

  .premium-report-print a {
    color: #0f766e !important;
    text-decoration: underline !important;
  }
`;

const DOMAIN_CONFIG = {
  nutrition:  { label: 'Nutrición e Hidratación', icon: Leaf01Icon, color: '#22c55e' },
  activity:   { label: 'Actividad Física',        icon: EnergyIcon, color: '#3b82f6' },
  sleep:      { label: 'Calidad del Sueño',        icon: StarIcon,    color: '#8b5cf6' },
  mental:     { label: 'Salud Mental y Estrés',    icon: HelpCircleIcon,   color: '#ec4899' },
  biometry:   { label: 'Biometría y Riesgo',       icon: Target01Icon, color: '#f59e0b' },
  digestion:  { label: 'Salud Digestiva',          icon: Shield01Icon,  color: '#14b8a6' },
  habits:     { label: 'Hábitos y Prevención',     icon: Rocket01Icon,    color: '#6366f1' },
};

const GOAL_DISPLAY_LABELS = {
  lose: 'control de peso',
  gain: 'ganancia muscular',
  energy: 'energia y vitalidad',
  digestion: 'salud digestiva',
  stress: 'estres y descanso',
  maintain: 'mantener y optimizar salud',
  general: 'bienestar general',
};

function getGoalDisplayLabel(twinData) {
  const profile = twinData?.behavior_profile || {};
  const rawAnswers = twinData?.raw_answers || {};
  const candidate = profile.goal_label || profile.goal || rawAnswers.goal;
  return GOAL_DISPLAY_LABELS[candidate] || candidate || 'bienestar general';
}

function getSafeReportName(userData, twinData, answers) {
  const rawName = userData?.name || answers?.name || twinData?.raw_answers?.name || 'Usuario';
  const safeName = String(rawName).trim().replace(/\s+/g, '_') || 'Usuario';
  return `Plan_Bienestar_${safeName}`;
}

async function waitForReportAssets(container) {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const images = Array.from(container?.querySelectorAll('img') || []);
  await Promise.all(images.map(async (image) => {
    if (image.complete && image.naturalWidth > 0) return;
    if (typeof image.decode === 'function') {
      try {
        await image.decode();
        return;
      } catch (_) {
        // Continue with load fallback.
      }
    }
    await new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  }));

  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function buildPrintableReportHtml(reportNode) {
  const headAssets = Array.from(document.head.querySelectorAll('style, link[rel="stylesheet"], link[rel="preconnect"], link[rel="preload"]'))
    .map((node) => node.outerHTML)
    .join('\n');

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base href="${window.location.origin}/" />
    ${headAssets}
    <style>
      ${PRINT_PAGE_STYLE}
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }
      body {
        font-family: Inter, system-ui, sans-serif;
      }
      .premium-report-print {
        margin: 0 auto !important;
      }
    </style>
  </head>
  <body>
    ${reportNode.outerHTML}
  </body>
</html>`;
}

async function downloadPdfFromServer(reportNode, filename) {
  const html = buildPrintableReportHtml(reportNode);
  const startedAt = performance.now();

  console.info('[report-pdf] Solicitando PDF limpio al backend', {
    htmlChars: html.length,
    filename,
  });

  const response = await fetch('/api/render-report-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      html,
      filename: `${filename}.pdf`,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PDF backend ${response.status}: ${text}`);
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = `${filename}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(blobUrl);

  console.info('[report-pdf] PDF limpio descargado', {
    elapsedMs: Math.round(performance.now() - startedAt),
    bytes: blob.size,
  });
}

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
      <Suspense fallback={<div style={{ height: '100%', borderRadius: 16, background: '#f8fafc' }} />}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </Suspense>
    </div>
  );
}

function AdaptiveSummary({ analysis }) {
  if (!analysis) return null;

  const completeness = analysis.data_completeness;
  const insights = analysis.domain_insights;
  const risks = analysis.risk_flags || [];
  const levers = analysis.adaptive_levers || [];
  const primaryFocus = analysis.primary_focus;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75, duration: 0.5 }}
      style={{
        background: 'white',
        borderRadius: 20,
        padding: '22px 20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        marginBottom: 32,
        border: '1px solid #ecfdf5',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: '#ecfdf5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <HugeiconsIcon icon={InformationCircleIcon} size={22} color="#059669" />
        </div>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: '#064e3b' }}>
            Lectura adaptativa del estudio
          </h3>
          <p style={{ margin: 0, color: '#4b5563', fontSize: '0.84rem', lineHeight: 1.5 }}>
            El motor cruzo tus respuestas, el objetivo declarado y los dominios mas sensibles para ordenar el plan por impacto real.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 10,
        marginBottom: 16,
      }}>
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12 }}>
          <span style={{ display: 'block', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Confianza
          </span>
          <strong style={{ display: 'block', color: '#0f172a', fontSize: '1.1rem', marginTop: 4 }}>
            {completeness?.confidence || 'media'} · {completeness?.score || 0}%
          </strong>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12 }}>
          <span style={{ display: 'block', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Foco primario
          </span>
          <strong style={{ display: 'block', color: '#0f172a', fontSize: '1.1rem', marginTop: 4 }}>
            {primaryFocus?.label || 'Bienestar integral'}
          </strong>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12 }}>
          <span style={{ display: 'block', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Perfil
          </span>
          <strong style={{ display: 'block', color: '#0f172a', fontSize: '1.1rem', marginTop: 4 }}>
            {insights?.pattern === 'perfil_desbalanceado' ? 'Desbalanceado' : insights?.pattern === 'perfil_solido' ? 'Solido' : 'En construccion'}
          </strong>
        </div>
      </div>

      {levers.length > 0 && (
        <div style={{ marginBottom: risks.length ? 16 : 0 }}>
          <h4 style={{ margin: '0 0 10px', color: '#334155', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
            Palancas de mayor impacto
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {levers.map((lever) => (
              <div key={lever.domain} style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 12,
                background: '#f9fafb',
                border: '1px solid #eef2f7',
              }}>
                <span style={{ color: '#374151', fontSize: '0.84rem', fontWeight: 700 }}>
                  {lever.label}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'right' }}>
                  {lever.current} → {lever.target}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {risks.length > 0 && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 12,
          padding: '12px 14px',
        }}>
          <strong style={{ display: 'block', color: '#92400e', fontSize: '0.82rem', marginBottom: 4 }}>
            Senal que requiere prioridad
          </strong>
          <p style={{ margin: 0, color: '#92400e', fontSize: '0.8rem', lineHeight: 1.5 }}>
            {risks[0].title}: {risks[0].message}
          </p>
        </div>
      )}
    </motion.section>
  );
}

function ExecutiveSnapshot({ userData, biometrics, iib, analysis, goalLabel }) {
  const bmiLabel = biometrics?.bmiClass?.label || classifyBMI(biometrics?.bmi).label;
  const focus = analysis?.primary_focus?.label || 'Bienestar integral';
  const weakest = analysis?.domain_insights?.weakest || [];
  const strongest = analysis?.domain_insights?.strongest || [];
  const goal = goalLabel || 'bienestar general';

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.55 }}
      style={{
        background: 'linear-gradient(135deg, #052e2b, #0f766e)',
        color: 'white',
        borderRadius: 20,
        padding: '24px 22px',
        marginBottom: 24,
        boxShadow: '0 18px 50px rgba(15,118,110,0.22)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 18,
        alignItems: 'center',
      }}>
        <div style={{ minWidth: 0 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.12)',
            color: '#ccfbf1',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
          }}>
            Estudio ejecutivo
          </span>
          <h3 style={{
            margin: '14px 0 8px',
            fontSize: '1.35rem',
            lineHeight: 1.15,
            fontWeight: 800,
            color: 'white',
          }}>
            {userData?.name ? `${userData.name}, tu plan empieza por ${focus.toLowerCase()}` : `Tu plan empieza por ${focus.toLowerCase()}`}
          </h3>
          <p style={{ margin: 0, color: '#d1fae5', fontSize: '0.9rem', lineHeight: 1.55 }}>
            Objetivo: {goal}. El tablero prioriza los cambios que tienen mejor relacion entre impacto, urgencia y facilidad de ejecucion.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 10,
        }}>
          {[
            { label: 'IIB', value: `${iib.score}/100` },
            { label: 'IMC', value: biometrics?.bmi ? `${biometrics.bmi}` : '--' },
            { label: 'Rango', value: bmiLabel },
            { label: 'Confianza', value: `${analysis?.data_completeness?.score || 0}%` },
          ].map((item) => (
            <div key={item.label} style={{
              minHeight: 74,
              borderRadius: 14,
              padding: 12,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}>
              <span style={{ display: 'block', color: '#99f6e4', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>
                {item.label}
              </span>
              <strong style={{ display: 'block', color: 'white', fontSize: '1rem', marginTop: 6, lineHeight: 1.2 }}>
                {item.value}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {(weakest.length > 0 || strongest.length > 0) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 10,
          marginTop: 18,
        }}>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: 12 }}>
            <span style={{ color: '#99f6e4', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Mayor oportunidad
            </span>
            <p style={{ margin: '5px 0 0', color: 'white', fontSize: '0.88rem', lineHeight: 1.4 }}>
              {weakest.map((item) => `${item.label} ${item.score}/100`).join(' · ')}
            </p>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: 12 }}>
            <span style={{ color: '#99f6e4', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Base fuerte
            </span>
            <p style={{ margin: '5px 0 0', color: 'white', fontSize: '0.88rem', lineHeight: 1.4 }}>
              {strongest.map((item) => `${item.label} ${item.score}/100`).join(' · ')}
            </p>
          </div>
        </div>
      )}
    </motion.section>
  );
}

function RecommendationImpactChart({ recommendations }) {
  if (!recommendations?.length) return null;

  const chartData = recommendations.map((rec, index) => ({
    name: `Paso ${index + 1}`,
    action: rec.action,
    value: rec.finalScore || rec.priority || 70,
    impact: rec.expected_impact || 'medio',
  }));

  const option = {
    grid: { left: 8, right: 8, top: 12, bottom: 20, containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const item = params?.[0]?.data;
        return item ? `<strong>${item.name}</strong><br/>Prioridad: ${item.value}/100<br/>Impacto: ${item.impact}` : '';
      },
    },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: { color: '#64748b', fontSize: 11 },
      splitLine: { lineStyle: { color: '#eef2f7' } },
    },
    yAxis: {
      type: 'category',
      data: chartData.map((item) => item.name),
      axisLabel: { color: '#334155', fontSize: 12, fontWeight: 700 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [{
      type: 'bar',
      data: chartData,
      barWidth: 18,
      itemStyle: {
        borderRadius: [0, 8, 8, 0],
        color: '#0f766e',
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{c}',
        color: '#0f172a',
        fontWeight: 800,
      },
    }],
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.35, duration: 0.5 }}
      style={{
        background: 'white',
        borderRadius: 20,
        padding: '22px 20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        marginBottom: 24,
      }}
    >
      <h3 style={{
        margin: '0 0 6px',
        color: '#0f172a',
        fontSize: '1rem',
        fontWeight: 800,
      }}>
        Mapa de impacto
      </h3>
      <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5 }}>
        Cada barra muestra la fuerza relativa de la recomendacion dentro de tu perfil actual.
      </p>
      <div style={{ height: 220, width: '100%' }}>
        <Suspense fallback={<div style={{ height: '100%', borderRadius: 16, background: '#f8fafc' }} />}>
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
        </Suspense>
      </div>
    </motion.section>
  );
}

function ThirtyDayRoadmap({ recommendations, analysis }) {
  if (!recommendations?.length) return null;

  const focus = analysis?.primary_focus?.label || 'tu foco principal';
  const roadmap = [
    {
      range: 'Dias 1-7',
      title: 'Estabilizar',
      detail: recommendations[0]?.action || `Ajustar ${focus.toLowerCase()}`,
    },
    {
      range: 'Dias 8-21',
      title: 'Consolidar',
      detail: recommendations[1]?.action || 'Convertir el habito principal en rutina diaria',
    },
    {
      range: 'Dias 22-30',
      title: 'Medir',
      detail: recommendations[2]?.action || 'Revisar energia, digestion, sueno y adherencia',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.55, duration: 0.5 }}
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 20,
        padding: '22px 20px',
        marginBottom: 24,
      }}
    >
      <h3 style={{ margin: '0 0 14px', color: '#0f172a', fontSize: '1rem', fontWeight: 800 }}>
        Roadmap de 30 dias
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
        {roadmap.map((item, index) => (
          <div key={item.range} style={{
            background: 'white',
            borderRadius: 14,
            padding: 14,
            border: '1px solid #e5e7eb',
            minHeight: 142,
          }}>
            <span style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              background: index === 0 ? '#0f766e' : '#e0f2fe',
              color: index === 0 ? 'white' : '#0369a1',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.82rem',
              marginBottom: 10,
            }}>
              {index + 1}
            </span>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
              {item.range}
            </p>
            <strong style={{ display: 'block', marginTop: 4, color: '#0f172a', fontSize: '0.95rem' }}>
              {item.title}
            </strong>
            <p style={{ margin: '8px 0 0', color: '#475569', fontSize: '0.8rem', lineHeight: 1.45 }}>
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
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
        {rec.severity && (
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
            Prioridad {rec.severity}
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
      {rec.personalization_note && (
        <p style={{ margin: '10px 0 0', color: '#64748b', fontSize: '0.78rem', lineHeight: 1.45 }}>
          {rec.personalization_note}
        </p>
      )}
    </motion.div>
  );
}

// ── Dashboard Principal ───────────────────────────────────────

export default function DigitalTwinDashboard() {
  const { twinData, userData, answers, resetEvaluation, activateUserPlan } = useWellnessTwin();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const printableReportRef = useRef(null);

  const level = useMemo(
    () => twinData ? classifyIIBLevel(twinData.twin_state.iib.score) : null,
    [twinData]
  );

  if (!twinData) return null;

  const { twin_state, recommendations } = twinData;
  const { iib, biometrics } = twin_state;
  const activeDomains = iib?.domains || twin_state?.domains || {};
  const adaptiveAnalysis = twin_state?.adaptive_analysis;
  const goalLabel = getGoalDisplayLabel(twinData);
  const { tdee, protein, waterL, bmi, bmiClass } = biometrics;
  const reportSourceLabel = twinData.ai_report_source
    ? String(twinData.ai_report_source).toUpperCase()
    : 'PENDIENTE';

  const handlePrintReport = useReactToPrint({
    contentRef: printableReportRef,
    documentTitle: getSafeReportName(userData, twinData, answers),
    pageStyle: PRINT_PAGE_STYLE,
    onBeforePrint: async () => {
      await waitForReportAssets(printableReportRef.current);
    },
    onAfterPrint: () => {
      setIsGeneratingPDF(false);
      console.info('[report-print] Dialogo de impresion cerrado');
    },
    onPrintError: (location, error) => {
      setIsGeneratingPDF(false);
      console.error('[report-print] Error de impresion', {
        location,
        error: error.message,
        stack: error.stack,
      });
      alert(`Hubo un error al abrir la impresión: ${error.message}`);
    },
  });

  const handleDownload = async () => {
    if (!twinData || !userData) return;

    const downloadStartedAt = performance.now();
    console.info('[report-download] Inicio', {
      hasCachedMarkdown: Boolean(twinData.ai_report_markdown),
      cacheVersion: twinData.ai_report_version || null,
      userName: userData?.name || answers?.name || twinData?.raw_answers?.name || null,
    });

    setIsGeneratingPDF(true);
    try {
      const reportUserData = {
        ...(twinData.raw_answers || {}),
        ...(answers || {}),
        ...(userData || {}),
      };
      let markdown = twinData.ai_report_version === REPORT_MARKDOWN_VERSION
        ? twinData.ai_report_markdown
        : null;

      if (!markdown) {
        const generationStartedAt = performance.now();
        markdown = await generatePremiumReportContent(reportUserData, twinData);
        twinData.ai_report_markdown = markdown;
        twinData.ai_report_version = REPORT_MARKDOWN_VERSION;
        console.info('[report-download] Markdown generado', {
          elapsedMs: Math.round(performance.now() - generationStartedAt),
          markdownChars: markdown.length,
        });
      } else {
        twinData.ai_report_source = twinData.ai_report_source || 'cache';
        console.info('[report-download] Usando markdown cacheado', {
          markdownChars: markdown.length,
          source: twinData.ai_report_source,
        });
      }

      setGeneratedMarkdown(markdown);
      await new Promise((resolve) => setTimeout(resolve, 350));
      await waitForReportAssets(printableReportRef.current);

      try {
        await downloadPdfFromServer(
          printableReportRef.current,
          getSafeReportName(reportUserData, twinData, answers)
        );
        setIsGeneratingPDF(false);
        return;
      } catch (pdfError) {
        console.warn('[report-pdf] Backend PDF fallo, usando impresion del navegador', {
          elapsedMs: Math.round(performance.now() - downloadStartedAt),
          error: pdfError.message,
        });
      }

      console.info('[report-print] Abriendo dialogo de impresion', {
        totalElapsedMs: Math.round(performance.now() - downloadStartedAt),
        markdownChars: markdown.length,
        reason: 'server_pdf_fallback',
      });
      handlePrintReport();
    } catch (err) {
      console.error('[report-download] Error al generar informe', {
        elapsedMs: Math.round(performance.now() - downloadStartedAt),
        error: err.message,
        stack: err.stack,
      });
      alert("Hubo un error al generar tu informe: " + err.message);
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      {/* ── Overlay de Carga ── */}
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
            Preparando tu informe...
          </h2>
          <p style={{ color: '#6b7280' }}>Esto tomará unos segundos.</p>
          {import.meta.env.DEV && (
            <p style={{
              marginTop: 10,
              color: '#64748b',
              fontSize: '0.78rem',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}>
              DEV · Fuente narrativa: {reportSourceLabel}
            </p>
          )}
        </div>
      )}

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-10000px',
          top: 0,
          width: 794,
          pointerEvents: 'none',
          opacity: 0,
          zIndex: -1,
        }}
      >
        {generatedMarkdown && (
          <PremiumReportTemplate
            ref={printableReportRef}
            markdownContent={generatedMarkdown}
            userData={{ ...(twinData.raw_answers || {}), ...(answers || {}), ...(userData || {}) }}
            twinData={twinData}
          />
        )}
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

      {/* ── Carta del Gemelo Digital (primero, antes de cualquier métrica) ── */}
      <GemeloLetter twinData={twinData} answers={answers} />

      <ExecutiveSnapshot
        userData={userData}
        biometrics={biometrics}
        iib={iib}
        analysis={adaptiveAnalysis}
        goalLabel={goalLabel}
      />

      <AdaptiveSummary analysis={adaptiveAnalysis} />

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

      <RecommendationImpactChart recommendations={recommendations} />

      <ThirtyDayRoadmap recommendations={recommendations} analysis={adaptiveAnalysis} />

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
          Descargar Informe (.md)
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

      {/* ── Historial de evaluaciones ── */}
      <EvaluationHistory />

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
