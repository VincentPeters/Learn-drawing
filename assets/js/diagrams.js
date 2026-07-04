/* ==========================================================================
   Draft30 — SVG diagram library
   Hand-authored, theme-aware technical drawing illustrations.
   Every diagram is a self-contained inline SVG string keyed by id.
   Stroke/fill come from semantic classes in style.css so they follow the theme.
   ========================================================================== */
(function (global) {
  "use strict";

  // Small helpers ----------------------------------------------------------
  const svg = (vb, inner, cls) =>
    `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" class="dg ${cls || ""}" role="img">${inner}</svg>`;

  // Arrowhead marker defs (dimension arrows)
  const DEFS = `
    <defs>
      <marker id="arrL" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M8,0 L8,6 L0,3 Z" class="fill-soft"/>
      </marker>
      <marker id="arrR" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L8,3 Z" class="fill-soft"/>
      </marker>
      <marker id="dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
        <circle cx="3" cy="3" r="2.2" class="fill-blue"/>
      </marker>
    </defs>`;

  const D = {};

  /* ---- Line conventions (alphabet of lines) ---------------------------- */
  D["line-types"] = svg("0 0 440 250", `
    ${[
      ["Visible / object", "ln-visible", 34],
      ["Hidden", "ln-hidden", 66],
      ["Center", "ln-center", 98],
      ["Dimension / extension", "ln-dim", 130],
      ["Cutting plane", "ln-cut", 162],
      ["Phantom", "ln-phantom", 194],
      ["Construction", "ln-constr", 226],
    ].map(([label, cls, y]) => `
      <line x1="150" y1="${y}" x2="410" y2="${y}" class="${cls}"/>
      <text x="14" y="${y + 4}" class="dg-lbl-ink">${label}</text>
    `).join("")}
    <text x="14" y="16" class="dg-lbl-blue">THE ALPHABET OF LINES</text>
  `);

  /* ---- Line weight comparison ------------------------------------------ */
  D["line-weights"] = svg("0 0 380 190", `
    <rect x="60" y="40" width="120" height="110" class="ln-visible fill-none"/>
    <text x="60" y="172" class="dg-lbl">thick 0.5–0.7mm · outlines</text>
    <line x1="240" y1="40" x2="360" y2="40" class="ln-thin"/>
    <line x1="240" y1="70" x2="360" y2="70" class="ln-thin"/>
    <line x1="240" y1="100" x2="360" y2="100" class="ln-thin"/>
    <line x1="240" y1="150" x2="240" y2="40" class="ln-dim" marker-start="url(#arrR)" marker-end="url(#arrL)"/>
    <text x="248" y="130" class="dg-lbl">thin 0.25–0.35mm</text>
    <text x="248" y="145" class="dg-lbl">dims · hatching · centers</text>
    ${DEFS}
  `);

  /* ---- Technical lettering guide --------------------------------------- */
  D["lettering"] = svg("0 0 400 170", `
    ${[30, 55, 105, 130].map(y => `<line x1="20" y1="${y}" x2="380" y2="${y}" class="ln-thin" opacity=".5"/>`).join("")}
    <line x1="20" y1="80" x2="380" y2="80" class="ln-center"/>
    <text x="24" y="52" style="font-size:34px;font-weight:700;letter-spacing:3px" class="fill-ink t-mono">ABCDE</text>
    <text x="24" y="127" style="font-size:34px;font-weight:700;letter-spacing:3px" class="fill-ink t-mono">12345</text>
    <text x="300" y="45" class="dg-lbl-accent">cap line</text>
    <text x="300" y="118" class="dg-lbl-accent">base line</text>
    <text x="20" y="160" class="dg-lbl-blue">Single-stroke gothic · uppercase · vertical</text>
  `);

  /* ---- Geometric construction: bisect + hexagon ------------------------ */
  D["constructions"] = svg("0 0 400 220", `
    <!-- angle bisection -->
    <path d="M40,180 L40,50" class="ln-visible"/>
    <path d="M40,180 L165,120" class="ln-visible"/>
    <path d="M40,180 m0,-70 a70,70 0 0 1 66,-24" class="ln-constr"/>
    <circle cx="40" cy="110" r="2.4" class="fill-blue"/>
    <circle cx="106" cy="86" r="2.4" class="fill-blue"/>
    <path d="M40,110 A46,46 0 0 1 78,64" class="ln-constr"/>
    <path d="M106,86 A46,46 0 0 0 78,64" class="ln-constr"/>
    <path d="M40,180 L92,92" class="ln-accent"/>
    <text x="18" y="205" class="dg-lbl">bisect an angle</text>
    <!-- hexagon in circle -->
    <circle cx="300" cy="110" r="70" class="ln-constr fill-none"/>
    <polygon points="370,110 335,171 265,171 230,110 265,49 335,49" class="ln-visible fill-none"/>
    <line x1="230" y1="110" x2="370" y2="110" class="ln-center"/>
    <line x1="300" y1="40" x2="300" y2="180" class="ln-center"/>
    ${[0, 60, 120, 180, 240, 300].map(a => {
      const r = a * Math.PI / 180;
      return `<circle cx="${(300 + 70 * Math.cos(r)).toFixed(1)}" cy="${(110 + 70 * Math.sin(r)).toFixed(1)}" r="2.4" class="fill-blue"/>`;
    }).join("")}
    <text x="252" y="205" class="dg-lbl">hexagon in a circle</text>
  `);

  /* ---- Orthographic "glass box" unfolding ------------------------------ */
  D["glass-box"] = svg("0 0 420 300", `
    <!-- object (iso) -->
    <g transform="translate(150,120)">
      <path d="M0,0 L60,0 L60,-34 L36,-34 L36,-52 L0,-52 Z" class="ln-visible fill-paper"/>
      <path d="M0,0 L22,-14 L82,-14 L60,0 Z" class="ln-visible fill-paper" opacity=".9"/>
      <path d="M60,0 L82,-14 L82,-48 L60,-34 Z" class="ln-visible fill-paper" opacity=".8"/>
      <path d="M36,-52 L58,-66 L82,-66 L82,-48 L60,-34 L36,-34Z" class="ln-visible fill-paper" opacity=".8"/>
    </g>
    <text x="150" y="150" class="dg-lbl">3-D part</text>
    <!-- projection planes as folded frames -->
    <rect x="40" y="40" width="80" height="70" class="ln-constr fill-none"/>
    <text x="52" y="34" class="dg-lbl-blue">TOP</text>
    <rect x="40" y="170" width="80" height="70" class="ln-constr fill-none"/>
    <text x="46" y="262" class="dg-lbl-blue">FRONT</text>
    <rect x="280" y="170" width="80" height="70" class="ln-constr fill-none"/>
    <text x="286" y="262" class="dg-lbl-blue">RIGHT SIDE</text>
    <path d="M120,205 L280,205" class="ln-constr" marker-end="url(#arrL)"/>
    <path d="M80,110 L80,170" class="ln-constr" marker-end="url(#arrL)"/>
    <text x="150" y="230" class="dg-lbl-accent">unfold the box → flat views</text>
    ${DEFS}
  `);

  /* ---- Three-view orthographic of an L-bracket ------------------------- */
  D["three-views"] = svg("0 0 380 360", `
    <!-- FRONT view (bottom-left) -->
    <g>
      <path d="M60,300 L160,300 L160,250 L110,250 L110,200 L60,200 Z" class="ln-visible fill-none"/>
      <text x="90" y="330" class="dg-lbl-blue">FRONT</text>
    </g>
    <!-- TOP view (above front) -->
    <g>
      <rect x="60" y="90" width="100" height="60" class="ln-visible fill-none"/>
      <line x1="110" y1="90" x2="110" y2="150" class="ln-hidden"/>
      <text x="95" y="78" class="dg-lbl-blue">TOP</text>
    </g>
    <!-- RIGHT side view (right of front) -->
    <g>
      <path d="M240,300 L300,300 L300,200 L280,200 L280,250 L240,250 Z" class="ln-visible fill-none"/>
      <text x="252" y="330" class="dg-lbl-blue">RIGHT</text>
    </g>
    <!-- projection alignment lines -->
    <line x1="60" y1="150" x2="60" y2="200" class="ln-constr"/>
    <line x1="160" y1="150" x2="160" y2="200" class="ln-constr"/>
    <line x1="160" y1="250" x2="240" y2="250" class="ln-constr"/>
    <line x1="160" y1="300" x2="240" y2="300" class="ln-constr"/>
    <!-- 45 miter line -->
    <path d="M175,215 L315,75" class="ln-center"/>
    <text x="300" y="70" class="dg-lbl-accent">45° miter</text>
    <text x="16" y="24" class="dg-lbl">Third-angle · views aligned by projection</text>
  `);

  /* ---- First vs third angle symbols ------------------------------------ */
  D["angle-symbol"] = svg("0 0 400 180", `
    <!-- third angle symbol -->
    <g transform="translate(30,40)">
      <ellipse cx="30" cy="45" rx="30" ry="26" class="ln-visible fill-none"/>
      <ellipse cx="30" cy="45" rx="12" ry="10" class="ln-visible fill-none"/>
      <path d="M110,20 L140,45 L110,70 L110,45 L110,20 Z" class="ln-visible fill-none"/>
      <line x1="110" y1="45" x2="140" y2="45" class="ln-visible"/>
      <text x="8" y="105" class="dg-lbl-blue">THIRD ANGLE (ISO US)</text>
    </g>
    <line x1="200" y1="30" x2="200" y2="150" class="ln-thin" opacity=".5"/>
    <!-- first angle symbol -->
    <g transform="translate(230,40)">
      <path d="M0,20 L30,45 L0,70 L0,45 L0,20 Z" class="ln-visible fill-none"/>
      <line x1="0" y1="45" x2="30" y2="45" class="ln-visible"/>
      <ellipse cx="110" cy="45" rx="30" ry="26" class="ln-visible fill-none"/>
      <ellipse cx="110" cy="45" rx="12" ry="10" class="ln-visible fill-none"/>
      <text x="8" y="105" class="dg-lbl-blue">FIRST ANGLE (EU ISO)</text>
    </g>
  `);

  /* ---- Isometric axes + cube ------------------------------------------- */
  D["isometric-axes"] = svg("0 0 360 280", `
    <!-- axis rose -->
    <line x1="70" y1="150" x2="70" y2="60" class="ln-accent"/>
    <line x1="70" y1="150" x2="148" y2="195" class="ln-accent"/>
    <line x1="70" y1="150" x2="-8" y2="195" class="ln-accent"/>
    <text x="60" y="52" class="dg-lbl-accent">Z</text>
    <text x="150" y="200" class="dg-lbl-accent">30°</text>
    <text x="4" y="200" class="dg-lbl-accent">30°</text>
    <path d="M70,150 m0,-40 a40,40 0 0 1 20,11" class="ln-constr"/>
    <!-- iso cube -->
    <g transform="translate(250,60)">
      <polygon points="0,40 60,5 120,40 60,75" class="ln-visible fill-paper"/>
      <polygon points="0,40 0,120 60,155 60,75" class="ln-visible fill-paper" opacity=".85"/>
      <polygon points="120,40 120,120 60,155 60,75" class="ln-visible fill-paper" opacity=".7"/>
      <line x1="60" y1="155" x2="60" y2="215" class="ln-hidden"/>
    </g>
    <text x="60" y="255" class="dg-lbl">true lengths along all three axes</text>
  `);

  /* ---- Isometric circles (ellipses on 3 faces) ------------------------- */
  D["iso-ellipse"] = svg("0 0 360 240", `
    <g transform="translate(180,110)">
      <polygon points="0,40 60,5 120,40 60,75" class="ln-thin fill-none"/>
      <polygon points="0,40 0,120 60,155 60,75" class="ln-thin fill-none"/>
      <polygon points="120,40 120,120 60,155 60,75" class="ln-thin fill-none"/>
      <ellipse cx="60" cy="40" rx="52" ry="30" transform="rotate(0 60 40)" class="ln-accent fill-none"/>
      <ellipse cx="30" cy="97" rx="30" ry="52" transform="rotate(30 30 97)" class="ln-blue fill-none" style="stroke-width:2"/>
      <ellipse cx="90" cy="97" rx="30" ry="52" transform="rotate(-30 90 97)" class="ln-blue fill-none" style="stroke-width:2"/>
    </g>
    <text x="16" y="24" class="dg-lbl">A circle becomes a 35°16′ ellipse on each iso face</text>
    <text x="16" y="220" class="dg-lbl-accent">minor axis always points along the surface normal</text>
  `);

  /* ---- Oblique projection ---------------------------------------------- */
  D["oblique"] = svg("0 0 340 220", `
    <g transform="translate(60,50)">
      <rect x="0" y="20" width="110" height="90" class="ln-visible fill-paper"/>
      <line x1="0" y1="20" x2="45" y2="-15" class="ln-visible"/>
      <line x1="110" y1="20" x2="155" y2="-15" class="ln-visible"/>
      <line x1="110" y1="110" x2="155" y2="75" class="ln-visible"/>
      <line x1="45" y1="-15" x2="155" y2="-15" class="ln-visible"/>
      <line x1="155" y1="-15" x2="155" y2="75" class="ln-visible"/>
      <line x1="45" y1="-15" x2="45" y2="8" class="ln-hidden"/>
    </g>
    <text x="70" y="185" class="dg-lbl">front face true shape · depth at 45° (½ scale = cabinet)</text>
  `);

  /* ---- One-point perspective ------------------------------------------- */
  D["one-point"] = svg("0 0 380 240", `
    <line x1="0" y1="90" x2="380" y2="90" class="ln-blue"/>
    <circle cx="250" cy="90" r="3.5" class="fill-accent"/>
    <text x="258" y="86" class="dg-lbl-accent">VP</text>
    <text x="10" y="84" class="dg-lbl-blue">horizon</text>
    <rect x="70" y="110" width="90" height="70" class="ln-visible fill-none"/>
    <line x1="70" y1="110" x2="250" y2="90" class="ln-constr"/>
    <line x1="160" y1="110" x2="250" y2="90" class="ln-constr"/>
    <line x1="160" y1="180" x2="250" y2="90" class="ln-constr"/>
    <line x1="70" y1="180" x2="250" y2="90" class="ln-constr"/>
    <path d="M132,124 L188,101 L188,150 L132,168 Z" class="ln-visible fill-paper" opacity=".6"/>
    <text x="14" y="222" class="dg-lbl">all depth edges converge to one vanishing point</text>
  `);

  /* ---- Two-point perspective ------------------------------------------- */
  D["two-point"] = svg("0 0 400 240", `
    <line x1="0" y1="80" x2="400" y2="80" class="ln-blue"/>
    <circle cx="20" cy="80" r="3.5" class="fill-accent"/>
    <circle cx="380" cy="80" r="3.5" class="fill-accent"/>
    <text x="24" y="74" class="dg-lbl-accent">VPL</text>
    <text x="356" y="74" class="dg-lbl-accent">VPR</text>
    <line x1="200" y1="60" x2="200" y2="190" class="ln-visible"/>
    <line x1="20" y1="80" x2="200" y2="60" class="ln-constr"/>
    <line x1="20" y1="80" x2="200" y2="190" class="ln-constr"/>
    <line x1="380" y1="80" x2="200" y2="60" class="ln-constr"/>
    <line x1="380" y1="80" x2="200" y2="190" class="ln-constr"/>
    <line x1="128" y1="72" x2="128" y2="168" class="ln-visible"/>
    <line x1="270" y1="70" x2="270" y2="160" class="ln-visible"/>
    <line x1="20" y1="80" x2="270" y2="70" class="ln-constr" opacity=".5"/>
    <line x1="380" y1="80" x2="128" y2="72" class="ln-constr" opacity=".5"/>
    <text x="14" y="222" class="dg-lbl">two sets of edges, two vanishing points on the horizon</text>
  `);

  /* ---- Dimensioning a plate -------------------------------------------- */
  D["dimensioning"] = svg("0 0 400 240", `
    <rect x="70" y="60" width="200" height="110" class="ln-visible fill-none"/>
    <circle cx="120" cy="115" r="18" class="ln-visible fill-none"/>
    <line x1="120" y1="115" x2="120" y2="115" class="ln-center"/>
    <line x1="102" y1="115" x2="138" y2="115" class="ln-center"/>
    <line x1="120" y1="97" x2="120" y2="133" class="ln-center"/>
    <!-- horizontal dim -->
    <line x1="70" y1="170" x2="70" y2="205" class="ln-dim"/>
    <line x1="270" y1="170" x2="270" y2="205" class="ln-dim"/>
    <line x1="70" y1="198" x2="270" y2="198" class="ln-dim" marker-start="url(#arrR)" marker-end="url(#arrL)"/>
    <rect x="158" y="190" width="24" height="16" class="fill-paper"/>
    <text x="160" y="202" class="dg-lbl-ink">100</text>
    <!-- vertical dim -->
    <line x1="270" y1="60" x2="305" y2="60" class="ln-dim"/>
    <line x1="270" y1="170" x2="305" y2="170" class="ln-dim"/>
    <line x1="298" y1="60" x2="298" y2="170" class="ln-dim" marker-start="url(#arrR)" marker-end="url(#arrL)"/>
    <rect x="288" y="107" width="22" height="16" class="fill-paper"/>
    <text x="290" y="119" class="dg-lbl-ink">55</text>
    <!-- diameter leader -->
    <line x1="133" y1="103" x2="180" y2="70" class="ln-dim" marker-start="url(#arrR)"/>
    <text x="182" y="70" class="dg-lbl-ink">⌀36</text>
    <text x="16" y="24" class="dg-lbl">extension + dimension lines · arrowheads · text</text>
    ${DEFS}
  `);

  /* ---- Section view + cutting plane + hatch ---------------------------- */
  D["section-view"] = svg("0 0 400 250", `
    <!-- top view with cutting plane -->
    <rect x="50" y="40" width="110" height="70" class="ln-visible fill-none"/>
    <circle cx="105" cy="75" r="20" class="ln-visible fill-none"/>
    <line x1="30" y1="75" x2="180" y2="75" class="ln-cut"/>
    <text x="26" y="70" class="dg-lbl-accent">A</text>
    <text x="182" y="70" class="dg-lbl-accent">A</text>
    <path d="M30,75 l8,-8 M180,75 l-8,-8" class="ln-cut"/>
    <!-- section view with hatching -->
    <g transform="translate(230,40)">
      <path d="M0,0 L110,0 L110,70 L0,70 Z" class="ln-visible fill-none"/>
      <line x1="35" y1="0" x2="35" y2="70" class="ln-visible"/>
      <line x1="75" y1="0" x2="75" y2="70" class="ln-visible"/>
      <g class="hatch">
        ${Array.from({ length: 12 }, (_, i) => `<line x1="${-30 + i * 12}" y1="70" x2="${40 + i * 12}" y2="0"/>`).join("")}
      </g>
      <mask id="secmask"><rect x="0" y="0" width="110" height="70" fill="#fff"/><rect x="35" y="0" width="40" height="70" fill="#000"/></mask>
      <text x="30" y="92" class="dg-lbl-accent">SECTION A–A</text>
    </g>
    <path d="M35,110 L35,110" />
    <text x="26" y="24" class="dg-lbl">cut the part, hatch the solid material</text>
  `);

  /* ---- Auxiliary view -------------------------------------------------- */
  D["auxiliary"] = svg("0 0 380 240", `
    <path d="M60,180 L60,90 L120,60 L180,90 L180,180 Z" class="ln-visible fill-none"/>
    <line x1="120" y1="60" x2="120" y2="180" class="ln-hidden"/>
    <text x="70" y="205" class="dg-lbl-blue">FRONT (inclined face foreshortened)</text>
    <!-- fold line + auxiliary projected true shape -->
    <path d="M180,90 L245,53" class="ln-center"/>
    <g transform="translate(250,40) rotate(26)">
      <rect x="0" y="0" width="70" height="46" class="ln-visible fill-none"/>
      <circle cx="35" cy="23" r="12" class="ln-visible fill-none"/>
    </g>
    <path d="M120,60 L275,30" class="ln-constr"/>
    <path d="M180,90 L300,66" class="ln-constr"/>
    <text x="250" y="150" class="dg-lbl-accent">AUXILIARY: true shape of the slope</text>
  `);

  /* ---- Thread convention ----------------------------------------------- */
  D["threads"] = svg("0 0 360 180", `
    <!-- external thread -->
    <g transform="translate(30,40)">
      <rect x="0" y="10" width="130" height="60" class="ln-visible fill-none"/>
      <line x1="0" y1="18" x2="130" y2="18" class="ln-thin"/>
      <line x1="0" y1="62" x2="130" y2="62" class="ln-thin"/>
      <line x1="0" y1="40" x2="130" y2="40" class="ln-center"/>
      <path d="M130,10 l14,10 l-14,10" class="ln-visible fill-none"/>
      <text x="0" y="98" class="dg-lbl-blue">EXTERNAL THREAD</text>
    </g>
    <!-- hole with hidden thread -->
    <g transform="translate(210,40)">
      <rect x="0" y="0" width="80" height="80" class="ln-visible fill-none"/>
      <rect x="24" y="0" width="32" height="80" class="ln-hidden"/>
      <rect x="18" y="0" width="44" height="80" class="ln-thin"/>
      <line x1="40" y1="0" x2="40" y2="80" class="ln-center"/>
      <text x="0" y="108" class="dg-lbl-blue">TAPPED HOLE</text>
    </g>
  `);

  /* ---- Intersection of solids (cylinder through prism) ----------------- */
  D["intersection"] = svg("0 0 360 260", `
    <!-- prism -->
    <rect x="60" y="70" width="150" height="120" class="ln-visible fill-none"/>
    <!-- cylinder axis + body piercing -->
    <line x1="20" y1="130" x2="340" y2="130" class="ln-center"/>
    <ellipse cx="60" cy="130" rx="14" ry="44" class="ln-hidden fill-none"/>
    <line x1="60" y1="86" x2="300" y2="86" class="ln-visible"/>
    <line x1="60" y1="174" x2="300" y2="174" class="ln-visible"/>
    <ellipse cx="300" cy="130" rx="16" ry="44" class="ln-visible fill-none"/>
    <!-- intersection curve on prism face (plotted points) -->
    <path d="M210,88 C224,100 224,160 210,172" class="ln-accent fill-none"/>
    ${[88, 104, 130, 156, 172].map(y => `<circle cx="210" cy="${y}" r="2.6" class="fill-accent"/>`).join("")}
    <text x="20" y="26" class="dg-lbl">plot the pierce points, join with a smooth curve</text>
    <text x="150" y="230" class="dg-lbl-accent">intersection curve</text>
  `);

  /* ---- Surface development (unroll a cylinder) ------------------------- */
  D["development"] = svg("0 0 400 220", `
    <ellipse cx="70" cy="60" rx="40" ry="14" class="ln-visible fill-none"/>
    <line x1="30" y1="60" x2="30" y2="150" class="ln-visible"/>
    <line x1="110" y1="60" x2="110" y2="150" class="ln-visible"/>
    <path d="M30,150 a40,14 0 0 0 80,0" class="ln-visible fill-none"/>
    <path d="M30,150 a40,14 0 0 1 80,0" class="ln-hidden fill-none"/>
    <path d="M150,90 C170,88 178,92 178,92" class="ln-constr" marker-end="url(#arrL)"/>
    <text x="150" y="82" class="dg-lbl-accent">unroll →</text>
    <!-- developed rectangle w/ divisions -->
    <rect x="200" y="60" width="180" height="90" class="ln-visible fill-none"/>
    ${Array.from({ length: 7 }, (_, i) => `<line x1="${200 + (i + 1) * 22.5}" y1="60" x2="${200 + (i + 1) * 22.5}" y2="150" class="ln-thin" opacity=".6"/>`).join("")}
    <line x1="200" y1="170" x2="380" y2="170" class="ln-dim" marker-start="url(#arrR)" marker-end="url(#arrL)"/>
    <text x="250" y="188" class="dg-lbl-ink">π × D = circumference</text>
    ${DEFS}
  `);

  /* ---- Exploded assembly with balloons --------------------------------- */
  D["assembly"] = svg("0 0 360 260", `
    <line x1="120" y1="20" x2="120" y2="240" class="ln-phantom"/>
    <!-- part 1 top -->
    <rect x="80" y="40" width="80" height="26" class="ln-visible fill-paper"/>
    <circle cx="120" cy="53" r="6" class="ln-visible fill-none"/>
    <!-- part 2 washer -->
    <rect x="95" y="100" width="50" height="12" class="ln-visible fill-paper"/>
    <!-- part 3 base -->
    <rect x="70" y="150" width="100" height="50" class="ln-visible fill-paper"/>
    <circle cx="120" cy="175" r="6" class="ln-visible fill-none"/>
    ${[["1", 200, 53], ["2", 200, 106], ["3", 200, 175]].map(([n, x, y]) => `
      <line x1="160" y1="${y}" x2="${x - 12}" y2="${y}" class="ln-thin"/>
      <circle cx="${x}" cy="${y}" r="12" class="ln-visible fill-paper"/>
      <text x="${x - 4}" y="${y + 4}" class="dg-lbl-ink">${n}</text>
    `).join("")}
    <text x="40" y="24" class="dg-lbl">exploded view · item balloons · center of assembly</text>
  `);

  /* ---- Title block / drawing sheet ------------------------------------- */
  D["title-block"] = svg("0 0 420 300", `
    <rect x="16" y="16" width="388" height="268" class="ln-visible fill-none"/>
    <rect x="26" y="26" width="368" height="248" class="ln-thin fill-none"/>
    <!-- zone letters -->
    ${["A", "B", "C", "D"].map((l, i) => `<text x="${40 + i * 90}" y="40" class="dg-lbl">${l}</text>`).join("")}
    <!-- title block bottom-right -->
    <g>
      <rect x="240" y="214" width="154" height="60" class="ln-visible fill-none"/>
      <line x1="240" y1="234" x2="394" y2="234" class="ln-thin"/>
      <line x1="240" y1="254" x2="394" y2="254" class="ln-thin"/>
      <line x1="320" y1="214" x2="320" y2="274" class="ln-thin"/>
      <text x="246" y="228" class="dg-lbl">TITLE</text>
      <text x="326" y="228" class="dg-lbl">SCALE 1:2</text>
      <text x="246" y="248" class="dg-lbl">DRAWN VP</text>
      <text x="326" y="248" class="dg-lbl">A3</text>
      <text x="246" y="268" class="dg-lbl">MATL</text>
      <text x="326" y="268" class="dg-lbl-accent">SHT 1/1</text>
    </g>
    <text x="30" y="60" class="dg-lbl-blue">border · zones · title block = a real sheet</text>
  `);

  /* ---- Warmup / line control ------------------------------------------- */
  D["line-control"] = svg("0 0 380 200", `
    ${Array.from({ length: 6 }, (_, i) => `<line x1="30" y1="${30 + i * 12}" x2="180" y2="${30 + i * 12}" class="ln-thin"/>`).join("")}
    <circle cx="70" cy="30" r="3" class="fill-blue"/><circle cx="140" cy="30" r="3" class="fill-blue"/>
    <text x="30" y="120" class="dg-lbl">ghosted parallels</text>
    ${[0, 1, 2, 3].map(i => `<ellipse cx="${250 + i * 24}" cy="60" rx="${10 + i * 6}" ry="${5 + i * 2.5}" class="ln-blue fill-none"/>`).join("")}
    <line x1="240" y1="60" x2="360" y2="60" class="ln-center"/>
    <text x="250" y="120" class="dg-lbl">ellipse funnel · aligned minor axis</text>
    <rect x="30" y="140" width="330" height="1" class="ln-thin"/>
    ${Array.from({ length: 5 }, (_, i) => {
      const x = 40 + i * 66;
      const strokes = 3 + i * 3;
      return `<rect x="${x}" y="150" width="46" height="40" class="ln-thin fill-none"/>` +
        Array.from({ length: strokes }, (_, j) => `<line x1="${x + 3}" y1="${153 + j * (34 / strokes)}" x2="${x + 43}" y2="${153 + j * (34 / strokes)}" class="hatch"/>`).join("");
    }).join("")}
    <text x="30" y="16" class="dg-lbl-blue">10-min warm-up: lines · ellipses · value scale</text>
  `);

  /* ---- Combined composition (capstone) --------------------------------- */
  D["composition"] = svg("0 0 400 280", `
    <line x1="10" y1="200" x2="390" y2="200" class="ln-center"/>
    <text x="14" y="194" class="dg-lbl-blue">horizon / ground</text>
    <!-- prism -->
    <path d="M60,200 L60,120 L110,95 L110,175 Z" class="ln-visible fill-paper"/>
    <path d="M60,120 L110,95 L160,120 L110,145 Z" class="ln-visible fill-paper"/>
    <path d="M110,175 L110,95 L160,120 L160,200 Z" class="ln-visible fill-paper" opacity=".85"/>
    <!-- cylinder -->
    <ellipse cx="230" cy="120" rx="34" ry="12" class="ln-visible fill-paper"/>
    <line x1="196" y1="120" x2="196" y2="200" class="ln-visible"/>
    <line x1="264" y1="120" x2="264" y2="200" class="ln-visible"/>
    <path d="M196,200 a34,12 0 0 0 68,0" class="ln-visible fill-none"/>
    <!-- cone through cylinder -->
    <path d="M300,90 L340,200 L260,200 Z" class="ln-visible fill-none"/>
    <ellipse cx="300" cy="200" rx="40" ry="13" class="ln-hidden fill-none"/>
    <!-- cast shadows -->
    <path d="M60,200 L120,225 L170,205 L110,200 Z" class="ln-thin" fill="var(--ink-faint)" opacity=".18"/>
    <path d="M196,200 a34,12 0 0 0 68,0 L300,222 L232,224 Z" class="ln-thin" fill="var(--ink-faint)" opacity=".15"/>
    <text x="14" y="24" class="dg-lbl">capstone: multiple solids, one light, cast shadows</text>
  `);

  global.DIAGRAMS = D;
})(window);
