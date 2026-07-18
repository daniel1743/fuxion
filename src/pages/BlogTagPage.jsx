import React, { useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import SEO from '@/components/SEO';
import { useBlog } from '@/context/BlogContext';
import { getTagBySlug } from '@/lib/tagCatalog';
import { Button } from '@/components/ui/button';
import MobileAppShell from '@/components/mobile/MobileAppShell';
import ArticleBadges from '@/components/blog/ArticleBadges';

const BlogTagPage = () => {
  const { slug } = useParams();
  const { posts, loading } = useBlog();
  
  const tagData = getTagBySlug(slug);
  
  if (!tagData) {
    return <Navigate to="/articulos" replace />;
  }

  // Filtrar artículos que contengan este tag en su texto, o si tuviéramos una columna tags en la BD
  // Por ahora, como el motor lo auto-enlaza en el texto, buscaremos el texto o el title.
  // Idealmente, esto debería leer una columna `tags` en Supabase: parseTags(post.tags).includes(tagData.name)
  const categoryPosts = useMemo(() => {
    return posts.filter(post => {
      // Como solución temporal hasta que la BD tenga la columna tags llena, 
      // verificamos si la palabra clave se menciona en el título o contenido.
      const searchRegex = new RegExp(`\\b${tagData.name}\\b`, 'i');
      return searchRegex.test(post.title) || searchRegex.test(post.content) || searchRegex.test(post.excerpt);
    });
  }, [posts, tagData.name]);

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
        title={`${tagData.name} — Entidad Científica`}
        description={tagData.description}
        canonical={`/etiqueta/${tagData.slug}`}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pt-0 md:pt-24 pb-16">
        <div className="md:hidden">
          <MobileAppShell 
            variant="compact"
            title={tagData.name}
            description="Entidad Científica"
          />
        </div>

        <div className="container mx-auto px-4 mt-6 md:mt-0 max-w-5xl">
          {/* Header del Tag */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-card border border-border p-8 rounded-2xl shadow-sm relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full ${tagData.color}`}></div>
            <Link to="/articulos" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver a todos los artículos
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl text-white ${tagData.color} shadow-md`}>
                <Tag className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {tagData.name}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed font-medium">
              {tagData.description}
            </p>
          </motion.div>

          {/* Grid de Artículos */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Artículos relacionados con {tagData.name} <span className="text-muted-foreground text-sm font-normal">({categoryPosts.length})</span>
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
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col"
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
                        <ArticleBadges categoryString={post.category} />
                      </div>
                    </Link>

                    <div className="p-5 flex flex-col flex-1">
                      <Link to={`/articulos/${post.slug}`}>
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto">
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
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground">Aún no hay artículos que mencionen esta entidad.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogTagPage;
