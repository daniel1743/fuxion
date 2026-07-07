import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { fireElegantConfetti } from '@/lib/confetti';

/**
 * CelebrationOverlay — Elegant celebration for important events.
 * Shows a brief overlay with confetti.
 * Used ONLY for: opportunity form submitted, advisor request, purchase completed.
 */
const CelebrationOverlay = ({ show, onComplete, title, message }) => {
  useEffect(() => {
    if (show) {
      fireElegantConfetti();
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-card/95 backdrop-blur-sm border border-emerald-100 dark:border-border rounded-2xl p-8 md:p-10 shadow-2xl text-center max-w-sm mx-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20 flex items-center justify-center mx-auto mb-5"
            >
              <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {title || '¡Celebración!'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {message || ''}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationOverlay;
