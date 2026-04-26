"use client";

import { motion } from "framer-motion";
import { Briefcase, Building2, Award, Laptop } from "lucide-react";
import { experiences } from "@/data/experience";
import {
  containerVariants,
  itemVariants,
  revealViewport,
  useScrollDirection,
} from "@/lib/animations";

const typeIcon = {
  "full-time": Building2,
  contract: Briefcase,
  freelance: Laptop,
} as const;

export default function ExperienceSection() {
  const direction = useScrollDirection();
  return (
    <section
      id="experience"
      className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />

      <div className="mx-auto max-w-5xl">
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
              Experience
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Seven years of{" "}
              <span className="gradient-text">shipping software</span> that
              people actually use.
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[15px] top-2 h-full w-px bg-gradient-to-b from-blue-500/40 via-purple-500/20 to-transparent sm:left-[23px]" />

            <div className="space-y-10">
              {experiences.map((exp, idx) => {
                const Icon = typeIcon[exp.type] ?? Briefcase;
                return (
                  <motion.article
                    key={exp.id}
                    initial={{ opacity: 0, y: direction === "down" ? 24 : -24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                    viewport={revealViewport}
                    className="relative pl-12 sm:pl-16"
                  >
                    <motion.div
                      className="absolute left-0 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 bg-background ring-4 ring-background sm:h-12 sm:w-12"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/10" />
                      <Icon size={14} className="relative text-blue-400 sm:hidden" />
                      <Icon size={18} className="relative hidden text-blue-400 sm:block" />
                    </motion.div>

                    <div className="group rounded-xl border border-foreground/10 bg-card/30 p-6 transition-colors hover:border-foreground/20">
                      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{exp.title}</h3>
                          <div className="mt-0.5 text-sm">
                            <span className="text-blue-400">{exp.company}</span>
                            <span className="mx-2 text-muted-foreground">·</span>
                            <span className="capitalize text-muted-foreground">
                              {exp.type}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                          {exp.period}
                        </span>
                      </div>

                      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                        {exp.description}
                      </p>

                      <div className="mb-5">
                        <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                          <Award size={12} />
                          Highlights
                        </div>
                        <ul className="space-y-1.5 text-sm">
                          {exp.responsibilities.map((resp, ridx) => (
                            <motion.li
                              key={ridx}
                              initial={{
                                opacity: 0,
                                x: -8,
                                y: direction === "down" ? 8 : -8,
                              }}
                              whileInView={{ opacity: 1, x: 0, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: idx * 0.08 + ridx * 0.04,
                              }}
                              viewport={revealViewport}
                              className="flex items-start gap-2 text-foreground/80"
                            >
                              <span className="mt-2 block h-1 w-1 flex-shrink-0 rounded-full bg-blue-500/60" />
                              <span>{resp}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                          Tech
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-foreground/10 bg-foreground/5 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-foreground/10 bg-card/30 p-6 sm:grid-cols-4"
          >
            {[
              { label: "Years", value: "7+" },
              { label: "Companies", value: "4" },
              { label: "Mentees", value: "15+" },
              { label: "Deploys", value: "10K+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-3xl font-bold text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
