import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/utils";
import { storeFile } from "@/lib/storage";
import { inquiryEmailHtml, sendMail } from "@/lib/email";
import { getProfile } from "@/lib/queries";

const schemaIn = z.object({
  kind: z.enum(["contact", "hire"]).default("contact"),
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  company: z.string().max(120).optional(),
  service: z.string().max(120).optional(),
  budget: z.string().max(80).optional(),
  deadline: z.string().max(80).optional(),
  preferredContact: z.string().max(40).optional(),
  message: z.string().min(5).max(4000),
  consent: z.literal("on"),
});

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`inquiry:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again a little later." },
      { status: 429 }
    );
  }

  // Same-origin check (CSRF hardening for a cookie-free public endpoint).
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  // Spam traps: honeypot + minimum fill time.
  if (String(form.get("website_hp") || "").trim()) {
    return NextResponse.json({ ok: true });
  }
  const startedAt = Number(form.get("startedAt") || 0);
  if (startedAt && Date.now() - startedAt < 2500) {
    return NextResponse.json({ error: "That was too fast — please try again." }, { status: 400 });
  }

  const raw = Object.fromEntries(
    ["kind", "name", "email", "phone", "company", "service", "budget", "deadline", "preferredContact", "message", "consent"].map(
      (key) => [key, form.get(key) ? String(form.get(key)) : undefined]
    )
  );

  const parsed = schemaIn.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: `Please check the “${issue.path.join(".") || "form"}” field: ${issue.message}.` },
      { status: 400 }
    );
  }
  const data = parsed.data;

  let attachmentUrl: string | null = null;
  const attachment = form.get("attachment");
  if (attachment instanceof File && attachment.size > 0) {
    try {
      if (attachment.size > 8 * 1024 * 1024) throw new Error("Attachment must be 8 MB or smaller.");
      const stored = await storeFile(attachment);
      attachmentUrl = stored.url;
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
  }

  const db = await getDb();
  const [saved] = await db
    .insert(schema.inquiries)
    .values({
      kind: data.kind,
      name: sanitizeText(data.name, 120),
      email: data.email.toLowerCase(),
      phone: sanitizeText(data.phone, 40),
      company: sanitizeText(data.company, 120),
      service: sanitizeText(data.service, 120),
      budget: sanitizeText(data.budget, 80),
      deadline: sanitizeText(data.deadline, 80),
      preferredContact: sanitizeText(data.preferredContact, 40),
      message: sanitizeText(data.message, 4000),
      attachmentUrl,
      status: "NEW",
    })
    .returning();

  const profile = await getProfile();
  const mail = await sendMail(
    `${data.kind === "hire" ? "New Hire Me request" : "New contact message"} — ${saved.name}`,
    inquiryEmailHtml({
      Type: data.kind,
      Name: saved.name,
      Email: saved.email,
      Phone: saved.phone,
      Company: saved.company,
      Service: saved.service,
      Budget: saved.budget,
      Deadline: saved.deadline,
      "Preferred contact": saved.preferredContact,
      Message: saved.message,
      Attachment: attachmentUrl,
    }),
    profile?.email
  );

  return NextResponse.json({ ok: true, id: saved.id, warning: mail.warning });
}
