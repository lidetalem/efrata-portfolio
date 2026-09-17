import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { VideoPlayer } from "@/components/video-player";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { getProjectBySlug, incrementProjectViews } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);
  if (!data) return { title: "Project not found" };
  const { project } = data;
  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.shortDescription,
    openGraph: {
      title: project.seoTitle || project.title,
      description: project.seoDescription || project.shortDescription,
      images: project.coverUrl ? [project.coverUrl] : undefined,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);
  if (!data || !data.project.published) notFound();
  const { project, media, related, previous, next } = data;
  await incrementProjectViews(project.id);

  const images = media.filter((m) => m.kind === "image");
  const videos = media.filter((m) => m.kind === "video");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    creator: { "@type": "Person", name: "Efrata Alex" },
    genre: project.category,
    dateCreated: project.projectDate || undefined,
  };

  return (
    <article className="pt-28 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="shell">
        <Link href="/projects" className="chip">
          <ArrowLeft size={13} /> All projects
        </Link>

        <header className="mt-6 max-w-4xl">
          <p className="eyebrow">{project.category}</p>
          <h1 className="display mt-3 text-display">{project.title}</h1>
          {project.isSample && (
            <p className="mt-4 inline-block rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)]">
              Sample project — placeholder content to be replaced with Efrata’s real work.
            </p>
          )}
          <p className="mt-5 text-[1.02rem] leading-relaxed text-[var(--ink-soft)]">{project.shortDescription}</p>
        </header>

        <dl className="mt-8 grid gap-4 rounded-2xl border p-5 sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: "var(--surface-border)" }}>
          <Meta label="Client" value={project.client} />
          <Meta label="Date" value={project.projectDate} />
          <Meta label="Role" value={project.role} />
          <Meta label="Tools" value={project.tools?.join(", ")} />
        </dl>

        {project.coverUrl && (
          <Reveal className="mt-10">
            <div className="relative aspect-16/9 overflow-hidden rounded-[1.5rem] border" style={{ borderColor: "var(--surface-border)" }}>
              <Image src={project.coverUrl} alt={project.title} fill priority sizes="100vw" className="object-cover" />
            </div>
          </Reveal>
        )}

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8">
            {project.description && (
              <Block title="About this project">
                {project.description.split("\n").filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Block>
            )}
            {project.objective && <Block title="Objective">{<p>{project.objective}</p>}</Block>}
            {project.results && <Block title="Results">{<p>{project.results}</p>}</Block>}
          </div>

          <aside className="space-y-4">
            {project.beforeUrl && project.afterUrl && (
              <div className="card p-4">
                <p className="eyebrow mb-3">Before / After</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Before", url: project.beforeUrl },
                    { label: "After", url: project.afterUrl },
                  ].map((item) => (
                    <figure key={item.label}>
                      <div className="relative aspect-4/3 overflow-hidden rounded-lg">
                        <Image src={item.url} alt={`${project.title} — ${item.label}`} fill sizes="240px" className="object-cover" />
                      </div>
                      <figcaption className="mt-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                        {item.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}
            <div className="card p-5">
              <p className="eyebrow">Like this work?</p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                Tell me about your project and I’ll come back with a plan.
              </p>
              <Link href="/hire" className="btn btn-primary mt-4 w-full">
                Hire Me <ArrowUpRight size={14} />
              </Link>
            </div>
          </aside>
        </div>

        {videos.length > 0 && (
          <section className="mt-14">
            <h2 className="display text-section">Videos</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {videos.map((video) => (
                <div key={video.id}>
                  <VideoPlayer src={video.url} poster={video.thumbUrl} label={video.caption || project.title} />
                  {video.caption && <p className="mt-2 text-xs text-[var(--ink-muted)]">{video.caption}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {images.length > 0 && (
          <section className="mt-14">
            <h2 className="display text-section">Gallery</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, i) => (
                <Reveal key={image.id} delay={i * 0.05}>
                  <figure>
                    <div className="relative aspect-4/3 overflow-hidden rounded-xl border" style={{ borderColor: "var(--surface-border)" }}>
                      <Image
                        src={image.url}
                        alt={image.caption || `${project.title} image ${i + 1}`}
                        fill
                        loading="lazy"
                        sizes="(max-width:768px) 90vw, 380px"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    {image.caption && <figcaption className="mt-2 text-xs text-[var(--ink-muted)]">{image.caption}</figcaption>}
                  </figure>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <nav className="mt-16 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:justify-between" style={{ borderColor: "var(--surface-border)" }}>
          {previous ? (
            <Link href={`/projects/${previous.slug}`} className="btn btn-ghost">
              <ArrowLeft size={14} /> {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/projects/${next.slug}`} className="btn btn-ghost">
              {next.title} <ArrowRight size={14} />
            </Link>
          )}
        </nav>

        {related.length > 0 && (
          <section className="mt-16 pb-24">
            <h2 className="display text-section">Related projects</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
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
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1.5 text-sm font-semibold">{value || "—"}</dd>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="display text-section">{title}</h2>
      <div className="mt-4 space-y-4 text-[0.96rem] leading-relaxed text-[var(--ink-soft)]">{children}</div>
    </section>
  );
}
