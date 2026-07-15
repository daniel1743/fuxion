import React, { useEffect, useState } from 'react';
import { Heart, Loader2, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import {
  addEvidenceComment,
  fetchEvidenceInteractions,
  getEvidenceVisitorKey,
  toggleEvidenceLike,
} from '@/services/evidenceInteractionService';

const EvidenceInteractions = ({ evidenceId }) => {
  const { user } = useAuth();
  const { adminData } = useAdmin();
  const knownName = user?.name || adminData?.nombre_completo || '';
  const [visitorKey] = useState(() => getEvidenceVisitorKey());
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [authorName, setAuthorName] = useState(knownName);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (knownName) setAuthorName(knownName);
  }, [knownName]);

  useEffect(() => {
    let active = true;

    const loadInteractions = async () => {
      try {
        const data = await fetchEvidenceInteractions(evidenceId, visitorKey);
        if (!active) return;
        setComments(data.comments);
        setLikes(data.likes);
        setLiked(data.likedByVisitor);
        setAvailable(true);
      } catch (error) {
        console.warn('Interacciones de evidencia no disponibles:', error.message);
        if (active) setAvailable(false);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInteractions();
    return () => {
      active = false;
    };
  }, [evidenceId, visitorKey]);

  const handleLike = async () => {
    if (liking || !available) return;
    setLiking(true);

    try {
      const nextLiked = await toggleEvidenceLike({
        evidenceId,
        visitorKey,
        isLiked: liked,
      });
      setLiked(nextLiked);
      setLikes((current) => Math.max(0, current + (nextLiked ? 1 : -1)));
    } catch (error) {
      toast({
        title: 'No se pudo registrar la reacción',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();
    if (submitting || !available) return;
    setSubmitting(true);

    try {
      const comment = await addEvidenceComment({
        evidenceId,
        authorName,
        content,
      });
      setComments((current) => [...current, comment]);
      setContent('');
      setShowComments(true);
      toast({ title: 'Comentario publicado' });
    } catch (error) {
      toast({
        title: 'No se pudo publicar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 border-t border-border px-5 py-4 text-xs text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando interacciones
      </div>
    );
  }

  if (!available) {
    return (
      <div className="border-t border-border px-5 py-4 text-xs text-muted-foreground">
        Comentarios y reacciones estarán disponibles al activar su configuración.
      </div>
    );
  }

  return (
    <div className="border-t border-border">
      <div className="flex items-center gap-2 px-4 py-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={liked ? 'text-rose-600 hover:text-rose-700' : 'text-muted-foreground'}
          onClick={handleLike}
          disabled={liking}
          aria-pressed={liked}
        >
          <Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          {likes} {likes === 1 ? 'Me gusta' : 'Me gusta'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => setShowComments((current) => !current)}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {comments.length} {comments.length === 1 ? 'comentario' : 'comentarios'}
        </Button>
      </div>

      {showComments && (
        <div className="space-y-4 border-t border-border bg-secondary/20 p-4">
          {comments.length > 0 ? (
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-border bg-background p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold">{comment.author_name}</p>
                    <time className="shrink-0 text-xxs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString('es-CL')}
                    </time>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sé la primera persona en comentar.</p>
          )}

          <form onSubmit={handleComment} className="space-y-3">
            {!knownName && (
              <Input
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                placeholder="Tu nombre"
                maxLength={60}
                required
              />
            )}
            {knownName && (
              <p className="text-xs text-muted-foreground">Comentarás como {knownName}.</p>
            )}
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Escribe un comentario respetuoso..."
              maxLength={500}
              required
              className="min-h-[88px] resize-y"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">{content.length}/500</span>
              <Button type="submit" size="sm" disabled={submitting || !content.trim() || authorName.trim().length < 2}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Comentar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EvidenceInteractions;
