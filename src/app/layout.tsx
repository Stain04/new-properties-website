import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import ContactDock from "@/components/site/ContactDock";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { site } from "@/data/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.meta.url),
  title: {
    default: site.meta.title,
    template: `%s — ${site.name}`,
  },
  description: site.meta.description,
  keywords: [
    "real estate New Cairo",
    "TMG Group properties",
    "New Capital City real estate",
    "New Administrative Capital offices",
    "commercial property New Cairo",
    "administrative offices New Capital",
    "buy property Egypt foreigner",
  ],
  openGraph: {
    type: "website",
    locale: site.meta.locale,
    url: site.meta.url,
    siteName: site.name,
    title: site.meta.title,
    description: site.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05080b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.legalName,
    alternateName: site.name,
    description: site.meta.description,
    url: site.meta.url,
    telephone: site.contact.phoneDisplay,
    email: site.contact.email,
    foundingDate: String(site.established),
    areaServed: ["New Cairo", "Fifth Settlement", "New Administrative Capital", "Sheikh Zayed", "Cairo"],
    address: site.offices.map((o) => ({
      "@type": "PostalAddress",
      addressLocality: o.city,
      addressCountry: "EG",
      streetAddress: o.lines[0],
    })),
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <head>
        <noscript>
          {/* Scroll-reveal is JS-driven; without it, render everything visible. */}
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:text-bone-50"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ContactDock />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
