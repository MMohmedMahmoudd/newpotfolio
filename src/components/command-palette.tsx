"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  Search,
  Home,
  User,
  Briefcase,
  FolderGit2,
  BookOpen,
  Mail,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  Calendar,
  FileText,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { useTheme } from "next-themes";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";

type Item = {
  id: string;
  label: string;
  hint?: string;
  section: string;
  icon: typeof Home;
  run: () => void;
  keywords?: string;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const go = (hash: string) => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.location.hash = hash;
    }
  };

  const openUrl = (url: string) => {
    setOpen(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const items = useMemo<Item[]>(() => {
    const navItems: Item[] = [
      { id: "home", label: "Home", section: "Navigate", icon: Home, run: () => go("home") },
      { id: "about", label: "About", section: "Navigate", icon: User, run: () => go("about") },
      { id: "skills", label: "Skills", section: "Navigate", icon: Sparkles, run: () => go("skills") },
      { id: "projects", label: "Projects", section: "Navigate", icon: FolderGit2, run: () => go("projects") },
      { id: "experience", label: "Experience", section: "Navigate", icon: Briefcase, run: () => go("experience") },
      { id: "knowledge", label: "Expertise", section: "Navigate", icon: BookOpen, run: () => go("knowledge") },
      { id: "writing", label: "Writing", section: "Navigate", icon: FileText, run: () => go("writing") },
      { id: "contact", label: "Contact", section: "Navigate", icon: Mail, run: () => go("contact") },
    ];

    const actionItems: Item[] = [
      {
        id: "theme-dark",
        label: "Switch to dark mode",
        section: "Actions",
        icon: Moon,
        run: () => {
          setTheme("dark");
          setOpen(false);
        },
      },
      {
        id: "theme-light",
        label: "Switch to light mode",
        section: "Actions",
        icon: Sun,
        run: () => {
          setTheme("light");
          setOpen(false);
        },
      },
      {
        id: "book",
        label: "Book intro call",
        hint: "Cal.com",
        section: "Actions",
        icon: Calendar,
        run: () => openUrl("https://cal.com/mohmedmahmoud257@gmail.com/intro"),
      },
      {
        id: "email",
        label: "Email me",
        hint: "mohmedmahmoud257@gmail.com",
        section: "Actions",
        icon: Mail,
        run: () => {
          window.location.href = "mailto:mohmedmahmoud257@gmail.com";
          setOpen(false);
        },
      },
      {
        id: "resume",
        label: "Download resume (PDF)",
        section: "Actions",
        icon: FileText,
        run: () => openUrl("/resume.pdf"),
      },
    ];

    const socialItems: Item[] = [
      {
        id: "gh",
        label: "GitHub",
        section: "Links",
        icon: GithubIcon as unknown as typeof Home,
        run: () => openUrl("https://github.com/mohmedmahmoud257@gmail.com"),
      },
      {
        id: "li",
        label: "LinkedIn",
        section: "Links",
        icon: LinkedinIcon as unknown as typeof Home,
        run: () => openUrl("https://linkedin.com/in/mohmedmahmoud257@gmail.com"),
      },
    ];

    const projectItems: Item[] = projects.map((p) => ({
      id: `project-${p.id}`,
      label: p.title,
      hint: p.category,
      section: "Projects",
      icon: FolderGit2,
      run: () => go(`projects`),
      keywords: `${p.tags.join(" ")} ${p.stack.join(" ")}`,
    }));

    const blogItems: Item[] = blogPosts.slice(0, 4).map((b) => ({
      id: `blog-${b.id}`,
      label: b.title,
      hint: `${b.readTime} min`,
      section: "Writing",
      icon: BookOpen,
      run: () => go("writing"),
      keywords: b.tags.join(" "),
    }));

    return [...navItems, ...actionItems, ...socialItems, ...projectItems, ...blogItems];
  }, [setTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      `${i.label} ${i.section} ${i.hint ?? ""} ${i.keywords ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const grouped = useMemo(() => {
    const g: Record<string, Item[]> = {};
    for (const it of filtered) {
      if (!g[it.section]) g[it.section] = [];
      g[it.section].push(it);
    }
    return g;
  }, [filtered]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[active];
      if (item) item.run();
    }
  };

  let running = 0;

  return (
    <>
      <button
        type="button"
        aria-label="Open command palette"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 hidden h-12 items-center gap-2 rounded-full border border-foreground/10 glass-strong px-4 text-xs text-muted-foreground shadow-lg transition-all hover:text-foreground md:inline-flex"
      >
        <Search size={14} />
        <span>Search</span>
        <kbd className="ml-2 rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[10px]">
          ⌘ K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-foreground/10 glass-strong shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-3.5">
                <Command size={16} className="text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search or run a command…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
                <kbd className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[50vh] overflow-y-auto p-2">
                {Object.keys(grouped).length === 0 && (
                  <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                    Nothing matches &ldquo;{query}&rdquo;
                  </div>
                )}
                {Object.entries(grouped).map(([section, list]) => (
                  <div key={section} className="mb-2">
                    <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {section}
                    </div>
                    {list.map((item) => {
                      const idx = running++;
                      const Icon = item.icon;
                      const isActive = idx === active;
                      return (
                        <button
                          key={item.id}
                          onClick={item.run}
                          onMouseEnter={() => setActive(idx)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                            isActive
                              ? "bg-blue-500/10 text-foreground"
                              : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                          }`}
                        >
                          <Icon
                            size={14}
                            className={
                              isActive
                                ? "text-blue-400"
                                : "text-muted-foreground"
                            }
                          />
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.hint && (
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {item.hint}
                            </span>
                          )}
                          {isActive && (
                            <ArrowRight
                              size={12}
                              className="text-blue-400"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-foreground/10 px-4 py-2.5 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[10px]">
                      ↵
                    </kbd>
                    open
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[10px]">
                      ↑↓
                    </kbd>
                    navigate
                  </span>
                </div>
                <span>Command Menu</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
