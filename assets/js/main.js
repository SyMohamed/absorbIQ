/* =============================================================
   AbsorbIQ — interactions & canvas animations
   ============================================================= */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Navbar scroll state + progress bar ---------- */
  const nav = document.querySelector(".nav");
  const progress = document.querySelector(".progress");
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 24);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll(".nav-links a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Animated number counters ---------- */
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        const decimals = (el.dataset.count.split(".")[1] || "").length;
        let start = null;
        const dur = 1400;
        function step(t) {
          if (!start) start = t;
          const p = Math.min((t - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        countIO.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------- Market bar fill on view ---------- */
  const bar = document.querySelector(".market-figure .bar i");
  if (bar) {
    const barIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          bar.style.width = "62%";
          barIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    barIO.observe(bar);
  }

  /* ---------- Hero live absorption spectrum ---------- */
  const hv = document.getElementById("hv-spectrum");
  if (hv && !reduce) {
    const ctx = hv.getContext("2d");
    let W, H, dpr;
    function size() {
      dpr = window.devicePixelRatio || 1;
      W = hv.clientWidth; H = hv.clientHeight;
      hv.width = W * dpr; hv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener("resize", size);

    // absorption "lines": position (0..1), depth, width
    const lines = [
      { x: 0.18, d: 0.55, w: 0.018 },
      { x: 0.33, d: 0.85, w: 0.012 },
      { x: 0.46, d: 0.38, w: 0.02 },
      { x: 0.62, d: 0.95, w: 0.014 },
      { x: 0.74, d: 0.5, w: 0.016 },
      { x: 0.88, d: 0.68, w: 0.011 },
    ];
    let phase = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const base = H * 0.32;
      // grid
      ctx.strokeStyle = "rgba(127,227,233,0.07)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        const y = (H / 5) * i;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      // spectrum trace
      ctx.beginPath();
      const pts = [];
      for (let px = 0; px <= W; px += 2) {
        const t = px / W;
        let dip = 0;
        for (const l of lines) {
          const jitter = Math.sin(phase + l.x * 9) * 0.06;
          const depth = l.d * (0.82 + 0.18 * Math.sin(phase * 1.3 + l.x * 5));
          dip += depth * Math.exp(-Math.pow((t - l.x) / l.w, 2));
          dip += jitter * 0.02;
        }
        const noise = (Math.sin(t * 220 + phase * 4) + Math.sin(t * 90 - phase * 3)) * 0.6;
        const y = base + dip * (H * 0.55) + noise;
        pts.push([px, y]);
        if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
      }
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, "#7fe3e9");
      grad.addColorStop(0.5, "#1aadbe");
      grad.addColorStop(1, "#00bfa5");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = "rgba(26,173,190,0.6)";
      ctx.shadowBlur = 8;
      ctx.stroke();
      // fill under curve
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      const fill = ctx.createLinearGradient(0, 0, 0, H);
      fill.addColorStop(0, "rgba(26,173,190,0.22)");
      fill.addColorStop(1, "rgba(26,173,190,0)");
      ctx.shadowBlur = 0;
      ctx.fillStyle = fill;
      ctx.fill();

      phase += 0.012;
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------- Live readout numbers (hero card) ---------- */
  const readouts = document.querySelectorAll(".hv-readout .val");
  if (readouts.length && !reduce) {
    setInterval(() => {
      readouts.forEach((el) => {
        const base = parseFloat(el.dataset.base);
        const vary = parseFloat(el.dataset.vary);
        const dec = parseInt(el.dataset.dec || "1", 10);
        const v = base + (Math.random() - 0.5) * 2 * vary;
        el.textContent = v.toFixed(dec);
      });
    }, 1600);
  }

  /* ---------- Background drifting molecular particles ---------- */
  const bg = document.getElementById("spectra-canvas");
  if (bg && !reduce) {
    const c = bg.getContext("2d");
    let W, H, dpr, parts = [];
    function sz() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      bg.width = W * dpr; bg.height = H * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.round((W * H) / 26000));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.8 + 0.6,
      }));
    }
    sz();
    window.addEventListener("resize", sz);
    function tick() {
      c.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      // links
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i], b = parts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            c.strokeStyle = `rgba(26,173,190,${(1 - dist / 130) * 0.16})`;
            c.lineWidth = 1;
            c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
          }
        }
      }
      for (const p of parts) {
        c.fillStyle = "rgba(127,227,233,0.55)";
        c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.fill();
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------- Year in footer ---------- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* =============================================================
   Enhancements — spotlight, tilt, magnetic, scrollspy, scroll cue
   ============================================================= */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* cursor-tracked spotlight on cards */
  document.querySelectorAll("[data-spotlight]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  });

  if (!reduce) {
    /* 3D tilt */
    document.querySelectorAll(".tilt").forEach((el) => {
      const MAX = 7;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${(-py * MAX).toFixed(2)}deg) rotateY(${(px * MAX).toFixed(2)}deg)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });

    /* magnetic buttons */
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* scroll cue fade */
  const cue = document.querySelector(".scroll-cue");
  if (cue) {
    window.addEventListener("scroll", () => {
      cue.classList.toggle("hide", window.scrollY > 180);
    }, { passive: true });
  }

  /* scrollspy — highlight active nav link */
  const sections = [...document.querySelectorAll("main section[id]")];
  const linkFor = (id) => document.querySelector('.nav-links a[href="#' + id + '"]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        document.querySelectorAll(".nav-links a.active").forEach((a) => a.classList.remove("active"));
        const link = linkFor(e.target.id);
        if (link) link.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));
})();
