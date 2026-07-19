import React, { useState, useMemo } from 'react';
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

  // Filtrar posts (Memoizado para performance)
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
      const parsedCats = parseCategories(post.category);
      const matchesCategory = selectedCategory === 'all' || parsedCats.includes(selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

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
            className="bg-card border border-border rounded-xl p-4 mb-8"
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
                  className="pl-10"
                />
              </div>

              {/* Categorías (Scroll horizontal en móvil) */}
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide snap-x before:content-[''] before:w-1 before:shrink-0 before:block after:content-[''] after:w-1 after:shrink-0 after:block -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="rounded-full snap-start shrink-0"
                >
                  Todos
                </Button>
                {categories.map((cat) => {
                  // Extraemos el color base (ej. 'blue-500' de 'bg-blue-500') para usarlo dinámicamente si es necesario, 
                  // pero usar la clase directa de bg es más seguro.
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <Button
                      key={cat.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`rounded-full snap-start shrink-0 transition-colors ${
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
                      <ArticleBadges categoryString={post.category} />
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
