import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, Image, Mic, Plus, RefreshCw, ShieldCheck } from 'lucide-react';
import AdminPanel from '@/components/admin/AdminPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/context/AdminContext';
import { fetchEvidencePosts } from '@/services/siteAdminService';

const EvidencePage = () => {
  const { isAdmin } = useAdmin();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

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

  return (
    <div className="min-h-screen bg-background pt-24">
      <Helmet>
        <title>Evidencias Fuxion | Experiencias y Resultados Compartidos</title>
        <meta
          name="description"
          content="Evidencias, experiencias y registros compartidos por la comunidad Fuxion con asesoría personalizada."
        />
        <link rel="canonical" href="https://tiendafuxion.space/blog" />
      </Helmet>

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
            <Button className="mt-6" onClick={() => setShowAdminPanel(true)}>
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
                <div className="aspect-[4/3] bg-muted">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Image className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-5">
                  <h2 className="text-lg font-semibold text-foreground">{post.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{post.description}</p>
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
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {showAdminPanel && (
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => {
            setShowAdminPanel(false);
            loadPosts();
          }}
        />
      )}
    </div>
  );
};

export default EvidencePage;
