import { Check } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LeadForm from "@/components/forms/LeadForm";
import PageHero from "@/components/site/PageHero";
import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import { faqGroups, process, services } from "@/data/content";
import { photos } from "@/lib/images";

export const metadata: Metadata = {
  title: "Services — buying, selling, legal, management",
  description:
    "Buying advisory, disposals, in-house conveyancing, property management, interiors and investment structuring across Egypt.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Six mandates, one relationship."
        lede="Search, diligence, contract, registration, furnishing, letting and eventual resale — handled by the same firm and, wherever possible, the same people."
        image={photos.heroVilla}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      {/* Index */}
      <section className="border-b border-ink-900/10 bg-bone-50 py-8">
        <div className="shell flex flex-wrap gap-2">
          {services.map((s) => (
            <Link key={s.id} href={`#${s.id}`} className="chip chip-quiet hover:border-gold-500">
              <span className="text-gold-600">{s.number}</span>
              {s.title}
            </Link>
          ))}
        </div>
      </section>

      {/* Detail blocks */}
      {services.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={`section scroll-mt-24 ${i % 2 === 0 ? "bg-bone-50" : "bg-bone-100"}`}
        >
          <div
            className={`shell grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width:1024px) 45vw, 92vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={120}>
              <span className="index-num">{s.number}</span>
              <h2 className="display-lg mt-4 text-balance text-ink-900">{s.title}</h2>
              <p className="lede mt-6">{s.blurb}</p>

              <div className="mt-6 space-y-4">
                {s.body.map((para) => (
                  <p key={para.slice(0, 40)} className="text-[0.9375rem] leading-relaxed text-ink-500">
                    {para}
                  </p>
                ))}
              </div>

              <ul className="mt-8 space-y-3 border-t border-ink-900/12 pt-6">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[0.9375rem] text-ink-600">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-600" strokeWidth={2} />
                    {d}
                  </li>
                ))}
              </ul>

              <Link href="/contact" className="btn btn-ink btn-sm mt-8">
                Discuss this service
              </Link>
            </Reveal>
          </div>
        </section>
      ))}

      {/* Process */}
      <section className="section bg-ink-950">
        <div className="shell">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow eyebrow-light">The process</p>
            <h2 className="display-lg mt-6 text-balance text-bone-50">
              What actually happens, step by step.
            </h2>
          </Reveal>

          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
            {process.map((s, i) => (
              <Reveal
                key={s.step}
                delay={(i % 4) * 90}
                className="border-t border-bone-100/15 pt-5"
              >
                <span className="font-display text-sm text-gold-500">{s.step}</span>
                <h3 className="display-sm mt-3 text-bone-50">{s.title}</h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-bone-100/50">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-bone-100">
        <div className="shell">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow">Questions</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">
              Everything buyers ask us, answered plainly.
            </h2>
          </Reveal>

          <div className="space-y-14">
            {faqGroups.map((g, i) => (
              <Reveal key={g.title} delay={i * 90}>
                <h3 className="display-sm mb-5 text-gold-600">{g.title}</h3>
                <Accordion items={g.items} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-bone-50">
        <div className="shell-narrow">
          <Reveal className="rounded-2xl border border-ink-900/10 bg-white p-8 md:p-12">
            <p className="eyebrow">Next step</p>
            <h2 className="display-md mt-5 text-balance text-ink-900">
              Instruct us, or just ask a question first.
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-500">
              There is no fee for the first conversation and no obligation after it.
            </p>
            <div className="mt-8">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
