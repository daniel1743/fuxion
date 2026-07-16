import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getCommentsByArticle, addArticleComment } from '@/services/articleCommentsService';

const ArticleComments = ({ articleSlug }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author_name: '',
    title: '',
    content: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchComments();
  }, [articleSlug]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getCommentsByArticle(articleSlug);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.author_name.trim() || !formData.content.trim()) {
      setStatus({ type: 'error', message: 'Por favor, completa tu nombre y el mensaje.' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const newComment = await addArticleComment({
        article_slug: articleSlug,
        author_name: formData.author_name.trim(),
        title: formData.title.trim(),
        content: formData.content.trim(),
      });
      
      if (newComment) {
        setComments(prev => [newComment, ...prev]);
        setFormData({ author_name: '', title: '', content: '' });
        setStatus({ type: 'success', message: '¡Gracias por compartir tu opinión!' });
        
        // Limpiar mensaje de éxito después de 5 segundos
        setTimeout(() => setStatus({ type: '', message: '' }), 5000);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setStatus({ type: 'error', message: 'Hubo un error al publicar. Intenta nuevamente.' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="mt-16 border-t border-border/50 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-bold font-heading">Preguntas y Opiniones</h3>
      </div>

      {/* Formulario */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-12 shadow-sm">
        <h4 className="text-lg font-semibold mb-6">Deja un comentario</h4>
        
        {status.message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${
              status.type === 'error' 
                ? 'bg-red-500/10 text-red-600 border border-red-500/20' 
                : 'bg-green-500/10 text-green-600 border border-green-500/20'
            }`}
          >
            {status.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span className="font-medium text-sm">{status.message}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="author_name" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> Nombre completo *
              </label>
              <input
                type="text"
                id="author_name"
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                placeholder="Ej. María Pérez"
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-muted-foreground">
                Título (Opcional)
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Resumen de tu duda u opinión"
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-muted-foreground">
              Mensaje o Pregunta *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="¿Qué opinas sobre este artículo o qué duda tienes?"
              rows={4}
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>Enviando...</>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Publicar comentario
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Comentarios */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          Comentarios ({comments.length})
        </h4>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border border-border/50 border-dashed">
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">Sé el primero en dejar una opinión sobre este artículo.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={comment.id}
                className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm hover:border-primary/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">{comment.author_name}</h5>
                      <p className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</p>
                    </div>
                  </div>
                </div>
                {comment.title && (
                  <h6 className="font-medium text-foreground mb-2 mt-2">{comment.title}</h6>
                )}
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleComments;
