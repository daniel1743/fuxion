/**
 * BAIOS - Editor IA
 * BentoCard Component
 * Phase 1: Skeleton only. No business logic, no real data, no API calls.
 */

import { type ReactNode } from 'react';

export interface BentoCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
}

const sizeClasses: Record<NonNullable<BentoCardProps['size']>, string> = {
  sm: 'col-span-1 row-span-1',
  md: 'col-span-1 row-span-2',
  lg: 'col-span-2 row-span-2',
};

export function BentoCard({
  title,
  description,
  icon,
  size = 'sm',
  className = '',
  children,
}: BentoCardProps): JSX.Element {
  return (
    <article
      className={[
        'rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md',
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
          {icon}
        </div>
      )}

      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-sm text-neutral-500">{description}</p>

      {children && <div className="mt-4">{children}</div>}
    </article>
  );
}