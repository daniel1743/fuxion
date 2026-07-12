import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  Award,
  Heart,
  Users,
  Shield,
  FileText,
  Mail,
  Phone,
  Globe,
  TrendingUp,
  MessagesSquare,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileAppShell from '@/components/mobile/MobileAppShell';
import SEO from '@/components/SEO';
import {
  buildLocalBusinessSchema,
  buildPersonSchema,
} from '@/lib/productSeo';

// ── Certifications (pertenecen a FuXion Biotech, no a esta tienda) ──
const certifications = [
  { name: 'BPM', icon: Shield, desc: 'Buenas Prácticas de Manufactura' },
  { name: 'HACCP', icon: Award, desc: 'Control de puntos críticos' },
  { name: 'Baltic Control', icon: Award, desc: 'Auditoría internacional' },
  { name: 'Humanitas', icon: Leaf, desc: 'Responsabilidad social' },
  { name: 'Clean Label', icon: FileText, desc: 'Transparencia de ingredientes' },
];

// ── Valores de la tienda / atención ──────────────────────────
const values = [
  {
    icon: MessagesSquare,
    title: 'Asesoría Personalizada',
    desc: 'Te orientamos para encontrar los productos FuXion que mejor se adaptan a tus objetivos de bienestar.',
  },
  {
    icon: Heart,
    title: 'Acompañamiento Real',
    desc: 'No solo vendemos productos: te acompañamos en el proceso, resolvemos dudas y hacemos seguimiento.',
  },
  {
    icon: Shield,
    title: 'Información Clara',
    desc: 'Compartimos información honesta y verificada sobre los productos FuXion, sin promesas exageradas.',
  },
  {
    icon: Users,
    title: 'Cercanía',
    desc: 'Atención directa con Daniel Falcon, distribuidor independiente comprometido con cada cliente.',
  },
];

// ── Founder Info ──────────────────────────────────────────────
const founder = {
  name: 'Daniel Falcon',
  role: 'Distribuidor Independiente FuXion',
  bio: 'Emprendedor independiente y distribuidor autorizado FuXion. Mi objetivo es acompañarte con información clara y asesoría personalizada para que puedas elegir los productos que mejor se ajusten a tus metas de bienestar. No soy la empresa FuXion: soy alguien que cree en sus productos y los distribuye con responsabilidad.',
  image: '/daniel-falcon-1.jpeg',
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
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-950 md:bg-background pb-20"
    >
      <SEO
        title="Tienda FuXion Chile | Distribuidor Independiente — Daniel Falcon"
        description="Tienda gestionada por Daniel Falcon, distribuidor independiente FuXion en Chile. Asesoría personalizada, información clara y acompañamiento en productos FuXion."
        canonical="/sobre-nosotros"
        ogType="website"
        schema={[buildLocalBusinessSchema(), personSchema]}
      />

      {/* ── MOBILE SHELL ── */}
      <div className="md:hidden">
        <MobileAppShell 
          variant="compact"
          title="Acerca de Nosotros"
          description="Nuestra misión y filosofía"
        />
      </div>

      {/* ── Hero / Encabezado (Desktop) ───────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 py-20 sm:py-28 hidden md:block">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-200 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-5 relative">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Leaf className="h-4 w-4" />
              Distribuidor Independiente FuXion
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
              Tienda FuXion{' '}
              <span className="text-emerald-600">Chile</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Soy Daniel Falcon, distribuidor independiente FuXion. Esta tienda existe para
              acercarte información honesta, orientación personalizada y los productos FuXion
              que mejor se adapten a tus objetivos de bienestar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Aviso de transparencia ───────────────────────────── */}
      <section className="py-8 bg-amber-50 border-y border-amber-100">
        <div className="container mx-auto px-5">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto flex items-start gap-3 text-amber-800">
            <Info className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
            <p className="text-sm leading-relaxed">
              <strong>Nota importante:</strong> Esta es una tienda gestionada por Daniel Falcon,
              distribuidor independiente. No somos FuXion Biotech ni representamos a la empresa
              oficialmente. Los productos FuXion son fabricados y certificados por{' '}
              <strong>FuXion Biotech</strong>, compañía fundada por Álvaro Zúñiga Benavides.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Sobre FuXion Biotech ─────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-5">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeInUp} className="flex items-center gap-3 justify-center mb-4">
              <div className="h-px flex-1 bg-emerald-100" />
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 px-3">
                Información sobre la marca
              </span>
              <div className="h-px flex-1 bg-emerald-100" />
            </motion.div>
            <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-bold text-center mb-10">
              Sobre FuXion Biotech
            </motion.h2>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 sm:p-8 mb-10">
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mb-4">
                Los siguientes datos corresponden a FuXion Biotech como empresa, no a esta tienda.
              </p>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">FuXion Biotech</strong> es una compañía
                  fundada en <strong>2006</strong> por <strong>Álvaro Zúñiga Benavides</strong>,
                  de origen peruano. Su enfoque es el desarrollo de productos nutracéuticos bajo
                  el concepto de <em>Fusión Nutracéutica</em>: la combinación de ciencia,
                  nutrición e ingredientes naturales para generar productos de alto valor biológico.
                </p>
                <p>
                  FuXion — del latín <em>"fusus"</em> (fundido) — representa esa fusión entre
                  investigación científica y lo mejor de la naturaleza. Sus productos están
                  presentes en múltiples países de Latinoamérica y el mundo, y cuentan con
                  certificaciones internacionales que respaldan su proceso de fabricación.
                </p>
              </div>
            </div>

            {/* Stats con atribución explícita */}
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { num: '2006', label: 'Año de fundación de FuXion Biotech', icon: Globe },
                { num: '35+', label: 'Países con presencia FuXion', icon: Globe },
                { num: '35+', label: 'Productos en catálogo FuXion', icon: TrendingUp },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={i} {...fadeInUp} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-3">
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <div className="text-3xl font-bold text-emerald-600">{stat.num}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-snug">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Valores de la tienda ─────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-5">
          <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Cómo trabajo contigo
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Los principios que guían la atención y el servicio de esta tienda.
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
                  <v.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certificaciones ──────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-5">
          <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Estándares de FuXion Biotech
          </motion.h2>
          <p className="text-center text-muted-foreground mb-2 max-w-2xl mx-auto">
            Certificaciones que respaldan el proceso de fabricación de los productos FuXion.
          </p>
          <p className="text-center text-xs text-amber-700 font-medium mb-10">
            Estas certificaciones pertenecen a FuXion Biotech como fabricante, no a esta tienda.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl p-4 text-center shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
              >
                <cert.icon className="h-7 w-7 mx-auto text-emerald-600 mb-2" strokeWidth={1.5} />
                <p className="text-xs font-semibold text-foreground">{cert.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{cert.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Daniel Falcon ────────────────────────────────────── */}
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
                  alt="Fotografía de Daniel Falcon, Distribuidor Independiente FuXion en Chile"
                  title="Daniel Falcon - Distribuidor Independiente FuXion"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="96"
                  height="96"
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
              ¿Tienes dudas o quieres asesoría?
            </h2>
            <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
              Escríbeme directamente. Te ayudo a entender qué productos FuXion se adaptan
              mejor a tus objetivos, sin presiones y con información clara.
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
    </motion.main>
  );
};

export default AboutPage;
