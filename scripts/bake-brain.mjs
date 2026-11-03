// Samples points (with normals) from the source brain mesh and writes a small
// binary used by src/components/background/shapes.ts.
//
//   node scripts/bake-brain.mjs [source.glb] [count]
//
// Output layout: Float32 [x, y, z, nx, ny, nz] x count, little-endian.
// Source model: "3D model of the Brain" by Nevit Dilmen, NIH 3D, CC BY-SA 4.0.
import fs from "node:fs";
import path from "node:path";

const src = process.argv[2] ?? "assets-src/3dmodel_of_brain_nevitdilmen-custom.glb";
const count = Number(process.argv[3] ?? 24000);
const out = "public/models/brain-points.bin";

const buf = fs.readFileSync(src);
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString());
const binStart = 20 + jsonLen + 8;

function accessor(i) {
  const a = gltf.accessors[i];
  const v = gltf.bufferViews[a.bufferView];
  const comps = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[a.type];
  const start = binStart + (v.byteOffset ?? 0) + (a.byteOffset ?? 0);
  const stride = v.byteStride ?? comps * (a.componentType === 5126 ? 4 : a.componentType === 5125 ? 4 : 2);
  return { a, comps, start, stride };
}

const prim = gltf.meshes[0].primitives[0];
const pos = accessor(prim.attributes.POSITION);
const nor = accessor(prim.attributes.NORMAL);
const idx = prim.indices !== undefined ? accessor(prim.indices) : null;

const getV = (acc, i) => {
  const o = acc.start + i * acc.stride;
  return [buf.readFloatLE(o), buf.readFloatLE(o + 4), buf.readFloatLE(o + 8)];
};
const getI = (k) => {
  if (!idx) return k;
  const o = idx.start + k * idx.stride;
  return idx.a.componentType === 5125 ? buf.readUInt32LE(o) : buf.readUInt16LE(o);
};

const triCount = idx ? idx.a.count / 3 : pos.a.count / 3;
const cdf = new Float64Array(triCount);
let total = 0;
for (let t = 0; t < triCount; t++) {
  const p0 = getV(pos, getI(t * 3));
  const p1 = getV(pos, getI(t * 3 + 1));
  const p2 = getV(pos, getI(t * 3 + 2));
  const ux = p1[0] - p0[0], uy = p1[1] - p0[1], uz = p1[2] - p0[2];
  const vx = p2[0] - p0[0], vy = p2[1] - p0[1], vz = p2[2] - p0[2];
  const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
  total += 0.5 * Math.hypot(cx, cy, cz);
  cdf[t] = total;
}

// deterministic RNG so the baked file is reproducible
let seed = 20260101;
const rnd = () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const result = new Float32Array(count * 6);
for (let i = 0; i < count; i++) {
  const r = rnd() * total;
  let lo = 0, hi = triCount - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cdf[mid] < r) lo = mid + 1; else hi = mid;
  }
  const i0 = getI(lo * 3), i1 = getI(lo * 3 + 1), i2 = getI(lo * 3 + 2);
  let u = rnd(), v = rnd();
  if (u + v > 1) { u = 1 - u; v = 1 - v; }
  const w = 1 - u - v;
  const P = [i0, i1, i2].map((k) => getV(pos, k));
  const N = [i0, i1, i2].map((k) => getV(nor, k));
  for (let c = 0; c < 3; c++) {
    result[i * 6 + c] = P[0][c] * w + P[1][c] * u + P[2][c] * v;
    result[i * 6 + 3 + c] = N[0][c] * w + N[1][c] * u + N[2][c] * v;
  }
  const l = Math.hypot(result[i * 6 + 3], result[i * 6 + 4], result[i * 6 + 5]) || 1;
  for (let c = 3; c < 6; c++) result[i * 6 + c] /= l;
}

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, Buffer.from(result.buffer));
console.log(`wrote ${out}: ${count} points, ${(result.byteLength / 1024).toFixed(0)} KB, surface area ${total.toFixed(0)}`);
