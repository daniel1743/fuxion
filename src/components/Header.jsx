import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Leaf01Icon,
  BookOpen02Icon,
  Rocket01Icon,
  HelpCircleIcon,
  Logout01Icon,
  UserIcon,
  Message01Icon,
  ArrowLeft02Icon,
  PackageIcon,
  HeartIcon,
  TrendingUp,
  ChevronDownIcon,
  Notification01Icon,
} from '@hugeicons/core-free-icons';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import BRANDING from '@/branding/branding';
import UserMenu from '@/components/UserMenu';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import {
  getSidebarMenu,
  isSidebarItemActive,
  NAVIGATION_CONTEXT,
} from '@/components/mobile/sidebarNavigation';

const officialStoreUrl = 'https://ifuxion.com/daniel/enrollment/chooseperson';

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
  const drawerCloseRef = useRef(null);
  const currentLocation = useLocation();

  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleNavClick = useCallback((path) => {
    closeMobileMenu();
    navigate(path);
  }, [closeMobileMenu, navigate]);

  // Listen for custom event from MobileHomeHeroSurface / MobileAppShell
  useEffect(() => {
    const handleOpenMenu = () => {
      setIsMenuOpen(true);
    };
    window.addEventListener('open-mobile-menu', handleOpenMenu);
    return () => window.removeEventListener('open-mobile-menu', handleOpenMenu);
  }, []);

  // Route changes must never carry an open drawer into the next ecosystem.
  useEffect(() => {
    if (isMenuOpen) closeMobileMenu();
    // currentLocation.pathname is intentionally the trigger; closeMobileMenu is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation.pathname]);

  const { context: navigationContext, items: drawerNavItems } = getSidebarMenu(currentLocation.pathname);
  // Smart sticky: hide on scroll down, show on scroll up
  const { scrollDirection, isAtTop } = useScrollDirection();
  const headerHidden = scrollDirection === 'down' && !isAtTop;

  const handleWhatsApp = useCallback(() => {
    closeMobileMenu();
    const phone = '56912345678';
    const message = encodeURIComponent('Hola, quiero hablar con un asesor Fuxion.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
  }, [closeMobileMenu]);

  // ── Dispatch custom event for FalconBot visibility ──────────
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('fuxion:mobile-menu', { detail: { isOpen: isMenuOpen } }));
  }, [isMenuOpen]);

  // Keep keyboard focus and page scroll predictable while the modal drawer is open.
  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    drawerCloseRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeMobileMenu();
      if (event.key !== 'Tab' || !drawerPanelRef.current) return;
      const focusable = drawerPanelRef.current.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [closeMobileMenu, isMenuOpen]);

  // ── Drawer animation variants ────────────────────────────────
  const drawerVariants = {
    closed: {
      x: '-104%',
      transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
    },
    open: {
      x: 0,
      transition: { duration: 0.26, ease: [0.22, 0.61, 0.36, 1] },
    },
  };

  const overlayVariants = {
    closed: { opacity: 0, transition: { duration: 0.22 } },
    open: { opacity: 1, transition: { duration: 0.26 } },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -8 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.035 + (0.018 * i), duration: 0.2, ease: 'easeOut' },
    }),
  };

  const { unreadCount = 0 } = useNotifications() || {};

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] pointer-events-auto glassmorphism overflow-visible transition-transform duration-300 ease-out ${headerHidden ? '-translate-y-full' : 'translate-y-0'}`}>
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
          <motion.div
            key="drawer-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-backdrop bg-black/[.42] backdrop-blur-[2px] md:hidden pointer-events-auto"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}

        {isMenuOpen && (
          <motion.div
            ref={drawerPanelRef}
            key="drawer-panel"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            role="dialog"
            aria-modal="true"
            aria-label="Menú principal"
            className="premium-mobile-drawer fixed inset-y-0 left-0 z-modal h-[100dvh] w-[86vw] max-w-[380px] bg-white text-[#18181B] md:hidden flex flex-col overflow-visible pointer-events-auto rounded-r-[30px]"
          >
              {/* ── Violet profile hero ───────────────────────── */}
              <div className="relative h-[220px] shrink-0 overflow-visible">
                <div className="premium-drawer-hero absolute inset-x-0 top-0 h-[220px] overflow-hidden rounded-tr-[30px]">
                  <div className="absolute -left-14 -top-20 h-64 w-64 rounded-full bg-[#D8B4FE]/35 blur-[54px]" />
                  <div className="absolute right-[-65px] top-4 h-52 w-52 rounded-full bg-[#F0ABFC]/25 blur-[48px]" />
                  <div className="absolute bottom-5 left-[38%] h-28 w-48 rounded-full bg-[#A78BFA]/30 blur-[38px]" />
                  <svg
                    className="absolute -bottom-px left-0 h-[66px] w-full text-white"
                    viewBox="0 0 400 72"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path fill="currentColor" d="M0,45 C70,72 142,62 210,36 C282,9 337,18 400,3 L400,72 L0,72 Z" />
                  </svg>
                </div>

                <motion.div
                  className="premium-avatar-ring absolute left-[20px] top-[106px] flex h-[122px] w-[122px] items-center justify-center rounded-full"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => handleNavClick('/cuenta')}
                      whileTap={{ scale: 0.96 }}
                      className="premium-drawer-avatar relative z-[2] flex h-[108px] w-[108px] items-center justify-center overflow-hidden rounded-full border-[4px] border-white bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
                      aria-label="Ir a mi cuenta y notificaciones"
                    >
                      {isAuthenticated && user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name || 'Mi cuenta'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={BRANDING.logos.isotype}
                          alt={settings.site_name || 'Bienestar en Claro'}
                          className="h-[68%] w-[68%] object-contain"
                        />
                      )}
                    </motion.button>
                  </motion.div>
              </div>

              {/* Floating close control centered on drawer edge */}
              <button
                ref={drawerCloseRef}
                type="button"
                onClick={closeMobileMenu}
                className="premium-drawer-close absolute right-[-26px] top-[84px] z-[9999] flex h-[52px] w-[52px] touch-manipulation select-none items-center justify-center rounded-full bg-white text-[#6D28D9] transition-transform duration-180 hover:scale-[1.04] active:scale-90 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
                aria-label="Cerrar menú"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} className="h-[26px] w-[26px]" strokeWidth={2} />
              </button>

              {/* ── Identity ──────────────────────────────────── */}
              <div className="shrink-0 px-[26px] pt-[26px]">
                {isAuthenticated && user ? (
                  <>
                    <h2 className="truncate text-[30px] font-bold leading-[1.08] tracking-[-0.035em] text-[#18181B]">
                      {user.name}
                    </h2>
                    <p className="mt-2 truncate text-[15px] font-medium leading-5 text-[#71717A]">
                      {user.email || 'Mi cuenta'}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-[30px] font-bold leading-[1.08] tracking-[-0.035em] text-[#18181B]">
                      {navigationContext === NAVIGATION_CONTEXT.FUXION ? 'Fuxion' : 'Bienvenido'}
                    </h2>
                    <p className="mt-2 text-[15px] font-medium leading-5 text-[#71717A]">
                      {navigationContext === NAVIGATION_CONTEXT.FUXION
                        ? 'Productos y bienestar'
                        : 'Tu bienestar empieza aquí'}
                    </p>
                  </>
                )}
              </div>

              {/* ── Navigation Items ───────────────────────────── */}
              <div className="premium-drawer-scroll mt-6 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-[22px] pb-4">
                {drawerNavItems.map((item, i) => {
                  const IconComponent = item.icon;
                  const isActive = isSidebarItemActive(item, currentLocation.pathname);
                  return (
                    <React.Fragment key={item.id}>
                      {item.sectionBreak && <div className="mx-3 my-3 border-t border-black/[.08]" aria-hidden="true" />}
                      <motion.button
                        custom={i}
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                        onClick={() => handleNavClick(item.path)}
                        whileTap={{ scale: 0.98 }}
                        aria-current={isActive ? 'page' : undefined}
                        className={`group mb-1 flex min-h-[46px] w-full items-center gap-3 rounded-[13px] px-4 text-left transition-colors duration-180 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#F4E8FF] to-[#E9D5FF] text-[#6D28D9]'
                            : item.isContextExit
                              ? 'text-[#6D28D9] hover:bg-violet-600/[.08]'
                              : 'text-[#27272A] hover:bg-violet-600/[.08]'
                        }`}
                      >
                        <HugeiconsIcon
                          icon={IconComponent}
                          size={20}
                          strokeWidth={2}
                          className={`shrink-0 transition-colors duration-180 ${
                            isActive || item.isContextExit
                              ? 'text-[#6D28D9]'
                              : 'text-[#52525B] group-hover:text-[#7C3AED]'
                          }`}
                        />
                        <span className="min-w-0 flex-1 truncate text-[15px] font-semibold leading-5 tracking-[-0.01em]">
                          {item.label}
                        </span>
                        {item.contextHint && (
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6D28D9]">
                            {item.contextHint}
                          </span>
                        )}
                      </motion.button>
                    </React.Fragment>
                  );
                })}

                {/* ── Secondary actions ───────────────────────── */}
                <div className="mx-3 mb-2 mt-3 border-t border-black/[.08] pt-3">
                  <button
                    onClick={handleWhatsApp}
                    className="group flex min-h-[46px] w-full items-center gap-3 rounded-[13px] px-1 text-left text-[#3F3F46] transition-colors duration-180 hover:bg-violet-600/[.08] focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
                  >
                    <HugeiconsIcon icon={Message01Icon} size={20} strokeWidth={2} className="text-[#52525B] group-hover:text-[#7C3AED]" />
                    <span className="text-[15px] font-semibold">Hablar por WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* ── Fixed session footer ──────────────────────── */}
              <div
                className="shrink-0 rounded-br-[30px] bg-white px-[22px] pt-3"
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 18px)' }}
              >
                <div className="border-t border-black/10 pt-3">
                  {isAuthenticated || user ? (
                    <button
                      onClick={() => { closeMobileMenu(); logout(); }}
                      className="group flex min-h-[56px] w-full items-center gap-3 rounded-2xl px-[18px] text-left text-[#27272A] transition-colors duration-180 hover:bg-violet-600/[.08] active:scale-[.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
                    >
                      <HugeiconsIcon icon={Logout01Icon} size={22} strokeWidth={2} className="shrink-0 text-[#52525B] group-hover:text-[#7C3AED]" />
                      <span className="text-[17px] font-bold">Cerrar sesión</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { closeMobileMenu(); openAuthModal(); }}
                      className="group flex min-h-[56px] w-full items-center gap-3 rounded-2xl px-[18px] text-left text-[#27272A] transition-colors duration-180 hover:bg-violet-600/[.08] active:scale-[.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
                    >
                      <HugeiconsIcon icon={UserIcon} size={22} strokeWidth={2} className="shrink-0 text-[#52525B] group-hover:text-[#7C3AED]" />
                      <span className="text-[17px] font-bold">Iniciar sesión</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Header;
