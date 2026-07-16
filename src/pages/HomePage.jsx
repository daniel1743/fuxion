import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  BadgeCheckIcon,
} from '@hugeicons/core-free-icons';
import { buildStoreSchema, buildOrganizationSchema, SITE_URL, STORE_NAME, getAllSeoProducts } from '@/lib/productSeo';
import { confirmAndOpenWhatsapp, openWhatsapp } from '@/lib/whatsapp';
import { getImageUrl } from '@/lib/imageUtils';
import PremiumIcon from '@/components/ui/PremiumIcon';
import ProductNeedSearch from '@/components/ProductNeedSearch';
import WellnessJourneyCarousel from '@/components/WellnessJourneyCarousel';
import MobileAppShell from '@/components/mobile/MobileAppShell';
import MobileCategoryGrid from '@/components/mobile/MobileCategoryGrid';
import TestimonialsSection from '@/components/TestimonialsSection';
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
    rawIcon: Shield02Icon,
    title: 'Compra asistida',
    text: 'Te orientamos antes de comprar para elegir productos según tu objetivo.'
  },
  {
    icon: <PremiumIcon icon={Leaf01Icon} size="md" />,
    rawIcon: Leaf01Icon,
    title: 'Fuxion Biotech',
    text: 'Productos nutracéuticos con enfoque en nutrición, bienestar y hábitos saludables.'
  },
  {
    icon: <PremiumIcon icon={DeliveryTruck02Icon} size="md" />,
    rawIcon: DeliveryTruck02Icon,
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

      {/* ═══════════════════════════════════════════════════════════
         MOBILE-ONLY: Premium App Experience
         Solo visible en pantallas menores a md (< 768px)
      ════════════════════════════════════════════════════════════ */}
      <div className="md:hidden bg-gray-50 dark:bg-gray-950 pb-6">
        <MobileAppShell variant="large" showSearch={true} onSearchClick={handleNeedSearch}>
          <div className="w-full flex items-center justify-between gap-4 pt-1 pb-1">
            {/* Columna Izquierda (Textos y Botón) */}
            <div className="w-[60%] flex flex-col gap-2.5">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="text-[22px] sm:text-[25px] font-bold uppercase text-white leading-[1.15] mb-1 tracking-wide drop-shadow-sm"
                >
                  Nutrición natural<br />para sentirte<br />mejor
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                  className="text-xxs text-emerald-50/70 leading-relaxed font-normal max-w-[95%] drop-shadow-sm"
                >
                  Encuentra bebidas activas para energía, digestión y control de peso.
                </motion.p>
              </div>
              
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                onClick={() => navigate('/explorar')}
                className="bg-white text-fuxion px-5 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-black/10 flex items-center gap-2 active:bg-gray-50 transition-colors w-fit shrink-0 mt-0.5"
              >
                Explorar productos
              </motion.button>
            </div>

            {/* Columna Derecha (Contenedor 3:4 Proporcional sin distorsión) */}
            <div className="w-[36%] flex justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                className="w-full aspect-[3/4] bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-xl"
                style={{
                  filter: 'drop-shadow(0 10px 18px rgba(0, 0, 0, 0.22))'
                }}
              >
                <img 
                  src="/para el hero.jpeg" 
                  alt="Producto FuXion" 
                  className="w-full h-full object-cover opacity-90"
                />
              </motion.div>
            </div>
          </div>
        </MobileAppShell>
        <div className="pt-6">
          <MobileCategoryGrid />
        </div>
      </div>

      {/* SECCIÓN 1 – HERO (Desktop only) */}
      <section className="relative min-h-[55vh] hidden md:flex items-center overflow-hidden pt-8 sm:pt-10 lg:pt-12 pb-6 lg:pb-0 bg-gradient-to-br from-[#f7faf4] via-white to-[#edf7ee] dark:from-surface-muted dark:via-[#111827] dark:to-[#1b1630]">
        <div className="relative z-content w-full max-w-[1440px] mx-auto px-6 lg:px-8 xl:px-16 py-4 lg:py-16">
          <div className="flex flex-col lg:grid lg:grid-cols-[55fr_45fr] gap-8 lg:gap-16 xl:gap-24 items-center">
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
              <motion.p
                className="hidden md:inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs md:text-sm font-semibold text-emerald-700 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 mb-4 lg:mb-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Tienda Fuxion Chile · Asesoría personalizada
              </motion.p>
              <motion.h1
                className="text-[1.4rem] sm:text-2xl md:text-3xl lg:text-responsive-hero font-bold uppercase text-foreground tracking-wide mb-3 lg:mb-4 leading-[1.2]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Productos Fuxion para <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">nutrición y bienestar natural.</span>
              </motion.h1>
              <motion.p
                className="text-sm md:text-base font-normal text-emerald-800/70 dark:text-emerald-300/70 mb-3 lg:mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                Explora nuestro catálogo y recibe asesoría directa antes de comprar.
              </motion.p>
              {/* ── Row 1: buscador a ancho completo ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.58 }}
                className="w-full mb-5"
              >
                <ProductNeedSearch onSearch={handleNeedSearch} className="max-w-none" />
              </motion.div>

              {/* ── Row 2: CTA separada con aire y texto de apoyo ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.72 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
              >
                <Button
                  onClick={() => handleWhatsAppClick('Hola, quiero empezar mi cambio con Fuxion')}
                  className="w-full sm:w-auto justify-center h-12 px-8 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold flex items-center gap-2 shadow-lg shadow-emerald-900/10 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-base"
                >
                  <span>Recibir asesoría</span>
                  <HugeiconsIcon icon={ArrowRight02Icon} size={20} className="shrink-0" />
                </Button>
                <p className="text-sm text-muted-foreground leading-snug hidden sm:block">
                  Un asesor te ayuda a elegir<br className="hidden lg:block" /> el producto ideal para tu objetivo.
                </p>
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
                  src={getImageUrl('/para el hero.jpeg')}
                  alt="Prunex 1 FuXion - Limpieza de colon y tránsito intestinal natural"
                  title="Prunex 1 FuXion - Limpieza de colon y tránsito intestinal natural"
                  className="w-full h-full object-cover max-h-[560px]"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage('woman');
                  }}
                  loading="eager"
                  width="800"
                  height="560"
                />
              </div>

              {/* ── Glassmorphism Badge 1 (Top Left) ── */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
                className="absolute -top-6 -left-6 z-sticky bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border border-emerald-100/50 dark:border-emerald-800/50 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 hidden sm:flex"
              >
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full">
                  <HugeiconsIcon icon={Leaf01Icon} className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-foreground leading-none">100% Natural</p>
                  <p className="text-xxs font-medium text-muted-foreground mt-1">Origen vegetal</p>
                </div>
              </motion.div>

              {/* ── Glassmorphism Badge 2 (Bottom Right) ── */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1, type: 'spring', stiffness: 100 }}
                className="absolute -bottom-6 -right-4 lg:-right-8 z-sticky bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border border-emerald-100/50 dark:border-emerald-800/50 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 hidden sm:flex"
              >
                <div className="bg-emerald-500 p-2 rounded-full shadow-inner border-2 border-white dark:border-gray-800">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-foreground leading-none">Calidad Premium</p>
                  <p className="text-xxs font-medium text-muted-foreground mt-1">Fórmulas patentadas</p>
                </div>
              </motion.div>
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

      <TestimonialsSection
        title="Experiencias de consumidores FuXion"
        subtitle="Opiniones compartidas por consumidores que han probado productos FuXion y publicado sus experiencias en diferentes plataformas públicas."
        showForm={false}
      />

      <section className="py-8 md:py-10 bg-white dark:bg-card border-y border-emerald-100 dark:border-border">
        <div className="container mx-auto px-4 md:px-6">
          {/* Mobile Layout: 3 columns of small cards matching MobileCategoryGrid style */}
          <div className="grid grid-cols-3 gap-3 md:hidden">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card variant="trust" className="p-3.5 items-start border-gray-100/80 dark:border-emerald-950/30">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <HugeiconsIcon icon={item.rawIcon} size={20} />
                  </div>
                  <h4 className="text-xxs font-bold text-foreground leading-tight">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-[9px] text-muted-foreground leading-snug">
                    {item.text}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Desktop Layout: 3 columns of horizontal cards */}
          <div className="hidden md:grid gap-4 grid-cols-3">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Card variant="trust" className="gap-4 p-5 hover:shadow-md transition-all duration-300">
                  <div className="text-emerald-600 dark:text-emerald-400 shrink-0">{item.icon}</div>
                  <div>
                    <h2 className="font-bold text-foreground">{item.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 2 – Dolor real del público */}
      <section className="py-8 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.h2
            className="text-responsive-section font-bold text-center mb-6 md:mb-8 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            ¿Sientes hinchazón, cansancio o te cuesta avanzar con tus objetivos de bienestar?
          </motion.h2>
          <motion.p
            className="text-base md:text-xl text-center text-muted-foreground mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Muchas personas comparten lo mismo:
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {painPoints.map((point, i) => (
              <div key={i} className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-foreground text-sm font-medium shadow-sm">
                {point}
              </div>
            ))}
          </motion.div>
          <motion.p
            className="text-lg md:text-2xl font-semibold text-center text-primary mt-8"
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
      <section className="py-8 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
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
      <section className="py-8 md:py-20 bg-secondary/30 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            className="text-responsive-section font-bold text-center mb-6 md:mb-12 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Las 3 soluciones principales
          </motion.h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto pb-4 -mx-4 px-4 md:mx-auto md:px-0" style={{ scrollbarWidth: 'none' }}>
            {solutions.map((solution, i) => (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="h-full w-[85vw] max-w-[85vw] sm:w-[320px] sm:max-w-[320px] md:w-auto md:max-w-none snap-center shrink-0"
              >
                <Card variant="feature" className="h-full flex flex-col">
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
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 5 – Cómo funciona */}
      <section className="py-8 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.h2
            className="text-responsive-section font-bold text-center mb-4 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Compra simple, asistida y sin cobro automático.
          </motion.h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12 pb-4 -mx-4 px-4 md:mx-auto md:px-0" style={{ scrollbarWidth: 'none' }}>
            {purchaseSteps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="bg-card p-6 rounded-2xl border border-border/60 flex flex-col items-center text-center hover:border-emerald-300 hover:shadow-md transition-all duration-300 w-[85vw] max-w-[85vw] sm:w-[280px] sm:max-w-[280px] md:w-auto md:max-w-none snap-center shrink-0"
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
      <section className="py-8 md:py-20 bg-secondary/30 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            className="text-responsive-section font-bold text-center mb-6 md:mb-12 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Productos destacados
          </motion.h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto pb-4 -mx-4 px-4 md:mx-auto md:px-0" style={{ scrollbarWidth: 'none' }}>
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-[85vw] max-w-[85vw] sm:w-[300px] sm:max-w-[300px] md:w-auto md:max-w-none snap-center shrink-0"
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
                          <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xxs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
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
                          <WhatsAppIcon className="h-5 w-5 text-white" />
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
                <WhatsAppIcon className="ml-2 h-6 w-6 shrink-0 text-white" />
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
// ═══════════════════════════════════════════════════════════════════
const certifications = [
  {
    id: 'actigenos',
    imageSrc: '/carrussel certificaciones/actigenos.jpeg',
    name: 'Actinos',
    type: 'Péptidos naturales del lactosuero',
    description: 'Complejo de péptidos naturales extraídos del lactosuero. Induce la producción endógena de óxido nítrico, provocando profunda vasodilatación que acelera la depuración del ácido láctico y retrasa la fatiga muscular.'
  },
  {
    id: 'bc-certificacion',
    imageSrc: '/carrussel certificaciones/bc certificaion.jpeg',
    name: 'Baltic Control',
    type: 'Inspección internacional',
    description: 'Firma de inspección internacional que audita cadenas de suministro desde el origen botánico agrícola hasta el envasado nutracéutico, respaldando la pureza y potencia de los productos.'
  },
  {
    id: 'bioferrin',
    imageSrc: '/carrussel certificaciones/bioferrin.jpeg',
    name: 'Bioferrin',
    type: 'Lactoferrina bioactiva',
    description: 'Lactoferrina pura bioactiva extraída de matrices de lactosuero bovino. Actúa como agente antimicrobiano que secuestra el hierro libre, eliminando el sustrato vital de patógenos invasores.'
  },
  {
    id: 'bioprotein-active',
    imageSrc: '/carrussel certificaciones/bioprotein active.jpeg',
    name: 'BioProtein Active',
    type: 'Proteína vegetal viva',
    description: 'Matriz de proteína vegetal viva que integra quinua orgánica germinada, arvejas, arroz integral y algas. Su proceso de germinación pre-digiere la proteína, brindando alto valor biológico.'
  },
  {
    id: 'bioprotein',
    imageSrc: '/carrussel certificaciones/bioprotein.jpeg',
    name: 'BioProtein Colostrum',
    type: 'Proteínas + Calostro',
    description: 'Amalgama de ingeniería alimentaria que fusiona proteínas de distinta tasa de absorción cinética con calostro bovino. Aporta inmunoglobulinas que recubren las mucosas gastrointestinales.'
  },
  {
    id: 'bpm',
    imageSrc: '/carrussel certificaciones/bpm.jpeg',
    name: 'BPM',
    type: 'Buenas Prácticas de Manufactura',
    description: 'Estándar que exige rediseño total de la arquitectura de producción para prohibir la variabilidad lote a lote. Asegura concentración declarada exacta e impone protocolos de limpieza anti-contaminación cruzada.'
  },
  {
    id: 'ciencia-natural',
    imageSrc: '/carrussel certificaciones/ciencia natural.jpeg',
    name: 'Ciencia y Naturaleza',
    type: 'Filosofía I+D',
    description: 'Directriz de investigación y desarrollo que busca mapear, aislar y potenciar perfiles fitoquímicos ancestrales. Representa la "Fusión Nutracéutica" con tecnologías de estabilización para extraer principios activos puros.'
  },
  {
    id: 'clean-label',
    imageSrc: '/carrussel certificaciones/cleam label.jpeg',
    name: 'Clean Label',
    type: 'Ingredientes naturales',
    description: 'Garantiza ingredientes 100% de origen natural y una reingeniería de sistemas de entrega de nutrientes con tecnología de microencapsulación lipídica para proteger los principios activos.'
  },
  {
    id: 'haccp',
    imageSrc: '/carrussel certificaciones/haccp.jpeg',
    name: 'HACCP',
    type: 'Seguridad alimentaria preventiva',
    description: 'Sistema que eleva la seguridad alimentaria a un modelo predictivo. Requiere mapeo exhaustivo de cada etapa del procesamiento industrial para identificar Puntos Críticos de Control con límites de monitoreo en tiempo real.'
  },
  {
    id: 'humanitas',
    imageSrc: '/carrussel certificaciones/humanitas.jpeg',
    name: 'Humanitas',
    type: 'Prácticas corporativas',
    description: 'Sello que avala el modelo de negocio, las prácticas laborales éticas, la sostenibilidad del abastecimiento y la transparencia comercial de la corporación.'
  },
  {
    id: 'prolibra',
    imageSrc: '/carrussel certificaciones/prolibra.jpeg',
    name: 'Prolibra',
    type: 'Fracción bioactiva del suero',
    description: 'Ingrediente de fracción bioactiva derivado del suero lácteo. Altera favorablemente la partición de nutrientes, dirigiendo aminoácidos hacia la síntesis de proteínas musculares y acelerando la movilización de grasa.'
  },
  {
    id: 'svetol',
    imageSrc: '/carrussel certificaciones/svetol.jpeg',
    name: 'Svetol',
    type: 'Extracto de café verde',
    description: 'Extracto natural estandarizado de granos de café verde Robusta. Compuesto bioactivo de acción metabólica reconocida.'
  }
];

const CertificationsCarousel = () => {
  const [activeId, setActiveId]   = useState(null);
  const [isPaused, setIsPaused]   = useState(false);
  const [tipStyle, setTipStyle]   = useState({});   // fixed-position coords

  const activeCert = activeId
    ? certifications.find(c => c.id === activeId.replace(/-\d+$/, ''))
    : null;

  const handleEnter = (uniqueId, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Center tooltip above the card, staying within viewport
    const TOOLTIP_W = 320; // px — max tooltip width
    const leftIdeal = rect.left + rect.width / 2 - TOOLTIP_W / 2;
    const leftClamped = Math.max(12, Math.min(leftIdeal, window.innerWidth - TOOLTIP_W - 12));

    setTipStyle({
      position:  'fixed',
      bottom:    window.innerHeight - rect.top + 14,
      left:      leftClamped,
      width:     TOOLTIP_W,
    });
    setActiveId(uniqueId);
    setIsPaused(true);
  };

  const handleLeave = () => {
    setActiveId(null);
    setIsPaused(false);
  };

  return (
    <section
      className="relative py-10 bg-white dark:bg-card overflow-hidden border-y border-emerald-100/60 dark:border-border"
      onMouseLeave={handleLeave}
      onTouchEnd={handleLeave}
    >
      {/* CSS keyframes */}
      <style>{`
        @keyframes certs-scroll {
          from { transform: translateX(0%); }
          to   { transform: translateX(-50%); }
        }
        .certs-track {
          animation: certs-scroll 40s linear infinite;
          animation-play-state: var(--scroll-state, running);
        }
      `}</style>

      {/* Section header */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex items-center gap-3 justify-center">
          <div className="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-emerald-200 dark:to-emerald-800" />
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.18em]">
            Sellos y certificaciones de calidad
          </p>
          <div className="h-px flex-1 max-w-20 bg-gradient-to-l from-transparent to-emerald-200 dark:to-emerald-800" />
        </div>
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-card to-transparent z-content" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-card to-transparent z-content" />

      {/* Scrolling track */}
      <div
        className="certs-track flex items-center gap-10 w-max px-6 py-3"
        style={{ '--scroll-state': isPaused ? 'paused' : 'running' }}
      >
        {[...certifications, ...certifications].map((cert, i) => {
          const uniqueId = `${cert.id}-${i}`;
          const isActive = activeId === uniqueId;
          return (
            <div
              key={uniqueId}
              className="relative shrink-0"
              onMouseEnter={(e) => handleEnter(uniqueId, e)}
              onTouchStart={(e) => handleEnter(uniqueId, e)}
              role="button"
              tabIndex={0}
              aria-label={`Ver información: ${cert.name}`}
              onKeyDown={(e) => e.key === 'Enter' && handleEnter(uniqueId, e)}
            >
              <motion.div
                className="flex items-center justify-center w-[100px] h-[100px] rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-gray-900 cursor-pointer select-none"
                style={{
                  boxShadow: isActive
                    ? '0 8px 32px rgba(16,185,129,0.18), 0 2px 8px rgba(0,0,0,0.08)'
                    : '0 2px 8px rgba(0,0,0,0.05)',
                }}
                animate={{ scale: isActive ? 1.12 : 1, y: isActive ? -6 : 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 24 }}
              >
                <img
                  src={cert.imageSrc}
                  alt={cert.name}
                  className="h-14 w-14 object-contain"
                  loading="lazy"
                  draggable={false}
                />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* ─── Tooltip rendered via portal (position:fixed) to escape overflow ─── */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            key="cert-tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            style={tipStyle}
            className="pointer-events-none z-max"
          >
            {/* Arrow pointing down toward the card */}
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-gray-900 border-r border-b border-emerald-200 dark:border-emerald-800" />

            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white/98 dark:bg-gray-900/98 backdrop-blur-2xl shadow-2xl p-5">
              {/* Logo + name + badge */}
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={activeCert.imageSrc}
                  alt={activeCert.name}
                  className="h-10 w-10 object-contain rounded-xl border border-emerald-100 dark:border-emerald-900 bg-white dark:bg-gray-800 p-1 shrink-0 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-foreground leading-snug">{activeCert.name}</p>
                    <HugeiconsIcon
                      icon={BadgeCheckIcon}
                      className="h-4 w-4 text-emerald-500 shrink-0"
                      aria-label="Verificado"
                    />
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xxs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                    {activeCert.type}
                  </span>
                </div>
              </div>

              <div className="h-px bg-emerald-100 dark:bg-emerald-900/40 mb-3" />

              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeCert.description}
              </p>

              <div className="mt-3 flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="h-3.5 w-3.5 text-emerald-500 shrink-0"
                />
                <p className="text-xxs font-medium text-emerald-600 dark:text-emerald-400">
                  Sello de calidad verificado por FuXion
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HomePage;
