import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";
import { getProfile, getServices, getSocialLinks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Efrata Alex for video editing, social media, design and motion graphics work.",
};

export default async function ContactPage() {
  const [profile, services, socials] = await Promise.all([getProfile(), getServices(), getSocialLinks()]);

  return (
    <div className="pt-32 pb-24 md:pt-40">
      <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-3 text-display">
            Let’s create something great together.
          </h1>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
            Tell me about your brand, your audience and what you want to achieve. I usually reply
            within one working day.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            <li>
              <a href={`mailto:${profile?.email}`} className="card flex items-center gap-3 p-4 hover:border-[var(--accent)]">
                <Mail size={16} className="text-[var(--accent)]" /> {profile?.email}
              </a>
            </li>
            <li>
              <a href={`tel:${(profile?.phone ?? "").replace(/\s/g, "")}`} className="card flex items-center gap-3 p-4 hover:border-[var(--accent)]">
                <Phone size={16} className="text-[var(--accent)]" /> {profile?.phone}
              </a>
            </li>
            <li className="card flex items-center gap-3 p-4">
              <MapPin size={16} className="text-[var(--accent)]" /> {profile?.location}
            </li>
          </ul>

          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="chip hover:border-[var(--accent)]">
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <InquiryForm kind="contact" services={services.map((s) => ({ title: s.title }))} />
      </div>
    </div>
  );
}
