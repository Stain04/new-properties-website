import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import LeadForm from "@/components/forms/LeadForm";
import PageHero from "@/components/site/PageHero";
import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import { isLocale, type Locale } from "@/i18n/config";
import { getContent, getSite, getTeam } from "@/i18n/data";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { pageMetadata } from "@/i18n/metadata";
import { photos } from "@/lib/images";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).contact;
  return pageMetadata(locale, "/contact", { title: t.metaTitle, description: t.metaDescription });
}

export default async function ContactPage({ params }: { params: Params }) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.contact;
  const site = getSite(locale);
  const leads = getTeam(locale).slice(0, 4);
  const { faqGroups } = getContent(locale);

  const quick = [
    { href: `tel:${site.contact.phoneHref}`, icon: Phone, label: t.callDesk, value: site.contact.phoneDisplay, whatsapp: false },
    {
      href: `https://wa.me/${site.contact.whatsapp}`,
      icon: MessageCircle,
      label: t.whatsapp,
      value: site.contact.whatsappDisplay,
      whatsapp: true,
    },
    { href: `mailto:${site.contact.email}`, icon: Mail, label: t.email, value: site.contact.email, whatsapp: false },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        lede={t.lede}
        image={photos.contactBand}
        crumbs={[{ label: dict.common.home, href: "/" }, { label: t.crumb }]}
      />

      {/* Quick contact */}
      <section className="border-b border-ink-900/10 bg-bone-50 py-10">
        <div className="shell">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink-900/10 bg-ink-900/10 sm:grid-cols-3">
            {quick.map((q) => (
              <a
                key={q.label}
                href={q.href}
                {...(q.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-4 bg-white p-6 transition-colors hover:bg-bone-50"
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full ${
                    q.whatsapp
                      ? "bg-[#25D366] text-white"
                      : "bg-ink-900 text-bone-50 transition-colors group-hover:bg-gold-500 group-hover:text-ink-950"
                  }`}
                >
                  <q.icon className="size-4" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink-300">
                    {q.label}
                  </span>
                  <span dir="ltr" className="mt-1 block truncate text-[0.9375rem] font-semibold text-ink-900 rtl:text-right">
                    {q.value}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + offices */}
      <section className="section bg-bone-50">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t.enquiryEyebrow}</p>
            <h2 className="display-md mt-5 text-balance text-ink-900">{t.enquiryTitle}</h2>
            <div className="mt-9 rounded-2xl border border-ink-900/10 bg-white p-6 md:p-8">
              <LeadForm />
            </div>
          </Reveal>

          <Reveal delay={140}>
            <p className="eyebrow">{t.officesEyebrow}</p>
            <div className="mt-6 space-y-5">
              {site.offices.map((o) => (
                <div key={o.city} className="rounded-2xl border border-ink-900/10 bg-white p-6">
                  <p className="display-sm text-ink-900">{o.city}</p>
                  <p className="mt-1 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold-600">
                    {o.label}
                  </p>

                  <address className="mt-5 flex items-start gap-3 text-[0.875rem] not-italic leading-relaxed text-ink-500">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-gold-600" strokeWidth={1.5} />
                    <span>
                      {o.lines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </span>
                  </address>

                  <div className="mt-3 flex items-start gap-3 text-[0.875rem] leading-relaxed text-ink-500">
                    <Clock className="mt-0.5 size-4 shrink-0 text-gold-600" strokeWidth={1.5} />
                    <span>
                      {o.hours.map((h) => (
                        <span key={h} className="block">
                          {h}
                        </span>
                      ))}
                    </span>
                  </div>

                  <a
                    href={`tel:${o.phone.replace(/\s/g, "")}`}
                    className="mt-2 flex items-center gap-3 py-2 text-[0.875rem] font-semibold text-ink-900 hover:text-gold-600"
                  >
                    <Phone className="size-4 text-gold-600" strokeWidth={1.5} />
                    <span dir="ltr">{o.phone}</span>
                  </a>

                  <div className="mt-5 overflow-hidden rounded-xl border border-ink-900/10">
                    <iframe
                      title={fmt(t.mapTitle, { city: o.city })}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(o.mapBbox)}&layer=mapnik`}
                      className="h-48 w-full"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Direct lines */}
      <section className="section bg-bone-100">
        <div className="shell">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow">{t.directEyebrow}</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">{t.directTitle}</h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leads.map((m, i) => (
              <Reveal key={m.slug} delay={(i % 4) * 90}>
                <div className="card-surface h-full p-6">
                  <div className="relative size-16 overflow-hidden rounded-full bg-bone-200">
                    <Image src={m.image} alt={m.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <h3 className="display-sm mt-5 text-ink-900">{m.name}</h3>
                  <p className="mt-1 text-[0.8125rem] font-semibold text-gold-600">{m.role}</p>
                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-400">{m.specialty}</p>
                  <div className="rule my-4" />
                  <a
                    href={`tel:${m.phone.replace(/\s/g, "")}`}
                    className="block py-2 text-[0.8125rem] font-semibold text-ink-900 hover:text-gold-600"
                  >
                    <span dir="ltr">{m.phone}</span>
                  </a>
                  <a
                    href={`mailto:${m.email}`}
                    className="block truncate py-2 text-[0.8125rem] text-ink-400 hover:text-gold-600"
                  >
                    <span dir="ltr">{m.email}</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-bone-50">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t.faqEyebrow}</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">{t.faqTitle}</h2>
          </Reveal>
          <Reveal delay={120}>
            <Accordion items={faqGroups[2].items} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
