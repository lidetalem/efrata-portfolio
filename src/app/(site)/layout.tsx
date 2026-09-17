import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Chatbot } from "@/components/chatbot";
import { AnalyticsBeacon } from "@/components/analytics-beacon";
import { getProfile, getSocialLinks } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, socials] = await Promise.all([getProfile(), getSocialLinks()]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteNav />
      <main id="main">{children}</main>
      <SiteFooter
        name={profile?.name ?? "Efrata Alex"}
        title={profile?.title ?? ""}
        email={profile?.email ?? "ephratahh16@gmail.com"}
        phone={profile?.phone ?? "+251900395342"}
        location={profile?.location ?? "Ethiopia"}
        socials={socials.map((s) => ({ id: s.id, platform: s.platform, url: s.url }))}
      />
      <Chatbot />
      <AnalyticsBeacon />
    </>
  );
}
