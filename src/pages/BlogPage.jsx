import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { BookOpen, Clock, Eye, ArrowRight, Search, Filter, Settings } from 'lucide-react';
import { useBlog } from '@/context/BlogContext';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BlogAdminPanel from '@/components/admin/BlogAdminPanel';
import { ArticleSkeleton } from '@/components/skeleton';
import MobileAppShell from '@/components/mobile/MobileAppShell';
import { parseCategories, getCategoryData } from '@/lib/categoryCatalog';
import ArticleBadges from '@/components/blog/ArticleBadges';

const BlogPage = () => {
  const { posts, loading, categories } = useBlog();
  const { isAdmin } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [expandedCategoriesHeight, setExpandedCategoriesHeight] = useState(44);
  const categoriesRef = useRef(null);
  const closeTimerRef = useRef(null);
  const collapsedCategoriesHeight = 44;

  const isDesktopViewport = () => (
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  );

  const openCategories = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setCategoriesExpanded(true);
  };

  const scheduleCloseCategories = () => {
    if (!isDesktopViewport()) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setCategoriesExpanded(false);
      closeTimerRef.current = null;
    }, 120);
  };

  useLayoutEffect(() => {
    if (!categoriesRef.current) return;
    setExpandedCategoriesHeight(categoriesRef.current.scrollHeight + 4);
  }, [categories]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  // Normalizar posts para búsqueda
  const searchablePosts = useMemo(() => {
    return (posts ?? []).map((post) => ({
      ...post,
      title: post.title ?? "",
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      tags: Array.isArray(post.tags)
        ? post.tags
        : typeof post.tags === "string"
          ? post.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : []
    }));
  }, [posts]);

  // Configurar Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(searchablePosts, {
      includeScore: true,
      includeMatches: true,
      threshold: 0.25,
      ignoreLocation: true,
      ignoreDiacritics: true,
      minMatchCharLength: 2,
      shouldSort: true,
      findAllMatches: false,
      keys: [
        { name: "title", weight: 0.45 },
        { name: "tags", weight: 0.25 },
        { name: "excerpt", weight: 0.20 },
        { name: "content", weight: 0.10 }
      ]
    });
  }, [searchablePosts]);

  const normalizedSearchTerm = searchTerm.trim();

  // Filtrar posts
  const filteredPosts = useMemo(() => {
    // 1. Aplicar filtro de búsqueda
    let searchResults = searchablePosts;
    if (normalizedSearchTerm) {
      searchResults = fuse
        .search(normalizedSearchTerm)
        .filter((result) => result.score === undefined || result.score <= 0.40)
        .map((result) => result.item);
    }

    // 2. Aplicar filtro de categoría
    return searchResults.filter(post => {
      const parsedCats = parseCategories(post.category);
      return selectedCategory === 'all' || parsedCats.includes(selectedCategory);
    });
  }, [fuse, normalizedSearchTerm, searchablePosts, selectedCategory]);

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

  return (
    <>
      <SEO
        title="Artículos Científicos — Salud Digestiva, Metabolismo y Bienestar"
        description="Artículos científicos sobre salud digestiva, microbioma, metabolismo, salud mental y longevidad. Escritos por Daniel Falcón, Investigador Periodístico y Educador Científico."
        canonical="/articulos"
        ogImageAlt="Bienestar en Claro — Artículos Científicos"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pt-0 md:pt-24 pb-16">
        
        {/* ── MOBILE SHELL ── */}
        <div className="md:hidden">
          <MobileAppShell 
            variant="compact"
            title="Blog de Bienestar"
            description="Consejos para una vida saludable"
          />
        </div>

        <div className="container mx-auto px-4 mt-6 md:mt-0">

          {/* Header (Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:block text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Blog de Bienestar</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Consejos para una
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500"> Vida Saludable</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Artículos sobre pérdida de peso, bienestar y nutrición.
              Sin promesas milagro, solo información real y consejos que funcionan.
            </p>

            {/* Admin Button */}
            {isAdmin && (
              <Button
                onClick={() => setShowAdminPanel(true)}
                variant="outline"
                className="mt-6 border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Administrar Blog
              </Button>
            )}
          </motion.div>

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="sticky top-0 z-40 -mx-4 px-4 pt-4 pb-3 bg-background/95 backdrop-blur-sm border-b border-border md:top-0 md:mx-0 md:px-6 md:rounded-xl md:bg-card md:border md:mb-8"
          >
            <div className="flex flex-col gap-4">
              {/* Búsqueda */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-zinc-900"
                />
              </div>

              {/* Categorías Colapsables */}
              <div
                className="relative overflow-hidden"
                style={{
                  height: categoriesExpanded ? `${expandedCategoriesHeight}px` : `${collapsedCategoriesHeight}px`,
                  transition: categoriesExpanded
                    ? 'height 260ms cubic-bezier(0.22, 1, 0.36, 1)'
                    : 'height 210ms cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'height',
                }}
                onMouseEnter={() => { if (isDesktopViewport()) openCategories(); }}
                onMouseLeave={scheduleCloseCategories}
                onFocusCapture={openCategories}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    scheduleCloseCategories();
                  }
                }}
              >
                <div
                  ref={categoriesRef}
                  className="flex flex-wrap content-start gap-2 pb-2 motion-reduce:transition-none"
                  style={{
                    minHeight: 0,
                    opacity: categoriesExpanded ? 1 : 0.98,
                    transform: categoriesExpanded ? 'translateY(4px)' : 'translateY(0)',
                    transition: categoriesExpanded
                      ? 'opacity 180ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1)'
                      : 'opacity 180ms ease, transform 210ms cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); setSelectedCategory('all'); }}
                    className="rounded-full shrink-0 transition-[transform,box-shadow,background-color,border-color] duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:scale-[1.015] hover:shadow-[0_5px_14px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.985] motion-reduce:transition-none"
                  >
                    Todos
                  </Button>
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.name;
                    return (
                      <Button
                        key={cat.id}
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); setSelectedCategory(cat.name); }}
                        className={`rounded-full shrink-0 transition-[transform,box-shadow,background-color,border-color] duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:scale-[1.015] hover:shadow-[0_5px_14px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.985] motion-reduce:transition-none ${
                          isSelected
                            ? `${cat.color} text-white border-transparent hover:${cat.color}`
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        {!isSelected && (
                          <span className={`w-2 h-2 rounded-full mr-2 ${cat.color}`}></span>
                        )}
                        {cat.name}
                      </Button>
                    );
                  })}
                </div>

                {/* Gradiente cuando está contraído */}
                {!categoriesExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-background/95 to-transparent pointer-events-none" />
                )}
              </div>

              {/* Botón Móvil Mostrar Más */}
              <div className="md:hidden flex justify-center mt-2">
                <button
                  onClick={() => {
                    setCategoriesExpanded(!categoriesExpanded);
                  }}
                  aria-expanded={categoriesExpanded}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
                >
                  {categoriesExpanded ? '▲ Mostrar menos' : '▼ Mostrar más'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Loading State — Skeleton grid premium */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    opacity: 0,
                    animation: `fadeInUp 0.3s ease-out ${i * 0.05}s forwards`,
                  }}
                >
                  <ArticleSkeleton />
                </div>
              ))}
            </div>
          )}


          {/* Empty State */}
          {!loading && filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No hay artículos disponibles
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== 'all'
                  ? 'No encontramos artículos con esos filtros. Intenta con otros términos.'
                  : 'Pronto publicaremos contenido de valor para ti.'}
              </p>
            </motion.div>
          )}

          {/* Grid de artículos */}
          {!loading && filteredPosts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  {/* Imagen */}
                  <Link to={`/articulos/${post.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-primary/50" />
                        </div>
                      )}
                      {/* Categorías (Multi-Badge Component) */}
                      <ArticleBadges categoryString={post.category} content={post.content} />
                    </div>
                  </Link>

                  {/* Contenido */}
                  <div className="p-5">
                    <Link to={`/articulos/${post.slug}`}>
                      <h2 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {readingTime(post.content)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views || 0}
                        </span>
                      </div>
                      <span>{formatDate(post.created_at)}</span>
                    </div>

                    {/* CTA */}
                    <Link to={`/articulos/${post.slug}`}>
                      <Button variant="ghost" size="sm" className="w-full mt-4 group-hover:bg-primary/10">
                        Leer artículo
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
          >
            <p className="text-sm text-muted-foreground text-center">
              <strong>Aviso importante:</strong> El contenido de este blog es solo informativo y educativo.
              No reemplaza el consejo médico profesional. Siempre consulta con un profesional de salud
              antes de hacer cambios significativos en tu alimentación o estilo de vida.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {showAdminPanel && (
          <BlogAdminPanel
            isOpen={showAdminPanel}
            onClose={() => setShowAdminPanel(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default BlogPage;
