import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * Locale routing.
 *
 *   /ar/...   → served as-is by the [locale] segment
 *   /en/...   → redirected to the un-prefixed URL (English is canonical at the root)
 *   /...      → rewritten internally to /en/... — the visitor's URL never changes
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const prefixed = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

  // Generated share images live under the internal /en route; serve them directly
  // rather than redirecting, so link-preview crawlers get the image in one hop.
  if (prefixed === defaultLocale && pathname.includes("/opengraph-image")) return NextResponse.next();

  if (prefixed === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (prefixed) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, the admin panel, uploaded media, metadata routes and anything with a file extension.
  matcher: ["/((?!_next|api|admin|media|apple-icon|sitemap\\.xml|robots\\.txt|favicon\\.ico|.*\\..*).*)"],
};
