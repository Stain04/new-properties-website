import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import { site } from "@/data/site";
import "../globals.css";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-fraunces", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-manrope", display: "swap" });
// Arabic fields in the listing form use the same Arabic face as the public site.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `Admin — ${site.name}`, template: `%s — ${site.name} admin` },
  robots: { index: false, follow: false },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-icon" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f5f2ec" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${fraunces.variable} ${manrope.variable} ${plexArabic.variable}`}>
      <body className="min-h-screen bg-bone-100 antialiased">{children}</body>
    </html>
  );
}
