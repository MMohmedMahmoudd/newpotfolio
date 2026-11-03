"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; a: number; speed: number; phase: number; depth: number; hue: number };

/** Night-sky layer: tiny twinkling stars with a slow scroll parallax and the odd shooting star. */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let scroll = window.scrollY;
    let raf = 0;
    let shoot: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextShoot = 4000 + Math.random() * 6000;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / (w < 768 ? 4500 : 3800));
      stars = Array.from({ length: count }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.25 + Math.pow(Math.random(), 3) * 1.25,
          a: 0.25 + Math.random() * 0.75,
          speed: 0.4 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
          depth,
          hue: Math.random(), // <0.12 warm, >0.88 cool, otherwise white
        };
      });
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase);
        // parallax: nearer stars drift up faster as the page scrolls, wrapping around
        let y = (s.y - scroll * (0.02 + s.depth * 0.08)) % h;
        if (y < 0) y += h;
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = s.hue < 0.12 ? "#ffe3b0" : s.hue > 0.88 ? "#b8d0ff" : "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) {
        nextShoot -= dt;
        if (!shoot && nextShoot <= 0) {
          shoot = {
            x: Math.random() * w * 0.8,
            y: Math.random() * h * 0.4,
            vx: 0.9 + Math.random() * 0.5,
            vy: 0.35 + Math.random() * 0.25,
            life: 1,
          };
          nextShoot = 6000 + Math.random() * 9000;
        }
        if (shoot) {
          const len = 120;
          const g = ctx.createLinearGradient(
            shoot.x,
            shoot.y,
            shoot.x - shoot.vx * len,
            shoot.y - shoot.vy * len
          );
          g.addColorStop(0, "rgba(255,255,255,0.9)");
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.globalAlpha = shoot.life;
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(shoot.x, shoot.y);
          ctx.lineTo(shoot.x - shoot.vx * len, shoot.y - shoot.vy * len);
          ctx.stroke();
          shoot.x += shoot.vx * dt * 0.7;
          shoot.y += shoot.vy * dt * 0.7;
          shoot.life -= dt / 1100;
          if (shoot.life <= 0 || shoot.x > w + len) shoot = null;
        }
      }
      ctx.globalAlpha = 1;
    };

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      draw(now, dt);
      raf = requestAnimationFrame(loop);
    };
    const onScroll = () => {
      scroll = window.scrollY;
      if (reduced) draw(0, 0);
    };
    const onResize = () => {
      build();
      if (reduced) draw(0, 0);
    };

    build();
    if (reduced) draw(0, 0);
    else raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 hidden h-full w-full dark:block" />;
}
