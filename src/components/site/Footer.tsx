import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { footerNav, site } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-bone-100">
      <div className="shell pb-10 pt-20 md:pt-28">
        {/* Masthead */}
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1.6fr]">
          <div>
            <p className="eyebrow eyebrow-light">{site.descriptor}</p>
            <p className="display-lg mt-6 text-bone-50">
              {site.nameLine1} <span className="text-gold-500">{site.nameLine2}</span>
            </p>
            <p className="mt-5 max-w-md text-[0.875rem] font-semibold leading-relaxed tracking-wide text-gold-400">
              {site.positioning}
            </p>
            <p className="lede lede-light mt-4 max-w-md">
              Advising private buyers, investors and families since {site.established}.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href={`tel:${site.contact.phoneHref}`} className="btn btn-gold btn-sm">
                <Phone className="size-3.5" strokeWidth={2} />
                {site.contact.phoneDisplay}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="btn btn-outline-light btn-sm"
              >
                <Mail className="size-3.5" strokeWidth={2} />
                Email us
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((col) => (
              <div key={col.title}>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-gold-500">
                  {col.title}
                </p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="link-sweep text-sm text-bone-100/65 transition-colors duration-300 hover:text-bone-50"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Offices */}
        <div className="rule-light my-14" />

        <div className="grid gap-10 md:grid-cols-3">
          {site.offices.map((office) => (
            <div key={office.city}>
              <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-gold-500">
                <MapPin className="size-3.5" strokeWidth={2} />
                {office.label}
              </p>
              <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-bone-100/65">
                {office.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </address>
              <div className="mt-3 space-y-1 text-sm text-bone-100/50">
                {office.hours.map((h) => (
                  <p key={h}>{h}</p>
                ))}
              </div>
              <a
                href={`tel:${office.phone.replace(/\s/g, "")}`}
                className="link-sweep mt-3 inline-block text-sm text-bone-50"
              >
                {office.phone}
              </a>
            </div>
          ))}

          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-gold-500">
              Follow
            </p>
            <ul className="mt-4 space-y-3">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-bone-100/65 transition-colors duration-300 hover:text-bone-50"
                  >
                    {s.label}
                    <ArrowUpRight
                      className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.75}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rule-light my-10" />

        <div className="flex flex-col gap-4 text-xs text-bone-100/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/contact" className="hover:text-bone-100/70">
              Privacy policy
            </Link>
            <Link href="/contact" className="hover:text-bone-100/70">
              Terms of engagement
            </Link>
            <Link href="/properties" className="hover:text-bone-100/70">
              Full catalogue
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
