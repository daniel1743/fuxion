import React, { useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { useBlog } from '@/context/BlogContext';
import { getCategoryBySlug, parseCategories } from '@/lib/categoryCatalog';
import { Button } from '@/components/ui/button';
import MobileAppShell from '@/components/mobile/MobileAppShell';
import ArticleBadges from '@/components/blog/ArticleBadges';

const BlogCategoryPage = ({ slug }) => {
  const { posts, loading } = useBlog();
  
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    return <Navigate to="/articulos" replace />;
  }

  // Filtrar artículos que contienen esta categoría (ya sea primaria o secundaria)
  const categoryPosts = useMemo(() => {
    return posts.filter(post => {
      const parsedCats = parseCategories(post.category);
      return parsedCats.includes(category.name);
    });
  }, [posts, category.name]);

  const readingTime = (content) => {
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min de lectura`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <SEO
        title={`${category.name} — Centro de Conocimiento`}
        description={category.description}
        canonical={`/categoria/${category.slug}`}
        ogImageAlt={`${category.name} — Bienestar en Claro`}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pt-0 md:pt-24 pb-16">
        <div className="md:hidden">
          <MobileAppShell 
            variant="compact"
            title={category.name}
            description="Hub Temático"
          />
        </div>

        <div className="container mx-auto px-4 mt-6 md:mt-0 max-w-5xl">
          {/* Header del Hub */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-card border border-border p-8 rounded-2xl shadow-sm relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full ${category.color}`}></div>
            <Link to="/articulos" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver a todos los artículos
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl text-white ${category.color} shadow-md`}>
                <BookOpen className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {category.name}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              {category.description}
            </p>
          </motion.div>

          {/* Grid de Artículos */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Artículos Científicos <span className="text-muted-foreground text-sm font-normal">({categoryPosts.length})</span>
            </h2>

            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : categoryPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
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
                        <ArticleBadges categoryString={post.category} content={post.content} />
                      </div>
                    </Link>

                    <div className="p-5">
                      <Link to={`/articulos/${post.slug}`}>
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {readingTime(post.content)}
                          </span>
                        </div>
                        <span>{formatDate(post.created_at)}</span>
                      </div>

                      <Link to={`/articulos/${post.slug}`}>
                        <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/10">
                          Leer artículo
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground">Aún no hay artículos en este hub temático.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogCategoryPage;
