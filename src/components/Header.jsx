import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home03Icon,
  ShoppingBag03Icon,
  Leaf01Icon,
  BookOpen02Icon,
  Rocket01Icon,
  HelpCircleIcon,
  Store01Icon,
  Logout01Icon,
  UserIcon,
  Message01Icon,
  ChevronRightIcon,
  ShoppingCart01Icon,
  Menu01Icon,
  Cancel01Icon,
  LinkSquare01Icon,
  PackageIcon,
  HeartIcon,
  TrendingUp,
  InstagramIcon,
  ChevronDownIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useAuth } from '@/context/AuthContext';
import UserMenu from '@/components/UserMenu';

const officialStoreUrl = 'https://ifuxion.com/daniel/enrollment/chooseperson';

// ── Drawer navigation items ────────────────────────────────────
const drawerNavItems = [
  { label: 'Inicio', icon: Home03Icon, path: '/' },
  { label: 'Productos', subtitle: 'Catálogo FuXion', icon: ShoppingBag03Icon, path: '/explorar' },
  { label: 'Sobre Nosotros', subtitle: 'Nuestra historia y valores', icon: Leaf01Icon, path: '/sobre-nosotros' },
  { label: 'Objetivos de bienestar', subtitle: 'Encuentra lo ideal para ti', icon: BookOpen02Icon, path: '/opiniones' },
  { label: 'Evidencias', subtitle: 'Información y contenido', icon: BookOpen02Icon, path: '/blog' },
  { label: 'Oportunidad FuXion', subtitle: 'Conoce el proyecto', icon: Rocket01Icon, path: '/oportunidad-fuxion' },
  { label: 'Centro de ayuda', subtitle: 'Contacto y soporte', icon: HelpCircleIcon, path: '/ayuda' },
];

// ── Social links ───────────────────────────────────────────────
const socialLinks = [
  { name: 'Instagram', icon: InstagramIcon, url: 'https://www.instagram.com/naturalmentefuxion/' },
  { name: 'TikTok', icon: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.9 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.32 0 .63.06.92.16V8.77a6.35 6.35 0 0 0-.92-.07A6.34 6.34 0 0 0 3 15.04a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.95a8.24 8.24 0 0 0 4.58 1.5v-3.4a4.87 4.87 0 0 1-.67-.36Z"/>
    </svg>
  ) },
  { name: 'Facebook', icon: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ) },
];

