/**
 * ─────────────────────────────────────────────────────────────
 *  LISTING STORAGE
 *
 *  Two interchangeable backends behind one interface:
 *
 *   • local    — data/listings.json + data/uploads/ on disk.
 *                Works out of the box; ideal for development
 *                and for any host with a writable disk (a VPS).
 *
 *   • supabase — the same JSON file plus photos in a Supabase
 *                Storage bucket. Needed on hosts whose disk is
 *                read-only at runtime, such as Vercel.
 *
 *  Supabase is used automatically when SUPABASE_URL and
 *  SUPABASE_SERVICE_ROLE_KEY are set. No database tables are
 *  needed — see `npm run setup:supabase`.
 * ─────────────────────────────────────────────────────────────
 */
import { cache } from "react";
import { listingSchema, type Listing } from "./schema";

export interface ListingStore {
  kind: "local" | "supabase";
  list(): Promise<Listing[]>;
  /** Insert or replace. Pass the previous slug when a listing is renamed. */
  save(listing: Listing, previousSlug?: string): Promise<void>;
  remove(slug: string): Promise<void>;
  /** Store a photo and return the URL the site should use for it. */
  uploadImage(file: File): Promise<string>;
  /** Whether this store can accept writes on the current host. */
  writable(): Promise<boolean>;
}

export const ACCEPTED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
export const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

/** Parse stored JSON, keeping valid listings and reporting — not crashing on — bad ones. */
export function parseListings(raw: unknown): Listing[] {
  if (!Array.isArray(raw)) return [];
  const out: Listing[] = [];
  for (const item of raw) {
    const r = listingSchema.safeParse(item);
    if (r.success) out.push(r.data);
    else console.warn(`[listings] skipped an invalid listing (${(item as { slug?: string })?.slug ?? "no slug"}):`, r.error.issues[0]?.message);
  }
  return out;
}

/** Apply a save to an in-memory list: replace by slug, or append. */
export function upsert(listings: Listing[], listing: Listing, previousSlug?: string): Listing[] {
  const key = previousSlug ?? listing.slug;
  const stamped = { ...listing, updatedAt: new Date().toISOString() };
  const i = listings.findIndex((l) => l.slug === key);
  if (i === -1) return [stamped, ...listings];
  const next = [...listings];
  next[i] = stamped;
  return next;
}

export const usingSupabase = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function getStore(): Promise<ListingStore> {
  if (usingSupabase()) return (await import("./supabase-store")).supabaseStore;
  return (await import("./local-store")).localStore;
}

/** All listings, read once per request. */
export const getListings = cache(async () => (await getStore()).list());
