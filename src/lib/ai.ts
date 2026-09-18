import "server-only";
import { getProfile, getServices, getProjects, getKnowledge, getSocialLinks, getCertifications, getTestimonials } from "./queries";

export type ChatTurn = { role: "user" | "assistant"; content: string };

/** Amharic (Ethiopic) unicode block detection — drives the reply language. */
export function detectLanguage(text: string): "am" | "en" {
  const ethiopic = text.match(/[\u1200-\u137F]/g)?.length ?? 0;
  const latin = text.match(/[A-Za-z]/g)?.length ?? 0;
  return ethiopic > 0 && ethiopic >= latin / 3 ? "am" : "en";
}

/** Builds the grounding context from the database only — nothing is invented. */
export async function buildKnowledgeContext(appUrl: string) {
  const [profile, services, projects, knowledge, socials, certs, testimonials] = await Promise.all([
    getProfile(),
    getServices(),
    getProjects({ onlyPublished: true }),
    getKnowledge(),
    getSocialLinks(),
    getCertifications(),
    getTestimonials(),
  ]);

  const lines: string[] = [];
  if (profile) {
    lines.push(`NAME: ${profile.name}`);
    lines.push(`PRONOUNS: she / her / hers`);
    lines.push(`TITLE: ${profile.title}`);
    lines.push(`TAGLINE: ${profile.tagline}`);
    if (profile.bio) lines.push(`BIOGRAPHY: ${profile.bio}`);
    if (profile.experience) lines.push(`EXPERIENCE: ${profile.experience}`);
    if (profile.philosophy) lines.push(`CREATIVE PHILOSOPHY: ${profile.philosophy}`);
    if (profile.approach) lines.push(`WORKING APPROACH: ${profile.approach}`);
    lines.push(`LOCATION: ${profile.location}`);
    lines.push(`AVAILABILITY: ${profile.availability}`);
    lines.push(`EMAIL: ${profile.email}`);
    lines.push(`PHONE: ${profile.phone}`);
    if (profile.skills?.length) lines.push(`SKILLS: ${profile.skills.join(", ")}`);
    if (profile.cvUrl) lines.push(`CV DOWNLOAD: ${appUrl}${profile.cvUrl.startsWith("http") ? "" : ""}${profile.cvUrl}`);
  }

  if (services.length)
    lines.push(
      "SERVICES:\n" +
        services.map((s) => `- ${s.title}: ${s.description || "(no description yet)"}`).join("\n")
    );

  if (projects.length)
    lines.push(
      "PORTFOLIO PROJECTS (link format /projects/<slug>):\n" +
        projects
          .map(
            (p) =>
              `- ${p.title} [${p.category}]${p.isSample ? " (SAMPLE PLACEHOLDER CONTENT)" : ""} — ${
                p.shortDescription || "no description"
              } → /projects/${p.slug}`
          )
          .join("\n")
    );

  if (certs.length)
    lines.push(
      "CERTIFICATIONS:\n" +
        certs.map((c) => `- ${c.title}${c.organization ? ` — ${c.organization}` : ""}${c.isSample ? " (SAMPLE)" : ""}`).join("\n")
    );

  if (testimonials.length)
    lines.push(`TESTIMONIALS ON SITE: ${testimonials.length}${testimonials.some((t) => t.isSample) ? " (some are sample placeholders)" : ""}`);

  if (socials.length)
    lines.push("SOCIAL LINKS:\n" + socials.map((s) => `- ${s.platform}: ${s.url}`).join("\n"));

  if (knowledge.length)
    lines.push(
      "OWNER-PROVIDED KNOWLEDGE:\n" +
        knowledge
          .map((k) => `- [${k.section}] ${k.question ? `Q: ${k.question} ` : ""}A: ${k.answer}`)
          .join("\n")
    );

  const customInstructions = knowledge
    .filter((k) => k.section === "instructions")
    .map((k) => k.answer)
    .join("\n");

  return { context: lines.join("\n\n"), customInstructions };
}

