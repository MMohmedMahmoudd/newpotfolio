"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Layers,
  ShoppingBag,
  Brain,
  FlaskConical,
  Grid3x3,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import Link from "next/link";
import { projects } from "@/data/projects";
import {
  containerVariants,
  itemVariants,
  revealViewport,
  useScrollDirection,
} from "@/lib/animations";
import type { Project } from "@/types";

const categories: Array<{ label: string; value: string; icon: typeof Grid3x3 }> = [
  { label: "All work", value: "All", icon: Grid3x3 },
  { label: "SaaS", value: "SaaS", icon: Layers },
  { label: "Web Apps", value: "Web App", icon: Sparkles },
  { label: "Ecommerce", value: "Ecommerce", icon: ShoppingBag },
  { label: "AI", value: "AI", icon: Brain },
  { label: "Experiments", value: "Experiment", icon: FlaskConical },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card/30 card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/20 blur-2xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {project.category}
          </div>
          <div className="text-3xl font-bold tracking-tight text-foreground/80 sm:text-4xl">
            {project.title}
          </div>
        </div>
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background/70 px-3 py-1 text-[11px] font-medium backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-foreground/10 bg-foreground/5 px-2.5 py-0.5 text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mb-2 text-xl font-bold tracking-tight transition-colors group-hover:text-blue-400">
          {project.title}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mb-5 grid grid-cols-2 gap-3">
          {project.metrics.slice(0, 4).map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border border-foreground/5 bg-foreground/[0.02] px-3 py-2"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text font-mono text-sm font-semibold text-transparent">
                {metric.value}
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5 border-y border-foreground/5 py-3">
          <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            Stack
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 6).map((t) => (
              <span
                key={t}
                className="font-mono text-[11px] text-foreground/70"
              >
                {t}
              </span>
            )).reduce<React.ReactNode[]>((acc, el, i, arr) => {
              acc.push(el);
              if (i < arr.length - 1)
                acc.push(
                  <span key={`sep-${i}`} className="text-foreground/20">
                    ·
                  </span>,
                );
              return acc;
            }, [])}
          </div>
        </div>

        <div className="mt-auto flex items-center gap-3">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
          >
            Case study
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live demo"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-blue-500/50 hover:text-blue-400"
              >
                <ArrowUpRight size={14} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Source on GitHub"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <GithubIcon size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const [selected, setSelected] = useState("All");
  const direction = useScrollDirection();

  const filtered = useMemo(
    () =>
      selected === "All"
        ? projects
        : projects.filter((p) => p.category === selected),
    [selected],
  );

  return (
    <section
      id="projects"
      className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          custom={direction}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          <motion.div
            variants={itemVariants}
            className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-blue-500">
                <span className="h-px w-8 bg-blue-500" />
                Selected work
              </div>
              <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Projects built with{" "}
                <span className="gradient-text">real users</span> in mind.
              </h2>
            </div>
            <p className="text-sm text-muted-foreground md:max-w-xs md:text-right">
              A curated slice of production work. Full case studies with
              architecture diagrams and trade-off notes on each detail page.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-10 flex flex-wrap gap-2"
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = selected === cat.value;
              return (
                <motion.button
                  key={cat.value}
                  onClick={() => setSelected(cat.value)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-all ${
                    active
                      ? "border-blue-500/50 bg-blue-500/10 text-foreground shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                      : "border-foreground/10 bg-card/30 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  <Icon size={13} />
                  {cat.label}
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div
            layout
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={idx}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-sm text-muted-foreground">
              No projects in this category yet. Check back soon.
            </div>
          )}

          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-col items-center gap-3 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Want the long version with architecture, trade-offs, and lessons?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300"
            >
              Get in touch
              <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
