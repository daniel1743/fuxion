
import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ForumProvider } from '@/context/ForumContext';
import { AdminProvider } from '@/context/AdminContext';
import AdminLoginModal from '@/components/admin/AdminLoginModal';
import '@/utils/clearForumData'; // Cargar utilidades del foro
import '@/utils/testBots'; // Cargar test de bots

const HomePage = lazy(() => import('@/pages/HomePage'));
const ExplorePage = lazy(() => import('@/pages/ExplorePage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const PlaceholderPage = lazy(() => import('@/pages/PlaceholderPage'));

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <CartProvider>
        <ForumProvider>
          <AdminProvider>
            <Layout>
              <AnimatePresence mode="wait">
                <Suspense fallback={
                  <div className="w-full h-screen flex items-center justify-center bg-background">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                }>
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explorar" element={<ExplorePage />} />
                    <Route path="/categorias" element={<CategoriesPage />} />
                    <Route path="/ayuda" element={<SupportPage />} />
                    <Route path="/producto/:slug" element={<PlaceholderPage pageName="Detalle de Producto" />} />
                    <Route path="/carrito" element={<CartPage />} />
                    <Route path="/checkout" element={<PlaceholderPage pageName="Checkout" />} />
                    <Route path="/cuenta" element={<PlaceholderPage pageName="Mi Cuenta" />} />
                    <Route path="/opiniones" element={<PlaceholderPage pageName="Opiniones" />} />
                    <Route path="/blog" element={<PlaceholderPage pageName="Blog" />} />
                    <Route path="/terminos" element={<PlaceholderPage pageName="Términos y Condiciones" />} />
                    <Route path="/contacto" element={<PlaceholderPage pageName="Contacto" />} />
                    <Route path="/envios" element={<PlaceholderPage pageName="Envíos y Devoluciones" />} />
                    <Route path="/faq" element={<PlaceholderPage pageName="FAQ" />} />
                  </Routes>
                </Suspense>
              </AnimatePresence>
            </Layout>
            <AdminLoginModal />
          </AdminProvider>
        </ForumProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
