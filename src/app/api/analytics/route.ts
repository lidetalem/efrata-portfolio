import { NextResponse } from "next/server";
import { getDb, schema } from "@/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/utils";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_ANALYTICS === "off") return NextResponse.json({ ok: true });
  const limit = rateLimit(`view:${clientIp(request.headers)}`, 120, 60 * 1000);
  if (!limit.ok) return NextResponse.json({ ok: true });

  try {
    const body = await request.json();
    const db = await getDb();
    await db.insert(schema.pageViews).values({
      path: sanitizeText(body.path, 200) || "/",
      referrerHost: sanitizeText(body.referrerHost, 160) || null,
      device: sanitizeText(body.device, 32) || null,
    });
  } catch {
    /* analytics must never break a page view */
  }
  return NextResponse.json({ ok: true });
}
