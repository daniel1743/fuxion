
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";
import { Tag } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const deals = [
  { id: 1, name: 'Smart RGB Lamp', discount: '30%', image: 'A smart lamp changing colors', slug: 'smart-rgb-lamp', oldPrice: 128.55, newPrice: 89.99 },
  { id: 2, name: 'Gaming Keyboard Pro', discount: '25%', image: 'A mechanical gaming keyboard with RGB lighting', slug: 'gaming-keyboard-pro', oldPrice: 199.99, newPrice: 149.99 },
  { id: 3, name: 'Holo-Projector', discount: '15%', image: 'Holographic projector displaying a galaxy', slug: 'holo-projector', oldPrice: 1058.81, newPrice: 899.99 },
  { id: 4, name: 'VR Goggles X', discount: '20%', image: 'A person wearing futuristic virtual reality goggles', slug: 'vr-goggles-x', oldPrice: 624.99, newPrice: 499.99 },
];

const OffersPage = () => {

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
      className="container mx-auto px-6 py-28"
    >
      <Helmet>
        <title>Ofertas — Fuxion Shop</title>
        <meta name="description" content="Aprovecha las mejores ofertas en gadgets y tecnología en Fuxion Shop." />
      </Helmet>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tighter">Ofertas Imperdibles</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          Descuentos exclusivos en tus productos favoritos por tiempo limitado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {deals.map((deal, i) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link to={`/producto/${deal.slug}`} onClick={handleNotImplemented}>
              <div className="group relative bg-card rounded-lg overflow-hidden border border-border transition-all duration-300 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/20">
                <div className="absolute top-4 right-4 bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10 flex items-center gap-1">
                  <Tag size={16} /> {deal.discount} OFF
                </div>
                <img className="w-full h-72 object-cover" alt={deal.name} src="https://images.unsplash.com/photo-1527264935190-1401c51b5bbc" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground truncate">{deal.name}</h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-2xl text-pink-500 font-bold">${deal.newPrice}</p>
                    <p className="text-lg text-muted-foreground line-through">${deal.oldPrice}</p>
                  </div>
                  <Button className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-bold">Comprar ahora</Button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OffersPage;
