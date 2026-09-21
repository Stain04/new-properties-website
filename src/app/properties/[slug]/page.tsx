import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  Compass,
  Hammer,
  LandPlot,
  Layers,
  MapPin,
  Maximize2,
  Phone,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LeadForm from "@/components/forms/LeadForm";
import Gallery from "@/components/property/Gallery";
import PropertyCard from "@/components/property/PropertyCard";
import Reveal from "@/components/ui/Reveal";
import { areaBySlug } from "@/data/areas";
import { properties, propertyBySlug, similarTo } from "@/data/properties";
import { site } from "@/data/site";
import { agentBySlug } from "@/data/team";
import { formatArea, priceLabel } from "@/lib/format";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = propertyBySlug(slug);
  if (!p) return { title: "Property not found" };

  return {
    title: `${p.title} — ${priceLabel(p)}`,
    description: p.summary,
    openGraph: {
      title: p.title,
      description: p.summary,
      images: [{ url: p.images[0] }],
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = propertyBySlug(slug);
  if (!p) notFound();

  const area = areaBySlug(p.areaSlug);
  const agent = agentBySlug(p.agentSlug);
  const similar = similarTo(p.slug, 3);

  const specs = [
    p.bedrooms > 0 && { icon: BedDouble, label: "Bedrooms", value: String(p.bedrooms) },
    { icon: Bath, label: "Bathrooms", value: String(p.bathrooms) },
    { icon: Maximize2, label: "Internal area", value: formatArea(p.size) },
    p.plotSize && { icon: LandPlot, label: "Plot / garden", value: formatArea(p.plotSize) },
    p.floor && { icon: Layers, label: "Floor", value: p.floor },
    { icon: Hammer, label: "Finishing", value: p.finishing },
    { icon: Compass, label: "Aspect", value: p.view },
    p.deliveryYear && {
      icon: CalendarDays,
      label: p.deliveryYear > new Date().getFullYear() ? "Delivery" : "Delivered",
      value: String(p.deliveryYear),
    },
    { icon: Building2, label: "Type", value: p.type },
  ].filter(Boolean) as { icon: typeof BedDouble; label: string; value: string }[];

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.summary,
    url: `${site.meta.url}/properties/${p.slug}`,
    image: p.images.slice(0, 4),
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.currency,
      availability:
        p.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: p.address,
      addressCountry: "EG",
    },
  };

  return (
    <>
      {/* ═══════════ Header band ═══════════ */}
      <section className="relative bg-ink-950 pb-36 pt-36 md:pb-40">
        <Image
          src={p.images[1] ?? p.images[0]}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/80 to-ink-950" />

        <div className="shell relative">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-bone-100/45">
              <li>
                <Link href="/" className="inline-block py-2 transition-colors hover:text-gold-400">
                  Home
                </Link>
              </li>
              <li className="text-bone-100/25">/</li>
              <li>
                <Link href="/properties" className="inline-block py-2 transition-colors hover:text-gold-400">
                  Properties
                </Link>
              </li>
              <li className="text-bone-100/25">/</li>
              <li>
                <Link
                  href={`/destinations/${p.areaSlug}`}
                  className="inline-block py-2 transition-colors hover:text-gold-400"
                >
                  {area?.name}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap gap-1.5">
                <span className="chip chip-gold">{p.purpose === "sale" ? "For sale" : "To let"}</span>
                {p.exclusive && (
                  <span className="chip border border-gold-500/50 bg-transparent text-gold-400">
                    Exclusive instruction
                  </span>
                )}
                {p.status === "reserved" && (
                  <span className="chip bg-bone-50/15 text-bone-50">Reserved</span>
                )}
                <span className="chip chip-glass">{p.type}</span>
              </div>

              <h1 className="display-lg text-balance text-bone-50">{p.title}</h1>

              <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-bone-100/60">
                <MapPin className="size-4 text-gold-500" strokeWidth={1.5} />
                {p.address}
                <span className="text-bone-100/25">·</span>
                <span className="font-mono text-[0.75rem] uppercase tracking-wider">{p.ref}</span>
              </p>
            </div>

            <div className="shrink-0">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-500">
                {p.purpose === "sale" ? "Guide price" : "Rent"}
              </p>
              <p className="font-display text-4xl font-light text-bone-50 md:text-5xl">
                {priceLabel(p)}
              </p>
              {p.purpose === "sale" && (
                <p className="mt-1 text-[0.8125rem] text-bone-100/45">
                  ≈ {Math.round(p.price / p.size).toLocaleString("en-US")} {p.currency} per m²
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Gallery ═══════════ */}
      <section className="relative -mt-28 bg-bone-50 pb-4">
        <div className="shell">
          <Gallery images={p.images} title={p.title} />
        </div>
      </section>

      {/* ═══════════ Detail ═══════════ */}
      <section className="bg-bone-50 pb-24 pt-14">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          {/* Left */}
          <div>
            {/* Specs */}
            <Reveal>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-900/10 bg-ink-900/10 sm:grid-cols-3">
                {specs.map((s) => (
                  <div key={s.label} className="bg-white p-5">
                    <s.icon className="size-4 text-gold-600" strokeWidth={1.5} />
                    <p className="mt-3 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink-300">
                      {s.label}
                    </p>
                    <p className="mt-1 text-[0.9375rem] font-semibold text-ink-900">{s.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Description */}
            <Reveal delay={80} className="mt-14">
              <p className="eyebrow">The property</p>
              <h2 className="display-md mt-5 text-balance text-ink-900">{p.summary}</h2>
              <div className="mt-7 space-y-5">
                {p.description.map((para) => (
                  <p key={para.slice(0, 40)} className="text-[0.975rem] leading-relaxed text-ink-500">
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>

            {/* Features */}
            <Reveal delay={80} className="mt-14">
              <p className="eyebrow">Specification</p>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 border-b border-ink-900/8 pb-3 text-[0.9375rem] text-ink-600"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-600" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Payment plan */}
            {p.paymentPlan && (
              <Reveal delay={80} className="mt-14">
                <div className="rounded-2xl border border-gold-500/35 bg-gold-500/8 p-7">
                  <p className="eyebrow">Payment structure</p>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <p className="font-display text-3xl text-ink-900">
                        {p.paymentPlan.downPayment}
                      </p>
                      <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                        Down payment
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-3xl text-ink-900">{p.paymentPlan.years} yrs</p>
                      <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                        Instalment term
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-3xl text-ink-900">0%</p>
                      <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                        Interest
                      </p>
                    </div>
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-ink-500">
                    {p.paymentPlan.note}. We will model the full schedule against your cash flow
                    before you commit, including handover and maintenance deposits.
                  </p>
                </div>
              </Reveal>
            )}

            {/* Area */}
            {area && (
              <Reveal delay={80} className="mt-14">
                <p className="eyebrow">The location</p>
                <Link
                  href={`/destinations/${area.slug}`}
                  className="group mt-6 block overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={area.image}
                      alt={area.name}
                      fill
                      sizes="(min-width:1024px) 60vw, 92vw"
                      className="img-zoom object-cover"
                    />
                    <div className="scrim-b absolute inset-0" />
                    <div className="absolute inset-x-6 bottom-5">
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-400">
                        {area.regionLabel}
                      </p>
                      <p className="display-md mt-1 text-bone-50">{area.name}</p>
                      <p className="mt-2 max-w-lg text-sm leading-relaxed text-bone-100/70">
                        {area.blurb}
                      </p>
                    </div>
                  </div>
                </Link>

                {p.coordinates && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-ink-900/10">
                    <iframe
                      title={`Map of ${p.address}`}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                        p.coordinates.lng - 0.02
                      }%2C${p.coordinates.lat - 0.014}%2C${p.coordinates.lng + 0.02}%2C${
                        p.coordinates.lat + 0.014
                      }&layer=mapnik&marker=${p.coordinates.lat}%2C${p.coordinates.lng}`}
                      className="h-72 w-full"
                      loading="lazy"
                    />
                  </div>
                )}
              </Reveal>
            )}
          </div>

          {/* Right — sticky */}
          <aside>
            <div className="sticky top-28 space-y-4">
              {/* Agent */}
              <div className="rounded-2xl border border-ink-900/10 bg-white p-6">
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ink-300">
                  Your adviser for this property
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-bone-200">
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="display-sm text-ink-900">{agent.name}</p>
                    <p className="mt-0.5 text-[0.8125rem] text-ink-400">{agent.role}</p>
                  </div>
                </div>

                <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-500">
                  {agent.specialty}. Speaks {agent.languages.join(", ")}.
                </p>

                <div className="mt-5 flex flex-col gap-2">
                  <a href={`tel:${agent.phone.replace(/\s/g, "")}`} className="btn btn-ink btn-sm">
                    <Phone className="size-3.5" strokeWidth={2} />
                    {agent.phone}
                  </a>
                  <a
                    href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
                      `Hello — I'm interested in ${p.ref}, ${p.title}.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    Message on WhatsApp
                  </a>
                </div>
              </div>

              {/* Enquiry */}
              <div className="rounded-2xl border border-ink-900/10 bg-white p-6">
                <p className="display-sm text-ink-900">Enquire about {p.ref}</p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-400">
                  Floor plans, service charge history and the title file are available on request.
                </p>
                <div className="mt-6">
                  <LeadForm compact subject={`${p.ref} — ${p.title}`} />
                </div>
              </div>

              {/* Assurance */}
              <div className="rounded-2xl border border-ink-900/10 bg-bone-100 p-6">
                <ShieldCheck className="size-5 text-gold-600" strokeWidth={1.5} />
                <p className="mt-3 text-[0.875rem] font-semibold text-ink-900">
                  Verified before it was published
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-500">
                  Title checked, ownership confirmed and service charges reviewed. Every purchase
                  we handle is registered to a validated green contract.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ═══════════ Similar ═══════════ */}
      {similar.length > 0 && (
        <section className="section bg-bone-100">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">You may also consider</p>
                <h2 className="display-lg mt-6 text-balance text-ink-900">
                  Comparable to this one.
                </h2>
              </div>
              <Link href="/properties" className="btn btn-outline btn-sm">
                <ArrowLeft className="size-4" strokeWidth={2} />
                Back to the catalogue
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {similar.map((s, i) => (
                <Reveal key={s.slug} delay={i * 110}>
                  <PropertyCard property={s} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />
    </>
  );
}
