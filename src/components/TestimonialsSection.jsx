import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon, QuoteUpIcon, SentIcon } from '@hugeicons/core-free-icons';

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

const TestimonialsSection = ({ title, subtitle, variant = 'default', showForm = true }) => {
  const colors = variant === 'dark'
    ? { bg: 'bg-gray-900', text: 'text-white', muted: 'text-gray-400', cardBg: 'bg-gray-800', accent: 'text-emerald-400' }
    : { bg: 'bg-gradient-to-b from-emerald-50 to-white', text: 'text-foreground', muted: 'text-muted-foreground', cardBg: 'bg-white', accent: 'text-emerald-600' };

  const gradients = variant === 'dark'
    ? { left: 'from-gray-900', right: 'from-gray-900' }
    : { left: 'from-emerald-50', right: 'from-white' };

  // Pause marquee on card hover
  const [isPaused, setIsPaused] = useState(false);

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
    setOwnSubmitted(true);
  };

  return (
    <section className={`${colors.bg} py-16 sm:py-20 overflow-hidden`}>
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
      </div>

      {/* Infinite Scroll Testimonials Marquee (Right to Left) */}
      <style>{`
        @keyframes testimonials-scroll {
          from { transform: translateX(0%); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="relative w-full overflow-hidden py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient edges */}
        <div className={`absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r ${gradients.left} to-transparent pointer-events-none z-content`} />
        <div className={`absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l ${gradients.right} to-transparent pointer-events-none z-content`} />

        <div
          className="flex gap-6 w-max px-4"
          style={{
            animation: 'testimonials-scroll 35s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {/* List 1 */}
          <div className="flex gap-6 shrink-0">
            {testimonials.map((t, i) => (
              <motion.div
                key={`l1-${i}`}
                className={`${colors.cardBg} w-[290px] sm:w-[360px] rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30 shrink-0 flex flex-col justify-between cursor-default`}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: '0 24px 48px rgba(0,0,0,0.13), 0 4px 16px rgba(16,185,129,0.10)',
                  y: -4,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <div>
                  <HugeiconsIcon icon={QuoteUpIcon} className={`h-5 w-5 mb-3 ${colors.accent} opacity-60`} />
                  <p className={`text-sm leading-relaxed mb-4 ${colors.text} opacity-90`}>{t.text}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <HugeiconsIcon
                        key={j}
                        icon={StarIcon}
                        className={`h-4 w-4 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm shrink-0">
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${colors.text}`}>{t.name}</p>
                      <p className={`text-xs truncate ${colors.muted}`}>{t.product}</p>
                    </div>
                  </div>
                  <p className={`text-xs ${colors.muted} italic`}>{t.source}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* List 2 (Duplicate for seamless scroll) */}
          <div className="flex gap-6 shrink-0">
            {testimonials.map((t, i) => (
              <motion.div
                key={`l2-${i}`}
                className={`${colors.cardBg} w-[290px] sm:w-[360px] rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30 shrink-0 flex flex-col justify-between cursor-default`}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: '0 24px 48px rgba(0,0,0,0.13), 0 4px 16px rgba(16,185,129,0.10)',
                  y: -4,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <div>
                  <HugeiconsIcon icon={QuoteUpIcon} className={`h-5 w-5 mb-3 ${colors.accent} opacity-60`} />
                  <p className={`text-sm leading-relaxed mb-4 ${colors.text} opacity-90`}>{t.text}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <HugeiconsIcon
                        key={j}
                        icon={StarIcon}
                        className={`h-4 w-4 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm shrink-0">
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${colors.text}`}>{t.name}</p>
                      <p className={`text-xs truncate ${colors.muted}`}>{t.product}</p>
                    </div>
                  </div>
                  <p className={`text-xs ${colors.muted} italic`}>{t.source}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5">
        {/* Sección "Comparte tu experiencia" */}
        {showForm && (
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
                          <HugeiconsIcon
                            icon={StarIcon}
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
                    <HugeiconsIcon icon={SentIcon} className="h-4 w-4 mr-2" />
                    Enviar reseña
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
