import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, BookOpen, MessageCircle,
  AlertTriangle, Activity, ChevronDown, ChevronUp, X,
  Calendar, Clock, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/context/AdminContext';
import { getDailySummary } from '@/services/readerAnalytics';

const ReaderAnalyticsPanel = ({ isOpen, onClose }) => {
  const { isAdmin } = useAdmin();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedAlert, setExpandedAlert] = useState(null);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const data = await getDailySummary(new Date().toISOString().split('T')[0]);
      setSummary(data);
    } catch (err) {
      console.warn('No se pudo cargar resumen:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadSummary();
  }, [isOpen]);

  if (!isOpen) return null;

  const metrics = [
    {
      icon: Users,
      label: 'Lectores únicos',
      value: summary?.totalReaders ?? '—',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: BookOpen,
      label: 'Artículos leídos',
      value: summary?.totalArticlesRead ?? '—',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: MessageCircle,
      label: 'Chats abiertos',
      value: summary?.chatsOpened ?? '—',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Target,
      label: 'Alto interés',
      value: summary?.highInterest ?? '—',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <AnimatePresence>
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
              <Activity className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold">Reader Analytics</h2>
              <Badge variant="outline" className="text-xs">Hoy</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : !summary ? (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Sin datos aún</p>
              </div>
            ) : (
              <>
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {metrics.map((m) => (
                    <div key={m.label} className="bg-muted/50 rounded-xl p-4">
                      <div className={`inline-flex p-2 rounded-lg ${m.bg} mb-2`}>
                        <m.icon className={`w-4 h-4 ${m.color}`} />
                      </div>
                      <div className="text-2xl font-bold">{m.value}</div>
                      <div className="text-xs text-muted-foreground">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Best Article */}
                {summary.bestArticle && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <h3 className="font-semibold text-sm">Artículo más leído</h3>
                    </div>
                    <p className="text-sm font-medium">{summary.bestArticle.slug}</p>
                    <p className="text-xs text-muted-foreground mt-1">{summary.bestArticle.count} lecturas hoy</p>
                  </div>
                )}

                {/* Worst Retention */}
                {summary.worstRetention && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <h3 className="font-semibold text-sm">Mayor abandono</h3>
                    </div>
                    <p className="text-sm font-medium">{summary.worstRetention.slug}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Retención promedio: {summary.worstRetention.retention}%
                    </p>
                  </div>
                )}

                {/* Avg Reader Score */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold text-sm">Reader Score promedio</h3>
                  </div>
                  <div className="text-2xl font-bold text-blue-500">{summary.avgReaderScore}/100</div>
                </div>

                {/* Summary */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date().toLocaleDateString('es-CL')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date().toLocaleTimeString('es-CL')}
                  </span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReaderAnalyticsPanel;
