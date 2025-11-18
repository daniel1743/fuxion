
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Construction } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 0.95 },
};

const PlaceholderPage = ({ pageName }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center px-6"
    >
      <Helmet>
        <title>{pageName} — Fuxion Shop</title>
      </Helmet>
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
      >
        <Construction className="h-24 w-24 text-primary" />
      </motion.div>
      <h1 className="mt-8 text-4xl font-extrabold text-foreground tracking-tighter">
        ¡{pageName} en Construcción!
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Estamos trabajando para traer esta sección a la vida. ¡Vuelve pronto para ver las novedades!
      </p>
      <Link to="/" className="mt-8">
        <Button>Volver al Inicio</Button>
      </Link>
    </motion.div>
  );
};

export default PlaceholderPage;
