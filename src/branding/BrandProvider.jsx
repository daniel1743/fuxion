import React, { createContext, useContext } from 'react';
import BRANDING from './branding';

const BrandContext = createContext(BRANDING);

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

export const BrandProvider = ({ children }) => {
  return (
    <BrandContext.Provider value={BRANDING}>
      {children}
    </BrandContext.Provider>
  );
};
