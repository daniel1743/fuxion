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
    // Las sesiones administrativas locales antiguas no contienen un JWT de
    // Supabase y no sirven para operaciones protegidas por RLS.
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminExpiry');
    localStorage.removeItem('adminUsername');

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
      if (!email) {
        setIsAdmin(false);
        setAdminData(null);
        return false;
      }

      const allowed = await isAppAdmin(email);
      if (allowed) {
        setIsAdmin(true);
        setAdminData({
          username: email,
          email,
          nombre_completo: email.split('@')[0],
        });
      } else {
        setIsAdmin(false);
        setAdminData(null);
      }

      return allowed;
    } catch (error) {
      console.warn('No se pudo verificar rol admin por correo:', error.message);
      return false;
    }
  };

  const login = async (username, password) => {
    const cleanUsername = username.trim();
    const cleanEmail = cleanUsername.toLowerCase() === ADMIN_CREDENTIALS.username
      ? ADMIN_CREDENTIALS.email
      : cleanUsername.toLowerCase();

    if (cleanEmail.includes('@')) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!authError && authData.user) {
        const allowed = await refreshAdminAccess(authData.user.email);
        if (!allowed) {
          await supabase.auth.signOut();
          return { success: false, error: 'Esta cuenta no tiene permisos de administración.' };
        }

        setIsLoginModalOpen(false);
        return { success: true };
      }

      if (authError) {
        console.warn('No se pudo crear sesión Supabase Auth:', authError.message);
        return {
          success: false,
          error: authError.message?.toLowerCase().includes('invalid login')
            ? 'Email o contraseña incorrectos en Supabase Auth. Ejecuta nuevamente SQL_CAMBIAR_PASSWORD_ADMIN.sql.'
            : authError.message || 'No se pudo iniciar una sesión segura.',
        };
      }
    }

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
      localStorage.setItem('adminUsername', ADMIN_CREDENTIALS.email);
      setIsAdmin(true);
      setAdminData({
        username: ADMIN_CREDENTIALS.email,
        email: ADMIN_CREDENTIALS.email,
        nombre_completo: 'Daniel Falcon',
      });
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
    localStorage.removeItem('adminUsername');
    setIsAdmin(false);
    setAdminData(null);
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
