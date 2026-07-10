import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  Award,
  Heart,
  Users,
  Shield,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Star,
  Globe,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import {
  buildOrganizationSchema,
  buildLocalBusinessSchema,
  buildPersonSchema,
  SITE_URL,
  STORE_NAME,
} from '@/lib/productSeo';

// ── Certifications ────────────────────────────────────────────
const certifications = [
  { name: 'BPM', icon: Shield, color: 'emerald' },
  { name: 'HACCP', icon: Award, color: 'blue' },
  { name: 'Baltic Control', icon: Award, color: 'blue' },
  { name: 'Humanitas', icon: Leaf, color: 'green' },
  { name: 'Clean Label', icon: Sparkles, color: 'amber' },
  { name: 'Avanzando en Ciencia, Regresando a lo Natural', icon: Globe, color: 'teal' },
];

// ── Values ────────────────────────────────────────────────────
const values = [
  {
    icon: Leaf,
    title: 'Ciencia + Naturaleza',
    desc: 'Fusionamos investigación científica avanzada con ingredientes naturales para crear nutraceuticos de eficacia comprobada.',
  },
  {
    icon: Shield,
    title: 'Calidad Certificada',
    desc: 'Todos nuestros productos pasan por rigurosos controles de calidad bajo estándares internacionales BPM y HACCP.',
  },
  {
    icon: Heart,
    title: 'Compromiso Real',
    desc: 'Creemos en la nutrición de verdad: sin promesas vacías, solo resultados medibles y transparentes.',
  },
  {
    icon: Users,
    title: 'Asesoría Personalizada',
    desc: 'Cada persona es única. Te acompañamos con asesoramiento experto para encontrar la solución perfecta para ti.',
  },
];

// ── Timeline ──────────────────────────────────────────────────
const timeline = [
  { year: '2010', title: 'Fundación', desc: 'Fuxion se funda en Costa Rica con la visión de fusionar ciencia y naturaleza.' },
  { year: '2014', title: 'Expansión Regional', desc: 'Presencia en más de 35 países en Latinoamérica y el mundo.' },
  { year: '2024', title: 'En Chile', desc: 'Llegada de Tienda Fuxion a Chile con asesoría personalizada.' },
];

// ── Founder Info ──────────────────────────────────────────────
const founder = {
  name: 'Daniel Falcon',
  role: 'Distribuidor Independiente FuXion',
  bio: 'Asesor independiente FuXion enfocado en acompañar a las personas en su camino de bienestar. Distribuidor comprometido en acercar productos nutraceuticos de calidad a cada hogar chileno.',
  image: '/icons/android-chrome-192x192.png',
};

// ── Page Component ────────────────────────────────────────────
const AboutPage = () => {
  const personSchema = buildPersonSchema(founder);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sobre Nosotros — Historia de Fuxion"
        description="Conoce la historia de Fuxion, la fusión entre ciencia y naturaleza. Empresa con más de 20 años de experiencia en nutraceuticos y presencia en 35 países."
        canonical="/sobre-nosotros"
        ogType="website"
        schema={[buildOrganizationSchema(), buildLocalBusinessSchema(), personSchema]}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 py-20 sm:py-28">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-200 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-5 relative">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              Nuestra Historia
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
              Donde la{' '}
              <span className="text-emerald-600">ciencia</span> se une a la{' '}
              <span className="text-emerald-600">naturaleza</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Fuxion nació con una misión clara: crear productos que realmente funcionen,
              fusionando la investigación científica más avanzada con lo mejor de la naturaleza.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-emerald-100">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '20+', label: 'Años de experiencia', icon: Globe },
              { num: '35', label: 'Países con presencia', icon: Globe },
              { num: '35+', label: 'Productos en catálogo', icon: Zap },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i} {...fadeInUp} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">{stat.num}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-5">
          <div className="max-w-4xl mx-auto">
            <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-bold text-center mb-10">
              La Fusión Nutracéutica
            </motion.h2>
            <div className="prose prose-lg mx-auto text-muted-foreground leading-relaxed">
              <motion.p {...fadeInUp}>
                <strong className="text-foreground">Fuxion</strong> — del latín <em>"fusus"</em> (fundido) —
                representa la fusión perfecta entre ciencia y naturaleza. Nuestra filosofía se basa en que
                los mejores resultados en salud y bienestar surgen cuando combinamos lo mejor de ambos mundos.
              </motion.p>
              <motion.p {...fadeInUp}>
                Cada producto Fuxion es desarrollado por un equipo dedicado a la investigación,
                utilizando ingredientes naturales de la más alta calidad y tecnología para
                garantizar la máxima biodisponibilidad y eficacia.
              </motion.p>
              <motion.p {...fadeInUp}>
                Desde nuestra fundación en Costa Rica en 2010, hemos crecido hasta estar presentes en más de
                35 países, llegando a personas que buscan una nutrición real y resultados visibles.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-5">
          <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Nuestros Valores
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Los principios que guían cada producto y cada interacción con nuestros clientes.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-5">
          <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Nuestra Trayectoria
          </motion.h2>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-emerald-200 transform md:-translate-x-0.5" />
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-center mb-10 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute left-6 md:left-1/2 w-3 h-3 bg-emerald-500 rounded-full transform -translate-x-1.5 md:-translate-x-1.5 mt-1.5" />
                <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <span className="text-emerald-600 font-bold text-sm">{item.year}</span>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ───────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-5">
          <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Certificaciones
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Estándares internacionales que garantizan la calidad de cada producto Fuxion.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl p-4 text-center shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
              >
                <cert.icon className="h-8 w-8 mx-auto text-emerald-600 mb-2" />
                <p className="text-xs font-semibold text-foreground">{cert.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder ──────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-5">
          <motion.div
            {...fadeInUp}
            className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 sm:p-12 border border-emerald-100 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-emerald-100 ring-4 ring-emerald-200 overflow-hidden shrink-0">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground">{founder.name}</h2>
                <p className="text-emerald-600 font-semibold mb-3">{founder.role}</p>
                <p className="text-muted-foreground leading-relaxed">{founder.bio}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────── */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-5 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¿Quieres saber más?
            </h2>
            <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
              Estamos aquí para asesorarte. Contáctanos por cualquier medio y te ayudaremos
              a encontrar los productos perfectos para tus objetivos de bienestar.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/56912345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold rounded-full px-6 py-3 hover:bg-emerald-50 transition-colors"
              >
                <Phone className="h-5 w-5" />
                WhatsApp
              </a>
              <a
                href="mailto:contacto@tiendafuxion.space"
                className="inline-flex items-center gap-2 bg-white/10 text-white font-bold rounded-full px-6 py-3 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <Mail className="h-5 w-5" />
                Email
              </a>
              <Link to="/contacto">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Formulario de Contacto
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
