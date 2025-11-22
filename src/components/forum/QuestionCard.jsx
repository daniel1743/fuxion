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
      className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-all duration-200"
    >
      <div className="flex gap-4">
        {/* Votación */}
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVote}
            className="p-2 hover:bg-primary/10 hover:text-primary"
          >
            <ThumbsUp className="w-5 h-5" />
          </Button>
          <span className="text-lg font-bold text-foreground">{question.votes}</span>
          <span className="text-xs text-muted-foreground">votos</span>
        </div>

        {/* Contenido */}
        <div className="flex-1 space-y-3">
          {/* Título y Estado */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors flex-1">
              {question.title}
            </h3>
            <div className="flex items-center gap-2">
              {question.solved && (
                <Badge variant="success" className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1 whitespace-nowrap">
                  <CheckCircle2 className="w-3 h-3" />
                  Resuelto
                </Badge>
              )}
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8 p-0"
                  title="Eliminar pregunta"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Descripción */}
          <p className="text-muted-foreground line-clamp-2">{question.content}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {question.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {/* Autor */}
              <div className="flex items-center gap-2">
                <span className="text-lg">{question.authorAvatar}</span>
                <span>{question.author}</span>
                {question.author === 'Fuxion Shop' && <VerifiedBadge size="sm" />}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{question.answers} respuestas</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{question.views} vistas</span>
              </div>
            </div>

            {/* Fecha y Categoría */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {question.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{formatDate(question.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
