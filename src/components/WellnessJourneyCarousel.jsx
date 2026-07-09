import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getImageUrl, getPlaceholderImage } from '@/lib/imageUtils';
import { slugifyProduct } from '@/lib/productSeo';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Leaf, Heart, Users } from 'lucide-react';

/* ─────────────────────────────────────────────
   Wellness Journey Carousel — FuXion Premium 2026
   Mobile-first, app-like cards with hero imagery,
   smooth transitions, and gentle autoplay.
   ───────────────────────────────────────────── */

const SLIDES = [
  {
    id: 'digestive',
    image: '/img/floraliv carrusel.png',
    category: 'Bienestar digestivo',
    title: 'Equilibra tu bienestar desde adentro 🌱',
    description:
      'Acompaña tu rutina digestiva con productos pensados para apoyar equilibrio y bienestar diario.',
    productMain: 'Flora Liv',
    related: ['Prunex 1', 'Liquid Fiber', 'Berry Balance'],
    action: 'Descubrir línea digestiva',
    icon: <Leaf className="w-5 h-5" />,
    gradient: 'from-emerald-500/20 via-emerald-400/5 to-transparent',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    dotActiveClass: 'w-8 bg-emerald-500 dark:bg-emerald-400 shadow-sm',
  },
  {
    id: 'internal',
    image: '/img/rexet carrusel.png',
    category: 'Equilibrio interno',
    title: 'Equilibrio diario desde tu interior ✨',
    description:
      'Complementa tus hábitos diarios con una fórmula FuXion creada para acompañar el bienestar interno.',
    productMain: 'Rexet',
    related: ['Vita Xtra T+', 'Alpha Balance', 'Nutraday'],
    action: 'Conocer más',
    icon: <Sparkles className="w-5 h-5" />,
    gradient: 'from-amber-500/20 via-amber-400/5 to-transparent',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    dotActiveClass: 'w-8 bg-amber-500 dark:bg-amber-400 shadow-sm',
  },
  {
    id: 'beauty',
    image: '/img/beauty-in carrusel.png',
    category: 'Belleza desde adentro',
    title: 'Tu cuidado también empieza desde dentro 💜',
    description:
      'Descubre productos de nutricosmética creados para complementar tu rutina de belleza y bienestar.',
    productMain: 'Beauty In',
    related: ['Youth Elixir', 'Probal', 'Golden FLX'],
    action: 'Explorar belleza',
    icon: <Heart className="w-5 h-5" />,
    gradient: 'from-rose-500/20 via-rose-400/5 to-transparent',
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    dotActiveClass: 'w-8 bg-rose-500 dark:bg-rose-400 shadow-sm',
  },
  {
    id: 'community',
    image: '/img/otra imagen.png',
    category: 'Comunidad FuXion 🌎',
    title: 'Más que productos, una comunidad',
    description:
      'Descubre un proyecto donde bienestar, aprendizaje y emprendimiento pueden crecer juntos.',
    productMain: null,
    related: [],
    action: 'Conocer oportunidad FuXion',
    icon: <Users className="w-5 h-5" />,
    gradient: 'from-sky-500/20 via-sky-400/5 to-transparent',
    badgeClass: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    dotActiveClass: 'w-8 bg-sky-500 dark:bg-sky-400 shadow-sm',
    destination: '/oportunidad-fuxion',
  },
];

const AUTOPLAY_INTERVAL = 7000;
const SWIPE_THRESHOLD = 50;

/* ─── Slide indicator dot ─── */
const Dot = ({ active, onClick, dotActiveClass }) => (
  <button
    onClick={onClick}
    aria-label={`Ir al slide ${active ? 'actual' : ''}`}
    className={`relative h-2 rounded-full transition-all duration-500 ease-out cursor-pointer ${
      active ? dotActiveClass : 'w-2 bg-foreground/20 hover:bg-foreground/40'
    }`}
  />
);

