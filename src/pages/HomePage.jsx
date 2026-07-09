
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, MessageCircle } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Leaf01Icon,
  LeafIcon,
  WeightScaleIcon,
  EnergyIcon,
  Shield02Icon,
  DeliveryTruck02Icon,
  ShoppingBag03Icon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import PremiumIcon from '@/components/ui/PremiumIcon';
import { getImageUrl, getPlaceholderImage } from '@/lib/imageUtils';
import { buildStoreSchema, buildOrganizationSchema, SITE_URL, STORE_NAME, getAllSeoProducts } from '@/lib/productSeo';
import { confirmAndOpenWhatsapp, openWhatsapp } from '@/lib/whatsapp';
import ProductNeedSearch from '@/components/ProductNeedSearch';
import WellnessJourneyCarousel from '@/components/WellnessJourneyCarousel';
import SEO from '@/components/SEO';
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
    icon: <PremiumIcon icon={Leaf01Icon} size="md" />
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
    icon: <PremiumIcon icon={WeightScaleIcon} size="md" />
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
    icon: <PremiumIcon icon={EnergyIcon} size="md" />
  }
];

// Obtener precios reales desde la base de datos de productos
const allSeoProducts = getAllSeoProducts();
const getProductPrice = (slug) => {
  const product = allSeoProducts.find(p => p.slug === slug);
  return product?.price || product?.precio || null;
};

const featuredProducts = [
  {
    id: 'prunex-1',
    name: 'PRUNEX 1',
    description: 'Digestión + liviandad',
    image: getImageUrl('/img/productos/prunex-1.png'),
    slug: 'prunex-1',
    price: getProductPrice('prunex-1'),
    badge: 'Más elegido'
  },
  {
    id: 'thermo-t3',
    name: 'THERMO T3',
    description: 'Metabolismo + energía',
    image: getImageUrl('/img/productos/thermo-t3.png'),
    slug: 'thermo-t3',
    price: getProductPrice('thermo-t3'),
    badge: null
  },
  {
    id: 'vita-xtra-t-plus',
    name: 'VITA XTRA T+',
    description: 'Energía + rendimiento',
    image: getImageUrl('/img/productos/vita-xtra-t+.png'),
    slug: 'vita-xtra-t-plus',
    price: getProductPrice('vita-xtra-t-plus'),
    badge: null
  }
];

