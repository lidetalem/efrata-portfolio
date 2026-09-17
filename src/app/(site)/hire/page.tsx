import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";
import { getProfile, getServices } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hire Me",
  description: "Start a creative project with Efrata Alex — video editing, social media, design and motion graphics.",
};

const POINTS = [
  "A clear plan before production starts",
  "Content built for the platform it lives on",
  "Revision rounds included in every project",
  "Files delivered ready to publish",
];

export default async function HirePage() {
  const [profile, services] = await Promise.all([getProfile(), getServices()]);

  return (
    <div className="pt-32 pb-24 md:pt-40">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow">Hire me</p>
          <h1 className="display mt-3 text-display">Start a project</h1>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
            Share the details below and I’ll reply with next steps, timeline and what I need from
            you. {profile?.availability}.
          </p>
          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-[var(--ink-soft)]">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <InquiryForm kind="hire" services={services.map((s) => ({ title: s.title }))} />
      </div>
    </div>
  );
}
