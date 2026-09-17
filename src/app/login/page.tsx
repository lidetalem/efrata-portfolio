import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "./login-form";
import { Wordmark } from "@/components/logo";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");

  return (
    <div className="grid min-h-dvh place-items-center p-6" style={{ background: "var(--bg-sunken)" }}>
      <div className="w-full max-w-sm">
        <Wordmark />
        <h1 className="display mt-6 text-3xl">Admin login</h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          This area is private. Only Efrata’s administrator account can sign in.
        </p>
        <LoginForm />
        <p className="mt-6 text-[0.7rem] text-[var(--ink-muted)]">
          No account yet? Run <code className="font-mono">npm run create-admin</code> in the project folder.
        </p>
      </div>
    </div>
  );
}
