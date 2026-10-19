export type Stages = [Float32Array, Float32Array, Float32Array, Float32Array];

export type SwarmData = {
  count: number;
  stages: Stages;
  palette: Float32Array;
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

/**
 * Stage 0: side-profile brain. The frontal lobe faces +x, the cerebellum sits
 * low at the back (-x), and the hemispheres are split along z.
 * `rim` receives 1 - |normal.z| so silhouette particles can be lit yellow.
 */
function fillBrain(count: number, rng: Rng, out: Float32Array, rim: Float32Array) {
  for (let i = 0; i < count; i++) {
    const part = rng();
    const [dx, dy, dz] = randomDirection(rng);
    let px = 0;
    let py = 0;
    let pz = 0;
    let rimValue = 1 - Math.abs(dz);

    if (part < 0.72) {
      // cerebrum: two hemispheres, folded surface
      const f = folds(dx * 2.2, dy * 2.2, dz * 2.2);
      const k = 1 + 0.12 * (f - 0.5) * 2;
      px = dx * 3.7 * k;
      py = dy * 2.55 * k;
      pz = dz * 2.35 * k;

      const side = pz >= 0 ? 1 : -1;
      pz += side * 0.14;
      if (Math.abs(pz) < 0.32 && py > 0) py -= 0.12; // longitudinal fissure
      if (py < -1.45) py = -1.45 + (py + 1.45) * 0.3; // flat underside
      py *= 1 - 0.12 * Math.max(0, -px / 3.7); // taper toward the occipital pole
      if (rng() < 0.12) {
        const s = 0.45 + 0.5 * rng();
        px *= s;
        py *= s;
        pz *= s;
      }
    } else if (part < 0.83) {
      // temporal lobes: lower bulge on each side
      const side = rng() < 0.5 ? -1 : 1;
      const f = folds(dx * 2.6 + 3, dy * 2.6, dz * 2.6);
      const k = 1 + 0.1 * (f - 0.5) * 2;
      px = 0.9 + dx * 1.9 * k;
      py = -1.55 + dy * 0.8 * k;
      pz = side * 1.35 + dz * 0.8 * k;
    } else if (part < 0.94) {
      // cerebellum: small, tightly striped
      const k = 1 + 0.08 * Math.sin((-1.95 + dy * 0.85) * 16);
      px = -2.25 + dx * 1.4 * k;
      py = -1.95 + dy * 0.85 * k;
      pz = dz * 1.5 * k;
    } else {
      // brain stem
      const t = rng();
      const a = rng() * Math.PI * 2;
      const radius = 0.38 * (1 - 0.25 * t);
      px = -0.7 - t * 0.55 + Math.cos(a) * radius;
      py = -1.9 - t * 1.9;
      pz = Math.sin(a) * radius;
      rimValue = 0.4;
    }

    out[i * 3] = px;
    out[i * 3 + 1] = py;
    out[i * 3 + 2] = pz;
    rim[i] = rimValue;
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

/** Stage 2: "</>  VERTEX" wordmark sampled from a 2D canvas, `width` world units wide. */
function fillWord(count: number, rng: Rng, out: Float32Array, width: number) {
  const w = 2000;
  const h = 520;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const points: number[] = [];
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;

  if (ctx) {
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    const size = 330;
    const codeFont = `800 ${size}px Arial, Helvetica, sans-serif`;
    const wordFont = `800 ${size}px Arial, Helvetica, sans-serif`;
    const glyphs = ["<", "/", ">"];
    const glyphGap = size * 0.16;
    ctx.font = codeFont;
    const codeWidth =
      glyphs.reduce((sum, g) => sum + ctx.measureText(g).width, 0) +
      glyphGap * (glyphs.length - 1);
    ctx.font = wordFont;
    const wordWidth = ctx.measureText("VERTEX").width;
    const gap = size * 0.5;
    const startX = (w - (codeWidth + gap + wordWidth)) / 2;
    const cy = h / 2 + size * 0.04;

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 8;
    ctx.lineJoin = "round";
    ctx.font = codeFont;
    let gx = startX;
    for (const g of glyphs) {
      ctx.strokeText(g, gx, cy);
      ctx.fillText(g, gx, cy);
      gx += ctx.measureText(g).width + glyphGap;
    }
    ctx.font = wordFont;
    ctx.strokeText("VERTEX", startX + codeWidth + gap, cy);
    ctx.fillText("VERTEX", startX + codeWidth + gap, cy);

    const { data } = ctx.getImageData(0, 0, w, h);
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        if (data[(y * w + x) * 4 + 3] > 128) {
          points.push(x, y);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  const total = points.length / 2;
  const scale = width / Math.max(1, maxX - minX);
  const cx = (minX + maxX) / 2;
  const cyPx = (minY + maxY) / 2;
  for (let i = 0; i < count; i++) {
    if (total === 0) {
      out[i * 3] = (rng() - 0.5) * width;
      out[i * 3 + 1] = (rng() - 0.5) * 2;
      out[i * 3 + 2] = 0;
      continue;
    }
    const k = Math.floor(rng() * total) * 2;
    out[i * 3] = (points[k] - cx) * scale;
    out[i * 3 + 1] = -(points[k + 1] - cyPx) * scale + 0.4;
    out[i * 3 + 2] = gauss(rng) * 0.35;
  }
}

/** Stage 3: letterform sampled from a 2D canvas. */
function fillLetter(count: number, rng: Rng, out: Float32Array, letter: string) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const points: number[] = [];

  if (ctx) {
    ctx.fillStyle = "#fff";
    ctx.font = `800 ${size * 0.86}px Arial, Helvetica, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, size / 2, size / 2 + size * 0.04);
    const { data } = ctx.getImageData(0, 0, size, size);
    for (let y = 0; y < size; y += 2) {
      for (let x = 0; x < size; x += 2) {
        if (data[(y * size + x) * 4 + 3] > 128) points.push(x, y);
      }
    }
  }

  const total = points.length / 2;
  for (let i = 0; i < count; i++) {
    if (total === 0) {
      out[i * 3] = (rng() - 0.5) * 6;
      out[i * 3 + 1] = (rng() - 0.5) * 6;
      out[i * 3 + 2] = 0;
      continue;
    }
    const k = Math.floor(rng() * total) * 2;
    out[i * 3] = (points[k] / size - 0.5) * 6.4;
    out[i * 3 + 1] = -(points[k + 1] / size - 0.5) * 6.4 + 1.6;
    out[i * 3 + 2] = gauss(rng) * 0.5;
  }
}

/** Palette index: 0 yellow, 1 purple, 2 white, 3 teal. Silhouette is lit yellow. */
function pickPalette(rng: Rng, rim: number) {
  if (rim > 0.72 && rng() < 0.65) return 0;
  const r = rng();
  if (r < 0.14) return 0;
  if (r < 0.52) return 1;
  if (r < 0.82) return 2;
  return 3;
}

export function createMainSwarm(
  count: number,
  letter: string,
  mobile: boolean
): SwarmData {
  const rng = mulberry32(1337);
  const stages: Stages = [
    new Float32Array(count * 3),
    new Float32Array(count * 3),
    new Float32Array(count * 3),
    new Float32Array(count * 3),
  ];
  const rim = new Float32Array(count);
  fillBrain(count, rng, stages[0], rim);
  fillGlobe(count, rng, stages[1]);
  fillWord(count, rng, stages[2], mobile ? 9.5 : 13);
  fillLetter(count, rng, stages[3], letter);

  const palette = new Float32Array(count);
  const seeds = new Float32Array(count);
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    palette[i] = pickPalette(rng, rim[i]);
    seeds[i] = rng();
    scales[i] = 0.7 + rng() * 0.7;
  }
  return { count, stages, palette, seeds, scales };
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
  return { count, stages, palette, seeds, scales };
}
