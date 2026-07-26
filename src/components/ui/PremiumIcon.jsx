import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';

/**
 * PremiumIcon — Wrapper visual premium para iconos importantes.
 *
 * Envuelve cualquier icono (HugeIcons, SVG, etc.) en un círculo verde pastel
 * con sombra suave, hover elegante y estilo wellness app.
 *
 * Props:
 *   icon      - Definición de icono HugeIcons (ej: Leaf01Icon) o componente React (ej: WhatsAppIcon)
 *   size      - 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 *   variant   - 'default' | 'ghost' | 'outline' | 'glow' (default: 'default')
 *   className - clases adicionales para el contenedor
 */
const sizeMap = {
  sm: {
    container: 'w-10 h-10',
    icon: 'w-5 h-5',
  },
  md: {
    container: 'w-14 h-14',
    icon: 'w-7 h-7',
  },
  lg: {
    container: 'w-20 h-20',
    icon: 'w-10 h-10',
  },
  xl: {
    container: 'w-24 h-24',
    icon: 'w-12 h-12',
  },
};

const variantStyles = {
  default:
    'bg-fuxion/10 dark:bg-fuxion/20 text-fuxion shadow-sm',
  ghost:
    'bg-fuxion/5 dark:bg-fuxion/10 text-fuxion',
  outline:
    'border-2 border-fuxion/20 dark:border-fuxion/40 bg-transparent text-fuxion',
  glow:
    'bg-fuxion/10 dark:bg-fuxion/20 text-fuxion shadow-lg shadow-fuxion/30',
};

const PremiumIcon = ({
  icon,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const sizes = sizeMap[size] || sizeMap.md;

  const renderIcon = () => {
    if (!icon) return null;

    // Si icon es una función (componente React como WhatsAppIcon), renderizarlo directamente
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <IconComponent className={sizes.icon} />;
    }

    // Si icon es una definición de HugeIcons (objeto), usar HugeiconsIcon
    return <HugeiconsIcon icon={icon} size={24} />;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={`
        inline-flex items-center justify-center rounded-full
        transition-all duration-300 ease-out
        ${sizes.container}
        ${variantStyles[variant] || variantStyles.default}
        hover:shadow-md hover:bg-fuxion/20 dark:hover:bg-fuxion/30
        hover:border-fuxion/30 dark:hover:border-fuxion/50
        ${className}
      `}
      role="img"
      aria-hidden="true"
    >
      {renderIcon()}
    </motion.div>
  );
};

export default PremiumIcon;
