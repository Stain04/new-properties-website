import { Globe2, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/site/PageHero";
import Counter from "@/components/ui/Counter";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import { advantages, developers, process, stats } from "@/data/content";
import { site } from "@/data/site";
import { team } from "@/data/team";
import { photos } from "@/lib/images";

export const metadata: Metadata = {
  title: "About the firm",
  description:
    "New Properties is a private client real estate advisory covering New Cairo, TMG Group developments and the New Administrative Capital since 2009. Meet the team and see how we work.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="The firm"
        title="We were built around the buyer, not the developer."
        lede={`A private client property advisory working across Egypt's two serious markets since ${site.established}.`}
        image={photos.aboutWide}
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Story */}
      <section className="section bg-bone-50">
        <div className="shell grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">The story</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">
              It started because someone got badly advised.
            </h2>
            <div className="mt-8 space-y-5 text-[0.975rem] leading-relaxed text-ink-500">
              <p>
                In 2008 our founder&rsquo;s family bought an apartment in Hurghada through a
                well-reviewed agency. The contract was never registered. It took four years, two
                lawyers and a court case to convert it into a title anyone would lend against.
                Nobody had lied. Nobody had explained, either.
              </p>
              <p>
                New Properties opened the following year with one rule that has not changed
                since: the client hears the whole picture, including the parts that cost us the
                commission. We turn down instructions we cannot defend, and we tell buyers to
                wait when waiting is right.
              </p>
              <p>
                Sixteen years later we are a team of ten across two offices, we have advised
                buyers from forty-one countries, and the single largest source of new business is
                still a client sending us someone they know. That is the only metric we have ever
                really optimised for.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/services" className="btn btn-ink btn-sm">
                How we work
              </Link>
              <Link href="/properties" className="btn btn-outline btn-sm">
                See the catalogue
              </Link>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={photos.consultation}
                alt="An advisory meeting at New Properties"
                fill
                sizes="(min-width:1024px) 40vw, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink-950 py-20 md:py-24">
        <div className="shell grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="border-t border-bone-100/15 pt-6">
              <p className="font-display text-5xl font-light text-gold-400">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-4 text-sm font-semibold text-bone-50">{s.label}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-bone-100/45">{s.note}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="section bg-bone-100">
        <div className="shell">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow">Principles</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">
              Five commitments we actually hold ourselves to.
            </h2>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-900/10 bg-ink-900/10 md:grid-cols-2 lg:grid-cols-3">
            {advantages.map((a, i) => (
              <Reveal key={a.number} delay={(i % 3) * 90}>
                <div className="flex h-full flex-col bg-bone-50 p-8">
                  <span className="index-num">{a.number}</span>
                  <h3 className="display-sm mt-5 text-ink-900">{a.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-500">{a.body}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={180}>
              <div className="flex h-full flex-col justify-center bg-ink-950 p-8">
                <p className="display-sm text-bone-50">
                  Ask us to put any of this in writing before you instruct us.
                </p>
                <Link href="/contact" className="btn btn-gold btn-sm mt-6 self-start">
                  Get in touch
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-bone-50">
        <div className="shell">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">The process</p>
              <h2 className="display-lg mt-6 text-balance text-ink-900">
                From first conversation to registered title.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-500">
              Typically eight to fourteen weeks on a resale purchase. Longer if you are buying
              off-plan, because the diligence is heavier and should be.
            </p>
          </Reveal>

          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
            {process.map((s, i) => (
              <Reveal key={s.step} delay={(i % 4) * 90} className="border-t border-ink-900/12 pt-5">
                <span className="index-num">{s.step}</span>
                <h3 className="display-sm mt-3 text-ink-900">{s.title}</h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-500">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section bg-bone-100 scroll-mt-24">
        <div className="shell">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow">The team</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">
              Ten people. No call centre.
            </h2>
            <p className="mt-6 text-[0.975rem] leading-relaxed text-ink-500">
              You are assigned one adviser who covers your market and stays with you through
              completion and beyond. Legal, interiors and management sit in the same offices.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.map((m, i) => (
              <Reveal key={m.slug} delay={(i % 4) * 80}>
                <div className="group card-surface overflow-hidden">
                  <div className="relative aspect-[4/5] overflow-hidden bg-bone-200">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(min-width:1280px) 22vw, (min-width:640px) 45vw, 92vw"
                      className="img-zoom object-cover"
                    />
                    <div className="scrim-b absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <a
                          href={`tel:${m.phone.replace(/\s/g, "")}`}
                          aria-label={`Call ${m.name}`}
                          className="grid size-9 place-items-center rounded-full bg-bone-50 text-ink-900 transition-colors hover:bg-gold-500"
                        >
                          <Phone className="size-4" strokeWidth={1.75} />
                        </a>
                        <a
                          href={`mailto:${m.email}`}
                          aria-label={`Email ${m.name}`}
                          className="grid size-9 place-items-center rounded-full bg-bone-50 text-ink-900 transition-colors hover:bg-gold-500"
                        >
                          <Mail className="size-4" strokeWidth={1.75} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="display-sm text-ink-900">{m.name}</h3>
                    <p className="mt-1 text-[0.8125rem] font-semibold text-gold-600">{m.role}</p>
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-400">
                      {m.specialty}
                    </p>
                    <div className="rule my-4" />
                    <p className="flex items-center gap-2 text-[0.75rem] text-ink-400">
                      <Globe2 className="size-3.5 text-gold-600" strokeWidth={1.5} />
                      {m.languages.join(" · ")}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Developers */}
      <section className="bg-ink-950 py-16">
        <div className="shell mb-8 text-center">
          <p className="eyebrow eyebrow-light justify-center before:hidden">
            Developers we transact with
          </p>
        </div>
        <Marquee items={developers} />
      </section>
    </>
  );
}
