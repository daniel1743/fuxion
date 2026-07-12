
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FalconBot from '@/components/FalconBot';
import AuthModal from '@/components/AuthModal';
import WhatsAppConfirmDialog from '@/components/WhatsAppConfirmDialog';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';

const Layout = ({ children }) => {
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
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
