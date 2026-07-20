/**
 * BAIOS - Editor IA
 * Header Component
 * Phase 1: Skeleton only. No business logic, no real data, no API calls.
 */

import { type FC } from 'react';

export interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Placeholder for future actions (e.g., user avatar, settings) */}
        <div className="h-9 w-9 rounded-full bg-neutral-200" />
      </div>
    </header>
  );
};