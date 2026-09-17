"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null as { error?: string } | null);

  return (
    <form action={action} className="card mt-8 space-y-4 p-6">
      <label className="block">
        <span className="label">Email</span>
        <input name="email" type="email" required autoComplete="email" className="field" />
      </label>
      <label className="block">
        <span className="label">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className="field" />
      </label>

      {state?.error && (
        <p className="flex items-start gap-2 rounded-lg bg-[var(--accent-soft)] p-3 text-xs text-[var(--accent)]">
          <AlertCircle size={14} className="mt-0.5 shrink-0" /> {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        {pending ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />} Sign in
      </button>
    </form>
  );
}
