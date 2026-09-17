import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/utils";

const schemaBody = z.object({
  projectId: z.coerce.number().int().positive().optional(),
  authorName: z.string().min(2).max(80),
  body: z.string().min(4).max(1200),
  website_hp: z.string().optional(),
});

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`comment:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.ok)
    return NextResponse.json({ error: "You are posting too quickly. Please try again later." }, { status: 429 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schemaBody.safeParse(payload);
  if (!parsed.success)
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });

  // Honeypot: silently accept but never store.
  if (parsed.data.website_hp) return NextResponse.json({ ok: true, moderated: true });

  const db = await getDb();
  await db.insert(schema.comments).values({
    projectId: parsed.data.projectId ?? null,
    authorName: sanitizeText(parsed.data.authorName, 80),
    body: sanitizeText(parsed.data.body, 1200),
    approved: false,
  });

  return NextResponse.json({
    ok: true,
    moderated: true,
    message: "Thank you. Your comment will appear once Efrata approves it.",
  });
}
