"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { requireAdmin, authenticate, createSession, destroySession } from "@/lib/auth";
import { RESOURCES, type ResourceKey } from "@/lib/resources";
import { sanitizeText, slugify, toList } from "@/lib/utils";
import { setSetting } from "@/lib/queries";
import { deleteLocalFile } from "@/lib/storage";
import { rateLimit } from "@/lib/rate-limit";

/* ------------------------------- auth ----------------------------------- */

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const limit = rateLimit(`login:${email.toLowerCase()}`, 8, 10 * 60 * 1000);
  if (!limit.ok) return { error: "Too many attempts. Please wait a few minutes." };
  if (!email || !password) return { error: "Email and password are required." };

  let user;
  try {
    user = await authenticate(email, password);
  } catch (error) {
    return { error: (error as Error).message };
  }
  if (!user) return { error: "Invalid email or password." };
  await createSession(user);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

/* --------------------------- resource CRUD ------------------------------ */

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

const PATHS: Record<ResourceKey, string[]> = {
  projects: ["/", "/projects"],
  services: ["/"],
  testimonials: ["/"],
  logos: ["/"],
  certifications: ["/"],
  knowledge: ["/"],
  social: ["/"],
  media: ["/", "/projects"],
};

function coerce(resource: ResourceKey, formData: FormData) {
  const config = RESOURCES[resource];
  const values: Record<string, unknown> = {};
  for (const field of config.fields) {
    const raw = formData.get(field.name);
    switch (field.type) {
      case "checkbox":
        values[field.name] = raw === "on" || raw === "true";
        break;
      case "number":
        values[field.name] = raw === null || raw === "" ? 0 : Number(raw);
        break;
      case "list":
        values[field.name] = toList(raw);
        break;
      case "image":
      case "video":
      case "file":
        values[field.name] = raw ? String(raw) : null;
        break;
      default:
        values[field.name] = sanitizeText(raw, field.type === "textarea" ? 8000 : 400);
    }
  }
  if ("slug" in values) {
    const title = values[config.titleField] as string;
    values.slug = slugify(String(values.slug || title || "item")) || `item-${Date.now()}`;
  }
  if (resource === "testimonials") {
    values.rating = Math.min(5, Math.max(1, Number(values.rating) || 5));
  }
  return values;
}

export async function saveRecord(resource: ResourceKey, formData: FormData) {
  await requireAdmin();
  const table = TABLES[resource];
  const id = Number(formData.get("id") || 0);
  const values = coerce(resource, formData);
  const db = await getDb();

  if (id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.update(table as any).set(values).where(eq((table as any).id, id));
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.insert(table as any).values(values as any);
  }

  for (const path of PATHS[resource]) revalidatePath(path);
  revalidatePath(`/admin/${resource}`);
  return { ok: true };
}

