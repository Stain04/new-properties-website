"use client";

import { Menu, Phone, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { localeNames, localePath, stripLocale, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import Link from "@/i18n/Link";
import Logo from "./Logo";

interface HeaderProps {
  nav: { label: string; href: string }[];
  phone: { phoneDisplay: string; phoneHref: string; email: string };
  tagline: string;
}

/** Link to the same page in the other language, keeping query string and hash. */
function LanguageSwitch({ className = "", onDone }: { className?: string; onDone?: () => void }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const other: Locale = locale === "ar" ? "en" : "ar";
  const target = localePath(other, stripLocale(pathname));

  return (
    <a
      href={target}
      hrefLang={other}
      lang={other}
      aria-label={`${dict.common.switchLanguage}: ${localeNames[other]}`}
      onClick={(e) => {
        e.preventDefault();
        onDone?.();
        router.push(target + window.location.search + window.location.hash);
      }}
      className={className}
    >
      {localeNames[other]}
    </a>
  );
}

export default function Header({ nav, phone, tagline }: HeaderProps) {
  const { dict } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const current = stripLocale(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the overlay menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          solid
            ? "border-b border-ink-900/8 bg-bone-50/85 py-3 backdrop-blur-xl"
            : "border-b border-transparent py-6"
        }`}
      >
        <div className="shell flex items-center justify-between gap-6">
          <Logo light={!solid} tagline={tagline} />

          <nav className="hidden items-center gap-8 lg:flex xl:gap-9">
            {nav.map((item) => {
              const active = current === item.href || current.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`link-sweep text-[0.8125rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 ${
                    solid
                      ? active
                        ? "text-gold-600"
                        : "text-ink-600 hover:text-ink-900"
                      : active
                        ? "text-gold-400"
                        : "text-bone-100/80 hover:text-bone-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href={`tel:${phone.phoneHref}`}
              dir="ltr"
              className={`hidden items-center gap-2 text-[0.8125rem] font-semibold tracking-wide transition-colors duration-500 2xl:inline-flex ${
                solid ? "text-ink-700 hover:text-gold-600" : "text-bone-100/85 hover:text-gold-400"
              }`}
            >
              <Phone className="size-3.5" strokeWidth={1.75} />
              {phone.phoneDisplay}
            </a>

            <LanguageSwitch
              className={`hidden min-h-10 items-center rounded-full border px-4 text-[0.8125rem] font-semibold transition-colors duration-500 sm:inline-flex ${
                solid
                  ? "border-ink-900/15 text-ink-700 hover:border-ink-900 hover:text-ink-900"
                  : "border-bone-100/25 text-bone-50 hover:border-bone-50"
              }`}
            />

            <Link
              href="/contact"
              className={`btn btn-sm hidden md:inline-flex ${solid ? "btn-ink" : "btn-gold"}`}
            >
              {dict.common.bookConsultation}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? dict.common.closeMenu : dict.common.openMenu}
              aria-expanded={menuOpen}
              className={`grid size-10 place-items-center rounded-full border transition-colors duration-500 lg:hidden ${
                solid
                  ? "border-ink-900/15 text-ink-900"
                  : "border-bone-100/25 bg-ink-950/30 text-bone-50 backdrop-blur-md"
              }`}
            >
              {menuOpen ? (
                <X className="size-5" strokeWidth={1.5} />
              ) : (
                <Menu className="size-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 z-40 bg-bone-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="shell flex h-full flex-col justify-between gap-8 overflow-y-auto pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-24">
          <nav className="flex flex-col">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-baseline justify-between border-b border-ink-900/8 py-5"
                style={{
                  transitionDelay: `${menuOpen ? 120 + i * 60 : 0}ms`,
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "none" : "translateY(14px)",
                  transitionProperty: "opacity, transform",
                  transitionDuration: "700ms",
                  transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <span className="display-md text-ink-900 group-hover:text-gold-600">
                  {item.label}
                </span>
                <span className="index-num">0{i + 1}</span>
              </Link>
            ))}
          </nav>

          <div className="space-y-4">
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn btn-gold w-full">
              {dict.common.bookConsultation}
            </Link>
            <LanguageSwitch
              onDone={() => setMenuOpen(false)}
              className="btn btn-outline w-full"
            />
            <div className="flex flex-col text-sm text-ink-500">
              <a href={`tel:${phone.phoneHref}`} className="py-2 hover:text-gold-600">
                <span dir="ltr">{phone.phoneDisplay}</span>
              </a>
              <a href={`mailto:${phone.email}`} className="py-2 hover:text-gold-600">
                <span dir="ltr">{phone.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
