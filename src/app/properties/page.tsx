import type { Metadata } from "next";
import Explorer, { type ExplorerInitial } from "@/components/property/Explorer";
import PageHero from "@/components/site/PageHero";
import { properties } from "@/data/properties";
import { photos } from "@/lib/images";

export const metadata: Metadata = {
  title: "Properties for sale and rent in Egypt",
  description:
    "Browse apartments, villas, penthouses and chalets across the Red Sea and Greater Cairo. Filter by destination, budget, type and features.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const initial: ExplorerInitial = {
    purpose: one(sp.purpose),
    area: one(sp.area),
    type: one(sp.type),
    max: one(sp.max),
    beds: one(sp.beds),
    feature: one(sp.feature),
    exclusive: one(sp.exclusive),
    sort: one(sp.sort),
  };

  return (
    <>
      <PageHero
        eyebrow="The catalogue"
        title="Every property we currently represent."
        lede={`${properties.length} published listings across eight Egyptian markets. Our off-market book is considerably larger — ask an adviser what is not shown here.`}
        image={photos.heroCoast}
        crumbs={[{ label: "Home", href: "/" }, { label: "Properties" }]}
      />

      <div className="bg-bone-50">
        <Explorer initial={initial} />
      </div>
    </>
  );
}
