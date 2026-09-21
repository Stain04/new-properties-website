import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import LeadForm from "@/components/forms/LeadForm";
import PageHero from "@/components/site/PageHero";
import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import { faqGroups } from "@/data/content";
import { site } from "@/data/site";
import { team } from "@/data/team";
import { photos } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact — New Cairo and New Capital offices",
  description:
    "Speak to an adviser about buying, selling, letting or managing property in Egypt. Offices in New Cairo and the New Administrative Capital.",
};

export default function ContactPage() {
  const leads = team.slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Tell us what you are trying to achieve."
        lede="One working day to a reply, from the adviser who covers your market. No fee for the first conversation, and no obligation after it."
        image={photos.contactBand}
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      {/* Quick contact */}
      <section className="border-b border-ink-900/10 bg-bone-50 py-10">
        <div className="shell grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink-900/10 bg-ink-900/10 sm:grid-cols-3">
          <a
            href={`tel:${site.contact.phoneHref}`}
            className="group flex items-center gap-4 bg-white p-6 transition-colors hover:bg-bone-50"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink-900 text-bone-50 transition-colors group-hover:bg-gold-500 group-hover:text-ink-950">
              <Phone className="size-4" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink-300">
                Call the desk
              </span>
              <span className="mt-1 block text-[0.9375rem] font-semibold text-ink-900">
                {site.contact.phoneDisplay}
              </span>
            </span>
          </a>

          <a
            href={`https://wa.me/${site.contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-white p-6 transition-colors hover:bg-bone-50"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
              <MessageCircle className="size-4" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink-300">
                WhatsApp
              </span>
              <span className="mt-1 block text-[0.9375rem] font-semibold text-ink-900">
                {site.contact.whatsappDisplay}
              </span>
            </span>
          </a>

          <a
            href={`mailto:${site.contact.email}`}
            className="group flex items-center gap-4 bg-white p-6 transition-colors hover:bg-bone-50"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink-900 text-bone-50 transition-colors group-hover:bg-gold-500 group-hover:text-ink-950">
              <Mail className="size-4" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink-300">
                Email
              </span>
              <span className="mt-1 block truncate text-[0.9375rem] font-semibold text-ink-900">
                {site.contact.email}
              </span>
            </span>
          </a>
        </div>
      </section>

      {/* Form + offices */}
      <section className="section bg-bone-50">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">Send an enquiry</p>
            <h2 className="display-md mt-5 text-balance text-ink-900">
              The more context you give us, the better the shortlist.
            </h2>
            <div className="mt-9 rounded-2xl border border-ink-900/10 bg-white p-6 md:p-8">
              <LeadForm />
            </div>
          </Reveal>

          <Reveal delay={140}>
            <p className="eyebrow">Our offices</p>
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
                    {o.phone}
                  </a>

                  <div className="mt-5 overflow-hidden rounded-xl border border-ink-900/10">
                    <iframe
                      title={`Map of the ${o.city} office`}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
                        o.mapBbox,
                      )}&layer=mapnik`}
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

      {/* Who you'll speak to */}
      <section className="section bg-bone-100">
        <div className="shell">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow">Direct lines</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">
              Or go straight to the right person.
            </h2>
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
                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-400">
                    {m.specialty}
                  </p>
                  <div className="rule my-4" />
                  <a
                    href={`tel:${m.phone.replace(/\s/g, "")}`}
                    className="block py-2 text-[0.8125rem] font-semibold text-ink-900 hover:text-gold-600"
                  >
                    {m.phone}
                  </a>
                  <a
                    href={`mailto:${m.email}`}
                    className="block truncate py-2 text-[0.8125rem] text-ink-400 hover:text-gold-600"
                  >
                    {m.email}
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
            <p className="eyebrow">Before you write</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">
              Your question may already be here.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <Accordion items={faqGroups[2].items} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
