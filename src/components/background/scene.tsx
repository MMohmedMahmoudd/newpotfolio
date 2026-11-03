"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { createDriftSwarm, createMainSwarm, type SwarmData } from "./shapes";

type SceneState = {
  stage: number;
  x: number; // horizontal position as a fraction of the viewport width
  opacity: number;
  shiftX: number;
  scrollWorld: number;
  time: number;
};

// Palette indices used by shapes.ts:
// 0 yellow, 1 purple, 2 white, 3 teal, 4 pink, 5 orange, 6 blue, 7 green
const DARK_COLORS = [
  "#ffc21a",
  "#8a5cff",
  "#f1eeff",
  "#2dd4bf",
  "#f472b6",
  "#fb923c",
  "#3b82f6",
  "#a3e635",
];
const LIGHT_COLORS = [
  "#d99a00",
  "#6d3df0",
  "#334155",
  "#0f9b8e",
  "#db2777",
  "#ea580c",
  "#2563eb",
  "#65a30d",
];

// One keyframe per page section. `stage` picks the shape (0 brain, 1 globe,
// 2 </> VERTEX, 3 emblem) - each shape spans two sections - `x` which side it
// sits on (the section text is on the opposite side) and `opacity` how bright it is.
type Keyframe = { id: string; stage: number; x: number; opacity: number };
const KEYFRAMES: Keyframe[] = [
  // brain: hero (right) -> about (left)
  { id: "home", stage: 0, x: 0.23, opacity: 1 },
  { id: "about", stage: 0, x: -0.23, opacity: 0.9 },
  // globe: skills (right) -> projects (left)
  { id: "skills", stage: 1, x: 0.23, opacity: 0.8 },
  { id: "projects", stage: 1, x: -0.23, opacity: 0.7 },
  // </> VERTEX: experience (right) -> expertise (left)
  { id: "experience", stage: 2, x: 0.23, opacity: 0.85 },
  { id: "knowledge", stage: 2, x: -0.23, opacity: 0.75 },
  // emblem: testimonials (right) -> writing (left), then contact (right)
  { id: "testimonials", stage: 3, x: 0.23, opacity: 0.75 },
  { id: "writing", stage: 3, x: -0.23, opacity: 0.75 },
  { id: "contact", stage: 3, x: 0.23, opacity: 0.8 },
];

type Target = { stage: number; x: number; opacity: number };

