
import React, { createContext, useState, useContext } from 'react';
import { toast } from "@/components/ui/use-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = (email, password) => {
    // Mock login
    if (email && password) {
      setUser({ name: 'Daniel Falcon', email: email, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' });
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      toast({
        title: "🎉 ¡Bienvenido de vuelta!",
        description: "Has iniciado sesión correctamente.",
      });
    } else {
       toast({
        title: "❌ Error de inicio de sesión",
        description: "Por favor, introduce credenciales válidas.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "👋 ¡Hasta pronto!",
      description: "Has cerrado sesión.",
    });
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const value = {
    isAuthenticated,
    user,
    login,
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
