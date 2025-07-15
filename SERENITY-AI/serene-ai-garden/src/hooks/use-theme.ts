import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    // On mount, check localStorage or system preference
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      setThemeState(saved);
      setHtmlClass(saved);
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState('system');
      setHtmlClass(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setHtmlClass(prefersDark ? 'dark' : 'light');
      localStorage.removeItem('theme');
    } else {
      setHtmlClass(newTheme);
      localStorage.setItem('theme', newTheme);
    }
  };

  function setHtmlClass(theme: 'light' | 'dark') {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  return [theme, setTheme];
} 