import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const PageLoader = () => (
  <div className="w-full min-h-[60vh] flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-emerald-200" />
        <div className="absolute inset-0 rounded-full border-2 border-t-emerald-500 animate-spin" />
        <div className="absolute inset-3 rounded-full bg-emerald-50 flex items-center justify-center">
          <Leaf className="h-5 w-5 text-emerald-500" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium">Cargando...</p>
    </motion.div>
  </div>
);

export default PageLoader;
