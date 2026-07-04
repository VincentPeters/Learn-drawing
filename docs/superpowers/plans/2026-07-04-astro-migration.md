# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Draft30 vanilla static site to Astro: 45 pre-rendered lesson pages from Markdown content collections, Pagefind search, view transitions, Cloudflare Pages deploy — preserving the existing CSS, localStorage progress, and zero-client-framework output.

**Architecture:** Astro 5 static output. Lessons live in a Markdown content collection with Zod-validated frontmatter (generated once from the legacy JS data files by a converter script). Pages are pre-rendered via `getStaticPaths`; interactivity (progress, theme, keyboard nav) stays as small vanilla scripts. The 34 SVG diagrams port mechanically to a TS module rendered at build time via `set:html`.

**Tech Stack:** Astro ^5, TypeScript (`@astrojs/check`), astro-pagefind + pagefind, Node 22, npm. No client framework.

**Spec:** `docs/superpowers/specs/2026-07-04-astro-migration-design.md`

## Global Constraints

- localStorage keys are preserved **verbatim**: `draft30.progress.v1` (module 1), `draft30.progress.m2` (module 2), `draft30.theme` (theme). Existing users must keep their progress.
- Zero client framework; no hydration. Client JS is plain `<script>` (Astro-bundled) only. The only third-party client code is Pagefind's UI.
- No external network requests at runtime (fonts, CDNs, analytics: none).
- New URL scheme: `/`, `/module-1/`, `/module-2/`, `/module-1/lesson-5/` … `/module-2/lesson-15/`, `/reference/`. Old query-param URLs must keep working via redirect stubs.
- Build must emit exactly 45 lesson pages (30 for module 1, 15 for module 2).
- With Astro's `<ClientRouter />` active, module scripts run **once per visit** — all per-page init must hook `astro:page-load` (fires on first load too) or use delegated document-level listeners; the theme attribute must be re-applied on `astro:after-swap`.
- Existing CSS (`assets/css/style.css`) carries over unchanged except where a task says otherwise (it becomes `src/styles/style.css`).
- Work on the current branch `claude/technical-drawing-website-eq714a` (it is also the repo's main branch). Commit after every task.
- Legacy source files (`assets/js/*.js`, root `*.html`) stay in place until Task 11 (cleanup) — earlier tasks read from them.

---

### Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json` (via npm), `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro` (placeholder, replaced in Task 8)

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `preview`, `check`, `test`; a building Astro skeleton every later task extends.

- [ ] **Step 1: Init package and install dependencies**

```bash
npm init -y
npm install astro astro-pagefind pagefind
npm install -D @astrojs/check typescript
```

- [ ] **Step 2: Set package fields and scripts**

Edit `package.json` so it contains (keep npm-generated `dependencies`/`devDependencies` versions):

```json
{
  "name": "draft30",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "convert": "node scripts/convert-lessons.mjs",
    "test": "node --test tests/"
  }
}
```

Remove npm-init noise fields (`main`, `keywords`, `author`, `license`, `description`) — they don't apply.

- [ ] **Step 3: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

export default defineConfig({
  // Update to the real domain once the Cloudflare Pages project exists.
  site: 'https://draft30.pages.dev',
  integrations: [pagefind()],
});
```

- [ ] **Step 4: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "scripts/**/*", "tests/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Write `.gitignore`**

```gitignore
node_modules/
dist/
.astro/
```

- [ ] **Step 6: Write placeholder `src/pages/index.astro`**

```astro
---
// Placeholder — replaced by the real landing page in Task 8.
---
<html lang="en">
  <head><meta charset="utf-8" /><title>Draft30</title></head>
  <body><h1>Draft30 — Astro scaffold OK</h1></body>
</html>
```

- [ ] **Step 7: Verify the build works**

Run: `npm run build`
Expected: exits 0; output contains `1 page(s) built` and `dist/index.html` exists.

Run: `npm run check`
Expected: exits 0, `0 errors`.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/pages/index.astro
git commit -m "feat: scaffold Astro project"
```

---

### Task 2: Content schema + legacy-data converter

**Files:**
- Create: `src/content.config.ts`, `scripts/convert-lib.mjs`, `scripts/convert-lessons.mjs`, `tests/convert.test.mjs`
- Create (generated): `src/content/lessons/m1-01.md` … `m1-30.md`, `m2-01.md` … `m2-15.md`, `src/content/phases.json`
- Reads (legacy, do not modify): `assets/js/curriculum.js`, `assets/js/module2.js`

**Interfaces:**
- Consumes: legacy IIFEs that assign `window.CURRICULUM = { PHASES, DAYS }` and `window.MODULE2 = { META, PHASES, DAYS }`. Each day: `{ n, phase, title, diagram, objective, warmup: string[], main: string[], checkpoint, tip }`. Each phase: `{ id, name, days, color, blurb }`.
- Produces: `lessons` collection — frontmatter `{ module: 1|2, number, phase, title, diagram, objective, warmup: string[], main: string[], checkpoint }`, Markdown **body = the pro tip**. `phases` collection — entries `{ id: "m<module>-p<index>", module, index, name, color, blurb, lessons }` (`lessons` is the display range string, e.g. `"1–6"`).

- [ ] **Step 1: Write the failing tests** — `tests/convert.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { htmlToMd, lessonMd, phaseEntry } from '../scripts/convert-lib.mjs';

test('htmlToMd converts b and i tags to markdown', () => {
  assert.equal(htmlToMd('keep <b>bold</b> and <i>italic</i>.'), 'keep **bold** and *italic*.');
  assert.equal(htmlToMd('no tags'), 'no tags');
});

test('lessonMd emits valid frontmatter with quoted strings and tip as body', () => {
  const md = lessonMd(1, {
    n: 3, phase: 0, title: 'Has "quotes" in it', diagram: 'lettering',
    objective: 'O', warmup: ['w1'], main: ['m1', 'm2'],
    checkpoint: 'C', tip: 'tip with <b>bold</b>',
  });
  assert.match(md, /^---\nmodule: 1\nnumber: 3\nphase: 0\n/);
  assert.match(md, /title: "Has \\"quotes\\" in it"/);
  assert.match(md, /warmup:\n {2}- "w1"\n/);
  assert.match(md, /main:\n {2}- "m1"\n {2}- "m2"\n/);
  assert.match(md, /---\n\ntip with \*\*bold\*\*\n$/);
});

test('phaseEntry builds a stable id', () => {
  const p = phaseEntry(2, 1, { id: 'light', name: 'Light & Form', days: '5–8', color: '#b5502f', blurb: 'B' });
  assert.deepEqual(p, { id: 'm2-p1', module: 2, index: 1, name: 'Light & Form', color: '#b5502f', blurb: 'B', lessons: '5–8' });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module ... convert-lib.mjs`.

- [ ] **Step 3: Write `scripts/convert-lib.mjs`**

```js
// Pure helpers for the one-off legacy-data → content-collection conversion.

export function htmlToMd(s) {
  return s
    .replace(/<b>(.*?)<\/b>/g, '**$1**')
    .replace(/<i>(.*?)<\/i>/g, '*$1*');
}

// JSON string escaping is valid YAML — safe for quotes, unicode, colons.
const yamlStr = (s) => JSON.stringify(s);

export function lessonMd(module, d) {
  return [
    '---',
    `module: ${module}`,
    `number: ${d.n}`,
    `phase: ${d.phase}`,
    `title: ${yamlStr(d.title)}`,
    `diagram: ${yamlStr(d.diagram)}`,
    `objective: ${yamlStr(htmlToMd(d.objective))}`,
    'warmup:',
    ...d.warmup.map((w) => `  - ${yamlStr(htmlToMd(w))}`),
    'main:',
    ...d.main.map((w) => `  - ${yamlStr(htmlToMd(w))}`),
    `checkpoint: ${yamlStr(htmlToMd(d.checkpoint))}`,
    '---',
    '',
    htmlToMd(d.tip),
    '',
  ].join('\n');
}

export function phaseEntry(module, index, p) {
  return {
    id: `m${module}-p${index}`,
    module,
    index,
    name: p.name,
    color: p.color,
    blurb: p.blurb,
    lessons: p.days,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — 3 tests, 0 failures.

- [ ] **Step 5: Write `scripts/convert-lessons.mjs`**

```js
// One-off converter: legacy JS data files → Markdown content collection.
// Usage: npm run convert
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { lessonMd, phaseEntry } from './convert-lib.mjs';

function loadLegacy(file, globalName) {
  const src = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  const data = sandbox.window[globalName];
  if (!data) throw new Error(`${file} did not define window.${globalName}`);
  return data;
}

const root = path.resolve(import.meta.dirname, '..');
const lessonsDir = path.join(root, 'src/content/lessons');
fs.mkdirSync(lessonsDir, { recursive: true });

const sources = [
  [1, loadLegacy(path.join(root, 'assets/js/curriculum.js'), 'CURRICULUM')],
  [2, loadLegacy(path.join(root, 'assets/js/module2.js'), 'MODULE2')],
];

const phases = [];
let count = 0;
for (const [m, data] of sources) {
  data.PHASES.forEach((p, i) => phases.push(phaseEntry(m, i, p)));
  for (const d of data.DAYS) {
    const file = path.join(lessonsDir, `m${m}-${String(d.n).padStart(2, '0')}.md`);
    fs.writeFileSync(file, lessonMd(m, d));
    count++;
  }
}
fs.writeFileSync(path.join(root, 'src/content/phases.json'), JSON.stringify(phases, null, 2) + '\n');
console.log(`Wrote ${count} lessons, ${phases.length} phases.`);
```

- [ ] **Step 6: Write `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    module: z.union([z.literal(1), z.literal(2)]),
    number: z.number().int().min(1),
    phase: z.number().int().min(0),
    title: z.string().min(1),
    diagram: z.string().min(1),
    objective: z.string().min(1),
    warmup: z.array(z.string().min(1)).min(1),
    main: z.array(z.string().min(1)).min(1),
    checkpoint: z.string().min(1),
  }),
});

