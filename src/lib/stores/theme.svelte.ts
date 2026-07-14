export interface Theme {
  label: string;
  color: string;
  image: string;
}

export const themes: Record<string, Theme> = {
  blue: { label: 'Blue', color: '#0412e3', image: 'blue' },
  green: { label: 'Green', color: '#2e7d32', image: 'green' },
  pink: { label: 'Pink', color: '#B355AD', image: 'pink' },
  purple: { label: 'Purple', color: '#8263A8', image: 'purple' },
};

export type ThemeMode = 'system' | 'light' | 'dark';

const isBrowser = typeof window !== 'undefined';
const stored = isBrowser ? localStorage.getItem('theme') : null;
const storedMode = isBrowser ? localStorage.getItem('mode') : null;

export const theme = $state({
  current: stored && themes[stored] ? stored : 'blue',
  mode: (storedMode === 'system' || storedMode === 'light' || storedMode === 'dark' ? storedMode : 'system') as ThemeMode,
});

export function setTheme(name: string) {
  if (themes[name]) {
    theme.current = name;
    if (isBrowser) localStorage.setItem('theme', name);
  }
}

export function setMode(mode: ThemeMode) {
  theme.mode = mode;
  if (isBrowser) localStorage.setItem('mode', mode);
}
