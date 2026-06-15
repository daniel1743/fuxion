import React, { useEffect, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductNeedSearch = ({
  initialValue = '',
  onSearch,
  compact = false,
  className = ''
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

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
            placeholder="¿Qué objetivo quieres mejorar? Ej: digestión, energía, estrés, bienestar hepático"
            className={`w-full rounded-xl border border-transparent bg-emerald-50/70 pl-12 pr-4 text-foreground outline-none transition focus:border-emerald-300 focus:bg-white dark:bg-secondary/60 dark:focus:bg-card ${
              compact ? 'h-12 text-sm' : 'h-14 text-base'
            }`}
            aria-label="Buscar productos por necesidad"
          />
        </div>
        <Button type="submit" className={`${compact ? 'h-12' : 'h-14'} gap-2 rounded-xl px-5`}>
          Ver productos
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      {!compact && (
        <div className="flex flex-wrap gap-2 px-2 pb-1 pt-3 text-xs text-muted-foreground">
          <span>Prueba con:</span>
          <button type="button" onClick={() => setValue('bienestar hepático')} className="hover:text-primary">bienestar hepático</button>
          <span>·</span>
          <button type="button" onClick={() => setValue('bajar de peso')} className="hover:text-primary">bajar de peso</button>
          <span>·</span>
          <button type="button" onClick={() => setValue('abdomen hinchado')} className="hover:text-primary">abdomen hinchado</button>
          <span>·</span>
          <button type="button" onClick={() => setValue('estrés')} className="hover:text-primary">estrés</button>
        </div>
      )}
    </form>
  );
};

export default ProductNeedSearch;
