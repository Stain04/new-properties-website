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
import { notFound } from "next/navigation";
import LeadForm from "@/components/forms/LeadForm";
import Gallery from "@/components/property/Gallery";
import PropertyCard from "@/components/property/PropertyCard";
import Reveal from "@/components/ui/Reveal";
import { isLocale, type Locale } from "@/i18n/config";
import { getAgent, getArea, getProperty, getSimilar, getSite } from "@/i18n/data";
import { getDictionary } from "@/i18n/dictionaries";
import { currencyLabel, fmt, formatArea, num } from "@/i18n/format";
import Link from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { getListings } from "@/lib/listings/store";

type Params = Promise<{ locale: string; slug: string }>;

// Listings added in the admin after the build are rendered on first request.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getListings()).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const p = await getProperty(locale, slug);
  if (!p) return { title: getDictionary(locale).property.notFound };
  return pageMetadata(locale, `/properties/${slug}`, {
    title: `${p.title} — ${p.priceText}`,
    description: p.summary,
    // The generated card: cover photo, title, price and specs.
    image: `/${locale}/properties/${slug}/opengraph-image`,
  });
}

export default async function PropertyPage({ params }: { params: Params }) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const p = await getProperty(locale, slug);
  if (!p) notFound();

  const dict = getDictionary(locale);
  const t = dict.property;
  const site = getSite(locale);
  const area = getArea(locale, p.areaSlug);
  const agent = getAgent(locale, p.agentSlug);
  const similar = await getSimilar(locale, p.slug, 3);
  const listSep = locale === "ar" ? "، " : ", ";

  const specs = [
    p.bedrooms > 0 && { icon: BedDouble, label: t.specs.bedrooms, value: String(p.bedrooms) },
    { icon: Bath, label: t.specs.bathrooms, value: String(p.bathrooms) },
    { icon: Maximize2, label: t.specs.area, value: formatArea(locale, p.size) },
    p.plotSize && { icon: LandPlot, label: t.specs.plot, value: formatArea(locale, p.plotSize) },
    p.floor && { icon: Layers, label: t.specs.floor, value: p.floor },
    { icon: Hammer, label: t.specs.finishing, value: p.finishingLabel },
    { icon: Compass, label: t.specs.aspect, value: p.view },
    p.deliveryYear && {
      icon: CalendarDays,
      label: p.deliveryYear > new Date().getFullYear() ? t.specs.delivery : t.specs.delivered,
      value: String(p.deliveryYear),
    },
    { icon: Building2, label: t.specs.type, value: p.typeLabel },
  ].filter(Boolean) as { icon: typeof BedDouble; label: string; value: string }[];

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.summary,
    inLanguage: locale,
    url: `${site.meta.url}${locale === "ar" ? "/ar" : ""}/properties/${p.slug}`,
    image: p.images.slice(0, 4),
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.currency,
      availability: p.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    address: { "@type": "PostalAddress", addressLocality: p.address, addressCountry: "EG" },
  };

  return (
    <>
      {/* ═══════════ Header band ═══════════ */}
      <section className="relative bg-ink-950 pb-36 pt-36 md:pb-40">
        <Image src={p.images[1] ?? p.images[0]} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/80 to-ink-950" />

        <div className="shell relative">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-bone-100/45">
              <li>
                <Link href="/" className="inline-block py-2 transition-colors hover:text-gold-400">
                  {dict.common.home}
                </Link>
              </li>
              <li className="text-bone-100/25">/</li>
              <li>
                <Link href="/properties" className="inline-block py-2 transition-colors hover:text-gold-400">
                  {dict.nav.properties}
                </Link>
              </li>
              <li className="text-bone-100/25">/</li>
              <li>
                <Link
                  href={`/destinations/${p.areaSlug}`}
                  className="inline-block py-2 transition-colors hover:text-gold-400"
                >
                  {p.areaName}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap gap-1.5">
                <span className="chip chip-gold">{p.purpose === "sale" ? t.forSale : t.toLet}</span>
                {p.exclusive && (
                  <span className="chip border border-gold-500/50 bg-transparent text-gold-400">{t.exclusive}</span>
                )}
                {p.status === "reserved" && <span className="chip bg-bone-50/15 text-bone-50">{t.reserved}</span>}
                <span className="chip chip-glass">{p.typeLabel}</span>
              </div>

              <h1 className="display-lg text-balance text-bone-50">{p.title}</h1>

              <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-bone-100/60">
                <MapPin className="size-4 text-gold-500" strokeWidth={1.5} />
                {p.address}
                <span className="text-bone-100/25">·</span>
                <span dir="ltr" className="font-mono text-[0.75rem] uppercase tracking-wider">
                  {p.ref}
                </span>
              </p>
            </div>

            <div className="shrink-0">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-500">
                {p.purpose === "sale" ? t.guidePrice : t.rent}
              </p>
              <p className="font-display text-4xl font-light text-bone-50 md:text-5xl">{p.priceText}</p>
              {p.purpose === "sale" && (
                <p className="mt-1 text-[0.8125rem] text-bone-100/45">
                  {fmt(t.perSqm, {
                    value: num(Math.round(p.price / p.size)),
                    currency: currencyLabel(locale, p.currency),
                  })}
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
          {/* Main column */}
          <div>
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

            <Reveal delay={80} className="mt-14">
              <p className="eyebrow">{t.theProperty}</p>
              <h2 className="display-md mt-5 text-balance text-ink-900">{p.summary}</h2>
              <div className="mt-7 space-y-5">
                {p.description.map((para) => (
                  <p key={para.slice(0, 40)} className="text-[0.975rem] leading-relaxed text-ink-500">
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={80} className="mt-14">
              <p className="eyebrow">{t.specification}</p>
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

            {p.paymentPlan && (
              <Reveal delay={80} className="mt-14">
                <div className="rounded-2xl border border-gold-500/35 bg-gold-500/8 p-7">
                  <p className="eyebrow">{t.payment}</p>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <p className="font-display text-3xl text-ink-900">{p.paymentPlan.downPayment}</p>
                      <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                        {t.downPayment}
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-3xl text-ink-900">{fmt(t.years, { n: p.paymentPlan.years })}</p>
                      <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                        {t.term}
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-3xl text-ink-900">0%</p>
                      <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                        {t.interest}
                      </p>
                    </div>
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-ink-500">
                    {p.paymentPlan.note}. {t.paymentNote}
                  </p>
                </div>
              </Reveal>
            )}

            {area && (
              <Reveal delay={80} className="mt-14">
                <p className="eyebrow">{t.location}</p>
                <Link href={`/destinations/${area.slug}`} className="group mt-6 block overflow-hidden rounded-2xl">
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
                      <p className="mt-2 max-w-lg text-sm leading-relaxed text-bone-100/70">{area.blurb}</p>
                    </div>
                  </div>
                </Link>

                {p.coordinates && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-ink-900/10">
                    <iframe
                      title={fmt(t.mapTitle, { place: p.address })}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${p.coordinates.lng - 0.02}%2C${
                        p.coordinates.lat - 0.014
                      }%2C${p.coordinates.lng + 0.02}%2C${p.coordinates.lat + 0.014}&layer=mapnik&marker=${
                        p.coordinates.lat
                      }%2C${p.coordinates.lng}`}
                      className="h-72 w-full"
                      loading="lazy"
                    />
                  </div>
                )}
              </Reveal>
            )}
          </div>

          {/* Side column — sticky */}
          <aside>
            <div className="sticky top-28 space-y-4">
              <div className="rounded-2xl border border-ink-900/10 bg-white p-6">
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ink-300">{t.adviser}</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-bone-200">
                    <Image src={agent.image} alt={agent.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="display-sm text-ink-900">{agent.name}</p>
                    <p className="mt-0.5 text-[0.8125rem] text-ink-400">{agent.role}</p>
                  </div>
                </div>

                <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-500">
                  {agent.specialty}. {fmt(t.speaks, { languages: agent.languages.join(listSep) })}
                </p>

                <div className="mt-5 flex flex-col gap-2">
                  <a href={`tel:${agent.phone.replace(/\s/g, "")}`} className="btn btn-ink btn-sm">
                    <Phone className="size-3.5" strokeWidth={2} />
                    <span dir="ltr">{agent.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
                      fmt(t.whatsappText, { ref: p.ref, title: p.title }),
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    {t.whatsapp}
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-ink-900/10 bg-white p-6">
                <p className="display-sm text-ink-900">{fmt(t.enquire, { ref: p.ref })}</p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-400">{t.enquireNote}</p>
                <div className="mt-6">
                  <LeadForm compact subject={`${p.ref} — ${p.title}`} />
                </div>
              </div>

              <div className="rounded-2xl border border-ink-900/10 bg-bone-100 p-6">
                <ShieldCheck className="size-5 text-gold-600" strokeWidth={1.5} />
                <p className="mt-3 text-[0.875rem] font-semibold text-ink-900">{t.verifiedTitle}</p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-500">{t.verifiedBody}</p>
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
                <p className="eyebrow">{t.similarEyebrow}</p>
                <h2 className="display-lg mt-6 text-balance text-ink-900">{t.similarTitle}</h2>
              </div>
              <Link href="/properties" className="btn btn-outline btn-sm">
                <ArrowLeft className="size-4 rtl:-scale-x-100" strokeWidth={2} />
                {t.back}
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }} />
    </>
  );
}
