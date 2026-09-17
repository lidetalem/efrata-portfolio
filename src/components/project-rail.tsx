"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectCard, type CardProject } from "./project-card";

/**
 * Horizontal, draggable, touch-friendly rail. Uses native scroll (so keyboard,
 * trackpad and touch all work) plus pointer-drag and arrow buttons.
 * Contained overflow — never causes page-wide horizontal scrolling.
 */
export function ProjectRail({ projects }: { projects: CardProject[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const state = useRef({ startX: 0, startScroll: 0 });

  function scrollBy(direction: 1 | -1) {
    ref.current?.scrollBy({ left: direction * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  }

  if (!projects.length) {
    return (
      <p className="card p-8 text-center text-sm text-[var(--ink-muted)]">
        No projects published yet. Add your first project from the admin dashboard.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end gap-2">
        <button type="button" onClick={() => scrollBy(-1)} className="btn btn-ghost !px-3 !py-2" aria-label="Scroll left">
          <ChevronLeft size={16} />
        </button>
        <button type="button" onClick={() => scrollBy(1)} className="btn btn-ghost !px-3 !py-2" aria-label="Scroll right">
          <ChevronRight size={16} />
        </button>
      </div>

      <div
        ref={ref}
        role="region"
        aria-label="Latest projects carousel"
        tabIndex={0}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          setDragging(true);
          state.current = { startX: e.clientX, startScroll: ref.current?.scrollLeft ?? 0 };
        }}
        onPointerMove={(e) => {
          if (!dragging || !ref.current) return;
          ref.current.scrollLeft = state.current.startScroll - (e.clientX - state.current.startX);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
        className={`no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {projects.map((project) => (
          <div key={project.id} className="w-[78vw] shrink-0 snap-start sm:w-[22rem]">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
