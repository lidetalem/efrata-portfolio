import "server-only";
import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";

export async function getProfile() {
  const db = await getDb();
  const [profile] = await db.select().from(schema.profiles).limit(1);
  return profile ?? null;
}

export async function getServices(onlyPublished = true) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.services)
    .orderBy(asc(schema.services.sortOrder), asc(schema.services.id));
  return onlyPublished ? rows.filter((r) => r.published) : rows;
}

export async function getProjects(opts: { onlyPublished?: boolean; category?: string } = {}) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.projects)
    .orderBy(asc(schema.projects.sortOrder), desc(schema.projects.createdAt));
  return rows.filter(
    (r) =>
      (opts.onlyPublished === false || r.published) &&
      (!opts.category || r.category === opts.category)
  );
}

export async function getProjectBySlug(slug: string) {
  const db = await getDb();
  const [project] = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.slug, slug))
    .limit(1);
  if (!project) return null;
  const media = await db
    .select()
    .from(schema.projectMedia)
    .where(eq(schema.projectMedia.projectId, project.id))
    .orderBy(asc(schema.projectMedia.sortOrder), asc(schema.projectMedia.id));
  const related = (
    await db
      .select()
      .from(schema.projects)
      .where(
        and(
          eq(schema.projects.category, project.category),
          ne(schema.projects.id, project.id),
          eq(schema.projects.published, true)
        )
      )
      .limit(3)
  );
  const published = await getProjects({ onlyPublished: true });
  const index = published.findIndex((p) => p.id === project.id);
  return {
    project,
    media,
    related,
    previous: index > 0 ? published[index - 1] : null,
    next: index >= 0 && index < published.length - 1 ? published[index + 1] : null,
  };
}

export async function getProjectMediaMap(projectIds: number[]) {
  if (!projectIds.length) return new Map<number, (typeof schema.projectMedia.$inferSelect)[]>();
  const db = await getDb();
  const rows = await db.select().from(schema.projectMedia);
  const map = new Map<number, (typeof schema.projectMedia.$inferSelect)[]>();
  for (const row of rows) {
    if (!projectIds.includes(row.projectId)) continue;
    map.set(row.projectId, [...(map.get(row.projectId) ?? []), row]);
  }
  return map;
}

export async function getTestimonials(onlyPublished = true) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.testimonials)
    .orderBy(asc(schema.testimonials.sortOrder), asc(schema.testimonials.id));
  return onlyPublished ? rows.filter((r) => r.published) : rows;
}

export async function getLogos(onlyPublished = true) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.clientLogos)
    .orderBy(asc(schema.clientLogos.sortOrder), asc(schema.clientLogos.id));
  return onlyPublished ? rows.filter((r) => r.published) : rows;
}

export async function getCertifications(onlyPublished = true) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.certifications)
    .orderBy(asc(schema.certifications.sortOrder), asc(schema.certifications.id));
  return onlyPublished ? rows.filter((r) => r.published) : rows;
}

export async function getSocialLinks(onlyPublished = true) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.socialLinks)
    .orderBy(asc(schema.socialLinks.sortOrder), asc(schema.socialLinks.id));
  return onlyPublished ? rows.filter((r) => r.published && r.url) : rows;
}

export async function getSettings() {
  const db = await getDb();
  const rows = await db.select().from(schema.siteSettings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
}

export async function setSetting(key: string, value: string) {
  const db = await getDb();
  await db
    .insert(schema.siteSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value } });
}

export async function getKnowledge(onlyPublished = true) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.chatbotKnowledge)
    .orderBy(asc(schema.chatbotKnowledge.sortOrder), asc(schema.chatbotKnowledge.id));
  return onlyPublished ? rows.filter((r) => r.published) : rows;
}

export async function getInquiries() {
  const db = await getDb();
  return db.select().from(schema.inquiries).orderBy(desc(schema.inquiries.createdAt));
}

export async function getComments(opts: { onlyApproved?: boolean; projectId?: number } = {}) {
  const db = await getDb();
  const rows = await db.select().from(schema.comments).orderBy(desc(schema.comments.createdAt));
  return rows.filter(
    (r) =>
      (!opts.onlyApproved || r.approved) &&
      (opts.projectId === undefined || r.projectId === opts.projectId)
  );
}

export async function getDashboardStats() {
  const db = await getDb();
  const [projects, inquiries, services, testimonials, certifications, logos, views] =
    await Promise.all([
      db.select().from(schema.projects),
      db.select().from(schema.inquiries),
      db.select().from(schema.services),
      db.select().from(schema.testimonials),
      db.select().from(schema.certifications),
      db.select().from(schema.clientLogos),
      db.select().from(schema.pageViews),
    ]);
  return {
    projects: projects.length,
    published: projects.filter((p) => p.published).length,
    inquiries: inquiries.length,
    newInquiries: inquiries.filter((i) => i.status === "NEW" && !i.archived).length,
    services: services.length,
    testimonials: testimonials.length,
    certifications: certifications.length,
    logos: logos.length,
    pageViews: views.length,
    popularProjects: [...projects].sort((a, b) => b.views - a.views).slice(0, 5),
    deviceBreakdown: countBy(views.map((v) => v.device || "unknown")),
    sources: countBy(views.map((v) => v.referrerHost || "direct")),
    recentInquiries: [...inquiries]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 6),
  };
}

function countBy(items: string[]) {
  const map = new Map<string, number>();
  for (const item of items) map.set(item, (map.get(item) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count }));
}

export async function incrementProjectViews(id: number) {
  const db = await getDb();
  await db
    .update(schema.projects)
    .set({ views: sql`${schema.projects.views} + 1` })
    .where(eq(schema.projects.id, id));
}
