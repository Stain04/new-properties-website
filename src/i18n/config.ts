/**
 * ─────────────────────────────────────────────────────────────
 *  LOCALES
 *
 *  English is served at the root (/properties), Arabic under a
 *  prefix (/ar/properties). The proxy in src/proxy.ts rewrites
 *  un-prefixed URLs to the English route internally, so English
 *  URLs never change.
 * ─────────────────────────────────────────────────────────────
 */

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const dir = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Native name of each language, shown in the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const ogLocale: Record<Locale, string> = {
  en: "en_EG",
  ar: "ar_EG",
};

/** Prefix an internal path for a locale: "/about" → "/ar/about" (English unchanged). */
export function localePath(locale: Locale, href: string): string {
  if (!href.startsWith("/")) return href; // external, mailto:, tel:, #hash
  if (locale === defaultLocale) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

/** Remove any locale prefix from a pathname: "/ar/about" → "/about". */
export function stripLocale(pathname: string): string {
  for (const l of locales) {
    if (l === defaultLocale) continue;
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

/** Which locale a browser pathname belongs to. */
export function localeFromPath(pathname: string): Locale {
  for (const l of locales) {
    if (l !== defaultLocale && (pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return l;
  }
  return defaultLocale;
}
