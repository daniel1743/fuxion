
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ForumProvider } from '@/context/ForumContext';
import { AdminProvider } from '@/context/AdminContext';
import { BlogProvider } from '@/context/BlogContext';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import { LoyaltyProvider } from '@/context/LoyaltyContext';
import { NotificationProvider } from '@/context/NotificationContext';
import AdminLoginModal from '@/components/admin/AdminLoginModal';
import BienestarEnClaroSplash from '@/components/BienestarEnClaroSplash';
import ScrollToTop from '@/components/ScrollToTop';
import PageLoader from '@/components/PageLoader';
import '@/utils/clearForumData'; // Cargar utilidades del foro
import '@/utils/testBots'; // Cargar test de bots

const HomePage = lazy(() => import('@/pages/HomePage'));
const ExplorePage = lazy(() => import('@/pages/ExplorePage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const EvidencePage = lazy(() => import('@/pages/EvidencePage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const PlaceholderPage = lazy(() => import('@/pages/PlaceholderPage'));
const ShippingPage = lazy(() => import('@/pages/ShippingPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const WellnessPage = lazy(() => import('@/pages/WellnessPage'));
const WellnessArticlePage = lazy(() => import('@/pages/WellnessArticlePage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const BlogTagPage = lazy(() => import('@/pages/BlogTagPage'));
const OpportunityPage = lazy(() => import('@/pages/OpportunityPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));
const ProductosFuxionPage = lazy(() => import('@/pages/ProductosFuxionPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const CookiesPolicyPage = lazy(() => import('@/pages/CookiesPolicyPage'));

function App() {

  const location = useLocation();

  const handleSplashFinish = () => {
    // Eliminar el splash inicial del DOM (server-rendered en index.html)
    const initialSplash = document.getElementById('initial-splash');
    if (initialSplash) {
      initialSplash.style.opacity = '0';
      setTimeout(() => initialSplash.remove(), 450);
    }
  };

  return (
    <>
      <ScrollToTop />
      <BienestarEnClaroSplash onFinish={handleSplashFinish} />
      <AuthProvider>
        <NotificationProvider>
        <AdminProvider>
          <LoyaltyProvider>
            <CartProvider>
              <ForumProvider>
                <BlogProvider>
                  <SiteSettingsProvider>
                  <Layout>
              <AnimatePresence mode="popLayout">
                <Suspense fallback={<PageLoader />}>
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explorar" element={<ExplorePage />} />
                    <Route path="/categoria/:categorySlug" element={<CategoryPage />} />
                    <Route path="/categorias" element={<CategoriesPage />} />
                    <Route path="/etiqueta/:slug" element={<BlogTagPage />} />
                    <Route path="/ayuda" element={<HelpCenterPage />} />
                    <Route path="/comunidad" element={<SupportPage />} />
                    <Route path="/producto/:slug" element={<ProductPage />} />
                    <Route path="/carrito" element={<CartPage />} />
                    <Route path="/checkout" element={<PlaceholderPage pageName="Checkout" />} />
                    <Route path="/cuenta" element={<AccountPage />} />
                    <Route path="/opiniones" element={<ReviewsPage />} />
                    <Route path="/opiniones/wellness" element={<WellnessPage />} />
                    <Route path="/bienestar/:slug" element={<WellnessArticlePage />} />
                    <Route path="/blog" element={<EvidencePage />} />
                    <Route path="/articulos" element={<BlogPage />} />
                    <Route path="/articulos/:slug" element={<BlogPostPage />} />
                    <Route path="/sobre-nosotros" element={<AboutPage />} />
                    <Route path="/terminos" element={<PlaceholderPage pageName="Términos y Condiciones" />} />
                    <Route path="/contacto" element={<ContactPage />} />
                    <Route path="/envios" element={<ShippingPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/privacidad" element={<PrivacyPolicyPage />} />
                    <Route path="/cookies" element={<CookiesPolicyPage />} />

                    <Route path="/oportunidad-fuxion" element={<OpportunityPage />} />
                    <Route path="/productos-fuxion-chile" element={<ProductosFuxionPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </AnimatePresence>
                  </Layout>
                  <AdminLoginModal />
                  </SiteSettingsProvider>
                </BlogProvider>
              </ForumProvider>
            </CartProvider>
          </LoyaltyProvider>
        </AdminProvider>
        </NotificationProvider>
      </AuthProvider>
    </>
  );
}

export default App;
