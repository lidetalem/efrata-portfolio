import "server-only";

export type MailResult = { sent: boolean; warning?: string };

/**
 * Sends a transactional notification through Resend (or any compatible HTTP API).
 * If email is not configured the inquiry is still stored — we only return a warning.
 */
export async function sendMail(subject: string, html: string, to?: string): Promise<MailResult> {
  const key = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM;
  const recipient = to || process.env.EMAIL_TO || "ephratahh16@gmail.com";

  if (!key || !from) {
    return {
      sent: false,
      warning:
        "Email is not configured (EMAIL_API_KEY / EMAIL_FROM missing). The message was saved to the database and is visible in the admin dashboard.",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to: [recipient], subject, html }),
    });
    if (!res.ok) return { sent: false, warning: `Email provider error: ${await res.text()}` };
    return { sent: true };
  } catch (error) {
    return { sent: false, warning: `Email request failed: ${(error as Error).message}` };
  }
}

export function inquiryEmailHtml(data: Record<string, unknown>) {
  const rows = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font:600 13px system-ui;color:#555">${escapeHtml(k)}</td>` +
        `<td style="padding:6px 12px;font:13px system-ui;color:#111">${escapeHtml(String(v))}</td></tr>`
    )
    .join("");
  return `<div style="font:14px system-ui;color:#111">
    <h2 style="margin:0 0 12px">New inquiry from your portfolio</h2>
    <table style="border-collapse:collapse;background:#fafafa;border-radius:8px">${rows}</table>
    <p style="margin-top:16px;color:#666">Manage this inquiry in your admin dashboard.</p>
  </div>`;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