const purchaseSteps = [
  {
    title: 'Busca',
    subtitle: 'Encuentra por objetivo',
    text: 'Digestión, energía, control de peso, defensas o bienestar general.',
    icon: Search
  },
  {
    title: 'Elige',
    subtitle: 'Revisa y agrega',
    text: 'Precios, presentación y modo de uso antes de enviar tu pedido.',
    icon: ShoppingCart
  },
  {
    title: 'Coordina',
    subtitle: 'Con asesor',
    text: 'Un asesor confirma disponibilidad, resuelve dudas y coordina pago y despacho.',
    icon: MessageCircle
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
    icon: <PremiumIcon icon={Shield02Icon} size="md" />,
    title: 'Compra asistida',
    text: 'Te orientamos antes de comprar para elegir productos según tu objetivo.'
  },
  {
    icon: <PremiumIcon icon={Leaf01Icon} size="md" />,
    title: 'Fuxion Biotech',
    text: 'Productos nutracéuticos con enfoque en nutrición, bienestar y hábitos saludables.'
  },
  {
    icon: <PremiumIcon icon={DeliveryTruck02Icon} size="md" />,
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
      <SEO
        title="Tienda Fuxion Chile — Productos para Nutrición y Bienestar Natural"
        description="Tienda Fuxion en Chile con productos nutracéuticos para nutrición, bienestar natural, digestión, energía, control de peso, defensas, deporte y belleza. Asesoría personalizada por WhatsApp. Envíos a todo Chile."
        canonical="/"
        schema={[buildStoreSchema(), buildOrganizationSchema()]}
      />

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
                className="text-responsive-hero font-extrabold text-foreground tracking-tight mb-6"
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
              >
                <Button
                  size="lg"
                  onClick={() => handleWhatsAppClick('Hola, quiero empezar mi cambio con Fuxion')}
                >
                  <span className="text-balance">Recibir asesoría</span> <HugeiconsIcon icon={ArrowRight02Icon} size={20} className="ml-2 shrink-0" />
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
                  alt="Familia FuXion - Nutrición de verdad y bienestar natural"
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

      {/* SECCIÓN 1.5 – Wellness Journey Carousel */}
      <WellnessJourneyCarousel />

      {/* ═══════════════════════════════════════════════════════════
         SECCIÓN 1.6 – Sellos y certificaciones (scroll infinito)
         
         CÓMO REEMPLAZAR ICONOS:
         - Cada certificación tiene un `icon` que actualmente es un SVG inline genérico.
         - Para usar imágenes reales, reemplaza el SVG por:
             icon: <img src="/ruta/al/logo.png" alt="Nombre" className="h-8 w-8 object-contain" />
         
         CÓMO ELIMINAR ESTA SECCIÓN:
         - Elimina todo el bloque desde "SECCIÓN 1.6" hasta el cierre de </section>
         - O simplemente comenta o elimina este bloque completo.
         
         CÓMO AJUSTAR VELOCIDAD:
         - Cambia el valor de `speed` en el useEffect (actualmente 0.3)
         
         CÓMO AGREGAR MÁS SELLOS:
         - Agrega objetos al array `certifications` siguiendo la misma estructura
      ════════════════════════════════════════════════════════════
      */}
      <CertificationsCarousel />

      <section className="py-10 bg-white dark:bg-card border-y border-emerald-100 dark:border-border">
        <div className="container mx-auto px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex gap-4 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all duration-300 dark:border-emerald-900/30 dark:bg-card/70"
              >
                <div className="text-emerald-600 dark:text-emerald-400">{item.icon}</div>
                <div>
                  <h2 className="font-bold text-foreground">{item.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 2 – Dolor real del público */}
      <section className="py-12 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.h2
            className="text-responsive-section font-bold text-center mb-8 text-foreground"
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
                <div className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/30 ring-1 ring-primary/20 shrink-0"></div>
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
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.h2
            className="text-responsive-section font-bold text-center mb-6 text-foreground"
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
      <section className="py-12 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-responsive-section font-bold text-center mb-12 text-foreground"
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
                <div className="flex-1">
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
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-primary flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Button
                  fullWidth
                  className="mt-auto"
                  onClick={() => handleWhatsAppClick(`Hola, me interesa: ${solution.title}`)}
                >
                  {solution.buttonText} <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 5 – Cómo funciona */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.h2
            className="text-responsive-section font-bold text-center mb-4 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Compra simple, asistida y sin cobro automático.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {purchaseSteps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="bg-card p-6 rounded-2xl border border-border/60 flex flex-col items-center text-center hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 shadow-sm dark:from-emerald-900/30 dark:to-emerald-900/20 dark:text-emerald-400">
                    <StepIcon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <p className="font-bold text-foreground text-lg">{step.title}</p>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">{step.subtitle}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                </motion.div>
              );
            })}
          </div>
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="btn-hero-pair justify-center">
              <Button
                size="lg"
                onClick={() => handleWhatsAppClick('Hola, quiero mi recomendación personalizada')}
              >
                <span className="text-balance">Quiero mi recomendación personalizada</span> <HugeiconsIcon icon={ArrowRight02Icon} size={20} className="ml-2 shrink-0" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '/explorar'}
              >
                <HugeiconsIcon icon={ShoppingBag03Icon} size={20} className="mr-2 shrink-0" />
                <span className="text-balance">Ver productos</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 6 – Productos destacados */}
      <section className="py-12 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-responsive-section font-bold text-center mb-12 text-foreground"
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
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                        {product.badge && (
                          <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      {product.price != null && (
                        <p className="text-lg font-bold text-foreground mb-4">
                          ${product.price.toLocaleString('es-CL')}
                        </p>
                      )}
                      <div className="mt-auto flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={(event) => {
                            event.preventDefault();
                            window.location.href = `/producto/${product.slug}`;
                          }}
                        >
                          Ver detalles
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={(event) => {
                            event.preventDefault();
                            handleProductAiClick(product);
                          }}
                          title={`Preguntar a la IA sobre ${product.name}`}
                          aria-label={`Preguntar a la IA sobre ${product.name}`}
                        >
                          <AiRobotIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={(event) => {
                            event.preventDefault();
                            handleProductWhatsappClick(product);
                          }}
                          title="Hablar con asesor"
                          aria-label={`Hablar con asesor por WhatsApp sobre ${product.name}`}
                        >
                          <WhatsAppIcon className="h-5 w-5" />
                        </Button>
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
                Ver todos los productos <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 6.5 – Soft integration banner: Oportunidad Fuxion */}
      <section className="py-12 bg-gradient-to-r from-emerald-50/60 to-teal-50/60 dark:from-emerald-950/10 dark:to-teal-950/10 border-y border-emerald-100/50 dark:border-emerald-900/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <PremiumIcon icon={LeafIcon} size="md" className="hidden md:inline-flex" />
              <div>
                <p className="text-lg font-semibold text-foreground">
                  ¿Te gusta el mundo del bienestar?
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Descubre cómo algunas personas también comparten FuXion como oportunidad.
                </p>
              </div>
            </div>
            <Link to="/oportunidad-fuxion">
              <Button
                variant="outline"
              >
                Conocer más <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 7 – Bonus irresistible */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            className="rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/20 md:p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
              className="mb-6 inline-flex"
            >
              <PremiumIcon icon={WhatsAppIcon} size="lg" variant="glow" />
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
                onClick={() => handleWhatsAppClick('Hola, quiero mi recomendación personalizada')}
              >
                <span>Quiero mi recomendación</span>
                <WhatsAppIcon className="ml-2 h-6 w-6 shrink-0" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN FINAL – Cierre emocional */}
      <section className="py-12 md:py-20 bg-secondary/30">
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
            className="btn-hero-pair justify-center"
          >
            <Button
              size="lg"
              onClick={() => handleWhatsAppClick('Hola, quiero iniciar mi cambio ahora')}
            >
              <span className="text-balance">Iniciar mi cambio ahora</span>
              <HugeiconsIcon icon={ArrowRight02Icon} size={20} className="ml-2 shrink-0" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/explorar'}
            >
              <HugeiconsIcon icon={ShoppingBag03Icon} size={20} className="mr-2 shrink-0" />
              <span className="text-balance">Ver catálogo</span>
            </Button>
          </motion.div>
        </div>
      </section>

    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// COMPONENTE: CertificationsCarousel
