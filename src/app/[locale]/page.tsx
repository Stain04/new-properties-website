import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import LeadForm from "@/components/forms/LeadForm";
import DestinationsShowcase from "@/components/home/DestinationsShowcase";
import Hero from "@/components/home/Hero";
import Testimonials from "@/components/home/Testimonials";
import PropertyCard from "@/components/property/PropertyCard";
import Accordion from "@/components/ui/Accordion";
import Counter from "@/components/ui/Counter";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import { isLocale, type Locale } from "@/i18n/config";
import { getAreas, getContent, getProperties, getPropertyTypes, getSite } from "@/i18n/data";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import Link from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { photos } from "@/lib/images";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "/", {});
}

export default async function HomePage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const site = getSite(locale);
  const t = getDictionary(locale).home;
  const { advantages, developers, faqGroups, investmentReasons, services, stats, testimonials } =
    getContent(locale);
  const areas = getAreas(locale);
  const all = await getProperties(locale);

  const forSale = all.filter((p) => p.purpose === "sale");
  const sales = [...forSale.filter((p) => p.featured), ...forSale.filter((p) => !p.featured)].slice(0, 6);
  const rentals = all.filter((p) => p.purpose === "rent").slice(0, 3);
  const counts = Object.fromEntries(areas.map((a) => [a.slug, all.filter((p) => p.areaSlug === a.slug).length]));

  const arrow = "size-4 rtl:-scale-x-100";

  return (
    <>
      <Hero
        descriptor={site.descriptor}
        established={site.established}
        positioning={site.positioning}
        searchOptions={{
          areas: areas.map((a) => ({ slug: a.slug, name: a.name })),
          types: await getPropertyTypes(locale),
        }}
      />

      {/* ═══════════ Positioning ═══════════ */}
      <section className="section bg-bone-50">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t.whoEyebrow}</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">{t.whoTitle}</h2>
          </Reveal>

          <Reveal delay={120} className="flex flex-col justify-center">
            <p className="lede text-pretty">{t.whoLede}</p>
            <p className="mt-5 text-[0.975rem] leading-relaxed text-ink-500">
              {fmt(t.whoBody, { year: site.established })}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-ink btn-sm">
                {t.aboutFirm}
              </Link>
              <Link href="/services" className="btn btn-outline btn-sm">
                {t.howWeWork}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ Selected residences ═══════════ */}
      <section className="section-lg bg-bone-100">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{t.selectedEyebrow}</p>
              <h2 className="display-lg mt-6 max-w-2xl text-balance text-ink-900">{t.selectedTitle}</h2>
            </div>
            <Link href="/properties" className="btn btn-outline btn-sm">
              {getDictionary(locale).common.viewAllProperties}
              <ArrowRight className={arrow} strokeWidth={2} />
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

      {/* ═══════════ Developer marquee ═══════════ */}
      <section className="bg-ink-950 py-16">
        <div className="shell mb-8 text-center">
          <p className="eyebrow eyebrow-light justify-center before:hidden">{t.developersEyebrow}</p>
        </div>
        <Marquee items={developers} />
        <p className="shell mt-8 text-center text-sm text-bone-100/45">{t.developersNote}</p>
      </section>

      {/* ═══════════ Editorial split ═══════════ */}
      <section className="section-lg bg-bone-50">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={photos.aboutPortrait}
                alt={fmt(t.portraitAlt, { name: site.name })}
                fill
                sizes="(min-width:1024px) 45vw, 92vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -end-4 hidden w-56 rounded-2xl bg-ink-950 p-6 text-bone-50 shadow-[0_30px_70px_-30px_rgba(5,8,11,0.6)] md:block">
              <p className="font-display text-4xl text-gold-400">94%</p>
              <p className="mt-2 text-[0.75rem] leading-relaxed text-bone-100/60">{t.retention}</p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <p className="eyebrow">{t.whyEyebrow}</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">{t.whyTitle}</h2>

            <div className="mt-10 space-y-8">
              {advantages.map((a) => (
                <div key={a.number} className="flex gap-5 border-t border-ink-900/10 pt-6">
                  <span className="index-num shrink-0 pt-1">{a.number}</span>
                  <div>
                    <h3 className="display-sm text-ink-900">{a.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">{a.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ Destinations ═══════════ */}
      <section className="section-lg bg-bone-100">
        <div className="shell">
          <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{t.destinationsEyebrow}</p>
              <h2 className="display-lg mt-6 max-w-2xl text-balance text-ink-900">{t.destinationsTitle}</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-500">{t.destinationsNote}</p>
          </Reveal>

          <Reveal delay={100}>
            <DestinationsShowcase areas={areas} counts={counts} />
          </Reveal>
        </div>
      </section>

      {/* ═══════════ Stats ═══════════ */}
      <section className="relative overflow-hidden bg-ink-950 py-24 md:py-32">
        <Image src={photos.aboutWide} alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/85 to-ink-950" />

        <div className="shell relative">
          <Reveal className="text-center">
            <p className="eyebrow eyebrow-light justify-center before:hidden">{t.numbersEyebrow}</p>
            <h2 className="display-lg mx-auto mt-6 max-w-3xl text-balance text-bone-50">{t.numbersTitle}</h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 110} className="border-t border-bone-100/15 pt-6">
                <p className="font-display text-5xl font-light text-gold-400 md:text-6xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-4 text-sm font-semibold text-bone-50">{s.label}</p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-bone-100/45">{s.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Services ═══════════ */}
      <section className="section-lg bg-bone-50">
        <div className="shell">
          <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{t.servicesEyebrow}</p>
              <h2 className="display-lg mt-6 max-w-2xl text-balance text-ink-900">{t.servicesTitle}</h2>
            </div>
            <Link href="/services" className="btn btn-outline btn-sm">
              {t.serviceDetail}
              <ArrowRight className={arrow} strokeWidth={2} />
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink-900/10 bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 90}>
                <Link
                  href={`/services#${s.id}`}
                  className="group flex h-full flex-col bg-bone-50 p-8 transition-colors duration-500 hover:bg-white"
                >
                  <div className="flex items-start justify-between">
                    <span className="index-num">{s.number}</span>
                    <ArrowUpRight
                      className="size-4 text-ink-300 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-600 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="display-sm mt-6 text-ink-900 transition-colors duration-300 group-hover:text-gold-600">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-500">{s.blurb}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Investment case ═══════════ */}
      <section className="section-lg bg-ink-950 text-bone-100">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow eyebrow-light">{t.investEyebrow}</p>
            <h2 className="display-lg mt-6 text-balance text-bone-50">{t.investTitle}</h2>
            <p className="lede lede-light mt-7">{t.investLede}</p>
            <Link href="/contact" className="btn btn-gold mt-9">
              {t.investCta}
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <div className="divide-y divide-bone-100/12 border-y border-bone-100/12">
              {investmentReasons.map((r) => (
                <div key={r.number} className="flex gap-6 py-7">
                  <span className="font-display text-sm text-gold-500">{r.number}</span>
                  <div>
                    <h3 className="display-sm text-bone-50">{r.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-bone-100/55">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ Rentals ═══════════ */}
      <section className="section bg-bone-100">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{t.rentalsEyebrow}</p>
              <h2 className="display-lg mt-6 max-w-2xl text-balance text-ink-900">{t.rentalsTitle}</h2>
            </div>
            <Link href="/properties?purpose=rent" className="btn btn-outline btn-sm">
              {t.rentalsAll}
              <ArrowRight className={arrow} strokeWidth={2} />
            </Link>
          </Reveal>

          <p className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-500">{t.rentalsNote}</p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {rentals.map((p, i) => (
              <Reveal key={p.slug} delay={i * 110}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Testimonials ═══════════ */}
      <section className="section-lg bg-bone-50">
        <div className="shell">
          <Reveal className="mb-14">
            <p className="eyebrow">{t.testimonialsEyebrow}</p>
            <h2 className="display-lg mt-6 max-w-2xl text-balance text-ink-900">{t.testimonialsTitle}</h2>
          </Reveal>
          <Reveal delay={100}>
            <Testimonials testimonials={testimonials} />
          </Reveal>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="section-lg bg-bone-100">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t.faqEyebrow}</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">{t.faqTitle}</h2>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-500">{t.faqLede}</p>
            <Link href="/contact" className="btn btn-ink btn-sm mt-8">
              {t.askQuestion}
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <Accordion items={faqGroups[0].items} />
          </Reveal>
        </div>
      </section>

      {/* ═══════════ Closing CTA ═══════════ */}
      <section className="relative overflow-hidden bg-ink-950">
        <Image src={photos.ctaBand} alt="" fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40 rtl:bg-gradient-to-l" />

        <div className="shell relative grid grid-cols-1 gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
          <Reveal className="flex flex-col justify-center">
            <p className="eyebrow eyebrow-light">{t.ctaEyebrow}</p>
            <h2 className="display-lg mt-6 text-balance text-bone-50">{t.ctaTitle}</h2>
            <p className="lede lede-light mt-7 max-w-lg">{t.ctaLede}</p>

            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-bone-100/15 pt-8 sm:grid-cols-2">
              {site.offices.map((o) => (
                <div key={o.city}>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-500">
                    {o.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-bone-100/60">{o.lines[0]}</p>
                  <a
                    href={`tel:${o.phone.replace(/\s/g, "")}`}
                    className="link-sweep inline-block py-2 text-sm text-bone-50"
                  >
                    <span dir="ltr">{o.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="rounded-2xl border border-bone-100/12 bg-ink-900/60 p-6 backdrop-blur-xl md:p-8">
              <p className="display-sm text-bone-50">{t.ctaFormTitle}</p>
              <p className="mt-2 text-sm text-bone-100/55">{t.ctaFormLede}</p>
              <div className="mt-7">
                <LeadForm tone="dark" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
