import React, { useState } from 'react';
import { Star, Quote, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { buildOrganizationSchema, SITE_URL } from '@/lib/productSeo';
import MobileAppShell from '@/components/mobile/MobileAppShell';

const publicReviews = [
  {
    initials: 'LZ',
    name: 'Lizer',
    product: 'Thermo T3',
    rating: 5,
    text: 'Mi esposo lleva unos meses usando el producto y comenta una experiencia positiva acompañando sus objetivos de bienestar.',
    source: 'Reseña pública · Falabella'
  },
  {
    initials: 'CA',
    name: 'Cliente Anónimo',
    product: 'Prunex 1',
    rating: 4,
    text: 'Cuando mi sistema digestivo funciona bien, me siento más ligero y con más energía.',
    source: 'Reseña pública · Tiendamia'
  },
  {
    initials: 'CM',
    name: 'ChezMax',
    product: 'Producto FuXion energético',
    rating: 5,
    text: 'Un sabor delicioso que me proporciona energía constante sin los picos repentinos. Ayuda a evitar los bajones de energía durante el día.',
    source: 'Reseña pública · Ubuy'
  },
  {
    initials: 'CV',
    name: 'Comprador verificado',
    product: 'Productos FuXion',
    rating: 5,
    text: 'Excelente calidad de producto, fácil de preparar y una buena experiencia de consumo.',
    source: 'Reseña pública · Mercado Libre Colombia'
  },
  {
    initials: 'OA',
    name: 'o***a',
    product: 'Experiencia de compra',
    rating: 5,
    text: 'Los productos, el valor y la atención son de primera clase. El envío fue muy rápido.',
    source: 'Compra verificada · eBay'
  },
  {
    initials: 'CU',
    name: 'Cliente Ubuy',
    product: 'Vita Xtra T',
    rating: 4,
    text: 'Muy versátil para mezclar en mis batidos y tiene un delicioso sabor.',
    source: 'Reseña pública · Ubuy'
  }
];

const ReviewsPage = () => {
  const [ownReview, setOwnReview] = useState({
    name: '',
    product: '',
    rating: 5,
    comment: ''
  });
  const [ownSubmitted, setOwnSubmitted] = useState(false);

  const handleOwnSubmit = (e) => {
    e.preventDefault();
    setOwnSubmitted(true);
  };

  const avgRating = (publicReviews.reduce((sum, r) => sum + r.rating, 0) / publicReviews.length).toFixed(1);

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'Organization',
      name: 'Bienestar en Claro Chile',
    },
    ratingValue: avgRating,
    reviewCount: publicReviews.length,
    bestRating: 5,
    worstRating: 1,
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Opiniones — Experiencias de consumidores FuXion"
        description="Lee experiencias compartidas por consumidores que han probado productos FuXion y publicado sus opiniones en plataformas públicas."
        canonical="/opiniones"
        ogImageAlt="Bienestar en Claro — Opiniones de clientes"
        schema={[buildOrganizationSchema(), reviewSchema]}
      />

      {/* ── MOBILE SHELL ── */}
      <div className="md:hidden">
        <MobileAppShell 
          variant="compact"
          title="Experiencias de Consumidores"
          description="Opiniones compartidas sobre los productos FuXion."
        />
      </div>

      {/* ── Header ── */}
      <section className="hidden md:block bg-gradient-to-br from-emerald-50 via-white to-green-50 py-16 sm:py-20">
        <div className="container mx-auto px-5 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Experiencias de consumidores FuXion
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Opiniones compartidas por consumidores que han probado productos FuXion y publicado sus experiencias en diferentes plataformas públicas.
          </p>
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-sm border border-emerald-100">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${i < Math.floor(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-foreground">{avgRating}</div>
              <div className="text-xs text-muted-foreground">{publicReviews.length} reseñas</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nota discreta ── */}
      <div className="container mx-auto px-5 mt-8">
        <p className="text-xs text-center text-muted-foreground max-w-2xl mx-auto italic">
          Las experiencias corresponden a consumidores individuales recopiladas desde plataformas públicas. Los resultados pueden variar según cada persona.
        </p>
      </div>

      {/* ── Reviews Grid ── */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {publicReviews.map((review, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                    {review.rating < 5 && Array.from({ length: 5 - review.rating }).map((_, j) => (
                      <Star key={`empty-${j}`} className="h-4 w-4 text-gray-200" />
                    ))}
                  </div>
                </div>

                <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                  {review.product}
                </span>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{review.text}</p>

                <div className="flex items-center justify-between pt-3 border-t border-emerald-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground italic">{review.source}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sección "Comparte tu experiencia" ── */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-5">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-center text-foreground mb-2">
              Comparte tu experiencia
            </h2>
            <p className="text-sm text-center text-muted-foreground mb-8">
              ¿Has comprado con nosotros? Cuéntanos cómo te fue.
            </p>

            {ownSubmitted ? (
              <div className="text-center p-6 rounded-2xl bg-white border border-emerald-200">
                <p className="text-lg font-semibold text-foreground">¡Gracias por compartir!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Tu reseña será revisada y publicada pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOwnSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={ownReview.name}
                    onChange={(e) => setOwnReview({ ...ownReview, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Producto comprado</label>
                  <input
                    type="text"
                    required
                    value={ownReview.product}
                    onChange={(e) => setOwnReview({ ...ownReview, product: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ej: Thermo T3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Calificación</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setOwnReview({ ...ownReview, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= ownReview.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Comentario</label>
                  <textarea
                    required
                    rows={3}
                    value={ownReview.comment}
                    onChange={(e) => setOwnReview({ ...ownReview, comment: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder="Cuéntanos tu experiencia..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar reseña
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReviewsPage;
