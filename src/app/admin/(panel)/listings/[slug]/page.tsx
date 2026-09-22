import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ListingForm from "@/components/admin/ListingForm";
import { areas } from "@/data/areas";
import { team } from "@/data/team";
import { getStore } from "@/lib/listings/store";

export const metadata = { title: "Edit listing" };
export const dynamic = "force-dynamic";

export default async function EditListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { slug } = await params;
  const { saved } = await searchParams;
  const listing = (await (await getStore()).list()).find((l) => l.slug === slug);
  if (!listing) notFound();

  return (
    <>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900">
        <ArrowLeft className="size-4" /> All listings
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink-900">{listing.en.title}</h1>
      <p className="mb-8 mt-1 font-mono text-sm text-ink-400">{listing.ref}</p>

      {saved && (
        <p role="status" className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <Check className="size-4" /> Published — it&rsquo;s live on the site in both languages.
        </p>
      )}

      {/* key forces a fresh form after a save changes the listing */}
      <ListingForm
        key={listing.updatedAt ?? listing.slug}
        initial={listing}
        areas={areas.map((a) => ({ slug: a.slug, name: a.name, region: a.region }))}
        agents={team.map((m) => ({ slug: m.slug, name: m.name, role: m.role }))}
      />
    </>
  );
}
