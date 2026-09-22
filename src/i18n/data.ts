/**
 * ─────────────────────────────────────────────────────────────
 *  LOCALISED DATA
 *
 *  Listings come from the listing store (src/lib/listings) and
 *  carry their own English and Arabic text — they are managed in
 *  the admin panel at /admin.
 *
 *  Areas, advisers and marketing copy live in src/data/ (English)
 *  with Arabic overlays in src/i18n/content/ar/, keyed by slug.
 *
 *  These getters return everything already translated, so pages
 *  never need to know where a translation lives. Any missing
 *  Arabic text falls back to the English rather than breaking.
 * ─────────────────────────────────────────────────────────────
 */
import * as contentEn from "@/data/content";
import { areas as areasEn } from "@/data/areas";
import { site as siteEn } from "@/data/site";
import { team as teamEn } from "@/data/team";
import { toEur } from "@/lib/format";
import { getListings } from "@/lib/listings/store";
import type { Listing, ListingCopy } from "@/lib/listings/schema";
import type { Agent, Area, Property } from "@/lib/types";
import type { Locale } from "./config";
import * as contentAr from "./content/ar/content";
import { areasAr } from "./content/ar/areas";
import { siteAr } from "./content/ar/site";
import { teamAr } from "./content/ar/team";
import { getDictionary } from "./dictionaries";
import { formatPrice } from "./format";

/* ─────────────── Site ─────────────── */

export function getSite(locale: Locale) {
  if (locale === "en") return siteEn;
  return {
    ...siteEn,
    tagline: siteAr.tagline,
    legalName: siteAr.legalName,
    descriptor: siteAr.descriptor,
    positioning: siteAr.positioning,
    meta: { ...siteEn.meta, ...siteAr.meta },
    offices: siteEn.offices.map((o, i) => ({ ...o, ...siteAr.offices[i] })),
    social: siteEn.social.map((s, i) => ({ ...s, label: siteAr.social[i] ?? s.label })),
  };
}
export type LocalSite = ReturnType<typeof getSite>;

/* ─────────────── Areas ─────────────── */

export function getAreas(locale: Locale): Area[] {
  const dict = getDictionary(locale);
  return areasEn.map((a) => {
    const regionLabel = dict.labels.regions[a.region];
    if (locale === "en") return { ...a, regionLabel };
    const t = areasAr[a.slug];
    if (!t) return { ...a, regionLabel };
    return {
      ...a,
      regionLabel,
      name: t.name,
      tagline: t.tagline,
      blurb: t.blurb,
      description: t.description,
      highlights: t.highlights,
      stats: a.stats.map((s, i) => t.stats[i] ?? s),
    };
  });
}

export const getArea = (locale: Locale, slug: string) =>
  getAreas(locale).find((a) => a.slug === slug);

export function getRegions(locale: Locale) {
  const dict = getDictionary(locale);
  return (["red-sea", "greater-cairo"] as const).map((key) => ({
    key,
    label: dict.labels.regions[key],
    blurb: dict.labels.regionBlurbs[key],
  }));
}

/* ─────────────── Team ─────────────── */

export function getTeam(locale: Locale): Agent[] {
  if (locale === "en") return teamEn;
  return teamEn.map((m) => ({ ...m, ...(teamAr[m.slug] ?? {}) }));
}

export const getAgent = (locale: Locale, slug: string) => {
  const team = getTeam(locale);
  return team.find((a) => a.slug === slug) ?? team[0];
};

/* ─────────────── Properties ─────────────── */

/** Feature buckets used by the catalogue filters, derived from the English copy. */
const FEATURE_TESTS: Record<string, RegExp> = {
  sea: /sea|beach|lagoon|marina|nile|river/i,
  pool: /pool/i,
  furnished: /furnish/i,
  garden: /garden|terrace|roof/i,
  parking: /parking|garage/i,
};
export const featureKeys = Object.keys(FEATURE_TESTS);

export interface LocalProperty extends Property {
  areaName: string;
  typeLabel: string;
  finishingLabel: string;
  /** Display price including the rental period, e.g. "€1,150 / month". */
  priceText: string;
  /** Approximate EUR value, so mixed currencies sort and filter coherently. */
  eurValue: number;
  featureKeys: string[];
}

