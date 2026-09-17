import Link from "next/link";
import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/sections";
import { getProjectMediaMap, getProjects } from "@/lib/queries";
import { PROJECT_CATEGORIES } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Portfolio of video editing, social media, graphic design, motion graphics and content creation projects by Efrata Alex.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const projects = await getProjects({ onlyPublished: true });
  const mediaMap = await getProjectMediaMap(projects.map((p) => p.id));
  const active = category && PROJECT_CATEGORIES.includes(category as never) ? category : undefined;
  const visible = active ? projects.filter((p) => p.category === active) : projects;

  return (
    <div className="pt-32 md:pt-40">
      <div className="shell">
        <SectionHeading
          eyebrow="Portfolio"
          title={active ?? "All projects"}
          description="Every project below opens into a full case study with images, videos and results."
        />

        <nav aria-label="Filter by category" className="mb-10 flex flex-wrap gap-2">
          <Link href="/projects" className={`chip ${!active ? "!border-[var(--accent)] !text-[var(--accent)]" : ""}`}>
            All ({projects.length})
          </Link>
          {PROJECT_CATEGORIES.map((cat) => {
            const count = projects.filter((p) => p.category === cat).length;
            if (!count) return null;
            return (
              <Link
                key={cat}
                href={`/projects?category=${encodeURIComponent(cat)}`}
                className={`chip ${active === cat ? "!border-[var(--accent)] !text-[var(--accent)]" : ""}`}
              >
                {cat} ({count})
              </Link>
            );
          })}
        </nav>

        {visible.length === 0 ? (
          <p className="card p-10 text-center text-sm text-[var(--ink-muted)]">
            No projects in this category yet.
          </p>
        ) : (
          <div className="grid gap-5 pb-24 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <ProjectCard
                key={p.id}
                project={{
                  id: p.id,
                  title: p.title,
                  slug: p.slug,
                  category: p.category,
                  shortDescription: p.shortDescription,
                  client: p.client,
                  projectDate: p.projectDate,
                  tools: p.tools,
                  coverUrl: p.coverUrl,
                  isSample: p.isSample,
                  hasVideo: (mediaMap.get(p.id) ?? []).some((m) => m.kind === "video"),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
