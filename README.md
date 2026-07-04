# Draft30 — Learn Technical Drawing in 30 Days

A free, self-contained companion **website** for learning **general technical and
engineering drawing**. It reworks a 12-week academic-art plan into a **30-day
program** you can actually keep up with.

No build step, no dependencies, no tracking. Open `index.html` in any browser and
start drawing.

## What's inside

The course is in **two modules**:

- **Module 1 — Technical Drawing** (30 days): the precise, correct line work that describes a real part.
- **Module 2 — Rendering & Colour** (15 lessons): the tone, hatching, light, and graphite-plus-blue-and-sanguine colour that turn a drawing into a finished plate.

| Page | Purpose |
| --- | --- |
| `index.html` | Landing page — the two modules, the five phases, the 30-day roadmap grid, tools & routine. |
| `curriculum.html` | **Module 1**: the full day-by-day program with objectives, warm-ups, exercises, checkpoints, per-day diagrams, and **progress tracking** (saved in your browser). |
| `module2.html` | **Module 2**: 15 rendering & colour lessons, same daily format, with its own separate progress. |
| `reference.html` | A visual cheat-sheet for both modules: line alphabet, orthographic, isometric, dimensioning, sections, plus value, light, and colour — and a glossary. |
| `PLAN.md` | The written plan for both modules in plain Markdown. |

### Assets

```
assets/
  css/style.css        Design system — "drafting paper" light + "blueprint" dark themes
  js/diagrams.js       ~30 hand-authored, theme-aware SVG diagrams (both modules)
  js/curriculum.js     Module 1 data — 5 phases, 30 days
  js/module2.js        Module 2 data — 4 phases, 15 lessons
  js/app.js            Theme, per-module progress tracking, rendering, reveal-on-scroll
```

## Module 1 at a glance (30 days)

1. **Foundations (Days 1–6)** — instruments, the alphabet of lines, lettering, freehand control, geometric construction.
2. **Orthographic projection (Days 7–13)** — the glass box, three-view drawings, first/third angle, hidden detail, missing-view reasoning.
3. **Pictorial views (Days 14–19)** — isometric, isometric circles, oblique, one- and two-point perspective.
4. **Dimensioning & sections (Days 20–25)** — dimensioning, tolerances & fits, sections, auxiliary views, threads.
5. **Intersections & sheets (Days 26–30)** — intersections of solids, surface developments, assemblies & BOM, the drawing sheet, and a timed capstone.

## Module 2 at a glance (15 lessons)

1. **Value & hatching (1–4)** — the value scale, hatching that follows the form, cross-hatching, drawn vs. blended.
2. **Light & form (5–8)** — reading the light, shading the primitives, cast shadows, contact & occlusion.
3. **Colour (9–12)** — the graphite + accent system, layering coloured pencil, warm/cool temperature, selective colour.
4. **Finish & craft (13–15)** — edge control & line weight, texture & surface, and the finished plate.

## Running it

It's a static site — just open `index.html`. To serve locally (nicer for
navigation and caching):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Design notes

- **No external requests.** All CSS, JS, fonts (system stack), and imagery
  (inline SVG) are local, so the site works fully offline and passes strict CSP.
- **Light & dark.** Respects your OS preference and remembers a manual override.
- **Progress is local.** Completed days live in `localStorage`; nothing is uploaded.
- **Accessible & responsive.** Semantic markup, reduced-motion support, and
  layouts that collapse cleanly to mobile.

## Credit

Reworked and expanded from a personal 12-week constructive-drawing study plan into
a general technical/engineering drawing curriculum.
