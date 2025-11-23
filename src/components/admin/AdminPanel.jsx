import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Upload, Trash2, RefreshCw, CheckCircle2, AlertCircle, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAdmin } from '@/context/AdminContext';
import forumData from '@/data/forum-initial-data.json';
import { fixDuplicateAnswers } from '@/utils/fixDuplicateAnswers';

const AdminPanel = ({ isOpen, onClose }) => {
  const { isAdmin } = useAdmin();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !isAdmin) return null;

  const loadForumData = () => {
    setLoading(true);

    try {
      // Cargar datos del JSON generado
      const { forumQuestions, forumAnswers, forumBotsInitialized } = forumData;

      // Guardar en localStorage
      localStorage.setItem('forumQuestions', JSON.stringify(forumQuestions));
      localStorage.setItem('forumAnswers', JSON.stringify(forumAnswers));
      localStorage.setItem('forumBotsInitialized', forumBotsInitialized);

      toast({
        title: '✅ Datos cargados exitosamente',
        description: `${forumQuestions.length} preguntas y ${Object.values(forumAnswers).flat().length} respuestas han sido cargadas.`,
      });

      // Recargar la página después de 1 segundo
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error cargando datos:', error);
      toast({
        title: '❌ Error al cargar datos',
        description: 'No se pudieron cargar los datos del foro. Verifica la consola.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const clearForumData = () => {
    if (window.confirm('¿Estás seguro de eliminar todos los datos del foro? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('forumQuestions');
      localStorage.removeItem('forumAnswers');
      localStorage.removeItem('forumBotsInitialized');

      toast({
        title: '🗑️ Datos eliminados',
        description: 'Todos los datos del foro han sido eliminados.',
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const getForumStats = () => {
    const questions = JSON.parse(localStorage.getItem('forumQuestions') || '[]');
    const answers = JSON.parse(localStorage.getItem('forumAnswers') || '{}');
    const totalAnswers = Object.values(answers).flat().length;

    return { questions: questions.length, answers: totalAnswers };
  };

  const handleFixDuplicates = () => {
    setLoading(true);
    try {
      const result = fixDuplicateAnswers();
      
      if (result.error) {
        toast({
          title: '❌ Error al corregir',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result.fixed > 0) {
        toast({
          title: '✅ Respuestas corregidas',
          description: `Se corrigieron ${result.fixed} respuestas duplicadas con variaciones únicas.`,
        });
        
        // Recargar la página después de 1.5 segundos
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast({
          title: '✅ Todo está bien',
          description: 'No se encontraron respuestas duplicadas para corregir.',
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al corregir duplicados:', error);
      toast({
        title: '❌ Error',
        description: 'No se pudieron corregir las respuestas duplicadas.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const stats = getForumStats();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full p-6 md:p-8"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Database className="w-7 h-7 text-primary" />
            Panel de Administración
          </h2>
          <p className="text-muted-foreground">
            Gestiona los datos del foro
          </p>
        </div>

        {/* Current Stats */}
        <div className="bg-background/50 border border-border rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">ESTADO ACTUAL DEL FORO</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Preguntas</p>
              <p className="text-2xl font-bold text-foreground">{stats.questions}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Respuestas</p>
              <p className="text-2xl font-bold text-foreground">{stats.answers}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* Load Forum Data */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <Upload className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Cargar Datos Iniciales</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Carga 15 preguntas y 33 respuestas generadas de la base de datos FAQ de Fuxion
                </p>
                <Button
                  onClick={loadForumData}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Cargar Datos del Foro
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Fix Duplicate Answers */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Wand2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Corregir Respuestas Duplicadas</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Reemplaza respuestas similares o duplicadas con variaciones únicas según personalidades de bots
                </p>
                <Button
                  onClick={handleFixDuplicates}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Corrigiendo...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Corregir Duplicados
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Clear Forum Data */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Limpiar Todo el Foro</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Elimina todas las preguntas y respuestas del foro (no se puede deshacer)
                </p>
                <Button
                  onClick={clearForumData}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpiar Foro
                </Button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  <strong className="text-foreground">Nota:</strong> Al cargar los datos, se sobrescribirán los datos actuales del foro.
                </p>
                <p>
                  Los datos son generados a partir de la base de datos FAQ y simulan un foro con actividad realista de las últimas 3 semanas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-6 border-t border-border">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Cerrar Panel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
