import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { ACCEPTED_IMAGE_TYPES, parseListings, upsert, type ListingStore } from "./store";

export const BUCKET = process.env.SUPABASE_BUCKET || "site";
const LISTINGS_OBJECT = "listings.json";

/** Server-only client. The service-role key never reaches the browser. */
export function supabaseAdmin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function read() {
  const { data, error } = await supabaseAdmin().storage.from(BUCKET).download(LISTINGS_OBJECT);
  if (error || !data) {
    // Before `npm run setup:supabase` has run, fall back to the bundled demo listings
    // so the public site is never empty.
    const bundled = await readFile(path.join(process.cwd(), "data", "listings.json"), "utf8").catch(() => "[]");
    return parseListings(JSON.parse(bundled));
  }
  return parseListings(JSON.parse(await data.text()));
}

async function write(listings: unknown) {
  const body = new Blob([JSON.stringify(listings, null, 2)], { type: "application/json" });
  const { error } = await supabaseAdmin()
    .storage.from(BUCKET)
    .upload(LISTINGS_OBJECT, body, { upsert: true, contentType: "application/json", cacheControl: "0" });
  if (error) throw new Error(`Could not save listings to Supabase: ${error.message}`);
}

export const supabaseStore: ListingStore = {
  kind: "supabase",

  list: read,

  async save(listing, previousSlug) {
    await write(upsert(await read(), listing, previousSlug));
  },

  async remove(slug) {
    await write((await read()).filter((l) => l.slug !== slug));
  },

  async uploadImage(file) {
    const ext = ACCEPTED_IMAGE_TYPES[file.type];
    const key = `photos/${new Date().getFullYear()}/${randomUUID()}.${ext}`;
    const client = supabaseAdmin();
    const { error } = await client.storage.from(BUCKET).upload(key, file, {
      contentType: file.type,
      cacheControl: "31536000",
    });
    if (error) throw new Error(`Photo upload failed: ${error.message}`);
    return client.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
  },

  async writable() {
    return true;
  },
};
