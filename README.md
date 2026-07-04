# Draft30 — Learn Technical Drawing in 30 Days

A free, self-contained companion **website** for learning **general technical &
engineering drawing** — reworked from a 12-week academic-art plan into a focused,
visual **30-day program**.

No build step, no dependencies, no tracking. Open `index.html` in any browser and
start drawing.

## What's inside

| Page | Purpose |
| --- | --- |
| `index.html` | Landing page — what you'll learn, the five phases, the 30-day roadmap grid, tools & routine. |
| `curriculum.html` | The full day-by-day program with objectives, warm-ups, exercises, checkpoints, per-day diagrams, and **progress tracking** (saved in your browser). |
| `reference.html` | A visual cheat-sheet: the alphabet of lines, orthographic projection, isometric, dimensioning, sections, intersections, and a glossary. |
| `PLAN.md` | The written 30-day plan in plain Markdown. |

### Assets

```
assets/
  css/style.css        Design system — "drafting paper" light + "blueprint" dark themes
  js/diagrams.js       ~20 hand-authored, theme-aware SVG technical-drawing diagrams
  js/curriculum.js     The 30-day curriculum as structured data (5 phases, 30 days)
  js/app.js            Theme toggle, progress tracking, rendering, reveal-on-scroll
```

## The 30 days at a glance

1. **Foundations (Days 1–6)** — instruments, the alphabet of lines, lettering, freehand control, geometric construction.
2. **Orthographic projection (Days 7–13)** — the glass box, three-view drawings, first/third angle, hidden detail, missing-view reasoning.
3. **Pictorial views (Days 14–19)** — isometric, isometric circles, oblique, one- and two-point perspective.
4. **Dimensioning & sections (Days 20–25)** — dimensioning, tolerances & fits, sections, auxiliary views, threads.
5. **Intersections & sheets (Days 26–30)** — intersections of solids, surface developments, assemblies & BOM, the drawing sheet, and a timed capstone.

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
