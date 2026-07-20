
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/context/ThemeProvider';
import { initializeAdvisorFromUrl } from '@/lib/whatsapp';
import PerformanceProvider from '@/components/PerformanceProvider';

initializeAdvisorFromUrl();

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('No se pudo registrar el service worker:', error);
    });
  });
} else if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });

  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys
        .filter((key) => key.startsWith('fuxion-shop-'))
        .forEach((key) => caches.delete(key));
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <PerformanceProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <App />
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </PerformanceProvider>
  </>
);
