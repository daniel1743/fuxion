import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Leaf, Sparkles, ShieldCheck, Truck, Heart, Zap, Target, Dumbbell, Shield, Star, Brain, Footprints } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { buildStoreSchema, buildOrganizationSchema, getAllProducts, SITE_URL } from '@/lib/productSeo';
import MobileAppShell from '@/components/mobile/MobileAppShell';

const iconMap = {
  digestion: <Leaf className="w-8 h-8 text-emerald-600" />,
  energia: <Zap className="w-8 h-8 text-emerald-600" />,
  peso: <Target className="w-8 h-8 text-emerald-600" />,
  proteinas: <Dumbbell className="w-8 h-8 text-emerald-600" />,
  inmune: <Shield className="w-8 h-8 text-emerald-600" />,
  belleza: <Star className="w-8 h-8 text-emerald-600" />,
  mental: <Brain className="w-8 h-8 text-emerald-600" />,
  deportes: <Footprints className="w-8 h-8 text-emerald-600" />,
};

const ProductosFuxionPage = () => {
  const allProducts = getAllProducts();

  const categories = [
    { name: 'Digestión y Bienestar', slug: 'limpieza-desintoxicacion', iconKey: 'digestion' },
    { name: 'Energía Natural', slug: 'energia-natural', iconKey: 'energia' },
    { name: 'Control de Peso', slug: 'control-peso', iconKey: 'peso' },
    { name: 'Proteínas y Nutrición', slug: 'proteinas-nutricion', iconKey: 'proteinas' },
    { name: 'Sistema Inmune', slug: 'sistema-inmune', iconKey: 'inmune' },
    { name: 'Anti-Edad y Belleza', slug: 'anti-edad-belleza', iconKey: 'belleza' },
    { name: 'Vigor Mental', slug: 'vigor-mental', iconKey: 'mental' },
    { name: 'Deportes', slug: 'deportes', iconKey: 'deportes' },
  ];

  const featuredProducts = allProducts.slice(0, 6);

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="overflow-x-hidden"
    >
      <SEO
        title="Productos FuXion Chile — Catálogo completo de nutracéuticos"
        description="Catálogo completo de productos FuXion en Chile. Encuentra nutracéuticos para digestión, energía, control de peso, defensas, belleza, deporte y más. Asesoría personalizada."
        canonical="/productos-fuxion-chile"
        schema={[buildStoreSchema(), buildOrganizationSchema()]}
      />

      {/* ── MOBILE SHELL ── */}
      <div className="md:hidden">
        <MobileAppShell 
          variant="compact"
          title="Catálogo FuXion"
          description="Encuentra nutracéuticos para tu bienestar."
          showSearch={true}
        />
      </div>

      {/* Hero Section */}
      <section className="hidden md:flex relative min-h-[60vh] items-center overflow-hidden pt-28 bg-gradient-to-br from-[#f0faf4] via-white to-[#e8f5e9] dark:from-[#0f1f18] dark:via-[#111827] dark:to-[#1b1630]">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12">
          <div className="max-w-3xl">
            <motion.p
              className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 mb-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Catálogo completo · Productos FuXion en Chile
            </motion.p>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Productos FuXion Chile — Nutrición, bienestar y control de peso
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Descubre el catálogo completo de productos FuXion en Chile. Encuentra soluciones 
              nutracéuticas para digestión, energía natural, control de peso, defensas, belleza, 
              deporte y bienestar general. Todos nuestros productos se venden con asesoría 
              personalizada por WhatsApp y envíos a todo Chile.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Button asChild size="lg">
                <Link to="/explorar">
                  Ver todos los productos <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contacto">
                  Hablar con un asesor
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="w-full max-w-6xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />, title: 'Compra asistida', text: 'Te orientamos antes de comprar para elegir el producto adecuado.' },
            { icon: <Leaf className="h-5 w-5 text-emerald-600" />, title: 'Productos originales', text: '100% FuXion Biotech, con asesoría y seguimiento personalizado.' },
            { icon: <Truck className="h-5 w-5 text-emerald-600" />, title: 'Envíos a todo Chile', text: 'Coordinamos despacho vía WhatsApp después de tu pedido.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-white dark:bg-card border border-border p-4 flex items-center gap-3 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories grid */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-center mb-4">
          Categorías de productos FuXion
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          Explora nuestras categorías para encontrar el producto FuXion que mejor se adapte a tu objetivo de bienestar.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categoria/${cat.slug}`}
              className="group rounded-2xl border border-border bg-card p-5 text-center transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <span className="flex justify-center mb-3">{iconMap[cat.iconKey]}</span>
              <h3 className="font-bold text-foreground group-hover:text-primary text-sm">
                {cat.name}
              </h3>
            </Link>
          ))}

        </div>
      </section>

      {/* Featured products */}
      <section className="w-full bg-secondary/30 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-center mb-4">
            Productos destacados FuXion
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            Estos son algunos de los productos más consultados de nuestro catálogo. Cada uno tiene una ficha completa con beneficios, ingredientes y modo de uso.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.slug}
                to={`/producto/${product.slug}`}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <h3 className="font-bold text-foreground group-hover:text-primary">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                <p className="mt-3 font-bold text-primary">
                  ${product.price.toLocaleString('es-CL')}
                </p>
                <p className="mt-4 text-sm font-semibold text-primary group-hover:underline">
                  Ver ficha completa →
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link to="/explorar">
                Ver catálogo completo <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why FuXion section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-center mb-4">
          ¿Por qué elegir productos FuXion?
        </h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-10">
          Los productos FuXion están formulados con ingredientes naturales y respaldados por investigación en nutracéuticos. 
          Cada producto tiene un enfoque específico para acompañar tu rutina de bienestar.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Ingredientes naturales', text: 'Formulaciones con superfoods, aminoácidos, vitaminas y minerales orgánicos de origen natural.' },
            { title: 'Enfoque preventivo', text: 'Diseñados para acompañar hábitos saludables, no para reemplazar una alimentación equilibrada.' },
            { title: 'Asesoría personalizada', text: 'Cada compra incluye orientación de un asesor para elegir el producto según tu objetivo.' },
            { title: 'Respaldo FuXion Biotech', text: 'Marca con presencia global en nutracéuticos, con más de 20 años de investigación.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 rounded-2xl border border-border bg-card p-6">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Recibe asesoría personalizada para encontrar el producto FuXion ideal para ti. 
            Envíos a todo Chile con coordinación vía WhatsApp.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50">
              <Link to="/explorar">Ver productos</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
              <Link to="/contacto">Contactar asesor</Link>
            </Button>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default ProductosFuxionPage;
