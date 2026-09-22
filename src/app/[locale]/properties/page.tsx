import type { Metadata } from "next";
import Explorer, { type ExplorerInitial } from "@/components/property/Explorer";
import PageHero from "@/components/site/PageHero";
import { isLocale, type Locale } from "@/i18n/config";
import { getAreas, getProperties, getPropertyTypes, getRegions } from "@/i18n/data";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { pageMetadata } from "@/i18n/metadata";
import { photos } from "@/lib/images";

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).catalogue;
  return pageMetadata(locale, "/properties", { title: t.metaTitle, description: t.metaDescription });
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function PropertiesPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const locale = (await params).locale as Locale;
  const sp = await searchParams;
  const dict = getDictionary(locale);
  const t = dict.catalogue;
  const properties = await getProperties(locale);

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
        eyebrow={t.eyebrow}
        title={t.title}
        lede={fmt(t.lede, { count: properties.length })}
        image={photos.heroCoast}
        crumbs={[{ label: dict.common.home, href: "/" }, { label: t.crumb }]}
      />

      <div className="bg-bone-50">
        <Explorer
          initial={initial}
          properties={properties}
          areas={getAreas(locale)}
          regions={getRegions(locale)}
          types={await getPropertyTypes(locale)}
        />
      </div>
    </>
  );
}
