import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { openWhatsapp } from '@/lib/whatsapp';
import MobileAppShell from '@/components/mobile/MobileAppShell';
import {
  Shield,
  UserCheck,
  Settings,
  Scale,
  Lock,
  Mail,
  MessageCircle,
  FileText,
  Eye,
  AlertTriangle,
  Heart,
  ChevronRight,
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

// ── Section data ──────────────────────────────────────────────
const sections = [
  {
    id: 'informacion-recopilamos',
    icon: UserCheck,
    title: '1. Información que Recopilamos',
    content: (
      <div className="space-y-6">
        <p className="text-foreground/80 leading-relaxed">
          Para ofrecerte una experiencia fluida y personalizada, recopilamos información de dos maneras principales:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border/60 rounded-xl p-5 hover:border-emerald-200/60 dark:hover:border-emerald-800/40 transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Datos proporcionados voluntariamente</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Cuando utilizas nuestros formularios de contacto, te comunicas con nuestro asistente virtual o nos envías un correo, podemos solicitarte:
            </p>
            <ul className="space-y-2">
              {[
                'Nombre y apellidos.',
                'Datos de contacto (correo electrónico, número de teléfono).',
                'Consultas específicas sobre nuestros productos.',
                'Tus metas, preferencias u objetivos personales de bienestar físico.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border/60 rounded-xl p-5 hover:border-emerald-200/60 dark:hover:border-emerald-800/40 transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={1.8} />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Datos de navegación (Pasivos)</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              A través del uso normal de la página, podemos recibir datos técnicos no identificables directamente, como tu tipo de navegador, zona horaria y páginas visitadas dentro de nuestro sitio, con el único fin de optimizar el rendimiento técnico de la tienda.
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                Nuestro Compromiso
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                Nunca solicitaremos información financiera confidencial a través de canales no seguros, ni datos sensibles de salud (historiales médicos), ya que nuestro enfoque es puramente nutricional.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'uso-etico',
    icon: Settings,
    title: '2. Uso Exclusivo y Ético de tu Información',
    content: (
      <div className="space-y-6">
        <p className="text-foreground/80 leading-relaxed">
          La información que nos confías está estrictamente destinada a mejorar tu calidad de vida a través de nuestros servicios. Utilizamos tus datos exclusivamente para:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: MessageCircle, title: 'Atención al Cliente', text: 'Responder a tus consultas, dudas y comentarios de forma rápida y efectiva.' },
            { icon: UserCheck, title: 'Asesoría Personalizada', text: 'Brindarte orientación específica sobre qué productos FuXion se alinean mejor con tus objetivos de bienestar.' },
            { icon: Settings, title: 'Gestión Logística', text: 'Coordinar la disponibilidad de productos, envíos y entregas de manera exitosa.' },
            { icon: Eye, title: 'Mejora Continua', text: 'Analizar de forma anónima cómo interactúan los usuarios con nuestra tienda para mejorar la interfaz (UI), la velocidad de carga y la experiencia de usuario (UX).' },
          ].map((item, i) => {
            const IconComponent = item.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-emerald-200/60 dark:hover:border-emerald-800/40 transition-all duration-200 group">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                  <IconComponent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                Garantía de Privacidad
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Bajo ninguna circunstancia vendemos, alquilamos, cedemos ni comercializamos tu información personal a terceros, agencias de marketing o bases de datos externas.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'atencion-personalizada',
    icon: MessageCircle,
    title: '3. Atención Personalizada y Transparencia Comercial',
    content: (
      <div className="space-y-6">
        <p className="text-foreground/80 leading-relaxed">
          Para garantizar que recibas una asesoría cercana, humana y adaptada a tus necesidades, las solicitudes, dudas y gestiones realizadas a través de esta plataforma serán atendidas directamente por <strong>Daniel Falcón</strong>, Empresario y Asesor Independiente FuXion.
        </p>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Esta estructura nos permite ofrecerte un acompañamiento uno-a-uno, asegurando que la información que recibas sea precisa, responsable y basada en el catálogo oficial de productos.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'descargo-salud',
    icon: AlertTriangle,
    title: '4. Descargo de Responsabilidad de Salud y Bienestar',
    content: (
      <div className="space-y-6">
        <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700/50 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6 text-amber-600 dark:text-amber-400" strokeWidth={1.8} />
            </div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Esta sección es crucial para tu protección legal
            </p>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed mb-4">
            La orientación, los artículos y la asesoría entregada a través de esta plataforma tienen fines estrictamente informativos y nutricionales.
          </p>
          <ul className="space-y-3">
            {[
              { icon: Leaf, title: 'Naturaleza de los Productos', text: 'Los productos FuXion son suplementos dietéticos y nutracéuticos elaborados con ingredientes de origen natural.' },
              { icon: AlertTriangle, title: 'Límites de Uso', text: 'Estos productos no son medicamentos. No están diseñados para diagnosticar, tratar, curar ni prevenir ninguna enfermedad o patología.' },
              { icon: Shield, title: 'Responsabilidad del Usuario', text: 'La información proporcionada no reemplaza en ningún caso la consulta, el diagnóstico o el tratamiento prescrito por un médico, nutricionista u otro profesional de la salud calificado. Recomendamos encarecidamente consultar a tu médico antes de iniciar cualquier programa de suplementación, especialmente si estás embarazada, en periodo de lactancia, tomando medicamentos recetados o padeces alguna condición médica preexistente.' },
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-amber-950/20">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                    <IconComponent className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">{item.title}</p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'seguridad-datos',
    icon: Lock,
    title: '5. Seguridad de tus Datos',
    content: (
      <div className="space-y-6">
        <p className="text-foreground/80 leading-relaxed">
          Implementamos medidas de seguridad técnicas, administrativas y digitales razonables y acordes a los estándares de la industria (como certificados SSL y encriptación básica) para proteger tu información contra pérdidas, robos, accesos no autorizados, divulgación, alteración o destrucción.
        </p>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Entendemos que la seguridad en internet nunca es infalible al 100%, pero trabajamos constantemente para mantener un entorno digital blindado.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'derechos-contacto',
    icon: Mail,
    title: '6. Tus Derechos y Medios de Contacto',
    content: (
      <div className="space-y-6">
        <p className="text-foreground/80 leading-relaxed">
          Eres el dueño absoluto de tu información. En cualquier momento, tienes el derecho de:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Eye, title: 'Acceder', text: 'a los datos que tenemos sobre ti.' },
            { icon: Settings, title: 'Rectificar', text: 'cualquier información inexacta.' },
            { icon: AlertTriangle, title: 'Eliminar', text: 'solicitar la eliminación inmediata de tu información de nuestros registros de atención.' },
          ].map((item, i) => {
            const IconComponent = item.icon;
            return (
              <div key={i} className="text-center p-5 rounded-xl bg-card border border-border/50 hover:border-emerald-200/60 dark:hover:border-emerald-800/40 transition-all duration-200 group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                  <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            );
          })}
        </div>
        <p className="text-foreground/80 leading-relaxed">
          Para ejercer estos derechos, o si tienes cualquier duda sobre esta política, puedes comunicarte con nosotros de forma directa e inmediata a través de los canales de contacto dispuestos oficialmente en esta misma página web.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => openWhatsapp('Hola, quiero ejercer mis derechos sobre mis datos personales.')}
            className="w-full sm:w-auto"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contactar por WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/contacto'}
            className="w-full sm:w-auto"
          >
            <Mail className="mr-2 h-4 w-4" />
            Ir a formulario de contacto
          </Button>
        </div>
      </div>
    ),
  },
];

const PrivacyPolicyPage = () => {
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
        title="Política de Privacidad — FuXion Chile"
        description="Política de Privacidad y Tratamiento de Datos de Tienda FuXion. Conoce cómo protegemos y utilizamos tu información personal. Transparencia y seguridad."
        canonical="/privacidad"
        ogImageAlt="Bienestar en Claro — Política de Privacidad"
      />

      {/* ── MOBILE SHELL ── */}
      <div className="md:hidden">
        <MobileAppShell 
          variant="compact"
          title="Privacidad"
          description="Protegemos y cuidamos tu información."
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════ */}
      <section className="hidden md:flex relative min-h-[50vh] items-center overflow-hidden pt-24 bg-gradient-to-br from-[#f0faf4] via-white to-[#e8f5e9] dark:from-[#0a1a12] dark:via-surface-muted dark:to-[#0d2818]">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-teal-100/30 dark:bg-teal-900/20 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-emerald-50/50 dark:bg-emerald-800/10 blur-2xl" />
        </div>

        <div className="relative z-content w-full max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 mb-6 shadow-sm">
              <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Política de Privacidad y{' '}
            <span className="text-emerald-600 dark:text-emerald-400">Tratamiento de Datos</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            "Tu confianza, tu bienestar y tu privacidad son nuestra máxima prioridad."
          </motion.p>

          <motion.p
            className="text-base text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            En Tienda FuXion, entendemos que el camino hacia el bienestar requiere de un entorno seguro y transparente. Esta Política de Privacidad ha sido diseñada para explicarte de manera detallada, clara y honesta cómo recopilamos, protegemos y utilizamos la información que compartes con nosotros al navegar por nuestra plataforma o interactuar con nuestros asesores. Tu tranquilidad es parte integral de tu salud.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CONTENT SECTIONS
      ════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-premium-soft hover:shadow-md transition-shadow duration-300"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                      <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">{section.title}</h2>
                  </div>

                  {/* Section content */}
                  <div className="text-sm sm:text-base">
                    {section.content}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Last updated badge ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border/60 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" strokeWidth={1.8} />
              <span>Fecha de última actualización: Julio 2026</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-transparent to-emerald-50/50 dark:to-emerald-950/10">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-teal-800 p-8 md:p-12 text-center text-white"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-content">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="w-8 h-8" strokeWidth={1.5} />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                ¿Tienes alguna duda sobre tu privacidad?
              </h2>
              <p className="text-emerald-100/90 text-lg mb-8 max-w-xl mx-auto">
                Estamos aquí para resolver cualquier inquietud. Contáctanos directamente y te atenderemos de forma personalizada.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => openWhatsapp('Hola, tengo una consulta sobre la política de privacidad.')}
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

export default PrivacyPolicyPage;
