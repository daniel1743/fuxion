
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Sparkles, Zap, CheckCircle2, MessageCircle, Star } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { getImageUrl, getPlaceholderImage } from '@/lib/imageUtils';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const DEFAULT_WHATSAPP_NUMBER = '56989639088';

const resolveWhatsappBase = () => {
  const envUrl = import.meta.env.VITE_WHATSAPP_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  const envNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/[^\d]/g, '');
  if (envNumber) {
    return `https://wa.me/${envNumber}`;
  }

  return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`;
};

const buildWhatsappUrl = (message) => {
  const base = resolveWhatsappBase();
  const encodedMessage = encodeURIComponent(message);

  if (base.includes('/message/')) {
    return `${base}?text=${encodedMessage}`;
  }

  if (base.includes('wa.me/')) {
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}text=${encodedMessage}`;
  }

  const number = base.replace(/[^\d]/g, '') || DEFAULT_WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodedMessage}`;
};

const handleWhatsAppClick = (message = 'Hola, quiero empezar mi cambio con Fuxion') => {
  const whatsappUrl = buildWhatsappUrl(message);
  window.open(whatsappUrl, '_blank');
};

const solutions = [
  {
    id: 1,
    title: 'Desintoxicación suave y digestión',
    subtitle: 'Ideales para mujeres con hinchazón, estreñimiento o digestión lenta.',
    products: ['Prunex1', 'Flora Liv', 'Liquid Fiber', 'Balance'],
    benefits: [
      'Abdomen más liviano',
      'Mejor digestión',
      'Menos inflamación',
      'Eliminación de toxinas'
    ],
    buttonText: 'Quiero mejorar mi digestión',
    color: 'from-purple-500/20 to-pink-500/20',
    icon: <Sparkles className="w-8 h-8" />
  },
  {
    id: 2,
    title: 'Control de peso y medidas',
    subtitle: 'Perfectos para acelerar el metabolismo y controlar ansiedad.',
    products: ['Thermo T3', 'NoCarb-T', 'Protein Active Fit', 'Pack 5/14'],
    benefits: [
      'Ayuda a quemar grasa',
      'Controla antojos',
      'Mejora energía',
      'Resultados visibles en semanas'
    ],
    buttonText: 'Quiero bajar de peso',
    color: 'from-pink-500/20 to-rose-500/20',
    icon: <Zap className="w-8 h-8" />
  },
  {
    id: 3,
    title: 'Energía limpia y vitalidad diaria',
    subtitle: 'Para mujeres que se sienten agotadas o sin motivación.',
    products: ['Vita Xtra T+', 'VitaEnergía', 'Nutraday'],
    benefits: [
      'Energía estable',
      'Mejor ánimo',
      'Mayor rendimiento',
      'Vitalidad durante el día'
    ],
    buttonText: 'Quiero más energía',
    color: 'from-cyan-500/20 to-blue-500/20',
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
    id: 'vita-xtra-t+',
    name: 'VITA XTRA T+',
    description: 'Energía + rendimiento',
    image: getImageUrl('/img/productos/vita-xtra-t+.png'),
    slug: 'vita-xtra-t+'
  }
];

const testimonials = [
  {
    quote: 'Al tercer día ya me sentía más liviana. La hinchazón bajó muchísimo.',
    name: 'María G.'
  },
  {
    quote: 'Me ayudó a controlar la ansiedad de comer y por fin empecé a bajar medidas.',
    name: 'Ana R.'
  },
  {
    quote: 'La energía me cambió. No más café que me alteraba.',
    name: 'Laura M.'
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

const HomePage = () => {
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
        <title>Fuxion — Transforma tu cuerpo desde adentro | Pérdida de Peso y Bienestar Femenino</title>
        <meta name="description" content="Descubre el sistema Fuxion: productos naturales diseñados para ayudarte a desinflamar, controlar tu peso, mejorar tu digestión y aumentar tu energía diaria. Sin dietas extremas. Sin sufrimiento. Resultados reales." />
      </Helmet>

      {/* SECCIÓN 1 – HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-pink-900/40 to-rose-900/50 opacity-90"></div>
        <div className="absolute inset-0 radial-gradient-glow"></div>
        <motion.div
          className="w-full h-full absolute"
          animate={{
            background: [
              "radial-gradient(ellipse 80% 80% at 50% -20%,rgba(168,85,247,0.3),rgba(255,255,255,0))",
              "radial-gradient(ellipse 80% 80% at 50% -20%,rgba(236,72,153,0.3),rgba(255,255,255,0))",
              "radial-gradient(ellipse 80% 80% at 50% -20%,rgba(251,113,133,0.3),rgba(255,255,255,0))",
              "radial-gradient(ellipse 80% 80% at 50% -20%,rgba(168,85,247,0.3),rgba(255,255,255,0))",
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="text-center lg:text-left">
              <motion.h1
                className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Transforma tu cuerpo desde adentro.
              </motion.h1>
              <motion.p
                className="text-2xl md:text-3xl font-semibold text-primary/90 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                Recupera tu energía, liviandad y bienestar natural.
              </motion.p>
              <motion.p
                className="mt-6 text-lg md:text-xl text-primary/80 max-w-xl mx-auto lg:mx-0 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                Descubre el sistema Fuxion: productos naturales diseñados para ayudarte a desinflamar, controlar tu peso, mejorar tu digestión y aumentar tu energía diaria. Sin dietas extremas. Sin sufrimiento. Resultados reales.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
              >
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg dark:neon-glow text-lg px-8 py-6"
                  onClick={() => handleWhatsAppClick('Hola, quiero empezar mi cambio con Fuxion')}
                >
                  Quiero empezar mi cambio <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 120 }}
              className="relative"
            >
              <div className="absolute -inset-6 bg-gradient-to-br from-purple-500/40 via-pink-500/30 to-rose-400/30 blur-3xl opacity-40 pointer-events-none"></div>
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={getImageUrl('/img/familia.fuxion.png')}
                  alt="Mujer sonriendo, energía, bienestar, estilo soft-wellness"
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
            ¿Te sientes hinchada, cansada o te cuesta bajar de peso aunque lo intentes?
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-center text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Muchas mujeres comparten lo mismo:
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
            No es falta de voluntad.
            <br />
            <span className="text-foreground">Tu cuerpo solo necesita recuperar su equilibrio.</span>
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
            Fuxion trabaja desde adentro con una combinación de ingredientes naturales, fibras, probióticos, extractos vegetales y súper alimentos que ayudan a tu organismo a funcionar mejor, eliminar lo que sobra y aprovechar mejor lo que comes.
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
                className={`bg-gradient-to-br ${solution.color} rounded-2xl p-8 border border-border hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 flex flex-col h-full`}
              >
                <div className="flex items-center gap-4 mb-4 text-primary">
                  {solution.icon}
                  <h3 className="text-2xl font-bold text-foreground">{solution.id === 1 ? '🔶' : solution.id === 2 ? '🔷' : '🔶'} {solution.title}</h3>
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

      {/* SECCIÓN 5 – Testimonios */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Tú puedes ser la siguiente historia bonita.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-card p-6 rounded-lg border border-border flex flex-col items-center text-center hover:border-primary transition-all duration-300"
              >
                <div className="flex mb-4 text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-muted-foreground italic text-lg mb-4">"{testimonial.quote}"</p>
                <p className="font-bold text-foreground">{testimonial.name}</p>
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
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg"
              onClick={() => handleWhatsAppClick('Hola, quiero mi recomendación personalizada')}
            >
              Quiero mi recomendación personalizada <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
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
                <Link to="/explorar">
                  <div className="group relative bg-card rounded-lg overflow-hidden border border-border transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 flex flex-col h-full">
                    <div className="absolute inset-0 radial-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative h-60 overflow-hidden bg-secondary flex-shrink-0">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        alt={product.name}
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
            className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-2xl p-8 md:p-12 border border-primary/30 text-center"
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
              <MessageCircle className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Asesoría personalizada GRATIS hoy
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              No todos los cuerpos son iguales. Te ayudo a elegir el producto ideal según tu objetivo.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg text-lg px-8 py-6"
                onClick={() => handleWhatsAppClick('Hola, quiero mi recomendación personalizada')}
              >
                Quiero mi recomendación <MessageCircle className="ml-2 h-5 w-5" />
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
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg dark:neon-glow text-lg px-8 py-6"
              onClick={() => handleWhatsAppClick('Hola, quiero iniciar mi cambio ahora')}
            >
              Iniciar mi cambio ahora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

    </motion.div>
  );
};

export default HomePage;
