import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Eye, CheckCircle2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useForumContext } from '@/context/ForumContext';
import { useAdmin } from '@/context/AdminContext';
import VerifiedBadge from './VerifiedBadge';

const QuestionCard = ({ question, onClick }) => {
  const { voteQuestion, deleteQuestion } = useForumContext();
  const { isAdmin } = useAdmin();

  const handleVote = (e) => {
    e.stopPropagation();
    voteQuestion(question.id, 1);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar esta pregunta? Esta acción no se puede deshacer.')) {
      deleteQuestion(question.id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-3 sm:p-4 md:p-6 cursor-pointer hover:border-primary/50 transition-all duration-200 w-full overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
        {/* Votación */}
        <div className="flex sm:flex-col items-center sm:items-start gap-2 justify-start flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVote}
            className="p-1.5 sm:p-2 hover:bg-primary/10 hover:text-primary"
          >
            <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <span className="text-base sm:text-lg font-bold text-foreground">{question.votes}</span>
          <span className="text-xs text-muted-foreground">votos</span>
        </div>

        {/* Contenido */}
        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0 overflow-hidden">
          {/* Título y Estado */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-colors flex-1 min-w-0 break-words overflow-hidden">
              {question.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {question.solved && (
                <Badge variant="success" className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1 whitespace-nowrap text-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Resuelto</span>
                  <span className="sm:hidden">✓</span>
                </Badge>
              )}
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-7 w-7 sm:h-8 sm:w-8 p-0"
                  title="Eliminar pregunta"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Descripción */}
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 break-words overflow-hidden">{question.content}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {question.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pt-2 overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground min-w-0">
              {/* Autor */}
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="text-base sm:text-lg flex-shrink-0">{question.authorAvatar}</span>
                <span className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{question.author}</span>
                {question.author === 'Fuxion Shop' && <VerifiedBadge size="sm" />}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">{question.answers} resp.</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">{question.views}</span>
              </div>
            </div>

            {/* Fecha y Categoría */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {question.category}
              </Badge>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(question.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
