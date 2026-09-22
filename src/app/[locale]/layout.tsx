import type { Metadata, Viewport } from "next";
import { Alexandria, Fraunces, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import ContactDock from "@/components/site/ContactDock";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { dir, isLocale, locales, ogLocale, type Locale } from "@/i18n/config";
import { getAreas, getNav, getSite } from "@/i18n/data";
import { getDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";
import "../globals.css";

/* Latin: Fraunces (display) + Manrope (UI). */
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

/* Arabic: Alexandria (display) + IBM Plex Sans Arabic (UI). Latin characters
   inside Arabic text fall through to Manrope, so brand names stay consistent. */
const alexandria = Alexandria({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-alexandria",
  display: "swap",
});
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const site = getSite(locale);
  return {
    metadataBase: new URL(site.meta.url),
    title: { default: site.meta.title, template: `%s — ${site.name}` },
    description: site.meta.description,
    openGraph: {
      type: "website",
      locale: ogLocale[locale],
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
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: "/apple-icon",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#05080b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const site = getSite(locale);
  const dict = getDictionary(locale);
  const areaOptions = getAreas(locale).map((a) => ({ slug: a.slug, name: a.name }));

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
    inLanguage: locale,
    areaServed: ["New Cairo", "Fifth Settlement", "New Administrative Capital", "Sheikh Zayed", "Cairo"],
    address: site.offices.map((o) => ({
      "@type": "PostalAddress",
      addressLocality: o.city,
      addressCountry: "EG",
      streetAddress: o.lines[0],
    })),
  };

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${fraunces.variable} ${manrope.variable} ${alexandria.variable} ${plexArabic.variable}`}
    >
      <head>
        <noscript>
          {/* Scroll-reveal is JS-driven; without it, render everything visible. */}
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <I18nProvider locale={locale} dict={dict} areas={areaOptions}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:text-bone-50"
          >
            {dict.common.skip}
          </a>
          <Header nav={getNav(locale)} phone={site.contact} tagline={site.tagline} />
          <main id="main">{children}</main>
          <Footer locale={locale} />
          <ContactDock contact={site.contact} />
        </I18nProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
