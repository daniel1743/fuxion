
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flame, Droplets, Sparkles, ShieldCheck, Activity, Star } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const featuredProducts = [
  {
    id: 'prunex-1',
    name: 'PRUNEX 1',
    description: 'Limpieza del colon - Ideal para estreñimiento severo',
    image: '/img/productos/prunex-1.png',
    price: 23300,
    slug: 'prunex-1'
  },
  {
    id: 'vitaenergia',
    name: 'VITAENERGÍA',
    description: 'Energizante natural - Vitalidad todo el día',
    image: '/img/productos/vitaenergía.png',
    price: 46500,
    slug: 'vitaenergía'
  },
  {
    id: 'biopro+-tect',
    name: 'BIOPRO+ TECT',
    description: 'Proteína premium con colostrum - Fortalece tu sistema inmune',
    image: '/img/productos/biopro+-tect.png',
    price: 58000,
    slug: 'biopro+-tect'
  },
  {
    id: 'thermo-t3',
    name: 'THERMO T3',
    description: 'Control de peso - Acelera tu metabolismo',
    image: '/img/productos/thermo-t3.png',
    price: 54000,
    slug: 'thermo-t3'
  },
  {
    id: 'beauty-in',
    name: 'BEAUTY-IN',
    description: 'Anti-edad y belleza - Piel radiante y saludable',
    image: '/img/productos/beauty-in.png',
    price: 52000,
    slug: 'beauty-in'
  },
  {
    id: 'vera+',
    name: 'VERA+',
    description: 'Limpieza hepática - Desintoxica tu hígado naturalmente',
    image: '/img/productos/vera+.png',
    price: 46500,
    slug: 'vera+'
  },
];

const categories = [
  {
    name: 'Control de Peso',
    description: 'Thermo T3, Biopro Fit, Nocarb-T',
    icon: <Activity size={40} />,
    slug: 'control-peso'
  },
  {
    name: 'Energía Natural',
    description: 'Vita Xtra T+, Vitaenergía',
    icon: <Flame size={40} />,
    slug: 'energia-natural'
  },
  {
    name: 'Bienestar Digestivo',
    description: 'Prunex 1, Liquid Fiber, Flora Liv',
    icon: <Droplets size={40} />,
    slug: 'bienestar-digestivo'
  },
  {
    name: 'Belleza & Anti-edad',
    description: 'Beauty In, Youth Elixir',
    icon: <Sparkles size={40} />,
    slug: 'belleza-anti-edad'
  },
  {
    name: 'Sistema Inmune',
    description: 'Biopro Tect, Vera+, Rexus',
    icon: <ShieldCheck size={40} />,
    slug: 'sistema-inmune'
  },
];

const testimonials = [
    {
      name: 'María González',
      quote: 'Llevo 3 meses tomando Thermo T3 y he bajado 8 kilos. Me siento con más energía y mi metabolismo ha mejorado notablemente. ¡100% recomendado!',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      product: 'Thermo T3'
    },
    {
      name: 'Carlos Mendoza',
      quote: 'Vitaenergía cambió mi vida. Antes me sentía cansado todo el día, ahora tengo energía para mi trabajo y mi familia. Los resultados son increíbles.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      product: 'Vitaenergía'
    },
    {
      name: 'Ana Rodríguez',
      quote: 'Sufría de estreñimiento crónico por años. Prunex 1 me ayudó desde la primera semana. Mi digestión mejoró y me siento mucho más liviana.',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      product: 'Prunex 1'
    },
    {
      name: 'Roberto Silva',
      quote: 'Beauty-In no es solo para mujeres. Mi piel se ve más joven, las arrugas han disminuido y me siento más seguro. Excelente producto.',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      product: 'Beauty-In'
    },
    {
      name: 'Laura Pérez',
      quote: 'Biopro+ Tect ha fortalecido mi sistema inmune. Antes me enfermaba seguido, ahora llevo 6 meses sin un resfriado. Increíble.',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      product: 'Biopro+ Tect'
    },
    {
      name: 'Diego Torres',
      quote: 'Vera+ me ayudó a limpiar mi hígado después de años de malos hábitos. Me siento renovado, con más energía y mejor salud en general.',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      product: 'Vera+'
    },
];


