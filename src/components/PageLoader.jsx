import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Leaf01Icon } from '@hugeicons/core-free-icons';

const PageLoader = () => (
  <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center"
    >
      <div className="relative flex items-center justify-center w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-emerald-100 dark:border-emerald-900/50" />
        <div className="absolute inset-0 rounded-full border-2 border-t-emerald-500 border-r-emerald-500 animate-spin" />
        <div className="absolute inset-2.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shadow-inner">
          <HugeiconsIcon icon={Leaf01Icon} className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
      <div className="space-y-3 flex flex-col items-center">
        <div className="h-4 w-32 bg-emerald-100 dark:bg-emerald-900/30 rounded-full animate-pulse" />
        <div className="h-3 w-48 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
        <div className="h-3 w-40 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse opacity-75" />
      </div>
    </motion.div>
  </div>
);

export default PageLoader;
