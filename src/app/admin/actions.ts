"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminConfigProblem, endSession, passwordMatches, requireAdmin, startSession } from "@/lib/admin/auth";
import { listingSchema, STATUSES, type Listing } from "@/lib/listings/schema";
import { getStore } from "@/lib/listings/store";

/* ─────────────── Session ─────────────── */

export async function login(_prev: { error?: string }, form: FormData): Promise<{ error?: string }> {
  if (adminConfigProblem()) return { error: "The admin panel is not configured on this site yet." };

  const password = String(form.get("password") ?? "");
  if (!passwordMatches(password)) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 700));
    return { error: "That password is not correct." };
  }

  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/* ─────────────── Listings ─────────────── */

export interface SaveResult {
  ok: boolean;
  slug?: string;
  error?: string;
  /** Field path (e.g. "en.title", "price") → message. */
  fieldErrors?: Record<string, string>;
}

/** Rebuild every public page that shows listings, in both languages. */
function refreshSite() {
  revalidatePath("/[locale]", "layout");
  revalidatePath("/sitemap.xml");
}

async function writableStore() {
  const store = await getStore();
  if (!(await store.writable())) {
    throw new Error(
      "This host does not allow saving files. Connect Supabase storage (see README → Managing listings) to edit listings here.",
    );
  }
  return store;
}

export async function saveListing(input: unknown, previousSlug?: string): Promise<SaveResult> {
  await requireAdmin();

  const parsed = listingSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Some fields need attention.", fieldErrors };
  }

  const listing: Listing = parsed.data;

  try {
    const store = await writableStore();
    const existing = await store.list();
    const clash = existing.find((l) => l.slug === listing.slug && l.slug !== previousSlug);
    if (clash) {
      return {
        ok: false,
        error: "Another listing already uses this web address.",
        fieldErrors: { slug: "Already used by another listing — change it slightly." },
      };
    }
    await store.save(listing, previousSlug);
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }

  refreshSite();
  return { ok: true, slug: listing.slug };
}

export async function deleteListing(slug: string): Promise<SaveResult> {
  await requireAdmin();
  try {
    const store = await writableStore();
    await store.remove(slug);
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
  refreshSite();
  return { ok: true };
}

/** Quick changes from the listings table without opening the full form. */
export async function updateFlags(
  slug: string,
  patch: { featured?: boolean; exclusive?: boolean; status?: (typeof STATUSES)[number] },
): Promise<SaveResult> {
  await requireAdmin();
  try {
    const store = await writableStore();
    const current = (await store.list()).find((l) => l.slug === slug);
    if (!current) return { ok: false, error: "That listing no longer exists." };
    const next = listingSchema.parse({ ...current, ...patch });
    await store.save(next);
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
  refreshSite();
  return { ok: true, slug };
}