const HomePage = () => {

    const handleNotImplemented = (e) => {
        e.preventDefault();
        toast({ description: "🚧 ¡Esta función aún no está implementada! 🚀" });
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
            <title>Fuxion Shop — Tu universo de gadgets premium</title>
            <meta name="description" content="Explora el futuro del marketplace con Fuxion Shop. Encuentra gadgets, arte digital y colecciones únicas." />
        </Helmet>
      
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/40 to-pink-900/50 opacity-90"></div>
        <div className="absolute inset-0 radial-gradient-glow"></div>
        <motion.div
          className="w-full h-full absolute"
          animate={{
            background: [
              "radial-gradient(ellipse 80% 80% at 50% -20%,rgba(120,119,198,0.3),rgba(255,255,255,0))",
              "radial-gradient(ellipse 80% 80% at 50% -20%,rgba(198,119,169,0.3),rgba(255,255,255,0))",
              "radial-gradient(ellipse 80% 80% at 50% -20%,rgba(119,198,193,0.3),rgba(255,255,255,0))",
              "radial-gradient(ellipse 80% 80% at 50% -20%,rgba(120,119,198,0.3),rgba(255,255,255,0))",
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="text-center lg:text-left">
              <motion.p
                className="text-sm uppercase tracking-[0.3em] text-primary/80 mb-4 font-semibold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Comunidad Fuxion
              </motion.p>
              <motion.h1
                className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                Bienvenido a la familia Fuxion
              </motion.h1>
              <motion.p
                className="mt-6 text-lg md:text-xl text-primary/90 max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                Conecta con productos inteligentes, experiencias inmersivas y accesorios únicos que elevan cada momento
                en casa. Tecnología y bienestar para toda la familia en un solo lugar.
              </motion.p>
              <motion.div
                className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
              >
                <Link to="/explorar">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg dark:neon-glow">
                    Explorar productos <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 120 }}
              className="relative"
            >
              <div className="absolute -inset-6 bg-gradient-to-br from-purple-500/40 via-pink-500/30 to-cyan-400/30 blur-3xl opacity-40 pointer-events-none"></div>
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/img/familia.fuxion.png"
                  alt="Familia disfrutando de productos Fuxion"
                  className="w-full h-full object-cover max-h-[560px]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="destacados" className="py-20 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Productos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1635865165118-917ed9e20936";
                                }}
                              />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-foreground mb-2">{product.name}</h3>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                                <div className="mt-auto">
                                  <p className="text-2xl font-bold text-primary">${product.price.toLocaleString('es-CL')}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
      </section>

        <section id="categorias" className="py-20">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Categorías Populares</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {categories.map((cat, i) => (
                         <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1, type: 'spring', stiffness: 150 }}
                        >
                            <Link to={`/categorias#${cat.slug}`} className="flex flex-col items-center gap-3 group text-center max-w-[220px]">
                                <div className="w-32 h-32 rounded-full flex items-center justify-center bg-primary/10 border-2 border-primary/30 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/50">
                                    {cat.icon}
                                </div>
                                <p className="text-foreground font-semibold transition-colors group-hover:text-primary">{cat.name}</p>
                                <p className="text-sm text-muted-foreground">{cat.description}</p>
                            </Link>
                         </motion.div>
                    ))}
                </div>
            </div>
        </section>

        <section id="opiniones" className="py-20 bg-secondary/50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Lo que dicen nuestros clientes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {testimonials.slice(0, 3).map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="bg-card p-6 rounded-lg border border-border flex flex-col items-center"
                        >
                            <img
                              className="w-20 h-20 rounded-full mb-4 border-4 border-primary object-cover"
                              alt={testimonial.name}
                              src={testimonial.avatar}
                              onError={(e) => {
                                e.target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
                              }}
                            />
                            <p className="text-muted-foreground italic text-sm mb-4 text-center">"{testimonial.quote}"</p>
                            <div className="flex mt-2 text-yellow-400">
                                <Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/>
                            </div>
                            <p className="mt-4 font-bold text-foreground text-center">{testimonial.name}</p>
                            <p className="text-xs text-primary mt-1">{testimonial.product}</p>
                        </motion.div>
                     ))}
                </div>
                 <div className="text-center mt-12">
                     <Link to="/explorar">
                        <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                            Ver todos los productos
                        </Button>
                    </Link>
                </div>
            </div>
        </section>

    </motion.div>
  );
};

export default HomePage;
