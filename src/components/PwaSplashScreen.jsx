import React, { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';

const shouldShowSplash = () => {
  if (typeof window === 'undefined') return false;

  const openedAsApp =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  const launchedFromPwa = new URLSearchParams(window.location.search).get('source') === 'pwa';

  return openedAsApp || launchedFromPwa;
};

const PwaSplashScreen = () => {
  const [visible, setVisible] = useState(shouldShowSplash);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!visible) return undefined;

    const closeTimer = window.setTimeout(() => setClosing(true), 1300);
    const removeTimer = window.setTimeout(() => setVisible(false), 1750);

    return () => {
      window.clearTimeout(closeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`pwa-splash${closing ? ' pwa-splash--closing' : ''}`}
      role="status"
      aria-label="Abriendo Tienda Fuxion"
    >
      <div className="pwa-splash__glow" />
      <div className="pwa-splash__logo" aria-hidden="true">
        <Leaf />
      </div>
      <h1 className="pwa-splash__title">Tienda Fuxion</h1>
      <div className="pwa-splash__loader" aria-hidden="true">
        <span />
      </div>
      <p className="pwa-splash__text">Salud verdadera</p>
    </div>
  );
};

export default PwaSplashScreen;
