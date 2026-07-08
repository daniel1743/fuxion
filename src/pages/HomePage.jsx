
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Leaf01Icon,
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
import { buildStoreSchema, buildOrganizationSchema, SITE_URL, STORE_NAME } from '@/lib/productSeo';
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
    icon: <PremiumIcon icon={<HugeiconsIcon icon={Leaf01Icon} size={24} />} size="md" />
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
    icon: <PremiumIcon icon={<HugeiconsIcon icon={WeightScaleIcon} size={24} />} size="md" />
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
    icon: <PremiumIcon icon={<HugeiconsIcon icon={EnergyIcon} size={24} />} size="md" />
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
    icon: <PremiumIcon icon={<HugeiconsIcon icon={Shield02Icon} size={24} />} size="md" />,
    title: 'Compra asistida',
    text: 'Te orientamos antes de comprar para elegir productos según tu objetivo.'
  },
  {
    icon: <PremiumIcon icon={<HugeiconsIcon icon={Leaf01Icon} size={24} />} size="md" />,
    title: 'Fuxion Biotech',
    text: 'Productos nutracéuticos con enfoque en nutrición, bienestar y hábitos saludables.'
  },
  {
    icon: <PremiumIcon icon={<HugeiconsIcon icon={DeliveryTruck02Icon} size={24} />} size="md" />,
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
      <section className="py-20">
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
      <section className="py-20 bg-secondary/30">
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
                <Button
                  fullWidth
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
      <section className="py-20">
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
            {purchaseSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-card p-6 rounded-lg border border-border flex flex-col items-center text-center hover:border-primary transition-all duration-300"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-200/50 ring-1 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:shadow-emerald-900/20 dark:ring-emerald-800">
                  <span className="text-base font-bold">{i + 1}</span>
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
      <section className="py-20 bg-secondary/30">
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
                      <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
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
                          <WhatsAppIcon className="h-4 w-4" />
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
              <PremiumIcon icon={<Leaf />} size="md" className="hidden md:inline-flex" />
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
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
              className="mb-6 inline-flex"
            >
              <PremiumIcon icon={<WhatsAppIcon />} size="lg" variant="glow" />
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

export default HomePage;
