/**
 * BAIOS - Editor IA
 * EditorDashboard Component
 * Phase 1: Skeleton only. No business logic, no real data, no API calls.
 *
 * Bento Grid layout with spring-animated cards.
 * Uses Framer Motion for entrance animations.
 */

import { useState, type FC } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { BentoCard } from '../components/BentoCard';
import type { EditorDashboardState, EditorView } from '../../types';

const INITIAL_STATE: EditorDashboardState = {
  activeView: 'dashboard',
  sidebarCollapsed: false,
};

const SECTION_TITLES: Record<EditorView, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Editor IA',
    subtitle: 'Panel de control editorial',
  },
  'knowledge-base': {
    title: 'Base de Conocimiento',
    subtitle: 'Fuentes científicas y referencias',
  },
  'editorial-engine': {
    title: 'Motor Editorial',
    subtitle: 'Creación y revisión de contenido',
  },
  'media-manager': {
    title: 'Gestión de Medios',
    subtitle: 'Biblioteca de activos visuales',
  },
  'queue-system': {
    title: 'Sistema de Colas',
    subtitle: 'Planificación y programación',
  },
  publisher: {
    title: 'Publicador',
    subtitle: 'Distribución y publicación',
  },
};

const springConfig = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 20,
  mass: 0.8,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springConfig,
  },
};

export const EditorDashboard: FC = () => {
  const [state, setState] = useState<EditorDashboardState>(INITIAL_STATE);

  const handleNavigate = (section: EditorView): void => {
    setState((prev) => ({
      ...prev,
      activeView: section,
    }));
  };

  const handleToggle = (): void => {
    setState((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  };

  const activeSection = SECTION_TITLES[state.activeView] ?? SECTION_TITLES.dashboard;

  return (
    <div className="flex h-screen w-full bg-neutral-50">
      <Sidebar
        activeSection={state.activeView}
        collapsed={state.sidebarCollapsed}
        onNavigate={handleNavigate}
        onToggle={handleToggle}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={activeSection.title} subtitle={activeSection.subtitle} />

        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Placeholder Bento Cards for skeleton layout */}
            <motion.div className="col-span-1 row-span-1" variants={cardVariants}>
              <BentoCard
                title="Artículos en Progreso"
                description="Contenido editorial en desarrollo."
                size="sm"
              />
            </motion.div>

            <motion.div className="col-span-1 row-span-1" variants={cardVariants}>
              <BentoCard
                title="Fuentes Científicas"
                description="Base de conocimiento referenciada."
                size="sm"
              />
            </motion.div>

            <motion.div className="col-span-1 row-span-1" variants={cardVariants}>
              <BentoCard
                title="Cola de Publicación"
                description="Contenido programado para salida."
                size="sm"
              />
            </motion.div>

            <motion.div className="col-span-1 row-span-1" variants={cardVariants}>
              <BentoCard
                title="Activos Multimedia"
                description="Imágenes y gráficos disponibles."
                size="sm"
              />
            </motion.div>

            <motion.div className="col-span-2 row-span-2" variants={cardVariants}>
              <BentoCard
                title="Calidad Editorial"
                description="Puntuación promedio de calidad del contenido."
                size="lg"
              />
            </motion.div>

            <motion.div className="col-span-1 row-span-2" variants={cardVariants}>
              <BentoCard
                title="Distribución"
                description="Formatos y canales de publicación."
                size="md"
              />
            </motion.div>

            <motion.div className="col-span-1 row-span-1" variants={cardVariants}>
              <BentoCard
                title="Revisión IA"
                description="Artículos pendientes de revisión automatizada."
                size="sm"
              />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};