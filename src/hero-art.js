// Generative background art. The canvas lives outside #swup (see code/page.js)
// and activates only on pages containing a .hero-art-here marker; CSS masks
// fade it toward the bottom, and a veil fades it under the content column.
// Three effects, drawn in theme colors read from CSS variables.
// Cycle effects by clicking the canvas or with ?art=contours|mesh|waves

const EFFECTS = ["contours", "mesh", "waves"];

// --- 3D value noise with fBm ---------------------------------------------
function hash(ix, iy, iz) {
  let h = ix * 374761393 + iy * 668265263 + iz * 2147483647;
  h = (h ^ (h >> 13)) * 1274126177;
  return (((h ^ (h >> 16)) >>> 0) % 1024) / 1024;
}

const smooth = t => t * t * (3 - 2 * t);

function noise3(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = smooth(x - ix), fy = smooth(y - iy), fz = smooth(z - iz);
  let v = 0;
  for (let dz = 0; dz <= 1; dz++) {
    for (let dy = 0; dy <= 1; dy++) {
      for (let dx = 0; dx <= 1; dx++) {
        v +=
          hash(ix + dx, iy + dy, iz + dz) *
          (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy) * (dz ? fz : 1 - fz);
      }
    }
  }
  return v;
}

function fbm(x, y, z) {
  return (noise3(x, y, z) + 0.5 * noise3(x * 2 + 31.7, y * 2 + 11.3, z * 2)) / 1.5;
}

// --- theme colors ----------------------------------------------------------
function themeColors() {
  const css = getComputedStyle(document.documentElement);
  return {
    accent: css.getPropertyValue("--accent").trim() || "#b04a2b",
    muted: css.getPropertyValue("--text-muted").trim() || "#6f6355"
  };
}

// --- shared marching-squares isoline renderer -------------------------------
// `sample(x, y)` returns the scalar field in [0, 1] at canvas coordinates.
function drawIsolines(ctx, w, h, colors, sample) {
  ctx.clearRect(0, 0, w, h);
  const cell = 14;
  const cols = Math.ceil(w / cell) + 1;
  const rows = Math.ceil(h / cell) + 1;

  const field = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      field[j * cols + i] = sample(i * cell, j * cell);
    }
  }

  const levels = 12;
  for (let l = 1; l < levels; l++) {
    const iso = l / levels;
    const index = l % 4 === 0; // every 4th is an "index contour", like real maps
    ctx.strokeStyle = index ? colors.accent : colors.muted;
    ctx.globalAlpha = index ? 0.5 : 0.28;
    ctx.lineWidth = index ? 1.4 : 0.7;
    ctx.beginPath();
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = field[j * cols + i];
        const b = field[j * cols + i + 1];
        const c = field[(j + 1) * cols + i + 1];
        const d = field[(j + 1) * cols + i];
        const code = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0);
        if (code === 0 || code === 15) continue;
        const x = i * cell, y = j * cell;
        const lerp = (v0, v1) => (iso - v0) / (v1 - v0);
        // edge crossings with linear interpolation
        const top = [x + cell * lerp(a, b), y];
        const right = [x + cell, y + cell * lerp(b, c)];
        const bottom = [x + cell * lerp(d, c), y + cell];
        const left = [x, y + cell * lerp(a, d)];
        const seg = pts => {
          ctx.moveTo(pts[0][0], pts[0][1]);
          ctx.lineTo(pts[1][0], pts[1][1]);
        };
        switch (code) {
          case 1: case 14: seg([left, bottom]); break;
          case 2: case 13: seg([bottom, right]); break;
          case 3: case 12: seg([left, right]); break;
          case 4: case 11: seg([top, right]); break;
          case 5: seg([top, left]); seg([bottom, right]); break;
          case 6: case 9: seg([top, bottom]); break;
          case 7: case 8: seg([top, left]); break;
          case 10: seg([top, right]); seg([left, bottom]); break;
        }
      }
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// --- effect: topographic contours -------------------------------------------
function drawContours(ctx, w, h, t, colors) {
  const s = 0.0038;
  drawIsolines(ctx, w, h, colors, (x, y) => fbm(x * s, y * s, t));
}

