"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Film, Calendar, User } from "lucide-react";

export type CardProject = {
  id: number;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  client: string | null;
  projectDate: string | null;
  tools: string[];
  coverUrl: string | null;
  hasVideo?: boolean;
  isSample?: boolean;
};

export function ProjectCard({ project, wide = false }: { project: CardProject; wide?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      whileHover={reduced ? undefined : { y: -6, rotateX: 1.5, rotateY: -1.5 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 900 }}
      className="card group relative flex h-full flex-col overflow-hidden"
    >
      <Link href={`/projects/${project.slug}`} className="flex h-full flex-col">
        <div className={`relative overflow-hidden ${wide ? "aspect-16/10" : "aspect-4/3"}`}>
          {project.coverUrl ? (
            <Image
              src={project.coverUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
          ) : (
            <div className="grid h-full place-items-center bg-[var(--bg-sunken)] text-xs text-[var(--ink-muted)]">
              No cover image yet
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="glass rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em]">
              {project.category}
            </span>
            {project.hasVideo && (
              <span className="glass flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em]">
                <Film size={11} /> Video
              </span>
            )}
          </div>
          {project.isSample && (
            <span className="absolute right-3 top-3 rounded-full bg-[var(--accent)] px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-[var(--accent-ink)]">
              Sample
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="display text-[1.15rem] leading-tight">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-[0.86rem] leading-relaxed text-[var(--ink-soft)]">
            {project.shortDescription}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.72rem] text-[var(--ink-muted)]">
            {project.client && (
              <span className="flex items-center gap-1.5">
                <User size={11} /> {project.client}
              </span>
            )}
            {project.projectDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={11} /> {project.projectDate}
              </span>
            )}
          </div>

          {project.tools?.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.tools.slice(0, 4).map((tool) => (
                <li key={tool} className="chip !px-2 !py-0.5 !text-[0.62rem]">
                  {tool}
                </li>
              ))}
            </ul>
          )}

          <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-[var(--accent)]">
            View Project
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
