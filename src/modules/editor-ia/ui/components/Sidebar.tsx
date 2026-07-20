/**
 * BAIOS - Editor IA
 * Sidebar Component
 * Phase 1: Skeleton only. No business logic, no real data, no API calls.
 */

import { type FC } from 'react';
import type { EditorView } from '../../types';

export interface SidebarNavItem {
  id: EditorView;
  label: string;
  icon: string;
  section: EditorView;
}

export interface SidebarProps {
  activeSection: EditorView;
  collapsed: boolean;
  onNavigate: (section: EditorView) => void;
  onToggle: () => void;
}

const NAV_ITEMS: SidebarNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', section: 'knowledge-base' },
  { id: 'knowledge-base', label: 'Base de Conocimiento', icon: '🧠', section: 'knowledge-base' },
  { id: 'editorial-engine', label: 'Motor Editorial', icon: '✍️', section: 'editorial-engine' },
  { id: 'media-manager', label: 'Gestión de Medios', icon: '🖼️', section: 'media-manager' },
  { id: 'queue-system', label: 'Sistema de Colas', icon: '📋', section: 'queue-system' },
  { id: 'publisher', label: 'Publicador', icon: '🚀', section: 'publisher' },
];

export const Sidebar: FC<SidebarProps> = ({
  activeSection,
  collapsed,
  onNavigate,
  onToggle,
}) => {
  return (
    <aside
      className={[
        'flex h-full flex-col border-r border-neutral-200 bg-neutral-50 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      ].join(' ')}
    >
      {/* Toggle Button */}
      <button
        type="button"
        onClick={onToggle}
        className="flex h-12 items-center justify-center border-b border-neutral-200 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      >
        {collapsed ? '▶' : '◀'}
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={[
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:bg-neutral-200',
                  ].join(' ')}
                >
                  <span className="flex-shrink-0 text-base" aria-hidden="true">
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-neutral-200 p-3">
          <p className="text-xs text-neutral-400">BAIOS Editor IA v0.1.0</p>
        </div>
      )}
    </aside>
  );
};