"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import {
  containerVariants,
  itemVariants,
  revealViewport,
  useScrollDirection,
} from "@/lib/animations";

const trustedBy = [
  "TechVentures",
  "StartupXYZ",
  "CloudScale",
  "DataFlow",
  "MindFlow",
  "EchoCart",
  "Quantum Labs",
  "Northbound",
];

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/20 font-semibold text-foreground ring-1 ring-foreground/10">
      {initials}
    </div>
  );
}

export default function TestimonialsSection() {
  const direction = useScrollDirection();
  return (
    <section
      id="testimonials"
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
              What clients say
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              The short version:{" "}
              <span className="gradient-text">they rehire me</span>.
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            custom={direction}
            className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {testimonials.map((t) => (
              <motion.figure
                key={t.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-card/30 p-6 card-hover sm:p-7"
              >
                <Quote
                  className="absolute right-5 top-5 text-foreground/10 transition-colors group-hover:text-blue-500/30"
                  size={56}
                />
                <div className="relative">
                  <div className="mb-4 flex items-center gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <blockquote className="mb-6 text-base leading-relaxed text-foreground/90 sm:text-lg">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <Initials name={t.name} />
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.role} · {t.company}
                      </div>
                    </div>
                  </figcaption>
                </div>
              </motion.figure>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-foreground/10 bg-card/30 p-6 sm:p-8"
          >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Trusted by teams at</h3>
                <p className="text-sm text-muted-foreground">
                  Companies I&apos;ve shipped production work with
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  100% on-time delivery
                </div>
                <div className="font-mono uppercase tracking-widest">
                  4.95 / 5
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden">
              <div className="flex gap-10 animate-marquee whitespace-nowrap text-lg font-semibold text-muted-foreground opacity-70">
                {[...trustedBy, ...trustedBy].map((name, i) => (
                  <span key={`${name}-${i}`} className="flex items-center gap-10">
                    <span>{name}</span>
                    <span className="text-foreground/20">✦</span>
                  </span>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
