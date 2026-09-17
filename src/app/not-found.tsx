import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell grid min-h-dvh place-items-center py-24 text-center">
      <div>
        <p className="label">404</p>
        <h1 className="display mt-3 text-4xl md:text-6xl">This page doesn’t exist</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-[var(--ink-soft)]">
          The link may be outdated. Let’s get you back to the work.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Back home</Link>
          <Link href="/projects" className="btn btn-ghost">See projects</Link>
        </div>
      </div>
    </main>
  );
}
