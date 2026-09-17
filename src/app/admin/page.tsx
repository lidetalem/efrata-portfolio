import Link from "next/link";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { getDashboardStats } from "@/lib/queries";
import { usingEmbeddedDatabase } from "@/db";
import { aiConfigured } from "@/lib/ai";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const stats = await getDashboardStats();

  const warnings = [
    usingEmbeddedDatabase &&
      "DATABASE_URL is not set — you are using the built-in local database. Set a Neon PostgreSQL URL before deploying.",
    !aiConfigured() &&
      "AI_API_KEY is not set — the chatbot is running in database-only fallback mode.",
    !process.env.EMAIL_API_KEY &&
      "EMAIL_API_KEY is not set — inquiries are saved here but no email notification is sent.",
    (!process.env.STORAGE_PROVIDER || process.env.STORAGE_PROVIDER === "local") &&
      "Media is being stored on the local disk. Configure Cloudinary, Cloudflare R2 or Vercel Blob for production.",
  ].filter(Boolean) as string[];

  const cards = [
    { label: "Projects", value: stats.projects, href: "/admin/projects", sub: `${stats.published} published` },
    { label: "New messages", value: stats.newInquiries, href: "/admin/inquiries", sub: `${stats.inquiries} total` },
    { label: "Services", value: stats.services, href: "/admin/services" },
    { label: "Testimonials", value: stats.testimonials, href: "/admin/testimonials" },
    { label: "Certificates", value: stats.certifications, href: "/admin/certifications" },
    { label: "Client logos", value: stats.logos, href: "/admin/logos" },
    { label: "Page views", value: stats.pageViews, href: "/admin" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-xs text-[var(--ink-muted)]">Everything on the public website is managed from here.</p>
      </header>

      {warnings.length > 0 && (
        <ul className="space-y-2">
          {warnings.map((warning) => (
            <li
              key={warning}
              className="flex items-start gap-2 rounded-xl border p-3 text-xs"
              style={{ borderColor: "var(--surface-border)", background: "var(--accent-soft)" }}
            >
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[var(--accent)]" />
              <span>{warning}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="card p-4 transition-colors hover:border-[var(--accent)]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">{card.label}</p>
            <p className="mt-1 text-2xl font-bold">{card.value}</p>
            {card.sub && <p className="text-[0.7rem] text-[var(--ink-muted)]">{card.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-sm font-bold">Recent messages</h2>
          <ul className="mt-3 space-y-2">
            {stats.recentInquiries.length === 0 && (
              <li className="text-xs text-[var(--ink-muted)]">No messages yet.</li>
            )}
            {stats.recentInquiries.map((inquiry) => (
              <li key={inquiry.id} className="rounded-lg border p-3 text-xs" style={{ borderColor: "var(--surface-border)" }}>
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  {inquiry.name}
                  <span className="chip !py-0.5 !text-[0.6rem]">{inquiry.status}</span>
                  <span className="chip !py-0.5 !text-[0.6rem]">{inquiry.kind}</span>
                  <span className="ml-auto text-[var(--ink-muted)]">{formatDate(inquiry.createdAt)}</span>
                </p>
                <p className="mt-1.5 line-clamp-2 text-[var(--ink-soft)]">{inquiry.message}</p>
              </li>
            ))}
          </ul>
          <Link href="/admin/inquiries" className="btn btn-ghost mt-4 !py-2 !text-xs">
            Open inbox <ArrowUpRight size={13} />
          </Link>
        </section>

        <section className="space-y-5">
          <div className="card p-5">
            <h2 className="text-sm font-bold">Most viewed projects</h2>
            <ul className="mt-3 space-y-2 text-xs">
              {stats.popularProjects.length === 0 && <li className="text-[var(--ink-muted)]">No data yet.</li>}
              {stats.popularProjects.map((project) => (
                <li key={project.id} className="flex items-center justify-between gap-3">
                  <span className="truncate">{project.title}</span>
                  <span className="chip !py-0.5 !text-[0.62rem]">{project.views} views</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Breakdown title="Devices" rows={stats.deviceBreakdown} />
            <Breakdown title="Traffic sources" rows={stats.sources} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  const total = rows.reduce((sum, row) => sum + row.count, 0) || 1;
  return (
    <div className="card p-5">
      <h2 className="text-sm font-bold">{title}</h2>
      <ul className="mt-3 space-y-2 text-xs">
        {rows.length === 0 && <li className="text-[var(--ink-muted)]">No data yet.</li>}
        {rows.slice(0, 5).map((row) => (
          <li key={row.label}>
            <span className="flex justify-between">
              <span className="truncate">{row.label}</span>
              <span className="text-[var(--ink-muted)]">{row.count}</span>
            </span>
            <span className="mt-1 block h-1.5 rounded-full" style={{ background: "var(--bg-sunken)" }}>
              <span
                className="block h-1.5 rounded-full"
                style={{ width: `${(row.count / total) * 100}%`, background: "var(--accent)" }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
