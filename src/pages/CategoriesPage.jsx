
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Flame, Droplets, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

// Mapeo de categorías amigables a categorías reales de la base de datos
const categories = [
  {
    name: 'Limpieza y Desintoxicación',
    slug: 'limpieza-desintoxicacion',
    icon: <Droplets size={40} />,
    description: 'Productos para limpiar colon, sistema digestivo, hígado, sangre y vías urinarias.',
    categoriasDB: [
      'Limpieza del Colon',
      'Limpieza del Sistema Digestivo',
      'Regeneración Flora Intestinal',
      'Limpieza Vías Urinarias',
      'Limpieza de Sangre',
      'Limpieza Hígado y Sistema Hepatobiliar'
    ]
  },
  {
    name: 'Proteínas y Nutrición',
    slug: 'proteinas-nutricion',
    icon: <Activity size={40} />,
    description: 'Proteínas premium, vegetales e hidratación nutricional para toda la familia.',
    categoriasDB: [
      'Proteína Premium con Colostrum',
      'Proteína 100% Vegetal',
      'Hidratación Nutricional para la Familia'
    ]
  },
  {
    name: 'Energía Natural',
    slug: 'energia-natural',
    icon: <Flame size={40} />,
    description: 'Energizantes naturales y multivitamínicos para revitalizar tu día.',
    categoriasDB: [
      'Energizante Natural',
      'Multivitamínico Energizante'
    ]
  },
  {
    name: 'Sistema Inmune',
    slug: 'sistema-inmune',
    icon: <ShieldCheck size={40} />,
    description: 'Productos que fortalecen las defensas y protegen el sistema inmunológico.',
    categoriasDB: [
      'Inmunológica - Defensas'
    ]
  },
  {
    name: 'Control de Peso',
    slug: 'control-peso',
    icon: <Activity size={40} />,
    description: 'Productos especializados para control de peso y aceleración del metabolismo.',
    categoriasDB: [
      'Control de Peso'
    ]
  },
  {
    name: 'Anti-Edad y Belleza',
    slug: 'anti-edad-belleza',
    icon: <Sparkles size={40} />,
    description: 'Productos para retrasar el envejecimiento y mejorar la belleza desde adentro.',
    categoriasDB: [
      'Anti-Edad'
    ]
  },
  {
    name: 'Vigor Mental',
    slug: 'vigor-mental',
    icon: <Activity size={40} />,
    description: 'Productos para mejorar concentración, memoria y reducir estrés.',
    categoriasDB: [
      'Vigor Mental'
    ]
  },
  {
    name: 'Deportes',
    slug: 'deportes',
    icon: <Activity size={40} />,
    description: 'Productos especializados para atletas y deportistas.',
    categoriasDB: [
      'Sport'
    ]
  },
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
              <Link to={`/explorar?categoria=${category.slug}`}>
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