const smooth = (t: number, a: number, b: number) => {
  const k = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

/**
 * Each keyframe holds for its whole section; the shape only travels across the
 * boundary between two sections. `tops` are the section tops in document
 * coordinates (NaN when a section is missing) and `reach` is half the
 * transition length in pixels.
 */
function targetFor(y: number, tops: number[], reach: number): Target {
  const out: Target = { ...KEYFRAMES[0] };
  for (let i = 1; i < KEYFRAMES.length; i++) {
    if (!Number.isFinite(tops[i])) continue; // not measured yet, or section missing
    const t = smooth(y, tops[i] - reach, tops[i] + reach);
    out.stage += (KEYFRAMES[i].stage - KEYFRAMES[i - 1].stage) * t;
    out.x += (KEYFRAMES[i].x - KEYFRAMES[i - 1].x) * t;
    out.opacity += (KEYFRAMES[i].opacity - KEYFRAMES[i - 1].opacity) * t;
  }
  return out;
}

// Each pyramid edge is drawn as a screen-space quad so the outline can be a
// constant, readable thickness (plain GL lines are always 1px).
const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uStage;
  uniform float uSize;
  uniform float uOpacity;
  uniform float uFlow;
  uniform float uScroll;
  uniform float uThickness;
  uniform vec2 uResolution;
  uniform vec3 uShift;
  uniform vec3 uColors[8];

  attribute vec3 aA;
  attribute vec3 aB;
  attribute float aEnd;
  attribute float aSide;

  attribute vec3 aP0;
  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute float aSeed;
  attribute float aPalette;
  attribute float aPalette2;
  attribute float aWord;
  attribute float aScale;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 rotX(vec3 v, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(v.x, c * v.y - s * v.z, s * v.y + c * v.z);
  }

  vec3 rotY(vec3 v, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z);
  }

  vec3 rotZ(vec3 v, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(c * v.x - s * v.y, s * v.x + c * v.y, v.z);
  }

  float ease(float t) {
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    float s = clamp(uStage, 0.0, 3.0);
    float seg = min(floor(s), 2.0);
    float t = s - seg;
    float tt = ease(clamp(t * 1.5 - aSeed * 0.5, 0.0, 1.0));

    // globe: spin about a tilted axis
    vec3 globe = rotZ(rotY(aP1, uTime * 0.18), 0.4);

    vec3 a = aP0;
    vec3 b = globe;
    if (seg > 0.5 && seg < 1.5) { a = globe; b = aP2; }
    if (seg > 1.5) { a = aP2; b = aP3; }

    vec3 p = mix(a, b, tt);

    // scatter only while travelling: squared so it is ~0 just before a shape lands
    float energy = sin(3.14159265 * t);
    energy *= energy;
    // text shapes (stages 2 and 3) need smaller, steadier pyramids to stay legible
    float wordW = clamp(1.0 - abs(s - 2.0), 0.0, 1.0);
    float embW = clamp(1.0 - abs(s - 3.0), 0.0, 1.0);
    float textW = wordW + embW;
    vec3 drift = vec3(
      sin(uTime * 0.5 + aSeed * 40.0),
      cos(uTime * 0.4 + aSeed * 23.0),
      sin(uTime * 0.35 + aSeed * 11.0)
    ) * (0.05 * (1.0 - 0.6 * textW) + energy * 2.2);
    p += drift;
    if (uFlow > 0.5) {
      // foreground pyramids drift past the camera as the page scrolls
      float h = 18.0;
      p.y = mod(p.y + uScroll * (0.5 + aSeed) + h * 0.5, h) - h * 0.5;
    }
    p += uShift;

    // apex-up pyramids, slowly turning, tipped a little towards the camera
    // in the word stage every pyramid faces the same way so the letters read cleanly
    float yaw = mix(aSeed * 6.2831853 + uTime * (0.12 + aSeed * 0.25), 0.35, wordW);
    float tilt = mix(0.5 + 0.14 * sin(uTime * 0.6 + aSeed * 20.0), 0.5, wordW);
    // the word shows one pyramid per lattice point (aWord < 0 = hidden) at a uniform
    // size; the emblem shows half of them so the petals stay light
    float keep = (1.0 - embW * step(0.5, aSeed)) * (1.0 - wordW * step(aWord, -0.5));
    float sc = mix(aScale, 1.0, wordW) * uSize * (1.0 - 0.4 * embW - 0.42 * wordW) * keep;
    vec3 la = rotX(rotY(aA, yaw), tilt) * sc;
    vec3 lb = rotX(rotY(aB, yaw), tilt) * sc;

    mat4 mvp = projectionMatrix * modelViewMatrix;
    vec4 ca = mvp * vec4(p + la, 1.0);
    vec4 cb = mvp * vec4(p + lb, 1.0);
    vec2 na = ca.xy / ca.w;
    vec2 nb = cb.xy / cb.w;
    vec2 dir = (nb - na) * uResolution;
    float len = length(dir);
    dir = len > 0.0001 ? dir / len : vec2(1.0, 0.0);
    vec2 perp = vec2(-dir.y, dir.x);

    vec4 clip = aEnd < 0.5 ? ca : cb;
    clip.xy += perp * aSide * uThickness / uResolution * clip.w;
    gl_Position = clip;

    vec4 mvc = modelViewMatrix * vec4(p, 1.0);
    vec3 c1 = uColors[int(aPalette + 0.5)];
    vec3 c2 = uColors[int(aPalette2 + 0.5)];
    vec3 cw = uColors[int(max(aWord, 0.0) + 0.5)];
    vec3 base = mix(c1, cw, smoothstep(0.0, 1.0, wordW));
    vColor = mix(base, c2, smoothstep(2.2, 3.0, s));
    float depth = clamp(1.0 - (-mvc.z - 9.0) / 18.0, 0.25, 1.0);
    float twinkle = mix(0.75 + 0.25 * sin(uTime * 1.3 + aSeed * 60.0), 1.0, wordW);
    vAlpha = uOpacity * depth * twinkle * keep;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
    #include <colorspace_fragment>
  }
