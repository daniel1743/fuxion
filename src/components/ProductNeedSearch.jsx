import React, { useEffect, useRef, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SUGGESTIONS = [
  'bienestar hepático',
  'bajar de peso',
  'abdomen hinchado',
  'estrés',
  'digestión',
  'energía',
  'defensas',
  'desintoxicación',
  'vitaminas',
  'rendimiento'
];

const ProductNeedSearch = ({
  initialValue = '',
  onSearch,
  compact = false,
  className = ''
}) => {
  const [value, setValue] = useState(initialValue);
  const scrollRef = useRef(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId;
    let scrollPos = 0;
    const speed = 0.5; // pixels per frame

    const scroll = () => {
      scrollPos += speed;
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = value.trim();
    if (query && onSearch) {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`mx-auto w-full max-w-3xl rounded-2xl border border-emerald-100 bg-white p-2 shadow-lg shadow-emerald-900/5 dark:border-emerald-900 dark:bg-card ${className}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-700 dark:text-emerald-300" />
          <input
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder=""
            className={`w-full rounded-xl border border-transparent bg-emerald-50/70 pl-12 pr-4 text-foreground outline-none transition focus:border-emerald-300 focus:bg-white dark:bg-secondary/60 dark:focus:bg-card ${
              compact ? 'h-12 text-sm' : 'h-14 text-base'
            }`}
            aria-label="Buscar productos por necesidad"
          />
          {/* Infinite scroll suggestions inside the input - decorative only */}
          {!compact && (
            <div
              className="pointer-events-none absolute inset-y-0 left-12 right-4 flex items-center overflow-hidden select-none"
              aria-hidden="true"
            >
              <div
                ref={scrollRef}
                className="flex items-center gap-3 overflow-x-hidden whitespace-nowrap text-xs text-emerald-600/45 font-light"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Duplicate for seamless loop */}
                {[...SUGGESTIONS, ...SUGGESTIONS].map((suggestion, i) => (
                  <span
                    key={`${suggestion}-${i}`}
                    className="shrink-0"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button type="submit" className={`${compact ? 'h-12' : 'h-14'} bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl px-5`}>
          Ver productos
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ProductNeedSearch;
