"use client";

import Image from "next/image";

type Logo = { id: number; companyName: string; website: string | null; logoUrl: string | null; isSample: boolean };

export function LogoMarquee({ logos }: { logos: Logo[] }) {
  if (!logos.length) return null;
  // Duplicated once — the keyframes translate exactly -50%, so the loop is seamless.
  const track = [...logos, ...logos];

  return (
    <div className="marquee-wrap relative overflow-hidden" aria-label="Brands and organizations">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-28"
        style={{ background: "linear-gradient(to right, var(--bg), transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-28"
        style={{ background: "linear-gradient(to left, var(--bg), transparent)" }}
        aria-hidden
      />
      <ul className="marquee items-center gap-4" style={{ ["--marquee-duration" as string]: `${Math.max(24, logos.length * 6)}s` }}>
        {track.map((logo, i) => {
          const inner = (
            <span className="glass flex h-20 w-40 items-center justify-center gap-2 rounded-2xl px-4 transition-colors hover:border-[var(--accent)]">
              {logo.logoUrl ? (
                <Image
                  src={logo.logoUrl}
                  alt={logo.companyName}
                  width={120}
                  height={40}
                  className="max-h-10 w-auto object-contain opacity-80"
                />
              ) : (
                <span className="text-center text-[0.72rem] font-semibold leading-tight text-[var(--ink-soft)]">
                  {logo.companyName}
                </span>
              )}
            </span>
          );
          return (
            <li key={`${logo.id}-${i}`} aria-hidden={i >= logos.length}>
              {logo.website ? (
                <a href={logo.website} target="_blank" rel="noopener noreferrer nofollow" tabIndex={i >= logos.length ? -1 : 0}>
                  {inner}
                </a>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
      {logos.some((l) => l.isSample) && (
        <p className="mt-4 text-center text-[0.7rem] text-[var(--ink-muted)]">
          Sample placeholder logos — replace them with real brands from the admin dashboard.
        </p>
      )}
    </div>
  );
}
