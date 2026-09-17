import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Download, Mail, Phone } from "lucide-react";
import { Hero } from "@/components/hero";
import { ProjectRail } from "@/components/project-rail";
import { LogoMarquee } from "@/components/logo-marquee";
import { VideoPlayer } from "@/components/video-player";
import { Reveal } from "@/components/reveal";
import {
  Certifications,
  Process,
  SectionHeading,
  ServiceGrid,
  Stats,
  Testimonials,
} from "@/components/sections";
import {
  getCertifications,
  getLogos,
  getProfile,
  getProjectMediaMap,
  getProjects,
  getServices,
  getSettings,
  getTestimonials,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, services, projects, testimonials, logos, certs, settings] = await Promise.all([
    getProfile(),
    getServices(),
    getProjects({ onlyPublished: true }),
    getTestimonials(),
    getLogos(),
    getCertifications(),
    getSettings(),
  ]);

  const mediaMap = await getProjectMediaMap(projects.map((p) => p.id));
  const cards = projects.map((p) => ({
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
  }));

  const counts: Record<string, number> = {};
  for (const project of projects) counts[project.category] = (counts[project.category] ?? 0) + 1;

  const featured = cards.filter((c) => projects.find((p) => p.id === c.id)?.featured);
  // Featured projects lead the rail; the remaining published work follows so the
  // carousel never looks half-empty when only one or two items are featured.
  const featuredIds = new Set(featured.map((c) => c.id));
  const rail = [...featured, ...cards.filter((c) => !featuredIds.has(c.id))].slice(0, 10);

  const stats = [
    { label: "Projects Completed", value: Number(settings.statProjects ?? projects.length) },
    { label: "Creative Services", value: Number(settings.statServices ?? services.length) },
    { label: "Happy Clients", value: Number(settings.statClients ?? 0) },
    { label: "Years of Experience", value: Number(settings.statYears ?? 0) },
  ];

  return (
    <>
      <Hero
        name={profile?.name ?? "Efrata Alex"}
        title={profile?.title ?? ""}
        tagline={profile?.tagline ?? ""}
        intro={profile?.intro ?? ""}
        availability={profile?.availability ?? "Available for creative projects"}
        location={profile?.location ?? "Ethiopia"}
        avatarUrl={profile?.avatarUrl}
        featured={rail.map((r) => ({ title: r.title, slug: r.slug, category: r.category, coverUrl: r.coverUrl }))}
      />

      {/* -------------------------- clients marquee -------------------------- */}
      <section className="pb-6 md:pb-10">
        <div className="shell mb-6">
          <p className="eyebrow text-center">Brands & organizations</p>
        </div>
        <LogoMarquee
          logos={logos.map((l) => ({
            id: l.id,
            companyName: l.companyName,
            website: l.website,
            logoUrl: l.logoUrl,
            isSample: l.isSample,
          }))}
        />
      </section>

      {/* ------------------------------- about ------------------------------ */}
      <section id="about" className="section scroll-mt-28">
        <div className="shell">
          <SectionHeading
            eyebrow="About"
            title="Creative work with clarity and purpose"
            description={profile?.tagline}
          />
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <div className="space-y-5 text-[0.96rem] leading-relaxed text-[var(--ink-soft)]">
                {(profile?.bio ?? "").split("\n").filter(Boolean).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}

                {profile?.experience && (
                  <div>
                    <p className="eyebrow mb-2">Experience</p>
                    <p>{profile.experience}</p>
                  </div>
                )}
                {profile?.philosophy && (
                  <div>
                    <p className="eyebrow mb-2">Creative philosophy</p>
                    <p>{profile.philosophy}</p>
                  </div>
                )}
                {profile?.approach && (
                  <div>
                    <p className="eyebrow mb-2">Working approach</p>
                    <p>{profile.approach}</p>
                  </div>
                )}

                {!!profile?.skills?.length && (
                  <div>
                    <p className="eyebrow mb-2.5">Skills & tools</p>
                    <ul className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <li key={skill} className="chip">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  {profile?.cvUrl && (
                    <a href={profile.cvUrl} download className="btn btn-ghost">
                      <Download size={14} /> Download CV
                    </a>
                  )}
                  <Link href="/hire" className="btn btn-primary">
                    Hire Me <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="lg:sticky lg:top-28">
                <VideoPlayer
                  src={profile?.aboutVideoUrl}
                  poster={profile?.aboutVideoThumbUrl}
                  captions={profile?.aboutVideoCaptionsUrl}
                  label="Meet Efrata — About me video"
                />
                {profile?.avatarUrl && (
                  <div className="mt-5 flex items-center gap-4">
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <p className="text-sm text-[var(--ink-soft)]">
                      <span className="block font-bold text-[var(--ink)]">{profile.name}</span>
                      {profile.availability}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------- services ---------------------------- */}
      <section id="services" className="section scroll-mt-28" style={{ background: "var(--bg-sunken)" }}>
        <div className="shell">
          <SectionHeading
            eyebrow="Services"
            title="What I can create for you"
            description="Six focused creative services — click any service to see the matching work."
          />
          <ServiceGrid
            services={services.map((s) => ({
              id: s.id,
              title: s.title,
              slug: s.slug,
              description: s.description,
              icon: s.icon,
              imageUrl: s.imageUrl,
              category: s.category,
            }))}
            counts={counts}
          />
        </div>
      </section>

      {/* --------------------------- latest projects ------------------------ */}
      <section id="work" className="section scroll-mt-28">
        <div className="shell">
          <SectionHeading
            eyebrow="Latest projects"
            title="Selected creative work"
            description="Drag, swipe or use the arrows to browse. Open any project for the full case study."
            action={
              <Link href="/projects" className="btn btn-ghost shrink-0">
                All projects <ArrowUpRight size={14} />
              </Link>
            }
          />
          <ProjectRail projects={rail} />
        </div>
      </section>

      {/* ------------------------------ process ---------------------------- */}
      <section className="section" style={{ background: "var(--bg-sunken)" }}>
        <div className="shell">
          <SectionHeading eyebrow="Creative process" title="How a project moves from idea to delivery" />
          <Process />
        </div>
      </section>

      {/* ------------------------------- stats ----------------------------- */}
      <section className="section !py-14">
        <div className="shell">
          <Stats stats={stats} />
        </div>
      </section>

      {/* ---------------------------- testimonials ------------------------- */}
      <section id="testimonials" className="section scroll-mt-28" style={{ background: "var(--bg-sunken)" }}>
        <div className="shell">
          <SectionHeading eyebrow="Testimonials" title="What people say about working with me" />
          <Testimonials
            items={testimonials.map((t) => ({
              id: t.id,
              clientName: t.clientName,
              role: t.role,
              company: t.company,
              quote: t.quote,
              rating: t.rating,
              photoUrl: t.photoUrl,
              isSample: t.isSample,
            }))}
          />
        </div>
      </section>

      {/* --------------------------- certifications ------------------------ */}
      {certs.length > 0 && (
        <section id="certifications" className="section scroll-mt-28">
          <div className="shell">
            <SectionHeading eyebrow="Certifications" title="Achievements & credentials" />
            <Certifications
              items={certs.map((c) => ({
                id: c.id,
                title: c.title,
                organization: c.organization,
                issuedDate: c.issuedDate,
                description: c.description,
                imageUrl: c.imageUrl,
                pdfUrl: c.pdfUrl,
                verifyUrl: c.verifyUrl,
                isSample: c.isSample,
              }))}
            />
          </div>
        </section>
      )}

      {/* ------------------------------ contact CTA ------------------------ */}
      <section id="contact-cta" className="section" style={{ background: "var(--bg-sunken)" }}>
        <div className="shell">
          <Reveal>
            <div className="card aurora relative overflow-hidden p-8 md:p-14">
              <p className="eyebrow">Contact</p>
              <h2 className="display mt-3 max-w-2xl text-display">
                Let’s create something great together.
              </h2>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/hire" className="btn btn-primary">
                  Hire Me <ArrowUpRight size={14} />
                </Link>
                <Link href="/contact" className="btn btn-ghost">
                  Send a message
                </Link>
                <a href={`mailto:${profile?.email}`} className="chip">
                  <Mail size={13} /> {profile?.email}
                </a>
                <a href={`tel:${(profile?.phone ?? "").replace(/\s/g, "")}`} className="chip">
                  <Phone size={13} /> {profile?.phone}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
