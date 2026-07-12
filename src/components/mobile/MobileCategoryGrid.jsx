import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ShoppingBag03Icon,
  Message01Icon,
  HelpCircleIcon,
  Leaf01Icon,
  ChevronRightIcon,
} from '@hugeicons/core-free-icons';

const categories = [
  {
    title: 'Productos',
    icon: ShoppingBag03Icon,
    route: '/explorar',
    color: '#059669',
    bgColor: '#ecfdf5',
  },
  {
    title: 'Testimonios',
    icon: Message01Icon,
    route: '/opiniones',
    color: '#0891b2',
    bgColor: '#ecfeff',
  },
  {
    title: 'Asesoría',
    icon: HelpCircleIcon,
    route: '/ayuda',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
  },
  {
    title: 'Conócenos',
    icon: Leaf01Icon,
    route: '/sobre-nosotros',
    color: '#d97706',
    bgColor: '#fffbeb',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const MobileCategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 pt-6">
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Descubre</h3>
        <button
          onClick={() => navigate('/explorar')}
          className="text-sm font-medium text-emerald-600 active:opacity-70"
        >
          Ver todo &gt;
        </button>
      </div>

      {/* 2×2 Grid */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.title}
            variants={cardVariants}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate(cat.route)}
            className="relative flex flex-col items-start rounded-2xl border border-gray-100/80 bg-white p-5 text-left shadow-md shadow-gray-200/60 transition-all active:shadow-sm"
          >
            {/* Chevron arrow — top-right */}
            <span className="absolute right-4 top-4 text-gray-300">
              <HugeiconsIcon icon={ChevronRightIcon} size={18} />
            </span>

            {/* Icon container */}
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: cat.bgColor }}
            >
              <HugeiconsIcon
                icon={cat.icon}
                size={24}
                style={{ color: cat.color }}
              />
            </div>

            {/* Title */}
            <span className="text-sm font-semibold text-gray-800">
              {cat.title}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
};

export default MobileCategoryGrid;