export async function deleteRecord(resource: ResourceKey, id: number) {
  await requireAdmin();
  const db = await getDb();
  const table = TABLES[resource];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [row] = await db.select().from(table as any).where(eq((table as any).id, id)).limit(1);
  if (row) {
    for (const value of Object.values(row as Record<string, unknown>)) {
      if (typeof value === "string" && value.startsWith("/uploads/")) await deleteLocalFile(value);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.delete(table as any).where(eq((table as any).id, id));
  for (const path of PATHS[resource]) revalidatePath(path);
  revalidatePath(`/admin/${resource}`);
  return { ok: true };
}

export async function toggleField(resource: ResourceKey, id: number, field: string, value: boolean) {
  await requireAdmin();
  const db = await getDb();
  const table = TABLES[resource];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.update(table as any).set({ [field]: value }).where(eq((table as any).id, id));
  for (const path of PATHS[resource]) revalidatePath(path);
  revalidatePath(`/admin/${resource}`);
  return { ok: true };
}

export async function moveRecord(resource: ResourceKey, id: number, direction: -1 | 1) {
  await requireAdmin();
  const db = await getDb();
  const table = TABLES[resource];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[] = await db.select().from(table as any);
  rows.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  const index = rows.findIndex((r) => r.id === id);
  const swapWith = index + direction;
  if (index < 0 || swapWith < 0 || swapWith >= rows.length) return { ok: false };
  for (let i = 0; i < rows.length; i++) rows[i].sortOrder = i;
  const temp = rows[index].sortOrder;
  rows[index].sortOrder = rows[swapWith].sortOrder;
  rows[swapWith].sortOrder = temp;
  for (const row of rows) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.update(table as any).set({ sortOrder: row.sortOrder }).where(eq((table as any).id, row.id));
  }
  for (const path of PATHS[resource]) revalidatePath(path);
  revalidatePath(`/admin/${resource}`);
  return { ok: true };
}

/* ------------------------------ profile --------------------------------- */

export async function saveProfile(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const values = {
    name: sanitizeText(formData.get("name"), 160),
    title: sanitizeText(formData.get("title"), 300),
    tagline: sanitizeText(formData.get("tagline"), 300),
    intro: sanitizeText(formData.get("intro"), 1200),
    bio: sanitizeText(formData.get("bio"), 6000),
    philosophy: sanitizeText(formData.get("philosophy"), 2000),
    approach: sanitizeText(formData.get("approach"), 2000),
    experience: sanitizeText(formData.get("experience"), 2000),
    email: sanitizeText(formData.get("email"), 200),
    phone: sanitizeText(formData.get("phone"), 60),
    location: sanitizeText(formData.get("location"), 120),
    availability: sanitizeText(formData.get("availability"), 160),
    avatarUrl: (formData.get("avatarUrl") as string) || null,
    cvUrl: (formData.get("cvUrl") as string) || null,
    aboutVideoUrl: (formData.get("aboutVideoUrl") as string) || null,
    aboutVideoThumbUrl: (formData.get("aboutVideoThumbUrl") as string) || null,
    aboutVideoCaptionsUrl: (formData.get("aboutVideoCaptionsUrl") as string) || null,
    skills: toList(formData.get("skills")),
    updatedAt: new Date(),
  };

  const [existing] = await db.select().from(schema.profiles).limit(1);
  if (existing) {
    await db.update(schema.profiles).set(values).where(eq(schema.profiles.id, existing.id));
  } else {
    await db.insert(schema.profiles).values(values);
  }
  revalidatePath("/");
  revalidatePath("/admin/profile");
  return { ok: true };
}

/* ----------------------------- settings --------------------------------- */

export async function saveSettingsForm(formData: FormData): Promise<void> {
  await saveSettings(formData);
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    await setSetting(sanitizeText(key, 80), sanitizeText(value, 500));
  }
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true };
}

/* ----------------------------- inquiries -------------------------------- */

export async function updateInquiry(id: number, patch: { status?: string; notes?: string; isRead?: boolean; archived?: boolean }) {
  await requireAdmin();
  const db = await getDb();
  const values: Record<string, unknown> = {};
  if (patch.status) values.status = sanitizeText(patch.status, 32);
  if (patch.notes !== undefined) values.notes = sanitizeText(patch.notes, 4000);
  if (patch.isRead !== undefined) values.isRead = patch.isRead;
  if (patch.archived !== undefined) values.archived = patch.archived;
  await db.update(schema.inquiries).set(values).where(eq(schema.inquiries.id, id));
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteInquiry(id: number) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.inquiries).where(eq(schema.inquiries.id, id));
  revalidatePath("/admin/inquiries");
  return { ok: true };
}

/* ------------------------------ comments -------------------------------- */

export async function moderateComment(id: number, action: "approve" | "hide" | "delete") {
  await requireAdmin();
  const db = await getDb();
  if (action === "delete") {
    await db.delete(schema.comments).where(eq(schema.comments.id, id));
  } else {
    await db
      .update(schema.comments)
      .set({ approved: action === "approve", reported: false })
      .where(eq(schema.comments.id, id));
  }
  revalidatePath("/admin/comments");
  revalidatePath("/projects");
  return { ok: true };
}
