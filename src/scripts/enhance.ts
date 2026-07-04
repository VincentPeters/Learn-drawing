import { ICONS } from '../lib/icons';

const THEME_KEY = 'draft30.theme';

function isDark(): boolean {
  const c = document.documentElement.getAttribute('data-theme');
  return c === 'dark' || (!c && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

function paintToggles(): void {
  document.querySelectorAll<HTMLButtonElement>('.theme-toggle').forEach((btn) => {
    btn.innerHTML = isDark() ? ICONS.sun : ICONS.moon;
    btn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  });
}

// Bound once per visit (module scripts run once with ClientRouter).
document.addEventListener('click', (e) => {
  if (!(e.target as Element).closest?.('.theme-toggle')) return;
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  paintToggles();
});

document.addEventListener('astro:page-load', () => {
  paintToggles();
});
