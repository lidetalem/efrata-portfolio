import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Efrata Alex — Video Editor, Social Media Manager & Motion Designer",
    template: "%s · Efrata Alex",
  },
  description:
    "Efrata Alex is a creative professional in Ethiopia working across video editing, social media management and marketing, graphic design, motion graphics and content creation.",
  keywords: [
    "Efrata Alex",
    "video editor Ethiopia",
    "social media manager",
    "motion graphics designer",
    "graphic designer Ethiopia",
    "content creator",
  ],
  authors: [{ name: "Efrata Alex" }],
  openGraph: {
    type: "website",
    siteName: "Efrata Alex",
    title: "Efrata Alex — Creative Portfolio",
    description: "I turn ideas into visual experiences. Video, social media, design and motion.",
    url: appUrl,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0a090d" },
  ],
};

const themeScript = `(function(){try{var s=localStorage.getItem('efrata-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${bricolage.variable} ${manrope.variable} antialiased`}>{children}</body>
    </html>
  );
}
