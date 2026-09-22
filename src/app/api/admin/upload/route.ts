import { isAdmin } from "@/lib/admin/auth";
import { ACCEPTED_IMAGE_TYPES, getStore, MAX_IMAGE_BYTES } from "@/lib/listings/store";

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
    return Response.json({ url: await store.uploadImage(file) });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
