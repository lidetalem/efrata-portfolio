import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Wordmark } from "./logo";

type Props = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  socials: { id: number; platform: string; url: string }[];
};

export function SiteFooter({ name, title, email, phone, location, socials }: Props) {
  return (
    <footer className="relative border-t" style={{ borderColor: "var(--surface-border)", background: "var(--bg-sunken)" }}>
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <Wordmark />
          <p className="display mt-5 max-w-xs text-[1.5rem] leading-tight">{name}</p>
          <p className="mt-2 max-w-xs text-sm text-[var(--ink-soft)]">{title}</p>
          <Link href="/hire" className="btn btn-primary mt-6">
            Hire Me <ArrowUpRight size={14} />
          </Link>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow">Navigate</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/#about", label: "About" },
              { href: "/#services", label: "Services" },
              { href: "/projects", label: "Projects" },
              { href: "/#testimonials", label: "Testimonials" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[var(--ink-soft)] transition-colors hover:text-[var(--accent)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Get in touch</p>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--ink-soft)]">
            <li>
              <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-[var(--accent)]">
                <Mail size={14} /> {email}
              </a>
            </li>
            <li>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-[var(--accent)]">
                <Phone size={14} /> {phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} /> {location}
            </li>
          </ul>

          {socials.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-xs text-[var(--ink-muted)]">
              Social links not added yet — add them in the admin dashboard.
            </p>
          )}
        </div>
      </div>

      <div className="rule" />
      <div className="shell flex flex-col gap-2 py-6 text-xs text-[var(--ink-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
        <p className="flex items-center gap-4">
          <Link href="/login" className="hover:text-[var(--accent)]">
            Admin
          </Link>
          <span>Ask the AI assistant — bottom right</span>
        </p>
      </div>
    </footer>
  );
}
