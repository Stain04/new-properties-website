#!/usr/bin/env node
/**
 * One-time Supabase setup for a new agency site.
 *
 *   npm run setup:supabase            create the bucket and upload the listings
 *   npm run setup:supabase -- --force also overwrite listings already in Supabase
 *
 * Reads SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and SUPABASE_BUCKET from the
 * environment (or .env.local). Photos uploaded locally (data/uploads, /media/…
 * URLs) are copied to Supabase and their URLs rewritten, so a site built up in
 * local mode moves to the cloud intact.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
const BUCKET = process.env.SUPABASE_BUCKET || "site";
const force = process.argv.includes("--force");

const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  fail("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first (see .env.example).");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// 1. Bucket — public, so the website can show photos without signing URLs.
const { data: existing } = await supabase.storage.getBucket(BUCKET);
if (existing) {
  console.log(`✓ Bucket "${BUCKET}" already exists`);
} else {
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: "12MB",
    allowedMimeTypes: [...Object.values(TYPES), "application/json"],
  });
  if (error) fail(`Could not create bucket "${BUCKET}": ${error.message}`);
  console.log(`✓ Created public bucket "${BUCKET}"`);
}

// 2. Listings — skip if the agency already has some, unless --force.
const { data: current } = await supabase.storage.from(BUCKET).download("listings.json");
if (current && !force) {
  console.log("✓ listings.json already in Supabase — left untouched (use --force to overwrite)");
  process.exit(0);
}

const listings = JSON.parse(await readFile(path.join(process.cwd(), "data", "listings.json"), "utf8"));

// 3. Move any locally uploaded photos to Supabase.
let moved = 0;
for (const listing of listings) {
  for (let i = 0; i < listing.images.length; i++) {
    const src = listing.images[i];
    if (!src.startsWith("/media/")) continue;
    const rel = src.slice("/media/".length);
    const type = TYPES[path.extname(rel).toLowerCase()];
    const bytes = await readFile(path.join(process.cwd(), "data", "uploads", rel)).catch(() => null);
    if (!bytes || !type) {
      console.warn(`  ! Missing local photo ${src} (listing ${listing.slug}) — skipped`);
      continue;
    }
    const key = `photos/${rel}`;
    const { error } = await supabase.storage.from(BUCKET).upload(key, bytes, { contentType: type, upsert: true, cacheControl: "31536000" });
    if (error) fail(`Photo upload failed for ${src}: ${error.message}`);
    listing.images[i] = supabase.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
    moved++;
  }
}
if (moved) console.log(`✓ Copied ${moved} locally uploaded photo(s) to Supabase`);

const { error } = await supabase.storage
  .from(BUCKET)
  .upload("listings.json", JSON.stringify(listings, null, 2), { upsert: true, contentType: "application/json", cacheControl: "0" });
if (error) fail(`Could not upload listings: ${error.message}`);

console.log(`✓ Uploaded ${listings.length} listings\n\nDone. Restart the site — the admin panel now saves to Supabase.\n`);