// --- effect: wave interference ----------------------------------------------
// Circular waves radiating from a few sources; the isolines of their sum make
// slowly breathing interference (moiré) patterns.
function makeWaves(w, h) {
  const sources = [];
  for (let i = 0; i < 4; i++) {
    sources.push({
      x: (0.1 + 0.8 * Math.random()) * w,
      y: (0.1 + 0.8 * Math.random()) * h,
      k: 0.016 + Math.random() * 0.012, // wavenumber
      phase: Math.random() * Math.PI * 2
    });
  }
  return sources;
}

function drawWaves(ctx, w, h, t, colors, sources) {
  drawIsolines(ctx, w, h, colors, (x, y) => {
    let v = 0;
    for (let i = 0; i < sources.length; i++) {
      const s = sources[i];
      const dx = x - s.x, dy = y - s.y;
      v += Math.sin(Math.sqrt(dx * dx + dy * dy) * s.k - t * 5 + s.phase);
    }
    return v / (sources.length * 2) + 0.5;
  });
}

// --- effect: warped graticule ------------------------------------------------
// A regular grid domain-warped by drifting noise — like a map projection
// slowly breathing under distortion.
function drawMesh(ctx, w, h, t, colors) {
  ctx.clearRect(0, 0, w, h);
  const spacing = 64;
  const sample = 12;
  const s = 0.0015;
  const amp = 36;

  const warp = (x, y) => [
    x + (fbm(x * s, y * s, t) - 0.5) * 2 * amp,
    y + (fbm(x * s + 40.2, y * s + 17.8, t + 5) - 0.5) * 2 * amp
  ];

  const strokeLine = (index, points) => {
    ctx.strokeStyle = index ? colors.accent : colors.muted;
    ctx.globalAlpha = index ? 0.4 : 0.24;
    ctx.lineWidth = index ? 1.2 : 0.7;
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]);
    }
    ctx.stroke();
  };

  let li = 0;
  for (let x = 0; x <= w + spacing; x += spacing, li++) {
    const pts = [];
    for (let y = -amp; y <= h + amp; y += sample) pts.push(warp(x, y));
    strokeLine(li % 4 === 0, pts);
  }
  for (let y = 0; y <= h + spacing; y += spacing, li++) {
    const pts = [];
    for (let x = -amp; x <= w + amp; x += sample) pts.push(warp(x, y));
    strokeLine(li % 4 === 0, pts);
  }
  ctx.globalAlpha = 1;
}

// --- lifecycle --------------------------------------------------------------
// The canvas element persists across Swup navigations, so listeners are bound
// once (module-level st); initHeroArt() only toggles visibility and the loop.
let rafId = null;
let st = null;

export function initHeroArt() {
  const wrap = document.getElementById("hero-art");
  const canvas = document.getElementById("hero-art-canvas");
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (!wrap || !canvas) return;

  const active = !!document.querySelector(".hero-art-here");
  wrap.style.display = active ? "block" : "none";
  if (!active) return;

  if (!st) {
    const ctx = canvas.getContext("2d");
    const fromUrl = new URLSearchParams(location.search).get("art");
    st = {
      ctx,
      w: 0,
      h: 0,
      effect: EFFECTS.includes(fromUrl) ? fromUrl : EFFECTS[0],
      colors: themeColors(),
      waves: [],
      t: Math.random() * 100
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.w = canvas.clientWidth;
      st.h = canvas.clientHeight;
      canvas.width = st.w * dpr;
      canvas.height = st.h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.waves = makeWaves(st.w, st.h);
    };
    resize();
    window.addEventListener("resize", resize);

    new MutationObserver(() => {
      st.colors = themeColors();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    canvas.addEventListener("click", () => {
      st.effect = EFFECTS[(EFFECTS.indexOf(st.effect) + 1) % EFFECTS.length];
      st.waves = makeWaves(st.w, st.h);
    });
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // a single, still frame — contours look best static
    drawContours(st.ctx, st.w, st.h, st.t, st.colors);
    return;
  }

  const frame = () => {
    if (!document.hidden) {
      if (st.effect === "contours") drawContours(st.ctx, st.w, st.h, st.t, st.colors);
      else if (st.effect === "mesh") drawMesh(st.ctx, st.w, st.h, st.t, st.colors);
      else drawWaves(st.ctx, st.w, st.h, st.t, st.colors, st.waves);
      st.t += 0.0022;
    }
    rafId = requestAnimationFrame(frame);
  };
  rafId = requestAnimationFrame(frame);
}
