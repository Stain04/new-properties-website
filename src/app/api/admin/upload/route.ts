import { isAdmin } from "@/lib/admin/auth";
import { ACCEPTED_IMAGE_TYPES, getStore, MAX_IMAGE_BYTES } from "@/lib/listings/store";
import sharp from "sharp";

/** Longest edge of a stored photo — sharp on a large screen, small enough to load fast on a phone. */
const MAX_EDGE = 2000;

/**
 * Photos are served as stored (see src/lib/imageLoader.ts), so they are sized
 * here, once: turned upright, shrunk to MAX_EDGE, and saved as a compact JPEG.
 * A 6 MB phone photo typically comes out at 300–500 KB.
 */
async function prepare(file: File): Promise<File> {
  const jpeg = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  return new File([new Uint8Array(jpeg)], "photo.jpg", { type: "image/jpeg" });
}

/**
 * Photo upload for the admin panel. A route handler rather than a server
 * action so large photos aren't limited by the server-action body size.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Please log in again." }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No photo received." }, { status: 400 });

  if (!ACCEPTED_IMAGE_TYPES[file.type]) {
    return Response.json({ error: "Use a JPG, PNG, WebP or AVIF photo." }, { status: 415 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return Response.json({ error: "That photo is over 12 MB — export a smaller version." }, { status: 413 });
  }

  try {
    const store = await getStore();
    if (!(await store.writable())) {
      return Response.json({ error: "This host cannot store photos. Connect Supabase storage." }, { status: 503 });
    }
    return Response.json({ url: await store.uploadImage(await prepare(file)) });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
