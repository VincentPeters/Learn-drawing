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

function reveal(): void {
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach((e) => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }),
    { threshold: 0.1 },
  );
  els.forEach((e) => io.observe(e));
}

document.addEventListener('astro:page-load', () => {
  paintToggles();
  reveal();
});
