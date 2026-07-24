import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SEO from '@/components/SEO';
import { ArrowLeft, Calendar, Clock, Share2, User } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/CategoryBadge';
import { toast } from '@/components/ui/use-toast';
import { fetchWellnessArticleBySlug } from '@/services/wellnessArticleService';
import { buildBreadcrumbSchema } from '@/lib/productSeo';
import { generateFaqSchema, extractSemanticKeywords } from '@/lib/articleEnricher';
import { buildWebsiteSchema } from '@/lib/productSeo';
import { useReaderTracking } from '@/hooks/useReaderTracking';
import { trackEvent } from '@/lib/userJourneyContext';
import MobileAppShell from '@/components/mobile/MobileAppShell';
import TableOfContents from '@/components/TableOfContents';

const headingId = (children) => React.Children.toArray(children)
  .join('')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-');

const WellnessArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { trackArticleOpen, trackArticleClose, trackParagraphTime, trackPageView, openChat } = useReaderTracking();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchWellnessArticleBySlug(slug);
        if (!data) {
          navigate('/opiniones', { replace: true });
          return;
        }
        setArticle(data);
        trackArticleOpen(slug, data.title);
        trackEvent('ARTICLE_VIEW', {
          title: data.title,
          slug: data.slug || slug,
          category: data.categoria || data.category || 'Bienestar',
          type: 'wellness',
          entities: extractSemanticKeywords(data.title || ''),
          taxonomy: data.taxonomia || data.taxonomy || null,
        });
      } catch {
        navigate('/opiniones', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      if (slug) trackArticleClose(slug);
    };
  }, [slug, navigate, trackArticleOpen, trackArticleClose]);

  if (loading) return <main className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></main>;
  if (!article) return null;

  const words = article.content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  const authorName = article.editor_name || article.author || 'Daniel Falcón';
  const articleContent = article.content.replace(/^#\s+.+(?:\r?\n)+/, '');
  const hasVisibleDisclaimer = /aviso de salud/i.test(article.content);
  const share = async () => {
    const data = { title: article.title, text: article.excerpt, url: window.location.href };
    if (navigator.share) {
      await navigator.share(data).catch(() => {});
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Enlace copiado' });
    }
  };

  const schemas = [];

  // MedicalWebPage Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": article.title,
    "description": article.excerpt,
    "about": {
      "@type": "MedicalCondition",
      "name": article.category || "Salud y Bienestar"
    },
    "author": {
      "@type": "Person",
      "name": authorName,
      "jobTitle": "Investigador de Salud y Bienestar",
      "url": "https://www.bienestarenclaro.com/sobre-nosotros"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bienestar en Claro",
      "url": "https://www.bienestarenclaro.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.bienestarenclaro.com/icons/android-chrome-512x512.png"
      }
    },
    "datePublished": article.published_at || article.created_at,
    "dateModified": article.updated_at || article.published_at || article.created_at,
    "image": article.image_url ? `${window.location.origin}${article.image_url}` : undefined
  });

  // Article schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "author": {
      "@type": "Person",
      "name": authorName,
      "jobTitle": "Investigador de Salud y Bienestar"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bienestar en Claro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.bienestarenclaro.com/icons/android-chrome-512x512.png"
      }
    },
    "datePublished": article.published_at || article.created_at,
    "dateModified": article.updated_at || article.published_at || article.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${window.location.origin}/bienestar/${article.slug}`
    },
    "image": article.image_url ? `${window.location.origin}${article.image_url}` : undefined,
    "articleSection": article.category
  });

  // Extract FAQs and build FAQPage Schema
  const faqSchema = generateFaqSchema(article.content);
  if (faqSchema) schemas.push(faqSchema);

  const keywords = extractSemanticKeywords(article.content, article.category);

  return (
    <main className="min-h-screen bg-background pb-20 pt-0 md:pt-24">
      <SEO
        title={`${article.title} — Bienestar`}
        description={article.excerpt}
        canonical={`/bienestar/${article.slug}`}
        ogType="article"
        ogImage={article.image_url || undefined}
        ogImageAlt={article.title}
        articleAuthor={authorName}
        articlePublished={article.published_at || article.created_at}
        articleTags={[article.category || 'Bienestar']}
        schema={[
          ...schemas,
          buildWebsiteSchema(),
          buildBreadcrumbSchema([
            { name: 'Inicio', url: '/' },
            { name: 'Bienestar', url: '/bienestar' },
            { name: article.title, url: `/bienestar/${article.slug}` }
          ])
        ]}
      >
        <meta name="keywords" content={keywords.join(', ')} />
      </SEO>

      {/* ── MOBILE SHELL ── */}
      <div className="md:hidden">
        <MobileAppShell 
          variant="compact"
          title="Artículo"
          titleAs="div"
          description={article.title}
          showBack={true}
        />
      </div>

      <article className="container mx-auto max-w-4xl px-4 py-6 md:py-10 sm:px-6 mt-4 md:mt-0">
        <div className="hidden md:block">
          <Link to="/opiniones"><Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a Bienestar</Button></Link>
        </div>
        <header className="mt-8">
          <CategoryBadge category={article.category} className="text-sm px-3 py-1" />
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-muted-foreground">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><User className="h-4 w-4" /> {authorName}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(article.published_at || article.created_at).toLocaleDateString('es-CL')}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {minutes} min de lectura</span>
          </div>
        </header>

        {article.image_url && <img src={article.image_url} alt={article.title} className="mt-8 max-h-[520px] w-full rounded-2xl object-cover" />}

        <TableOfContents content={articleContent} className="mt-8" />

        <div className="mt-10 text-[1.05rem] leading-8 text-muted-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            skipHtml
            components={{
              h1: ({ children }) => <h2 id={headingId(children)} className="mb-4 mt-10 scroll-mt-28 text-3xl font-bold text-foreground">{children}</h2>,
              h2: ({ children }) => <h2 id={headingId(children)} className="mb-4 mt-12 scroll-mt-28 text-3xl font-bold text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 id={headingId(children)} className="mb-3 mt-8 scroll-mt-28 text-2xl font-semibold text-foreground">{children}</h3>,
              p: ({ children }) => (
                <p
                  className="my-5"
                  onMouseEnter={() => trackParagraphTime(`${slug}-content`)}
                  onMouseLeave={() => trackParagraphTime(`${slug}-content`)}
                  onTouchStart={() => trackParagraphTime(`${slug}-content`)}
                >
                  {children}
                </p>
              ),
              ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6">{children}</ul>,
              ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6">{children}</ol>,
              li: ({ children }) => <li className="pl-1">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-7 rounded-xl border border-amber-200 bg-amber-50 px-5 py-1 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="my-8 overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[680px] border-collapse text-left text-sm">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-muted text-foreground">{children}</thead>,
              th: ({ children }) => <th className="border-b border-r border-border px-4 py-3 font-semibold last:border-r-0">{children}</th>,
              td: ({ children }) => <td className="border-b border-r border-border px-4 py-3 align-top last:border-r-0">{children}</td>,
              hr: () => <hr className="my-10 border-border" />,
            }}
          >
            {articleContent}
          </ReactMarkdown>
        </div>

        {!hasVisibleDisclaimer && (
          <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
            Contenido informativo y educativo. No reemplaza una evaluación ni indicación profesional de salud.
          </div>
        )}

        <Button variant="outline" className="mt-8" onClick={share}><Share2 className="mr-2 h-4 w-4" /> Compartir artículo</Button>
      </article>
    </main>
  );
};

export default WellnessArticlePage;

