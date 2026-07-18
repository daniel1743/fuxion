import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home03Icon,
  ShoppingCart01Icon,
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
  Menu01Icon,
  Cancel01Icon,
  LinkSquare01Icon,
  PackageIcon,
  HeartIcon,
  TrendingUp,
  InstagramIcon,
  ChevronDownIcon,
  Notification01Icon,
  Target01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import MobileAppShell from '@/components/mobile/MobileAppShell';
import BRANDING from '@/branding/branding';
import UserMenu from '@/components/UserMenu';
import { TiktokIcon, FacebookIcon } from '@/components/icons/BrandIcons';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { SPRING_PHYSICS, SPRING_SNAPPY } from '@/lib/motionTokens';

const officialStoreUrl = 'https://ifuxion.com/daniel/enrollment/chooseperson';

// ── Drawer navigation items ────────────────────────────────────
const drawerNavItems = [
  { label: 'Inicio', icon: Home03Icon, path: '/' },
  { label: 'Mi carrito', subtitle: 'Ver mis productos', icon: ShoppingCart01Icon, path: '/carrito' },
  { label: 'Bienestar (Menú)', subtitle: 'Ver opciones', icon: Target01Icon, path: '#' },
  { label: 'Productos', subtitle: 'Catálogo FuXion', icon: ShoppingBag03Icon, path: '/explorar' },
  { label: 'Tu plan a medida', subtitle: 'Diseña tu programa ideal', icon: Rocket01Icon, path: '/plan-a-medida' },
  { label: 'Sobre Nosotros', subtitle: 'Nuestra historia y valores', icon: Leaf01Icon, path: '/sobre-nosotros' },
  { label: 'Objetivos de bienestar', subtitle: 'Encuentra lo ideal para ti', icon: BookOpen02Icon, path: '/opiniones' },
  { label: 'Artículos', subtitle: 'Ciencia y salud', icon: BookOpen02Icon, path: '/articulos' },
  { label: 'Evidencias', subtitle: 'Información y contenido', icon: BookOpen02Icon, path: '/blog' },
  { label: 'Oportunidad FuXion', subtitle: 'Conoce el proyecto', icon: Rocket01Icon, path: '/oportunidad-fuxion' },
  { label: 'Centro de ayuda', subtitle: 'Contacto y soporte', icon: HelpCircleIcon, path: '/ayuda' },
];

