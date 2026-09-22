import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/listings/local-store";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

/** Serves photos uploaded through the admin panel when using local storage. */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path;
  const file = path.resolve(UPLOADS_DIR, ...parts);

  // Refuse anything that escapes the uploads folder (e.g. "../../.env").
  if (!file.startsWith(UPLOADS_DIR + path.sep)) return new Response("Not found", { status: 404 });

  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type) return new Response("Not found", { status: 404 });

  try {
    const body = await readFile(file);
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": type,
        // File names are random UUIDs and never reused, so they can be cached forever.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
