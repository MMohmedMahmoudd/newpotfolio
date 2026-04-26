"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Cloud,
  Code,
  Database,
  Palette,
  Server,
  Wrench,
  Zap,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { skillCategories, skillsRadarData } from "@/data/skills";
import {
  containerVariants,
  itemVariants,
  revealViewport,
  useScrollDirection,
} from "@/lib/animations";

const categoryIcons: Record<string, typeof Zap> = {
  Frontend: Zap,
  Backend: Server,
  Databases: Database,
  "DevOps & Infrastructure": Cloud,
  "AI & Machine Learning": Brain,
  "Tools & Platforms": Wrench,
};

const architectureLayers = [
  {
    name: "Presentation",
    items: ["Next.js App Router", "React 19", "Tailwind", "Framer Motion"],
    color: "from-blue-500/20 to-cyan-500/10",
    accent: "text-blue-400",
    icon: Palette,
  },
  {
    name: "API & Edge",
    items: ["tRPC / GraphQL", "REST", "WebSockets", "Edge Functions"],
    color: "from-indigo-500/20 to-blue-500/10",
    accent: "text-indigo-400",
    icon: Code,
  },
  {
    name: "Services",
    items: ["Node.js", "Go", "Python", "Background Workers"],
    color: "from-violet-500/20 to-indigo-500/10",
    accent: "text-violet-400",
    icon: Server,
  },
  {
    name: "Data",
    items: ["Postgres", "Redis", "Elasticsearch", "Vector DBs"],
    color: "from-fuchsia-500/20 to-violet-500/10",
    accent: "text-fuchsia-400",
    icon: Database,
  },
  {
    name: "Platform",
    items: ["AWS / GCP", "Kubernetes", "Terraform", "Observability"],
    color: "from-rose-500/20 to-fuchsia-500/10",
    accent: "text-rose-400",
    icon: Cloud,
  },
];

export default function SkillsSection() {
  const [selected, setSelected] = useState(0);
  const active = skillCategories[selected];
  const ActiveIcon = categoryIcons[active.name] ?? Zap;
  const direction = useScrollDirection();

  return (
    <section
      id="skills"
      className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          custom={direction}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          <motion.div variants={itemVariants} className="mb-16 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-blue-500">
              <span className="h-px w-8 bg-blue-500" />
              Skill architecture
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              A stack I&apos;ve{" "}
              <span className="gradient-text">shipped in production</span>, not
              just read about.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Every technology below is something I&apos;ve owned end-to-end:
              architecting it, operating it under load, and debugging it at 2am.
            </p>
          </motion.div>

          <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <motion.aside
              variants={itemVariants}
              className="lg:col-span-4 space-y-2"
            >
              {skillCategories.map((category, idx) => {
                const Icon = categoryIcons[category.name] ?? Zap;
                const isActive = idx === selected;
                return (
                  <motion.button
                    key={category.name}
                    onClick={() => setSelected(idx)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      isActive
                        ? "border-blue-500/50 bg-blue-500/5"
                        : "border-foreground/10 bg-card/30 hover:border-foreground/20"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-foreground/5 text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">
                        {category.name}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {category.skills.length} technologies · avg{" "}
                        {Math.round(
                          category.skills.reduce(
                            (acc, s) => acc + s.proficiency,
                            0,
                          ) / category.skills.length,
                        )}
                        %
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="active-category"
                        className="absolute inset-y-2 -left-px w-0.5 rounded-r-full bg-gradient-to-b from-blue-500 to-purple-500"
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.aside>

            <motion.div
              variants={itemVariants}
              className="lg:col-span-8 rounded-2xl border border-foreground/10 bg-card/30 p-6 sm:p-8"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/10 text-blue-400 ring-1 ring-foreground/10">
                      <ActiveIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{active.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Proficiency across {active.skills.length} technologies
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {active.skills.map((skill, idx) => (
                      <div key={skill.name}>
                        <div className="mb-1.5 flex items-baseline justify-between">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="font-mono text-xs text-blue-400">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-foreground/5">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.proficiency}%` }}
                            transition={{
                              duration: 0.9,
                              delay: idx * 0.06,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="mb-16 rounded-2xl border border-foreground/10 bg-gradient-to-br from-card/40 to-card/10 p-6 sm:p-8"
          >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="text-xl font-bold">Breadth radar</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Aggregate proficiency across disciplines
                </p>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                0 → 100
              </span>
            </div>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillsRadarData} outerRadius="75%">
                  <defs>
                    <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke="currentColor" strokeOpacity={0.12} />
                  <PolarAngleAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{
                      fontSize: 10,
                      fill: "currentColor",
                      opacity: 0.4,
                    }}
                    stroke="currentColor"
                    strokeOpacity={0.1}
                  />
                  <Radar
                    name="Proficiency"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#radarFill)"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="mb-8 flex items-baseline justify-between">
              <h3 className="text-xl font-bold">System architecture fluency</h3>
              <span className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground sm:inline">
                Browser → data store
              </span>
            </div>
            <div className="space-y-3">
              {architectureLayers.map((layer, idx) => {
                const Icon = layer.icon;
                return (
                  <motion.div
                    key={layer.name}
                    initial={{
                      opacity: 0,
                      x: -16,
                      y: direction === "down" ? 16 : -16,
                    }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    viewport={revealViewport}
                    className={`group relative overflow-hidden rounded-xl border border-foreground/10 bg-gradient-to-r ${layer.color} p-5`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3 sm:w-48 sm:flex-shrink-0">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg bg-background/50 ring-1 ring-foreground/10 ${layer.accent}`}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-muted-foreground">
                            Layer {idx + 1}
                          </div>
                          <div className="font-semibold">{layer.name}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {layer.items.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-foreground/10 bg-background/40 px-3 py-1 text-xs font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
