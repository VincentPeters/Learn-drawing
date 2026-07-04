/* ==========================================================================
   Draft30 — Module 2 data: Rendering, Shading & Colour
   The artisan's layer. Module 1 built precise engineering line work; this
   module adds tone, light, hatching, and the graphite + blue + sanguine
   colour system of the academic constructive-drawing tradition.
   ========================================================================== */
(function (global) {
  "use strict";

  const META = { unitLabel: "Lesson", unitShort: "LSN" };

  const PHASES = [
    { id: "value", name: "Value & Hatching", days: "1–4",
      color: "#2c5f8a",
      blurb: "Turn line into tone. Build a clean value scale and learn to hatch along the surface so the strokes describe the form." },
    { id: "light", name: "Light & Form", days: "5–8",
      color: "#b5502f",
      blurb: "Make the solids feel solid. Read one light source and place highlight, core shadow, reflected light, and cast shadow where they belong." },
    { id: "colour", name: "Colour", days: "9–12",
      color: "#3f7d54",
      blurb: "The graphite-plus-two-accents palette from your reference plate. Layer blue and sanguine over graphite to model warmth, depth, and focus." },
    { id: "craft", name: "Finish & Craft", days: "13–15",
      color: "#b58a2c",
      blurb: "The details that separate a study from a plate: edge control, texture, and a full finished composition." },
  ];

  const DAYS = [
    /* ---------------- PHASE A — VALUE & HATCHING ---------------- */
    {
      n: 1, phase: 0, title: "The value scale",
      diagram: "value-scale",
      objective: "Produce a clean, even graphite value scale from white to near-black in controlled steps.",
      warmup: ["Fill three small squares as flat, even tone — no visible gaps, no dark patches."],
      main: [
        "Draw a strip of 6 boxes. Make a value scale from white (0) to darkest (5).",
        "Do it once by pressure alone, once by stroke density alone. Compare which stays cleaner.",
        "Match a mid-grey box to a printed reference by eye, then check.",
      ],
      checkpoint: "Your steps look evenly spaced, and you can hold a flat mid-tone across a whole box.",
      tip: "Density gives you a smoother, more controllable value than pressure. Pressing hard flattens the graphite and shines; layering light strokes stays matte and even.",
    },
    {
      n: 2, phase: 0, title: "Hatching along the form",
      diagram: "hatch-form",
      objective: "Direct your strokes so the hatching itself describes the surface.",
      warmup: ["Fill a curved band with strokes that bend as the surface would."],
      main: [
        "Shade a cylinder with vertical strokes running down the wall, denser toward the shadow.",
        "Shade a cone with strokes radiating from the apex to the base.",
        "Shade a sphere with curved strokes that wrap around the form.",
      ],
      checkpoint: "A stranger could tell which solid is which from the stroke direction alone.",
      tip: "This is the heart of the style in your reference. The hatching is not just fill — its direction is part of the drawing. Let the strokes ride over the surface like water would.",
    },
    {
      n: 3, phase: 0, title: "Cross-hatching & building tone",
      diagram: "crosshatch",
      objective: "Deepen tone in controlled layers without turning it into mud.",
      warmup: ["One swatch: single layer. Add a second layer at an angle. Add a third."],
      main: [
        "Build a 5-step scale using only added cross-hatch layers.",
        "Practice keeping each layer's spacing even so the tone stays clean.",
        "Reserve the densest cross-hatching for the deepest shadows only.",
      ],
      checkpoint: "Your darks are rich but you can still see the crisp lattice of strokes.",
      tip: "Change the angle with each layer, usually by about 45°. Same-angle layers just widen the lines; crossed angles fill the gaps and read as smooth, deeper tone.",
    },
    {
      n: 4, phase: 0, title: "The drawn look vs. blending",
      diagram: "hatch-form",
      objective: "Decide when to keep visible strokes and when to smooth them.",
      warmup: ["Shade the same small sphere twice: once hatched, once blended with a stump."],
      main: [
        "Render a cylinder keeping every stroke visible (the constructive-drawing look).",
        "Render a second one blended smooth, then compare the feel of each.",
        "Try a hybrid: hatched in the light, lightly blended in the deepest core.",
      ],
      checkpoint: "You can make a deliberate choice about surface finish, not an accidental one.",
      tip: "The academic plate in your reference keeps the strokes proudly visible — that honesty is the aesthetic. Blend sparingly, if at all, and never lose the sense of the constructing hand.",
    },

    /* ---------------- PHASE B — LIGHT & FORM ---------------- */
    {
      n: 5, phase: 1, title: "Reading the light",
      diagram: "light-logic",
      objective: "Name and locate the standard zones of light and shadow on a form.",
      warmup: ["Set one desk lamp on a real ball or mug and just look for two minutes."],
      main: [
        "Draw a sphere and map all six zones: highlight, mid-tone, core shadow, reflected light, cast shadow, occlusion.",
        "Mark the terminator — the line where light turns to shadow.",
        "Do it again with the light moved to a new angle.",
      ],
      checkpoint: "You can point to each of the six zones on your drawing and on a real object.",
      tip: "The core shadow is not at the very edge of the form — reflected light lifts the rim. Beginners paint the edge darkest; that flattens the sphere into a disc.",
    },
    {
      n: 6, phase: 1, title: "Shading the primitives",
      diagram: "primitives-shaded",
      objective: "Apply the light logic correctly to each of the four basic solids.",
      warmup: ["Thumbnail the shadow shape of a cube, cylinder, cone, and sphere."],
      main: [
        "Shade all four solids under one shared light direction on a single page.",
        "Give the cylinder and cone a soft, gradual terminator; give the cube crisp plane changes.",
        "Keep the lit planes clean — restraint in the light sells the shadow.",
      ],
      checkpoint: "The four solids look lit by the same lamp, each turning to shadow in its own way.",
      tip: "Flat-planed solids (the cube) change tone suddenly at each edge. Curved solids (sphere, cylinder, cone) change gradually. Don't shade a cube like a sphere.",
    },
    {
      n: 7, phase: 1, title: "Cast shadows",
      diagram: "cast-shadow",
      objective: "Project a believable cast shadow from a single light direction.",
      warmup: ["Draw a box and guess its shadow, then check against a real lit box."],
      main: [
        "Pick a light position. Run rays from it through each top corner down to the ground.",
        "Connect where the rays land to build the shadow shape.",
        "Darken the shadow most near the object, softer as it stretches away.",
      ],
      checkpoint: "Your cast shadow is constructed from the light direction, not invented.",
      tip: "A cast shadow anchors an object to the ground. Its shape is the object's silhouette projected from the light — geometry, not guesswork.",
    },
    {
      n: 8, phase: 1, title: "Contact & occlusion",
      diagram: "light-logic",
      objective: "Use the darkest darks where forms meet to ground everything.",
      warmup: ["Find the single darkest point on a real object resting on a table."],
      main: [
        "Add occlusion shadow where each solid meets the ground — the tight, dark contact line.",
        "Where two solids touch or intersect, deepen the crevice between them.",
        "Check your value range: the contact darks should be your true blacks.",
      ],
      checkpoint: "Objects sit on the surface instead of floating above it.",
      tip: "Ambient light reaches everywhere except the tight gaps where surfaces nearly touch. Those crevices are the darkest values in the whole drawing — spend them there.",
    },

    /* ---------------- PHASE C — COLOUR ---------------- */
    {
      n: 9, phase: 2, title: "The graphite + accent system",
      diagram: "color-system",
      objective: "Understand why this tradition uses graphite plus just blue and sanguine.",
      warmup: ["Make a hatched swatch in each of the three: graphite, blue, sanguine."],
      main: [
        "Shade a sphere fully in graphite as your neutral base.",
        "Glaze cool blue into the shadow and warm sanguine near the light.",
        "Keep the colour subordinate to the graphite structure underneath.",
      ],
      checkpoint: "The colour enriches the form without hiding the constructive drawing beneath it.",
      tip: "Graphite carries the structure and value; the two accents carry temperature and life. Three materials are enough for the whole plate in your reference — restraint is the point.",
    },
    {
      n: 10, phase: 2, title: "Layering coloured pencil",
      diagram: "color-system",
      objective: "Build colour in light, controllable layers over graphite hatching.",
      warmup: ["Practice the lightest possible coloured stroke, then build to full strength in five passes."],
      main: [
        "Layer sanguine over a graphite-hatched cylinder wall, following the same stroke direction.",
        "Layer blue into its shadow side; let the two accents meet at the terminator.",
        "Resist pressing hard — colour comes from passes, not force.",
      ],
      checkpoint: "Colour sits cleanly over graphite with no waxy shine or muddy mixing.",
      tip: "Match your coloured strokes to the graphite hatching direction. Crossing them at random muddies the surface and fights the form you already built.",
    },
    {
      n: 11, phase: 2, title: "Warm & cool temperature",
      diagram: "temperature",
      objective: "Model form with temperature, not just value.",
      warmup: ["Split a form down the middle: warm one half, cool the other."],
      main: [
        "Render a solid warming toward the light (sanguine) and cooling into shadow (blue).",
        "Push warm accents on the nearest surfaces, cool on the receding ones.",
        "Keep the temperature shift subtle — a whisper, not a stripe.",
      ],
      checkpoint: "Your form gains depth from temperature even where the value barely changes.",
      tip: "Warm advances, cool recedes. A touch of sanguine on the near corner and blue in the far shadow deepens space without darkening a thing.",
    },
    {
      n: 12, phase: 2, title: "Selective colour & focus",
      diagram: "selective-color",
      objective: "Use colour to direct the eye, leaving parts of the drawing in graphite.",
      warmup: ["Decide the focal solid of a small group before touching a coloured pencil."],
      main: [
        "Compose three or four solids. Colour only the one or two you want to lead with.",
        "Leave the rest in pure graphite so the coloured ones sing.",
        "Echo a whisper of the accent elsewhere so the colour feels intentional.",
      ],
      checkpoint: "The eye goes where you sent it, and the graphite solids still hold their own.",
      tip: "Colouring everything flattens the hierarchy. Your reference plate colours some solids and leaves others graphite on purpose — that contrast is what creates a focal point.",
    },

    /* ---------------- PHASE D — FINISH & CRAFT ---------------- */
    {
      n: 13, phase: 3, title: "Edge control & line weight",
      diagram: "edges",
      objective: "Vary edge weight and softness to describe space and turn form.",
      warmup: ["Draw one cube twice: uniform lines, then weighted near-to-far."],
      main: [
        "Weight the edges of a solid: heaviest on the nearest corner, lightest as edges recede.",
        "Soften (lose) edges where a rounded form turns away from the light; crisp them where it faces you.",
        "Add the sharpest accent only at the closest point to the viewer.",
      ],
      checkpoint: "Your edges create depth on their own, before any shading.",
      tip: "Uniform outline is the beginner's tell. Lost-and-found edges — crisp where it matters, dissolving where it turns — is what makes a drawing breathe.",
    },
    {
      n: 14, phase: 3, title: "Texture & surface",
      diagram: "texture",
      objective: "Suggest material — metal, matte, wood — through stroke and contrast.",
      warmup: ["Three swatches: high-contrast metal, even matte, flowing wood grain."],
      main: [
        "Render one solid as polished metal: sharp highlight, hard reflected darks.",
        "Render one as matte: soft, even, gentle transitions.",
        "Add a wood grain or a directional texture that follows the form.",
      ],
      checkpoint: "The same solid reads as a different material in each version.",
      tip: "Material is mostly about contrast and edge. Metal has hard, jumping values and a bright hot spot; matte surfaces move slowly through their tones. Change the contrast, change the material.",
    },
    {
      n: 15, phase: 3, title: "The finished plate",
      diagram: "finished-plate",
      objective: "Bring everything together into one finished composition like your reference.",
      warmup: ["Block in the whole page lightly in 2H before committing any tone or colour."],
      main: [
        "Construct three or four intersecting solids on a ground plane (use Module 1's construction).",
        "Hatch each to the form, resolve one clear light, and add cast shadows and occlusion.",
        "Apply the accent system: colour your focal solids in blue and sanguine, leave the rest graphite. Sign it.",
      ],
      checkpoint: "A finished plate that stands next to your reference in structure, tone, and colour.",
      tip: "This is where Module 1 and Module 2 meet: engineering construction underneath, artisanal rendering on top. Draw it, then draw it again next month — it will be visibly better.",
    },
  ];

  global.MODULE2 = { META, PHASES, DAYS };
})(window);