// Carrusel de scroll infinito de derecha a izquierda para sellos
// y certificaciones de calidad.
//
// Para reemplazar iconos genéricos por imágenes reales, cambia el
// SVG inline por un <img> con la ruta de tu imagen.
//
// Para eliminar este componente, borra esta función y la línea
// <CertificationsCarousel /> en HomePage.
// ═══════════════════════════════════════════════════════════════════
const certifications = [
  {
    id: 'calidad',
    name: 'Sello de Calidad',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    )
  },
  {
    id: 'organico',
    name: 'Certificación Orgánica',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  },
  {
    id: 'gluten-free',
    name: 'Libre de Gluten',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <circle cx="12" cy="12" r="10" />
        <path d="M4.93 4.93l14.14 14.14" />
      </svg>
    )
  },
  {
    id: 'no-transgenico',
    name: 'No Transgénico',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    id: 'profesionales',
    name: 'Avalado por Profesionales',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 2a10 10 0 1 0 10 10h-10V2z" />
      </svg>
    )
  },
  {
    id: 'hecho-en-chile',
    name: 'Hecho en Chile',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    )
  },
  {
    id: 'iso',
    name: 'Certificación ISO',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  },
  {
    id: 'natural',
    name: 'Ingredientes Naturales',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    )
  }
];

const CertificationsCarousel = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId;
    let scrollPos = 0;
    const speed = 0.3; // pixels per frame — ajusta para cambiar velocidad

    const scroll = () => {
      scrollPos += speed;
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0;
      }
      el.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="py-8 bg-white dark:bg-card border-y border-emerald-100 dark:border-border overflow-hidden">
      <div className="container mx-auto px-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
          Sellos y certificaciones de calidad
        </p>
        <div
          ref={scrollRef}
          className="flex items-center gap-12 overflow-x-hidden whitespace-nowrap"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          aria-hidden="true"
        >
          {/* Duplicado para loop infinito */}
          {[...certifications, ...certifications].map((cert, i) => (
            <div
              key={`${cert.id}-${i}`}
              className="shrink-0 flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
              <span className="text-emerald-600/80 dark:text-emerald-400/80">
                {cert.icon}
              </span>
              <span className="text-xs text-muted-foreground/80 font-medium whitespace-nowrap">
                {cert.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
