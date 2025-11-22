import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, CheckCircle2, Send, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useForumContext } from '@/context/ForumContext';
import { useAdmin } from '@/context/AdminContext';
import { toast } from '@/components/ui/use-toast';
import VerifiedBadge from './VerifiedBadge';

const QuestionDetail = ({ questionId, onClose }) => {
  const {
    getQuestionById,
    getAnswersByQuestionId,
    addAnswer,
    voteQuestion,
    voteAnswer,
    acceptAnswer,
    incrementViews,
    deleteAnswer,
  } = useForumContext();

  const { isAdmin } = useAdmin();

  const question = getQuestionById(questionId);
  const answers = getAnswersByQuestionId(questionId);

  const [newAnswer, setNewAnswer] = useState({
    author: '',
    authorAvatar: '👤',
    content: '',
  });
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const avatars = ['👤', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓', '🚀'];

  useEffect(() => {
    if (question) {
      incrementViews(questionId);
    }
  }, [questionId]);

  if (!question) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Pregunta no encontrada</p>
      </div>
    );
  }

  const handleSubmitAnswer = (e) => {
    e.preventDefault();

    if (!newAnswer.author || !newAnswer.content) {
      toast({
        title: '⚠️ Campos incompletos',
        description: 'Por favor completa todos los campos.',
        variant: 'destructive',
      });
      return;
    }

    // Si es admin, auto-asignar perfil de Fuxion Shop
    const answerData = isAdmin
      ? {
          ...newAnswer,
          author: 'Fuxion Shop',
          authorAvatar: '✅'
        }
      : newAnswer;

    addAnswer(questionId, answerData);
    toast({
      title: '✅ Respuesta publicada',
      description: 'Tu respuesta ha sido agregada.',
    });
    setNewAnswer({ author: '', authorAvatar: '👤', content: '' });
    setShowAnswerForm(false);
  };

  const handleVoteQuestion = (increment) => {
    voteQuestion(questionId, increment);
  };

  const handleVoteAnswer = (answerId, increment) => {
    voteAnswer(questionId, answerId, increment);
  };

  const handleAcceptAnswer = (answerId) => {
    acceptAnswer(questionId, answerId);
    toast({
      title: '✅ Respuesta marcada como solución',
      description: 'Has marcado esta respuesta como la solución correcta.',
    });
  };

  const handleDeleteAnswer = (answerId) => {
    if (window.confirm('¿Estás seguro de eliminar esta respuesta? Esta acción no se puede deshacer.')) {
      deleteAnswer(questionId, answerId);
      toast({
        title: '🗑️ Respuesta eliminada',
        description: 'La respuesta ha sido eliminada correctamente.',
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    return b.votes - a.votes;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen p-4 md:p-8">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-4xl mx-auto bg-card border border-border rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-background/50 border-b border-border p-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onClose} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver al foro
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Question */}
          <div className="p-6 md:p-8 border-b border-border">
            <div className="flex gap-6">
              {/* Voting */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoteQuestion(1)}
                  className="p-2 hover:bg-primary/10 hover:text-primary"
                >
                  <ThumbsUp className="w-5 h-5" />
                </Button>
                <span className="text-2xl font-bold text-foreground">{question.votes}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoteQuestion(-1)}
                  className="p-2 hover:bg-destructive/10 hover:text-destructive"
                >
                  <ThumbsDown className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{question.title}</h1>
                  {question.solved && (
                    <Badge variant="success" className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1 whitespace-nowrap">
                      <CheckCircle2 className="w-4 h-4" />
                      Resuelto
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{question.authorAvatar}</span>
                    <span className="font-medium text-foreground">{question.author}</span>
                  </div>
                  <span>•</span>
                  <span>{formatDate(question.createdAt)}</span>
                  <span>•</span>
                  <Badge variant="secondary">{question.category}</Badge>
                </div>

                <p className="text-foreground text-lg leading-relaxed">{question.content}</p>

                {question.tags && question.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {question.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Answers */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {answers.length} {answers.length === 1 ? 'Respuesta' : 'Respuestas'}
              </h2>
              <Button onClick={() => setShowAnswerForm(!showAnswerForm)} size="sm">
                {showAnswerForm ? 'Cancelar' : 'Responder'}
              </Button>
            </div>

            {/* Answer Form */}
            {showAnswerForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmitAnswer}
                className="bg-background/50 border border-border rounded-lg p-6 mb-6 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="answer-author">Tu Nombre *</Label>
                    <Input
                      id="answer-author"
                      value={isAdmin ? 'Fuxion Shop' : newAnswer.author}
                      onChange={(e) => setNewAnswer({ ...newAnswer, author: e.target.value })}
                      placeholder="Tu nombre"
                      disabled={isAdmin}
                      required
                      className={isAdmin ? 'bg-primary/10 border-primary/50' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Avatar</Label>
                    {isAdmin ? (
                      <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/50 rounded-lg">
                        <span className="text-2xl">✅</span>
                        <span className="text-sm text-muted-foreground">Cuenta Verificada</span>
                      </div>
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        {avatars.map((avatar) => (
                          <button
                            key={avatar}
                            type="button"
                            onClick={() => setNewAnswer({ ...newAnswer, authorAvatar: avatar })}
                            className={`text-xl p-2 rounded-lg border transition-all ${
                              newAnswer.authorAvatar === avatar
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answer-content">Tu Respuesta *</Label>
                  <Textarea
                    id="answer-content"
                    value={newAnswer.content}
                    onChange={(e) => setNewAnswer({ ...newAnswer, content: e.target.value })}
                    placeholder="Escribe tu respuesta aquí..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Publicar Respuesta
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Answer List */}
            <div className="space-y-4">
              {sortedAnswers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Aún no hay respuestas. ¡Sé el primero en responder!</p>
                </div>
              ) : (
                sortedAnswers.map((answer) => (
                  <motion.div
                    key={answer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-background/50 border rounded-lg p-6 ${
                      answer.isAccepted ? 'border-green-500/30 bg-green-500/5' : 'border-border'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Voting */}
                      <div className="flex flex-col items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVoteAnswer(answer.id, 1)}
                          className="p-2 hover:bg-primary/10 hover:text-primary"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <span className="text-lg font-bold text-foreground">{answer.votes}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVoteAnswer(answer.id, -1)}
                          className="p-2 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        {answer.isAccepted && (
                          <Badge variant="success" className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            Solución Aceptada
                          </Badge>
                        )}

                        <p className="text-foreground leading-relaxed">{answer.content}</p>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-xl">{answer.authorAvatar}</span>
                            <span className="font-medium text-foreground">{answer.author}</span>
                            {answer.author === 'Fuxion Shop' && <VerifiedBadge size="sm" />}
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground text-xs">{formatDate(answer.createdAt)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {!answer.isAccepted && !question.solved && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAcceptAnswer(answer.id)}
                                className="text-xs"
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Marcar como solución
                              </Button>
                            )}
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAnswer(answer.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                title="Eliminar respuesta"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuestionDetail;
