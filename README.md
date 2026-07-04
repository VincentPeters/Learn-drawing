# Draft30 — Learn Technical Drawing & Rendering in 45 Lessons

A free, self-contained companion **website** for learning **general technical and
engineering drawing**. It reworks and expands a 12-week academic-art plan into a **45-lesson course in
two modules** you can actually keep up with.

A static site built with **Astro**: lesson content lives as Markdown in
`src/content/lessons/`, and pages are rendered at build time into plain HTML.
Still zero client-side framework, no external requests at runtime, and fully
offline-friendly once built.

## What's inside

The course is in **two modules**:

- **Module 1 — Technical Drawing** (30 lessons): the precise, correct line work that describes a real part.
- **Module 2 — Rendering & Colour** (15 lessons): the tone, hatching, light, and graphite-plus-blue-and-sanguine colour that turn a drawing into a finished plate.

| Page | Purpose |
| --- | --- |
| `/` | Landing page — *continue where you left off*, the two modules, how a session works, the five phases, the whole-journey roadmap, tools & routine. |
| `/module-1/`, `/module-2/` | **Course map** for a module: phases as sections, each lesson a card with its goal, completion state, and a highlighted *start here / continue*. Per-phase and overall progress. |
| `/module-1/lesson-5/`, `/module-2/lesson-3/`, ... | **One page per lesson**: breadcrumb, goal, timed warm-up / main / checkpoint blocks, pro tip, *mark complete*, and prev/next that flow across the whole course (← / → keys). |
| `/reference/` | A visual cheat-sheet for both modules: line alphabet, orthographic, isometric, dimensioning, sections, plus value, light, and colour — and a glossary. |
| `PLAN.md` | The written plan for both modules in plain Markdown. |

The legacy `course.html?m=`, `lesson.html?m=&d=`, `curriculum.html`, `module2.html`,
and `reference.html` URLs redirect to their new equivalents (redirect stubs live in
`public/`), so old links and bookmarks keep working.

Each lesson is a Markdown file with frontmatter, rendered through a shared layout, so
**adding or editing a lesson means adding or editing a Markdown file** — never the
template.

### Assets

```
src/content/lessons/   45 Markdown files (frontmatter + body) — one per lesson
src/lib/diagrams.ts    ~30 hand-authored, theme-aware SVG diagrams (both modules)
src/pages/             Routes: index, module-[m]/, module-[m]/lesson-[n], reference, 404
src/layouts/           Shared page layout/chrome
src/components/        Reusable Astro components
src/styles/style.css    Design system — "drafting paper" light + "blueprint" dark themes
src/scripts/            Client-side enhance scripts: theme toggle, progress, prev/next
public/                 Static passthrough + legacy-URL redirect stubs
```

## Module 1 at a glance (30 lessons)

1. **Foundations (Lessons 1–6)** — instruments, the alphabet of lines, lettering, freehand control, geometric construction.
2. **Orthographic projection (Lessons 7–13)** — the glass box, three-view drawings, first/third angle, hidden detail, missing-view reasoning.
3. **Pictorial views (Lessons 14–19)** — isometric, isometric circles, oblique, one- and two-point perspective.
4. **Dimensioning & sections (Lessons 20–25)** — dimensioning, tolerances & fits, sections, auxiliary views, threads.
5. **Intersections & sheets (Lessons 26–30)** — intersections of solids, surface developments, assemblies & BOM, the drawing sheet, and a timed capstone.

## Module 2 at a glance (15 lessons)

1. **Value & hatching (1–4)** — the value scale, hatching that follows the form, cross-hatching, drawn vs. blended.
2. **Light & form (5–8)** — reading the light, shading the primitives, cast shadows, contact & occlusion.
3. **Colour (9–12)** — the graphite + accent system, layering coloured pencil, warm/cool temperature, selective colour.
4. **Finish & craft (13–15)** — edge control & line weight, texture & surface, and the finished plate.

## Running it

```bash
npm install
npm run dev        # dev server at http://localhost:4321
npm run build      # static site into dist/ (includes search index)
npm run preview    # serve the built site
```

## Deploy

Deployed to **Cloudflare Pages**:

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22 — set via the `.node-version` file in the repo root (or a
  `NODE_VERSION` environment variable in the Pages project settings)

There's no GitHub Pages workflow anymore; `.github/workflows/ci.yml` runs tests,
`astro check`, and a production build on every push and pull request.

## Design notes

- **No external requests.** All CSS, JS, fonts (system stack), and imagery
  (inline SVG) are local, so the site works fully offline and passes strict CSP.
- **Light & dark.** Respects your OS preference and remembers a manual override.
- **Progress is local.** Completed lessons live in `localStorage`; nothing is uploaded.
- **Accessible & responsive.** Semantic markup, reduced-motion support, and
  layouts that collapse cleanly to mobile.

## Credit

Reworked and expanded from a personal 12-week constructive-drawing study plan into
a general technical/engineering drawing curriculum.
