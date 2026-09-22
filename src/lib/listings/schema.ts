import { z } from "zod";

/**
 * ─────────────────────────────────────────────────────────────
 *  LISTING SCHEMA
 *
 *  One listing = shared facts (price, size, photos…) plus the
 *  words in each language. This is the single source of truth:
 *  the admin panel writes it, the storage layer persists it, and
 *  the public site reads it. Validation runs on every save.
 * ─────────────────────────────────────────────────────────────
 */

export const PROPERTY_TYPES = [
  "Apartment",
  "Penthouse",
  "Villa",
  "Twin House",
  "Townhouse",
  "Chalet",
  "Studio",
  "Duplex",
  "Office",
] as const;

export const FINISHINGS = ["Fully finished", "Semi-finished", "Core & shell", "Furnished"] as const;
export const CURRENCIES = ["EGP", "USD", "EUR"] as const;
export const STATUSES = ["available", "reserved", "sold"] as const;

const text = (max: number) => z.string().trim().max(max);

/** The words of a listing, in one language. */
export const listingCopySchema = z.object({
  title: text(140).min(3, "Add a title"),
  address: text(160).min(2, "Add an address"),
  summary: text(400).min(10, "Add a one-line summary"),
  /** Paragraphs, in order. */
  description: z.array(text(3000)).max(12),
  features: z.array(text(120)).max(30),
  view: text(120),
  floor: text(60).optional(),
  planNote: text(200).optional(),
});

export const listingSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes")
    .max(120),
  ref: text(24).min(2),
  purpose: z.enum(["sale", "rent"]),
  type: z.enum(PROPERTY_TYPES),
  areaSlug: z.string().min(1),
  price: z.number().positive().max(10_000_000_000),
  currency: z.enum(CURRENCIES),
  period: z.enum(["month", "night"]).optional(),
  bedrooms: z.number().int().min(0).max(50),
  bathrooms: z.number().int().min(0).max(50),
  size: z.number().positive().max(1_000_000),
  plotSize: z.number().positive().max(10_000_000).optional(),
  deliveryYear: z.number().int().min(1950).max(2100).optional(),
  finishing: z.enum(FINISHINGS),
  status: z.enum(STATUSES),
  featured: z.boolean(),
  exclusive: z.boolean(),
  paymentPlan: z
    .object({ downPayment: text(20).min(1), years: z.number().int().min(1).max(30) })
    .optional(),
  coordinates: z
    .object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) })
    .optional(),
  agentSlug: z.string().min(1),
  /** Photo URLs, first one is the cover. */
  images: z.array(z.string().min(1)).min(1, "Add at least one photo").max(40),
  en: listingCopySchema,
  /** Arabic copy is optional per listing — the English is shown if it is missing. */
  ar: listingCopySchema.partial().optional(),
  updatedAt: z.string().optional(),
});

export type Listing = z.infer<typeof listingSchema>;
export type ListingCopy = z.infer<typeof listingCopySchema>;

/** "Lagoon villa, West Golf" → "lagoon-villa-west-golf" */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
