// localStorage progress — keys must stay identical to the legacy site.
const KEYS: Record<number, string> = {
  1: 'draft30.progress.v1',
  2: 'draft30.progress.m2',
};

export function load(m: number): Record<string, 1> {
  try {
    return JSON.parse(localStorage.getItem(KEYS[m]) ?? '{}') || {};
  } catch {
    return {};
  }
}

export function isDone(m: number, n: number): boolean {
  return Boolean(load(m)[n]);
}

export function setDone(m: number, n: number, v: boolean): void {
  const p = load(m);
  if (v) p[n] = 1;
  else delete p[n];
  localStorage.setItem(KEYS[m], JSON.stringify(p));
  document.dispatchEvent(new CustomEvent('progresschange'));
}

export function doneCount(m: number): number {
  return Object.keys(load(m)).length;
}
