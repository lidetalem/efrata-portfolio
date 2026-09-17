import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/queries";

const base = process.env.NEXT_PUBLIC_APP_URL || "https://efrataalex.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projects: { slug: string; updatedAt: Date | null }[] = [];
  try {
    projects = (await getProjects({ onlyPublished: true })).map((p) => ({
      slug: p.slug,
      updatedAt: p.createdAt ?? null,
    }));
  } catch {
    projects = [];
  }

  return [
    { url: base, priority: 1 },
    { url: `${base}/projects`, priority: 0.9 },
    { url: `${base}/contact`, priority: 0.8 },
    { url: `${base}/hire`, priority: 0.8 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: p.updatedAt ?? undefined,
      priority: 0.7,
    })),
  ];
}
