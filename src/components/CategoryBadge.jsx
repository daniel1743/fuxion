import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const getCategoryColor = (category) => {
  switch (category) {
    case 'Salud Digestiva':
    case 'Microbioma':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800/30';
    case 'Hígado Graso':
    case 'Salud Hepática':
      return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800/30';
    case 'Estrés y Sueño':
    case 'Salud Emocional':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-800/30';
    case 'Grasa Corporal':
    case 'Control de Peso':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-400 dark:border-orange-800/30';
    case 'Metabolismo':
    case 'Energía':
      return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800/30';
    case 'Nutrición Celular':
    case 'Nutrición':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-400 dark:border-cyan-800/30';
    case 'Belleza y Piel':
    case 'Belleza':
      return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-900/40 dark:text-fuchsia-400 dark:border-fuchsia-800/30';
    case 'Inmunidad':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800/30';
    case 'Ejercicio':
      return 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/40 dark:text-violet-400 dark:border-violet-800/30';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-700/50';
  }
};

const CategoryBadge = ({ category, className, variant = 'outline', ...props }) => {
  // Solo aplicamos color personalizado si es variante outline o default sin sobreescribir mucho
  const colorClass = getCategoryColor(category);

  return (
    <Badge 
      variant={variant} 
      className={cn(variant !== 'secondary' ? colorClass : '', className, 'border')}
      {...props}
    >
      {category}
    </Badge>
  );
};

export default CategoryBadge;
