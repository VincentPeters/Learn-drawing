/* ==========================================================================
   Draft30 — application logic (data-driven router + renderers)
   One template renders every day/lesson from data; adding a day means editing
   only the data file. Pages declare their role via <body data-page="...">.
   Progress is stored per module in localStorage.
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const THEME_KEY = "draft30.theme";

  /* ---------- module registry (single source of truth) ---------- */
  const MODULES = {
    1: { data: () => window.CURRICULUM, key: "draft30.progress.v1",
         tag: "Module 1", title: "Technical Drawing",
         sub: "The precise, correct line work that describes a real part.",
         unit: "Lesson", short: "Lesson", color: "#2c5f8a", kit: "2H · HB · 2B" },
    2: { data: () => window.MODULE2, key: "draft30.progress.m2",
         tag: "Module 2", title: "Rendering & Colour",
         sub: "Tone, light, hatching and the graphite + blue + sanguine palette.",
         unit: "Lesson", short: "Lesson", color: "#b5502f", kit: "＋ blue & sanguine" },
  };
  const mod = (m) => MODULES[m] || null;
  const daysOf = (m) => (mod(m) && mod(m).data() ? mod(m).data().DAYS : []);
  const phasesOf = (m) => (mod(m) && mod(m).data() ? mod(m).data().PHASES : []);

  /* global ordered sequence across both modules → one clear progression */
  function sequence() {
    const seq = [];
    [1, 2].forEach(m => daysOf(m).forEach(d => seq.push({ m, d: d.n })));
    return seq;
  }

  /* ---------- progress ---------- */
  function load(key) { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; } }
  function isDone(m, n) { return !!load(mod(m).key)[n]; }
  function setDone(m, n, v) {
    const k = mod(m).key, p = load(k);
    if (v) p[n] = 1; else delete p[n];
    localStorage.setItem(k, JSON.stringify(p));
    document.dispatchEvent(new CustomEvent("progresschange"));
  }
  function moduleStats(m) {
    const total = daysOf(m).length;
    const done = daysOf(m).filter(d => isDone(m, d.n)).length;
    return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
  }
  function phaseStats(m, pi) {
    const inPhase = daysOf(m).filter(d => d.phase === pi);
    const done = inPhase.filter(d => isDone(m, d.n)).length;
    return { done, total: inPhase.length };
  }
  /* next unfinished lesson within a module (or globally) */
  function nextInModule(m) {
    const d = daysOf(m).find(x => !isDone(m, x.n));
    return d ? { m, d: d.n } : null;
  }
  function nextGlobal() {
    const s = sequence().find(x => !isDone(x.m, x.d));
    return s || null;
  }

  const href = (m, n) => `lesson.html?m=${m}&d=${n}`;
  const dayByN = (m, n) => daysOf(m).find(d => d.n === n);

  /* ---------- icons ---------- */
  const I = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20 L16 8l-3-3L1 17l3 3zM14 4l3 3"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3 0 2 2 2 2 0 0-3 2-6 2-6z"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>',
  };

  /* ---------- theme ---------- */
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    const btn = $(".theme-toggle"); if (!btn) return;
    const isDark = () => {
      const c = document.documentElement.getAttribute("data-theme");
      return c === "dark" || (!c && window.matchMedia("(prefers-color-scheme: dark)").matches);
    };
    const render = () => { btn.innerHTML = isDark() ? I.sun : I.moon; btn.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme"); };
    render();
    btn.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next); render();
    });
  }

  /* ---------- nav active state ---------- */
  function initNavActive() {
    const path = location.pathname.split("/").pop() || "index.html";
    const m = new URLSearchParams(location.search).get("m") || "1";
    $$(".nav-links a").forEach(a => {
      const href = a.getAttribute("href") || "";
      if (href === path) a.classList.add("active");
      if ((path === "" || path === "index.html") && href === "index.html") a.classList.add("active");
      if ((path === "course.html" || path === "lesson.html") && href.indexOf("course.html") === 0 && href.indexOf("m=" + m) > -1) a.classList.add("active");
    });
  }

  /* ---------- reveal ---------- */
  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 });
    els.forEach(e => io.observe(e));
  }

  /* ==================================================================
     HOME
     ================================================================== */
  function renderHome() {
    // roadmap mini-grid → deep links to lesson pages
    const grid = $("#roadmap");
    if (grid) {
      const done = load(mod(1).key);
      grid.innerHTML = daysOf(1).map(d => {
        const ph = phasesOf(1)[d.phase];
        return `<a class="day-cell ${done[d.n] ? "done" : ""}" href="${href(1, d.n)}" style="--phase:${ph.color}">
          <span class="dn">LESSON ${String(d.n).padStart(2, "0")}</span>
          <span class="dt">${d.title}</span>
          <span class="check">${I.check}</span></a>`;
      }).join("");
    }
    // phase timeline
    const ph = $("#phases");
    if (ph) {
      ph.innerHTML = phasesOf(1).map((p, i) => {
        const chips = daysOf(1).filter(d => d.phase === i).map(d => `<span class="chip">${d.title}</span>`).join("");
        return `<div class="phase-row reveal" style="--phase:${p.color}">
          <div class="phase-days">Lessons<span class="big">${p.days}</span></div>
          <div class="phase-body"><h3>${p.name}</h3><p>${p.blurb}</p><div class="phase-chips">${chips}</div></div></div>`;
      }).join("");
    }
    // continue band
    const cb = $("#continue-band");
    if (cb) {
      const nx = nextGlobal();
      const m1 = moduleStats(1), started = m1.done > 0 || moduleStats(2).done > 0;
      if (!nx) {
        cb.innerHTML = `<div><div class="cb-label">All done</div><div class="cb-title">You've completed every lesson 🎉</div><div class="cb-sub">Revisit any day, or run the capstone again — it'll be better each time.</div></div>
          <div class="cb-actions"><a href="course.html?m=1" class="btn btn-ghost">Course map</a></div>`;
      } else {
        const d = dayByN(nx.m, nx.d), mm = mod(nx.m);
        cb.innerHTML = `<div>
            <div class="cb-label">${started ? "Continue where you left off" : "Start here"}</div>
            <div class="cb-title">${mm.tag} · ${mm.unit} ${nx.d} — ${d.title}</div>
            <div class="cb-sub">${started ? moduleStats(nx.m).done + " of " + moduleStats(nx.m).total + " " + mm.unit.toLowerCase() + "s done in " + mm.title : "Your first session. All you need is a pencil and paper."}</div>
          </div>
          <div class="cb-actions"><a href="${href(nx.m, nx.d)}" class="btn btn-primary">${started ? "Continue" : "Begin"} ${I.arrow}</a></div>`;
      }
    }
    renderFigures();
  }

  /* ==================================================================
     COURSE MAP  (course.html?m=1|2)
     ================================================================== */
  function renderCourse() {
    const m = parseInt(new URLSearchParams(location.search).get("m") || "1", 10);
    if (!mod(m) || !mod(m).data()) { location.replace("course.html?m=1"); return; }
    const mm = mod(m), st = moduleStats(m);
    document.title = `${mm.tag} · ${mm.title} — Draft30`;

    // breadcrumb
    const bc = $("#crumbs");
    if (bc) bc.innerHTML = `<a href="index.html">Home</a><span class="sep">›</span><span class="here">${mm.tag} · ${mm.title}</span>`;

    // header
    const head = $("#course-head");
    if (head) {
      head.style.setProperty("--phase", mm.color);
      head.innerHTML = `
        <div class="course-head-main">
          <div class="eyebrow">${mm.tag}</div>
          <h1>${mm.title}</h1>
          <p>${mm.sub}</p>
        </div>
        <div class="course-progress">
          <div class="cp-pct" id="cp-pct">${st.pct}%</div>
          <div class="cp-lbl"><span id="cp-cnt">${st.done} of ${st.total}</span> ${mm.unit.toLowerCase()}s complete</div>
          <div class="bar"><i style="width:${st.pct}%"></i></div>
          <a class="btn btn-primary" id="continue-btn" href="#">Continue ${I.arrow}</a>
        </div>`;
    }
    updateContinueBtn(m);

    // phase groups
    const list = $("#phase-list");
    if (list) {
      list.innerHTML = phasesOf(m).map((p, pi) => {
        const ps = phaseStats(m, pi);
        const cards = daysOf(m).filter(d => d.phase === pi).map(d => cardHTML(m, d, p)).join("");
        return `<section class="phase-group" style="--phase:${p.color}" id="phase-${pi}">
          <div class="phase-group-head">
            <span class="pg-ix">Phase ${pi + 1}</span>
            <h2>${p.name}</h2>
            <span class="pg-count">${ps.done}/${ps.total} done</span>
            <p class="pg-blurb">${p.blurb}</p>
          </div>
          <div class="lesson-grid">${cards}</div>
        </section>`;
      }).join("");
    }

    // module switch
    const sw = $("#module-switch");
    if (sw) {
      const other = m === 1 ? 2 : 1, om = mod(other);
      sw.innerHTML = `<div class="ms-text">${m === 1 ? "Finished the drawing? Add the artisan's layer." : "Want to revisit the fundamentals?"} <b>${om.tag}: ${om.title}</b></div>
        <a href="course.html?m=${other}" class="btn btn-ghost">Go to ${om.tag} ${I.arrow}</a>`;
    }

    document.addEventListener("progresschange", () => renderCourse());
  }

  function cardHTML(m, d, p) {
    const done = isDone(m, d.n);
    const nx = nextInModule(m);
    const isNext = !done && nx && nx.d === d.n;
    const state = done
      ? `<span class="lc-state">${I.check} done</span>`
      : isNext ? `<span class="lc-state">start here</span>`
      : `<span class="lc-state">${I.circle}</span>`;
    return `<a class="lesson-card ${done ? "done" : ""} ${isNext ? "next" : ""}" href="${href(m, d.n)}" style="--phase:${p.color}">
      <span class="lc-top"><span class="lc-num">${String(d.n).padStart(2, "0")}</span>${state}</span>
      <span class="lc-title">${d.title}</span>
      <span class="lc-obj">${d.objective}</span></a>`;
  }

  function updateContinueBtn(m) {
    const btn = $("#continue-btn"); if (!btn) return;
    const nx = nextInModule(m);
    if (nx) { btn.setAttribute("href", href(nx.m, nx.d)); btn.innerHTML = `Continue · ${mod(m).unit} ${nx.d} ${I.arrow}`; }
    else { btn.setAttribute("href", href(m, 1)); btn.innerHTML = `Review from ${mod(m).unit} 1 ${I.arrow}`; }
  }

  /* ==================================================================
     LESSON  (lesson.html?m=&d=)
     ================================================================== */
  function renderLesson() {
    const q = new URLSearchParams(location.search);
    let m = parseInt(q.get("m") || "1", 10);
    let n = parseInt(q.get("d") || "1", 10);
    if (!mod(m) || !mod(m).data()) { location.replace("lesson.html?m=1&d=1"); return; }
    let d = dayByN(m, n);
    if (!d) { location.replace(href(m, 1)); return; }

    const mm = mod(m), p = phasesOf(m)[d.phase];
    const st = moduleStats(m);
    document.title = `${mm.unit} ${n} · ${d.title} — Draft30`;
    document.body.style.setProperty("--phase", p.color);

    const seq = sequence();
    const idx = seq.findIndex(x => x.m === m && x.d === n);
    const prev = idx > 0 ? seq[idx - 1] : null;
    const next = idx < seq.length - 1 ? seq[idx + 1] : null;

    const li = (items) => items.map(i => `<li>${i}</li>`).join("");
    const fig = window.DIAGRAMS && window.DIAGRAMS[d.diagram] ? window.DIAGRAMS[d.diagram] : "";

    // breadcrumb
    $("#crumbs").innerHTML = `<a href="index.html">Home</a><span class="sep">›</span>
      <a href="course.html?m=${m}">${mm.tag}</a><span class="sep">›</span>
      <a href="course.html?m=${m}#phase-${d.phase}">${p.name}</a><span class="sep">›</span>
      <span class="here">${mm.unit} ${n}</span>`;

    // main article
    $("#lesson").innerHTML = `
      <header class="lesson-head">
        <div class="lh-top">
          <span class="lh-phase">${p.name} · Phase ${d.phase + 1} of ${phasesOf(m).length}</span>
          <span class="lh-count">${mm.unit} ${n} / ${st.total}</span>
        </div>
        <h1><span class="lh-num">${String(n).padStart(2, "0")}</span> ${d.title}</h1>
        <div class="lh-meta">
          <span>${I.clock} 45–90 min</span>
          <span>${I.pencil} ${mm.kit}</span>
          <span>${I.map} <a href="course.html?m=${m}">${mm.title}</a></span>
        </div>
        <div class="lh-progress"><i style="width:${st.pct}%"></i></div>
      </header>

      <div class="lesson-figure">${fig}<div class="fig-cap">Fig. ${n} — ${d.title}</div></div>

      <div class="lesson-goal"><span class="g-label">Your goal</span>${d.objective}</div>

      <section class="lesson-block warmup">
        <h2><span class="lb-ico">${I.flame}</span> Warm-up <small>≈ 10 min</small></h2>
        <ul>${li(d.warmup)}</ul>
      </section>

      <section class="lesson-block">
        <h2><span class="lb-ico">${I.pencil}</span> Main exercise <small>30–60 min</small></h2>
        <ul>${li(d.main)}</ul>
      </section>

      <div class="lesson-checkpoint">
        <div class="lc-h">${I.target} Checkpoint — how you know it's working</div>
        <p>${d.checkpoint}</p>
      </div>

      <div class="lesson-tip"><b>Pro tip.</b> ${d.tip}</div>

      <div class="lesson-complete" id="complete-wrap">
        <button class="big-check" id="complete-btn"></button>
      </div>

      <nav class="lesson-nav">${navCard("prev", prev)}${navCard("next", next)}</nav>
      <a class="back-map" href="course.html?m=${m}">${I.map} All ${mm.unit.toLowerCase()}s in ${mm.title}</a>
    `;

    // complete button
    const wrap = $("#complete-wrap"), btn = $("#complete-btn");
    const paint = () => {
      const done = isDone(m, n);
      wrap.classList.toggle("done", done);
      btn.innerHTML = done ? `${I.check} ${mm.unit} ${n} complete` : `${I.circle} Mark ${mm.unit} ${n} complete`;
    };
    paint();
    btn.addEventListener("click", () => {
      const nowDone = !isDone(m, n);
      setDone(m, n, nowDone);
      paint();
      $(".lh-progress > i").style.width = moduleStats(m).pct + "%";
    });

    // keyboard prev/next
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft" && prev) location.href = href(prev.m, prev.d);
      if (e.key === "ArrowRight" && next) location.href = href(next.m, next.d);
    });
  }

  function navCard(dir, ref) {
    if (!ref) {
      if (dir === "next") return `<div class="ln-end" style="text-align:right"><span class="ln-dir">The end</span><span class="ln-title">Course complete 🎉</span></div>`;
      return `<a class="disabled"><span class="ln-dir">Start</span><span class="ln-title">You're at the beginning</span></a>`;
    }
    const mm = mod(ref.m), d = dayByN(ref.m, ref.d);
    if (dir === "prev") return `<a class="prev" href="${href(ref.m, ref.d)}"><span class="ln-dir">← Previous</span><span class="ln-title">${mm.short} ${ref.d} · ${d.title}</span></a>`;
    return `<a class="next" href="${href(ref.m, ref.d)}"><span class="ln-dir">Next →</span><span class="ln-title">${mm.short} ${ref.d} · ${d.title}</span></a>`;
  }

  /* ---------- reference figures ---------- */
  function renderFigures() {
    if (!window.DIAGRAMS) return;
    $$("[data-diagram]").forEach(el => { const k = el.getAttribute("data-diagram"); if (window.DIAGRAMS[k]) el.innerHTML = window.DIAGRAMS[k]; });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNavActive();
    const page = document.body.getAttribute("data-page");
    if (page === "home") renderHome();
    else if (page === "course") renderCourse();
    else if (page === "lesson") renderLesson();
    else renderFigures();       // reference & any static page
    initReveal();
  });
})();
