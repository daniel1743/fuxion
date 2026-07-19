import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { buildBreadcrumbSchema, getSeoProductBySlug } from "@/lib/productSeo";
import { useBlog } from "@/context/BlogContext";
import { fetchWellnessArticles } from "@/services/wellnessArticleService";
import { getPlaceholderImage } from "@/lib/imageUtils";
import { confirmAndOpenWhatsapp } from "@/lib/whatsapp";

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const ConditionPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { posts } = useBlog();
  const [condition, setCondition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wellnessArticles, setWellnessArticles] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const catalog = await import("@/data/conditions/catalog.json");
        const cond = catalog.default.conditions[slug];
        if (!cond) {
          navigate("/bienestar", { replace: true });
          return;
        }
        setCondition(cond);
        const articles = await fetchWellnessArticles({ includeDrafts: false });
        setWellnessArticles(articles);
      } catch {
        navigate("/bienestar", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug, navigate]);

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></main>;
  }

  if (!condition) return null;

  const seoContent = {
    title: condition.title,
    description: condition.description,
    canonical: "/condicion/" + condition.slug,
    ogType: "article",
    ogImage: condition.ogImage,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: condition.title,
        description: condition.description,
        about: {
          "@type": "MedicalCondition",
          name: condition.medicalCondition,
          code: { "@type": "MedicalCode", codingSystem: "ICD-10", codeValue: condition.medicalCode },
        },
        author: {
          "@type": "Person",
          name: "Daniel Falcón",
          jobTitle: "Investigador de Salud y Bienestar",
          url: "https://www.bienestarenclaro.com/sobre-nosotros",
        },
        publisher: { "@type": "Organization", name: "Bienestar en Claro" },
      },
      buildBreadcrumbSchema([
        { name: "Inicio", url: "/" },
        { name: "Bienestar", url: "/bienestar" },
        { name: condition.title, url: "/condicion/" + condition.slug },
      ]),
    ],
  };

  const relatedProducts = condition.products.map(s => getSeoProductBySlug(s)).filter(Boolean);

  const handleWhatsApp = () => {
    confirmAndOpenWhatsapp("Hola, quiero información sobre " + condition.medicalCondition + ".");
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={PAGE_VARIANTS} transition={{ duration: 0.5 }} className="min-h-screen bg-background">
      <SEO title={seoContent.title} description={seoContent.description} canonical={seoContent.canonical} ogType={seoContent.ogType} ogImage={seoContent.ogImage} schema={seoContent.schema} />
      <main className="container mx-auto max-w-5xl px-4 sm:px-6 py-8 md:py-16">
        <Link to="/bienestar" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver a Bienestar
        </Link>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">{condition.title}</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl">{condition.description}</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {condition.keywords.map(kw => <span key={kw} className="rounded-full bg-primary/5 px-3 py-1 text-sm text-primary font-medium">{kw}</span>)}
        </div>
        {condition.sections && condition.sections.length > 0 && (
          <section className="mb-12"><h2 className="text-2xl font-bold text-foreground mb-6">Contenido de la guía</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {condition.sections.map((section, i) => (<article key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm"><h3 className="text-lg font-bold text-foreground">{section.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.content}</p></article>))}
            </div></section>
        )}
        {relatedProducts.length > 0 && (
          <section className="mb-12"><h2 className="text-2xl font-bold text-foreground mb-6">Productos Fuxion relacionados</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedProducts.map(product => (<Link key={product.slug} to={"/producto/" + product.slug} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <img src={product.image || getPlaceholderImage("product")} alt={product.name} className="h-32 w-full rounded-xl object-cover" loading="lazy" />
                <h3 className="mt-4 font-bold text-foreground group-hover:text-primary">{product.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{product.reason}</p>
                <p className="mt-4 text-sm font-semibold text-primary">Ver producto</p>
              </Link>))}</div></section>
        )}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100 mb-8">
          Contenido informativo y educativo. No reemplaza una evaluación ni indicación profesional de salud.
        </div>
        <Button variant="outline" onClick={handleWhatsApp} className="border-green-200 text-green-700 hover:bg-green-600 hover:text-white">
          <ExternalLink className="mr-2 h-4 w-4" /> Hablar con asesor sobre {condition.medicalCondition}
        </Button>
      </main>
    </motion.div>
  );
};

export default ConditionPage;