export function systemPrompt(context: string, custom: string, language: "en" | "am") {
  return `You are the portfolio assistant for Efrata Alex, a creative professional.

STRICT RULES
- Answer ONLY from the CONTEXT below. Never invent clients, companies, testimonials, certifications, prices, results, qualifications, experience or availability.
- Efrata is a woman. Always refer to her using she/her/hers pronouns — never he/him/his.
- If the answer is not in the CONTEXT, reply exactly (in the user's language): "I don't have that information yet. You can contact Efrata directly at ${""}the contact section." — and point them to /contact or /hire.
- Items marked SAMPLE or PLACEHOLDER are demo content. Never present them as real clients or real results.
- Be concise (2-5 sentences). Use markdown links for project pages, e.g. [Project name](/projects/slug), /contact and /hire.
- Reply in ${language === "am" ? "AMHARIC (አማርኛ)" : "ENGLISH"} because that is the language the visitor used. If the visitor mixes languages, follow their dominant language.
- Stay professional, warm and helpful. Encourage hiring/contact when relevant.

${custom ? `OWNER'S CUSTOM INSTRUCTIONS:\n${custom}\n` : ""}
CONTEXT:
${context}`;
}

type Provider = "gemini" | "openai";

function provider(): Provider {
  const base = (process.env.AI_BASE_URL || "").toLowerCase();
  if (!base || base.includes("generativelanguage.googleapis.com")) return "gemini";
  return "openai";
}

export function aiConfigured() {
  return Boolean(process.env.AI_API_KEY);
}

/** Provider-agnostic chat completion. Gemini by default, any OpenAI-compatible API otherwise. */
export async function chatComplete(system: string, history: ChatTurn[]): Promise<string> {
  const key = process.env.AI_API_KEY;
  if (!key) throw new Error("AI_API_KEY is not configured");
  const model = process.env.AI_MODEL || "gemini-2.0-flash";

  if (provider() === "gemini") {
    const base = process.env.AI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";
    const res = await fetch(`${base}/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: history.map((turn) => ({
          role: turn.role === "assistant" ? "model" : "user",
          parts: [{ text: turn.content }],
        })),
        generationConfig: { temperature: 0.4, maxOutputTokens: 700 },
      }),
    });
    if (!res.ok) throw new Error(`AI provider error ${res.status}: ${await res.text()}`);
    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("") ?? "";
    if (!text) throw new Error("Empty AI response");
    return text.trim();
  }

  const base = process.env.AI_BASE_URL || "https://api.openai.com/v1";
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 700,
      messages: [{ role: "system", content: system }, ...history],
    }),
  });
  if (!res.ok) throw new Error(`AI provider error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("Empty AI response");
  return text.trim();
}

/**
 * Deterministic, database-grounded fallback used when no AI key is configured or
 * the provider fails. Keeps the chatbot useful instead of broken.
 */
export async function fallbackAnswer(question: string, language: "en" | "am") {
  const [profile, services, projects] = await Promise.all([
    getProfile(),
    getServices(),
    getProjects({ onlyPublished: true }),
  ]);
  const q = question.toLowerCase();
  const am = language === "am";

  const contact = am
    ? `በኢሜይል ${profile?.email} ወይም በስልክ ${profile?.phone} ማግኘት ይችላሉ። [Hire Me](/hire) የሚለውንም መጠቀም ይችላሉ።`
    : `You can reach her at ${profile?.email} or ${profile?.phone}, or use the [Hire Me form](/hire).`;

  if (/hire|ቀጥር|ልቀጥራት|employ|book/.test(q) || /እንዴት/.test(question)) {
    return am ? `ኤፍራታን ለመቅጠር ${contact}` : `To hire Efrata, ${contact}`;
  }
  if (/service|ስራ|አገልግሎት|ትሰራ/.test(q) || /ምን/.test(question)) {
    const list = services.map((s) => s.title).join(", ");
    return am
      ? `ኤፍራታ የሚሰጠቻቸው አገልግሎቶች፦ ${list}። ስራዎቿን በ[Projects](/projects) ማየት ይችላሉ።`
      : `Efrata offers: ${list}. You can browse her work in [Projects](/projects).`;
  }
  if (/project|portfolio|work|video|design|motion/.test(q)) {
    const list = projects.slice(0, 4).map((p) => `[${p.title}](/projects/${p.slug})`).join(", ");
    return am
      ? `የቅርብ ጊዜ ስራዎች፦ ${list || "እስካሁን የተጨመረ ስራ የለም"}።`
      : `Recent work: ${list || "no projects published yet"}.`;
  }
  if (/where|based|location|የት|አድራሻ/.test(q)) {
    return am ? `ኤፍራታ በ${profile?.location} ትገኛለች።` : `Efrata is based in ${profile?.location}.`;
  }
  return am
    ? `ስለዚህ ጉዳይ መረጃ የለኝም። ${contact}`
    : `I don't have that information yet. ${contact}`;
}
