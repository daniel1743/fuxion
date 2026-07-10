import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
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

const TestimonialsSection = ({ title, subtitle, variant = 'default' }) => {
  const colors = variant === 'dark'
    ? { bg: 'bg-gray-900', text: 'text-white', muted: 'text-gray-400', cardBg: 'bg-gray-800', accent: 'text-emerald-400' }
    : { bg: 'bg-gradient-to-b from-emerald-50 to-white', text: 'text-foreground', muted: 'text-muted-foreground', cardBg: 'bg-white', accent: 'text-emerald-600' };

  // Estado para el formulario de reseña propia
  const [ownReview, setOwnReview] = useState({
    name: '',
    product: '',
    rating: 5,
    comment: ''
  });
  const [ownSubmitted, setOwnSubmitted] = useState(false);

  const handleOwnSubmit = (e) => {
    e.preventDefault();
    // Aquí se conectaría con backend en el futuro
    setOwnSubmitted(true);
  };

  return (
    <section className={`${colors.bg} py-16 sm:py-20`}>
      <div className="container mx-auto px-5">
        {/* Nota discreta */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-xs text-center ${colors.muted} mb-8 max-w-2xl mx-auto italic`}
        >
          Las experiencias corresponden a consumidores individuales. Los resultados pueden variar según cada persona.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {title && <h2 className={`text-3xl sm:text-4xl font-bold ${colors.text} mb-3`}>{title}</h2>}
          {subtitle && <p className={`${colors.muted} max-w-2xl mx-auto`}>{subtitle}</p>}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`${colors.cardBg} rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow`}
            >
              <Quote className={`h-5 w-5 mb-3 ${colors.accent} opacity-60`} />
              <p className={`text-sm leading-relaxed mb-4 ${colors.text} opacity-90`}>{t.text}</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                  {t.initials}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${colors.text}`}>{t.name}</p>
                  <p className={`text-xs ${colors.muted}`}>{t.product}</p>
                </div>
              </div>
              <p className={`text-xs ${colors.muted} italic`}>{t.source}</p>
            </motion.div>
          ))}
        </div>

        {/* Sección "Comparte tu experiencia" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-12 border-t border-emerald-100 dark:border-emerald-900/30"
        >
          <div className="max-w-lg mx-auto">
            <h3 className={`text-2xl font-bold text-center ${colors.text} mb-2`}>
              Comparte tu experiencia
            </h3>
            <p className={`text-sm text-center ${colors.muted} mb-8`}>
              ¿Has comprado con nosotros? Cuéntanos cómo te fue.
            </p>

            {ownSubmitted ? (
              <div className={`text-center p-6 rounded-2xl ${colors.cardBg} border border-emerald-200`}>
                <p className={`text-lg font-semibold ${colors.text}`}>¡Gracias por compartir!</p>
                <p className={`text-sm ${colors.muted} mt-2`}>
                  Tu reseña será revisada y publicada pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOwnSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${colors.text} mb-1`}>Nombre</label>
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
                  <label className={`block text-sm font-medium ${colors.text} mb-1`}>Producto comprado</label>
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
                  <label className={`block text-sm font-medium ${colors.text} mb-1`}>Calificación</label>
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
                  <label className={`block text-sm font-medium ${colors.text} mb-1`}>Comentario</label>
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
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
