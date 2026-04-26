import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "About", href: "#about" },
      { label: "Skills", href: "#skills" },
      { label: "Projects", href: "#projects" },
      { label: "Experience", href: "#experience" },
    ],
  },
  {
    title: "Depth",
    links: [
      { label: "Expertise", href: "#knowledge" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Writing", href: "#writing" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "GitHub", href: "https://github.com/mohmedmahmoud257@gmail.com", external: true },
      { label: "LinkedIn", href: "https://linkedin.com/in/mohmedmahmoud257@gmail.com", external: true },
      { label: "X / Twitter", href: "https://x.com/mohmedmahmoud257@gmail.com", external: true },
      { label: "RSS", href: "/rss.xml" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-foreground/10 bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 mesh-gradient opacity-30" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white">
                M
              </span>
              <span className="font-bold tracking-tight">Mohamed Mahmoud</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Senior full-stack engineer building premium SaaS platforms,
              distributed systems, and AI-powered products. Based in Cairo,
              working globally.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <a
                href="mailto:mohmedmahmoud257@gmail.com"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail size={14} />
                mohmedmahmoud257@gmail.com
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={14} />
                Cairo · GMT ± 6
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              {[
                { Icon: GithubIcon, href: "https://github.com/mohmedmahmoud257@gmail.com", label: "GitHub" },
                { Icon: LinkedinIcon, href: "https://linkedin.com/in/mohmedmahmoud257@gmail.com", label: "LinkedIn" },
                { Icon: XIcon, href: "https://x.com/mohmedmahmoud257@gmail.com", label: "X" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-blue-500/50 hover:text-blue-400"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {col.title}
              </div>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground/80 transition-colors hover:text-blue-400"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-foreground/80 transition-colors hover:text-blue-400"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-foreground/10 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>
            © {year} Mohamed Mahmoud · Crafted with Next.js, TypeScript &
            Framer Motion.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available Q3 2026
            </span>
            <kbd className="inline-flex items-center gap-1 rounded border border-foreground/10 bg-foreground/5 px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K for menu
            </kbd>
          </div>
        </div>
      </div>
    </footer>
  );
}
