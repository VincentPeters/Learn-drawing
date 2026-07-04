/* ==========================================================================
   Draft30 — SVG diagram library
   Hand-authored, theme-aware technical drawing illustrations.
   Every diagram is a self-contained inline SVG string keyed by id.
   Stroke/fill come from semantic classes in style.css so they follow the theme.
   ========================================================================== */

  // Small helpers ----------------------------------------------------------
  const svg = (vb: string, inner: string, cls?: string) =>
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

  const D: Record<string, string> = {};

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
    ].map(([label, cls, y]: any) => `
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
    ${[30, 55, 105, 130].map((y: number) => `<line x1="20" y1="${y}" x2="380" y2="${y}" class="ln-thin" opacity=".5"/>`).join("")}
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
    ${[["1", 200, 53], ["2", 200, 106], ["3", 200, 175]].map(([n, x, y]: any) => `
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
    ${["A", "B", "C", "D"].map((l: string, i: number) => `<text x="${40 + i * 90}" y="40" class="dg-lbl">${l}</text>`).join("")}
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
    ${Array.from({ length: 6 }, (_, i: number) => `<line x1="30" y1="${30 + i * 12}" x2="180" y2="${30 + i * 12}" class="ln-thin"/>`).join("")}
    <circle cx="70" cy="30" r="3" class="fill-blue"/><circle cx="140" cy="30" r="3" class="fill-blue"/>
    <text x="30" y="120" class="dg-lbl">ghosted parallels</text>
    ${[0, 1, 2, 3].map((i: number) => `<ellipse cx="${250 + i * 24}" cy="60" rx="${10 + i * 6}" ry="${5 + i * 2.5}" class="ln-blue fill-none"/>`).join("")}
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

  /* ======================================================================
     MODULE 2 — Rendering, shading & colour
     Tone uses currentColor gradients/opacity so it inverts with the theme
     (dark ink on paper in light mode, light ink on dark in blueprint mode).
     ====================================================================== */

  /* ---- Value scale (density builds tone) ------------------------------- */
  D["value-scale"] = svg("0 0 380 150", `
    ${Array.from({ length: 6 }, (_, i) => {
      const x = 20 + i * 58, n = i * 5;
      const cell = `<rect x="${x}" y="26" width="50" height="70" class="ln-thin fill-none"/>`;
      const hatch = Array.from({ length: n }, (_, j) =>
        `<line x1="${x + 2}" y1="${29 + j * (64 / Math.max(n, 1))}" x2="${x + 48}" y2="${29 + j * (64 / Math.max(n, 1))}" class="hatch" style="stroke:var(--ink);opacity:.9"/>`).join("");
      return cell + hatch + `<text x="${x + 17}" y="112" class="dg-lbl">${i === 0 ? "0" : i * 2}</text>`;
    }).join("")}
    <text x="20" y="16" class="dg-lbl-blue">Value scale — build tone by density, not by pressure</text>
  `);

  /* ---- Hatching that follows the form ---------------------------------- */
  D["hatch-form"] = svg("0 0 380 220", `
    <!-- cylinder: vertical strokes, denser toward the shadow side -->
    <g>
      <ellipse cx="90" cy="45" rx="50" ry="15" class="ln-visible fill-paper"/>
      <line x1="40" y1="45" x2="40" y2="175" class="ln-visible"/>
      <line x1="140" y1="45" x2="140" y2="175" class="ln-visible"/>
      <path d="M40,175 a50,15 0 0 0 100,0" class="ln-visible fill-none"/>
      ${Array.from({ length: 24 }, (_, i) => {
        const x = 43 + i * 4;
        const r = (x - 40) / 100;                 // 0 lit … 1 shadow
        const op = (0.10 + Math.pow(r, 1.6) * 0.8).toFixed(2);
        const t = Math.max(0, 1 - Math.pow((x - 90) / 50, 2));
        const y0 = (45 + 15 * Math.sqrt(t)).toFixed(1);
        return `<line x1="${x}" y1="${y0}" x2="${x}" y2="175" class="hatch" style="stroke:var(--ink);opacity:${op}"/>`;
      }).join("")}
      <text x="40" y="200" class="dg-lbl">vertical on the wall</text>
    </g>
    <!-- cone: strokes radiate from the apex -->
    <g>
      <path d="M300,35 L245,175 L355,175 Z" class="ln-visible fill-none"/>
      <path d="M245,175 a55,15 0 0 0 110,0" class="ln-visible fill-none"/>
      <ellipse cx="300" cy="175" rx="55" ry="15" class="ln-hidden fill-none"/>
      ${Array.from({ length: 17 }, (_, i) => {
        const bx = 248 + i * 6.5;
        const r = (bx - 245) / 110;
        const op = (0.10 + Math.pow(r, 1.5) * 0.8).toFixed(2);
        return `<line x1="300" y1="37" x2="${bx.toFixed(1)}" y2="174" class="hatch" style="stroke:var(--ink);opacity:${op}"/>`;
      }).join("")}
      <text x="256" y="200" class="dg-lbl">radiating on the cone</text>
    </g>
    <text x="20" y="18" class="dg-lbl-blue">Strokes follow the surface; tone comes from density</text>
  `);

  /* ---- Cross-hatching in layers ---------------------------------------- */
  D["crosshatch"] = svg("0 0 360 170", `
    ${[
      { x: 20, layers: [45] , n: "1 layer" },
      { x: 130, layers: [45, -45], n: "2 layers" },
      { x: 240, layers: [45, -45, 90], n: "3 layers" },
    ].map((s: any) => {
      const box = `<rect x="${s.x}" y="30" width="90" height="90" class="ln-thin fill-none"/>`;
      const lines = s.layers.map((a: number) =>
        Array.from({ length: 11 }, (_, k) => {
          const off = -90 + k * 15;
          if (a === 90) return `<line x1="${s.x + 8 + k * 8}" y1="30" x2="${s.x + 8 + k * 8}" y2="120" class="hatch" style="stroke:var(--ink);opacity:.55"/>`;
          const dir = a > 0 ? 1 : -1;
          return `<line x1="${s.x + (dir > 0 ? 0 : 90) + off * 0}" y1="0" x2="0" y2="0" style="display:none"/>`;
        }).join("")).join("");
      // simpler explicit diagonal fills:
      const diag = s.layers.map((a: number) => Array.from({ length: 13 }, (_, k: number) => {
        const p = k * 12 - 30;
        if (a === 90) return `<line x1="${s.x + 6 + k * 7}" y1="32" x2="${s.x + 6 + k * 7}" y2="118" class="hatch" style="stroke:var(--ink);opacity:.5"/>`;
        if (a > 0) return `<line x1="${s.x + p}" y1="120" x2="${s.x + p + 90}" y2="30" class="hatch" style="stroke:var(--ink);opacity:.55"/>`;
        return `<line x1="${s.x + p}" y1="30" x2="${s.x + p + 90}" y2="120" class="hatch" style="stroke:var(--ink);opacity:.55"/>`;
      }).join("")).join("");
      return box + `<clipPath id="cx${s.x}"><rect x="${s.x}" y="30" width="90" height="90"/></clipPath><g clip-path="url(#cx${s.x})">${diag}</g><text x="${s.x + 8}" y="140" class="dg-lbl">${s.n}</text>`;
    }).join("")}
    <text x="20" y="18" class="dg-lbl-blue">Each layer at a new angle deepens the tone</text>
  `);

  /* ---- Light logic on a sphere ----------------------------------------- */
  D["light-logic"] = svg("0 0 420 280", `
    <defs>
      <radialGradient id="llS" cx="37%" cy="33%" r="75%">
        <stop offset="0%" stop-color="currentColor" stop-opacity="0"/>
        <stop offset="52%" stop-color="currentColor" stop-opacity="0.10"/>
        <stop offset="80%" stop-color="currentColor" stop-opacity="0.52"/>
        <stop offset="92%" stop-color="currentColor" stop-opacity="0.26"/>
        <stop offset="100%" stop-color="currentColor" stop-opacity="0.40"/>
      </radialGradient>
    </defs>
    <ellipse cx="185" cy="222" rx="105" ry="22" fill="currentColor" opacity="0.15"/>
    <ellipse cx="120" cy="212" rx="22" ry="9" fill="currentColor" opacity="0.28"/>
    <circle cx="150" cy="120" r="82" fill="url(#llS)"/>
    <circle cx="150" cy="120" r="82" class="ln-visible fill-none"/>
    <ellipse cx="120" cy="88" rx="11" ry="8" class="fill-paper"/>
    ${[
      ["highlight", 120, 82, 250, 60],
      ["mid-tone", 150, 120, 250, 105],
      ["core shadow", 196, 168, 300, 150],
      ["reflected light", 205, 190, 320, 200],
      ["cast shadow", 250, 225, 330, 240],
      ["occlusion", 120, 212, 108, 258],
    ].map(([t, x, y, lx, ly]: any) => `
      <line x1="${x}" y1="${y}" x2="${lx}" y2="${ly}" class="ln-thin" style="opacity:.6"/>
      <circle cx="${x}" cy="${y}" r="2.4" class="fill-accent"/>
      <text x="${lx > 200 ? lx + 4 : lx - 4}" y="${ly + 3}" class="dg-lbl-ink" style="text-anchor:${lx > 200 ? "start" : "end"}">${t}</text>
    `).join("")}
    <text x="20" y="20" class="dg-lbl-blue">One light source → six readable zones of tone</text>
  `);

  /* ---- The primitives, shaded ------------------------------------------ */
  D["primitives-shaded"] = svg("0 0 420 180", `
    <defs>
      <radialGradient id="psS" cx="38%" cy="34%" r="72%">
        <stop offset="0%" stop-color="currentColor" stop-opacity="0"/>
        <stop offset="78%" stop-color="currentColor" stop-opacity="0.5"/>
        <stop offset="90%" stop-color="currentColor" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="currentColor" stop-opacity="0.4"/>
      </radialGradient>
      <linearGradient id="psC" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="currentColor" stop-opacity="0.05"/>
        <stop offset="45%" stop-color="currentColor" stop-opacity="0"/>
        <stop offset="80%" stop-color="currentColor" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="currentColor" stop-opacity="0.28"/>
      </linearGradient>
    </defs>
    <!-- sphere -->
    <ellipse cx="55" cy="130" rx="40" ry="9" fill="currentColor" opacity=".14"/>
    <circle cx="50" cy="70" r="42" fill="url(#psS)"/>
    <circle cx="50" cy="70" r="42" class="ln-visible fill-none"/>
    <text x="30" y="150" class="dg-lbl">sphere</text>
    <!-- cylinder -->
    <ellipse cx="160" cy="128" rx="42" ry="9" fill="currentColor" opacity=".14"/>
    <rect x="135" y="42" width="50" height="80" fill="url(#psC)"/>
    <ellipse cx="160" cy="42" rx="25" ry="8" class="ln-visible fill-paper"/>
    <line x1="135" y1="42" x2="135" y2="122" class="ln-visible"/>
    <line x1="185" y1="42" x2="185" y2="122" class="ln-visible"/>
    <path d="M135,122 a25,8 0 0 0 50,0" class="ln-visible fill-none"/>
    <text x="140" y="150" class="dg-lbl">cylinder</text>
    <!-- cone -->
    <ellipse cx="270" cy="128" rx="42" ry="9" fill="currentColor" opacity=".14"/>
    <path d="M270,38 L245,122 L295,122 Z" fill="url(#psC)"/>
    <path d="M270,38 L245,122 L295,122 Z" class="ln-visible fill-none"/>
    <path d="M245,122 a25,8 0 0 0 50,0" class="ln-visible fill-none"/>
    <text x="252" y="150" class="dg-lbl">cone</text>
    <!-- cube -->
    <ellipse cx="375" cy="128" rx="44" ry="9" fill="currentColor" opacity=".14"/>
    <path d="M350,50 L390,50 L390,120 L350,120 Z" fill="currentColor" opacity=".05"/>
    <path d="M390,50 L410,40 L410,108 L390,120 Z" fill="currentColor" opacity=".45"/>
    <path d="M350,50 L370,40 L410,40 L390,50 Z" fill="currentColor" opacity=".16"/>
    <path d="M350,50 L390,50 L390,120 L350,120 Z M390,50 L410,40 L410,108 L390,120 M350,50 L370,40 L410,40" class="ln-visible fill-none"/>
    <text x="358" y="150" class="dg-lbl">cube</text>
    <text x="20" y="20" class="dg-lbl-blue">Where each tone falls on the four basic solids</text>
  `);

  /* ---- Cast shadow construction ---------------------------------------- */
  D["cast-shadow"] = svg("0 0 400 250", `
    <line x1="20" y1="185" x2="380" y2="185" class="ln-center"/>
    <!-- light source -->
    <circle cx="60" cy="40" r="12" class="ln-accent fill-none"/>
    ${Array.from({ length: 8 }, (_, i) => { const a = i * 45 * Math.PI / 180; return `<line x1="${60 + 16 * Math.cos(a)}" y1="${40 + 16 * Math.sin(a)}" x2="${60 + 22 * Math.cos(a)}" y2="${40 + 22 * Math.sin(a)}" class="ln-accent"/>`; }).join("")}
    <text x="44" y="78" class="dg-lbl-accent">light</text>
    <!-- box -->
    <rect x="150" y="115" width="70" height="70" class="ln-visible fill-paper"/>
    <path d="M150,115 L172,98 L242,98 L220,115 Z" class="ln-visible fill-paper" opacity=".85"/>
    <path d="M220,115 L242,98 L242,168 L220,185 Z" class="ln-visible fill-paper" opacity=".7"/>
    <!-- shadow projected from light through top corners to ground -->
    <path d="M60,40 L172,98 L295,185" class="ln-constr"/>
    <path d="M60,40 L242,98 L360,167" class="ln-constr"/>
    <path d="M150,185 L295,185 L360,167 L242,168 L220,185 Z" fill="currentColor" opacity=".18"/>
    <text x="270" y="205" class="dg-lbl">cast shadow</text>
    <text x="20" y="20" class="dg-lbl-blue">Project rays from the light through each top edge</text>
  `);

  /* ---- The colour system ----------------------------------------------- */
  D["color-system"] = svg("0 0 400 200", `
    ${[
      ["graphite", "var(--ink)", 30],
      ["blue (cool / shadow)", "var(--blue)", 150],
      ["sanguine (warm / light)", "var(--accent)", 270],
    ].map(([t, col, x]: any) => `
      <rect x="${x}" y="30" width="90" height="52" class="ln-thin fill-none"/>
      ${Array.from({ length: 16 }, (_, j: number) => `<line x1="${x + 3}" y1="${33 + j * 3}" x2="${x + 87}" y2="${33 + j * 3}" style="stroke:${col};stroke-width:1.4;opacity:${(0.2 + j * 0.05).toFixed(2)}"/>`).join("")}
      <text x="${x}" y="98" class="dg-lbl">${t}</text>
    `).join("")}
    <!-- layered sphere: graphite base, blue in shadow, sanguine near light -->
    <circle cx="200" cy="155" r="34" fill="var(--ink)" opacity=".12"/>
    <path d="M200,121 a34,34 0 0 1 24,58 a34,34 0 0 0 -24,-58" fill="var(--blue)" opacity=".28"/>
    <ellipse cx="188" cy="140" rx="12" ry="9" fill="var(--accent)" opacity=".3"/>
    <circle cx="200" cy="155" r="34" class="ln-visible fill-none"/>
    <text x="30" y="18" class="dg-lbl-blue">Graphite base + two accents = the whole palette</text>
  `);

  /* ---- Temperature (warm / cool) --------------------------------------- */
  D["temperature"] = svg("0 0 360 210", `
    <ellipse cx="180" cy="180" rx="70" ry="14" fill="currentColor" opacity=".12"/>
    <rect x="120" y="55" width="120" height="110" fill="var(--accent)" opacity=".16"/>
    <rect x="196" y="55" width="44" height="110" fill="var(--blue)" opacity=".22"/>
    <ellipse cx="180" cy="55" rx="60" ry="16" class="ln-visible fill-paper"/>
    <line x1="120" y1="55" x2="120" y2="165" class="ln-visible"/>
    <line x1="240" y1="55" x2="240" y2="165" class="ln-visible"/>
    <path d="M120,165 a60,16 0 0 0 120,0" class="ln-visible fill-none"/>
    <text x="122" y="115" class="dg-lbl-accent">warm · lit / near</text>
    <text x="250" y="115" class="dg-lbl-blue">cool · shadow</text>
    <text x="20" y="20" class="dg-lbl-blue">Warm accents advance, cool accents recede</text>
  `);

  /* ---- Selective colour (focal emphasis) ------------------------------- */
  D["selective-color"] = svg("0 0 400 230", `
    <line x1="20" y1="175" x2="380" y2="175" class="ln-center"/>
    <!-- graphite cube (background) -->
    <path d="M60,175 L60,120 L95,105 L95,160 Z" class="ln-visible fill-none"/>
    <path d="M60,120 L95,105 L130,120 L95,135 Z" class="ln-visible fill-none"/>
    <path d="M95,160 L95,105 L130,120 L130,175 Z" class="ln-visible" fill="currentColor" fill-opacity=".08"/>
    <!-- sanguine cone (focal, warm) -->
    <path d="M195,60 L165,175 L225,175 Z" class="ln-visible" fill="var(--accent)" fill-opacity=".26"/>
    <path d="M165,175 a30,9 0 0 0 60,0" class="ln-visible fill-none"/>
    <!-- blue cylinder (accent) -->
    <ellipse cx="300" cy="95" rx="34" ry="11" class="ln-visible" fill="var(--blue)" fill-opacity=".12"/>
    <rect x="266" y="95" width="68" height="80" fill="var(--blue)" fill-opacity=".22"/>
    <line x1="266" y1="95" x2="266" y2="175" class="ln-visible"/>
    <line x1="334" y1="95" x2="334" y2="175" class="ln-visible"/>
    <path d="M266,175 a34,11 0 0 0 68,0" class="ln-visible fill-none"/>
    <text x="20" y="20" class="dg-lbl-blue">Colour the focal solids; leave the rest in graphite</text>
  `);

  /* ---- Edges: line weight & lost/found --------------------------------- */
  D["edges"] = svg("0 0 380 200", `
    <!-- cube: near edges heavy, receding edges light -->
    <path d="M60,170 L60,90 L110,65 L110,145 Z" fill="currentColor" fill-opacity=".05"/>
    <path d="M60,90 L110,65 L160,90 L110,115 Z" class="ln-thin fill-none"/>
    <path d="M110,145 L110,65 L160,90 L160,170 Z" class="ln-thin fill-none" style="opacity:.5"/>
    <path d="M60,170 L60,90 L110,115 L110,145 Z" class="fill-none" style="stroke:var(--ink);stroke-width:3;stroke-linejoin:round"/>
    <line x1="110" y1="145" x2="110" y2="115" class="fill-none" style="stroke:var(--ink);stroke-width:3"/>
    <text x="40" y="192" class="dg-lbl">near edges heavy, far edges light</text>
    <!-- lost & found on a rounded form -->
    <path d="M250,60 a50,60 0 1 0 0.1,0" class="fill-none" style="stroke:var(--ink);stroke-width:2.6;stroke-dasharray:120 40 60 30;stroke-dashoffset:10"/>
    <ellipse cx="250" cy="120" rx="50" ry="60" fill="currentColor" fill-opacity=".06"/>
    <text x="210" y="192" class="dg-lbl">lost &amp; found edges</text>
    <text x="20" y="20" class="dg-lbl-blue">Edge weight shows what is near and what turns away</text>
  `);

  /* ---- Texture swatches ------------------------------------------------ */
  D["texture"] = svg("0 0 380 160", `
    <!-- metal: high contrast streaks -->
    <rect x="20" y="30" width="90" height="80" class="ln-thin fill-none"/>
    <rect x="20" y="30" width="90" height="80" fill="currentColor" fill-opacity=".08"/>
    ${[6, 20, 26, 40, 58, 64, 78].map((y, i) => `<rect x="20" y="${30 + y}" width="90" height="${i % 3 === 0 ? 6 : 2}" fill="currentColor" fill-opacity="${i % 2 ? 0.5 : 0.18}"/>`).join("")}
    <rect x="20" y="46" width="90" height="4" class="fill-paper"/>
    <text x="20" y="128" class="dg-lbl">metal</text>
    <!-- matte: even gradient -->
    <rect x="145" y="30" width="90" height="80" class="ln-thin fill-none"/>
    ${Array.from({ length: 26 }, (_, j) => `<line x1="147" y1="${32 + j * 3}" x2="233" y2="${32 + j * 3}" class="hatch" style="stroke:var(--ink);opacity:${(0.15 + j * 0.02).toFixed(2)}"/>`).join("")}
    <text x="145" y="128" class="dg-lbl">matte</text>
    <!-- wood: grain -->
    <rect x="270" y="30" width="90" height="80" class="ln-thin fill-none"/>
    ${Array.from({ length: 7 }, (_, j) => `<path d="M270,${36 + j * 11} q45,${j % 2 ? 6 : -6} 90,0" class="hatch fill-none" style="stroke:var(--accent);opacity:.5"/>`).join("")}
    <text x="270" y="128" class="dg-lbl">wood grain</text>
    <text x="20" y="20" class="dg-lbl-blue">Surface reads through stroke pattern and contrast</text>
  `);

  /* ---- The finished plate (Module 2 capstone) -------------------------- */
  D["finished-plate"] = svg("0 0 420 300", `
    <defs>
      <linearGradient id="fpC" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="currentColor" stop-opacity=".04"/>
        <stop offset="50%" stop-color="currentColor" stop-opacity="0"/>
        <stop offset="100%" stop-color="currentColor" stop-opacity=".45"/>
      </linearGradient>
    </defs>
    <line x1="10" y1="215" x2="410" y2="215" class="ln-center"/>
    <!-- cone through cylinder, blue accent -->
    <ellipse cx="150" cy="215" rx="120" ry="26" fill="currentColor" opacity=".12"/>
    <rect x="108" y="120" width="84" height="95" fill="url(#fpC)"/>
    <rect x="108" y="120" width="84" height="95" fill="var(--blue)" fill-opacity=".16"/>
    <ellipse cx="150" cy="120" rx="42" ry="13" class="ln-visible fill-paper"/>
    <line x1="108" y1="120" x2="108" y2="215" class="ln-visible"/>
    <line x1="192" y1="120" x2="192" y2="215" class="ln-visible"/>
    <path d="M108,215 a42,13 0 0 0 84,0" class="ln-visible fill-none"/>
    <path d="M150,45 L104,150 L196,150 Z" class="ln-visible fill-none"/>
    <path d="M150,45 L196,150" style="stroke:var(--accent);stroke-width:1.4;opacity:.6" fill="none"/>
    ${Array.from({ length: 10 }, (_, i: number) => `<line x1="150" y1="47" x2="${106 + i * 9.4}" y2="149" class="hatch" style="stroke:var(--ink);opacity:${(0.08 + i * 0.05).toFixed(2)}"/>`).join("")}
    <!-- intersection curve (plotted) -->
    <path d="M150,133 C138,138 138,146 150,150" style="stroke:var(--accent);stroke-width:2" fill="none"/>
    <!-- sanguine pyramid -->
    <path d="M320,70 L270,215 L370,215 Z" class="ln-visible" fill="var(--accent)" fill-opacity=".2"/>
    <path d="M320,70 L340,205" style="stroke:var(--ink);stroke-width:1;opacity:.4" fill="none"/>
    ${Array.from({ length: 9 }, (_, i: number) => `<line x1="320" y1="72" x2="${300 + i * 8}" y2="214" class="hatch" style="stroke:var(--ink);opacity:${(0.06 + i * 0.05).toFixed(2)}"/>`).join("")}
    <text x="20" y="24" class="dg-lbl-blue">The plate: construction, hatching, shading, colour</text>
  `);

export const DIAGRAMS = D;
