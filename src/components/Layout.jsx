
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FalconBot from '@/components/FalconBot';
import AuthModal from '@/components/AuthModal';
import WhatsAppConfirmDialog from '@/components/WhatsAppConfirmDialog';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';
import { GlobalCommandPalette } from '@/components/GlobalCommandPalette';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navPaths = ['/', '/explorar', '/sobre-nosotros', '/oportunidad-fuxion', '/ayuda'];

  useEffect(() => {
    // Solo habilitar gestos en pantallas móviles
    if (window.innerWidth >= 768) return;

    let touchStartX = 0;
    let touchStartY = 0;
    const minSwipeDistance = 90; // Distancia mínima horizontal en píxeles
    const maxVerticalDistance = 35; // Desviación máxima vertical para evitar falsos positivos al hacer scroll

    const handleTouchStart = (e) => {
      // Excluir gestos en carruseles, sliders, inputs, diálogos de chat, etc.
      const isExcluded = e.target.closest('.no-swipe') || 
                         e.target.closest('[role="slider"]') ||
                         e.target.closest('.carousel') ||
                         e.target.closest('input') ||
                         e.target.closest('textarea') ||
                         e.target.closest('.chatbot-window') ||
                         e.target.closest('[data-no-swipe="true"]');
                         
      if (isExcluded) return;
      
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (!touchStartX || !touchStartY) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Verificar si el movimiento fue predominantemente horizontal y cumplió la distancia mínima
      if (Math.abs(diffX) > minSwipeDistance && Math.abs(diffY) < maxVerticalDistance) {
        const currentIndex = navPaths.indexOf(currentPath);
        
        if (currentIndex !== -1) {
          if (diffX > 0) {
            // Deslizar izquierda (dedo se mueve a la izquierda) -> Siguiente sección
            if (currentIndex < navPaths.length - 1) {
              navigate(navPaths[currentIndex + 1]);
            }
          } else {
            // Deslizar derecha (dedo se mueve a la derecha) -> Sección anterior
            if (currentIndex > 0) {
              navigate(navPaths[currentIndex - 1]);
            }
          }
        }
      }

      // Resetear puntos de inicio
      touchStartX = 0;
      touchStartY = 0;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPath, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CookieConsentBanner />
      <PwaInstallPrompt />
      <FalconBot />
      <AuthModal />
      <WhatsAppConfirmDialog />
      {/* Global Command Palette (⌘K) */}
      <GlobalCommandPalette />
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
