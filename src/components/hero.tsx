"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, MapPin, Play, Sparkles } from "lucide-react";

type Props = {
  name: string;
  title: string;
  tagline: string;
  intro: string;
  availability: string;
  location: string;
  avatarUrl?: string | null;
  featured: { title: string; slug: string; category: string; coverUrl: string | null }[];
};

export function Hero({
  name,
  title,
  tagline,
  intro,
  availability,
  location,
  avatarUrl,
  featured,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yFast = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -90]);
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -35]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0.25]);

  const roles = title.split(/[·|,]/).map((r) => r.trim()).filter(Boolean);

  return (
    <section
      ref={ref}
      className="aurora relative isolate overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <div className="shell grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div style={{ y: ySlow, opacity: fade }}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="chip"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </span>
            {availability}
          </motion.span>

          <h1 className="display mt-6 text-hero">
            {name.split(" ").map((word, i) => (
              <motion.span
                key={word + i}
                className="block overflow-hidden"
                initial={{ opacity: 0, y: "0.35em" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {i === 1 ? (
                  <span className="text-[var(--accent)]">{word.toUpperCase()}</span>
                ) : (
                  word.toUpperCase()
                )}
              </motion.span>
            ))}
          </h1>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-[var(--ink-soft)]"
          >
            {roles.map((role) => (
              <li key={role} className="flex items-center gap-3">
                <span>{role}</span>
                <span className="h-1 w-1 rounded-full bg-[var(--accent)] last:hidden" aria-hidden />
              </li>
            ))}
          </motion.ul>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="display mt-8 max-w-xl text-[clamp(1.35rem,2.4vw,1.9rem)] leading-[1.15]"
          >
            “{tagline}”
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58 }}
            className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-[var(--ink-soft)]"
          >
            {intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.66 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link href="/projects" className="btn btn-primary">
              Explore My Work <ArrowUpRight size={15} />
            </Link>
            <Link href="/hire" className="btn btn-ghost">
              Hire Me
            </Link>
            <span className="ml-1 flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-muted)]">
              <MapPin size={13} /> Based in {location}
            </span>
          </motion.div>
        </motion.div>

        {/* ---------------- floating collage ---------------- */}
        <motion.div style={{ y: yFast }} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-4/5 w-full">
            <div
              className="absolute inset-0 rotate-3 rounded-[2rem] border"
              style={{ borderColor: "var(--surface-border)", background: "var(--bg-elevated)" }}
              aria-hidden
            />
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border" style={{ borderColor: "var(--surface-border)" }}>
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={`${name} — portrait`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 480px"
                  className="object-cover"
                />
              ) : (
                <div
                  className="relative grid h-full w-full place-items-center overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 20% 12%, var(--accent-soft), transparent 60%), radial-gradient(90% 80% at 85% 85%, color-mix(in srgb, #6c5ce7 22%, transparent), transparent 62%), var(--bg-sunken)",
                  }}
                >
                  <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
                  <div className="relative flex flex-col items-center gap-4 px-10 text-center">
                    <span
                      className="display grid h-20 w-20 place-items-center rounded-full text-2xl"
                      style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                      aria-hidden
                    >
                      EA
                    </span>
                    <span className="chip">Placeholder</span>
                    <span className="max-w-[16rem] text-xs leading-relaxed text-[var(--ink-muted)]">
                      No portrait uploaded yet. Add a real photo from the admin dashboard
                      (Profile → Portrait image).
                    </span>
                  </div>
                </div>
              )}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in srgb, var(--bg) 80%, transparent), transparent 55%)",
                }}
              />
            </div>

            <FloatCard
              className="-left-4 top-10 md:-left-12"
              delay={0.8}
              icon={<Play size={13} />}
              label={featured[0]?.category ?? "Video Editing"}
              value={featured[0]?.title ?? "Add your first project"}
            />
            <FloatCard
              className="-right-3 top-1/3 md:-right-10"
              delay={1}
              icon={<Sparkles size={13} />}
              label="Motion Graphics"
              value={featured[1]?.title ?? "Animated brand kits"}
            />
            <FloatCard
              className="bottom-6 left-2 md:-left-8"
              delay={1.2}
              icon={<span className="text-[0.65rem] font-bold">IG</span>}
              label="Social Media"
              value={featured[2]?.title ?? "Reels · Posts · Captions"}
            />
          </div>
        </motion.div>
      </div>

      <div className="shell mt-14 flex items-center gap-3 text-xs font-semibold text-[var(--ink-muted)]">
        <ArrowDown size={14} className="animate-bounce" />
        Scroll to explore
        <span className="rule flex-1" />
      </div>
    </section>
  );
}

function FloatCard({
  className,
  delay,
  icon,
  label,
  value,
}: {
  className: string;
  delay: number;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5 },
        y: { delay, duration: 6, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`glass absolute z-10 max-w-[11.5rem] rounded-2xl p-3 shadow-lg ${className}`}
    >
      <span className="flex items-center gap-1.5 text-[0.6rem] font-bold tracking-[0.16em] uppercase text-[var(--accent)]">
        {icon}
        {label}
      </span>
      <p className="mt-1.5 line-clamp-2 text-[0.8rem] font-semibold leading-snug">{value}</p>
    </motion.div>
  );
}
