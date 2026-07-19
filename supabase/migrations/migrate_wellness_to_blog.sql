-- Migrar los 20 artículos de wellness_articles a blog_posts
-- Ejecutar UNA SOLA VEZ para llenar la tabla blog_posts con los artículos publicados

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
  wa.title,
  wa.slug,
  wa.category,
  wa.excerpt,
  wa.content,
  wa.editor_name AS author,
  wa.is_published,
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop' AS image_url,
  wa.created_at
FROM public.wellness_articles wa
WHERE wa.is_published = true
AND wa.slug NOT IN (SELECT slug FROM public.blog_posts)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  author = EXCLUDED.author,
  is_published = EXCLUDED.is_published,
  image_url = COALESCE(blog_posts.image_url, EXCLUDED.image_url);
