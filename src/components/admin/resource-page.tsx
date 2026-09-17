import { asc } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { RESOURCES, type ResourceKey } from "@/lib/resources";
import { ResourceManager } from "./resource-manager";
import { saveRecord, deleteRecord, toggleField, moveRecord } from "@/app/admin/actions";

const TABLES = {
  projects: schema.projects,
  services: schema.services,
  testimonials: schema.testimonials,
  logos: schema.clientLogos,
  certifications: schema.certifications,
  knowledge: schema.chatbotKnowledge,
  social: schema.socialLinks,
  media: schema.projectMedia,
} as const;

export async function ResourcePage({ resource, note }: { resource: ResourceKey; note?: string }) {
  const db = await getDb();
  const table = TABLES[resource];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[] = await db
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .select()
    .from(table as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .orderBy(asc((table as any).sortOrder), asc((table as any).id));

  return (
    <ResourceManager
      config={RESOURCES[resource]}
      rows={rows}
      note={note}
      actions={{ save: saveRecord, remove: deleteRecord, toggle: toggleField, move: moveRecord }}
    />
  );
}
