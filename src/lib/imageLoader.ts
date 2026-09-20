/**
 * ─────────────────────────────────────────────────────────────
 *  IMAGE LOADER
 *
 *  Wired up through `images.loaderFile` in next.config.ts.
 *
 *  Local files (anything starting with "/") go through Next's own
 *  optimizer exactly as they normally would — so when the agency
 *  drops real photography into /public/photos/ it is resized,
 *  converted to AVIF/WebP and cached by the server.
 *
 *  Remote placeholder photography is resized by the source CDN
 *  instead. That CDN already does format negotiation and crops on
 *  demand, so proxying it through our own optimizer only adds a
 *  round trip — and, with a hundred-odd images on a page, enough
 *  concurrent upstream fetches to trip the optimizer's timeout.
 * ─────────────────────────────────────────────────────────────
 */

interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  const q = quality ?? 75;

  // Local asset — hand it back to the built-in optimizer.
  if (src.startsWith("/")) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
  }

  // Remote asset — ask the source CDN for exactly the size we need.
  const [base, existingQuery] = src.split("?");
  const params = new URLSearchParams(existingQuery);
  params.set("auto", "format");
  params.set("fit", "crop");
  params.set("w", String(width));
  params.set("q", String(q));

  return `${base}?${params.toString()}`;
}
