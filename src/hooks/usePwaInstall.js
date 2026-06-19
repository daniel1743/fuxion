import { useCallback, useEffect, useState } from 'react';

let deferredInstallPrompt = null;
const listeners = new Set();

const isStandalone = () => (
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true
);

const isIos = () => (
  (
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
  ) &&
  !window.MSStream
);

const getState = () => ({
  canInstall: Boolean(deferredInstallPrompt),
  installed: isStandalone(),
  isIos: isIos()
});

const notify = () => {
  const state = getState();
  listeners.forEach((listener) => listener(state));
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    notify();
  });
}

export const usePwaInstall = () => {
  const [state, setState] = useState(() => getState());

  useEffect(() => {
    listeners.add(setState);
    setState(getState());
    return () => listeners.delete(setState);
  }, []);

  const install = useCallback(async () => {
    if (!deferredInstallPrompt) {
      return { outcome: 'unavailable' };
    }

    const prompt = deferredInstallPrompt;
    deferredInstallPrompt = null;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    notify();
    return choice;
  }, []);

  return { ...state, install };
};
