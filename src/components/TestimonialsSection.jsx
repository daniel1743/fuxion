import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'María García',
    location: 'Santiago',
    rating: 5,
    text: 'Llevo 3 meses tomando Prunex 1 y mi digestión cambió completamente. El equipo de asesoría me ayudó a elegir el producto perfecto para mí.',
    avatar: null,
  },
  {
    name: 'Carlos Mendoza',
    location: 'Valparaíso',
    rating: 5,
    text: 'Thermo T3 me ayudó a complementar mi rutina de ejercicio. Los resultados fueron notables en pocas semanas. Excelente asesoría personalizada.',
    avatar: null,
  },
  {
    name: 'Andrea López',
    location: 'Concepción',
    rating: 5,
    text: 'Me encanta que los productos sean naturales y certificados. Flora Liv me ayudó mucho con mi digestión. 100% recomendado.',
    avatar: null,
  },
  {
    name: 'Roberto Silva',
    location: 'La Serena',
    rating: 5,
    text: 'Vita Xtra T Plus es increíble para la energía diaria. Me levanto con más vitalidad y mis análisis mejoraron. Gracias equipo Fuxion.',
    avatar: null,
  },
  {
    name: 'Patricia Muñoz',
    location: 'Antofagasta',
    rating: 5,
    text: 'La atención por WhatsApp es excelente. Me explicaron cada producto con paciencia y me recomendaron exactamente lo que necesitaba.',
    avatar: null,
  },
  {
    name: 'Felipe Torres',
    location: 'Temuco',
    rating: 5,
    text: 'Probé varios productos antes de encontrar los adecuados. El equipo de asesoría me guió perfectamente hacia la combinación ideal.',
    avatar: null,
  },
];

const TestimonialsSection = ({ title, subtitle, variant = 'default' }) => {
  const colors = variant === 'dark'
    ? { bg: 'bg-gray-900', text: 'text-white', muted: 'text-gray-400', cardBg: 'bg-gray-800', accent: 'text-emerald-400' }
    : { bg: 'bg-gradient-to-b from-emerald-50 to-white', text: 'text-foreground', muted: 'text-muted-foreground', cardBg: 'bg-white', accent: 'text-emerald-600' };

  return (
    <section className={`${colors.bg} py-16 sm:py-20`}>
      <div className="container mx-auto px-5">
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${colors.text}`}>{t.name}</p>
                  <p className={`text-xs ${colors.muted}`}>{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
