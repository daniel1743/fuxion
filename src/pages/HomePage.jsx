
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cpu, Gamepad2, Lamp, Sparkles, Star, Tv } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const featuredProducts = [
  { id: 1, name: 'Quantum Laptop', image: 'Futuristic laptop on a desk', slug: 'quantum-laptop' },
  { id: 2, name: 'Holo-Projector', image: 'Holographic projector displaying a galaxy', slug: 'holo-projector' },
  { id: 3, name: 'Cybernetic Arm', image: 'Sleek robotic arm with neon lights', slug: 'cybernetic-arm' },
  { id: 4, name: 'Smart Plant Pot', image: 'A plant in a pot with a digital display', slug: 'smart-plant-pot' },
  { id: 5, name: 'VR Goggles X', image: 'A person wearing futuristic virtual reality goggles', slug: 'vr-goggles-x' },
  { id: 6, name: 'Drone Companion', image: 'A small, friendly drone hovering in the air', slug: 'drone-companion' },
];

const categories = [
  { name: 'Electrónica', icon: <Cpu size={40} />, slug: 'electronica' },
  { name: 'Casa & Deco', icon: <Tv size={40} />, slug: 'casa-deco' },
  { name: 'Gaming', icon: <Gamepad2 size={40} />, slug: 'gaming' },
  { name: 'Moda Tech', icon: <Sparkles size={40} />, slug: 'moda-tech' },
  { name: 'Iluminación', icon: <Lamp size={40} />, slug: 'iluminacion' },
];

const deals = [
  { id: 1, name: 'Smart RGB Lamp', discount: '30%', image: 'A smart lamp changing colors', slug: 'smart-rgb-lamp' },
  { id: 2, name: 'Gaming Keyboard Pro', discount: '25%', image: 'A mechanical gaming keyboard with RGB lighting', slug: 'gaming-keyboard-pro' },
];

const testimonials = [
    { name: 'Alex R.', quote: '¡La mejor experiencia de compra! Los productos son de otro mundo.', avatar: 'Portrait of a smiling person' },
    { name: 'Jasmine L.', quote: 'Encontré gadgets que no sabía que existían. ¡Increíble!', avatar: 'Portrait of a happy customer' },
    { name: 'Kenji T.', quote: 'El envío fue súper rápido y el servicio al cliente es excelente.', avatar: 'Portrait of a satisfied man' },
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
                <Link to="/ofertas">
                  <Button size="lg" variant="outline" className="text-foreground border-primary hover:bg-primary/10 hover:text-foreground rounded-full font-bold">
                    Ver ofertas del día
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
                    <Link to={`/producto/${product.slug}`} onClick={handleNotImplemented}>
                        <div className="group relative bg-card rounded-lg overflow-hidden border border-border transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                             <div className="absolute inset-0 radial-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <img className="w-full h-60 object-cover" alt={product.name} src="https://images.unsplash.com/photo-1635865165118-917ed9e20936" />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
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
                            <Link to={`/categorias#${cat.slug}`} className="flex flex-col items-center gap-3 group">
                                <div className="w-32 h-32 rounded-full flex items-center justify-center bg-primary/10 border-2 border-primary/30 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/50">
                                    {cat.icon}
                                </div>
                                <p className="text-foreground font-semibold transition-colors group-hover:text-primary">{cat.name}</p>
                            </Link>
                         </motion.div>
                    ))}
                </div>
            </div>
        </section>

      <section id="ofertas" className="py-20 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Ofertas del Día</h2>
        <div className="space-y-8">
          {deals.map((deal, i) => (
             <motion.div
                key={deal.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
             >
                <Link to={`/producto/${deal.slug}`} onClick={handleNotImplemented}>
                    <div className="group relative bg-gradient-to-r from-card to-primary/10 p-6 rounded-lg border border-border flex flex-col md:flex-row items-center gap-8 transition-all duration-300 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <img className="w-full md:w-1/3 h-60 object-cover rounded-lg" alt={deal.name} src="https://images.unsplash.com/photo-1527264935190-1401c51b5bbc" />
                        <div className="flex-1 text-center md:text-left">
                            <span className="inline-block bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-2">{deal.discount} OFF</span>
                            <h3 className="text-2xl font-bold text-foreground mb-4">{deal.name}</h3>
                            <Button className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full">Comprar ahora</Button>
                        </div>
                    </div>
                </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
            <Link to="/ofertas">
                <Button variant="outline" size="lg" className="text-foreground border-primary hover:bg-primary/10 hover:text-foreground rounded-full font-bold">
                    Ver todas las ofertas
                </Button>
            </Link>
        </div>
      </section>

        <section id="opiniones" className="py-20 bg-secondary/50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Lo que dicen nuestros clientes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="bg-card p-6 rounded-lg border border-border text-center flex flex-col items-center"
                        >
                            <img className="w-20 h-20 rounded-full mb-4 border-2 border-primary" alt={testimonial.avatar} src="https://images.unsplash.com/photo-1649399045831-40bfde3ef21d" />
                            <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                            <div className="flex mt-4 text-yellow-400">
                                <Star/><Star/><Star/><Star/><Star/>
                            </div>
                            <p className="mt-4 font-bold text-foreground">- {testimonial.name}</p>
                        </motion.div>
                     ))}
                </div>
                 <div className="text-center mt-12">
                     <Link to="/opiniones" onClick={handleNotImplemented}>
                        <Button variant="link" className="text-primary hover:text-primary/80">
                            Ver más reseñas
                        </Button>
                    </Link>
                </div>
            </div>
        </section>

    </motion.div>
  );
};

export default HomePage;
