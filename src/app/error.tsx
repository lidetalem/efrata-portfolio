"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="shell grid min-h-dvh place-items-center py-24 text-center">
      <div>
        <p className="label">Something went wrong</p>
        <h1 className="display mt-3 text-4xl md:text-5xl">We hit an unexpected error</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-[var(--ink-soft)]">
          Nothing was lost. Try again, or head back to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            <RotateCcw size={15} /> Try again
          </button>
          <Link href="/" className="btn btn-ghost">Back home</Link>
        </div>
      </div>
    </main>
  );
}