// ── Desktop dropdown component ─────────────────────────────────
const DesktopDropdown = ({ label, items, navigate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          open
            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
        }`}
      >
        {label}
        <HugeiconsIcon
          icon={ChevronDownIcon}
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 z-50 pt-2 min-w-[220px]"
          >
            <div className="bg-white dark:bg-[#0f1f18] border border-emerald-100/80 dark:border-emerald-800/40 rounded-2xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12),0_2px_8px_-2px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.4)] overflow-hidden p-1.5 space-y-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const handleSelect = () => {
                  setOpen(false);
                  if (item.href) {
                    window.open(item.href, '_blank', 'noopener,noreferrer');
                  } else {
                    navigate(item.path);
                  }
                };
                return (
                  <button
                    key={item.label}
                    onClick={handleSelect}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left group transition-all duration-150 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary dark:bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-150">
                      <HugeiconsIcon icon={Icon} className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-150 leading-tight">
                        {item.label}
                      </p>
                      {item.desc && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { settings } = useSiteSettings();
  const { isAuthenticated, user, openAuthModal, logout } = useAuth();
  const navigate = useNavigate();
  const drawerPanelRef = useRef(null);

  const handleNavClick = useCallback((path) => {
    setIsMenuOpen(false);
    navigate(path);
  }, [navigate]);

  const handleOfficialStore = useCallback(() => {
    setIsMenuOpen(false);
    window.open(officialStoreUrl, '_blank', 'noopener,noreferrer');
  }, []);

  const handleWhatsApp = useCallback(() => {
    setIsMenuOpen(false);
    const phone = '56912345678';
    const message = encodeURIComponent('Hola, quiero hablar con un asesor Fuxion.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
  }, []);

  // ── Dispatch custom event for FalconBot visibility ──────────
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('fuxion:mobile-menu', { detail: { isOpen: isMenuOpen } }));
  }, [isMenuOpen]);

  // ── Click outside drawer to close ────────────────────────────
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (drawerPanelRef.current && !drawerPanelRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Use a short delay to avoid the opening click triggering close
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // ── Drawer animation variants ────────────────────────────────
  const drawerVariants = {
    closed: {
      x: '100%',
      opacity: 0,
      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const overlayVariants = {
    closed: { opacity: 0, transition: { duration: 0.15 } },
    open: { opacity: 1, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.04 * i, duration: 0.25, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism">
      <nav className="container mx-auto flex items-center justify-between gap-1 px-3 py-2 sm:px-6 sm:py-3">
        {/* ── Left: Brand ─────────────────────────────────────── */}
        <Link to="/" className="flex shrink items-center gap-2 min-w-0">
          <img
            src="/hoja-te-transparente.svg"
            alt={settings.site_name || 'FuXion'}
            className="h-[42px] w-[42px] shrink-0 rounded-full object-contain ring-1 ring-emerald-200/50 dark:ring-emerald-800/50 shadow-sm bg-transparent"
          />
          <span className="text-sm font-bold tracking-tight text-foreground sm:text-xl whitespace-nowrap">
            {settings.site_name || 'Naturalmente FuXion'}
          </span>
        </Link>

        {/* ── Center: Desktop nav ─────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {/* Inicio */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`
            }
          >
            Inicio
          </NavLink>

          {/* Productos dropdown */}
          <DesktopDropdown
            label="Productos"
            items={[
              { label: 'Catálogo de productos', path: '/explorar', icon: PackageIcon, desc: 'Explora toda la línea FuXion' },
              { label: 'Objetivos de bienestar', path: '/opiniones', icon: HeartIcon, desc: 'Encuentra lo ideal para ti' },
            ]}
            navigate={navigate}
          />

          {/* Conócenos dropdown */}
          <DesktopDropdown
            label="Conócenos"
            items={[
              { label: 'Sobre Nosotros', path: '/sobre-nosotros', icon: Leaf01Icon, desc: 'Nuestra historia y valores' },
              { label: 'Oportunidad FuXion', path: '/oportunidad-fuxion', icon: TrendingUp, desc: 'Únete al proyecto' },
              { label: 'Evidencias', path: '/blog', icon: BookOpen02Icon, desc: 'Información y contenido' },
              { label: 'Ayuda', path: '/ayuda', icon: HelpCircleIcon, desc: 'Contacto y soporte' },
            ]}
            navigate={navigate}
          />

          {/* Tienda oficial */}
          <a
            href={officialStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200"
          >
            Tienda oficial
          </a>
        </div>

        {/* ── Right: Actions ──────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          {/* Cart */}
          <Link
            to="/carrito"
            className="relative text-muted-foreground hover:text-foreground transition-colors p-1.5"
            aria-label="Carrito de compras"
          >
            <HugeiconsIcon icon={ShoppingCart01Icon} className="h-[26px] w-[26px]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[10px] rounded-full h-[18px] w-[18px] flex items-center justify-center font-bold shadow-sm">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* User menu (desktop) */}
          <div className="hidden sm:block">
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground h-10 w-10"
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? (
                <HugeiconsIcon icon={Cancel01Icon} className="h-[26px] w-[26px]" />
              ) : (
                <HugeiconsIcon icon={Menu01Icon} className="h-[26px] w-[26px]" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
         MOBILE DRAWER — Full-screen premium slide-in panel
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay — full screen backdrop */}
            <motion.div
              key="drawer-overlay"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[6px] md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer panel — fixed to viewport, full height */}
            <motion.div
              ref={drawerPanelRef}
              key="drawer-panel"
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 z-50 h-dvh w-[80vw] max-w-[320px] bg-white dark:bg-[#0f1f18] shadow-2xl md:hidden flex flex-col overflow-y-auto rounded-l-[20px]"
            >
              {/* Close button — top right */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1a2e25] shadow-md hover:shadow-lg transition-shadow duration-200"
                aria-label="Cerrar menú"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-[22px] h-[22px] text-foreground" />
              </button>

              {/* ── Profile Header ─────────────────────────────── */}
              <div className="flex flex-col items-center pt-[env(safe-area-inset-top,16px)] pt-6 pb-4 px-6 shrink-0">
                {/* Avatar — reduced size by ~25% */}
                <div className="relative mt-2 mb-2">
                  <div className="w-[56px] h-[56px] rounded-full ring-2 ring-emerald-200 dark:ring-emerald-700 shadow-md overflow-hidden">
                    {isAuthenticated && user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'Mi cuenta'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="/hoja-te-transparente.svg"
                        alt={settings.site_name || 'FuXion'}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* User info or welcome */}
                {isAuthenticated && user ? (
                  <>
                    <h2 className="text-sm font-bold text-foreground tracking-tight">
                      {user.name}
                    </h2>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Mi cuenta
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-sm font-bold text-foreground tracking-tight">
                      Bienvenido
                    </h2>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Explora nuestra tienda
                    </p>
                  </>
                )}
              </div>

              {/* ── Navigation Items ───────────────────────────── */}
              <div className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
                {drawerNavItems.map((item, i) => {
                  const IconComponent = item.icon;
                  const isActive = window.location.pathname === item.path;
                  return (
                    <motion.button
                      key={item.path}
                      custom={i}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-[3px] border-emerald-500'
                          : 'hover:bg-emerald-50/60 dark:hover:bg-emerald-900/10 border-l-[3px] border-transparent'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        isActive
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-secondary text-muted-foreground group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                      }`}>
                        <HugeiconsIcon icon={IconComponent} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${
                          isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-[#2d2d2d] dark:text-gray-300'
                        }`}>
                          {item.label}
                        </p>
                        {item.subtitle && (
                          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                      <HugeiconsIcon icon={ChevronRightIcon} className={`transition-colors duration-200 ${
                        isActive
                          ? 'text-emerald-500'
                          : 'text-muted-foreground/40 group-hover:text-emerald-400'
                      }`} size={14} />
                    </motion.button>
                  );
                })}

                {/* Tienda oficial */}
                <motion.button
                  custom={drawerNavItems.length}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  onClick={handleOfficialStore}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group hover:bg-emerald-50/60 dark:hover:bg-emerald-900/10 border-l-[3px] border-transparent"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                    <HugeiconsIcon icon={Store01Icon} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#2d2d2d] dark:text-gray-300">
                      Tienda oficial
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      Compra directa en FuXion
                    </p>
                  </div>
                  <HugeiconsIcon icon={ChevronRightIcon} className="text-muted-foreground/40 group-hover:text-emerald-400 transition-colors duration-200" size={14} />
                </motion.button>
              </div>

              {/* ── Footer: Social + WhatsApp + Logout ─────────── */}
              <div className="px-5 pt-4 pb-3 shrink-0 shadow-[0_-1px_0_rgba(0,0,0,0.05)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.05)] space-y-3">
                {/* Social + WhatsApp row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {socialLinks.map((social) => {
                      const IconComponent = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200"
                          aria-label={social.name}
                          title={social.name}
                        >
                          <IconComponent className="w-[18px] h-[18px]" strokeWidth={2.0} />
                        </a>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors px-3 py-1.5 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  >
                    <HugeiconsIcon icon={Message01Icon} className="w-4 h-4" size={16} />
                    <span>WhatsApp</span>
                  </button>
                </div>

                {/* Logout / Login — always at the very end, secondary */}
                <div className="pt-1">
                  {isAuthenticated || user ? (
                    <button
                      onClick={() => { setIsMenuOpen(false); logout(); }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground/70 hover:text-muted-foreground hover:bg-secondary/50 transition-all duration-200"
                    >
                      <HugeiconsIcon icon={Logout01Icon} className="w-3.5 h-3.5" size={14} />
                      <span>Cerrar sesión</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { setIsMenuOpen(false); openAuthModal(); }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground/70 hover:text-muted-foreground hover:bg-secondary/50 transition-all duration-200"
                    >
                      <HugeiconsIcon icon={UserIcon} className="w-3.5 h-3.5" size={14} />
                      <span>Iniciar sesión</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Header;
