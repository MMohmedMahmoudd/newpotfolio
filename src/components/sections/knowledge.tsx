"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Gauge,
  Lock,
  Network,
  Search,
  Workflow,
  Database,
  LineChart,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
  revealViewport,
  useScrollDirection,
} from "@/lib/animations";

const disciplines = [
  {
    icon: Network,
    title: "Distributed systems",
    points: [
      "Consistency vs. availability trade-offs",
      "Idempotency & exactly-once delivery",
      "Sagas & distributed transactions",
      "Event-driven choreography",
    ],
  },
  {
    icon: Gauge,
    title: "Performance engineering",
    points: [
      "Critical-render-path budgets",
      "Flame-graph-driven profiling",
      "N+1 query detection in CI",
      "Streaming SSR + partial hydration",
    ],
  },
  {
    icon: Lock,
    title: "Security & privacy",
    points: [
      "OWASP top 10, applied",
      "JWT, OAuth2, SSO, RBAC",
      "Secrets management & KMS",
      "Supply-chain & SBOM hygiene",
    ],
  },
  {
    icon: Search,
    title: "SEO & discoverability",
    points: [
      "Metadata + structured data",
      "Canonicals, hreflang, sitemaps",
      "Core Web Vitals tuning",
      "Content architecture",
    ],
  },
  {
    icon: Database,
    title: "Data layer design",
    points: [
      "Normal forms + denormalization",
      "Indexing strategies, EXPLAIN",
      "Read replicas & sharding",
      "Cache invalidation (the hard one)",
    ],
  },
  {
    icon: LineChart,
    title: "Observability",
    points: [
      "RED / USE metrics",
      "Distributed tracing (OTel)",
      "SLO-based alerting",
      "Error budgets in practice",
    ],
  },
];

const process = [
  {
    step: "01",
    title: "Listen hard",
    body: "I start by understanding the problem behind the ask. What has to be true for this to be worth building?",
  },
  {
    step: "02",
    title: "Sketch the shape",
    body: "A one-page architecture. Boxes, arrows, and the three things that can go wrong.",
  },
  {
    step: "03",
    title: "Prove the risky part",
    body: "Spike the uncertain pieces first — performance, integration, edge cases — before polishing.",
  },
  {
    step: "04",
    title: "Ship in slices",
    body: "Small, reversible releases behind flags. Telemetry from day one.",
  },
  {
    step: "05",
    title: "Harden and hand off",
    body: "Docs, runbooks, dashboards, and a clear owner. I leave the codebase easier to modify than I found it.",
  },
];

export default function KnowledgeSection() {
  const direction = useScrollDirection();
  return (
    <section
      id="knowledge"
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
              Depth & expertise
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Senior-level thinking, not just{" "}
              <span className="gradient-text">senior-level titles</span>.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              The areas I&apos;ve studied deeply enough to teach. If we work
              together, these are the lenses I&apos;ll bring to your problem.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            custom={direction}
            className="mb-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {disciplines.map((d) => {
              const Icon = d.icon;
              return (
                <motion.div
                  key={d.title}
                  variants={itemVariants}
                  className="group rounded-xl border border-foreground/10 bg-card/30 p-6 card-hover"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-purple-500/10 text-blue-400 ring-1 ring-foreground/10">
                    <Icon size={18} />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">{d.title}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {d.points.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <span className="mt-2 block h-1 w-1 flex-shrink-0 rounded-full bg-blue-500/50" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div variants={itemVariants} className="mb-20">
            <div className="mb-8 flex items-baseline justify-between gap-4">
              <h3 className="text-2xl font-bold">
                A real-world system, sketched
              </h3>
              <span className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground sm:inline">
                client → edge → service → data
              </span>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-card/30 p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                {[
                  { label: "Client", sub: "RSC + SWR", color: "from-blue-500/20" },
                  { label: "Edge", sub: "CDN + middleware", color: "from-indigo-500/20" },
                  { label: "API", sub: "tRPC / REST", color: "from-violet-500/20" },
                  { label: "Services", sub: "Workers + queues", color: "from-fuchsia-500/20" },
                  { label: "Data", sub: "Postgres + Redis", color: "from-rose-500/20" },
                ].map((node, i, arr) => (
                  <div
                    key={node.label}
                    className="relative flex flex-col items-center"
                  >
                    <div
                      className={`relative flex w-full flex-col items-center rounded-xl border border-foreground/10 bg-gradient-to-b ${node.color} to-transparent px-4 py-5 text-center`}
                    >
                      <div className="text-sm font-semibold">{node.label}</div>
                      <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                        {node.sub}
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="absolute right-0 top-1/2 hidden h-px w-4 translate-x-full bg-gradient-to-r from-foreground/20 to-transparent md:block" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  {
                    icon: Workflow,
                    title: "Eventing",
                    body: "Async boundaries via durable queues; retries with exponential backoff and DLQ surfacing.",
                  },
                  {
                    icon: LineChart,
                    title: "Observability",
                    body: "OpenTelemetry across the request path. One span to rule them all — and alerts on SLOs, not symptoms.",
                  },
                  {
                    icon: Lock,
                    title: "Trust boundaries",
                    body: "Short-lived tokens at the edge, per-row authorization at the data layer. Assume breach and limit blast radius.",
                  },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.title}
                      className="rounded-xl border border-foreground/5 bg-foreground/[0.02] p-4"
                    >
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <Icon size={14} className="text-blue-400" />
                        {c.title}
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {c.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="mb-8 flex items-center gap-3">
              <BookOpen size={18} className="text-blue-400" />
              <h3 className="text-2xl font-bold">How I approach new problems</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              {process.map((p, idx) => (
                <motion.div
                  key={p.step}
                  initial={{ opacity: 0, y: direction === "down" ? 16 : -16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  viewport={revealViewport}
                  className="relative rounded-xl border border-foreground/10 bg-card/30 p-5"
                >
                  <div className="mb-2 font-mono text-xs tracking-widest text-blue-400">
                    {p.step}
                  </div>
                  <div className="mb-2 text-sm font-semibold">{p.title}</div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
