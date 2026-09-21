"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/data/site";
import Logo from "./Logo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

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
        <div className="shell flex items-center justify-between gap-8">
          <Logo light={!solid} />

          <nav className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
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

          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.contact.phoneHref}`}
              className={`hidden items-center gap-2 text-[0.8125rem] font-semibold tracking-wide transition-colors duration-500 xl:inline-flex ${
                solid ? "text-ink-700 hover:text-gold-600" : "text-bone-100/85 hover:text-gold-400"
              }`}
            >
              <Phone className="size-3.5" strokeWidth={1.75} />
              {site.contact.phoneDisplay}
            </a>

            <Link
              href="/contact"
              className={`btn btn-sm hidden sm:inline-flex ${solid ? "btn-ink" : "btn-gold"}`}
            >
              Book a consultation
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
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
              Book a consultation
            </Link>
            <div className="flex flex-col text-sm text-ink-500">
              <a href={`tel:${site.contact.phoneHref}`} className="py-2 hover:text-gold-600">
                {site.contact.phoneDisplay}
              </a>
              <a href={`mailto:${site.contact.email}`} className="py-2 hover:text-gold-600">
                {site.contact.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
