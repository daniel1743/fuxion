import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getImageUrl, getPlaceholderImage } from '@/lib/imageUtils';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Leaf01Icon,
  SparklesIcon,
  HeartIcon,
  UserGroupIcon,
  ArrowRight02Icon,
} from '@hugeicons/core-free-icons';

/* ─────────────────────────────────────────────
   Wellness Journey Grid — FuXion 2026
   Modern, responsive 4-card layout.
   Mobile: 2x2 grid of small clickable cards (no swiping).
   Desktop: Clean 4-column card grid.
   ───────────────────────────────────────────── */

const SLIDES = [
  {
    id: 'digestive',
    image: '/img/floraliv carrusel.png',
    category: 'Bienestar digestivo',
    title: 'Equilibra tu bienestar desde adentro 🌱',
    description: 'Acompaña tu rutina digestiva con productos pensados para apoyar equilibrio y bienestar diario.',
    action: 'Descubrir Flora Liv',
    icon: Leaf01Icon,
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30',
    destination: '/producto/flora-liv'
  },
  {
    id: 'internal',
    image: '/img/rexet carrusel.png',
    category: 'Equilibrio interno',
    title: 'Equilibrio diario desde tu interior ✨',
    description: 'Complementa tus hábitos diarios con una fórmula FuXion creada para acompañar el bienestar interno.',
    action: 'Descubrir Rexet',
    icon: SparklesIcon,
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30',
    destination: '/producto/rexet'
  },
  {
    id: 'beauty',
    image: '/img/beauty-in carrusel.png',
    category: 'Belleza desde adentro',
    title: 'Tu cuidado también empieza desde dentro 💜',
    description: 'Descubre productos de nutricosmética creados para complementar tu rutina de belleza y bienestar.',
    action: 'Descubrir Beauty In',
    icon: HeartIcon,
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30',
    destination: '/producto/beauty-in'
  },
  {
    id: 'community',
    image: '/img/otra imagen.png',
    category: 'Comunidad FuXion 🌎',
    title: 'Más que productos, una comunidad',
    description: 'Descubre un proyecto donde bienestar, aprendizaje y emprendimiento pueden crecer juntos.',
    action: 'Conocer oportunidad',
    icon: UserGroupIcon,
    badgeClass: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30',
    destination: '/oportunidad-fuxion',
  },
];

const WellnessJourneyCarousel = () => {
  const navigate = useNavigate();

  return (
    <section 
      className="relative w-full overflow-hidden bg-background py-8 md:py-12"
      aria-label="¿Qué necesitas hoy?"
    >
      <div className="max-w-6xl mx-auto">
        <div className="px-4 md:px-6 mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            ¿Qué necesitas hoy?
          </h2>
        </div>

        {/* ── Mobile Layout: 2x2 Grid of clickable cards ── */}
        <div className="md:hidden grid grid-cols-2 gap-3.5 px-4 pb-6">
          {SLIDES.map((slide) => (
            <motion.button
              key={slide.id}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={() => navigate(slide.destination)}
              className="flex flex-col justify-between bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm p-3 text-left w-full h-full active:shadow-inner"
            >
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2.5 shrink-0">
                <img
                  src={getImageUrl(slide.image)}
                  alt={slide.category}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage('wellness');
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[95px]">
                <div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${slide.badgeClass} mb-1.5`}>
                    <HugeiconsIcon icon={slide.icon} className="w-3 h-3" />
                    {slide.category}
                  </span>
                  <h3 className="text-[12px] font-bold text-[#2d2d2d] dark:text-gray-200 leading-snug line-clamp-2 mb-1">
                    {slide.title}
                  </h3>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2 mt-auto">
                  {slide.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Desktop Layout: Premium 4-Column Grid ── */}
        <div className="hidden md:grid grid-cols-4 gap-6 px-6">
          {SLIDES.map((slide) => (
            <div
              key={slide.id}
              className="flex flex-col justify-between bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/20 dark:hover:border-emerald-400/20 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={getImageUrl(slide.image)}
                  alt={slide.category}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage('wellness');
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${slide.badgeClass} backdrop-blur-sm bg-white/95 dark:bg-[#0f1f18]/90`}>
                    <HugeiconsIcon icon={slide.icon} className="w-3.5 h-3.5" />
                    {slide.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground leading-snug mb-2 min-h-[2.75rem] line-clamp-2">
                    {slide.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed min-h-[3rem] line-clamp-3">
                    {slide.description}
                  </p>
                </div>

                <Button
                  onClick={() => navigate(slide.destination)}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-10 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span>{slide.action}</span>
                  <HugeiconsIcon icon={ArrowRight02Icon} className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WellnessJourneyCarousel;
