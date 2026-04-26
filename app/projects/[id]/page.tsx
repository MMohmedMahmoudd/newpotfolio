import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Target, Lightbulb } from "lucide-react";
import { projects } from "@/data/projects";
import { GithubIcon } from "@/components/ui/brand-icons";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await props.params;
  const project = projects.find((p) => p.id === id);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — Case study`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage(props: { params: Params }) {
  const { id } = await props.params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.longDescription,
    author: { "@type": "Person", name: "Mohamed Mahmoud" },
    keywords: [...project.tags, ...project.stack].join(", "),
    url: project.demoUrl,
  };

  return (
    <article className="relative pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 mesh-gradient opacity-60" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/#projects"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          All projects
        </Link>

        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-400">
            {project.category}
          </span>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-foreground/10 bg-foreground/5 px-2.5 py-0.5 text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {project.title}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {project.longDescription}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-5px_rgba(99,102,241,0.5)]"
            >
              Live demo
              <ArrowUpRight size={14} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card/30 px-5 py-2.5 text-sm font-semibold"
            >
              <GithubIcon size={14} />
              Source
            </a>
          )}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-foreground/10 bg-card/30 p-6 sm:grid-cols-4">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
                {metric.value}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-foreground/10 bg-card/30 p-6">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-400">
              <Target size={14} />
              Problem
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">
              {project.challenge}
            </p>
          </section>
          <section className="rounded-2xl border border-foreground/10 bg-card/30 p-6">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
              <Lightbulb size={14} />
              Solution
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">
              {project.solution}
            </p>
          </section>
        </div>

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">My role</h2>
          <p className="text-foreground/90">{project.role}</p>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-foreground/10 bg-card/30 px-3 py-1.5 font-mono text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Features shipped</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {project.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-card/30 p-4 text-sm"
              >
                <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 rounded-2xl border border-foreground/10 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent p-8 text-center">
          <h2 className="text-2xl font-bold">Have a similar problem?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            I take on a small number of engagements each quarter. Let&apos;s talk.
          </p>
          <Link
            href="/#contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white"
          >
            Get in touch
            <ArrowUpRight size={14} />
          </Link>
        </section>
      </div>
    </article>
  );
}
