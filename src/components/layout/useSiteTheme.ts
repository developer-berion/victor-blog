'use client';

import { useSyncExternalStore } from 'react';

export type SiteTheme = 'light' | 'dark';

function readTheme(): SiteTheme {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function subscribe(onStoreChange: () => void) {
  if (typeof document === 'undefined') {
    return () => {};
  }

  const root = document.documentElement;
  const observer = new MutationObserver(() => onStoreChange());

  observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  return () => observer.disconnect();
}

export function useSiteTheme() {
  return useSyncExternalStore(subscribe, readTheme, () => 'light');
}
