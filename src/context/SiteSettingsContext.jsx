import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultSiteSettings, fetchSiteSettings } from '@/services/siteAdminService';

const SiteSettingsContext = createContext(null);

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const data = await fetchSiteSettings();
      setSettings({ ...defaultSiteSettings, ...data });
    } catch (error) {
      console.warn('No se pudo cargar configuración del sitio:', error.message);
      setSettings(defaultSiteSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, setSettings, refreshSettings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings debe usarse dentro de SiteSettingsProvider');
  }
  return context;
};
