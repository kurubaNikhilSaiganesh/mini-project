// ================================================================
// ALTS — useTheme hook
// Manages light/dark theme with localStorage persistence.
// ================================================================

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'alts-theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Read from localStorage first, then system preference
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch { /* ignore */ }

    // System preference
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Apply theme class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch { /* ignore */ }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const setLightTheme = useCallback(() => setTheme('light'), []);
  const setDarkTheme  = useCallback(() => setTheme('dark'),  []);

  return { theme, toggleTheme, setLightTheme, setDarkTheme };
}
