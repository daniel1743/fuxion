
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Cpu, Gamepad2, Lamp, Sparkles, Tv, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const categories = [
  { name: 'Electrónica', slug: 'electronica', icon: <Cpu size={40} />, description: 'Lo último en procesadores, placas base y más.' },
  { name: 'Casa & Deco', slug: 'casa-deco', icon: <Tv size={40} />, description: 'Gadgets para un hogar inteligente y con estilo.' },
  { name: 'Gaming', slug: 'gaming', icon: <Gamepad2 size={40} />, description: 'Periféricos y accesorios para llevar tu juego al siguiente nivel.' },
  { name: 'Moda Tech', slug: 'moda-tech', icon: <Sparkles size={40} />, description: 'Wearables y accesorios que combinan estilo y tecnología.' },
  { name: 'Iluminación', slug: 'iluminacion', icon: <Lamp size={40} />, description: 'Soluciones de iluminación inteligente para cada ambiente.' },
];

const CategoriesPage = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleNotImplemented = (e) => {
    e.preventDefault();
    toast({ description: "🚧 ¡Esta función aún no está implementada! 🚀" });
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 py-28"
    >
      <Helmet>
        <title>Categorías — Fuxion Shop</title>
        <meta name="description" content="Explora todas las categorías de productos en Fuxion Shop." />
      </Helmet>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tighter">Categorías</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          Encuentra exactamente lo que buscas navegando por nuestras colecciones.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((category, i) => (
          <motion.section
            key={category.slug}
            id={category.slug}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 rounded-xl bg-card border border-border shadow-lg"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-primary">{React.cloneElement(category.icon, { size: 60 })}</div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-foreground">{category.name}</h2>
                <p className="text-muted-foreground mt-2">{category.description}</p>
              </div>
              <Link to="/explorar" onClick={handleNotImplemented}>
                <Button variant="outline" className="mt-4 md:mt-0">
                  Ver productos <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoriesPage;