`;

// A tetrahedron, apex up: seen from the side it reads as a triangle with one
// inner edge, like the pyramids on the reference site.
const PYRAMID_VERTS = (() => {
  const apex = [0, 0.62, 0];
  const base = [0, 1, 2].map((k) => {
    const a = Math.PI / 2 + (k * 2 * Math.PI) / 3;
    return [Math.cos(a) * 0.52, -0.24, Math.sin(a) * 0.52];
  });
  return [apex, ...base];
})();
const PYRAMID_EDGES = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [2, 3],
  [3, 1],
];

/** Base geometry: six edge quads (4 vertices each) shared by every instance. */
function buildEdgeGeometry() {
  const a: number[] = [];
  const b: number[] = [];
  const end: number[] = [];
  const side: number[] = [];
  const index: number[] = [];
  PYRAMID_EDGES.forEach(([i, j], e) => {
    for (const [endV, sideV] of [
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 1],
    ]) {
      a.push(...PYRAMID_VERTS[i]);
      b.push(...PYRAMID_VERTS[j]);
      end.push(endV);
      side.push(sideV);
    }
    const o = e * 4;
    index.push(o, o + 1, o + 2, o + 2, o + 1, o + 3);
  });
  return { a, b, end, side, index };
}

function Swarm({
  data,
  size,
  thickness,
  opacityScale,
  flow = false,
  state,
  light,
}: {
  data: SwarmData;
  size: number;
  thickness: number;
  opacityScale: number;
  flow?: boolean;
  state: RefObject<SceneState>;
  light: boolean;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const edge = buildEdgeGeometry();
    const g = new THREE.InstancedBufferGeometry();
    g.setIndex(edge.index);
    g.setAttribute("position", new THREE.Float32BufferAttribute(edge.a, 3));
    g.setAttribute("aA", new THREE.Float32BufferAttribute(edge.a, 3));
    g.setAttribute("aB", new THREE.Float32BufferAttribute(edge.b, 3));
    g.setAttribute("aEnd", new THREE.Float32BufferAttribute(edge.end, 1));
    g.setAttribute("aSide", new THREE.Float32BufferAttribute(edge.side, 1));
    g.setAttribute("aP0", new THREE.InstancedBufferAttribute(data.stages[0], 3));
    g.setAttribute("aP1", new THREE.InstancedBufferAttribute(data.stages[1], 3));
    g.setAttribute("aP2", new THREE.InstancedBufferAttribute(data.stages[2], 3));
    g.setAttribute("aP3", new THREE.InstancedBufferAttribute(data.stages[3], 3));
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(data.seeds, 1));
    g.setAttribute("aPalette", new THREE.InstancedBufferAttribute(data.palette, 1));
    g.setAttribute("aPalette2", new THREE.InstancedBufferAttribute(data.palette2, 1));
    g.setAttribute("aWord", new THREE.InstancedBufferAttribute(data.word, 1));
    g.setAttribute("aScale", new THREE.InstancedBufferAttribute(data.scales, 1));
    g.instanceCount = data.count;
    return g;
  }, [data]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uStage: { value: 0 },
      uSize: { value: size },
      uOpacity: { value: 1 },
      uFlow: { value: flow ? 1 : 0 },
      uScroll: { value: 0 },
      uThickness: { value: thickness },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uShift: { value: new THREE.Vector3() },
      uColors: { value: DARK_COLORS.map((c) => new THREE.Color(c)) },
    }),
    [size, flow, thickness]
  );

  useEffect(() => {
    const u = material.current?.uniforms;
    if (!u) return;
    const palette = light ? LIGHT_COLORS : DARK_COLORS;
    palette.forEach((c, i) => (u.uColors.value as THREE.Color[])[i].set(c));
  }, [light]);

  useFrame(() => {
    const s = state.current;
    const u = material.current?.uniforms;
    if (!s || !u) return;
    // per-frame GPU uniform writes are the intended r3f pattern
    /* eslint-disable react-hooks/immutability */
    u.uTime.value = s.time;
    u.uStage.value = s.stage;
    u.uOpacity.value = s.opacity * opacityScale;
    u.uScroll.value = s.scrollWorld;
    u.uThickness.value = thickness * gl.getPixelRatio();
    gl.getDrawingBufferSize(u.uResolution.value as THREE.Vector2);
    (u.uShift.value as THREE.Vector3).set(s.shiftX, 0, 0);
    /* eslint-enable react-hooks/immutability */
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Rig({
  mobile,
  light,
  reduced,
}: {
  mobile: boolean;
  light: boolean;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { viewport, invalidate } = useThree();
  const scrollY = useRef(0);
  const tops = useRef<number[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const state = useRef<SceneState>({
    stage: 0,
    x: 0.23,
    opacity: 1,
    shiftX: 0,
    scrollWorld: 0,
    time: 0,
  });

  // Baked scan of a real brain (see scripts/bake-brain.mjs). `undefined` while it
  // loads, `null` if it could not be loaded (the procedural brain is used then).
  const [scan, setScan] = useState<Float32Array | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    fetch("/models/brain-points.bin")
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
      .then((b) => alive && setScan(new Float32Array(b)))
      .catch(() => alive && setScan(null));
    return () => {
      alive = false;
    };
  }, []);

  const main = useMemo(
    () => (scan === undefined ? null : createMainSwarm(mobile ? 2200 : 5200, mobile, scan)),
    [mobile, scan]
  );
  const drift = useMemo(() => createDriftSwarm(mobile ? 14 : 34), [mobile]);

  useEffect(() => {
    const measure = () => {
      tops.current = KEYFRAMES.map(({ id }) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : NaN;
      });
      if (reduced) invalidate();
    };
    const onScroll = () => {
      scrollY.current = window.scrollY;
      if (reduced) invalidate();
    };
    const onPointer = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (reduced) invalidate();
    };
    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onPointer, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
    };
  }, [reduced, invalidate]);

  useFrame((_, delta) => {
    const s = state.current;
    const dt = Math.min(delta, 0.05);
    if (!reduced) s.time += dt;

    const y = scrollY.current + window.innerHeight * 0.5;
    const target = targetFor(y, tops.current, window.innerHeight * 0.45);
    const damp = (from: number, to: number, rate: number) =>
      reduced ? to : THREE.MathUtils.damp(from, to, rate, dt);

    s.stage = damp(s.stage, target.stage, 4);
    s.x = damp(s.x, mobile ? 0 : target.x, 4);
    const dim = (mobile ? 0.5 : 1) * (light ? 0.75 : 1);
    s.opacity = damp(s.opacity, target.opacity * dim, 4);
    s.shiftX = s.x * viewport.width;
    s.scrollWorld = scrollY.current * 0.004;

    const g = group.current;
    if (g) {
      const scale = THREE.MathUtils.clamp(viewport.width / 18, 0.55, 1.1);
      g.scale.setScalar(scale);
      const sway = reduced ? 0 : Math.sin(s.time * 0.12) * 0.15;
      g.rotation.y = THREE.MathUtils.damp(
        g.rotation.y,
        pointer.current.x * 0.25 + sway,
        2.5,
        dt
      );
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pointer.current.y * 0.12, 2.5, dt);
    }
  });

  return (
    <group ref={group}>
      {main && (
        <Swarm
          data={main}
          size={0.115}
          thickness={1.3}
          opacityScale={0.6}
          state={state}
          light={light}
        />
      )}
      <Swarm
        data={drift}
        size={0.9}
        thickness={1.6}
        opacityScale={0.3}
        flow
        state={state}
        light={light}
      />
    </group>
  );
}

const reducedQuery = () => window.matchMedia("(prefers-reduced-motion: reduce)");
const subscribeReduced = (cb: () => void) => {
  const mq = reducedQuery();
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => reducedQuery().matches;

const mobileQuery = () => window.matchMedia("(max-width: 767px)");
const subscribeMobile = (cb: () => void) => {
  const mq = mobileQuery();
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getMobile = () => mobileQuery().matches;

export default function Scene() {
  const { resolvedTheme } = useTheme();
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  const mobile = useSyncExternalStore(subscribeMobile, getMobile, () => false);

  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 50, near: 0.1, far: 80 }}
      dpr={[1, 1.5]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Rig mobile={mobile} light={resolvedTheme === "light"} reduced={reduced} />
    </Canvas>
  );
}
