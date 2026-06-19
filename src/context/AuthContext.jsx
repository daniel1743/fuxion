
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde';

const mapSupabaseUser = (authUser) => {
  if (!authUser) return null;

  const metadata = authUser.user_metadata || {};
  const name = metadata.name || metadata.full_name || authUser.email?.split('@')[0] || 'Cliente Fuxion';

  return {
    id: authUser.id,
    name,
    email: authUser.email,
    avatar: metadata.avatar_url || DEFAULT_AVATAR,
  };
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        console.error('Error al cargar sesión de Supabase:', error);
        setUser(null);
        setIsAuthenticated(false);
      } else {
        const sessionUser = mapSupabaseUser(data.session?.user);
        setUser(sessionUser);
        setIsAuthenticated(Boolean(sessionUser));
      }

      setIsAuthLoading(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = mapSupabaseUser(session?.user);
      setUser(sessionUser);
      setIsAuthenticated(Boolean(sessionUser));
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const closeAuthenticatedModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      toast({
        title: "Datos incompletos",
        description: "Ingresa tu email y contraseña.",
        variant: "destructive",
      });
      return { success: false, error: 'Ingresa tu email y contraseña.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      const message = error.message?.toLowerCase().includes('invalid login')
        ? 'Email o contraseña incorrectos.'
        : error.message || 'No se pudo iniciar sesión.';

      toast({
        title: "No se pudo iniciar sesión",
        description: message,
        variant: "destructive",
      });

      return { success: false, error: message };
    }

    setUser(mapSupabaseUser(data.user));
    setIsAuthenticated(Boolean(data.user));
    closeAuthenticatedModal();
    toast({
      title: "Sesión iniciada",
      description: "Has iniciado sesión correctamente.",
    });

    return { success: true };
  };

  const register = async ({ name, email, password }) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      toast({
        title: "Datos incompletos",
        description: "Completa nombre, email y contraseña.",
        variant: "destructive",
      });
      return { success: false, error: 'Completa nombre, email y contraseña.' };
    }

    if (password.length < 6) {
      toast({
        title: "Contraseña muy corta",
        description: "Usa al menos 6 caracteres.",
        variant: "destructive",
      });
      return { success: false, error: 'Usa al menos 6 caracteres.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: cleanName,
          full_name: cleanName,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "No se pudo crear la cuenta",
        description: error.message || "Revisa los datos e intenta de nuevo.",
        variant: "destructive",
      });

      return { success: false, error: error.message || 'No se pudo crear la cuenta.' };
    }

    if (data.session) {
      setUser(mapSupabaseUser(data.user));
      setIsAuthenticated(true);
      closeAuthenticatedModal();
      toast({
        title: "Cuenta creada",
        description: "Tu sesión quedó activa correctamente.",
      });

      return { success: true };
    }

    toast({
      title: "Revisa tu correo",
      description: "Te enviamos un enlace para confirmar tu cuenta antes de iniciar sesión.",
    });

    return { success: true, needsConfirmation: true };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: "No se pudo cerrar sesión",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión.",
    });
  };

  const updateProfile = async ({ name, avatarUrl }) => {
    const cleanName = name?.trim();

    if (!cleanName) {
      toast({
        title: "Nombre requerido",
        description: "Ingresa un nombre para tu perfil.",
        variant: "destructive",
      });
      return { success: false, error: 'Ingresa un nombre para tu perfil.' };
    }

    const { data, error } = await supabase.auth.updateUser({
      data: {
        name: cleanName,
        full_name: cleanName,
        avatar_url: avatarUrl || user?.avatar || DEFAULT_AVATAR,
      },
    });

    if (error) {
      toast({
        title: "No se pudo actualizar el perfil",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    const updatedUser = mapSupabaseUser(data.user);
    setUser(updatedUser);
    setIsAuthenticated(Boolean(updatedUser));
    toast({
      title: "Perfil actualizado",
      description: "Tus datos quedaron guardados correctamente.",
    });

    return { success: true, user: updatedUser };
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const value = {
    isAuthenticated,
    user,
    isAuthLoading,
    login,
    register,
    updateProfile,
    logout,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