// ── Social links ───────────────────────────────────────────────
const socialLinks = [
  { name: 'Instagram', icon: InstagramIcon, url: 'https://www.instagram.com/naturalmentefuxion/' },
  { name: 'TikTok', icon: TiktokIcon, url: '#' }, // Agregamos URL vacia temporal o la que exista
  { name: 'Facebook', icon: FacebookIcon, url: '#' },
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
            className="absolute top-full left-1/2 -translate-x-1/2 z-dropdown pt-2 min-w-[220px]"
          >
            <div className="bg-white dark:bg-surface-muted border border-emerald-100/80 dark:border-emerald-800/40 rounded-2xl shadow-premium-hover dark:shadow-premium-dark overflow-hidden p-1.5 space-y-0.5">
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
                        <p className="text-xxs text-muted-foreground mt-0.5 truncate">
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

  // Listen for custom event from MobileHomeHeroSurface
  useEffect(() => {
    const handleToggleMenu = () => setIsMenuOpen(prev => !prev);
    window.addEventListener('open-mobile-menu', handleToggleMenu);
    return () => window.removeEventListener('open-mobile-menu', handleToggleMenu);
  }, []);

  const location = useLocation();
  const isHome = location.pathname === '/';

  // Smart sticky: hide on scroll down, show on scroll up
  const { scrollDirection, isAtTop } = useScrollDirection();
  const headerHidden = scrollDirection === 'down' && !isAtTop;

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
      // Ignore clicks on the menu toggle buttons to prevent race conditions
      if (event.target.closest('button[aria-label="Menú"]') || event.target.closest('button[aria-label="Cerrar menú"]')) {
        return;
      }
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
      transition: SPRING_SNAPPY,
    },
    open: {
      x: 0,
      opacity: 1,
      transition: SPRING_PHYSICS,
    },
  };

  const overlayVariants = {
    closed: { opacity: 0, transition: { duration: 0.15 } },
    open: { opacity: 1, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    closed: { opacity: 0 },
    open: (i) => ({
      opacity: 1,
      transition: { delay: 0.02 * i, ...SPRING_PHYSICS },
    }),
  };

  const { unreadCount = 0 } = useNotifications() || {};

  return (
    <header className={`fixed top-0 left-0 right-0 z-header pointer-events-auto glassmorphism overflow-visible transition-transform duration-300 ease-out ${headerHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <nav className="container mx-auto hidden md:flex items-center justify-between gap-1 px-3 py-2 sm:px-6 sm:py-3 pointer-events-auto">
        {/* ── Left: Brand / Mobile user greeting ──────────────── */}
        {/* Desktop brand — always visible on md+ */}
        <Link to="/" className="flex-shrink-0 group flex items-center gap-3 relative z-20">
          <img
            src={BRANDING.logos.horizontal}
            alt={settings.site_name || 'Bienestar en Claro'}
            className="h-[42px] shrink-0 object-contain bg-transparent"
          />
          <div className="flex flex-col justify-center">
            <span className="font-serif text-[1.35rem] leading-none font-bold text-slate-800 dark:text-slate-100 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
              Bienestar
            </span>
            <span className="font-serif text-[0.95rem] leading-none text-emerald-600 dark:text-emerald-400 font-medium tracking-widest uppercase mt-1" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
              en Claro
            </span>
          </div>
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

          {/* Bienestar dropdown */}
          <DesktopDropdown
            label="Bienestar"
            items={[
              { label: 'Productos', path: '/explorar', icon: PackageIcon, desc: 'Explora toda la línea FuXion' },
              { label: 'Objetivos de bienestar', path: '/opiniones', icon: HeartIcon, desc: 'Encuentra lo ideal para ti' },
              { label: 'Tu plan a medida', path: '/plan-a-medida', icon: Rocket01Icon, desc: 'Diseña tu programa ideal' },
            ]}
            navigate={navigate}
          />

          {/* Conócenos dropdown */}
          <DesktopDropdown
            label="Conócenos"
            items={[
              { label: 'Sobre Nosotros', path: '/sobre-nosotros', icon: Leaf01Icon, desc: 'Nuestra historia y valores' },
              { label: 'Oportunidad FuXion', path: '/oportunidad-fuxion', icon: TrendingUp, desc: 'Únete al proyecto' },
              { label: 'Artículos', path: '/articulos', icon: BookOpen02Icon, desc: 'Ciencia y salud' },
              { label: 'Evidencias', path: '/blog', icon: BookOpen02Icon, desc: 'Testimonios reales' },
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
          {/* Notifications */}
          <button
            className="relative text-muted-foreground hover:text-foreground transition-colors p-1.5"
            aria-label="Notificaciones"
          >
            <HugeiconsIcon icon={Notification01Icon} className="h-[26px] w-[26px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-xxs rounded-full h-[18px] w-[18px] flex items-center justify-center font-bold shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User menu (desktop) */}
          <UserMenu />
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
              className="fixed inset-0 z-backdrop bg-black/30 backdrop-blur-[6px] md:hidden pointer-events-auto"
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
              className="fixed top-0 right-0 z-modal h-[100dvh] w-[80vw] max-w-[320px] bg-white dark:bg-surface-muted shadow-2xl md:hidden flex flex-col overflow-hidden pointer-events-auto"
            >
              {/* Close button — top right */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 z-content flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-surface-elevated shadow-md hover:shadow-lg transition-shadow duration-200"
                aria-label="Cerrar menú"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-[22px] h-[22px] text-foreground" />
              </button>

              {/* ── Profile Header ─────────────────────────────── */}
              {/* pt accounts for: safe-area-inset-top + close button height (40px=10) + gap */}
              <div className="flex flex-col items-center pt-[max(env(safe-area-inset-top,0px)_+_56px,_72px)] pb-4 px-6 shrink-0">
                {/* Avatar — reduced size by ~25% and made clickable to go to /cuenta */}
                <div className="relative mt-2 mb-2">
                  <button
                    type="button"
                    onClick={() => handleNavClick('/cuenta')}
                    className="w-[56px] h-[56px] rounded-full ring-2 ring-emerald-200 dark:ring-emerald-700 shadow-md overflow-hidden focus:outline-none focus:ring-4 transition-shadow cursor-pointer block"
                    aria-label="Ir a mi cuenta y notificaciones"
                  >
                    {isAuthenticated && user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'Mi cuenta'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={BRANDING.logos.isotype}
                        alt={settings.site_name || 'FuXion'}
                        className="w-[70%] h-[70%] mt-[15%] ml-[15%] object-contain"
                      />
                    )}
                  </button>
                </div>

                {/* User info or welcome */}
                {isAuthenticated && user ? (
                  <>
                    <h2 className="text-sm font-bold text-foreground tracking-tight">
                      {user.name}
                    </h2>
                    <p className="text-xxs text-muted-foreground mt-0.5">
                      Mi cuenta
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-sm font-bold text-foreground tracking-tight">
                      Bienvenido
                    </h2>
                    <p className="text-xxs text-muted-foreground mt-0.5">
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
                          isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-800 dark:text-gray-300'
                        }`}>
                          {item.label}
                        </p>
                        {item.subtitle && (
                          <p className="text-xxs text-muted-foreground mt-0.5 truncate">
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
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-300">
                      Tienda oficial
                    </p>
                    <p className="text-xxs text-muted-foreground mt-0.5 truncate">
                      Compra directa en FuXion
                    </p>
                  </div>
                  <HugeiconsIcon icon={ChevronRightIcon} className="text-muted-foreground/40 group-hover:text-emerald-400 transition-colors duration-200" size={14} />
                </motion.button>
              </div>

              {/* ── Footer: Social + WhatsApp + Logout ─────────── */}
              {/* pb-safe ensures logout never hides behind the bottom nav on mobile */}
              <div
                className="px-5 pt-4 pb-3 shrink-0 shadow-[0_-1px_0_rgba(0,0,0,0.05)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.05)] space-y-3"
                style={{ paddingBottom: 'max(calc(env(safe-area-inset-bottom) + 4.5rem), 4.5rem)' }}
              >
                {/* Social + WhatsApp row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {socialLinks.map((social) => {
                      const IconComponent = social.icon;
                      const isHugeicon = typeof IconComponent !== 'function';
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
                          {isHugeicon ? (
                            <HugeiconsIcon icon={IconComponent} className="w-[18px] h-[18px]" size={18} />
                          ) : (
                            <IconComponent className="w-[18px] h-[18px]" strokeWidth={2.0} />
                          )}
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
