import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { ArrowLeft, Clock, Eye, Calendar, User, Share2, MessageCircle } from 'lucide-react';
import { useBlog } from '@/context/BlogContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getPostBySlug, posts } = useBlog();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const data = await getPostBySlug(slug);
      if (data) {
        setPost(data);
      } else {
        navigate('/blog');
      }
      setLoading(false);
    };
    loadPost();
  }, [slug]);

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calcular tiempo de lectura
  const readingTime = (content) => {
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min de lectura`;
  };

  // Compartir artículo
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: 'Enlace copiado',
        description: 'El enlace del artículo ha sido copiado al portapapeles.',
      });
    }
  };

  // Renderizar markdown básico
  const renderContent = (content) => {
    if (!content) return '';

    // Convertir markdown a HTML básico
    let html = content
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-foreground mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-foreground mt-10 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-foreground mt-10 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-foreground">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-4 text-muted-foreground">$1</li>')
      .replace(/^❌ (.*$)/gim, '<li class="ml-4 text-red-400 flex items-start gap-2"><span>❌</span><span>$1</span></li>')
      .replace(/^✅ (.*$)/gim, '<li class="ml-4 text-green-400 flex items-start gap-2"><span>✅</span><span>$1</span></li>')
      // Horizontal rule
      .replace(/^---$/gim, '<hr class="border-border my-8" />')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="text-muted-foreground leading-relaxed mb-4">')
      .replace(/\n/g, '<br />');

    return `<p class="text-muted-foreground leading-relaxed mb-4">${html}</p>`;
  };

  // Artículos relacionados
  const relatedPosts = posts
    .filter(p => p.id !== post?.id && p.category === post?.category)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.image_url || undefined}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-4xl">

          {/* Volver */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to="/blog">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al blog
              </Button>
            </Link>
          </motion.div>

          {/* Header del artículo */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Categoría */}
            <span className="inline-block bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full mb-4">
              {post.category}
            </span>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author || 'Equipo Fuxion'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readingTime(post.content)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views || 0} vistas
              </span>
            </div>
          </motion.header>

          {/* Imagen principal */}
          {post.image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-10"
            >
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl"
              />
            </motion.div>
          )}

          {/* Excerpt destacado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg mb-10"
          >
            <p className="text-lg text-foreground italic">
              {post.excerpt}
            </p>
          </motion.div>

          {/* Contenido */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-invert max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-10"
          >
            <p className="text-sm text-muted-foreground">
              <strong>Aviso:</strong> Este artículo es solo informativo y educativo. No reemplaza
              el consejo médico profesional. Consulta siempre con un profesional de salud antes
              de hacer cambios en tu alimentación o estilo de vida.
            </p>
          </motion.div>

          {/* Acciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Button onClick={handleShare} variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir artículo
            </Button>
            <Link to="/ayuda">
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Hacer una pregunta
              </Button>
            </Link>
          </motion.div>

          {/* CTA a productos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 md:p-8 mb-12"
          >
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Complementa tu bienestar con productos naturales
            </h3>
            <p className="text-muted-foreground mb-4">
              En Tienda Fuxion tenemos productos diseñados para apoyar tu camino hacia una vida más saludable.
            </p>
            <Link to="/explorar">
              <Button className="bg-green-600 hover:bg-green-700">
                Ver productos
              </Button>
            </Link>
          </motion.div>

          {/* Artículos relacionados */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Artículos relacionados
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all"
                  >
                    {relatedPost.image_url && (
                      <img
                        src={relatedPost.image_url}
                        alt={relatedPost.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </article>
      </div>
    </>
  );
};

export default BlogPostPage;
