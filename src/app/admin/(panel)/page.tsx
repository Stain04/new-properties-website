import { Plus } from "lucide-react";
import Link from "next/link";
import ListingsTable from "@/components/admin/ListingsTable";
import { areas } from "@/data/areas";
import { getStore } from "@/lib/listings/store";

export const metadata = { title: "Listings" };
// Always show the latest data, never a cached copy.
export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const store = await getStore();
  const listings = (await store.list()).sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
  const writable = await store.writable();
  const areaNames = Object.fromEntries(areas.map((a) => [a.slug, a.name]));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Listings</h1>
          <p className="mt-1 text-sm text-ink-500">
            {listings.length} on the site · changes appear on the website within seconds, in English and Arabic.
          </p>
        </div>
        <Link href="/admin/listings/new" className="btn btn-gold">
          <Plus className="size-4" />
          Add listing
        </Link>
      </div>

      {!writable && (
        <p className="mt-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This host doesn&rsquo;t allow saving files, so changes can&rsquo;t be stored. Connect Supabase storage — see
          the README section &ldquo;Managing listings&rdquo;.
        </p>
      )}

      <div className="mt-8">
        <ListingsTable
          listings={listings.map((l) => ({
            slug: l.slug,
            ref: l.ref,
            title: l.en.title,
            titleAr: l.ar?.title,
            cover: l.images[0],
            area: areaNames[l.areaSlug] ?? l.areaSlug,
            purpose: l.purpose,
            price: l.price,
            currency: l.currency,
            period: l.period,
            status: l.status,
            featured: l.featured,
            hasArabic: Boolean(l.ar?.title && l.ar?.summary),
            updatedAt: l.updatedAt,
          }))}
        />
      </div>
    </>
  );
}
