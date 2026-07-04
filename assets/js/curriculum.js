/* ==========================================================================
   Draft30 — Curriculum data
   The original 12-week academic-art plan, reworked into a 30-day program for
   GENERAL TECHNICAL / ENGINEERING DRAWING (drafting conventions, orthographic
   projection, pictorials, dimensioning, sections, intersections, sheet work).
   ========================================================================== */
(function (global) {
  "use strict";

  const PHASES = [
    { id: "foundations", name: "Foundations", days: "1–6",
      color: "#2c5f8a",
      blurb: "Instruments, the alphabet of lines, lettering, and basic geometric construction. This is the groundwork everything later depends on." },
    { id: "orthographic", name: "Orthographic Projection", days: "7–13",
      color: "#b5502f",
      blurb: "The main engineering skill: showing a 3-D part as aligned front, top, and side views." },
    { id: "pictorials", name: "Pictorial Views", days: "14–19",
      color: "#3f7d54",
      blurb: "Isometric, oblique, and perspective: ways to show a part in three dimensions on flat paper." },
    { id: "documentation", name: "Dimensioning & Sections", days: "20–25",
      color: "#7a4fb5",
      blurb: "Turn a shape into something a shop could actually make: dimensions, tolerances, sections, auxiliary views, and threads." },
    { id: "assemblies", name: "Intersections & Sheets", days: "26–30",
      color: "#b58a2c",
      blurb: "The harder geometry, plus a finished drawing package: intersections, developments, assemblies, and a capstone sheet." },
  ];

  const DAYS = [
    /* ---------------- PHASE 1 — FOUNDATIONS ---------------- */
    {
      n: 1, phase: 0, title: "Set up your drafting kit",
      diagram: "line-weights",
      objective: "Know your tools and produce two clean, distinct line weights by hand.",
      warmup: ["Tape down an A3 sheet square to the table edge.", "Sharpen 2H, HB, and 2B to long conical points."],
      main: [
        "Fill a strip with THICK visible-outline lines (soft 2B/HB, ~0.6 mm feel).",
        "Beside it, fill a strip with THIN lines (2H, ~0.3 mm) for dimensions and centers.",
        "Draw the same small rectangle three times, each time thickening only the visible outline against thin construction.",
      ],
      checkpoint: "You can produce a bold outline and a crisp thin line on demand, without switching to a ruler for straightness.",
      tip: "Most of what makes a drawing readable comes down to two line weights: <b>thick for the object itself, thin for everything you're saying about it.</b>",
    },
    {
      n: 2, phase: 0, title: "The alphabet of lines",
      diagram: "line-types",
      objective: "Draw and instantly recognize the seven standard line conventions.",
      warmup: ["50 ghosted straight lines between dot pairs 15 cm apart — ghost thrice, commit once."],
      main: [
        "Reproduce each line type: visible, hidden (dash), center (long-short-long), dimension/extension, cutting-plane, phantom, construction.",
        "Draw a simple stepped block and apply visible + hidden + center lines correctly.",
        "Label each line you drew with its name and typical use.",
      ],
      checkpoint: "Given any line on a real drawing, you can name it and state what it means.",
      tip: "Hidden dashes should start and stop touching the visible line, and center lines should cross right at the hole center. Getting these small things right is most of what makes a drawing look professional.",
    },
    {
      n: 3, phase: 0, title: "Technical lettering",
      diagram: "lettering",
      objective: "Write legible single-stroke gothic uppercase and numerals at a constant height.",
      warmup: ["Rule light 5 mm guide lines across half a page (2H)."],
      main: [
        "Fill lines with the alphabet A–Z in single-stroke vertical gothic capitals.",
        "Write 0–9; watch that 3, 5, 8 and 6, 9 stay unambiguous.",
        "Letter a short note: 'ALL DIMENSIONS IN MILLIMETRES · REMOVE BURRS'.",
      ],
      checkpoint: "A stranger can read your lettering instantly; heights are uniform between guide lines.",
      tip: "Engineering lettering is a drawn element, not handwriting. Consistent height and spacing matter more than personal style.",
    },
    {
      n: 4, phase: 0, title: "Freehand line & ellipse control",
      diagram: "line-control",
      objective: "Build the muscle memory the whole course depends on: confident lines and clean ellipses.",
      warmup: ["Long parallels 5 mm apart — vertical, horizontal, 45°."],
      main: [
        "Ghosted lines: 50 per set, 15–20 cm, one committed stroke each.",
        "Ellipses in boxes: fit an ellipse touching all four sides, 30 reps, varied proportions.",
        "Ellipse funnel: one long axis, ellipses of growing width, minor axis kept aligned.",
      ],
      checkpoint: "You can draw a 20 cm line straight and an ellipse with no correction strokes.",
      tip: "Almost everything you draw later (cylinders, holes, isometric circles) comes down to an ellipse, so time spent here is never wasted.",
    },
    {
      n: 5, phase: 0, title: "Geometric construction I",
      diagram: "constructions",
      objective: "Use compass-and-straightedge logic (freehand) to bisect, divide, and build perpendiculars.",
      warmup: ["Hatching swatches: a 5-step light-to-dark value scale by stroke density only."],
      main: [
        "Bisect a line and an angle using construction arcs.",
        "Erect a perpendicular from a point on and off a line.",
        "Divide a line into 7 equal parts with the inclined-line method.",
      ],
      checkpoint: "You can halve any angle and split any segment into N equal parts without measuring.",
      tip: "You'll reuse these same moves in every hexagon, gear, and bolt circle you construct later.",
    },
    {
      n: 6, phase: 0, title: "Geometric construction II — polygons & tangents",
      diagram: "constructions",
      objective: "Construct regular polygons and blend arcs smoothly into lines and circles (fillets).",
      warmup: ["10 freehand circles of varied size using the 4-arc method."],
      main: [
        "Inscribe a hexagon and a pentagon in a circle.",
        "Draw a line tangent to a circle, and an arc tangent to two lines (a fillet).",
        "Blend two circles with an external tangent arc.",
      ],
      checkpoint: "Your tangent points are exactly where curve meets line — no visible kink.",
      tip: "A tangent is smooth when the centers and the tangent point are collinear. Find that point first, then draw.",
    },

    /* ---------------- PHASE 2 — ORTHOGRAPHIC ---------------- */
    {
      n: 7, phase: 1, title: "Projection theory: the glass box",
      diagram: "glass-box",
      objective: "Understand how a 3-D object projects onto mutually perpendicular planes.",
      warmup: ["Freehand a cube and label its six faces."],
      main: [
        "Sketch the 'glass box' around a simple object; project each face outward.",
        "Unfold the box into the flat six-view layout.",
        "Identify which three views are usually enough (front, top, right).",
      ],
      checkpoint: "You can explain why the top view sits above the front, and the right view to its right.",
      tip: "Choose the FRONT view as the one showing the most shape and the fewest hidden lines. Everything else follows from it.",
    },
    {
      n: 8, phase: 1, title: "Three-view drawings",
      diagram: "three-views",
      objective: "Produce aligned front, top, and side views of an L-shaped block.",
      warmup: ["Ghosted verticals and horizontals to warm the projection reflex."],
      main: [
        "Draw the front view of an L-bracket to a chosen scale.",
        "Project the top view directly above; keep widths aligned.",
        "Project the right-side view; transfer depths with a 45° miter line.",
      ],
      checkpoint: "Every feature lines up across views when you draw a projector through it.",
      tip: "Width transfers up↔down; height transfers left↔right; depth hops the 45° miter between top and side. Depths must match.",
    },
    {
      n: 9, phase: 1, title: "First-angle vs third-angle",
      diagram: "angle-symbol",
      objective: "Read and mark both international projection conventions.",
      warmup: ["Draw both projection-symbol truncated cones from memory."],
      main: [
        "Redraw yesterday's part in third-angle (US) layout.",
        "Redraw it in first-angle (ISO/EU) layout — views flip to the far side.",
        "Add the correct projection symbol to each title block.",
      ],
      checkpoint: "You can convert a drawing between first- and third-angle and pick the right symbol.",
      tip: "Third angle: the view sits on the same side you're looking from. First angle: the object throws its view to the opposite side. The symbol in the title block tells the reader which convention you used.",
    },
    {
      n: 10, phase: 1, title: "Hidden detail & center lines",
      diagram: "three-views",
      objective: "Represent interior and unseen features correctly across all views.",
      warmup: ["Practice clean dashed hidden lines with even gaps."],
      main: [
        "Add a blind hole and a slot to your block; show them as hidden lines in the appropriate views.",
        "Add center lines through every hole and cylindrical feature.",
        "Resolve line precedence where visible, hidden, and center lines overlap.",
      ],
      checkpoint: "Hidden and center lines are placed by rule, and overlaps follow visible > hidden > center precedence.",
      tip: "When lines coincide, the more important one wins: a visible line always overrides a hidden one at the same spot.",
    },
    {
      n: 11, phase: 1, title: "Missing-view reasoning",
      diagram: "three-views",
      objective: "Reconstruct a third view from two given views — the classic exam skill.",
      warmup: ["Read three worked two-view puzzles and predict the third before revealing it."],
      main: [
        "Given front + top, draw the correct right-side view (3 puzzles).",
        "Given front + right, draw the top view (2 puzzles).",
        "Invent your own two-view puzzle and solve it.",
      ],
      checkpoint: "You can infer an unseen view without building the object physically.",
      tip: "Track one surface at a time across the views. A rectangle in one view is an edge (a line) in another — follow it.",
    },
    {
      n: 12, phase: 1, title: "Sketch real objects to orthographic",
      diagram: "glass-box",
      objective: "Measure a real part and translate it into a proportioned three-view sketch.",
      warmup: ["Estimate the proportions of three desk objects by eye, then check with a ruler."],
      main: [
        "Pick a real object (bracket, connector, tool). Measure key dimensions.",
        "Sketch its three views freehand, proportioned, on a grid.",
        "Note where you'd need a section or auxiliary view later.",
      ],
      checkpoint: "Your sketch's proportions match the real object within ~10%.",
      tip: "Ruler for checking proportion, never for drawing the lines. Trust the freehand control you built in week one.",
    },
    {
      n: 13, phase: 1, title: "Orthographic review sheet",
      diagram: "three-views",
      objective: "Consolidate projection into one clean, correctly-lined multiview drawing.",
      warmup: ["Warm up lines and dashes; set up a bordered sheet."],
      main: [
        "Choose a moderately complex part (stepped, one hole, one slot).",
        "Lay out three views with correct alignment, hidden lines, and center lines.",
        "Line-weight the finished drawing: thick outlines, thin the rest.",
      ],
      checkpoint: "One presentation-quality three-view drawing with correct conventions throughout.",
      tip: "This sheet is your Phase-2 milestone. Keep it — you'll dimension and section this same part later.",
    },

    /* ---------------- PHASE 3 — PICTORIALS ---------------- */
    {
      n: 14, phase: 2, title: "Isometric fundamentals",
      diagram: "isometric-axes",
      objective: "Build objects on the 30°/30°/vertical isometric axes at true length.",
      warmup: ["Draw the isometric axis rose and a unit cube ten times."],
      main: [
        "Convert a rectangular block from your three-view drawing into isometric.",
        "Use the box method: enclose the object, then carve away.",
        "Keep all vertical edges vertical; all others at 30°.",
      ],
      checkpoint: "You can turn a multiview block into a correct isometric without a template.",
      tip: "Isometric lines are true length; non-isometric (sloped) lines are not — locate their endpoints on the box and connect.",
    },
    {
      n: 15, phase: 2, title: "Isometric circles & cylinders",
      diagram: "iso-ellipse",
      objective: "Draw holes and round features as correctly oriented isometric ellipses.",
      warmup: ["Freehand the four-center approximate ellipse on all three iso faces."],
      main: [
        "Draw an isometric cylinder standing and lying down.",
        "Place a hole on each of the three visible faces, oriented correctly.",
        "Add a fillet/round to one corner in isometric.",
      ],
      checkpoint: "Your isometric ellipses sit on the right axis for the face they're on.",
      tip: "The minor axis of an isometric ellipse always points along the surface normal — perpendicular to the face it lies on.",
    },
    {
      n: 16, phase: 2, title: "Oblique projection",
      diagram: "oblique",
      objective: "Use cavalier/cabinet oblique to keep one face true-shape.",
      warmup: ["Sketch a cube in cavalier (full depth) and cabinet (half depth) oblique."],
      main: [
        "Draw a part with a complex front face in oblique, front face true-shape.",
        "Compare cavalier vs cabinet depth on the same part.",
        "Note when oblique beats isometric (dominant circular front face).",
      ],
      checkpoint: "You can pick oblique when a part has one busy face worth drawing undistorted.",
      tip: "Cabinet oblique halves the depth to fight the 'too deep' illusion. Put circles on the front face where they stay true circles.",
    },
    {
      n: 17, phase: 2, title: "One-point perspective",
      diagram: "one-point",
      objective: "Add a horizon and single vanishing point for realistic depth.",
      warmup: ["Draw a horizon, one VP, and a grid of receding squares."],
      main: [
        "Draw a rectangular part in one-point perspective.",
        "Vary eye level (above/at/below the object) and observe the change.",
        "Add a second, smaller part sharing the same VP.",
      ],
      checkpoint: "All depth edges of your objects meet at exactly one point on the horizon.",
      tip: "Perspective isn't an engineering standard, but it trains your eye for the pictorial sense that makes iso drawings believable.",
    },
    {
      n: 18, phase: 2, title: "Two-point perspective",
      diagram: "two-point",
      objective: "Draw a part rotated to the viewer with two vanishing points.",
      warmup: ["Two VPs wide apart; draw a cube between them."],
      main: [
        "Draw your L-bracket in two-point perspective.",
        "Stack a second block on top, edges converging to the same two VPs.",
        "Keep verticals truly vertical.",
      ],
      checkpoint: "Two edge families each converge to their own VP; nothing bows.",
      tip: "Put the vanishing points as far apart as the paper allows — close VPs create the fish-eye distortion beginners hate.",
    },
    {
      n: 19, phase: 2, title: "Pictorial review sheet",
      diagram: "isometric-axes",
      objective: "Present one part in three pictorial systems side by side.",
      warmup: ["Set up a bordered sheet divided into three panels."],
      main: [
        "Take one part; draw it isometric, oblique, and two-point perspective.",
        "Label the advantages and distortions of each.",
        "Line-weight all three for presentation.",
      ],
      checkpoint: "You can choose the right pictorial for a given communication goal.",
      tip: "Isometric for measurable clarity, oblique for a true-shape face, perspective for a client-facing 'how it looks'.",
    },

    /* ---------------- PHASE 4 — DIMENSIONING & SECTIONS ---------------- */
    {
      n: 20, phase: 3, title: "Dimensioning fundamentals",
      diagram: "dimensioning",
      objective: "Fully dimension a part so it can be built without guessing.",
      warmup: ["Draw extension lines, dimension lines, and neat arrowheads."],
      main: [
        "Dimension your Phase-2 review part: sizes then locations.",
        "Use ⌀ for diameters, R for radii, and place holes by center.",
        "Keep dimensions off the view, never inside it; avoid duplicates.",
      ],
      checkpoint: "A machinist could build the part from your drawing alone — every feature is sized and located once.",
      tip: "Dimension the feature where it appears as its true shape. Group related dimensions; leave a gap (~10 mm) from the outline.",
    },
    {
      n: 21, phase: 3, title: "Tolerances & fits",
      diagram: "dimensioning",
      objective: "Communicate acceptable variation with limits, fits, and a first taste of GD&T.",
      warmup: ["Write the same dimension three ways: limit, plus/minus, and basic."],
      main: [
        "Apply a plus/minus tolerance and a limit dimension to a hole and shaft.",
        "Choose a clearance vs interference fit for a pin in a hole.",
        "Add one geometric callout (e.g. flatness or position) with a feature control frame.",
      ],
      checkpoint: "You can state how much a dimension may vary and why the fit type matters.",
      tip: "Tolerance is money: tighter costs more. Specify the loosest tolerance the function will tolerate.",
    },
    {
      n: 22, phase: 3, title: "Section views",
      diagram: "section-view",
      objective: "Reveal interior features by cutting the part and hatching solid material.",
      warmup: ["Practice even 45° section-lining (hatching) at consistent spacing."],
      main: [
        "Add a cutting-plane line to a top view; project a full section.",
        "Hatch only the material the plane passes through.",
        "Omit hidden lines in the section unless needed for clarity.",
      ],
      checkpoint: "Your section shows the inside clearly, with correct cutting-plane and hatch conventions.",
      tip: "Hatch lines run at 45°, evenly spaced, and change direction/spacing for different parts in an assembly section.",
    },
    {
      n: 23, phase: 3, title: "Section types",
      diagram: "section-view",
      objective: "Choose among full, half, offset, broken-out, and revolved sections.",
      warmup: ["Sketch each section type as a thumbnail."],
      main: [
        "Draw a half section of a symmetric part (half outside, half cut).",
        "Draw an offset section stepping the cutting plane through two features.",
        "Add a broken-out section to expose one local detail.",
      ],
      checkpoint: "You can pick the least-cluttered section that still shows the needed interior.",
      tip: "Never cut through ribs, webs, bolts, or shafts lengthwise — leave them un-hatched to avoid a misleading solid look.",
    },
    {
      n: 24, phase: 3, title: "Auxiliary views",
      diagram: "auxiliary",
      objective: "Show the true shape of an inclined surface with a projected auxiliary view.",
      warmup: ["Draw a fold line and project a point across it at true distance."],
      main: [
        "Draw a part with a slanted face foreshortened in the standard views.",
        "Set a fold line parallel to the inclined edge; project the auxiliary view.",
        "Transfer depths from the related view to recover the true shape.",
      ],
      checkpoint: "The slanted face appears at true size and shape in your auxiliary view.",
      tip: "An inclined surface is never true-shape in a principal view. The auxiliary view looks straight at it — that's its whole job.",
    },
    {
      n: 25, phase: 3, title: "Threads, fasteners & conventions",
      diagram: "threads",
      objective: "Use standard shorthand for threads and common machine features.",
      warmup: ["Draw the schematic thread convention for a bolt and a tapped hole."],
      main: [
        "Represent an external thread and a tapped hole with simplified convention.",
        "Add a counterbore and a countersink with correct callouts.",
        "Write a thread note (e.g. M10 × 1.5) and a hole callout.",
      ],
      checkpoint: "You can note a threaded hole so a shop knows exactly which tap to use.",
      tip: "Nobody draws every thread crest. Learn the simplified convention and the note — that's what the shop actually reads.",
    },

    /* ---------------- PHASE 5 — INTERSECTIONS & SHEETS ---------------- */
    {
      n: 26, phase: 4, title: "Intersections of solids",
      diagram: "intersection",
      objective: "Plot the curve where two solids meet, point by point.",
      warmup: ["Draw a cylinder and a prism transparent, with all construction lines."],
      main: [
        "Cylinder piercing a prism: slice both with shared cutting planes.",
        "Mark where section contours cross — each crossing is one curve point.",
        "Join the points into a smooth intersection curve; darken visible edges.",
      ],
      checkpoint: "Your intersection curve is constructed from plotted points, not guessed.",
      tip: "More cutting planes near tight curvature = a smoother, truer curve. This is the technique behind pipe joints and cast transitions.",
    },
    {
      n: 27, phase: 4, title: "Surface developments (flat patterns)",
      diagram: "development",
      objective: "Unfold a 3-D surface into the flat pattern a sheet-metal shop would cut.",
      warmup: ["Divide a circle into 12 equal parts for stepping off a girth."],
      main: [
        "Develop the lateral surface of a cylinder: length = π·D.",
        "Develop a cone as a sector; find the true slant length first.",
        "Develop a truncated form using true lengths of each edge.",
      ],
      checkpoint: "Your flat pattern would fold back up into the original solid.",
      tip: "You can only step off TRUE lengths. Any edge not parallel to the picture plane must be rotated to true length first.",
    },
    {
      n: 28, phase: 4, title: "Assembly drawings & BOM",
      diagram: "assembly",
      objective: "Show how parts fit together and list them.",
      warmup: ["Draw three simple parts stacked on a shared centerline."],
      main: [
        "Draw an exploded assembly of 3–4 parts on center.",
        "Add item balloons with leader lines to each part.",
        "Build a parts list / bill of materials keyed to the balloon numbers.",
      ],
      checkpoint: "Someone could identify and order every part from your assembly + BOM.",
      tip: "The assembly shows relationships, not manufacturing detail. Dimensions here are only what's needed to assemble.",
    },
    {
      n: 29, phase: 4, title: "The drawing sheet: borders, title block, scale",
      diagram: "title-block",
      objective: "Package a drawing to professional standard.",
      warmup: ["Rule a sheet border and zone markings."],
      main: [
        "Lay out an A3 border with zone letters/numbers.",
        "Draw a title block: title, scale, material, drawn-by, sheet, projection symbol.",
        "Choose and state a proper scale (1:1, 1:2, 2:1) and apply it consistently.",
      ],
      checkpoint: "Your sheet has a complete, correctly filled title block and a stated scale.",
      tip: "Scale changes the drawing, never the dimensions: a 1:2 part is drawn half-size but dimensioned at full real value.",
    },
    {
      n: 30, phase: 4, title: "Capstone: a complete detail drawing",
      diagram: "composition",
      objective: "Produce one finished, fully specified engineering drawing — timed.",
      warmup: ["Block in the whole sheet lightly in 2H before committing any line."],
      main: [
        "Pick a real part. Draw the necessary orthographic views + one section.",
        "Add an isometric pictorial in a corner for clarity.",
        "Fully dimension and tolerance it; complete the title block. Target: one sheet in 3 hours.",
      ],
      checkpoint: "A standalone drawing another person could manufacture from, unaided — your Draft30 milestone.",
      tip: "Real jobs and entrance exams both run on a clock like this. Block in lightly first, commit your line weights last, and then do the whole thing again next week. Repetition is what turns it into a skill.",
    },
  ];

  global.CURRICULUM = { PHASES, DAYS };
})(window);
