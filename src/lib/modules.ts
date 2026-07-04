export interface ModuleInfo {
  m: 1 | 2;
  tag: string;
  title: string;
  sub: string;
  unit: string;
  short: string;
  color: string;
  kit: string;
  storageKey: string;
}

export const MODULES: Record<1 | 2, ModuleInfo> = {
  1: {
    m: 1, tag: 'Module 1', title: 'Technical Drawing',
    sub: 'The precise, correct line work that describes a real part.',
    unit: 'Lesson', short: 'Lesson', color: '#2c5f8a', kit: '2H · HB · 2B',
    storageKey: 'draft30.progress.v1',
  },
  2: {
    m: 2, tag: 'Module 2', title: 'Rendering & Colour',
    sub: 'Tone, light, hatching and the graphite + blue + sanguine palette.',
    unit: 'Lesson', short: 'Lesson', color: '#b5502f', kit: '＋ blue & sanguine',
    storageKey: 'draft30.progress.m2',
  },
};

export const lessonUrl = (m: number, n: number) => `/module-${m}/lesson-${n}/`;
export const moduleUrl = (m: number) => `/module-${m}/`;
