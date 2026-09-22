import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import { isLocale, type Locale } from "@/i18n/config";
import { getAreas, getProperties, getRegions } from "@/i18n/data";
import { getDictionary } from "@/i18n/dictionaries";
import { plural } from "@/i18n/format";
import Link from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { photos } from "@/lib/images";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).destinations;
  return pageMetadata(locale, "/destinations", { title: t.metaTitle, description: t.metaDescription });
}

export default async function DestinationsPage({ params }: { params: Params }) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.destinations;
  const areas = getAreas(locale);
  const properties = await getProperties(locale);

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        lede={t.lede}
        image={photos.heroResort}
        crumbs={[{ label: dict.common.home, href: "/" }, { label: t.crumb }]}
      />

      {getRegions(locale).map((region, ri) => {
        const list = areas.filter((a) => a.region === region.key);
        const regionCount = properties.filter((p) => list.some((a) => a.slug === p.areaSlug)).length;
        return (
          <section key={region.key} className={ri % 2 === 0 ? "section bg-bone-50" : "section bg-bone-100"}>
            <div className="shell">
              <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="eyebrow">{region.blurb}</p>
                  <h2 className="display-lg mt-5 text-ink-900">{region.label}</h2>
                </div>
                <p className="text-sm text-ink-400">
                  {plural(locale, list.length, dict.labels.destinationsCount)} ·{" "}
                  {plural(locale, regionCount, dict.labels.listings)}
                </p>
              </Reveal>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {list.map((a, i) => {
                  const count = properties.filter((p) => p.areaSlug === a.slug).length;
                  return (
                    <Reveal key={a.slug} delay={(i % 2) * 110}>
                      <Link href={`/destinations/${a.slug}`} className="group block overflow-hidden rounded-2xl">
                        <div className="relative aspect-[16/11]">
                          <Image
                            src={a.image}
                            alt={a.name}
                            fill
                            sizes="(min-width:768px) 46vw, 92vw"
                            className="img-zoom object-cover"
                          />
                          <div className="scrim-b absolute inset-0" />

                          <span className="chip chip-glass absolute end-4 top-4">
                            {plural(locale, count, dict.labels.listings)}
                          </span>

                          <div className="absolute inset-x-6 bottom-5">
                            <div className="flex items-end justify-between gap-4">
                              <div className="min-w-0">
                                <p className="display-md text-bone-50">{a.name}</p>
                                <p className="mt-2 max-w-md text-sm leading-relaxed text-bone-100/70">{a.tagline}</p>
                              </div>
                              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-bone-100/30 text-bone-50 transition-all duration-500 group-hover:border-gold-400 group-hover:bg-gold-500 group-hover:text-ink-950">
                                <ArrowUpRight className="size-4 rtl:-scale-x-100" strokeWidth={1.75} />
                              </span>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-bone-100/15 pt-4">
                              {a.stats.map((s) => (
                                <div key={s.label}>
                                  <p className="font-display text-base text-bone-50">{s.value}</p>
                                  <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-bone-100/50">
                                    {s.label}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink-950 py-20 md:py-24">
        <Image src={photos.nile} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/50 rtl:bg-gradient-to-l" />
        <div className="shell relative max-w-2xl">
          <p className="eyebrow eyebrow-light">{t.ctaEyebrow}</p>
          <h2 className="display-lg mt-6 text-balance text-bone-50">{t.ctaTitle}</h2>
          <p className="lede lede-light mt-6">{t.ctaLede}</p>
          <Link href="/contact" className="btn btn-gold mt-9">
            {dict.common.speakToAdviser}
          </Link>
        </div>
      </section>
    </>
  );
}
