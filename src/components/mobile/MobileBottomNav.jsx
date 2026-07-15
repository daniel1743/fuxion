import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Home03Icon, ShoppingBag03Icon, Leaf01Icon, Rocket01Icon, HelpCircleIcon } from '@hugeicons/core-free-icons';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: 'Inicio',
      icon: Home03Icon,
      path: '/'
    },
    {
      label: 'Productos',
      icon: ShoppingBag03Icon,
      path: '/explorar'
    },
    {
      label: 'Nosotros',
      icon: Leaf01Icon,
      path: '/sobre-nosotros'
    },
    {
      label: 'Oportunidad',
      icon: Rocket01Icon,
      path: '/oportunidad-fuxion'
    },
    {
      label: 'Ayuda',
      icon: HelpCircleIcon,
      path: '/ayuda'
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-nav bg-white/90 dark:bg-surface-dark/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-emerald-900/50 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between px-2 h-[68px]">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center w-full h-full space-y-1 focus:outline-none tap-highlight-transparent"
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl scale-75 z-hide"
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`relative flex items-center justify-center w-8 h-8 rounded-full ${
                  isActive 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <HugeiconsIcon icon={Icon} className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span 
                className={`text-xxs font-medium leading-none ${
                  isActive 
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
