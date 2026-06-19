import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { isAppAdmin } from '@/services/siteAdminService';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin debe usarse dentro de AdminProvider');
  }
  return context;
};

// Credenciales del administrador (FALLBACK - usa esto si Supabase no está configurado aún)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  email: 'falcondaniel37@gmail.com',
  password: 'Daniel22.',
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [useSupabase, setUseSupabase] = useState(true); // Cambiar a true cuando Supabase esté configurado

  // Verificar si ya está autenticado al cargar
  useEffect(() => {
    checkAdminSession();

    const loadAuthAdmin = async () => {
      await refreshAdminAccess();
    };

    loadAuthAdmin();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      refreshAdminAccess(session?.user?.email);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const refreshAdminAccess = async (emailFromSession) => {
    try {
      const email = emailFromSession || (await supabase.auth.getUser()).data.user?.email;
      if (!email) return false;

      const allowed = await isAppAdmin(email);
      if (allowed) {
        setIsAdmin(true);
        setAdminData({
          username: email,
          email,
          nombre_completo: email.split('@')[0],
        });
      }

      return allowed;
    } catch (error) {
      console.warn('No se pudo verificar rol admin por correo:', error.message);
      return false;
    }
  };

  const checkAdminSession = async () => {
    const adminToken = localStorage.getItem('adminToken');
    const adminExpiry = localStorage.getItem('adminExpiry');

    if (adminToken && adminExpiry) {
      const expiryDate = new Date(adminExpiry);
      if (expiryDate > new Date()) {
        setIsAdmin(true);
      } else {
        // Token expirado
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminExpiry');
      }
    }
  };

  const login = async (username, password) => {
    const cleanUsername = username.trim();

    // Si Supabase está habilitado, intentar autenticación con Supabase
    if (useSupabase) {
      try {
        console.log('🔍 Intentando autenticación con Supabase...');

        // Llamar a la función RPC que verifica y devuelve datos del admin
        const { data, error } = await supabase
          .rpc('get_admin_data', {
            input_username: cleanUsername,
            input_password: password
          });

        if (error) {
          console.warn('⚠️ Error de Supabase:', error.message);
          console.warn('📝 Usando autenticación local como fallback');
          // Fallback a autenticación local
          return loginLocal(username, password);
        }

        // Si no hay datos o el array está vacío, credenciales incorrectas
        if (!data || data.length === 0) {
          console.log('❌ Credenciales incorrectas en Supabase');
          console.warn('📝 Probando autenticación local como fallback');
          return loginLocal(cleanUsername, password);
        }

        // Autenticación exitosa con Supabase
        const adminInfo = data[0];
        const token = btoa(`${cleanUsername}:${Date.now()}`);
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 24); // Expira en 24 horas

        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminExpiry', expiry.toISOString());
        localStorage.setItem('adminUsername', adminInfo.username);
        setIsAdmin(true);
        setAdminData(adminInfo);
        setIsLoginModalOpen(false);

        console.log('✅ Autenticación con Supabase exitosa');
        console.log('👤 Usuario:', adminInfo.username);
        console.log('📧 Email:', adminInfo.email);
        return { success: true };

      } catch (error) {
        console.error('⚠️ Excepción de Supabase:', error);
        console.warn('📝 Usando autenticación local como fallback');
        // Fallback a autenticación local
        return loginLocal(cleanUsername, password);
      }
    } else {
      console.log('📝 Usando autenticación local (Supabase desactivado)');
      // Usar autenticación local
      return loginLocal(cleanUsername, password);
    }
  };

  const loginLocal = (username, password) => {
    if (
      (username === ADMIN_CREDENTIALS.username || username.toLowerCase() === ADMIN_CREDENTIALS.email) &&
      password === ADMIN_CREDENTIALS.password
    ) {
      // Autenticación exitosa
      const token = btoa(`${username}:${Date.now()}`);
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24); // Expira en 24 horas

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminExpiry', expiry.toISOString());
      setIsAdmin(true);
      setIsLoginModalOpen(false);

      console.log('✅ Autenticación local exitosa');
      return { success: true };
    } else {
      return { success: false, error: 'Usuario o contraseña incorrectos' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminExpiry');
    setIsAdmin(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const value = {
    isAdmin,
    isLoginModalOpen,
    adminData,
    login,
    logout,
    openLoginModal,
    closeLoginModal,
    refreshAdminAccess,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