/* ─── Main Carousel ─── */
const WellnessJourneyCarousel = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedSlide, setExpandedSlide] = useState(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef(null);

  const slide = SLIDES[current];

  /* ── Autoplay ── */
  useEffect(() => {
    if (isPaused || expandedSlide !== null) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, expandedSlide]);

  const goTo = useCallback(
    (index) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  /* ── Swipe handlers ── */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) next();
      else prev();
    }
    setTimeout(() => setIsPaused(false), 3000);
  };

  /* ── Variants ── */
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.96,
    }),
  };

  const handleAction = () => {
    if (slide.destination) {
      navigate(slide.destination);
    } else {
      setExpandedSlide(expandedSlide === current ? null : current);
    }
  };

  const handleProductClick = (productName) => {
    const slug = slugifyProduct(productName);
    navigate(`/producto/${slug}`);
  };

  const handleAskAssistant = (productName) => {
    window.dispatchEvent(
      new CustomEvent('fuxion:open-product-ai', {
        detail: {
          product: {
            name: productName,
            slug: slugifyProduct(productName),
            categoria: slide.category,
          },
        },
      })
    );
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-background py-8 md:py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Wellness Journey — descubre tu bienestar con FuXion"
      aria-roledescription="carrusel"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Wellness Journey
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
              ¿Qué necesitas hoy?
            </h2>
          </div>

          {/* Desktop arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={prev}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              aria-label="Anterior slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              aria-label="Siguiente slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Carousel track ── */}
        <div className="relative overflow-hidden rounded-3xl">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
              }}
              className="relative"
            >
              {/* ── Card ── */}
              <div className="relative rounded-3xl overflow-hidden bg-card border border-border/60 shadow-xl hover:shadow-2xl transition-shadow duration-500">
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} pointer-events-none`}
                />

                <div className="relative grid md:grid-cols-2 gap-0">
                  {/* ── Image side ── */}
                  <div className="relative h-64 md:h-full min-h-[280px] md:min-h-[420px] overflow-hidden">
                    <img
                      src={getImageUrl(slide.image)}
                      alt={slide.category}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = getPlaceholderImage('wellness');
                      }}
                      loading="eager"
                    />
                    {/* Gradient overlay on image for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-black/30 md:via-transparent md:to-transparent" />

                    {/* Category badge on image (mobile) */}
                    <div className="absolute top-4 left-4 md:hidden">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-foreground shadow-sm">
                        {slide.icon}
                        {slide.category}
                      </span>
                    </div>
                  </div>

                  {/* ── Content side ── */}
                  <div className="relative flex flex-col justify-between p-6 md:p-10 lg:p-12 h-full">
                    {/* Category badge (desktop) */}
                    <div className="hidden md:flex items-center gap-2 mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${slide.badgeClass}`}
                      >
                        {slide.icon}
                        {slide.category}
                      </span>
                    </div>

                    {/* Content wrapper - takes available space */}
                    <div className="flex-1">
                      {/* Title */}
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight mb-3">
                        {slide.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 max-w-lg">
                        {slide.description}
                      </p>
                    </div>

                    {/* Action button - pushed to bottom */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                      <Button
                        size="lg"
                        onClick={handleAction}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-premium-soft hover:shadow-md transition-all duration-300"
                      >
                        {slide.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    {/* ── Expanded product detail ── */}
                    <AnimatePresence>
                      {expandedSlide === current && slide.productMain && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                          className="overflow-hidden mt-6 pt-6 border-t border-border/50"
                        >
                          <div className="space-y-4">
                            {/* Main product */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                Producto principal
                              </p>
                              <button
                                onClick={() => handleProductClick(slide.productMain)}
                                className="text-lg font-bold text-primary hover:text-primary/80 transition-colors text-left"
                              >
                                {slide.productMain}
                              </button>
                            </div>

                            {/* Related products */}
                            {slide.related.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                  Complementan tu rutina
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {slide.related.map((name) => (
                                    <button
                                      key={name}
                                      onClick={() => handleProductClick(name)}
                                      className="inline-flex items-center rounded-full bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors border border-border/40"
                                    >
                                      {name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleProductClick(slide.productMain)}
                              >
                                Ver producto
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleAskAssistant(slide.productMain)}
                                className="text-primary"
                              >
                                Preguntar al asistente
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Indicators ── */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {SLIDES.map((s, i) => (
            <Dot
              key={s.id}
              active={i === current}
              dotActiveClass={s.dotActiveClass}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        {/* ── Slide counter ── */}
        <p className="text-center text-xs text-muted-foreground mt-3 font-medium">
          {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </p>
      </div>
    </section>
  );
};

export default WellnessJourneyCarousel;
