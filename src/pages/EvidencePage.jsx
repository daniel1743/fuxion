import React, { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { Edit3, FileText, Image, Mic, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/context/AdminContext';
import { deleteEvidencePost, fetchEvidencePosts } from '@/services/siteAdminService';
import EvidenceInteractions from '@/components/EvidenceInteractions';
import EvidenceEditorDialog from '@/components/EvidenceEditorDialog';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const EvidencePage = () => {
  const { isAdmin, adminData } = useAdmin();
  const { user, openAuthModal } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingId, setDeletingId] = useState('');
  const adminEmail = (user?.email || adminData?.email || '').toLowerCase();
  const isMainAdmin = isAdmin && adminEmail === 'falcondaniel37@gmail.com';

  const canManagePost = (post) => (
    isMainAdmin
    || (isAdmin && Boolean(user?.id) && post.owner_user_id === user.id)
  );

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchEvidencePosts(true);
      setPosts(data);
    } catch (error) {
      console.warn('No se pudieron cargar evidencias:', error.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openNewEvidence = () => {
    if (!isAdmin) return;
    if (!user?.id) {
      openAuthModal();
      return;
    }
    setEditingPost(null);
    setEditorOpen(true);
  };

  const openEditEvidence = (post) => {
    if (!canManagePost(post)) {
      toast({
        title: 'No tienes permiso para editar esta evidencia',
        variant: 'destructive',
      });
      return;
    }
    if (!user?.id) {
      toast({
        title: 'Vuelve a iniciar sesión',
        description: 'Tu acceso administrativo anterior no creó una sesión segura. Cierra sesión y entra nuevamente con tu email y contraseña.',
        variant: 'destructive',
      });
      return;
    }
    setEditingPost(post);
    setEditorOpen(true);
  };

  const removeEvidence = async (post) => {
    if (!canManagePost(post)) {
      toast({
        title: 'No tienes permiso para eliminar esta evidencia',
        variant: 'destructive',
      });
      return;
    }
    if (!window.confirm(`¿Eliminar definitivamente "${post.title}"?`)) return;
    setDeletingId(post.id);
    try {
      await deleteEvidencePost(post.id);
      setPosts((current) => current.filter((item) => item.id !== post.id));
      toast({ title: 'Evidencia eliminada' });
    } catch (error) {
      toast({
        title: 'No se pudo eliminar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <SEO
        title="Evidencias Fuxion — Experiencias y Resultados"
        description="Evidencias, experiencias y registros compartidos por la comunidad Fuxion con asesoría personalizada."
        canonical="/opiniones"
      />

      <section className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Evidencias y experiencias
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Casos, fotos y audios compartidos
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Publicaciones informativas para conocer experiencias reales, acompañadas por asesoría personalizada.
          </p>
          {isAdmin && (
            <Button className="mt-6" onClick={openNewEvidence}>
              <Plus className="mr-2 h-4 w-4" />
              Publicar evidencia
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="mx-auto mt-12 max-w-xl rounded-lg border border-border bg-card p-8 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Aún no hay evidencias publicadas</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Cuando el admin publique fotos, audios o casos, aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Image className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  {canManagePost(post) && (
                    <div className="absolute right-3 top-3 flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 bg-background/95 shadow-md"
                        onClick={() => openEditEvidence(post)}
                        aria-label="Editar evidencia"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="h-9 w-9 shadow-md"
                        onClick={() => removeEvidence(post)}
                        disabled={deletingId === post.id}
                        aria-label="Eliminar evidencia"
                      >
                        {deletingId === post.id
                          ? <RefreshCw className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-5">
                  {post.author_name && (
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      Compartido por {post.author_name}
                    </p>
                  )}
                  <h2 className="text-lg font-semibold text-foreground">{post.title}</h2>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                  {post.audio_url && (
                    <div className="rounded-md border border-border bg-background p-3">
                      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Mic className="h-3.5 w-3.5" />
                        Audio adjunto
                      </div>
                      <audio src={post.audio_url} controls className="w-full" />
                    </div>
                  )}
                </div>
                <EvidenceInteractions evidenceId={post.id} />
              </motion.article>
            ))}
          </div>
        )}
      </section>

      <EvidenceEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        post={editingPost}
        user={user}
        isAdmin={isAdmin}
        onSaved={loadPosts}
      />
    </div>
  );
};

export default EvidencePage;
