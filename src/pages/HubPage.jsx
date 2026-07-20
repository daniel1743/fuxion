/**
 * HubPage — Página de autoridad temática
 * Se usa para cada nodo de la taxonomía Nivel 1 y 2
 * Ejemplo: /hub/microbiota-intestinal, /hub/higado-graso
 */

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import { buildBreadcrumbSchema, buildWebsiteSchema } from '@/lib/productSeo';
import { getCategoryName } from '@/lib/categoryCatalog';

const HubPage = () => {
  const { category } = useParams();
  const [hub, setHub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hubs = HUB_CATALOG.find(h => h.slug === category);
    setHub(hubs);
    setLoading(false);
  }, [category]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!hub) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-bold">Hub no encontrado</h1>
        <Link to="/blog" className="mt-4 text-emerald-600">← Volver al blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${hub.name} — Centro de Conocimiento | Bienestar en Claro`}
        description={hub.description}
        canonical={`/hub/${hub.slug}`}
        ogImage="/branding/social/og-image.png"
        ogImageAlt={hub.name}
        schema={[
          buildBreadcrumbSchema([
            { name: 'Inicio', url: '/' },
            { name: hub.name, url: `/hub/${hub.slug}` }
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: hub.name,
            description: hub.description,
            url: `${window.location.origin}/hub/${hub.slug}`,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: hub.articles.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: a.title,
                url: `${window.location.origin}${a.url}`
              }))
            }
          }
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 py-16">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{hub.name}</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">{hub.description}</p>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto max-w-4xl px-6 py-12">
        {/* Intro */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-muted-foreground leading-relaxed text-lg">{hub.longDescription}</p>
        </div>

        {/* Categorías principales */}
        <h2 className="text-2xl font-bold text-foreground mb-6">Temas principales</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {hub.subtopics.map((subtopic, i) => (
            <Link
              key={i}
              to={subtopic.url}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
            >
              <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-600">
                {subtopic.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{subtopic.description}</p>
              <p className="mt-2 text-sm font-semibold text-emerald-600">
                {subtopic.articleCount} artículos →
              </p>
            </Link>
          ))}
        </div>

        {/* Artículos recientes */}
        <h2 className="text-2xl font-bold text-foreground mb-6">Artículos recientes</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {hub.articles.slice(0, 6).map((article, i) => (
            <Link
              key={i}
              to={article.url}
              className="group rounded-2xl border border-border bg-card overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
            >
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="font-bold text-foreground group-hover:text-emerald-600">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                {article.readTime && (
                  <p className="mt-2 text-xs text-muted-foreground">{article.readTime}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Productos relacionados */}
        {hub.products.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-foreground mb-6">Productos relacionados</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {hub.products.map((product, i) => (
                <Link
                  key={i}
                  to={product.url}
                  className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="font-bold text-foreground group-hover:text-emerald-600">{product.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{product.reason}</p>
                  <p className="mt-2 text-sm font-semibold text-emerald-600">Ver producto →</p>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* CTA final */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-3">¿Necesitas orientación personalizada?</h2>
          <p className="text-muted-foreground mb-6">
            Un asesor puede ayudarte a elegir el producto adecuado para tu situación.
          </p>
          <a
            href="https://wa.me/56989639088"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default HubPage;
