"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Download,
  Sparkles,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/animations";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      o: number;
    };

    let particles: Particle[] = [];

    const seed = () => {
      const density = Math.floor((width * height) / 14000);
      const count = Math.min(120, Math.max(40, density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.4,
        o: Math.random() * 0.5 + 0.25,
      }));
    };

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${p.o})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.18;
            ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      animationFrame = requestAnimationFrame(render);
    };

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!prefersReduced) render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}

function OrbitalRings() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const rx = useTransform(springY, [-300, 300], [12, -12]);
  const ry = useTransform(springX, [-300, 300], [-12, 12]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(e.clientX - cx);
      mouseY.set(e.clientY - cy);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2"
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
    >
      {[260, 360, 460, 560].map((size, i) => (
        <motion.div
          key={size}
          className="absolute left-1/2 top-1/2 rounded-full border border-foreground/10"
          style={{
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 60 + i * 20, repeat: Infinity, ease: "linear" }}
        >
          <span
            className="absolute top-0 left-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.8)]"
            style={{
              transform: `translateX(-50%) translateY(-50%) rotate(${i * 45}deg)`,
            }}
          />
        </motion.div>
      ))}
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-2xl" />
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-24"
    >
      <div className="absolute inset-0 -z-10 mesh-gradient" />
      <div className="absolute inset-0 -z-10 grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="absolute inset-0 -z-10">
        <ParticleField />
      </div>
      <OrbitalRings />

      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-foreground/10 glass px-4 py-1.5 text-xs sm:text-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-medium tracking-wide">
            Available for select freelance engagements · Q3 2026
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
        >
          <span className="block text-foreground">Engineering</span>
          <span className="block">
            <span className="gradient-text animate-gradient bg-[length:200%_200%]">
              product-grade systems
            </span>
          </span>
          <span className="block text-foreground">that ship & scale.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl"
        >
          I&apos;m <span className="font-semibold text-foreground">Mohamed Mahmoud</span>,
          a senior full-stack engineer. I partner with founders and product teams to
          design, build, and scale premium SaaS platforms, distributed systems, and
          AI-powered products — end-to-end, from architecture to launch.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mx-auto mb-14 grid max-w-xl grid-cols-3 gap-4 sm:gap-8"
        >
          {[
            { label: "Years shipping", value: "7+" },
            { label: "Products launched", value: "50+" },
            { label: "Avg. Lighthouse", value: "98" },
          ].map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                {metric.value}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground sm:text-xs">
                {metric.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-14 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-7 text-sm font-semibold text-white",
              "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600",
              "shadow-[0_10px_30px_-5px_rgba(99,102,241,0.5)] transition-shadow hover:shadow-[0_14px_40px_-5px_rgba(99,102,241,0.7)]"
            )}
          >
            <span className="relative z-10">View projects</span>
            <ArrowRight
              size={16}
              className="relative z-10 transition-transform group-hover:translate-x-1"
            />
            <span className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </motion.a>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-foreground/15 glass px-7 text-sm font-semibold transition-colors hover:border-foreground/40"
          >
            <Sparkles size={16} className="text-blue-500" />
            Hire me
          </motion.a>

          <motion.a
            href="/resume.pdf"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <Download size={16} />
            Resume
          </motion.a>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 text-muted-foreground"
        >
          {[
            {
              icon: GithubIcon,
              href: "https://github.com/MMohmedMahmoudd",
              label: "GitHub",
            },
            {
              icon: LinkedinIcon,
              href: "https://www.linkedin.com/in/mohmed-mahmoud-1139a0300/",
              label: "LinkedIn",
            },
            { icon: Mail, href: "mailto:hello@mohmedmahmoud257@gmail.com", label: "Email" },
            { icon: Terminal, href: "#about", label: "Terminal about me" },
          ].map((social) => {
            const Icon = social.icon;
            const isExternal = social.href.startsWith("http");
            const className =
              "inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 glass transition-colors hover:border-blue-500/50 hover:text-blue-500";
            return (
              <motion.span key={social.label} whileHover={{ y: -2 }}>
                {isExternal ? (
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={className}
                  >
                    <Icon size={18} />
                  </a>
                ) : (
                  <Link
                    href={social.href}
                    aria-label={social.label}
                    className={className}
                  >
                    <Icon size={18} />
                  </Link>
                )}
              </motion.span>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground"
      >
        <div className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em] ">
          <span>Scroll</span>
          <div className="h-10 w-px bg-gradient-to-b from-foreground/30 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