/** Turn a stored listing into what the site renders, in one language. */
export function localiseListing(
  l: Listing,
  locale: Locale,
  areaNames: Record<string, string>,
): LocalProperty {
  const dict = getDictionary(locale);
  const en = l.en;
  const ar = locale === "ar" ? (l.ar ?? {}) : {};
  // Arabic where it exists, falling back field by field to the English.
  const pick = <K extends keyof ListingCopy>(k: K): ListingCopy[K] => {
    const value = ar[k];
    const present = Array.isArray(value) ? value.length > 0 : Boolean(value);
    return (present ? value : en[k]) as ListingCopy[K];
  };

  const haystack = [...en.features, en.view, l.finishing].join(" ");

  let priceText = formatPrice(locale, l.price, l.currency);
  if (l.status === "sold") priceText = dict.labels.sold;
  else if (l.purpose === "rent")
    priceText = `${priceText} / ${l.period === "night" ? dict.labels.perNight : dict.labels.perMonth}`;

  return {
    slug: l.slug,
    ref: l.ref,
    purpose: l.purpose,
    type: l.type,
    areaSlug: l.areaSlug,
    price: l.price,
    currency: l.currency,
    period: l.period,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    size: l.size,
    plotSize: l.plotSize,
    deliveryYear: l.deliveryYear,
    finishing: l.finishing,
    status: l.status,
    featured: l.featured,
    exclusive: l.exclusive,
    coordinates: l.coordinates,
    agentSlug: l.agentSlug,
    images: l.images,
    title: pick("title"),
    address: pick("address"),
    summary: pick("summary"),
    description: pick("description"),
    features: pick("features"),
    view: pick("view"),
    floor: pick("floor"),
    paymentPlan: l.paymentPlan && { ...l.paymentPlan, note: pick("planNote") ?? "" },
    areaName: areaNames[l.areaSlug] ?? l.areaSlug,
    typeLabel: dict.labels.types[l.type],
    finishingLabel: dict.labels.finishing[l.finishing],
    priceText,
    eurValue: toEur(l.price, l.currency),
    featureKeys: featureKeys.filter((k) => FEATURE_TESTS[k].test(haystack)),
  };
}

export async function getProperties(locale: Locale): Promise<LocalProperty[]> {
  const areaNames = Object.fromEntries(getAreas(locale).map((a) => [a.slug, a.name]));
  return (await getListings()).map((l) => localiseListing(l, locale, areaNames));
}

export async function getProperty(locale: Locale, slug: string) {
  return (await getProperties(locale)).find((p) => p.slug === slug);
}

/** Similar listings: same area first, then same type, excluding the current one. */
export async function getSimilar(locale: Locale, slug: string, limit = 3) {
  const all = await getProperties(locale);
  const p = all.find((x) => x.slug === slug);
  if (!p) return [];
  const pool = all.filter((x) => x.slug !== slug && x.purpose === p.purpose);
  const sameArea = pool.filter((x) => x.areaSlug === p.areaSlug);
  const sameType = pool.filter((x) => x.areaSlug !== p.areaSlug && x.type === p.type);
  return [...new Set([...sameArea, ...sameType, ...pool])].slice(0, limit);
}

/** Property types present in the inventory, as { value, label } for filter menus. */
export async function getPropertyTypes(locale: Locale) {
  const dict = getDictionary(locale);
  return Array.from(new Set((await getListings()).map((l) => l.type)))
    .sort()
    .map((value) => ({ value, label: dict.labels.types[value] }));
}

/* ─────────────── Marketing content ─────────────── */

export function getContent(locale: Locale) {
  if (locale === "en") return contentEn;
  const ar = contentAr;
  return {
    ...contentEn,
    services: contentEn.services.map((s) => ({ ...s, ...(ar.servicesAr[s.id] ?? {}) })),
    advantages: contentEn.advantages.map((a) => ({ ...a, ...(ar.advantagesAr[a.number] ?? {}) })),
    stats: contentEn.stats.map((s, i) => ({ ...s, ...(ar.statsAr[i] ?? {}) })),
    investmentReasons: contentEn.investmentReasons.map((r) => ({
      ...r,
      ...(ar.investmentReasonsAr[r.number] ?? {}),
    })),
    process: contentEn.process.map((s) => ({ ...s, ...(ar.processAr[s.step] ?? {}) })),
    developers: ar.developersAr,
    testimonials: contentEn.testimonials.map((t, i) => ({ ...t, ...(ar.testimonialsAr[i] ?? {}) })),
    faqGroups: ar.faqGroupsAr,
  };
}

/* ─────────────── Navigation ─────────────── */

export function getNav(locale: Locale) {
  const d = getDictionary(locale).nav;
  return [
    { label: d.properties, href: "/properties" },
    { label: d.destinations, href: "/destinations" },
    { label: d.services, href: "/services" },
    { label: d.about, href: "/about" },
    { label: d.contact, href: "/contact" },
  ];
}

export function getFooterNav(locale: Locale) {
  const f = getDictionary(locale).footer;
  return [
    {
      title: f.browse,
      links: [
        { label: f.allProperties, href: "/properties" },
        { label: f.forSale, href: "/properties?purpose=sale" },
        { label: f.forRent, href: "/properties?purpose=rent" },
        { label: f.exclusives, href: "/properties?exclusive=1" },
        { label: f.destinations, href: "/destinations" },
      ],
    },
    {
      title: f.company,
      links: [
        { label: f.aboutUs, href: "/about" },
        { label: f.team, href: "/about#team" },
        { label: f.services, href: "/services" },
        { label: f.contact, href: "/contact" },
      ],
    },
    {
      title: f.advisory,
      links: [
        { label: f.buying, href: "/services#buying" },
        { label: f.selling, href: "/services#selling" },
        { label: f.management, href: "/services#management" },
        { label: f.legal, href: "/services#legal" },
        { label: f.interiors, href: "/services#interiors" },
      ],
    },
  ];
}

