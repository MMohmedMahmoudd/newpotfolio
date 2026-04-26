"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Pencil, Rss } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import {
  containerVariants,
  itemVariants,
  revealViewport,
  useScrollDirection,
} from "@/lib/animations";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WritingSection() {
  const [featured, ...rest] = blogPosts;
  const direction = useScrollDirection();

  return (
    <section
      id="writing"
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
                Writing & insights
              </div>
              <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Essays on <span className="gradient-text">building well</span>.
              </h2>
            </div>
            <a
              href="/rss.xml"
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-card/30 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <Rss size={14} />
              Subscribe
            </a>
          </motion.div>

          {featured && (
            <motion.article
              variants={itemVariants}
              className="mb-10 group"
            >
              <Link
                href={`/blog/${featured.id}`}
                className="grid grid-cols-1 overflow-hidden rounded-2xl border border-foreground/10 bg-card/30 transition-colors hover:border-foreground/20 md:grid-cols-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-pink-500/10 md:aspect-auto">
                  <div className="absolute inset-0 grid-pattern opacity-30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Pencil
                      size={64}
                      className="text-foreground/15 transition-transform duration-500 group-hover:scale-110 group-hover:text-blue-400/40"
                    />
                  </div>
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur">
                    Featured
                  </div>
                </div>
                <div className="flex flex-col justify-between p-6 sm:p-8">
                  <div>
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {featured.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-foreground/10 bg-foreground/5 px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="mb-3 text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-blue-400 sm:text-3xl">
                      {featured.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {featured.excerpt}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span>{formatDate(featured.date)}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} />
                        {featured.readTime} min
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-semibold text-blue-400">
                      Read
                      <ArrowUpRight
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {rest.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: direction === "down" ? 20 : -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={revealViewport}
                className="group"
              >
                <Link
                  href={`/blog/${post.id}`}
                  className="flex h-full flex-col rounded-xl border border-foreground/10 bg-card/30 p-6 transition-colors hover:border-foreground/20"
                >
                  <div className="mb-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{formatDate(post.date)}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} />
                      {post.readTime} min
                    </span>
                  </div>
                  <h3 className="mb-2 font-semibold leading-snug transition-colors group-hover:text-blue-400">
                    {post.title}
                  </h3>
                  <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5 border-t border-foreground/5 pt-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <motion.div variants={itemVariants} className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300"
            >
              All writing
              <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
