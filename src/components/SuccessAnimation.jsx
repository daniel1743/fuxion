import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

/**
 * SuccessAnimation — Elegant animated checkmark for form submissions.
 * Premium, minimal, non-infantile.
 */
const SuccessAnimation = ({ size = 'default' }) => {
  const sizeClasses = size === 'lg'
    ? 'w-20 h-20'
    : 'w-16 h-16';

  const iconSize = size === 'lg'
    ? 'w-10 h-10'
    : 'w-8 h-8';

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="mb-6"
    >
      <div className={`${sizeClasses} rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto`}>
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CheckCircle2 className={`${iconSize} text-emerald-600 dark:text-emerald-400`} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SuccessAnimation;
