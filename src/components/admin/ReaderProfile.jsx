import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, X, BarChart3, Target, BookOpen, MessageCircle,
  TrendingUp, AlertTriangle, Clock, Eye, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { calculateReaderScore, calculateLeadScore, analyzeSession } from '@/services/readerAnalytics';

const ReaderProfile = ({ session, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const readerScore = calculateReaderScore(session);
  const leadScore = calculateLeadScore(session);

  useEffect(() => {
    const runAnalysis = async () => {
      setLoading(true);
      try {
        const result = await analyzeSession(session, process.env.DEEPSEEK_API_KEY);
        setAnalysis(result);
      } catch (err) {
        console.warn('Error en análisis:', err);
      } finally {
        setLoading(false);
      }
    };
    runAnalysis();
  }, [session]);

  if (!session) return null;

  const articleOpens = session.filter(e => e.event_type === 'article_open');
  const paragraphs = session.filter(e => e.event_type === 'time_on_paragraph');
  const scrolls = session.filter(e => e.event_type === 'scroll_depth');
  const maxScroll = Math.max(...scrolls.map(e => e.payload?.depth ?? 0), 0);
  const totalTime = paragraphs.reduce((sum, e) => sum + (e.payload?.seconds ?? 0), 0);

  const behaviorLabels = {
    comprometido: { emoji: '🧠', label: 'Lector Comprometido', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    escaneó: { emoji: '👀', label: 'Escaneó Contenido', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    información_rápida: { emoji: '⚡', label: 'Búsqueda Rápida', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    comparó: { emoji: '⚖️', label: 'Comparó Fuentes', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    interesado: { emoji: '🤔', label: 'Interesado', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    abandonó: { emoji: '🚪', label: 'Abandonó', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  };

  const behavior = behaviorLabels[analysis?.behavior_type] || behaviorLabels.interesado;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-t-2xl shadow-xl max-h-[85vh] overflow-y-auto"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`inline-flex p-2 rounded-lg ${behavior.color}`}>
              <span className="text-lg">{behavior.emoji}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Perfil del Lector</h2>
              <Badge className={behavior.color} variant="outline">{behavior.label}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-emerald-500" />
                <h3 className="font-semibold text-sm">Reader Score</h3>
              </div>
              <div className="text-3xl font-bold text-emerald-500">{readerScore.score}<span className="text-base text-muted-foreground">/100</span></div>
              <div className="text-xs text-muted-foreground mt-1">Compromiso del lector</div>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-sm">Lead Score</h3>
              </div>
              <div className="text-3xl font-bold text-amber-500">{leadScore.score}<span className="text-base text-muted-foreground">/100</span></div>
              <div className="text-xs text-muted-foreground mt-1">Interés comercial</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-semibold">{articleOpens.length}</div>
                <div className="text-xs text-muted-foreground">Artículos</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-semibold">{Math.round(totalTime / 60)}m</div>
                <div className="text-xs text-muted-foreground">Tiempo leyendo</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-semibold">{maxScroll}%</div>
                <div className="text-xs text-muted-foreground">Scroll máximo</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-semibold">{session.filter(e => e.event_type === 'chat_open').length}</div>
                <div className="text-xs text-muted-foreground">Chats</div>
              </div>
            </div>
          </div>

          {/* Articles Read */}
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Artículos leídos
            </h3>
            <div className="space-y-2">
              {articleOpens.map((e, i) => (
                <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm">{e.payload?.article_slug || '—'}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{new Date(e.timestamp).toLocaleTimeString('es-CL')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Desglose del Score</h3>
            <div className="space-y-2">
              {readerScore.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.event}</span>
                  <span className="font-semibold text-emerald-500">+{item.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* IA Analysis */}
          {loading && <div className="flex items-center justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>}
          {analysis && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Análisis IA
              </h3>
              <p className="text-sm text-muted-foreground">{analysis.conclusion || 'Sin análisis disponible'}</p>
              {analysis.recommendation && (
                <p className="text-sm text-emerald-600 mt-2">💡 {analysis.recommendation}</p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-xs text-muted-foreground text-center pt-2">
            Sesión: {session[0]?.timestamp ? new Date(session[0].timestamp).toLocaleString('es-CL') : '—'}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReaderProfile;
