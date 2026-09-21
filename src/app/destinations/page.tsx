import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import { areas, regions } from "@/data/areas";
import { properties } from "@/data/properties";
import { photos } from "@/lib/images";

export const metadata: Metadata = {
  title: "Destinations — where to buy in Egypt",
  description:
    "El Gouna, Hurghada, Sahl Hasheesh, Soma Bay, Makadi Bay, New Cairo, the New Capital and Sheikh Zayed — what each market is actually for.",
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Where to buy"
        title="Eight markets, and what each one is actually for."
        lede="Yield, liquidity, buyer profile and title risk vary enormously between them. This is our honest read on each."
        image={photos.heroResort}
        crumbs={[{ label: "Home", href: "/" }, { label: "Destinations" }]}
      />

      {regions.map((region, ri) => {
        const list = areas.filter((a) => a.region === region.key);
        return (
          <section
            key={region.key}
            className={ri % 2 === 0 ? "section bg-bone-50" : "section bg-bone-100"}
          >
            <div className="shell">
              <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="eyebrow">{region.blurb}</p>
                  <h2 className="display-lg mt-5 text-ink-900">{region.label}</h2>
                </div>
                <p className="text-sm text-ink-400">
                  {list.length} destinations ·{" "}
                  {properties.filter((p) => list.some((a) => a.slug === p.areaSlug)).length}{" "}
                  listings
                </p>
              </Reveal>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {list.map((a, i) => {
                  const count = properties.filter((p) => p.areaSlug === a.slug).length;
                  return (
                    <Reveal key={a.slug} delay={(i % 2) * 110}>
                      <Link
                        href={`/destinations/${a.slug}`}
                        className="group block overflow-hidden rounded-2xl"
                      >
                        <div className="relative aspect-[16/11]">
                          <Image
                            src={a.image}
                            alt={a.name}
                            fill
                            sizes="(min-width:768px) 46vw, 92vw"
                            className="img-zoom object-cover"
                          />
                          <div className="scrim-b absolute inset-0" />

                          <span className="chip chip-glass absolute right-4 top-4">
                            {count} {count === 1 ? "listing" : "listings"}
                          </span>

                          <div className="absolute inset-x-6 bottom-5">
                            <div className="flex items-end justify-between gap-4">
                              <div className="min-w-0">
                                <p className="display-md text-bone-50">{a.name}</p>
                                <p className="mt-2 max-w-md text-sm leading-relaxed text-bone-100/70">
                                  {a.tagline}
                                </p>
                              </div>
                              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-bone-100/30 text-bone-50 transition-all duration-500 group-hover:border-gold-400 group-hover:bg-gold-500 group-hover:text-ink-950">
                                <ArrowUpRight className="size-4" strokeWidth={1.75} />
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
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/50" />
        <div className="shell relative max-w-2xl">
          <p className="eyebrow eyebrow-light">Not sure which</p>
          <h2 className="display-lg mt-6 text-balance text-bone-50">
            Start from the objective, not the map.
          </h2>
          <p className="lede lede-light mt-6">
            Tell us what the property is for and we will tell you which of these markets it
            belongs in — including when the answer is none of them yet.
          </p>
          <Link href="/contact" className="btn btn-gold mt-9">
            Speak to an adviser
          </Link>
        </div>
      </section>
    </>
  );
}
