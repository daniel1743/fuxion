import React from 'react';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Truck, ShieldCheck, MessageCircle, Package, MapPin, ExternalLink } from 'lucide-react';
import { buildWhatsappUrl } from '@/lib/whatsapp';
import MobileAppShell from '@/components/mobile/MobileAppShell';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const features = [
  {
    icon: MessageCircle,
    title: 'Asesoría personalizada',
    text: 'Daniel Falcón te guía en la elección de los productos ideales para tus objetivos.',
  },
  {
    icon: Package,
    title: 'Coordinación de entrega',
    text: 'Despacho, delivery o envío hasta la puerta de tu casa según tu ubicación.',
  },
  {
    icon: ShieldCheck,
    title: 'Compra segura',
    text: 'Productos FuXion originales con seguimiento y atención cercana.',
  },
  {
    icon: MapPin,
    title: 'Cobertura nacional',
    text: 'Realizamos envíos a todo Chile con opciones flexibles de entrega.',
  },
];

const handleWhatsAppClick = () => {
  const message = 'Hola Daniel, quiero recibir orientación sobre envíos y productos FuXion.';
  window.open(buildWhatsappUrl(message), '_blank');
};

const ShippingPage = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-white dark:from-emerald-950/10 dark:via-background dark:to-background"
    >
      <SEO
        title="Envíos — FuXion Chile"
        description="Recibe tus productos FuXion de forma simple y segura. Asesoría personalizada por Daniel Falcón, coordinación de entrega y envíos a todo Chile."
      />

      {/* ── MOBILE SHELL ── */}
      <div className="md:hidden">
        <MobileAppShell 
          variant="compact"
          title="Envíos"
          description="Información de entregas."
        />
      </div>

      {/* ── Hero Section ─────────────────────────────── */}
      <section className="hidden md:block relative overflow-hidden px-5 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 mt-20">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-100/60 dark:bg-emerald-900/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-100/40 dark:bg-teal-900/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 mb-6 shadow-sm"
          >
            <Truck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight"
          >
            Envíos
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Queremos que recibas tus productos FuXion de forma simple y segura.
          </motion.p>
        </div>
      </section>

      {/* ── Content Section ──────────────────────────── */}
      <section className="px-5 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Main content card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm"
          >
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p className="text-foreground/90 leading-relaxed text-base sm:text-lg">
                Puedes solicitar orientación personalizada antes de comprar. Tu pedido será atendido directamente por <strong>Daniel Falcón</strong>, asesor FuXion independiente, quien podrá ayudarte a elegir los productos adecuados según tus objetivos y coordinar la entrega.
              </p>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-emerald-200/60 dark:via-emerald-800/40 to-transparent" />

              <p className="text-foreground/90 leading-relaxed text-base sm:text-lg">
                Una vez confirmado tu pedido, coordinamos la entrega mediante opciones disponibles de despacho, delivery o envío hasta la puerta de tu casa según tu ubicación.
              </p>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-emerald-200/60 dark:via-emerald-800/40 to-transparent" />

              <p className="text-foreground/90 leading-relaxed text-base sm:text-lg">
                Si prefieres comprar directamente a través del canal oficial de FuXion, también puedes hacerlo desde la página oficial de la compañía.
              </p>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-emerald-200/60 dark:via-emerald-800/40 to-transparent" />

              <p className="text-foreground/90 leading-relaxed text-base sm:text-lg font-medium">
                Nuestro objetivo es entregarte una experiencia cercana, clara y personalizada desde la elección del producto hasta la recepción de tu pedido.
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full sm:w-auto shadow-premium-soft hover:shadow-md"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="h-5 w-5" />
                Hablar con Daniel
              </Button>

              <a
                href="https://fuxion.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Ir a la tienda oficial FuXion</span>
              </a>
            </div>
          </motion.div>

          {/* ── Features Grid ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-emerald-200/60 dark:hover:border-emerald-800/40 transition-all duration-200 hover:shadow-sm group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 shrink-0 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors duration-200">
                    <IconComponent className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{feature.text}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default ShippingPage;
