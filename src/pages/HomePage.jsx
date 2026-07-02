
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Sparkles, Zap, CheckCircle2, MessageCircle, ShoppingCart, ShieldCheck, Truck, Leaf } from 'lucide-react';
import { getImageUrl, getPlaceholderImage } from '@/lib/imageUtils';
import { buildStoreSchema, SITE_URL, STORE_NAME } from '@/lib/productSeo';
import { confirmAndOpenWhatsapp, openWhatsapp } from '@/lib/whatsapp';
import ProductNeedSearch from '@/components/ProductNeedSearch';
import { AiRobotIcon, WhatsAppIcon } from '@/components/icons/BrandIcons';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const handleWhatsAppClick = (message = 'Hola, quiero empezar mi cambio con Fuxion') => {
  openWhatsapp(message);
};

const handleProductAiClick = (product) => {
  window.dispatchEvent(new CustomEvent('fuxion:open-product-ai', {
    detail: {
      product: {
        name: product.name,
        slug: product.slug,
        image: product.image,
        description: product.description,
        categoria: 'Producto destacado Fuxion'
      }
    }
  }));
};

const handleProductWhatsappClick = (product) => {
  confirmAndOpenWhatsapp(`Hola, quiero hablar con un asesor sobre ${product.name}.`);
};

const solutions = [
  {
    id: 1,
    title: 'Desintoxicación suave y digestión',
    subtitle: 'Ideales para quienes buscan apoyar tránsito intestinal, liviandad abdominal y digestión diaria.',
    products: ['Prunex1', 'Flora Liv', 'Liquid Fiber', 'Balance'],
    benefits: [
      'Abdomen más liviano',
      'Mejor digestión',
      'Menos inflamación',
      'Apoyo a rutinas de limpieza digestiva'
    ],
    buttonText: 'Quiero mejorar mi digestión',
    icon: <Sparkles className="w-8 h-8" />
  },
  {
    id: 2,
    title: 'Control de peso y medidas',
    subtitle: 'Pensados para acompañar hábitos de control de peso, comidas y actividad física.',
    products: ['Thermo T3', 'NoCarb-T', 'Protein Active Fit', 'Pack 5/14'],
    benefits: [
      'Apoyo para hábitos de control de peso',
      'Apoyo para ordenar antojos',
      'Acompaña energía diaria',
      'Rutina simple de acompañamiento'
    ],
    buttonText: 'Quiero apoyo para mi objetivo',
    icon: <Zap className="w-8 h-8" />
  },
  {
    id: 3,
    title: 'Energía limpia y vitalidad diaria',
    subtitle: 'Para personas que sienten cansancio, baja energía o quieren mejorar su rutina diaria.',
    products: ['Vita Xtra T+', 'VitaEnergía', 'Nutraday'],
    benefits: [
      'Energía estable',
      'Mejor ánimo',
      'Mayor rendimiento',
      'Vitalidad durante el día'
    ],
    buttonText: 'Quiero más energía',
    icon: <Heart className="w-8 h-8" />
  }
];

const featuredProducts = [
  {
    id: 'prunex-1',
    name: 'PRUNEX 1',
    description: 'Digestión + liviandad',
    image: getImageUrl('/img/productos/prunex-1.png'),
    slug: 'prunex-1'
  },
  {
    id: 'thermo-t3',
    name: 'THERMO T3',
    description: 'Metabolismo + energía',
    image: getImageUrl('/img/productos/thermo-t3.png'),
    slug: 'thermo-t3'
  },
  {
    id: 'vita-xtra-t-plus',
    name: 'VITA XTRA T+',
    description: 'Energía + rendimiento',
    image: getImageUrl('/img/productos/vita-xtra-t+.png'),
    slug: 'vita-xtra-t-plus'
  }
];

const purchaseSteps = [
  {
    title: 'Busca por objetivo',
    text: 'Encuentra productos por digestión, energía, control de peso, defensas o bienestar general.'
  },
  {
    title: 'Agrega al carrito',
    text: 'Revisa precios, presentación y modo de uso antes de enviar tu pedido.'
  },
  {
    title: 'Coordina por WhatsApp',
    text: 'Un asesor confirma disponibilidad, resuelve dudas y coordina pago y despacho.'
  }
];

const painPoints = [
  'hinchazón constante',
  'cansancio',
  'retención de líquidos',
  'ansiedad por comer',
  'digestión lenta',
  'poca energía',
  'dificultad para ver resultados aunque se esfuercen'
];

