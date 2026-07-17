import React, { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import { ArrowLeft, Calendar, Clock, Share2, User } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/CategoryBadge';
import { toast } from '@/components/ui/use-toast';
import { fetchWellnessArticleBySlug } from '@/services/wellnessArticleService';
import MobileAppShell from '@/components/mobile/MobileAppShell';

const WellnessArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchWellnessArticleBySlug(slug);
        if (!data) {
          navigate('/opiniones', { replace: true });
          return;
        }
        setArticle(data);
      } catch {
        navigate('/opiniones', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, navigate]);

  if (loading) return <main className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></main>;
  if (!article) return null;

  const words = article.content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
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
      "name": article.editor_name || "Investigador de Salud y Bienestar"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Tienda Fuxion"
    },
    "datePublished": article.published_at || article.created_at,
    "image": article.image_url ? `${window.location.origin}${article.image_url}` : undefined
  });

  // Extract FAQs and build FAQPage Schema
  const faqSectionMatch = article.content.match(/##\s+Preguntas Frecuentes([\s\S]*?)(?=\n##\s|$)/i);
  if (faqSectionMatch) {
    const faqText = faqSectionMatch[1];
    const faqs = [];
    const matches = faqText.matchAll(/###\s+(.+?)\n([\s\S]*?)(?=\n###\s|$)/g);
    for (const match of matches) {
      const question = match[1].trim();
      const answer = match[2].trim().replace(/\n/g, ' ');
      faqs.push({ question, answer });
    }
    
    if (faqs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    }
  }

  return (
    <main className="min-h-screen bg-background pb-20 pt-0 md:pt-24">
      <SEO
        title={`${article.title} — Bienestar`}
        description={article.excerpt}
        canonical={`/bienestar/${article.slug}`}
        ogType="article"
        ogImage={article.image_url || undefined}
        schema={schemas}
      />

      {/* ── MOBILE SHELL ── */}
      <div className="md:hidden">
        <MobileAppShell 
          variant="compact"
          title="Artículo"
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
            <span className="flex items-center gap-1"><User className="h-4 w-4" /> {article.editor_name}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(article.published_at || article.created_at).toLocaleDateString('es-CL')}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {minutes} min de lectura</span>
          </div>
        </header>

        {article.image_url && <img src={article.image_url} alt={article.title} className="mt-8 max-h-[520px] w-full rounded-2xl object-cover" />}

        <div className="mt-10 space-y-5 text-[1.05rem] leading-8 text-muted-foreground">
          {article.content.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 20)}`} className="whitespace-pre-wrap">{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          Contenido informativo y educativo. No reemplaza una evaluación ni indicación profesional de salud.
        </div>

        <Button variant="outline" className="mt-8" onClick={share}><Share2 className="mr-2 h-4 w-4" /> Compartir artículo</Button>
      </article>
    </main>
  );
};

export default WellnessArticlePage;

