import { NextResponse } from "next/server";
import { getDb, schema } from "@/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/utils";
import {
  aiConfigured,
  buildKnowledgeContext,
  chatComplete,
  detectLanguage,
  fallbackAnswer,
  systemPrompt,
  type ChatTurn,
} from "@/lib/ai";

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`chat:${ip}`, 30, 5 * 60 * 1000);
  if (!limit.ok)
    return NextResponse.json(
      { error: "You’ve reached the message limit. Please try again in a few minutes." },
      { status: 429 }
    );

  let body: { messages?: ChatTurn[]; sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, content: sanitizeText(m.content, 1200) }))
    .filter((m) => m.content);

  const question = [...history].reverse().find((m) => m.role === "user")?.content;
  if (!question) return NextResponse.json({ error: "Please type a question." }, { status: 400 });

  const language = detectLanguage(question);
  const sessionId = sanitizeText(body.sessionId, 64) || "anonymous";

  let reply: string;
  try {
    if (!aiConfigured()) throw new Error("AI not configured");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const { context, customInstructions } = await buildKnowledgeContext(appUrl);
    reply = await chatComplete(systemPrompt(context, customInstructions, language), history);
  } catch {
    // Never crash the site: fall back to a database-grounded answer.
    reply = await fallbackAnswer(question, language);
  }

  try {
    const db = await getDb();
    await db.insert(schema.chatMessages).values([
      { sessionId, role: "user", content: question, language },
      { sessionId, role: "assistant", content: reply, language },
    ]);
  } catch {
    /* logging is best-effort */
  }

  return NextResponse.json({ reply, language });
}