const trustItems = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Compra asistida',
    text: 'Te orientamos antes de comprar para elegir productos según tu objetivo.'
  },
  {
    icon: <Leaf className="h-6 w-6" />,
    title: 'Fuxion Biotech',
    text: 'Productos nutracéuticos con enfoque en nutrición, bienestar y hábitos saludables.'
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: 'Pedido por WhatsApp',
    text: 'Agregas al carrito, envías tu pedido y coordinamos la atención directamente.'
  }
];

const HomePage = () => {
  const navigate = useNavigate();

  const handleNeedSearch = (query) => {
    navigate(`/explorar?search=${encodeURIComponent(query)}`);
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="overflow-x-hidden"
    >
      <Helmet>
        <title>Tienda Fuxion Chile | Productos Fuxion para Nutricion y Bienestar Natural</title>
        <meta name="description" content="Tienda Fuxion en Chile con productos nutraceuticos para nutricion, bienestar natural, digestion, energia, control de peso, defensas, deporte y belleza. Asesoria personalizada." />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`${SITE_URL}/`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:title" content={`${STORE_NAME} | Productos Fuxion para Nutricion y Bienestar`} />
        <meta property="og:description" content="Catalogo Fuxion en Chile para nutricion, bienestar natural, digestion, energia, control de peso, defensas y belleza." />
        <meta property="og:image" content={`${SITE_URL}/img/familia.fuxion.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:site_name" content={STORE_NAME} />
        <meta property="og:locale" content="es_CL" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${STORE_NAME} | Productos Fuxion Chile`} />
        <meta name="twitter:description" content="Productos Fuxion para nutricion, bienestar natural, digestion, energia y control de peso." />
        <meta name="twitter:image" content={`${SITE_URL}/img/familia.fuxion.png`} />

        <script type="application/ld+json">
          {JSON.stringify(buildStoreSchema())}
        </script>
      </Helmet>

      {/* SECCIÓN 1 – HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 bg-gradient-to-br from-[#f7faf4] via-white to-[#edf7ee] dark:from-[#0f1f18] dark:via-[#111827] dark:to-[#1b1630]">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="text-center lg:text-left">
              <motion.p
                className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 mb-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Tienda Fuxion Chile · Asesoría personalizada
              </motion.p>
              <motion.h1
                className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Productos Fuxion para nutrición y bienestar natural.
              </motion.h1>
              <motion.p
                className="text-2xl md:text-3xl font-semibold text-emerald-700 dark:text-emerald-300 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                Te ayudamos a elegir según tu objetivo: energía, digestión, control de peso o defensas.
              </motion.p>
              <motion.p
                className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                Explora el catálogo Fuxion y recibe orientación directa antes de comprar. Agrega tus productos al carrito y envía el pedido por WhatsApp para coordinar atención y despacho.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.58 }}
                className="mb-8"
              >
                <ProductNeedSearch onSearch={handleNeedSearch} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg text-lg px-8 py-6"
                  onClick={() => handleWhatsAppClick('Hola, quiero empezar mi cambio con Fuxion')}
                >
                  Recibir asesoría <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-bold rounded-full text-lg px-8 py-6 border-2"
                  onClick={() => window.location.href = '/explorar'}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ver catálogo
                </Button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 120 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-100 dark:border-emerald-900">
                <img
                  src={getImageUrl('/img/familia.fuxion.png')}
                  alt="Bienestar Fuxion y productos para nutrición natural"
                  className="w-full h-full object-cover max-h-[560px]"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage('woman');
                  }}
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white dark:bg-card border-y border-emerald-100 dark:border-border">
        <div className="container mx-auto px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {trustItems.map((item) => (
              <div key={item.title} className="flex gap-4 rounded-xl border border-emerald-100 bg-[#f7faf4] p-5 dark:border-border dark:bg-secondary/40">
                <div className="text-emerald-700 dark:text-emerald-300">{item.icon}</div>
                <div>
                  <h2 className="font-bold text-foreground">{item.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 2 – Dolor real del público */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            ¿Sientes hinchazón, cansancio o te cuesta avanzar con tus objetivos de bienestar?
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-center text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Muchas personas comparten lo mismo:
          </motion.p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {painPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-3 text-foreground">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-lg">{point}</span>
              </div>
            ))}
          </motion.div>
          <motion.p
            className="text-xl md:text-2xl font-semibold text-center text-primary mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Elige con información clara.
            <br />
            <span className="text-foreground">Te orientamos para encontrar una opción adecuada a tu objetivo.</span>
          </motion.p>
        </div>
      </section>

      {/* SECCIÓN 3 – La promesa Fuxion */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Tu cuerpo puede volver a sentirse liviano, activo y en equilibrio.
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-center text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Fuxion trabaja desde adentro con una combinación de ingredientes naturales, fibras, probióticos, extractos vegetales y súper alimentos que acompañan digestión, energía, nutrición diaria y hábitos saludables.
          </motion.p>
        </div>
      </section>

      {/* SECCIÓN 4 – Las 3 soluciones principales */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Las 3 soluciones principales
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {solutions.map((solution, i) => (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-card rounded-2xl p-8 border border-emerald-100 dark:border-border transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-4 text-primary">
                  {solution.icon}
                  <h3 className="text-2xl font-bold text-foreground">{solution.title}</h3>
                </div>
                <p className="text-muted-foreground mb-6">{solution.subtitle}</p>
                <div className="mb-6">
                  <p className="text-sm font-semibold text-foreground mb-2">Productos:</p>
                  <p className="text-sm text-muted-foreground">{solution.products.join(', ')}</p>
                </div>
                <div className="mb-6">
                  <p className="text-sm font-semibold text-foreground mb-3">Beneficios:</p>
                  <ul className="space-y-2">
                    {solution.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full mt-auto"
                  onClick={() => handleWhatsAppClick(`Hola, me interesa: ${solution.title}`)}
                >
                  {solution.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 5 – Cómo funciona */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Compra simple, asistida y sin cobro automático.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {purchaseSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-card p-6 rounded-lg border border-border flex flex-col items-center text-center hover:border-primary transition-all duration-300"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <span className="text-sm font-bold">{i + 1}</span>
                </div>
                <p className="font-bold text-foreground">{step.title}</p>
                <p className="mt-3 text-sm text-muted-foreground">{step.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg"
                onClick={() => handleWhatsAppClick('Hola, quiero mi recomendación personalizada')}
              >
                Quiero mi recomendación personalizada <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-bold rounded-full border-2"
                onClick={() => window.location.href = '/explorar'}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ver productos
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 6 – Productos destacados */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Productos destacados
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/producto/${product.slug}`}>
                  <div className="group relative bg-card rounded-xl overflow-hidden border border-emerald-100 dark:border-border transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
                    <div className="relative h-60 overflow-hidden bg-secondary flex-shrink-0">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        alt={`${product.name} Fuxion`}
                        src={product.image}
                        loading="lazy"
                        onError={(e) => {
                          if (e.target.src !== getPlaceholderImage('product')) {
                            e.target.src = getPlaceholderImage('product');
                          }
                        }}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                      <div className="mt-auto flex gap-2">
                        <span className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white">Ver detalles</span>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            handleProductAiClick(product);
                          }}
                          className="h-9 w-9 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                          title={`Preguntar a la IA sobre ${product.name}`}
                          aria-label={`Preguntar a la IA sobre ${product.name}`}
                        >
                          <AiRobotIcon className="mx-auto h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            handleProductWhatsappClick(product);
                          }}
                          className="h-9 w-9 rounded-md border border-green-200 text-green-700 hover:bg-green-600 hover:text-white"
                          title="Hablar con asesor"
                          aria-label={`Hablar con asesor por WhatsApp sobre ${product.name}`}
                        >
                          <WhatsAppIcon className="mx-auto h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/explorar">
              <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                Ver todos los productos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 7 – Bonus irresistible */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            className="rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/20 md:p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
            >
              <WhatsAppIcon className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Asesoría personalizada antes de comprar
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Te ayudamos a revisar opciones, disponibilidad y forma de uso antes de confirmar tu pedido.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                size="lg"
                className="h-auto w-full max-w-full whitespace-normal bg-primary px-4 py-4 text-center text-base font-bold leading-tight text-primary-foreground shadow-lg hover:bg-primary/90 sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                onClick={() => handleWhatsAppClick('Hola, quiero mi recomendación personalizada')}
              >
                <span>Quiero mi recomendación</span>
                <WhatsAppIcon className="ml-2 h-5 w-5 shrink-0" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN FINAL – Cierre emocional */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Tu cambio empieza con una decisión.
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-primary font-semibold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Yo te acompaño en el proceso.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg text-lg px-8 py-6"
              onClick={() => handleWhatsAppClick('Hola, quiero iniciar mi cambio ahora')}
            >
              Iniciar mi cambio ahora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-bold rounded-full text-lg px-8 py-6 border-2"
              onClick={() => window.location.href = '/explorar'}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Ver catálogo
            </Button>
          </motion.div>
        </div>
      </section>

    </motion.div>
  );
};

export default HomePage;
