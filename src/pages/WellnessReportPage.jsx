import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import {
  ArrowLeft,
  Download,
  Share2,
  Printer,
  Sparkles,
  Calendar,
  User,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAdmin } from '@/context/AdminContext';
import { calculateHealthScores, getTopImpactActions } from '@/services/healthEngine';
import { generateFullReport } from '@/services/AIPersonalizedReport';
import MobileAppShell from '@/components/mobile/MobileAppShell';

const WellnessReportPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [aiText, setAiText] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('wellness_answers');
    if (stored) {
      setAnswers(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!answers) return;

    setLoading(true);
    try {
      const scores = calculateHealthScores(answers);
      setData(scores);

      // Generar IA en paralelo
      generateFullReport(scores, answers).then((ai) => {
        setAiText(ai);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } catch (err) {
      console.error('Error generating scores:', err);
      setLoading(false);
    }
  }, [answers]);

  const handleDownload = useCallback(() => {
    window.print();
    toast({ title: 'Imprimiendo PDF...', description: 'Selecciona "Guardar como PDF" en el diálogo de impresión.' });
  }, []);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Mi Informe de Bienestar en Claro',
      text: `Mi Índice de Bienestar: ${data?.ib}/100`,
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => {});
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Enlace copiado' });
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2>No hay respuestas guardadas</h2>
          <Button onClick={() => navigate('/bienestar')} className="mt-4">
            Ir al cuestionario
          </Button>
        </div>
      </div>
    );
  }

  const areaEntries = Object.entries(data.areas).map(([name, value]) => ({ name, value }));

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 70) return 'bg-emerald-50';
    if (score >= 40) return 'bg-amber-50';
    return 'bg-red-50';
  };

  const getScoreBorder = (score) => {
    if (score >= 70) return 'border-emerald-200';
    if (score >= 40) return 'border-amber-200';
    return 'border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white px-4 py-8 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-light tracking-wide">Bienestar en Claro</h1>
              <p className="text-emerald-200/80 mt-2 text-sm">Informe Personalizado de Salud</p>
              <p className="text-emerald-300/60 mt-1 text-xs">
                {new Date(data.timestamp).toLocaleDateString('es-CL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload} className="text-white border-white/30 hover:bg-white/10">
                <Printer className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="text-white border-white/30 hover:bg-white/10">
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Resumen Ejecutivo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Resumen Ejecutivo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* IB */}
            <div className={`rounded-2xl border ${getScoreBorder(data.ib)} ${getScoreBg(data.ib)} p-6 text-center`}>
              <p className="text-sm text-muted-foreground mb-2">Índice de Bienestar</p>
              <p className={`text-5xl font-bold ${getScoreColor(data.ib)}`}>{data.ib}</p>
              <p className="text-sm text-muted-foreground">/100</p>
            </div>

            {/* Edad cronológica */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Edad Cronológica</p>
              <p className="text-5xl font-bold text-gray-800">{data.age.chronological}</p>
              <p className="text-sm text-muted-foreground">años</p>
            </div>

            {/* Edad biológica */}
            <div className={`rounded-2xl border ${getScoreBorder(data.age.biological)} ${getScoreBg(data.age.biological)} p-6 text-center`}>
              <p className="text-sm text-muted-foreground mb-2">Edad Biológica</p>
              <p className={`text-5xl font-bold ${getScoreColor(data.age.biological)}`}>{data.age.biological}</p>
              <p className="text-sm text-muted-foreground">años</p>
              {data.age.delta > 0 && (
                <p className="text-xs text-red-600 mt-2">+{data.age.delta} años vs cronológica</p>
              )}
              {data.age.delta < 0 && (
                <p className="text-xs text-emerald-600 mt-2">{data.age.delta} años vs cronológica</p>
              )}
            </div>
          </div>

          {/* Fortalezas y Riesgos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-emerald-200 p-5">
              <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Fortalezas
              </h3>
              {data.strengths.map((s, i) => (
                <p key={i} className="text-sm text-muted-foreground mb-1">✓ {s}</p>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-red-200 p-5">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Riesgos principales
              </h3>
              {data.risks.map((r, i) => (
                <p key={i} className="text-sm text-muted-foreground mb-1">⚠ {r}</p>
              ))}
            </div>
          </div>

          {/* Prioridades */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Tres prioridades absolutas</h3>
            {data.priorities.map((p, i) => (
              <p key={i} className="text-sm text-muted-foreground mb-1">
                {i + 1}. {p.label} (score: {p.score}/100)
              </p>
            ))}
          </div>
        </section>

        {/* Top 10 Acciones con mayor impacto */}
        {data && (() => {
          const topActions = getTopImpactActions(answers, data.areas);
          return (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Acciones con Mayor Impacto
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                {topActions.slice(0, 5).map((action, i) => (
                  <div key={i} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
                    <span className="text-2xl font-bold text-emerald-600 w-8">{action.impact}%</span>
                    <div>
                      <p className="font-semibold text-gray-800">{action.action}</p>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Perfil de Salud - Radar */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Perfil de Salud
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ReactECharts
              option={{
                radar: {
                  indicator: areaEntries.map(d => ({ name: d.name, max: 100 })),
                  shape: 'polygon',
                  splitNumber: 5,
                  axisName: { color: '#374151', fontSize: 11 },
                  splitArea: { areaStyle: { color: ['#f0fdf4', '#ffffff'] } },
                  splitLine: { lineStyle: { color: '#e5e7eb' } },
                },
                series: [{
                  type: 'radar',
                  data: [{
                    value: areaEntries.map(d => d.value),
                    name: 'Tu nivel',
                    areaStyle: { color: 'rgba(16, 185, 129, 0.3)' },
                    lineStyle: { color: '#10b981', width: 2 },
                    itemStyle: { color: '#10b981' },
                  }],
                }],
                tooltip: { trigger: 'item' },
              }}
              style={{ width: '100%', height: 400 }}
            />
          </div>
        </section>

        {/* Radiografía Completa - Barras */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Radiografía Completa
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ReactECharts
              option={{
                grid: { left: 120, right: 60, top: 20, bottom: 30 },
                xAxis: { type: 'value', max: 100, axisLabel: { fontSize: 10 } },
                yAxis: {
                  type: 'category',
                  data: areaEntries.map(d => d.name),
                  axisLabel: { fontSize: 10 },
                },
                series: [{
                  type: 'bar',
                  data: areaEntries.map(d => ({
                    value: d.value,
                    itemStyle: {
                      color: d.value >= 70 ? '#10b981' : d.value >= 40 ? '#f59e0b' : '#ef4444',
                    },
                  })),
                  barWidth: 18,
                }],
                tooltip: { trigger: 'axis' },
              }}
              style={{ width: '100%', height: 500 }}
            />
          </div>
        </section>

        {/* Análisis IA */}
        {aiText && (
          <>
            {aiText.nutritionPlan && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-emerald-900 mb-6">Alimentación Personalizada</h2>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{aiText.nutritionPlan}</pre>
                </div>
              </section>
            )}

            {aiText.sleepPlan && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-emerald-900 mb-6">Sueño y Cronotipo</h2>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{aiText.sleepPlan}</pre>
                </div>
              </section>
            )}

            {aiText.activityPlan && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-emerald-900 mb-6">Actividad Física</h2>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{aiText.activityPlan}</pre>
                </div>
              </section>
            )}

            {aiText.actionPlan && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-emerald-900 mb-6">Plan de Acción de 90 Días</h2>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{aiText.actionPlan}</pre>
                </div>
              </section>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div className="text-center text-xs text-muted-foreground mt-12 pb-8">
          Este informe tiene un propósito meramente informativo. No constituye diagnóstico ni tratamiento médico.
          Consulte siempre a un profesional de salud calificado.
        </div>
      </div>
    </div>
  );
};

export default WellnessReportPage;
