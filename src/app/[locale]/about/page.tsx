import { Globe2, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/site/PageHero";
import Counter from "@/components/ui/Counter";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import { isLocale, type Locale } from "@/i18n/config";
import { getContent, getSite, getTeam } from "@/i18n/data";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import Link from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { photos } from "@/lib/images";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).about;
  return pageMetadata(locale, "/about", { title: t.metaTitle, description: t.metaDescription });
}

/* On touch screens there is no hover, so the contact buttons are always shown there. */
const revealOnHover =
  "opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100";

export default async function AboutPage({ params }: { params: Params }) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.about;
  const site = getSite(locale);
  const team = getTeam(locale);
  const { advantages, developers, process, stats } = getContent(locale);

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        lede={fmt(t.lede, { year: site.established })}
        image={photos.aboutWide}
        crumbs={[{ label: dict.common.home, href: "/" }, { label: t.crumb }]}
      />

      {/* Story */}
      <section className="section bg-bone-50">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t.storyEyebrow}</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">{t.storyTitle}</h2>
            <div className="mt-8 space-y-5 text-[0.975rem] leading-relaxed text-ink-500">
              {t.story.map((para) => (
                <p key={para.slice(0, 30)}>{fmt(para, { name: site.name })}</p>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/services" className="btn btn-ink btn-sm">
                {t.howWeWork}
              </Link>
              <Link href="/properties" className="btn btn-outline btn-sm">
                {t.seeCatalogue}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={photos.consultation}
                alt={fmt(t.meetingAlt, { name: site.name })}
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
        <div className="shell grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
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
            <p className="eyebrow">{t.principlesEyebrow}</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">{t.principlesTitle}</h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink-900/10 bg-ink-900/10 md:grid-cols-2 lg:grid-cols-3">
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
                <p className="display-sm text-bone-50">{t.inWriting}</p>
                <Link href="/contact" className="btn btn-gold btn-sm mt-6 self-start">
                  {dict.common.getInTouch}
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
              <p className="eyebrow">{t.processEyebrow}</p>
              <h2 className="display-lg mt-6 text-balance text-ink-900">{t.processTitle}</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-500">{t.processNote}</p>
          </Reveal>

          <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
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
      <section id="team" className="section scroll-mt-24 bg-bone-100">
        <div className="shell">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow">{t.teamEyebrow}</p>
            <h2 className="display-lg mt-6 text-balance text-ink-900">{t.teamTitle}</h2>
            <p className="mt-6 text-[0.975rem] leading-relaxed text-ink-500">{t.teamLede}</p>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                    <div className={`scrim-b absolute inset-0 transition-opacity duration-500 ${revealOnHover}`} />
                    <div className={`absolute inset-x-4 bottom-4 transition-opacity duration-500 ${revealOnHover}`}>
                      <div className="flex gap-2">
                        <a
                          href={`tel:${m.phone.replace(/\s/g, "")}`}
                          aria-label={fmt(t.call, { name: m.name })}
                          className="grid size-10 place-items-center rounded-full bg-bone-50 text-ink-900 transition-colors hover:bg-gold-500"
                        >
                          <Phone className="size-4" strokeWidth={1.75} />
                        </a>
                        <a
                          href={`mailto:${m.email}`}
                          aria-label={fmt(t.emailPerson, { name: m.name })}
                          className="grid size-10 place-items-center rounded-full bg-bone-50 text-ink-900 transition-colors hover:bg-gold-500"
                        >
                          <Mail className="size-4" strokeWidth={1.75} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="display-sm text-ink-900">{m.name}</h3>
                    <p className="mt-1 text-[0.8125rem] font-semibold text-gold-600">{m.role}</p>
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-400">{m.specialty}</p>
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
          <p className="eyebrow eyebrow-light justify-center before:hidden">{t.developersEyebrow}</p>
        </div>
        <Marquee items={developers} />
      </section>
    </>
  );
}
