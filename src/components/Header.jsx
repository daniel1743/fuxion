
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu, X, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import UserMenu from '@/components/UserMenu';

const navLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Productos', path: '/explorar' },
  { name: 'Categorías Fuxion', path: '/categorias' },
  { name: 'Opiniones', path: '/ayuda' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const { getCartCount } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Búsqueda no implementada",
      description: "¡Esta función estará disponible pronto! 🚀",
    });
  };

  const handleAnchorClick = (e, path) => {
    if (window.location.pathname !== '/') {
      // Navigate to home and then scroll
      window.location.href = `/${path}`;
    } else {
      e.preventDefault();
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Rocket className="text-purple-400 h-8 w-8 animate-pulse" />
          <span className="text-2xl font-bold text-foreground tracking-tighter">Fuxion Shop</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path} 
              className={({ isActive }) => `text-muted-foreground hover:text-primary transition-colors duration-300 ${isActive ? 'text-primary font-semibold' : ''}`}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-secondary rounded-full p-1 border border-transparent focus-within:border-primary transition-colors">
            <input type="text" placeholder="Buscar..." className="bg-transparent text-foreground placeholder-muted-foreground text-sm px-3 focus:outline-none w-24 md:w-32" />
            <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/20">
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          </form>
          
          <Link to="/carrito" className="relative text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingCart />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {getCartCount()}
              </span>
            )}
          </Link>
          
          <UserMenu />

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-muted-foreground">
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glassmorphism"
          >
            <div className="container mx-auto px-6 flex flex-col space-y-4 py-4">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `text-muted-foreground hover:text-primary transition-colors duration-300 block text-center py-2 rounded-md ${isActive ? 'text-primary font-semibold bg-primary/10' : ''}`}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
