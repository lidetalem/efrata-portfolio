export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label="Efrata Alex monogram"
    >
      <rect x="1.5" y="1.5" width="37" height="37" rx="11" stroke="currentColor" strokeWidth="2.4" />
      <path d="M12 11h13" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M12 20h9" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M12 29h13" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M27.5 17.5 33 20l-5.5 2.5V17.5Z" fill="currentColor" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo className="h-7 w-7 text-[var(--accent)]" />
      <span className="display text-[1.02rem] tracking-tight">
        EFRATA<span className="text-[var(--accent)]">.</span>ALEX
      </span>
    </span>
  );
}
