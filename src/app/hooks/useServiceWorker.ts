/**
 * Register Service Worker, and trigger refresh on first install of SW.
 * This is because SW doesn't activate on first install or force-refresh.
 */
import { useRegisterSW } from 'virtual:pwa-register/react';

//* Hook -----------------------------------------------------------------------
const useServiceWorker = () => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW: () => {
      if (navigator.serviceWorker.controller === null) {
        // Trigger page reload to activate the new SW.
        window.location.reload();
      }
    },
    onRegisterError: (error) => {
      console.error('Failed to register the SW:', error);
      throw new Error(error);
    },
  });

  if (navigator.serviceWorker.controller && needRefresh === true) {
    updateServiceWorker(true);
  }
};

//* Export ---------------------------------------------------------------------
export default useServiceWorker;
