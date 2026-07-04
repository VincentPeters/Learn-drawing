# Draft30 — Design System: "The Field Manual"

The site is what it teaches: a precisely typeset workshop manual. The feel of a
well-worn field notebook crossed with a mid-century engineering handbook —
graphite ink and two pencil colours on pure white paper. Print-honest: rules,
figures, and typographic hierarchy do the work; no cards-by-default, no
shadows-as-decoration, no blueprint costume.

## Color

All colors are OKLCH, defined in `src/styles/style.css` as CSS custom
properties. Strategy: **Restrained** — two inks carry all identity.

| Token | Light ("the sheet") | Dark ("evening studio") | Role |
| --- | --- | --- | --- |
| `--paper` | `oklch(100% 0 0)` — literal white | `oklch(20% 0.006 130)` | page background |
| `--panel` | `oklch(97.4% 0.003 130)` | `oklch(23.5% 0.007 130)` | figure plates, quiet fills |
| `--ink` | `oklch(24% 0.008 130)` | `oklch(91% 0.005 130)` | body text, heavy rules |
| `--ink-2` | `oklch(40% 0.01 130)` | `oklch(75% 0.008 130)` | secondary text |
| `--ink-3` | `oklch(49% 0.012 130)` | `oklch(66% 0.01 130)` | mono meta, captions |
| `--m1` | `oklch(46% 0.105 130)` — drafting olive | `oklch(77% 0.09 130)` | Module 1, actions, links, current position |
| `--m2` | `oklch(49% 0.115 40)` — sanguine | `oklch(76% 0.085 45)` | Module 2, accents (the pencil the course teaches) |
| `--dg-blue` | `oklch(50% 0.09 250)` | `oklch(72% 0.09 250)` | **figure content only** — the blue pencil in Module 2 diagrams |
| `--rule` / `--rule-2` | hairline / medium rules | idem | borders, leaders, dividers |
| `--btn-ink` | white | near-black | text on filled primary buttons |

Rules of use:

- Completion is a **graphite tick** (ink), like checking a printed list with a
  pencil — never a third state color, never confetti.
- `--dg-blue` never appears in UI chrome; it exists because Module 2 literally
  teaches a graphite + blue + sanguine palette.
- Blueprint blue, grid-paper backgrounds, and cream/parchment tints are banned.

## Typography

Self-hosted IBM Plex (woff2 latin subsets in `public/fonts/`, ~77 KB total,
preloaded 400s, `font-display: swap`). No external requests.

- **IBM Plex Sans** 400 / 600 — body, headings, UI.
- **IBM Plex Mono** 400 / 600 — the "stamped" voice: lesson numbers (`L1·07`),
  figure captions (`Fig. 8 — …`), timers, running heads, title block, meta.

Fixed rem scale (product register): 0.6875 / 0.75 / 0.8125 / 0.875 / 0.9375 /
1 / 1.0625 / 1.25 / 1.5, with one clamp() for page h1s (max ≤ 3.1rem).
Headings 600, letter-spacing −0.015 to −0.025em, `text-wrap: balance`.
Prose measure capped ~62–70ch.

## Layout language: printed-page apparatus

- **Chapter rules**: sections open with a 2px ink rule + heading, not cards or
  eyebrow kickers.
- **Hairlines** (`--rule`) separate list entries; **double rule** (2px + 1px)
  marks the footer, like the bottom of a sheet.
- **The sheet**: the landing hero is framed like a drawing sheet with a
  mono **title block** strip (TITLE / LESSONS / SESSION / TOOLS) — an artifact
  the course itself teaches (Lesson 29). Used once, never repeated as a theme.
- **Table of contents**: lesson lists are TOC rows — mono number, title,
  dotted leader, tick — not card grids. Module maps add a second objective
  line (`.toc.detailed`).
- Cards survive only as the two module "plates" on the landing page.
- Radius is `--r: 2px` (drafting corner); shadows exist only on the search
  dialog (a lifted sheet).

## Components

`src/styles/style.css` defines: `.btn` (primary = olive fill, ghost = ink
border), `.sheet` + `.titleblock`, `.chapter`, `.manual-entry`, `.module-plate`,
`.session-steps`, `.ledger-row`, `.toc-row` (+ `done` / `next` states),
`.continue-band`, `.course-head` + `.course-progress`, `.lesson-head`
(running head), `.lesson-figure` + `.fig-cap`, `.lesson-block`,
`.lesson-checkpoint`, `.lesson-tip` (footnote style), `.big-check`,
`.lesson-nav`, `.ref-section`, `.glossary`, `.notfound`.

Diagram semantics for the 34 inline SVGs: `.ln-*` line-alphabet classes,
`.dg-lbl-*` labels, `.fill-*` — all theme-aware via tokens.

## Motion

150–250ms, `--ease` (ease-out-quint), state changes only. The one delight:
completion checks **draw themselves** (`stroke-dashoffset`, 300ms). Full
`prefers-reduced-motion` fallback collapses all animation to instant.

## Accessibility

WCAG AA: body ≥ 7:1, secondary ≥ 4.5:1, focus-visible olive outline,
semantic landmarks, keyboard ←/→ lesson nav, `aria-hidden` on decorative
SVGs, progress stays in localStorage.
