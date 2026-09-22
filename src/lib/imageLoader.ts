/**
 * ─────────────────────────────────────────────────────────────
 *  IMAGE LOADER
 *
 *  Wired up through `images.loaderFile` in next.config.ts.
 *
 *  Remote placeholder photography is resized by the source CDN,
 *  which already does format negotiation and crops on demand.
 *
 *  Everything else — files in /public, admin uploads under /media,
 *  photos in Supabase storage — is served as stored. A custom
 *  loader switches off Next's built-in optimizer (/_next/image
 *  returns 404), so those photos are instead resized once, when
 *  they are uploaded (see src/app/api/admin/upload/route.ts).
 * ─────────────────────────────────────────────────────────────
 */

interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  const q = quality ?? 75;

  // Not Unsplash — serve the file as stored. The width is passed along only so
  // each size is a distinct URL; static hosts and Supabase ignore it.
  if (!src.startsWith("https://images.unsplash.com/")) {
    return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
  }

  // Unsplash — ask the source CDN for exactly the size we need.
  const [base, existingQuery] = src.split("?");
  const params = new URLSearchParams(existingQuery);
  params.set("auto", "format");
  params.set("fit", "crop");
  params.set("w", String(width));
  params.set("q", String(q));

  return `${base}?${params.toString()}`;
}
