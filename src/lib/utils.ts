export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);
}

/** Strips control characters and HTML tags from free-text input. */
export function sanitizeText(value: unknown, max = 5000) {
  if (typeof value !== "string") return "";
  return value
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, max);
}

export function toList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => sanitizeText(v, 60)).filter(Boolean);
  if (typeof value === "string")
    return value
      .split(",")
      .map((v) => sanitizeText(v, 60))
      .filter(Boolean);
  return [];
}

export const PROJECT_CATEGORIES = [
  "Video Editing",
  "Social Media Management",
  "Social Media Marketing",
  "Graphic Design",
  "Motion Graphics",
  "Branding",
  "Content Creation",
  "Other",
] as const;

export const INQUIRY_STATUSES = [
  "NEW",
  "CONTACTED",
  "IN DISCUSSION",
  "PROPOSAL SENT",
  "COMPLETED",
  "ARCHIVED",
] as const;

export const SOCIAL_PLATFORMS = [
  "Instagram",
  "TikTok",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "Behance",
  "Dribbble",
  "X",
  "Telegram",
  "Other",
] as const;

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
