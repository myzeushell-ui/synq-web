'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .then((reg) => {
          console.log('[Synq SW] registered', reg.scope);
        })
        .catch((err) => {
          console.warn('[Synq SW] registration failed', err);
        });
    }
  }, []);

  return null;
}
