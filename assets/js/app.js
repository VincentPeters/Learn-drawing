/* ==========================================================================
   Draft30 — application logic
   Theme, progress (localStorage), roadmap + curriculum rendering, reveal.
   Drives Module 1 (curriculum) or Module 2 (rendering) from one codebase,
   chosen per page via <body data-module="2">. Progress is stored per module.
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const THEME_KEY = "draft30.theme";

  // Active module config, resolved at boot -------------------------------
  let ACTIVE = null;
  function resolveActive() {
    const m = document.body.getAttribute("data-module");
    if (m === "2" && window.MODULE2) {
      return { data: window.MODULE2, key: "draft30.progress.m2", page: "module2.html", label: "Lesson", short: "LSN" };
    }
    const meta = (window.CURRICULUM && window.CURRICULUM.META) || {};
    return { data: window.CURRICULUM, key: "draft30.progress.v1", page: "curriculum.html", label: meta.unitLabel || "Day", short: meta.unitShort || "DAY" };
  }

  /* ---------- icons ---------- */
  const ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
  };

  /* ---------- theme ---------- */
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    const btn = $(".theme-toggle");
    if (!btn) return;
    const render = () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const dark = cur === "dark" ||
        (!cur && window.matchMedia("(prefers-color-scheme: dark)").matches);
      btn.innerHTML = dark ? ICON.sun : ICON.moon;
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    };
    render();
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const dark = cur === "dark" ||
        (!cur && window.matchMedia("(prefers-color-scheme: dark)").matches);
      const next = dark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
      render();
    });
  }

  /* ---------- progress store (per active module) ---------- */
  function loadProgress(key) {
    try { return JSON.parse(localStorage.getItem(key || ACTIVE.key)) || {}; }
    catch (e) { return {}; }
  }
  function saveProgress(p) { localStorage.setItem(ACTIVE.key, JSON.stringify(p)); }
  function setDone(n, v) {
    const p = loadProgress();
    if (v) p[n] = 1; else delete p[n];
    saveProgress(p);
    document.dispatchEvent(new CustomEvent("progresschange"));
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(e => e.classList.add("in")); return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(e => io.observe(e));
  }

  /* ---------- roadmap grid ---------- */
  function renderRoadmap() {
    const grid = $("#roadmap");
    if (!grid) return;
    // a roadmap may target a module other than the page's active one
    const src = grid.getAttribute("data-source");
    const cfg = src === "module2"
      ? { data: window.MODULE2, key: "draft30.progress.m2", page: "module2.html", short: "LSN" }
      : { data: window.CURRICULUM, key: "draft30.progress.v1", page: "curriculum.html", short: "DAY" };
    if (!cfg.data) return;
    const { DAYS, PHASES } = cfg.data;
    const done = loadProgress(cfg.key);
    grid.innerHTML = DAYS.map(d => {
      const ph = PHASES[d.phase];
      return `<a class="day-cell ${done[d.n] ? "done" : ""}" href="${cfg.page}#day-${d.n}" style="--phase:${ph.color}">
        <span class="dn">${cfg.short} ${String(d.n).padStart(2, "0")}</span>
        <span class="dt">${d.title}</span>
        <span class="check">${ICON.check}</span>
      </a>`;
    }).join("");
  }

  /* ---------- curriculum / lessons page ---------- */
  function renderCurriculum() {
    const host = $("#days");
    if (!host || !ACTIVE.data || !window.DIAGRAMS) return;
    const { DAYS, PHASES } = ACTIVE.data;

    host.innerHTML = DAYS.map(d => {
      const ph = PHASES[d.phase];
      const fig = window.DIAGRAMS[d.diagram] || "";
      const list = (items, cls) => `<ul class="day-list ${cls || ""}">${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
      return `<article class="day reveal" id="day-${d.n}" data-day="${d.n}" style="--phase:${ph.color}">
        <header class="day-header">
          <div class="day-num">${String(d.n).padStart(2, "0")}<small>${ACTIVE.short}</small></div>
          <div class="day-title">
            <div class="ph-tag">${ph.name}</div>
            <h3>${d.title}</h3>
          </div>
          <label class="day-check" title="Mark complete">
            <input type="checkbox" data-check="${d.n}">
            <span class="box">${ICON.check}</span>
            <span class="lbl">Done</span>
          </label>
        </header>
        <div class="day-body">
          <div class="day-main">
            <p class="day-obj">${d.objective}</p>
            <div class="block-title">Warm-up · 10 min</div>
            ${list(d.warmup, "warmup")}
            <div class="block-title">Main exercise · 30–60 min</div>
            ${list(d.main)}
            <div class="checkpoint">${ICON.check}<div><b>Checkpoint.</b> ${d.checkpoint}</div></div>
            <div class="tip"><b>Pro tip.</b> ${d.tip}</div>
          </div>
          <figure class="day-figure">
            ${fig}
            <figcaption class="fig-cap">Fig. ${d.n} — ${d.title}</figcaption>
          </figure>
        </div>
      </article>`;
    }).join("");

    // side nav
    const side = $("#side-nav");
    if (side) {
      let html = "";
      PHASES.forEach((ph, pi) => {
        html += `<li class="ph" style="--phase:${ph.color}">${ph.name}</li>`;
        DAYS.filter(d => d.phase === pi).forEach(d => {
          html += `<li><a href="#day-${d.n}">${ACTIVE.label} ${d.n} · ${d.title}</a></li>`;
        });
      });
      side.innerHTML = html;
    }

    // wire checkboxes
    const done = loadProgress();
    $$('input[data-check]').forEach(cb => {
      const n = +cb.dataset.check;
      cb.checked = !!done[n];
      cb.closest(".day").classList.toggle("done", cb.checked);
      cb.addEventListener("change", () => {
        setDone(n, cb.checked);
        cb.closest(".day").classList.toggle("done", cb.checked);
      });
    });

    updateProgressBox();
    document.addEventListener("progresschange", updateProgressBox);
  }

  function updateProgressBox() {
    const box = $("#progress-box");
    if (!box || !ACTIVE.data) return;
    const total = ACTIVE.data.DAYS.length;
    const done = Object.keys(loadProgress()).length;
    const pct = Math.round((done / total) * 100);
    const pctEl = $(".pct", box), barEl = $(".bar > i", box), cntEl = $(".cnt", box);
    if (pctEl) pctEl.textContent = pct + "%";
    if (barEl) barEl.style.width = pct + "%";
    if (cntEl) cntEl.textContent = `${done} of ${total} ${ACTIVE.label.toLowerCase()}s complete`;
  }

  /* ---------- reference figures ---------- */
  function renderReferenceFigures() {
    if (!window.DIAGRAMS) return;
    $$("[data-diagram]").forEach(el => {
      const key = el.getAttribute("data-diagram");
      if (window.DIAGRAMS[key]) el.innerHTML = window.DIAGRAMS[key];
    });
  }

  /* ---------- nav active link ---------- */
  function initNavActive() {
    const path = location.pathname.split("/").pop() || "index.html";
    $$(".nav-links a").forEach(a => {
      const href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
    });
  }

  /* ---------- reset ---------- */
  function initReset() {
    const btn = $("#reset-progress");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (confirm("Reset all progress for this module?")) {
        localStorage.removeItem(ACTIVE.key);
        $$('input[data-check]').forEach(cb => {
          cb.checked = false;
          cb.closest(".day").classList.remove("done");
        });
        document.dispatchEvent(new CustomEvent("progresschange"));
      }
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    ACTIVE = resolveActive();
    initTheme();
    initNavActive();
    renderRoadmap();
    renderCurriculum();
    renderReferenceFigures();
    initReset();
    initReveal();
  });
})();
