
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FalconBot from '@/components/FalconBot';
import AuthModal from '@/components/AuthModal';
import WhatsAppConfirmDialog from '@/components/WhatsAppConfirmDialog';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import CookieConsentBanner from '@/components/CookieConsentBanner';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CookieConsentBanner />
      <PwaInstallPrompt />
      <FloatingWhatsAppButton />
      <FalconBot />
      <AuthModal />
      <WhatsAppConfirmDialog />
    </div>
  );
};

export default Layout;
