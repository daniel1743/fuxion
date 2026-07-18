-- Migrar los 20 artículos de wellness_articles a blog_posts
-- Esto colocará los artículos donde pertenecen (la sección del Blog)
-- Y les agregará una imagen por defecto elegante.

INSERT INTO public.blog_posts (
  title, 
  slug, 
  category, 
  excerpt, 
  content, 
  author,
  is_published,
  image_url,
  created_at
)
SELECT 
  title, 
  slug, 
  category, 
  excerpt, 
  content, 
  editor_name AS author,
  is_published,
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop' AS image_url,
  created_at
FROM public.wellness_articles
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  author = EXCLUDED.author,
  is_published = EXCLUDED.is_published,
  image_url = COALESCE(public.blog_posts.image_url, EXCLUDED.image_url);
