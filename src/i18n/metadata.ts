import type { Metadata } from "next";
import { site } from "@/data/site";
import { localePath, locales, ogLocale, type Locale } from "./config";

/**
 * Per-page metadata: canonical URL, hreflang alternates, and the share card.
 *
 * Every page names its share image explicitly. A page that sets its own
 * openGraph block replaces — rather than inherits — the image from above,
 * so leaving it out would mean WhatsApp shows no picture for that page.
 *
 * `image` defaults to the branded site card for the page's language; listing
 * pages pass their own generated card.
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description, image }: { title?: string; description?: string; image?: string },
): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l, localePath(l, path)]));
  const card = image ?? `/${locale}/opengraph-image`;
  const images = [{ url: card, width: 1200, height: 630, alt: title ?? site.meta.title, type: "image/jpeg" }];

  return {
    // Only set these when given — an explicit undefined would wipe the layout's default title.
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: localePath(locale, path),
      languages: { ...languages, "x-default": path },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocale[locale],
      url: `${site.meta.url}${localePath(locale, path)}`,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images,
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [card],
    },
  };
}
