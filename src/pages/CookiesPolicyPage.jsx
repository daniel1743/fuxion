import React from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { openWhatsapp } from '@/lib/whatsapp';
import MobileAppShell from '@/components/mobile/MobileAppShell';
import {
  Shield,
  Settings,
  BarChart3,
  MessageCircle,
  Mail,
  FileText,
  HelpCircle,
  ExternalLink,
  Cookie,
  CheckCircle,
  Sliders,
} from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

// ── Cookie types ──────────────────────────────────────────────
const cookieTypes = [
  {
    icon: Settings,
    title: 'Cookies Estrictamente Necesarias (Técnicas)',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800/40',
    description: 'Son aquellas fundamentales para el funcionamiento estructural de la página. Permiten la navegación básica, la seguridad del sitio y la carga de los elementos visuales. Sin estas cookies, la tienda simplemente no podría funcionar correctamente.',
    note: 'No pueden ser desactivadas.',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  {
    icon: Sliders,
    title: 'Cookies de Experiencia y Personalización',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/40',
    borderColor: 'border-blue-200 dark:border-blue-800/40',
    description: 'Ayudan a que la página recuerde información que cambia la forma en que el sitio se comporta o se ve, como tus ajustes de idioma, el modo visual (claro/oscuro) o si ya has aceptado nuestro banner de cookies, para no molestarte preguntándote de nuevo.',
    note: 'Puedes gestionarlas desde la configuración.',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  {
    icon: BarChart3,
    title: 'Cookies de Análisis y Rendimiento',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/40',
    borderColor: 'border-purple-200 dark:border-purple-800/40',
    description: 'Nos permiten comprender, de manera 100% agregada y anónima, cómo los visitantes interactúan con nuestra página. Utilizamos herramientas reconocidas del sector (como Google Analytics) para saber qué secciones se leen más o si hay errores de carga. Esto nos ayuda a rediseñar el contenido y mejorar la navegación constantemente.',
    note: 'Puedes desactivarlas en cualquier momento.',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
  },
];

// ── Browser instructions ──────────────────────────────────────
const browserInstructions = [
  {
    name: 'Google Chrome',
    steps: 'Configuración > Privacidad y seguridad > Cookies y otros datos de sitios.',
    url: 'https://support.google.com/chrome/answer/95647',
  },
  {
    name: 'Safari (Apple)',
    steps: 'Preferencias > Privacidad > Bloquear todas las cookies.',
    url: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac',
  },
  {
    name: 'Mozilla Firefox',
    steps: 'Ajustes > Privacidad & Seguridad > Cookies y datos del sitio.',
    url: 'https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox',
  },
];

const CookiesPolicyPage = () => {
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
        title="Política de Cookies — FuXion Chile"
        description="Política de Cookies y tecnologías similares de Tienda FuXion. Conoce cómo usamos cookies para mejorar tu experiencia de navegación."
        canonical="/cookies"
      />

      {/* ── MOBILE SHELL ── */}
      <div className="md:hidden">
        <MobileAppShell 
          variant="compact"
          title="Política de Cookies"
          description="Tecnología para mejorar tu experiencia."
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════ */}
      <section className="hidden md:flex relative min-h-[50vh] items-center overflow-hidden pt-24 bg-gradient-to-br from-[#f0faf4] via-white to-[#e8f5e9] dark:from-[#0a1a12] dark:via-[#0f1f18] dark:to-[#0d2818]">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-teal-100/30 dark:bg-teal-900/20 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-emerald-50/50 dark:bg-emerald-800/10 blur-2xl" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 mb-6 shadow-sm">
              <Cookie className="h-8 w-8 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Política de Cookies y{' '}
            <span className="text-emerald-600 dark:text-emerald-400">Tecnologías Similares</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            "Tecnología invisible, diseñada para mejorar tu experiencia visible."
          </motion.p>

          <motion.p
            className="text-base text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            En nuestra tienda queremos que tu navegación sea rápida, segura y sumamente intuitiva. Para lograrlo, esta plataforma utiliza cookies y tecnologías de seguimiento similares. A continuación, te explicamos con total transparencia qué son, cómo las usamos y cómo puedes controlarlas.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHAT ARE COOKIES
      ════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-premium-soft"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">¿Qué son las cookies?</h2>
            </div>

            <div className="text-[15px] sm:text-base text-foreground/80 leading-relaxed space-y-4">
              <p>
                Las cookies son pequeños archivos de texto que se descargan de forma segura en tu navegador (ya sea en tu móvil, tablet o computadora) al visitar una página web. Su función es simple pero vital: permiten que la página "recuerde" información sobre tu visita, como tus preferencias de visualización, facilitando tu próxima navegación y haciendo que el sitio sea mucho más útil para ti.
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    No son virus, ni pueden extraer información personal de tu disco duro.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TYPES OF COOKIES
      ════════════════════════════════════════════════════════════ */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Tipos de cookies que implementamos
            </h2>
            <p className="text-muted-foreground">
              Para proteger tu privacidad y ofrecerte una experiencia limpia, NO utilizamos cookies de publicidad invasiva ni rastreadores para anuncios de terceros. Solo usamos lo necesario para servirte mejor:
            </p>
          </motion.div>

          <div className="space-y-6">
            {cookieTypes.map((cookie, index) => {
              const IconComponent = cookie.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-card border ${cookie.borderColor} rounded-2xl p-6 sm:p-8 shadow-premium-soft hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${cookie.iconBg} flex items-center justify-center shrink-0`}>
                      <IconComponent className={`w-6 h-6 ${cookie.color}`} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold text-foreground mb-3 ${cookie.color}`}>
                        {cookie.title}
                      </h3>
                      <p className="text-foreground/80 leading-relaxed mb-3">
                        {cookie.description}
                      </p>
                      <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${cookie.bgColor} ${cookie.color}`}>
                        <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>{cookie.note}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MANAGEMENT & CONTROL
      ════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-transparent to-emerald-50/30 dark:to-emerald-950/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-premium-soft"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                <Sliders className="w-6 h-6 text-amber-600 dark:text-amber-400" strokeWidth={1.8} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Gestión y Control: Tú tienes el poder
              </h2>
            </div>

            <p className="text-foreground/80 leading-relaxed mb-6">
              El control de tu privacidad está en tus manos. Puedes configurar, bloquear o eliminar completamente las cookies desde las opciones de configuración de tu navegador en cualquier momento. Aquí te indicamos cómo hacerlo en los navegadores más populares:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {browserInstructions.map((browser, index) => (
                <div
                  key={index}
                  className="p-5 rounded-xl bg-card border border-border/50 hover:border-emerald-200/60 dark:hover:border-emerald-800/40 transition-all duration-200 group"
                >
                  <h4 className="font-semibold text-foreground text-sm mb-2">{browser.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{browser.steps}</p>
                  <a
                    href={browser.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Instrucciones oficiales</span>
                  </a>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={1.8} />
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  <strong>Nota:</strong> Ten en cuenta que si decides bloquear las cookies necesarias o de experiencia, es posible que algunas funciones de diseño de nuestra tienda no se visualicen con la misma rapidez o fluidez.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-teal-800 p-8 md:p-12 text-center text-white"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="w-8 h-8" strokeWidth={1.5} />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                ¿Tienes preguntas sobre las cookies?
              </h2>
              <p className="text-emerald-100/90 text-lg mb-8 max-w-xl mx-auto">
                Estamos aquí para resolver cualquier duda. Contáctanos directamente y te atenderemos de forma personalizada.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => openWhatsapp('Hola, tengo una consulta sobre la política de cookies.')}
                  className="bg-white text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 shadow-xl shadow-emerald-900/20"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Consultar por WhatsApp
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = '/contacto'}
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Ir a contacto
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default CookiesPolicyPage;
