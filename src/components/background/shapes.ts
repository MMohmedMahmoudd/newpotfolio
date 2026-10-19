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

/** Stage 0: a lobed, two-hemisphere "neural orb" with a central fissure. */
function fillOrb(count: number, rng: Rng, out: Float32Array) {
  for (let i = 0; i < count; i++) {
    const [x, y, z] = randomDirection(rng);
    const side = x >= 0 ? 1 : -1;
    const ripple =
      1 +
      0.07 * Math.sin(9 * y + 5 * z) * Math.cos(7 * x + 3 * z) +
      0.05 * Math.sin(13 * z + 4 * y);
    const shell = rng() < 0.82 ? 1 : 0.35 + 0.6 * rng();
    let px = x * 3.5 * ripple * shell + side * 0.18;
    let py = y * 2.7 * ripple * shell;
    let pz = z * 2.5 * ripple * shell;

    if (py < -1.9) py = -1.9 + (py + 1.9) * 0.35;
    if (rng() < 0.03) {
      px = (rng() - 0.5) * 0.5;
      py = -2.4 - rng() * 1.6;
      pz = (rng() - 0.5) * 0.5;
    }
    out[i * 3] = px;
    out[i * 3 + 1] = py;
    out[i * 3 + 2] = pz;
  }
}

/** Stage 1: wide scattered cloud. */
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

/** Stage 2: four-armed spiral disc. */
function fillSpiral(count: number, rng: Rng, out: Float32Array) {
  const arms = 4;
  for (let i = 0; i < count; i++) {
    const r = Math.pow(rng(), 0.62) * 9;
    const arm = Math.floor(rng() * arms);
    const angle = r * 0.85 + (arm * Math.PI * 2) / arms + gauss(rng) * 0.22;
    out[i * 3] = Math.cos(angle) * r;
    out[i * 3 + 1] = gauss(rng) * 0.45 * (1 - r / 12);
    out[i * 3 + 2] = Math.sin(angle) * r * 0.55 - 2;
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

/** Palette index: 0 yellow, 1 purple, 2 white, 3 teal. Spatially coherent. */
function pickPalette(rng: Rng, x: number, y: number, z: number) {
  const n = Math.sin(x * 1.3 + y * 0.7) * Math.cos(z * 1.1 - y * 0.9);
  const r = rng() * 0.7 + (n * 0.5 + 0.5) * 0.3;
  if (r < 0.34) return 0;
  if (r < 0.58) return 1;
  if (r < 0.82) return 2;
  return 3;
}

export function createMainSwarm(count: number, letter: string): SwarmData {
  const rng = mulberry32(1337);
  const stages: Stages = [
    new Float32Array(count * 3),
    new Float32Array(count * 3),
    new Float32Array(count * 3),
    new Float32Array(count * 3),
  ];
  fillOrb(count, rng, stages[0]);
  fillCloud(count, rng, stages[1], { x: 34, y: 20, zMin: -6, zMax: 6 });
  fillSpiral(count, rng, stages[2]);
  fillLetter(count, rng, stages[3], letter);

  const palette = new Float32Array(count);
  const seeds = new Float32Array(count);
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    palette[i] = pickPalette(
      rng,
      stages[0][i * 3],
      stages[0][i * 3 + 1],
      stages[0][i * 3 + 2]
    );
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
