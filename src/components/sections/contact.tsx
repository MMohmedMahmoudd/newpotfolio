"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle2,
} from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/ui/brand-icons";
import {
  containerVariants,
  itemVariants,
  revealViewport,
  useScrollDirection,
} from "@/lib/animations";

const socials = [
  {
    icon: GithubIcon,
    href: "https://github.com/mohmedmahmoud257@gmail.com",
    label: "GitHub",
  },
  {
    icon: LinkedinIcon,
    href: "https://linkedin.com/in/mohmedmahmoud257@gmail.com",
    label: "LinkedIn",
  },
  {
    icon: XIcon,
    href: "https://x.com/mohmedmahmoud257@gmail.com",
    label: "X / Twitter",
  },
];

type Status = "idle" | "sending" | "sent";

export default function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [budget, setBudget] = useState<string | null>(null);
  const [projectType, setProjectType] = useState<string | null>(null);
  const direction = useScrollDirection();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
    (e.currentTarget as HTMLFormElement).reset();
    setBudget(null);
    setProjectType(null);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 mesh-gradient opacity-50" />
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
              Let&apos;s build something
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Ready when you are.{" "}
              <span className="gradient-text">Let&apos;s talk.</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              I take on a small number of engagements each quarter. If your
              problem is interesting and the fit is right, you&apos;ll hear back
              within one business day.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-4"
            >
              <div className="rounded-2xl border border-foreground/10 glass p-6">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Booking Q3 2026
                </div>
                <p className="mb-5 text-sm text-muted-foreground">
                  Currently open to 1-2 new engagements. Typical projects run
                  4–12 weeks.
                </p>
                <a
                  href="https://cal.com/mohmedmahmoud257@gmail.com/intro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                >
                  <Calendar size={16} />
                  Book a 20-min intro call
                </a>
              </div>

              <div className="rounded-2xl border border-foreground/10 bg-card/30 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Other ways
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-blue-400">
                      <Mail size={15} />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">
                        Email
                      </div>
                      <a
                        href="mailto:mohmedmahmoud257@gmail.com"
                        className="text-sm font-semibold hover:text-blue-400"
                      >
                        mohmedmahmoud257@gmail.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-blue-400">
                      <MessageSquare size={15} />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">
                        Response time
                      </div>
                      <div className="text-sm font-semibold">
                        Within 24 hours · Mon–Fri
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-blue-400">
                      <MapPin size={15} />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">
                        Based in
                      </div>
                      <div className="text-sm font-semibold">
                        Cairo · working globally (GMT ± 6)
                      </div>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 border-t border-foreground/10 pt-5">
                  <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                    Elsewhere
                  </div>
                  <div className="flex gap-2">
                    {socials.map((s) => {
                      const Icon = s.icon;
                      return (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-blue-500/50 hover:text-blue-400"
                        >
                          <Icon size={16} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form
              variants={itemVariants}
              onSubmit={onSubmit}
              className="lg:col-span-3 rounded-2xl border border-foreground/10 bg-card/30 p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Name" name="name" required placeholder="Ada Lovelace" />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  required
                  placeholder="ada@company.com"
                />
              </div>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Company" name="company" placeholder="Company Inc." />
                <Field
                  label="Website / product"
                  name="website"
                  placeholder="https://"
                />
              </div>

              <div className="mt-6">
                <Label>Project type</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["New build", "Rescue / rewrite", "AI integration", "Advisory"].map(
                    (t) => (
                      <Chip
                        key={t}
                        label={t}
                        active={projectType === t}
                        onClick={() => setProjectType(t)}
                      />
                    ),
                  )}
                </div>
              </div>

              <div className="mt-6">
                <Label>Budget range</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["< $10k", "$10k – $30k", "$30k – $75k", "$75k +"].map((b) => (
                    <Chip
                      key={b}
                      label={b}
                      active={budget === b}
                      onClick={() => setBudget(b)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="message">What are you building?</Label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about the problem, timeline, and what success looks like."
                  className="mt-2 w-full rounded-xl border border-foreground/10 bg-background/50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <input type="hidden" name="projectType" value={projectType ?? ""} />
              <input type="hidden" name="budget" value={budget ?? ""} />

              <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-muted-foreground">
                  By submitting, you agree I may reply via email. No newsletters,
                  ever.
                </p>
                <button
                  type="submit"
                  disabled={status !== "idle"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-5px_rgba(99,102,241,0.5)] transition-all hover:shadow-[0_14px_40px_-5px_rgba(99,102,241,0.7)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "idle" && (
                    <>
                      Send message
                      <Send size={15} />
                    </>
                  )}
                  {status === "sending" && "Sending…"}
                  {status === "sent" && (
                    <>
                      Sent — talk soon
                      <CheckCircle2 size={15} />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
    >
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-blue-500"> *</span>}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-foreground/10 bg-background/50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
        active
          ? "border-blue-500/50 bg-blue-500/10 text-foreground"
          : "border-foreground/10 bg-foreground/5 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
