import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Award,
  Camera,
  Download,
  Film,
  CalendarClock,
  Megaphone,
  PenTool,
  TrendingUp,
  Quote,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";
import { Reveal, Counter } from "./reveal";

/* ------------------------------ headings -------------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Reveal className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-3 text-display">{title}</h2>
        {description && <p className="mt-4 text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">{description}</p>}
      </div>
      {action}
    </Reveal>
  );
}

/* ------------------------------ services -------------------------------- */

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  Film,
  CalendarClock,
  Megaphone,
  PenTool,
  TrendingUp,
  Wand2,
  Camera,
  Sparkles,
  Award,
};

export function ServiceGrid({
  services,
  counts,
}: {
  services: { id: number; title: string; slug: string; description: string; icon: string; imageUrl: string | null; category: string }[];
  counts: Record<string, number>;
}) {
  if (!services.length)
    return <p className="card p-8 text-center text-sm text-[var(--ink-muted)]">No services published yet.</p>;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => {
        const Icon = ICONS[service.icon] ?? Sparkles;
        const count = counts[service.category] ?? 0;
        return (
          <Reveal key={service.id} delay={i * 0.06} as="article" className="h-full">
            <div className="card group relative flex h-full flex-col overflow-hidden p-6">
              {service.imageUrl && (
                <div className="relative mb-5 aspect-16/10 overflow-hidden rounded-xl">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    sizes="(max-width:768px) 90vw, 360px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-500 group-hover:-translate-y-1">
                <Icon size={19} />
              </span>
              <h3 className="display mt-4 text-[1.2rem]">{service.title}</h3>
              <p className="mt-2.5 flex-1 text-[0.87rem] leading-relaxed text-[var(--ink-soft)]">{service.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="chip">
                  {count} {count === 1 ? "project" : "projects"}
                </span>
                <Link
                  href={`/projects?category=${encodeURIComponent(service.category)}`}
                  className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-[var(--accent)]"
                >
                  View Projects <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ------------------------------- process -------------------------------- */

const PROCESS = [
  { step: "01", title: "Discover", body: "Understand the client’s goals, brand and audience before anything is designed." },
  { step: "02", title: "Plan", body: "Develop creative concepts, references and a clear visual direction." },
  { step: "03", title: "Create", body: "Design, edit, animate and produce the content." },
  { step: "04", title: "Refine", body: "Review together, sharpen the details and improve the work." },
  { step: "05", title: "Deliver", body: "Hand over polished, platform-ready final content." },
];

export function Process() {
  return (
    <ol className="grid gap-4 md:grid-cols-5">
      {PROCESS.map((item, i) => (
        <Reveal key={item.step} delay={i * 0.08} as="li" className="h-full">
          <div className="card h-full p-5">
            <span className="display text-[2rem] text-[var(--accent)] opacity-90">{item.step}</span>
            <h3 className="display mt-2 text-[1.05rem] uppercase tracking-wide">{item.title}</h3>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-[var(--ink-soft)]">{item.body}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

/* -------------------------------- stats --------------------------------- */

export function Stats({ stats }: { stats: { label: string; value: number; suffix?: string }[] }) {
  return (
    <div>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.07}>
            <div className="card p-6">
              <dd className="display text-[2.6rem] text-[var(--accent)]">
                {stat.value > 0 ? (
                  <Counter value={stat.value} suffix={stat.suffix} />
                ) : (
                  <span className="text-[var(--ink-muted)]" title="Not set yet">
                    &mdash;
                  </span>
                )}
              </dd>
              <dt className="mt-1.5 text-[0.82rem] font-semibold tracking-wide text-[var(--ink-soft)]">{stat.label}</dt>
            </div>
          </Reveal>
        ))}
      </dl>
      <p className="mt-4 text-[0.7rem] text-[var(--ink-muted)]">
        Figures marked “—” have not been set yet. Efrata can enter the real numbers in the admin
        dashboard under Settings.
      </p>
    </div>
  );
}

/* ----------------------------- testimonials ----------------------------- */

export function Testimonials({
  items,
}: {
  items: {
    id: number;
    clientName: string;
    role: string | null;
    company: string | null;
    quote: string;
    rating: number;
    photoUrl: string | null;
    isSample: boolean;
  }[];
}) {
  if (!items.length)
    return <p className="card p-8 text-center text-sm text-[var(--ink-muted)]">No testimonials published yet.</p>;

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.07} as="article" className="h-full">
            <figure className="card flex h-full flex-col p-6">
              <Quote size={22} className="text-[var(--accent)]" />
              <blockquote className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-[var(--ink-soft)]">
                “{item.quote}”
              </blockquote>
              <div className="mt-5 flex items-center gap-1" aria-label={`${item.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={13}
                    className={s < item.rating ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[var(--ink-muted)]"}
                  />
                ))}
              </div>
              <figcaption className="mt-4 flex items-center gap-3 border-t pt-4" style={{ borderColor: "var(--surface-border)" }}>
                {item.photoUrl ? (
                  <Image src={item.photoUrl} alt={item.clientName} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">
                    {item.clientName.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="text-xs">
                  <span className="block font-bold">{item.clientName}</span>
                  <span className="text-[var(--ink-muted)]">
                    {[item.role, item.company].filter(Boolean).join(" · ")}
                  </span>
                </span>
                {item.isSample && <span className="chip ml-auto !text-[0.6rem]">Sample</span>}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      {items.some((i) => i.isSample) && (
        <p className="mt-4 text-[0.7rem] text-[var(--ink-muted)]">
          Entries marked “Sample” are placeholder content, not real client testimonials.
        </p>
      )}
    </div>
  );
}

/* --------------------------- certifications ----------------------------- */

export function Certifications({
  items,
}: {
  items: {
    id: number;
    title: string;
    organization: string | null;
    issuedDate: string | null;
    description: string;
    imageUrl: string | null;
    pdfUrl: string | null;
    verifyUrl: string | null;
    isSample: boolean;
  }[];
}) {
  if (!items.length) return null;
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <Reveal key={item.id} delay={i * 0.07} as="article" className="h-full">
          <div className="card flex h-full flex-col overflow-hidden">
            {item.imageUrl && (
              <div className="relative aspect-16/10">
                <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width:768px) 90vw, 360px" className="object-cover" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <span className="flex items-center gap-2 text-[var(--accent)]">
                <Award size={16} />
                {item.isSample && <span className="chip !text-[0.6rem]">Sample</span>}
              </span>
              <h3 className="display mt-2.5 text-[1.05rem]">{item.title}</h3>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                {[item.organization, item.issuedDate].filter(Boolean).join(" · ")}
              </p>
              {item.description && (
                <p className="mt-2.5 flex-1 text-[0.83rem] leading-relaxed text-[var(--ink-soft)]">{item.description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-3 text-[0.78rem] font-semibold">
                {item.verifyUrl && (
                  <a href={item.verifyUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)]">
                    Verify ↗
                  </a>
                )}
                {item.pdfUrl && (
                  <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[var(--accent)]">
                    <Download size={13} /> PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
