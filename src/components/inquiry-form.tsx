"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

const BUDGETS = ["Under 5,000 ETB", "5,000 – 15,000 ETB", "15,000 – 50,000 ETB", "50,000+ ETB", "Not sure yet"];
const CONTACT_METHODS = ["Email", "Phone call", "WhatsApp", "Telegram", "Instagram DM"];

export function InquiryForm({
  kind,
  services,
}: {
  kind: "contact" | "hire";
  services: { title: string }[];
}) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("kind", kind);
    setState("loading");
    setMessage("");
    setWarning("");
    try {
      const res = await fetch("/api/inquiries", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) {
        setState("error");
        setMessage(json.error || "Something went wrong. Please try again.");
        return;
      }
      setState("done");
      setMessage(
        kind === "hire"
          ? "Your project request is in. Efrata will get back to you shortly."
          : "Message sent. Efrata will reply as soon as possible."
      );
      if (json.warning) setWarning(json.warning);
      form.reset();
    } catch {
      setState("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 className="mx-auto text-[var(--accent)]" size={34} />
        <h3 className="display mt-4 text-xl">Thank you</h3>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">{message}</p>
        {warning && <p className="mt-3 text-xs text-[var(--ink-muted)]">{warning}</p>}
        <button type="button" onClick={() => setState("idle")} className="btn btn-ghost mt-6">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 md:p-8" noValidate={false}>
      {/* honeypot — bots fill this, humans never see it */}
      <div className="hidden" aria-hidden>
        <label htmlFor={`${kind}-website`}>Website</label>
        <input id={`${kind}-website`} name="website_hp" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={Date.now()} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" required>
          <input name="name" required maxLength={120} className="field" autoComplete="name" />
        </Field>
        <Field label="Email" required>
          <input name="email" type="email" required maxLength={200} className="field" autoComplete="email" />
        </Field>
        <Field label="Phone">
          <input name="phone" maxLength={40} className="field" autoComplete="tel" />
        </Field>
        <Field label="Company / Brand">
          <input name="company" maxLength={120} className="field" autoComplete="organization" />
        </Field>
        <Field label="Service required">
          <select name="service" className="field" defaultValue="">
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.title} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="Budget">
          <select name="budget" className="field" defaultValue="">
            <option value="">Select a range</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Deadline">
          <input name="deadline" type="date" className="field" />
        </Field>
        <Field label="Preferred contact method">
          <select name="preferredContact" className="field" defaultValue="Email">
            {CONTACT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Project description" required>
        <textarea name="message" required rows={5} maxLength={4000} className="field resize-y" />
      </Field>

      <Field label="Attachment (optional — brief, reference, script · max 8 MB)">
        <input
          name="attachment"
          type="file"
          accept="image/*,application/pdf"
          className="field !py-2 text-xs"
        />
      </Field>

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--ink-soft)]">
        <input type="checkbox" name="consent" required className="mt-0.5" />
        I agree that my details may be stored so Efrata can respond to this enquiry.
      </label>

      {state === "error" && (
        <p className="flex items-start gap-2 rounded-xl bg-[var(--accent-soft)] p-3 text-xs text-[var(--accent)]">
          <AlertCircle size={14} className="mt-0.5 shrink-0" /> {message}
        </p>
      )}

      <button type="submit" disabled={state === "loading"} className="btn btn-primary w-full disabled:opacity-60">
        {state === "loading" ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        {kind === "hire" ? "Send project request" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">
        {label} {required && <span className="text-[var(--accent)]">*</span>}
      </span>
      {children}
    </label>
  );
}
