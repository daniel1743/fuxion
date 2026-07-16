import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, ShoppingCart01Icon, Menu11Icon, ArrowLeft02Icon, ChatBotIcon } from '@hugeicons/core-free-icons';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import SmartSearchAutocomplete from '@/components/SmartSearchAutocomplete';
import fuxionDatabase from '@/data/fuxion_database.json';
import { getProductImageUrl } from '@/lib/imageUtils';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { SPRING_PHYSICS, SPRING_BOUNCE } from '@/lib/motionTokens';

const defaultProductsDataset = Object.entries(fuxionDatabase.productos || {}).map(([key, value]) => ({
  id: key,
  name: value.nombre,
  categoria: value.categoria,
  image: getProductImageUrl(value.nombre || key)
}));

const MobileAppShell = ({ 
  variant = 'compact', // 'large' (Home) or 'compact' (other pages)
  title,
  description,
  showSearch = false,
  onSearchClick,
  searchDataset = null,
  searchPlaceholder = 'Buscar productos, beneficios o ingredientes...',
  showBack = variant === 'compact',
  children 
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { getCartCount } = useCart();
  const { settings } = useSiteSettings();
  const { scrollDirection, isAtTop } = useScrollDirection();
  
  const cartCount = getCartCount();

  const handleOpenMenu = () => {
    window.dispatchEvent(new Event('open-mobile-menu'));
  };

  const isLarge = variant === 'large';

  // Smart sticky: hide nav on scroll down, show on scroll up
  const navHidden = scrollDirection === 'down' && !isAtTop;

  // Animation for elements inside the surface
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: SPRING_PHYSICS }
  };

  // ── NAV BAR CONTENT (shared between fixed overlay and inline) ──
  const navBarContent = (
    <div className={`flex items-center justify-between pt-3 ${isLarge ? 'pb-4' : 'pb-3'}`}>
      {/* Left: User / Brand */}
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="text-white hover:bg-white/10 p-2 rounded-full active:scale-95 transition-all"
            aria-label="Volver"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} className="h-6 w-6" />
          </button>
        ) : isAuthenticated && user ? (
          <>
            {/* Premium Animated Avatar Ring */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full shrink-0 overflow-hidden shadow-md">
              {/* Spinning Gradient Background */}
              <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0%,#fbbf24_20%,#34d399_50%,#fbbf24_80%,transparent_100%)] animate-[spin_3s_linear_infinite]" />
              {/* Inner Mask (matches Hero background to hide center of gradient) */}
              <div className="absolute inset-[2px] bg-fuxion rounded-full" />
              {/* Avatar Image */}
              <img
                src={user.avatar}
                alt={user.name || 'Mi cuenta'}
                className="w-11 h-11 rounded-full object-cover relative z-content ring-1 ring-white/10"
              />
            </div>
            <div className="flex flex-col justify-center h-full pt-1">
              <span className="text-xs text-emerald-100/80 font-medium leading-[1]">Hola,</span>
              <span className="text-sm font-bold text-white leading-tight truncate mt-[2px]">
                {user.name?.split(' ')[0] || 'Cliente'}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md p-1.5 shrink-0">
              <img
                src="/hoja-te-transparente.svg"
                alt="FuXion"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              {settings?.site_name || 'FuXion'}
            </span>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 bg-black/10 rounded-full p-1 border border-white/10 backdrop-blur-md">
        <button
          onClick={() => {
            const botBtn = document.querySelector('button[aria-label="Abrir asistente de IA"]');
            if (botBtn) botBtn.click();
          }}
          className="relative text-white min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center"
          aria-label="FalconBot"
        >
          <HugeiconsIcon icon={ChatBotIcon} className="h-[22px] w-[22px]" />
        </button>
        
        {cartCount > 0 && (
          <>
            <div className="w-[1px] h-5 bg-white/20"></div>
            <motion.button
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={SPRING_BOUNCE}
              onClick={() => navigate('/carrito')}
              className="relative text-white min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center"
              aria-label="Carrito"
            >
              <HugeiconsIcon icon={ShoppingCart01Icon} className="h-5 w-5" />
              <span className="absolute top-[6px] right-[6px] bg-emerald-400 rounded-full h-2 w-2 shadow-sm ring-[1.5px] ring-fuxion"></span>
            </motion.button>
          </>
        )}
        
        <div className="w-[1px] h-5 bg-white/20"></div>
        <button
          onClick={handleOpenMenu}
          className="relative text-white min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center"
          aria-label="Menú principal"
        >
          <HugeiconsIcon icon={Menu11Icon} className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
         FIXED SMART STICKY NAV — hides on scroll down, shows on scroll up
      ════════════════════════════════════════════════════════════ */}
      <div
        className={`fixed top-0 left-0 right-0 z-header md:hidden bg-gradient-to-br from-fuxion to-fuxion-light shadow-lg px-5 pt-[env(safe-area-inset-top,0px)] transition-transform duration-300 ease-out ${
          navHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {navBarContent}
      </div>

      {/* ═══════════════════════════════════════════════════════════
         MAIN SURFACE — scrolls normally with the page
      ════════════════════════════════════════════════════════════ */}
      <div className={`relative w-full pt-[env(safe-area-inset-top,1rem)] pb-6 px-5 z-sticky ${isLarge ? 'pb-8' : ''}`}>
        {/* Background layers with hidden overflow */}
        <div className="absolute inset-0 bg-gradient-to-br from-fuxion to-fuxion-light rounded-b-[28px] shadow-premium-soft overflow-hidden border-b border-emerald-600/30 -z-content">
          {/* Glow Effect / Lighting */}
          <div className="absolute top-0 left-[20%] right-0 h-[300px] bg-emerald-400/20 blur-[80px] rounded-full pointer-events-none"></div>
        </div>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          transition={{ staggerChildren: 0.1 }}
          className="relative z-content max-w-full"
        >
          
          {/* INLINE NAV (part of the scrollable green surface — visible initially) */}
          <motion.div variants={itemVariants}>
            {navBarContent}
          </motion.div>

          {/* SEARCH BAR INTEGRADA */}
          {showSearch && (
            <motion.div variants={itemVariants} className={`w-full relative group ${isLarge ? 'mb-4' : 'mb-2'}`}>
              <div className="absolute inset-0 bg-white/20 blur-md rounded-full group-focus-within:blur-sm transition-all"></div>
              <SmartSearchAutocomplete 
                dataset={searchDataset || defaultProductsDataset}
                placeholder={searchPlaceholder}
                onSelect={(result) => {
                  const query = result.isCustomQuery ? result.query : result.name;
                  if (onSearchClick) {
                    onSearchClick(query);
                  } else {
                    navigate(`/explorar?search=${encodeURIComponent(query)}`);
                  }
                }}
              />
            </motion.div>
          )}

          {/* TITLE & DESC FOR COMPACT (If not large and has text) */}
          {!isLarge && (title || description) && (
            <motion.div variants={itemVariants} className="w-full pt-2">
              {title && (
                <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm leading-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-sm text-emerald-50 mt-1 font-medium drop-shadow-sm opacity-90">
                  {description}
                </p>
              )}
            </motion.div>
          )}

          {/* CUSTOM CHILDREN OR LARGE HERO CONTENT */}
          {children && (
            <motion.div variants={itemVariants} className="w-full mt-4">
              {children}
            </motion.div>
          )}

        </motion.div>
      </div>
    </>
  );
};

export default MobileAppShell;
