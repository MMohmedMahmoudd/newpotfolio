"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Zap,
  Cpu,
  Target,
  Compass,
  Rocket,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
  revealViewport,
  staggerItem,
  useScrollDirection,
} from "@/lib/animations";

const pillars = [
  {
    icon: Target,
    title: "First-principles problem solving",
    description:
      "I decompose ambiguous product problems into crisp engineering constraints, then pick the simplest architecture that meets them. No over-engineering, no hand-waving.",
  },
  {
    icon: Zap,
    title: "Performance is a feature",
    description:
      "I benchmark, profile, and ship. LCP under 1.2s, TTI under 2s, p95 API latency under 150ms — these are shipping criteria, not aspirations.",
  },
  {
    icon: Cpu,
    title: "Full-stack depth",
    description:
      "From React Server Components to Postgres query planners, Kubernetes operators to LLM evaluation pipelines — I own the stack and the trade-offs.",
  },
];

const timeline = [
  {
    year: "2017",
    title: "First production deploy",
    description: "Shipped a React dashboard consumed by 10K users.",
    icon: Rocket,
  },
  {
    year: "2019",
    title: "Freelance pivot",
    description: "Left the agency to partner directly with founders.",
    icon: Compass,
  },
  {
    year: "2021",
    title: "First $1M ARR platform",
    description: "Led the rewrite that unlocked enterprise contracts.",
    icon: Target,
  },
  {
    year: "2023",
    title: "Principal engineer track",
    description: "Owning architecture for a 5-person platform team.",
    icon: Briefcase,
  },
  {
    year: "2025",
    title: "AI product consulting",
    description: "Shipping RAG, agents, and evals into production.",
    icon: Cpu,
  },
];

export default function AboutSection() {
  const direction = useScrollDirection();
  return (
    <section
      id="about"
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
          <motion.div variants={itemVariants} className="mb-16 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-blue-500">
              <span className="h-px w-8 bg-blue-500" />
              About
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Senior engineer who treats every product like it&apos;s{" "}
              <span className="gradient-text">their own</span>.
            </h2>
          </motion.div>

          <div className="mb-20 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <p className="mb-5 text-lg leading-relaxed text-foreground/90">
                I started writing code at 14 and shipped my first paid project at 17.
                In the seven years since, I&apos;ve built, rescued, and scaled
                everything from seed-stage MVPs to enterprise platforms serving
                millions of requests a day.
              </p>
              <p className="mb-5 text-lg leading-relaxed text-muted-foreground">
                My work blends the rigour of a senior engineer with the intuition of
                a product designer. I care about the shape of the database schema
                and the shape of the button. I&apos;ll push back on a bad product
                idea, and I&apos;ll rewrite a function three times to save 40ms on
                the critical path.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Today I partner with a small number of clients per year — founders
                building their first product, scale-ups hardening their platform,
                and teams adding AI without melting their infrastructure.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-5">
              <div className="overflow-hidden rounded-xl border border-foreground/10 glass font-mono text-sm">
                <div className="flex items-center gap-2 border-b border-foreground/10 bg-foreground/[0.03] px-4 py-2.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/70" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/70" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
                  <span className="ml-2 text-xs text-muted-foreground">
                    ~/about-me · zsh
                  </span>
                </div>
                <div className="space-y-2 p-5 text-[13px] leading-relaxed">
                  <div>
                    <span className="text-emerald-500">➜</span>{" "}
                    <span className="text-blue-400">whoami</span>
                  </div>
                  <div className="text-muted-foreground">
                    mohamed · senior full-stack engineer
                  </div>
                  <div>
                    <span className="text-emerald-500">➜</span>{" "}
                    <span className="text-blue-400">cat</span>{" "}
                    <span className="text-amber-400">stack.json</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-muted-foreground">{`{
  "frontend": ["Next.js", "React", "TS"],
  "backend":  ["Node", "Go", "Postgres"],
  "infra":    ["AWS", "K8s", "Terraform"],
  "ai":       ["LLMs", "RAG", "Evals"]
}`}</pre>
                  <div>
                    <span className="text-emerald-500">➜</span>{" "}
                    <span className="text-blue-400">uptime</span>
                  </div>
                  <div className="text-muted-foreground">
                    7 years · 50+ products · still curious
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-500">➜</span>
                    <span className="inline-block h-4 w-2 animate-pulse bg-foreground/80" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            custom={direction}
            className="mb-20 grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-xl border border-foreground/10 bg-card/40 p-6 card-hover"
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/10 blur-2xl transition-opacity duration-500 group-hover:opacity-80" />
                  <div className="relative">
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-purple-500/10 ring-1 ring-foreground/10">
                      <Icon size={20} className="text-blue-500" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{pillar.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="mb-8 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">Career waypoints</h3>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                2017 → now
              </span>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-blue-500/40 via-purple-500/30 to-transparent md:left-1/2" />
              <div className="space-y-10">
                {timeline.map((event, idx) => {
                  const Icon = event.icon;
                  const isLeft = idx % 2 === 0;
                  return (
                    <motion.div
                      key={event.year}
                      variants={staggerItem}
                      custom={direction}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      viewport={revealViewport}
                      className={`relative flex items-center gap-6 md:gap-10 ${
                        isLeft ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      <div className="absolute left-4 -translate-x-1/2 md:left-1/2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background ring-1 ring-foreground/20">
                          <Icon size={14} className="text-blue-500" />
                        </div>
                      </div>
                      <div
                        className={`ml-14 flex-1 md:ml-0 ${
                          isLeft ? "md:pr-[54%] md:text-right" : "md:pl-[54%]"
                        }`}
                      >
                        <div className="inline-block rounded-lg border border-foreground/10 bg-card/40 p-5 text-left">
                          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-blue-500">
                            {event.year}
                          </div>
                          <div className="mb-1 font-semibold">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.description}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
