import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { ArrowLeft, Clock, Eye, Calendar, User, Share2, MessageCircle } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingCart01Icon, Menu11Icon, ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { useBlog } from '@/context/BlogContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import MobileAppShell from '@/components/mobile/MobileAppShell';
import { toast } from '@/components/ui/use-toast';
import { useScrollDirection } from '@/hooks/useScrollDirection';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getPostBySlug, posts } = useBlog();
  const { getCartCount } = useCart();
  const { scrollDirection, isAtTop } = useScrollDirection();
  const [post, setPost] = useState(null);
  const cartCount = getCartCount();
  const navHidden = scrollDirection === 'down' && !isAtTop;

  const handleOpenMenu = () => {
    window.dispatchEvent(new Event('open-mobile-menu'));
  };
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const readingTime = (content) => {
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min de lectura`;
  };

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

  const renderContent = (content) => {
    if (!content) return '';

    let html = content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-foreground mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-foreground mt-10 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-foreground mt-10 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 text-muted-foreground">$1</li>')
      .replace(/^❌ (.*$)/gim, '<li class="ml-4 text-red-400 flex items-start gap-2"><span>❌</span><span>$1</span></li>')
      .replace(/^✅ (.*$)/gim, '<li class="ml-4 text-green-400 flex items-start gap-2"><span>✅</span><span>$1</span></li>')
      .replace(/^---$/gim, '<hr class="border-border my-8" />')
      .replace(/\n\n/g, '</p><p class="text-muted-foreground leading-relaxed mb-4">')
      .replace(/\n/g, '<br />');

    return `<p class="text-muted-foreground leading-relaxed mb-4">${html}</p>`;
  };

  const relatedPosts = posts
    .filter(p => p.id !== post?.id && p.category === post?.category)
    .slice(0, 3);

  if (loading) {
    return (
      <MobileAppShell title="Cargando...">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MobileAppShell>
    );
  }

  if (!post) return null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": post.title,
    "description": post.excerpt,
    "about": {
      "@type": "MedicalCondition",
      "name": post.category || "Salud y Bienestar"
    },
    "author": {
      "@type": "Person",
      "name": "Daniel Falcón",
      "jobTitle": "Investigador de Salud y Bienestar",
      "url": "https://bienestarenclaro.com/sobre-nosotros"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bienestar en Claro"
    },
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "image": post.image_url
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <SEO 
        title={post.title}
        description={post.excerpt}
        ogImage={post.image_url}
        schema={[articleSchema]}
      />

      {/* ── FIXED SMART STICKY NAV (MOBILE) ── */}
      <div
        className={`fixed top-0 left-0 right-0 z-header md:hidden bg-gradient-to-br from-[#0E5C53] to-[#136a64] shadow-lg px-4 pt-[env(safe-area-inset-top,0px)] transition-transform duration-300 ease-out ${
          navHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex items-center justify-between pt-3 pb-3">
          <button
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="text-white hover:bg-white/10 p-2 rounded-full active:scale-95 transition-all"
            aria-label="Volver"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-1.5 bg-black/10 rounded-full p-1 border border-white/10 backdrop-blur-md">
            <button
              onClick={() => navigate('/carrito')}
              className="relative text-white p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Carrito"
            >
              <HugeiconsIcon icon={ShoppingCart01Icon} className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] rounded-full h-[18px] w-[18px] flex items-center justify-center font-bold shadow-sm ring-2 ring-[#0E5C53]">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            <div className="w-[1px] h-5 bg-white/20" />
            <button
              onClick={handleOpenMenu}
              className="text-white p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Menú"
            >
              <HugeiconsIcon icon={Menu11Icon} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── HERO VERDE UNIFICADO (Desktop & Mobile) ── */}
      <div className="w-full bg-gradient-to-br from-[#0E5C53] to-[#136a64] pb-24 px-4 md:px-8 relative shadow-lg">
        {/* Glow decorativo */}
        <div className="absolute top-0 left-[20%] right-0 h-[200px] bg-emerald-400/15 blur-[80px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-3xl relative z-content">

          {/* ── Barra de navegación MOBILE (inline en el Hero) ── */}
          <div className="md:hidden flex items-center justify-between pt-[env(safe-area-inset-top,12px)] pt-3 pb-2">
            <button
              onClick={() => {
                if (window.history.length > 2) {
                  navigate(-1);
                } else {
                  navigate('/');
                }
              }}
              className="text-white hover:bg-white/10 p-2 rounded-full active:scale-95 transition-all"
              aria-label="Volver"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-1.5 bg-black/10 rounded-full p-1 border border-white/10 backdrop-blur-md">
              <button
                onClick={() => navigate('/carrito')}
                className="relative text-white p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
                aria-label="Carrito"
              >
                <HugeiconsIcon icon={ShoppingCart01Icon} className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] rounded-full h-[18px] w-[18px] flex items-center justify-center font-bold shadow-sm ring-2 ring-[#0E5C53]">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
              <div className="w-[1px] h-5 bg-white/20" />
              <button
                onClick={handleOpenMenu}
                className="text-white p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
                aria-label="Menú"
              >
                <HugeiconsIcon icon={Menu11Icon} className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ── Volver (Desktop) ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block mb-8 pt-32"
          >
            <Link to="/blog">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al blog
              </Button>
            </Link>
          </motion.div>

          {/* Header del artículo */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 md:mt-0"
          >
            {/* Categoría */}
            <span className="inline-block bg-white/20 text-white backdrop-blur-md text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/10 shadow-sm">
              {post.category}
            </span>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-8 leading-[1.2] drop-shadow-sm text-balance">
              {post.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-50/90 font-medium">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-300" />
                Daniel Falcón, Investigador
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-300" />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-300" />
                {readingTime(post.content)}
              </span>
              <span className="flex items-center gap-1.5 hidden sm:flex">
                <Eye className="w-4 h-4 text-emerald-300" />
                {post.views || 0} vistas
              </span>
            </div>
          </motion.header>
        </div>
      </div>

      {/* ── CONTENIDO BLANCO SUPERPUESTO ── */}
      <article className="container mx-auto max-w-3xl -mt-12 md:-mt-16 relative z-sticky bg-card rounded-t-[32px] px-6 py-8 md:px-10 md:py-12 shadow-premium-soft border-t border-white/10 dark:border-white/5">
        
        {/* Imagen principal */}
        {post.image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-10 -mt-2"
          >
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-64 md:h-[400px] object-cover rounded-2xl shadow-sm"
            />
          </motion.div>
        )}

        {/* Excerpt destacado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 p-6 md:p-8 rounded-r-2xl mb-10 shadow-sm"
        >
          <p className="text-lg md:text-xl text-foreground/90 italic font-medium leading-relaxed">
            {post.excerpt}
          </p>
        </motion.div>

        {/* Contenido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-emerald dark:prose-invert max-w-none mb-10 prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-loose prose-a:text-emerald-600 prose-img:rounded-2xl prose-img:shadow-sm"
          dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
        />

        {/* Disclaimer Médico */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 md:p-8 mb-10"
        >
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-yellow-700 dark:text-yellow-500">
            Descargo de Responsabilidad Médica
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Los artículos en este sitio tienen un propósito puramente informativo y educativo basado en investigación. 
            <strong> Ningún contenido sustituye el diagnóstico, tratamiento o consejo médico profesional. </strong> 
            Consulta siempre con un profesional de la salud antes de hacer cambios en tu alimentación, estilo de vida, o de consumir suplementos.
          </p>
        </motion.div>

        {/* Acciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          <Button onClick={handleShare} variant="outline" className="rounded-xl">
            <Share2 className="w-4 h-4 mr-2" />
            Compartir artículo
          </Button>
          <Link to="/ayuda">
            <Button variant="outline" className="rounded-xl">
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
          className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/20 rounded-3xl p-8 md:p-10 mb-12 text-center md:text-left shadow-sm"
        >
          <h3 className="text-2xl font-bold text-foreground mb-3 text-balance">
            Complementa tu bienestar con productos naturales
          </h3>
          <p className="text-muted-foreground mb-6 text-lg">
            En Tienda Fuxion tenemos productos diseñados para apoyar tu camino hacia una vida más saludable y en equilibrio.
          </p>
          <Link to="/explorar">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 py-6 h-auto text-base font-semibold shadow-md btn-premium-lift w-full md:w-auto">
              Ver catálogo de productos
            </Button>
          </Link>
        </motion.div>

        {/* Artículos relacionados */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="pt-8 border-t border-border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Artículos recomendados
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/articulos/${relatedPost.slug}`}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-premium-soft transition-all duration-300 card-hover-premium flex flex-col"
                >
                  {relatedPost.image_url && (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={relatedPost.image_url}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-foreground line-clamp-3 group-hover:text-emerald-600 transition-colors leading-snug">
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
  );
};

export default BlogPostPage;
