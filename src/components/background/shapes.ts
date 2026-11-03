export type Stages = [Float32Array, Float32Array, Float32Array, Float32Array];

export type SwarmData = {
  count: number;
  stages: Stages;
  palette: Float32Array;
  palette2: Float32Array;
  /** palette index for the </> VERTEX stage, or -1 when hidden in it */
  word: Float32Array;
  seeds: Float32Array;
  scales: Float32Array;
};

type Rng = () => number;

function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rng: Rng) {
  const u = Math.max(rng(), 1e-9);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function randomDirection(rng: Rng): [number, number, number] {
  const x = gauss(rng);
  const y = gauss(rng);
  const z = gauss(rng);
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
}

/** Ridged, domain-warped sine noise (0..1) that reads as cortical folds. */
function folds(x: number, y: number, z: number) {
  const wx = x + 0.6 * Math.sin(2.1 * y + 1.3 * z);
  const wy = y + 0.6 * Math.sin(1.9 * z + 0.7 * x);
  const wz = z + 0.6 * Math.sin(2.3 * x + 1.1 * y);
  const a = Math.sin(5.2 * wx) * Math.sin(4.6 * wy + 1) * Math.sin(5.8 * wz + 2);
  const b = Math.sin(9.7 * wx + wy * 2) * Math.sin(8.9 * wz - wy) * 0.5;
  return 1 - Math.min(1, Math.abs(a + b * 0.6));
}

/** Evenly spaced direction `k` of `n` on a sphere (golden-angle spiral). */
function fibonacciDirection(k: number, n: number): [number, number, number] {
  const y = 1 - (2 * (k + 0.5)) / n;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const phi = k * 2.399963229728653;
  return [Math.cos(phi) * r, y, Math.sin(phi) * r];
}

/** Radius of a superellipsoid along unit direction d: boxier than a sphere when p > 2. */
function boxy(dx: number, dy: number, dz: number, p: number) {
  const sum = Math.pow(Math.abs(dx), p) + Math.pow(Math.abs(dy), p) + Math.pow(Math.abs(dz), p);
  return 1 / Math.pow(sum, 1 / p);
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Stage 0: brain in side profile, modelled on the reference. The frontal lobe
 * faces +x, the cerebellum sits low at the back (-x) and the stem hangs below.
 * It is a hollow, boxy shell (flat underside, vertical front) sampled on an even
 * lattice. Points in a fold's groove are mostly dropped and the surface facing
 * the camera is thinned, so the near side is a sparse lattice of large pyramids
 * while the silhouette and the underside ledge are dense bands of small ones.
 * `rim` receives 1 - |normal.z| (1 = silhouette) and drives colour and size.
 */
function fillBrain(count: number, rng: Rng, out: Float32Array, rim: Float32Array) {
  const nRim = Math.floor(count * 0.3);
  const nCerebrum = Math.floor(count * 0.45);
  const nTemporal = Math.floor(count * 0.05);
  const nCerebellum = Math.floor(count * 0.05);
  const nBottom = Math.floor(count * 0.1);
  const nStem = count - nRim - nCerebrum - nTemporal - nCerebellum - nBottom;

  const pts: number[] = [];
  const rims: number[] = [];
  const put = (x: number, y: number, z: number, r: number) => {
    pts.push(x, y, z);
    rims.push(r);
  };

  // maps a direction on the unit sphere onto the boxy cerebrum shell
  const cerebrumPoint = (dx: number, dy: number, dz: number, f: number, inner: number) => {
    const kk = (1 + 0.1 * (f - 0.5) * 2) * inner * boxy(dx, dy, dz, 2.15);
    const px = dx * 3.5 * kk;
    let py = dy * 3.05 * kk;
    let pz = dz * 2.2 * kk;
    pz += (pz >= 0 ? 1 : -1) * 0.14;
    if (Math.abs(pz) < 0.32 && py > 0) py -= 0.12; // longitudinal fissure
    if (py < -2.15) py = -2.15 + (py + 2.15) * 0.25; // flat underside
    py *= 1 - 0.2 * Math.max(0, -px / 3.5); // taper toward the occipital pole
    py *= 1 - 0.08 * Math.max(0, px / 3.5); // taper toward the occipital pole
    return [px, py, pz] as const;
  };

  // cerebrum surface. The lattice is scanned with a stride coprime to its size so
  // the whole sphere is visited, not just the part the spiral reaches first.
  const nFib = nCerebrum * 3;
  let stride = 7919;
  while (gcd(stride, nFib) !== 1) stride += 2;
  let placed = 0;
  for (let k = 0; placed < nCerebrum && k < nFib; k++) {
    const [dx, dy, dz] = fibonacciDirection((k * stride) % nFib, nFib);
    const f = folds(dx * 2.2, dy * 2.2, dz * 2.2);
    if (f < 0.32 && rng() < 0.8) continue; // groove between two gyri
    if (Math.abs(dz) > 0.55 && rng() < 0.15) continue; // thin the camera-facing side
    const inner = rng() < 0.04 ? 0.84 + 0.1 * rng() : 1; // a few points just under the surface
    const [px, py, pz] = cerebrumPoint(dx, dy, dz, f, inner);
    put(px, py, pz, 1 - Math.abs(dz));
    placed++;
  }
  // silhouette ring: the band of the cerebrum seen edge-on from the side
  for (let k = 0; k < nRim; k++) {
    const dz = (rng() - 0.5) * 0.9;
    const phi = k * 2.399963229728653;
    const rad = Math.sqrt(1 - dz * dz);
    const dx = Math.cos(phi) * rad;
    const dy = Math.sin(phi) * rad;
    const f = folds(dx * 2.2, dy * 2.2, dz * 2.2);
    const [px, py, pz] = cerebrumPoint(dx, dy, dz, f, 1 + 0.03 * (rng() - 0.5));
    put(px, py, pz, 1);
  }
  // the flat underside, seen edge-on as a thick ledge
  for (let k = 0; k < nBottom; k++) {
    const rr = Math.sqrt((k + 0.5) / nBottom);
    const phi = k * 2.399963229728653;
    put(
      Math.cos(phi) * rr * 3.0 - 0.2,
      -2.0 - 0.35 * (1 - rr * rr) + (rng() - 0.5) * 0.14,
      Math.sin(phi) * rr * 2.1,
      0.96
    );
  }
  // temporal lobes
  for (let k = 0; k < nTemporal; k++) {
    const [dx, dy, dz] = fibonacciDirection(k, nTemporal);
    const side = k % 2 === 0 ? -1 : 1;
    const f = folds(dx * 2.6 + 3, dy * 2.6, dz * 2.6);
    if (f < 0.3 && rng() < 0.7) continue;
    const kk = 1 + 0.1 * (f - 0.5) * 2;
    put(0.9 + dx * 1.9 * kk, -1.55 + dy * 0.75 * kk, side * 1.35 + dz * 0.8 * kk, 1 - Math.abs(dz));
  }
  // cerebellum: small and tightly striped
  for (let k = 0; k < nCerebellum; k++) {
    const [dx, dy, dz] = fibonacciDirection(k, nCerebellum);
    const kk = 1 + 0.08 * Math.sin((-1.65 + dy * 0.85) * 16);
    put(-2.25 + dx * 1.4 * kk, -1.65 + dy * 0.85 * kk, dz * 1.5 * kk, 1 - Math.abs(dz));
  }
  // brain stem
  for (let k = 0; k < nStem; k++) {
    const t = k / Math.max(1, nStem - 1);
    const a = k * 2.399963229728653;
    const radius = 0.55 * (1 - 0.2 * t);
    put(-0.45 - t * 0.4 + Math.cos(a) * radius, -2.25 - t * 1.9, Math.sin(a) * radius, 0.5);
  }

  // groove rejection can leave a few slots empty; fill them from existing points
  const total = pts.length / 3;
  for (let i = 0; i < count; i++) {
    const j = i < total ? i : Math.floor(rng() * total);
    out[i * 3] = pts[j * 3];
    out[i * 3 + 1] = pts[j * 3 + 1];
    out[i * 3 + 2] = pts[j * 3 + 2];
    rim[i] = rims[j];
  }
}

/**
 * Stage 0 from a real scan: surface samples baked by scripts/bake-brain.mjs
 * (x, y, z, nx, ny, nz per point; model units, y up, front at -x).
 * The model is mirrored so the frontal lobe faces +x and the stem sits left of
 * centre, scaled to the same size as the procedural brain, and the long stem is
 * cut short. Points whose surface faces the camera are mostly dropped, so the near
 * side is a sparse lattice while the silhouette - where normals are edge-on - stays
 * dense. `rim` receives 1 - |nz| as for the procedural brain.
 */
function fillBrainScan(
  count: number,
  rng: Rng,
  out: Float32Array,
  rim: Float32Array,
  scan: Float32Array
) {
  const n = scan.length / 6;
  const scale = 0.043;
  const cutY = 45; // model units: drops the lower part of the stem
  const centreY = 150;
  const used = new Uint8Array(n);
  let i = 0;
  for (let guard = 0; i < count && guard < n * 60; guard++) {
    const k = Math.floor(rng() * n);
    if (used[k] || scan[k * 6 + 1] < cutY) continue;
    const r = 1 - Math.abs(scan[k * 6 + 5]);
    const stem = scan[k * 6 + 1] < 92; // the brain stem is thin: keep most of it
    const r3 = r * r * r;
    if (rng() > (stem ? 0.95 : 0.05 + 0.95 * r3 * r3)) continue;
    used[k] = 1;
    out[i * 3] = -scan[k * 6] * scale;
    out[i * 3 + 1] = (scan[k * 6 + 1] - centreY) * scale;
    out[i * 3 + 2] = scan[k * 6 + 2] * scale;
    rim[i] = r;
    i++;
  }
  // very unlikely: not enough accepted points; repeat the ones we have
  for (let j = i; j < count; j++) {
    const src = Math.floor(rng() * Math.max(1, i));
    out[j * 3] = out[src * 3];
    out[j * 3 + 1] = out[src * 3 + 1];
    out[j * 3 + 2] = out[src * 3 + 2];
    rim[j] = rim[src];
  }
}

function continents(x: number, y: number, z: number) {
  return (
    Math.sin(2.6 * x + 0.8) * Math.cos(2.2 * y - 0.4) +
    0.8 * Math.sin(3.4 * z + 2 * x) +
    0.5 * Math.sin(5.1 * x * y + z * 2)
  );
}

/** Stage 1: globe with dense continents, sparse oceans, graticule and orbit ring. */
function fillGlobe(count: number, rng: Rng, out: Float32Array) {
  const R = 3.7;
  const deg = Math.PI / 180;
  for (let i = 0; i < count; i++) {
    const u = rng();
    let x: number;
    let y: number;
    let z: number;

    if (u < 0.12) {
      const a = rng() * Math.PI * 2;
      const rr = 5.4 + gauss(rng) * 0.07;
      x = Math.cos(a) * rr;
      y = gauss(rng) * 0.04;
      z = Math.sin(a) * rr;
    } else if (u < 0.32) {
      let lat: number;
      let lon: number;
      if (rng() < 0.5) {
        lat = (Math.floor(rng() * 9) - 4) * 20 * deg;
        lon = rng() * Math.PI * 2;
      } else {
        lon = Math.floor(rng() * 12) * 30 * deg;
        lat = (rng() - 0.5) * Math.PI;
      }
      x = Math.cos(lat) * Math.cos(lon) * R * 1.008;
      y = Math.sin(lat) * R * 1.008;
      z = Math.cos(lat) * Math.sin(lon) * R * 1.008;
    } else {
      let dx = 0;
      let dy = 0;
      let dz = 0;
      for (let tries = 0; tries < 12; tries++) {
        [dx, dy, dz] = randomDirection(rng);
        if (continents(dx, dy, dz) > 0.45 || rng() < 0.03) break;
      }
      const r = R * (1 + gauss(rng) * 0.01);
      x = dx * r;
      y = dy * r;
      z = dz * r;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
}

/** Wide scattered cloud (used by the drifting foreground pyramids). */
function fillCloud(
  count: number,
  rng: Rng,
  out: Float32Array,
  spread: { x: number; y: number; zMin: number; zMax: number }
) {
  for (let i = 0; i < count; i++) {
    out[i * 3] = (rng() - 0.5) * spread.x;
    out[i * 3 + 1] = (rng() - 0.5) * spread.y;
    out[i * 3 + 2] = spread.zMin + rng() * (spread.zMax - spread.zMin);
  }
}

/**
 * Stage 2: "</>  VERTEX" wordmark, `width` world units wide. The glyphs are drawn
 * on a 2D canvas and sampled on an even square lattice, so every pyramid lands
 * on its own spot and the letters read cleanly. Only as many instances as there
 * are lattice points are shown; `wordPal` holds their palette index, or -1 for an
 * instance that is hidden while this shape is on screen.
 */
function fillWord(
  count: number,
  rng: Rng,
  out: Float32Array,
  width: number,
  wordPal: Float32Array
) {
  const w = 3000;
  const h = 520;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let data: Uint8ClampedArray | null = null;
  let codeEnd = 0;
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;

  if (ctx) {
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 7;
    ctx.lineJoin = "round";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    const size = 330;
    const font = `800 ${size}px Arial, Helvetica, sans-serif`;
    const glyphs = ["<", "/", ">"];
    const glyphGap = size * 0.16;
    ctx.font = font;
    const codeWidth =
      glyphs.reduce((sum, g) => sum + ctx.measureText(g).width, 0) +
      glyphGap * (glyphs.length - 1);
    const letterSpacing = `${Math.round(size * 0.09)}px`;
    ctx.letterSpacing = letterSpacing;
    const wordWidth = ctx.measureText("VERTEX").width;
    ctx.letterSpacing = "0px";
    const gap = size * 0.5;
    const startX = (w - (codeWidth + gap + wordWidth)) / 2;
    const cy = h / 2 + size * 0.04;
    codeEnd = startX + codeWidth + gap / 2;

    let gx = startX;
    for (const g of glyphs) {
      ctx.strokeText(g, gx, cy);
      ctx.fillText(g, gx, cy);
      gx += ctx.measureText(g).width + glyphGap;
    }
    ctx.letterSpacing = letterSpacing;
    ctx.strokeText("VERTEX", startX + codeWidth + gap, cy);
    ctx.fillText("VERTEX", startX + codeWidth + gap, cy);

    data = ctx.getImageData(0, 0, w, h).data;
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        if (data[(y * w + x) * 4 + 3] > 128) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  // square lattice over the glyph pixels: straight rows keep the letter edges crisp
  const scale = width / Math.max(1, maxX - minX);
  const stepPx = Math.max(3, Math.round(0.062 / scale));
  const lattice: number[] = [];
  if (data) {
    for (let y = minY; y <= maxY; y += stepPx) {
      for (let x = minX; x <= maxX; x += stepPx) {
        if (data[(Math.round(y) * w + Math.round(x)) * 4 + 3] > 128) lattice.push(x, y);
      }
    }
  }

  const cx = (minX + maxX) / 2;
  const cyPx = (minY + maxY) / 2;
  const total = lattice.length / 2;
  const visible = Math.min(total, count);

  // pick which instances are shown by shuffling, so the choice is unrelated to
  // where an instance sits in the other shapes
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  for (let n = 0; n < count; n++) {
    const inst = order[n];
    const shown = n < visible;
    const li = (shown ? Math.floor((n * total) / visible) : Math.floor(rng() * total)) * 2;
    const px = total ? lattice[li] : 0;
    const py = total ? lattice[li + 1] : 0;
    out[inst * 3] = (px - cx) * scale;
    out[inst * 3 + 1] = -(py - cyPx) * scale + 0.4;
    out[inst * 3 + 2] = gauss(rng) * 0.04;
    if (!shown) {
      wordPal[inst] = -1;
    } else if (px < codeEnd) {
      wordPal[inst] = rng() < 0.85 ? 0 : 5; // </> in yellow
    } else {
      const r = rng();
      wordPal[inst] = r < 0.8 ? 2 : r < 0.9 ? 1 : r < 0.96 ? 3 : 6;
    }
  }
}

/**
 * Stage 3: four-petal pinwheel emblem. Each petal is a twisted quarter disc pushed
 * slightly outward from the centre; `quad` records the petal so it gets its own colour.
 */
function fillEmblem(count: number, rng: Rng, out: Float32Array, quad: Uint8Array) {
  const R = 3.3;
  const gap = 0.28;
  const deg = Math.PI / 180;
  for (let i = 0; i < count; i++) {
    const q = Math.floor(rng() * 4);
    const r = R * Math.sqrt(rng());
    const a = (q * 90 + 4 + rng() * 82) * deg + 0.3 * (r / R);
    const bis = (q * 90 + 45) * deg;
    out[i * 3] = Math.cos(a) * r + Math.cos(bis) * gap;
    out[i * 3 + 1] = Math.sin(a) * r + Math.sin(bis) * gap;
    out[i * 3 + 2] = gauss(rng) * 0.22;
    quad[i] = q;
  }
}

/**
 * Palette index (see scene.tsx): 0 yellow, 1 purple, 2 white, 3 teal, 4 pink,
 * 5 orange, 6 blue, 7 green. The silhouette is lit yellow; the interior is mostly
 * white and lavender with scattered colour, as on the reference.
 */
function pickPalette(rng: Rng, rim: number) {
  if (rim > 0.7 && rng() < 0.78) return rng() < 0.9 ? 0 : 5;
  const r = rng();
  if (r < 0.55) return 2;
  if (r < 0.64) return 3;
  if (r < 0.73) return 1;
  if (r < 0.8) return 6;
  if (r < 0.87) return 4;
  if (r < 0.93) return 5;
  if (r < 0.97) return 0;
  return 7;
}

export function createMainSwarm(
  count: number,
  mobile: boolean,
  scan: Float32Array | null
): SwarmData {
  const rng = mulberry32(1337);
  const stages: Stages = [
    new Float32Array(count * 3),
    new Float32Array(count * 3),
    new Float32Array(count * 3),
    new Float32Array(count * 3),
  ];
  const rim = new Float32Array(count);
  if (scan) fillBrainScan(count, rng, stages[0], rim, scan);
  else fillBrain(count, rng, stages[0], rim);
  fillGlobe(count, rng, stages[1]);
  const word = new Float32Array(count);
  fillWord(count, rng, stages[2], mobile ? 5.8 : 7.8, word);
  const quad = new Uint8Array(count);
  fillEmblem(count, rng, stages[3], quad);

  const palette = new Float32Array(count);
  const palette2 = new Float32Array(count);
  const petalColors = [0, 1, 3, 2]; // yellow, purple, teal, white
  const seeds = new Float32Array(count);
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    palette[i] = pickPalette(rng, rim[i]);
    palette2[i] = petalColors[quad[i]];
    seeds[i] = rng();
    // camera-facing pyramids are large, silhouette ones small (as on the reference)
    scales[i] = (0.72 + (1 - rim[i]) * 0.45) * (0.9 + rng() * 0.2);
  }
  return { count, stages, palette, palette2, word, seeds, scales };
}

/** A handful of large pyramids drifting in front of everything. */
export function createDriftSwarm(count: number): SwarmData {
  const rng = mulberry32(4242);
  const base = new Float32Array(count * 3);
  fillCloud(count, rng, base, { x: 30, y: 16, zMin: 1, zMax: 8 });
  const stages: Stages = [base, base, base, base];
  const palette = new Float32Array(count);
  const seeds = new Float32Array(count);
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    palette[i] = Math.floor(rng() * 4);
    seeds[i] = rng();
    scales[i] = 0.6 + rng() * 0.9;
  }
  return { count, stages, palette, palette2: palette, word: palette, seeds, scales };
}
