"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { createDriftSwarm, createMainSwarm, type SwarmData } from "./shapes";

type SceneState = {
  stage: number;
  globeX: number;
  opacity: number;
  shiftX: number;
  time: number;
};

const DARK_COLORS = ["#ffc21a", "#8a5cff", "#f4f4ff", "#2dd4bf"];
const LIGHT_COLORS = ["#d99a00", "#6d3df0", "#334155", "#0f9b8e"];

// scroll fraction -> morph stage (0 brain, 1 globe, 2 </> VERTEX, 3 letter)
const KEY_FRACTIONS = [0, 0.02, 0.07, 0.34, 0.46, 0.62, 0.85, 1];
const KEY_STAGES = [0, 0, 1, 1, 2, 2, 3, 3];

function stageForScroll(f: number) {
  for (let i = 1; i < KEY_FRACTIONS.length; i++) {
    if (f <= KEY_FRACTIONS[i]) {
      const a = KEY_FRACTIONS[i - 1];
      const b = KEY_FRACTIONS[i];
      const t = b === a ? 1 : (f - a) / (b - a);
      return KEY_STAGES[i - 1] + (KEY_STAGES[i] - KEY_STAGES[i - 1]) * t;
    }
  }
  return KEY_STAGES[KEY_STAGES.length - 1];
}

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uStage;
  uniform float uSize;
  uniform float uOpacity;
  uniform float uGlobeX;
  uniform vec3 uShift;
  uniform vec3 uColors[4];

  attribute vec3 aP0;
  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute float aSeed;
  attribute float aPalette;
  attribute float aScale;

  varying vec3 vColor;
  varying float vAlpha;

  mat3 rotation(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat3(
      oc * axis.x * axis.x + c,          oc * axis.x * axis.y + axis.z * s, oc * axis.z * axis.x - axis.y * s,
      oc * axis.x * axis.y - axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z + axis.x * s,
      oc * axis.z * axis.x + axis.y * s, oc * axis.y * axis.z - axis.x * s, oc * axis.z * axis.z + c
    );
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

    // globe: spin about a tilted axis, parked off to one side
    vec3 globe = rotZ(rotY(aP1, uTime * 0.18), 0.4) + vec3(uGlobeX, 0.0, 0.0);

    vec3 a = aP0;
    vec3 b = globe;
    if (seg > 0.5 && seg < 1.5) { a = globe; b = aP2; }
    if (seg > 1.5) { a = aP2; b = aP3; }

    vec3 p = mix(a, b, tt);

    float energy = sin(3.14159265 * t);
    // text shapes (stages 2 and 3) need smaller, steadier pyramids to stay legible
    float textW = clamp(1.0 - abs(s - 2.0), 0.0, 1.0) + clamp(1.0 - abs(s - 3.0), 0.0, 1.0);
    vec3 drift = vec3(
      sin(uTime * 0.5 + aSeed * 40.0),
      cos(uTime * 0.4 + aSeed * 23.0),
      sin(uTime * 0.35 + aSeed * 11.0)
    ) * (0.06 * (1.0 - 0.6 * textW) + energy * 2.2);
    p += drift + uShift;

    float angle = uTime * (0.4 + aSeed) + aSeed * 6.2831853;
    vec3 axis = vec3(sin(aSeed * 91.0), cos(aSeed * 57.0), sin(aSeed * 33.0) + 1.5);
    vec3 local = rotation(axis, angle) * position * aScale * uSize * (1.0 - 0.5 * textW);

    vec4 mv = modelViewMatrix * vec4(p + local, 1.0);
    gl_Position = projectionMatrix * mv;

    vColor = uColors[int(aPalette + 0.5)];
    float depth = clamp(1.0 - (-mv.z - 8.0) / 22.0, 0.2, 1.0);
    float twinkle = 0.65 + 0.35 * sin(uTime * 1.3 + aSeed * 60.0);
    vAlpha = uOpacity * depth * twinkle;
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

// edges of a regular tetrahedron (6 segments)
const TETRA = (() => {
  const v = [
    [1, 1, 1],
    [-1, -1, 1],
    [-1, 1, -1],
    [1, -1, -1],
  ].map((p) => p.map((c) => c * 0.5));
  const pairs = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];
  return new Float32Array(pairs.flatMap(([i, j]) => [...v[i], ...v[j]]));
})();

function Swarm({
  data,
  size,
  opacityScale,
  state,
  light,
}: {
  data: SwarmData;
  size: number;
  opacityScale: number;
  state: RefObject<SceneState>;
  light: boolean;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const g = new THREE.InstancedBufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(TETRA, 3));
    g.setAttribute("aP0", new THREE.InstancedBufferAttribute(data.stages[0], 3));
    g.setAttribute("aP1", new THREE.InstancedBufferAttribute(data.stages[1], 3));
    g.setAttribute("aP2", new THREE.InstancedBufferAttribute(data.stages[2], 3));
    g.setAttribute("aP3", new THREE.InstancedBufferAttribute(data.stages[3], 3));
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(data.seeds, 1));
    g.setAttribute("aPalette", new THREE.InstancedBufferAttribute(data.palette, 1));
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
      uGlobeX: { value: 0 },
      uShift: { value: new THREE.Vector3() },
      uColors: { value: DARK_COLORS.map((c) => new THREE.Color(c)) },
    }),
    [size]
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
    u.uGlobeX.value = s.globeX;
    (u.uShift.value as THREE.Vector3).set(s.shiftX, 0, 0);
    /* eslint-enable react-hooks/immutability */
  });

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </lineSegments>
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
  const scroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const state = useRef<SceneState>({
    stage: 0,
    globeX: 0,
    opacity: 1,
    shiftX: 0,
    time: 0,
  });

  const main = useMemo(
    () => createMainSwarm(mobile ? 2200 : 5200, "M", mobile),
    [mobile]
  );
  const drift = useMemo(() => createDriftSwarm(mobile ? 14 : 34), [mobile]);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (reduced) invalidate();
    };
    const onPointer = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (reduced) invalidate();
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("pointermove", onPointer, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
    };
  }, [reduced, invalidate]);

  useFrame((_, delta) => {
    const s = state.current;
    const dt = Math.min(delta, 0.05);
    if (!reduced) s.time += dt;

    const target = stageForScroll(scroll.current);
    s.stage = reduced ? target : THREE.MathUtils.damp(s.stage, target, 3.5, dt);

    const heroWeight = 1 - THREE.MathUtils.smoothstep(Math.min(s.stage, 1), 0, 1);
    const base = light ? 0.55 : 0.8;
    const rest = light ? 0.3 : 0.42;
    s.opacity = (rest + (base - rest) * heroWeight) * (mobile ? 0.6 : 1);
    s.shiftX = mobile ? 0 : viewport.width * 0.24 * heroWeight;
    s.globeX = mobile ? 0 : -viewport.width * 0.27;
    s.opacity += (light ? 0.1 : 0.16) * Math.max(0, 1 - Math.abs(s.stage - 1));

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
      <Swarm data={main} size={0.105} opacityScale={0.7} state={state} light={light} />
      <Swarm data={drift} size={0.85} opacityScale={0.35} state={state} light={light} />
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
