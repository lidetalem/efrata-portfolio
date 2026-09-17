import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  Award,
  BarChart3,
  Bot,
  Building2,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Quote,
  Settings,
  Share2,
  Sparkles,
  UserRound,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { logoutAction } from "./actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/media", label: "Project media", icon: Sparkles },
  { href: "/admin/services", label: "Services", icon: BarChart3 },
  { href: "/admin/inquiries", label: "Messages", icon: Inbox },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/certifications", label: "Certificates", icon: Award },
  { href: "/admin/logos", label: "Logos", icon: Building2 },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/social", label: "Social links", icon: Share2 },
  { href: "/admin/knowledge", label: "AI knowledge", icon: Bot },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-dvh" style={{ background: "var(--bg-sunken)" }}>
      <div className="mx-auto flex max-w-[92rem] flex-col lg:flex-row">
        <aside
          className="sticky top-0 z-30 shrink-0 border-b lg:h-dvh lg:w-60 lg:border-b-0 lg:border-r"
          style={{ borderColor: "var(--surface-border)", background: "var(--bg-elevated)" }}
        >
          <div className="flex items-center gap-2 p-4">
            <Logo className="h-6 w-6 text-[var(--accent)]" />
            <span className="text-sm font-bold">Studio admin</span>
            <span className="ml-auto lg:hidden">
              <ThemeToggle compact />
            </span>
          </div>
          <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:overflow-visible">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[0.82rem] font-medium text-[var(--ink-soft)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden border-t p-3 lg:block" style={{ borderColor: "var(--surface-border)" }}>
            <p className="truncate text-[0.7rem] text-[var(--ink-muted)]">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <form action={logoutAction}>
                <button type="submit" className="btn btn-ghost !py-1.5 !text-[0.7rem]">
                  <LogOut size={13} /> Log out
                </button>
              </form>
              <ThemeToggle compact />
            </div>
            <Link href="/" className="mt-2 block text-[0.7rem] text-[var(--ink-muted)] hover:text-[var(--accent)]">
              ← View website
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
