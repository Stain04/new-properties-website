import { randomInt } from "node:crypto";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ListingForm from "@/components/admin/ListingForm";
import { areas } from "@/data/areas";
import { team } from "@/data/team";
import { getListings } from "@/lib/listings/store";

export const metadata = { title: "Add listing" };
export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  // A short reference that isn't already taken, e.g. NP-4821.
  const taken = new Set((await getListings()).map((l) => l.ref));
  let ref = "";
  do ref = `NP-${randomInt(1000, 10000)}`;
  while (taken.has(ref));

  return (
    <>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900">
        <ArrowLeft className="size-4" /> All listings
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink-900">Add a listing</h1>
      <p className="mb-8 mt-1 text-sm text-ink-500">It goes live on the website, in both languages, as soon as you publish.</p>

      <ListingForm
        suggestedRef={ref}
        areas={areas.map((a) => ({ slug: a.slug, name: a.name, region: a.region }))}
        agents={team.map((m) => ({ slug: m.slug, name: m.name, role: m.role }))}
      />
    </>
  );
}