const phases = defineCollection({
  loader: file('./src/content/phases.json'),
  schema: z.object({
    module: z.union([z.literal(1), z.literal(2)]),
    index: z.number().int().min(0),
    name: z.string().min(1),
    color: z.string().regex(/^#[0-9a-f]{6}$/i),
    blurb: z.string().min(1),
    lessons: z.string().min(1),
  }),
});

export const collections = { lessons, phases };
```

- [ ] **Step 7: Run the converter and verify output**

Run: `npm run convert`
Expected: `Wrote 45 lessons, 9 phases.`

Run: `ls src/content/lessons | wc -l`
Expected: `45`

Run: `cat src/content/lessons/m1-01.md`
Expected: frontmatter with `module: 1`, `number: 1`, `title: "Set up your drafting kit"`, `diagram: "line-weights"`, two `warmup` items, three `main` items; body is the pro-tip line containing `**thick for the object itself, thin for everything you're saying about it.**` (converted from `<b>`).

Run: `npx astro sync`
Expected: exits 0 (loaders run; Zod validates every file — a schema error here is a converter bug: fix converter, re-run, don't hand-edit generated files).

- [ ] **Step 8: Commit (generated content included)**

```bash
git add scripts/ tests/ src/content.config.ts src/content/
git commit -m "feat: content schema + converter; generate 45 lesson files"
```

---

### Task 3: Shared libs — modules registry, icons, course helpers

**Files:**
- Create: `src/lib/modules.ts`, `src/lib/icons.ts`, `src/lib/course.ts`
- Reads (legacy): `assets/js/app.js:69-80` (icon SVG strings)

**Interfaces:**
- Produces (used by every page task):
  - `MODULES: Record<1 | 2, ModuleInfo>` where `ModuleInfo = { m: 1|2; tag: string; title: string; sub: string; unit: string; short: string; color: string; kit: string; storageKey: string }`
  - `lessonUrl(m: number, n: number): string` → `/module-1/lesson-5/`; `moduleUrl(m: number): string` → `/module-1/`
  - `ICONS: Record<string, string>` — keys `check, circle, arrow, sun, moon, clock, pencil, flame, target, map` (inline SVG strings, rendered with `set:html`)
  - `lessonsOf(m: 1|2)` → lesson entries sorted by `number`; `phasesOf(m: 1|2)` → phase entries sorted by `index`; `sequence()` → `Array<{ m: 1|2; n: number; title: string; url: string; entry: CollectionEntry<'lessons'> }>` — all 45 lessons, module 1 then module 2, in order.

- [ ] **Step 1: Write `src/lib/modules.ts`**

```ts
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
```

- [ ] **Step 2: Write `src/lib/icons.ts`**

Copy the `I` object from `assets/js/app.js` lines 69–80 **verbatim** (the ten SVG strings), as:

```ts
// Inline SVG icons, rendered with set:html. Ported verbatim from legacy app.js.
export const ICONS: Record<string, string> = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  // … circle, arrow, sun, moon, clock, pencil, flame, target, map — copy each
  // string exactly from assets/js/app.js lines 70–79.
};
```

- [ ] **Step 3: Write `src/lib/course.ts`**

```ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { lessonUrl } from './modules';

export type Lesson = CollectionEntry<'lessons'>;
export type Phase = CollectionEntry<'phases'>;

export async function lessonsOf(m: 1 | 2): Promise<Lesson[]> {
  const all = await getCollection('lessons', (e) => e.data.module === m);
  return all.sort((a, b) => a.data.number - b.data.number);
}

export async function phasesOf(m: 1 | 2): Promise<Phase[]> {
  const all = await getCollection('phases', (e) => e.data.module === m);
  return all.sort((a, b) => a.data.index - b.data.index);
}

export interface SeqItem {
  m: 1 | 2;
  n: number;
  title: string;
  url: string;
  entry: Lesson;
}

/** All 45 lessons in course order: module 1 then module 2. */
export async function sequence(): Promise<SeqItem[]> {
  const seq: SeqItem[] = [];
  for (const m of [1, 2] as const) {
    for (const entry of await lessonsOf(m)) {
      seq.push({ m, n: entry.data.number, title: entry.data.title, url: lessonUrl(m, entry.data.number), entry });
    }
  }
  return seq;
}
```

- [ ] **Step 4: Verify types**

Run: `npm run check`
Expected: 0 errors. (Nothing imports these yet; the check validates them standalone.)

- [ ] **Step 5: Commit**

```bash
git add src/lib/
git commit -m "feat: module registry, icons, course helpers"
```

---

### Task 4: Base layout, theme, styles, client progress helpers

**Files:**
- Create: `src/layouts/Base.astro`, `src/scripts/progress.ts`, `src/scripts/enhance.ts`
- Move: `assets/css/style.css` → `src/styles/style.css` (`git mv`)
- Modify: `src/pages/index.astro` (placeholder now uses Base)

**Interfaces:**
- Consumes: `MODULES`, `moduleUrl`, `lessonUrl`, `ICONS` (Task 3).
- Produces:
  - `Base.astro` props: `{ title: string; description: string; active?: 'home' | 'm1' | 'm2' | 'reference' }`, default slot for page content. Renders `<html>` with head (charset, viewport, favicon, description, `<ClientRouter />`, inline theme script), `<header class="site-header">` nav (same markup/classes as legacy pages, new hrefs), slot, footer.
  - `src/scripts/progress.ts`: `load(m: number): Record<string, 1>`, `isDone(m: number, n: number): boolean`, `setDone(m: number, n: number, v: boolean): void` (dispatches `progresschange` on `document`), `doneCount(m: number): number`.
  - `src/scripts/enhance.ts`: side-effect module — reveal-on-scroll for `.reveal`, theme-toggle delegation for `.theme-toggle`. Imported once by Base's script.

- [ ] **Step 1: Move the stylesheet**

```bash
git mv assets/css/style.css src/styles/style.css
```

- [ ] **Step 2: Write `src/scripts/progress.ts`**

```ts
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
```

- [ ] **Step 3: Write `src/scripts/enhance.ts`**

Port `initReveal()` (legacy `app.js:113-118`) and the theme-toggle behavior (`app.js:83-98`) using ClientRouter-safe patterns — delegated listeners bound once, per-page work in `astro:page-load`:

```ts
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
```

- [ ] **Step 4: Write `src/layouts/Base.astro`**

Copy the header/nav and footer markup from the legacy `index.html` (keep classes `site-header`, `nav`, `brand`, `tag`, `nav-links`, `nav-cta`, `theme-toggle`, and the brand + favicon SVGs verbatim), with new hrefs. Skeleton:

```astro
---
import { ClientRouter } from 'astro:transitions';
import '../styles/style.css';
import { lessonUrl, moduleUrl } from '../lib/modules';

interface Props {
  title: string;
  description: string;
  active?: 'home' | 'm1' | 'm2' | 'reference';
}
const { title, description, active } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <!-- favicon: copy the data-URI <link rel="icon"> line from legacy index.html verbatim -->
    <ClientRouter />
    <script is:inline>
      // Apply saved theme before paint; re-apply after view transitions.
      (function () {
        function applyTheme() {
          var t = localStorage.getItem('draft30.theme');
          if (t) document.documentElement.setAttribute('data-theme', t);
        }
        applyTheme();
        document.addEventListener('astro:after-swap', applyTheme);
      })();
    </script>
  </head>
  <body>
    <header class="site-header">
      <nav class="nav">
        <!-- brand <a> copied from legacy index.html, href="/" -->
        <div class="nav-links">
          <a href="/" class:list={[{ active: active === 'home' }]}>Overview</a>
          <a href={moduleUrl(1)} class:list={[{ active: active === 'm1' }]}>Module 1</a>
          <a href={moduleUrl(2)} class:list={[{ active: active === 'm2' }]}>Module 2</a>
          <a href="/reference/" class:list={[{ active: active === 'reference' }]}>Reference</a>
          <a href={lessonUrl(1, 1)} class="nav-cta btn btn-primary" style="padding:7px 14px">Start Lesson 1</a>
          <button class="theme-toggle" aria-label="Toggle theme"></button>
        </div>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <!-- footer: copy from legacy index.html, with hrefs rewritten to new URLs -->
    <script>
      import '../scripts/enhance';
    </script>
  </body>
</html>
```

Note: nav active state is now computed at build via the `active` prop — the legacy `initNavActive()` is not ported.

- [ ] **Step 5: Point the placeholder index at Base**

Replace `src/pages/index.astro` content with:

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Draft30" description="placeholder" active="home">
  <h1>Scaffold OK</h1>
</Base>
```

- [ ] **Step 6: Verify**

Run: `npm run check`
Expected: 0 errors.

Run: `npm run build && grep -c "data-theme" dist/index.html`
Expected: build succeeds; grep finds ≥ 1 (inline theme script present).

Run: `grep -c "astro" dist/index.html && grep -o 'href="/module-1/"' dist/index.html`
Expected: ClientRouter script present; nav href is `/module-1/`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: base layout, theme, client enhance + progress scripts"
```

---

### Task 5: Diagram library port

**Files:**
- Create: `src/lib/diagrams.ts`, `src/components/Diagram.astro`, `tests/diagrams.test.mjs`
- Reads (legacy): `assets/js/diagrams.js`

**Interfaces:**
- Produces: `DIAGRAMS: Record<string, string>` — 34 keys (`line-types`, `line-weights`, `lettering`, `line-control`, `constructions`, `glass-box`, `three-views`, `angle-symbol`, `iso-ellipse`, `isometric-axes`, `oblique`, `one-point`, `two-point`, `dimensioning`, `section-view`, `auxiliary`, `threads`, `intersection`, `development`, `assembly`, `title-block`, `composition`, `value-scale`, `hatch-form`, `crosshatch`, `light-logic`, `primitives-shaded`, `cast-shadow`, `edges`, `texture`, `color-system`, `temperature`, `selective-color`, `finished-plate`), each a self-contained `<svg>` string. `<Diagram name="..." />` renders one at build time; unknown names throw at build.

Note (spec deviation, intentional): the spec sketched one `.astro` file per diagram; the diagrams are template-literal string builders sharing helpers, so they port 1:1 into a single TS module and `Diagram.astro` is the one component. Same build-time rendering, far less mechanical risk.

- [ ] **Step 1: Write the failing test** — `tests/diagrams.test.mjs`

The TS module can't be imported by `node --test` directly; assert against the source with regexes:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const legacy = fs.readFileSync('assets/js/diagrams.js', 'utf8');
const ported = fs.readFileSync('src/lib/diagrams.ts', 'utf8');

const keysOf = (src) => [...src.matchAll(/D\["([a-z0-9-]+)"\]/g)].map((m) => m[1]).sort();

test('ported diagram library has exactly the legacy keys', () => {
  const legacyKeys = [...new Set(keysOf(legacy))];
  const portedKeys = [...new Set(keysOf(ported))];
  assert.equal(legacyKeys.length, 34);
  assert.deepEqual(portedKeys, legacyKeys);
});

test('ported module is an ES module exporting DIAGRAMS', () => {
  assert.match(ported, /export const DIAGRAMS/);
  assert.doesNotMatch(ported, /window|global\.DIAGRAMS/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `no such file ... src/lib/diagrams.ts`.

- [ ] **Step 3: Port `assets/js/diagrams.js` → `src/lib/diagrams.ts`**

Mechanical transformation — the 700 lines of SVG template literals are copied **unchanged**:

1. Copy the whole file.
2. Delete the IIFE wrapper: the opening `(function (global) {` + `"use strict";` and the closing `global.DIAGRAMS = D;` + `})(window);`.
3. Type the two declarations: `const svg = (vb: string, inner: string, cls?: string) =>` and `const D: Record<string, string> = {};`
4. Append at the end: `export const DIAGRAMS = D;`
5. Keep the header comment, `DEFS`, and every `D["..."] = svg(...)` block byte-identical.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (all suites).

- [ ] **Step 5: Write `src/components/Diagram.astro`**

```astro
---
import { DIAGRAMS } from '../lib/diagrams';

interface Props {
  name: string;
}
const { name } = Astro.props;
const svg = DIAGRAMS[name];
if (!svg) throw new Error(`Unknown diagram: "${name}"`);
---
<Fragment set:html={svg} />
```

- [ ] **Step 6: Verify it renders**

Temporarily add to `src/pages/index.astro` inside `<Base>`: `<Diagram name="three-views" />` (with the import). Run `npm run build`, then:

Run: `grep -c "<svg" dist/index.html`
Expected: ≥ 2 (brand mark + diagram). Remove the temporary usage again.

- [ ] **Step 7: Commit**

```bash
git add src/lib/diagrams.ts src/components/Diagram.astro tests/diagrams.test.mjs
git commit -m "feat: port SVG diagram library to build-time module"
```

---

### Task 6: Lesson pages (45 pre-rendered)

**Files:**
- Create: `src/pages/module-[m]/lesson-[n].astro`

**Interfaces:**
- Consumes: `sequence()`, `phasesOf()` (Task 3), `MODULES`, `lessonUrl`, `moduleUrl`, `ICONS`, `Base.astro`, `Diagram.astro`, `progress.ts`, `render()` from `astro:content`.
- Produces: 45 static pages at `/module-{m}/lesson-{n}/`. DOM contract for client scripts: `#complete-wrap[data-m][data-n][data-total]`, `#complete-btn`, `.lh-progress > i`, `.lesson-nav[data-prev][data-next]` (URLs, empty string when absent).

- [ ] **Step 1: Write `src/pages/module-[m]/lesson-[n].astro`**

The markup mirrors the legacy `renderLesson()` (`assets/js/app.js:264-357`) — same classes so the CSS applies unchanged:

```astro
---
import { render } from 'astro:content';
import Base from '../../layouts/Base.astro';
import Diagram from '../../components/Diagram.astro';
import { MODULES, lessonUrl, moduleUrl } from '../../lib/modules';
import { phasesOf, sequence, type SeqItem } from '../../lib/course';
import { ICONS } from '../../lib/icons';

export async function getStaticPaths() {
  const seq = await sequence();
  return seq.map((item, i) => ({
    params: { m: String(item.m), n: String(item.n) },
    props: {
      entry: item.entry,
      prev: seq[i - 1] ?? null,
      next: seq[i + 1] ?? null,
    },
  }));
}

interface Props {
  entry: SeqItem['entry'];
  prev: SeqItem | null;
  next: SeqItem | null;
}
const { entry, prev, next } = Astro.props;
const d = entry.data;
const m = d.module;
const mm = MODULES[m];
const phases = await phasesOf(m);
const p = phases[d.phase].data;
const total = (await sequence()).filter((s) => s.m === m).length;
const num = String(d.number).padStart(2, '0');
const { Content } = await render(entry);
---
<Base
  title={`${mm.unit} ${d.number} · ${d.title} — Draft30`}
  description={d.objective}
  active={m === 1 ? 'm1' : 'm2'}
>
  <div class="wrap" style={`--phase:${p.color}`}>
    <nav class="crumbs" id="crumbs">
      <a href="/">Home</a><span class="sep">›</span>
      <a href={moduleUrl(m)}>{mm.tag}</a><span class="sep">›</span>
      <a href={`${moduleUrl(m)}#phase-${d.phase}`}>{p.name}</a><span class="sep">›</span>
      <span class="here">{mm.unit} {d.number}</span>
    </nav>

    <article id="lesson" data-pagefind-body>
      <header class="lesson-head">
        <div class="lh-top">
          <span class="lh-phase">{p.name} · Phase {d.phase + 1} of {phases.length}</span>
          <span class="lh-count">{mm.unit} {d.number} / {total}</span>
        </div>
        <h1><span class="lh-num">{num}</span> {d.title}</h1>
        <div class="lh-meta">
          <span><Fragment set:html={ICONS.clock} /> 45–90 min</span>
          <span><Fragment set:html={ICONS.pencil} /> {mm.kit}</span>
          <span><Fragment set:html={ICONS.map} /> <a href={moduleUrl(m)}>{mm.title}</a></span>
        </div>
        <div class="lh-progress"><i style="width:0%"></i></div>
      </header>

      <div class="lesson-figure">
        <Diagram name={d.diagram} />
        <div class="fig-cap">Fig. {d.number} — {d.title}</div>
      </div>

      <div class="lesson-goal"><span class="g-label">Your goal</span>{d.objective}</div>

      <section class="lesson-block warmup">
        <h2><span class="lb-ico"><Fragment set:html={ICONS.flame} /></span> Warm-up <small>≈ 10 min</small></h2>
        <ul>{d.warmup.map((w) => <li>{w}</li>)}</ul>
      </section>

      <section class="lesson-block">
        <h2><span class="lb-ico"><Fragment set:html={ICONS.pencil} /></span> Main exercise <small>30–60 min</small></h2>
        <ul>{d.main.map((w) => <li>{w}</li>)}</ul>
      </section>

      <div class="lesson-checkpoint">
        <div class="lc-h"><Fragment set:html={ICONS.target} /> Checkpoint — how you know it's working</div>
        <p>{d.checkpoint}</p>
      </div>

      <div class="lesson-tip"><b>Pro tip.</b> <Content /></div>

      <div class="lesson-complete" id="complete-wrap" data-m={m} data-n={d.number} data-total={total}>
        <button class="big-check" id="complete-btn"></button>
      </div>

      <nav class="lesson-nav" data-prev={prev?.url ?? ''} data-next={next?.url ?? ''}>
        {prev
          ? <a class="prev" href={prev.url}><span class="ln-dir">← Previous</span><span class="ln-title">{MODULES[prev.m].short} {prev.n} · {prev.title}</span></a>
          : <a class="disabled"><span class="ln-dir">Start</span><span class="ln-title">You're at the beginning</span></a>}
        {next
          ? <a class="next" href={next.url}><span class="ln-dir">Next →</span><span class="ln-title">{MODULES[next.m].short} {next.n} · {next.title}</span></a>
          : <div class="ln-end" style="text-align:right"><span class="ln-dir">The end</span><span class="ln-title">Course complete 🎉</span></div>}
      </nav>
      <a class="back-map" href={moduleUrl(m)}><Fragment set:html={ICONS.map} /> All {mm.unit.toLowerCase()}s in {mm.title}</a>
    </article>
  </div>
</Base>

<script>
  import { isDone, setDone, doneCount } from '../../scripts/progress';
  import { ICONS } from '../../lib/icons';

  function initLesson() {
    const wrap = document.getElementById('complete-wrap');
    const btn = document.getElementById('complete-btn');
    if (!wrap || !btn) return;
    const m = Number(wrap.dataset.m);
    const n = Number(wrap.dataset.n);
    const total = Number(wrap.dataset.total);

    const paint = () => {
      const done = isDone(m, n);
      wrap.classList.toggle('done', done);
      btn.innerHTML = done
        ? `${ICONS.check} Lesson ${n} complete`
        : `${ICONS.circle} Mark Lesson ${n} complete`;
      const bar = document.querySelector<HTMLElement>('.lh-progress > i');
      if (bar) bar.style.width = `${Math.round((doneCount(m) / total) * 100)}%`;
    };
    paint();
    btn.addEventListener('click', () => {
      setDone(m, n, !isDone(m, n));
      paint();
    });
  }

  // Bound once; reads current DOM so it survives view transitions.
  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return;
    const nav = document.querySelector<HTMLElement>('.lesson-nav');
    if (!nav) return;
    if (e.key === 'ArrowLeft' && nav.dataset.prev) location.href = nav.dataset.prev;
    if (e.key === 'ArrowRight' && nav.dataset.next) location.href = nav.dataset.next;
  });

  document.addEventListener('astro:page-load', initLesson);
</script>
```

Note two intentional changes vs legacy: the progress bar width starts at `0%` and is painted client-side (progress is per-visitor, unknowable at build), and the lesson body carries `data-pagefind-body` for Task 9's search index.

- [ ] **Step 2: Verify build output**

Run: `npm run build`
Expected: succeeds; output mentions 45 lesson routes + index.

Run: `ls dist/module-1 | wc -l && ls dist/module-2 | wc -l`
Expected: `30` and `15`.

Run: `grep -o "<h1>.*</h1>" dist/module-1/lesson-1/index.html | head -1`
Expected: contains `Set up your drafting kit`.

Run: `grep -o 'data-next="[^"]*"' dist/module-1/lesson-30/index.html && grep -o 'data-prev="[^"]*"' dist/module-2/lesson-1/index.html`
Expected: `data-next="/module-2/lesson-1/"` and `data-prev="/module-1/lesson-30/"` (cross-module flow preserved).

Run: `grep -c "thick for the object itself" dist/module-1/lesson-1/index.html`
Expected: `1`, rendered inside `<strong>` (Markdown body rendered).

- [ ] **Step 3: Verify in the browser (manual, quick)**

Run `npm run dev`, open `http://localhost:4321/module-1/lesson-1/`:
- Page renders with figure, blocks, tip.
- "Mark Lesson 1 complete" toggles state and persists on reload.
- `→` key navigates to lesson 2; `←` returns.

- [ ] **Step 4: Commit**

```bash
git add src/pages/module-[m]
git commit -m "feat: 45 pre-rendered lesson pages with progress + keyboard nav"
```

---

### Task 7: Course map pages

**Files:**
- Create: `src/pages/module-[m]/index.astro`

**Interfaces:**
- Consumes: `lessonsOf`, `phasesOf`, `sequence`, `MODULES`, `lessonUrl`, `moduleUrl`, `ICONS`, `Base.astro`, `progress.ts`.
- Produces: `/module-1/`, `/module-2/`. DOM contract: each card is `a.lesson-card[data-m][data-n]` containing `.lc-state`; header has `#cp-pct`, `#cp-cnt`, `.course-progress .bar > i`, `#continue-btn[data-unit]`; each phase section `#phase-{i}` has `.pg-count[data-phase]`.

- [ ] **Step 1: Write `src/pages/module-[m]/index.astro`**

Static structure from legacy `renderCourse()`/`cardHTML()` (`assets/js/app.js:182-259`), same class names; progress-dependent bits (done/next card states, counts, continue button) are painted client-side:

```astro
---
import Base from '../../layouts/Base.astro';
import { MODULES, lessonUrl, moduleUrl } from '../../lib/modules';
import { lessonsOf, phasesOf } from '../../lib/course';
import { ICONS } from '../../lib/icons';

export function getStaticPaths() {
  return [{ params: { m: '1' } }, { params: { m: '2' } }];
}

const m = Number(Astro.params.m) as 1 | 2;
const mm = MODULES[m];
const other = MODULES[m === 1 ? 2 : 1];
const lessons = await lessonsOf(m);
const phases = await phasesOf(m);
---
<Base title={`${mm.tag} · ${mm.title} — Draft30`} description={mm.sub} active={m === 1 ? 'm1' : 'm2'}>
  <div class="wrap">
    <nav class="crumbs" id="crumbs">
      <a href="/">Home</a><span class="sep">›</span>
      <span class="here">{mm.tag} · {mm.title}</span>
    </nav>

    <header class="course-head" id="course-head" style={`--phase:${mm.color}`}>
      <div class="course-head-main">
        <div class="eyebrow">{mm.tag}</div>
        <h1>{mm.title}</h1>
        <p>{mm.sub}</p>
      </div>
      <div class="course-progress" data-m={m} data-total={lessons.length}>
        <div class="cp-pct" id="cp-pct">0%</div>
        <div class="cp-lbl"><span id="cp-cnt">0 of {lessons.length}</span> {mm.unit.toLowerCase()}s complete</div>
        <div class="bar"><i style="width:0%"></i></div>
        <a class="btn btn-primary" id="continue-btn" data-unit={mm.unit} href={lessonUrl(m, 1)}>Continue <Fragment set:html={ICONS.arrow} /></a>
      </div>
    </header>

    <div id="phase-list">
      {phases.map((ph, pi) => {
        const inPhase = lessons.filter((l) => l.data.phase === pi);
        return (
          <section class="phase-group" style={`--phase:${ph.data.color}`} id={`phase-${pi}`}>
            <div class="phase-group-head">
              <span class="pg-ix">Phase {pi + 1}</span>
              <h2>{ph.data.name}</h2>
              <span class="pg-count" data-phase={pi}>0/{inPhase.length} done</span>
              <p class="pg-blurb">{ph.data.blurb}</p>
            </div>
            <div class="lesson-grid">
              {inPhase.map((l) => (
                <a class="lesson-card" href={lessonUrl(m, l.data.number)} style={`--phase:${ph.data.color}`} data-m={m} data-n={l.data.number}>
                  <span class="lc-top"><span class="lc-num">{String(l.data.number).padStart(2, '0')}</span><span class="lc-state"><Fragment set:html={ICONS.circle} /></span></span>
                  <span class="lc-title">{l.data.title}</span>
                  <span class="lc-obj">{l.data.objective}</span>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>

    <div class="module-switch" id="module-switch">
      <div class="ms-text">{m === 1 ? "Finished the drawing? Add the artisan's layer." : 'Want to revisit the fundamentals?'} <b>{other.tag}: {other.title}</b></div>
      <a href={moduleUrl(other.m)} class="btn btn-ghost">Go to {other.tag} <Fragment set:html={ICONS.arrow} /></a>
    </div>
  </div>
</Base>

<script>
  import { load } from '../../scripts/progress';
  import { ICONS } from '../../lib/icons';

  function paintCourse() {
    const head = document.querySelector<HTMLElement>('.course-progress');
    if (!head) return;
    const m = Number(head.dataset.m);
    const total = Number(head.dataset.total);
    const done = load(m);

    const cards = Array.from(document.querySelectorAll<HTMLAnchorElement>('.lesson-card'));
    let next: HTMLAnchorElement | null = null;
    for (const card of cards) {
      const n = Number(card.dataset.n);
      const isDone = Boolean(done[n]);
      card.classList.toggle('done', isDone);
      card.classList.remove('next');
      const state = card.querySelector('.lc-state')!;
      if (isDone) state.innerHTML = `${ICONS.check} done`;
      else state.innerHTML = ICONS.circle;
      if (!isDone && !next) next = card;
    }
    if (next) {
      next.classList.add('next');
      next.querySelector('.lc-state')!.innerHTML = 'start here';
    }

    const doneCount = cards.filter((c) => done[Number(c.dataset.n)]).length;
    const pct = total ? Math.round((doneCount / total) * 100) : 0;
    document.getElementById('cp-pct')!.textContent = `${pct}%`;
    document.getElementById('cp-cnt')!.textContent = `${doneCount} of ${total}`;
    const bar = document.querySelector<HTMLElement>('.course-progress .bar > i');
    if (bar) bar.style.width = `${pct}%`;

    document.querySelectorAll<HTMLElement>('.pg-count').forEach((el) => {
      const pi = el.dataset.phase;
      const section = document.getElementById(`phase-${pi}`);
      const inPhase = Array.from(section?.querySelectorAll<HTMLElement>('.lesson-card') ?? []);
      const d = inPhase.filter((c) => done[Number(c.dataset.n)]).length;
      el.textContent = `${d}/${inPhase.length} done`;
    });

    const btn = document.getElementById('continue-btn') as HTMLAnchorElement | null;
    if (btn) {
      const unit = btn.dataset.unit ?? 'Lesson';
      if (next) {
        btn.href = next.href;
        btn.innerHTML = `Continue · ${unit} ${next.dataset.n} ${ICONS.arrow}`;
      } else {
        btn.innerHTML = `Review from ${unit} 1 ${ICONS.arrow}`;
      }
    }
  }

  document.addEventListener('astro:page-load', paintCourse);
  document.addEventListener('progresschange', paintCourse);
</script>
```

- [ ] **Step 2: Verify build output**

Run: `npm run build`
Expected: succeeds.

Run: `grep -c "lesson-card" dist/module-1/index.html && grep -c "lesson-card" dist/module-2/index.html`
Expected: `30`-ish and `15`-ish per page (one per lesson; grep counts lines, each card is one line — any count ≥ 30 / ≥ 15 is fine).

Run: `grep -c 'id="phase-4"' dist/module-1/index.html && grep -c 'id="phase-3"' dist/module-2/index.html`
Expected: `1` and `1` (5 phases in m1, 4 in m2).

- [ ] **Step 3: Verify in the browser**

`npm run dev` → `http://localhost:4321/module-1/`:
- Mark lesson 1 done on its page, return to the map: card 1 shows "done", card 2 shows "start here", header shows `1 of 30`, phase 1 count `1/6 done`.

- [ ] **Step 4: Commit**

```bash
git add "src/pages/module-[m]/index.astro"
git commit -m "feat: course map pages with client-side progress states"
```

---

### Task 8: Landing page

**Files:**
- Create: real `src/pages/index.astro` (replaces placeholder)
- Reads (legacy): `index.html` (hero, "how a session works", five-phases intro, tools/routine sections, footer — copied)

**Interfaces:**
- Consumes: `sequence`, `lessonsOf`, `phasesOf`, `MODULES`, `lessonUrl`, `moduleUrl`, `ICONS`, `Diagram.astro`, `progress.ts`.
- Produces: `/`. DOM contract: `#continue-band` (client-filled), `a.day-cell[data-m][data-n]` roadmap cells, `#seq-data` JSON script with the full ordered sequence.

- [ ] **Step 1: Write `src/pages/index.astro`**

Structure:

1. **Static sections** — copy from legacy `index.html` between `<main>` and `</main>` **verbatim**: hero (including the big hero-art SVG), the "two modules" cards, "how a session works", tools & routine, and any remaining static sections; also the footer into Base if not already done in Task 4. Rewrite every internal href: `index.html`→`/`, `course.html?m=1`→`/module-1/`, `course.html?m=2`→`/module-2/`, `lesson.html?m=1&d=1`→`/module-1/lesson-1/`, `reference.html`→`/reference/`. Elements with `data-diagram="X"` become `<Diagram name="X" />` wrapped in the same container element.
2. **Continue band** — server-render the skeleton only:

```astro
<section class="continue" id="continue-band"></section>
```

3. **Roadmap** — build-time loop replacing legacy `renderHome()` roadmap:

```astro
---
// in frontmatter:
const groups = [];
for (const m of [1, 2] as const) {
  groups.push({ mm: MODULES[m], lessons: await lessonsOf(m), phases: await phasesOf(m) });
}
const seq = (await sequence()).map(({ m, n, title, url }) => ({ m, n, title, url }));
---
<div id="roadmap">
  {groups.map(({ mm, lessons, phases }) => (
    <div class="roadmap-group" style={`--phase:${mm.color}`}>
      <div class="roadmap-label"><span class="rl-tag">{mm.tag}</span><span class="rl-title">{mm.title}</span><span class="rl-count">{lessons.length} lessons</span></div>
      <div class="roadmap">
        {lessons.map((l) => (
          <a class="day-cell" href={lessonUrl(mm.m, l.data.number)} style={`--phase:${phases[l.data.phase].data.color}`} data-m={mm.m} data-n={l.data.number}>
            <span class="dn">{mm.short.toUpperCase()} {String(l.data.number).padStart(2, '0')}</span>
            <span class="dt">{l.data.title}</span>
            <span class="check"><Fragment set:html={ICONS.check} /></span>
          </a>
        ))}
      </div>
    </div>
  ))}
</div>
```

4. **Phase timeline** — same pattern as legacy `renderHome()` phases block: per module a `.phase-mod-head` then a `.phase-row.reveal` per phase with `.phase-days` (label `Lessons` + `.big` range from `ph.data.lessons`), `h3` name, blurb, and `.chip` per lesson title in that phase.

5. **Sequence data + client script** at the end of the page:

```astro
<script type="application/json" id="seq-data" set:html={JSON.stringify(seq)} />
<script>
  import { load } from '../scripts/progress';
  import { ICONS } from '../lib/icons';

  function paintHome() {
    const dataEl = document.getElementById('seq-data');
    if (!dataEl) return;
    const seq = JSON.parse(dataEl.textContent || '[]') as Array<{ m: number; n: number; title: string; url: string }>;
    const done: Record<number, Record<string, 1>> = { 1: load(1), 2: load(2) };

    document.querySelectorAll<HTMLElement>('.day-cell').forEach((cell) => {
      cell.classList.toggle('done', Boolean(done[Number(cell.dataset.m)!]?.[cell.dataset.n!]));
    });

    const band = document.getElementById('continue-band');
    if (!band) return;
    const next = seq.find((s) => !done[s.m]?.[s.n]);
    const started = Object.keys(done[1]).length + Object.keys(done[2]).length > 0;
    if (!next) {
      band.innerHTML = `<div><div class="cb-label">All done</div><div class="cb-title">You've completed every lesson 🎉</div><div class="cb-sub">Revisit any day, or run the capstone again — it'll be better each time.</div></div>
        <div class="cb-actions"><a href="/module-1/" class="btn btn-ghost">Course map</a></div>`;
    } else {
      const tag = next.m === 1 ? 'Module 1' : 'Module 2';
      const inMod = seq.filter((s) => s.m === next.m);
      const doneInMod = inMod.filter((s) => done[s.m]?.[s.n]).length;
      band.innerHTML = `<div>
          <div class="cb-label">${started ? 'Continue where you left off' : 'Start here'}</div>
          <div class="cb-title">${tag} · Lesson ${next.n} — ${next.title}</div>
          <div class="cb-sub">${started ? `${doneInMod} of ${inMod.length} lessons done in this module` : 'Your first session. All you need is a pencil and paper.'}</div>
        </div>
        <div class="cb-actions"><a href="${next.url}" class="btn btn-primary">${started ? 'Continue' : 'Begin'} ${ICONS.arrow}</a></div>`;
    }
  }

  document.addEventListener('astro:page-load', paintHome);
  document.addEventListener('progresschange', paintHome);
</script>
```

Use `title` and `description` copied from legacy `index.html` `<title>`/`<meta name="description">`, `active="home"`.

- [ ] **Step 2: Verify build output**

Run: `npm run build`
Expected: succeeds.

Run: `grep -c "day-cell" dist/index.html`
Expected: ≥ 45.

Run: `grep -c 'id="seq-data"' dist/index.html && grep -c "phase-row" dist/index.html`
Expected: `1`; ≥ 9.

- [ ] **Step 3: Verify in the browser**

`npm run dev` → `/`: hero renders, roadmap shows 45 cells (done ones ticked), continue band shows the correct next lesson, phase timeline lists 9 phases across two module groups.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/layouts/Base.astro
git commit -m "feat: landing page — build-time roadmap + client continue band"
```

---

### Task 9: Reference page + search

**Files:**
- Create: `src/pages/reference.astro`
- Modify: `src/layouts/Base.astro` (search dialog + nav button)
- Reads (legacy): `reference.html` (all content sections — copied)

**Interfaces:**
- Consumes: `Base.astro`, `Diagram.astro`, `astro-pagefind/components/Search`.
- Produces: `/reference/` (tagged `data-pagefind-body`); a `#search-dialog` `<dialog>` with Pagefind UI available on every page via a `.search-open` nav button.

- [ ] **Step 1: Write `src/pages/reference.astro`**

Copy everything between `<main>` and `</main>` of legacy `reference.html` into `<Base title="..." description="..." active="reference">`, with:
- Every `<div ... data-diagram="X">...</div>` (or the actual container tag used there) → same container with `<Diagram name="X" />` as its child instead of the `data-diagram` attribute.
- All internal hrefs rewritten to new URLs (same mapping as Task 8).
- Add `data-pagefind-body` to the top-level content wrapper element.
- `title`/`description` copied from legacy `reference.html`'s head.

- [ ] **Step 2: Add search UI to `src/layouts/Base.astro`**

In the nav, after the Reference link:

```astro
<button class="search-open" aria-label="Search the course">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
</button>
```

Before `</body>`:

```astro
---
// add to frontmatter imports:
import Search from 'astro-pagefind/components/Search';
---
<dialog id="search-dialog">
  <div class="search-box">
    <Search id="site-search" className="pagefind-ui" uiOptions={{ showImages: false }} />
    <button class="search-close btn btn-ghost">Close</button>
  </div>
</dialog>
```

And in the Base `<script>` (extend the existing one that imports `enhance`):

```ts
document.addEventListener('click', (e) => {
  const t = e.target as Element;
  const dialog = document.getElementById('search-dialog') as HTMLDialogElement | null;
  if (!dialog) return;
  if (t.closest?.('.search-open')) dialog.showModal();
  if (t.closest?.('.search-close') || t === dialog) dialog.close();
});
```

Add minimal styles to `src/styles/style.css` (match existing design-token usage — reuse `var(--paper)`, `var(--ink)` etc. from the file's existing custom properties):

```css
/* ---------- Search dialog ---------- */
#search-dialog { border: 1px solid var(--line, currentColor); border-radius: 12px; padding: 0; width: min(640px, 92vw); background: var(--paper, Canvas); color: inherit; }
#search-dialog::backdrop { background: rgb(0 0 0 / 0.45); }
#search-dialog .search-box { padding: 16px; }
#search-dialog .search-close { margin-top: 12px; }
```

(Adjust the custom-property names to the ones actually defined at the top of `style.css` — check them when editing.)

- [ ] **Step 3: Verify build + search index**

Run: `npm run build`
Expected: succeeds; astro-pagefind logs an indexing step; `dist/pagefind/pagefind.js` exists.

Run: `ls dist/pagefind/ | head`
Expected: `pagefind.js`, `pagefind-ui.js`, fragment/index files.

Run: `grep -c "data-pagefind-body" dist/reference/index.html dist/module-1/lesson-1/index.html`
Expected: `1` in each.

- [ ] **Step 4: Verify search in the browser (built site — Pagefind indexes at build)**

Run: `npm run preview` → `http://localhost:4321/`:
- Click the search button → dialog opens; search "isometric" → results include lesson pages and reference; result links navigate correctly.
- Open `/reference/`: all diagrams render, glossary intact, dark/light theme still switches.

- [ ] **Step 5: Commit**

```bash
git add src/pages/reference.astro src/layouts/Base.astro src/styles/style.css
git commit -m "feat: reference page + Pagefind search dialog"
```

---

### Task 10: Redirect stubs + 404

**Files:**
- Create: `public/lesson.html`, `public/course.html`, `public/curriculum.html`, `public/module2.html`, `public/reference.html`, `src/pages/404.astro`

**Interfaces:**
- Produces: every legacy URL redirects to its new equivalent; Cloudflare Pages serves `404.html` automatically for unknown routes.

- [ ] **Step 1: Write the query-param stubs**

`public/lesson.html`:

```html
<!doctype html>
<meta charset="utf-8">
<title>Redirecting…</title>
<script>
  var q = new URLSearchParams(location.search);
  location.replace('/module-' + (q.get('m') || '1') + '/lesson-' + (q.get('d') || '1') + '/');
</script>
<a href="/module-1/lesson-1/">Continue to the course</a>
```

`public/course.html`:

```html
<!doctype html>
<meta charset="utf-8">
<title>Redirecting…</title>
<script>
  var q = new URLSearchParams(location.search);
  location.replace('/module-' + (q.get('m') || '1') + '/');
</script>
<a href="/module-1/">Continue to the course map</a>
```

- [ ] **Step 2: Write the static stubs**

`public/curriculum.html` (and analogously `public/module2.html` → `/module-2/`, `public/reference.html` → `/reference/`):

```html
<!doctype html>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=/module-1/">
<title>Redirecting…</title>
<a href="/module-1/">Continue</a>
```

- [ ] **Step 3: Write `src/pages/404.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import { lessonUrl } from '../lib/modules';
---
<Base title="Page not found — Draft30" description="That page doesn't exist.">
  <div class="wrap" style="text-align:center; padding: 80px 0;">
    <div class="eyebrow">404</div>
    <h1>That sheet isn't in the drawer.</h1>
    <p class="lead">The page you're after doesn't exist — maybe an old link.</p>
    <div class="hero-cta" style="justify-content:center;">
      <a href="/" class="btn btn-primary">Back to the overview</a>
      <a href={lessonUrl(1, 1)} class="btn btn-ghost">Start Lesson 1</a>
    </div>
  </div>
</Base>
```

- [ ] **Step 4: Verify**

Run: `npm run build && ls dist/lesson.html dist/course.html dist/curriculum.html dist/module2.html dist/reference.html dist/404.html`
Expected: all six exist. Note `dist/reference.html` (stub) and `dist/reference/index.html` (real page) coexist — different paths.

Run `npm run preview`, open `http://localhost:4321/lesson.html?m=2&d=3`
Expected: lands on `/module-2/lesson-3/`.

- [ ] **Step 5: Commit**

```bash
git add public/ src/pages/404.astro
git commit -m "feat: legacy-URL redirect stubs + 404 page"
```

---

### Task 11: Cleanup, CI, README, deploy config

**Files:**
- Delete: `index.html`, `course.html`, `lesson.html`, `curriculum.html`, `module2.html`, `reference.html`, `assets/` (all remaining files), `.nojekyll`, `.github/workflows/pages.yml`
- Create: `.github/workflows/ci.yml`
- Modify: `README.md`, `tests/diagrams.test.mjs`

**Interfaces:**
- Produces: a repo whose only site is the Astro one; CI that fails on content/type/build errors; README that documents the new workflow.

- [ ] **Step 1: Fix the diagrams test's legacy dependency**

`tests/diagrams.test.mjs` reads `assets/js/diagrams.js`, which is about to be deleted. Replace the comparison-against-legacy test with a self-contained one:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ported = fs.readFileSync('src/lib/diagrams.ts', 'utf8');
const keys = [...new Set([...ported.matchAll(/D\["([a-z0-9-]+)"\]/g)].map((m) => m[1]))];

test('diagram library has all 34 diagrams', () => {
  assert.equal(keys.length, 34);
  for (const k of ['line-types', 'glass-box', 'three-views', 'finished-plate', 'value-scale']) {
    assert.ok(keys.includes(k), `missing diagram: ${k}`);
  }
});

test('module exports DIAGRAMS and has no window/global references', () => {
  assert.match(ported, /export const DIAGRAMS/);
  assert.doesNotMatch(ported, /window\.|global\.DIAGRAMS/);
});
```

Run: `npm test` → PASS.

- [ ] **Step 2: Delete the legacy site**

```bash
git rm index.html course.html lesson.html curriculum.html module2.html reference.html .nojekyll
git rm -r assets
git rm .github/workflows/pages.yml
```

Note: `scripts/convert-lessons.mjs` can no longer run after this (its inputs are gone) — that's expected; it was a one-off and the generated content is committed. It stays in the repo as a record.

- [ ] **Step 3: Write `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run check
      - run: npm run build
```

- [ ] **Step 4: Update `README.md`**

- "No build step, no dependencies" intro → describe the Astro setup (content in `src/content/lessons/*.md`, build-time rendering, still no client framework and no external requests at runtime).
- Page table: new URLs (`/`, `/module-1/`, `/module-1/lesson-5/`, `/reference/`); note legacy `*.html?m=&d=` URLs redirect.
- Assets section → new layout: `src/content/`, `src/lib/diagrams.ts`, `src/pages/`, `src/styles/style.css`, `src/scripts/`.
- "Running it" →

```bash
npm install
npm run dev        # dev server at http://localhost:4321
npm run build      # static site into dist/ (includes search index)
npm run preview    # serve the built site
```

- Add a **Deploy** section: Cloudflare Pages, build command `npm run build`, output directory `dist`, Node version 22 (set via `NODE_VERSION` env var or `.node-version` file — also create `.node-version` containing `22`).
- Keep design notes (offline, localStorage, themes) — still true. Adding a lesson = add/edit a Markdown file in `src/content/lessons/`.

- [ ] **Step 5: Full verification**

Run: `npm test && npm run check && npm run build`
Expected: all pass; build emits 45 lesson pages + `/`, `/module-1/`, `/module-2/`, `/reference/`, `404` + pagefind assets.

Run: `git status`
Expected: only intended deletions/changes staged; nothing references `assets/` anymore: `grep -rn "assets/" src/ public/ README.md` returns nothing (or only historical mentions you intended).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove legacy site, add CI, update README for Astro + Cloudflare"
```

---

### Task 12: End-to-end verification + Cloudflare Pages hookup

**Files:** none created — verification + user-facing deploy steps.

- [ ] **Step 1: Parity click-through (dev server)**

`npm run dev`, then verify each:
- `/` — hero, 45-cell roadmap, phase timeline, tools sections, footer.
- `/module-1/` and `/module-2/` — all phases and cards; progress header.
- `/module-1/lesson-1/`, `/module-1/lesson-30/`, `/module-2/lesson-1/`, `/module-2/lesson-15/` — figure, blocks, tip, prev/next flow crossing the module boundary; lesson 15 of module 2 shows "Course complete 🎉".
- `/reference/` — every section's diagram renders; glossary present.
- Theme toggle switches and **persists across navigations** (view transitions re-apply it).
- ←/→ keys navigate lessons.

- [ ] **Step 2: Progress-migration check**

In the browser console on `/`:

```js
localStorage.setItem('draft30.progress.v1', JSON.stringify({ 1: 1, 2: 1, 3: 1 }));
localStorage.setItem('draft30.progress.m2', JSON.stringify({ 1: 1 }));
location.reload();
```

Expected: roadmap shows those 4 cells done; continue band says "Continue where you left off … Lesson 4"; `/module-1/` header shows `3 of 30`, phase 1 shows `3/6 done`, card 4 says "start here".

- [ ] **Step 3: Built-site checks**

`npm run build && npm run preview`:
- Search works (query "isometric", "sanguine").
- `http://localhost:4321/lesson.html?m=1&d=12` → `/module-1/lesson-12/`; `course.html?m=2` → `/module-2/`; `curriculum.html` → `/module-1/`; `reference.html` → `/reference/`.
- A nonsense URL shows the 404 page (preview serves `404.html`).
- Disable JS (DevTools) → lesson pages fully readable (content, figure, prev/next links work; only progress/search/theme-toggle inert).
- Lighthouse spot-check (DevTools → Lighthouse) on `/module-1/lesson-8/` of the built site: Performance / Accessibility / SEO each ≥ 90.

- [ ] **Step 4: Push and set up Cloudflare Pages (user does the dashboard part)**

```bash
git push origin claude/technical-drawing-website-eq714a
```

Then in the Cloudflare dashboard (requires the user's account — hand these steps to the user):
1. Workers & Pages → Create → Pages → Connect to Git → select the repo.
2. Production branch: `claude/technical-drawing-website-eq714a`.
3. Build command: `npm run build` — Output directory: `dist`.
4. Save and Deploy; verify the `*.pages.dev` URL, then update `site` in `astro.config.mjs` to the real URL and commit.

- [ ] **Step 5: Final commit if anything changed during verification**

```bash
git add -A && git commit -m "fix: post-verification adjustments" || echo "nothing to commit"
```
