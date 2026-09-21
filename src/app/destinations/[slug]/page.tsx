import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LeadForm from "@/components/forms/LeadForm";
import PropertyCard from "@/components/property/PropertyCard";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import { areaBySlug, areas } from "@/data/areas";
import { byArea } from "@/data/properties";

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = areaBySlug(slug);
  if (!a) return { title: "Destination not found" };
  return {
    title: `${a.name} property — ${a.tagline}`,
    description: a.blurb,
    openGraph: { title: a.name, description: a.blurb, images: [{ url: a.image }] },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = areaBySlug(slug);
  if (!area) notFound();

  const listings = byArea(area.slug);
  const sales = listings.filter((p) => p.purpose === "sale");
  const rentals = listings.filter((p) => p.purpose === "rent");
  const others = areas.filter((a) => a.slug !== area.slug && a.region === area.region);

  return (
    <>
      <PageHero
        eyebrow={area.regionLabel}
        title={area.name}
        lede={area.tagline}
        image={area.heroImage}
        size="lg"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Destinations", href: "/destinations" },
          { label: area.name },
        ]}
      >
        <div className="flex flex-wrap gap-x-12 gap-y-4 border-t border-bone-100/15 pt-6">
          {area.stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl text-bone-50">{s.value}</p>
              <p className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-bone-100/50">
                {s.label}
              </p>
            </div>
          ))}
          <div>
            <p className="font-display text-2xl text-gold-400">{listings.length}</p>
            <p className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-bone-100/50">
              Listings here
            </p>
          </div>
        </div>
      </PageHero>

      {/* Editorial */}
      <section className="section bg-bone-50">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">Our read on the market</p>
            <h2 className="display-md mt-5 max-w-2xl text-balance text-ink-900">{area.blurb}</h2>
            <div className="mt-8 space-y-5">
              {area.description.map((para) => (
                <p key={para.slice(0, 40)} className="text-[0.975rem] leading-relaxed text-ink-500">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-ink-900/10 bg-white p-7">
              <p className="eyebrow">What defines it</p>
              <ul className="mt-6 space-y-4">
                {area.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-[0.9375rem] text-ink-600">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-600" strokeWidth={2} />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="rule my-7" />
              <p className="text-[0.875rem] leading-relaxed text-ink-500">
                Want the full market note for {area.name} — transaction comparables, service
                charge benchmarks and developer delivery records?
              </p>
              <Link href="/contact" className="btn btn-ink btn-sm mt-5 w-full">
                Request the market note
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Listings */}
      {sales.length > 0 && (
        <section className="section bg-bone-100">
          <div className="shell">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">For sale</p>
                <h2 className="display-lg mt-5 text-ink-900">Available in {area.name}</h2>
              </div>
              <Link href={`/properties?area=${area.slug}`} className="btn btn-outline btn-sm">
                Filter the catalogue
              </Link>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sales.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 110}>
                  <PropertyCard property={p} priority={i < 3} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {rentals.length > 0 && (
        <section className="section bg-bone-50">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">To let</p>
              <h2 className="display-lg mt-5 text-ink-900">Rentals in {area.name}</h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {rentals.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 110}>
                  <PropertyCard property={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nearby + enquiry */}
      <section className="section bg-ink-950">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow eyebrow-light">Also consider</p>
            <h2 className="display-lg mt-5 text-bone-50">Nearby in {area.regionLabel}</h2>
            <ul className="mt-9">
              {others.map((a, i) => (
                <li key={a.slug}>
                  <Link
                    href={`/destinations/${a.slug}`}
                    className="group flex items-center justify-between gap-6 border-b border-bone-100/12 py-5"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-display text-sm text-gold-500">0{i + 1}</span>
                      <span>
                        <span className="display-sm block text-bone-50 transition-colors duration-300 group-hover:text-gold-400">
                          {a.name}
                        </span>
                        <span className="mt-1 block text-[0.8125rem] text-bone-100/45">
                          {a.tagline}
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-bone-100/12 bg-ink-900/60 p-7 backdrop-blur-xl">
              <p className="display-sm text-bone-50">Enquire about {area.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-bone-100/55">
                Including the properties here we have not published.
              </p>
              <div className="mt-6">
                <LeadForm tone="dark" compact subject={`${area.name}, ${area.regionLabel}`} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
