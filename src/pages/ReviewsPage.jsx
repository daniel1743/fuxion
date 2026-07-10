import React from 'react';
import { Star, Quote, MapPin, ThumbsUp } from 'lucide-react';
import SEO from '@/components/SEO';
import { buildOrganizationSchema, SITE_URL } from '@/lib/productSeo';

const reviews = [
  {
    id: 1,
    product: 'Prunex 1',
    name: 'María García',
    location: 'Santiago',
    rating: 5,
    date: '2024-12-15',
    title: 'Excelente para la digestión',
    text: 'Llevo 3 meses tomando Prunex 1 y mi digestión cambió completamente. El equipo de asesoría me ayudó a elegir el producto perfecto para mí.',
    helpful: 24,
  },
  {
    id: 2,
    product: 'Thermo T3',
    name: 'Carlos Mendoza',
    location: 'Valparaíso',
    rating: 5,
    date: '2024-11-28',
    title: 'Complemento perfecto para ejercicio',
    text: 'Thermo T3 me ayudó a complementar mi rutina de ejercicio. Los resultados fueron notables en pocas semanas.',
    helpful: 18,
  },
  {
    id: 3,
    product: 'Flora Liv',
    name: 'Andrea López',
    location: 'Concepción',
    rating: 5,
    date: '2024-12-02',
    title: 'Productos naturales certificados',
    text: 'Me encanta que los productos sean naturales. Flora Liv me ayudó mucho con mi digestión.',
    helpful: 31,
  },
  {
    id: 4,
    product: 'Vita Xtra T Plus',
    name: 'Roberto Silva',
    location: 'La Serena',
    rating: 5,
    date: '2024-10-20',
    title: 'Más energía todos los días',
    text: 'Vita Xtra T Plus es increíble para la energía diaria. Me levanto con más vitalidad y mis análisis mejoraron.',
    helpful: 42,
  },
  {
    id: 5,
    product: 'Protein Active',
    name: 'Patricia Muñoz',
    location: 'Antofagasta',
    rating: 5,
    date: '2024-11-05',
    title: 'Buena proteína vegetal',
    text: 'La mejor proteína vegetal que he probado. Se disuelve bien y el sabor es delicioso. Ideal después de entrenar.',
    helpful: 15,
  },
  {
    id: 6,
    product: 'Rexet',
    name: 'Felipe Torres',
    location: 'Temuco',
    rating: 4,
    date: '2024-09-18',
    title: 'Buen producto para el dolor',
    text: 'Rexet me ha ayudado bastante con los dolores musculares. Lo uso después de entrenar y recupero más rápido.',
    helpful: 12,
  },
  {
    id: 7,
    product: 'Coco Oil',
    name: 'Camila Rojas',
    location: 'Puerto Montt',
    rating: 5,
    date: '2024-12-10',
    title: 'Aceite de coco premium',
    text: 'El Coco Oil de Fuxion es de excelente calidad. Lo uso tanto en cocina como para cuidado personal.',
    helpful: 20,
  },
  {
    id: 8,
    product: 'Pack Detox',
    name: 'Diego Hernández',
    location: 'Arica',
    rating: 5,
    date: '2024-11-15',
    title: 'Desintoxicación efectiva',
    text: 'El pack detox me ayudó a sentirme mucho mejor. Me sentía más ligero y con más energía desde la primera semana.',
    helpful: 28,
  },
];

const ReviewsPage = () => {
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'Organization',
      name: 'Tienda Fuxion Chile',
    },
    ratingValue: avgRating,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Opiniones — Lo que dicen nuestros clientes"
        description="Lee las opiniones de nuestros clientes sobre productos Fuxion."
        canonical="/opiniones"
        schema={[buildOrganizationSchema(), reviewSchema]}
      />

      {/* ── Header ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-green-50 py-16 sm:py-20">
        <div className="container mx-auto px-5 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Opiniones de Nuestros Clientes
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Más de {reviews.length} clientes satisfechos en todo Chile comparten sus experiencias reales.
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
              <div className="text-xs text-muted-foreground">{reviews.length} reseñas</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews Grid ───────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {reviews.map((review, i) => (
              <div
                key={review.id}
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
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>

                <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                  {review.product}
                </span>

                <h3 className="font-bold text-foreground mb-2">{review.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{review.text}</p>

                <div className="flex items-center justify-between pt-3 border-t border-emerald-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {review.location}
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald-600 transition-colors">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {review.helpful}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReviewsPage;
