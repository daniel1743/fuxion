
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'fuxion-customer-session';
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!savedSession) return;

      const parsedSession = JSON.parse(savedSession);
      if (parsedSession?.email) {
        setUser(parsedSession);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error al cargar la sesión local:', error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const saveSession = (sessionUser) => {
    setUser(sessionUser);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    setIsAuthModalOpen(false);
  };

  const login = (email, password) => {
    // Sesión local para experiencia de usuario. No reemplaza autenticación real con backend.
    if (email && password) {
      saveSession({
        name: email.split('@')[0] || 'Cliente Fuxion',
        email,
        avatar: DEFAULT_AVATAR,
      });
      toast({
        title: "Sesión iniciada",
        description: "Has iniciado sesión correctamente.",
      });
    } else {
       toast({
        title: "Error de inicio de sesión",
        description: "Por favor, introduce credenciales válidas.",
        variant: "destructive",
      });
    }
  };

  const register = ({ name, email, password }) => {
    if (name && email && password) {
      saveSession({
        name,
        email,
        avatar: DEFAULT_AVATAR,
      });
      toast({
        title: "Cuenta local creada",
        description: "Tu sesión quedó activa en este dispositivo.",
      });
    } else {
      toast({
        title: "Datos incompletos",
        description: "Completa nombre, email y contraseña.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión.",
    });
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const value = {
    isAuthenticated,
    user,
    login,
    register,
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
