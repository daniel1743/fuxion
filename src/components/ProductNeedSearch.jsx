import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';

const ProductNeedSearch = ({
  initialValue = '',
  onSearch,
  compact = false,
  className = ''
}) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

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
      className={`w-full rounded-full border border-emerald-100 bg-white p-2 shadow-lg shadow-emerald-900/5 dark:border-emerald-900 dark:bg-card ${className}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-700 dark:text-emerald-300" />
          <input
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Buscar productos, beneficios o ingredientes..."
            className={`w-full rounded-full border border-transparent bg-emerald-50/70 pl-12 pr-4 text-foreground outline-none transition focus:border-emerald-300 focus:bg-white dark:bg-secondary/60 dark:focus:bg-card ${
              compact ? 'h-12 text-sm' : 'h-14 text-base'
            }`}
            aria-label="Buscar productos por necesidad"
          />
        </div>
        <Button type="submit" className={`${compact ? 'h-12' : 'h-14'} bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl px-5 shrink-0`}>
          Comenzar a explorar
          <HugeiconsIcon icon={ArrowRight02Icon} className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ProductNeedSearch;
