import Image from "next/image";
import Link from "@/i18n/Link";
import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  image: string;
  /** Breadcrumb trail, last item is the current page. */
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  size?: "md" | "lg";
}

export default function PageHero({
  eyebrow,
  title,
  lede,
  image,
  crumbs,
  children,
  size = "md",
}: PageHeroProps) {
  return (
    <section
      className={`relative overflow-hidden bg-ink-950 ${
        size === "lg" ? "min-h-[78svh]" : "min-h-[62svh]"
      }`}
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-90"
      />
      <div className="scrim-full absolute inset-0" />

      <div
        className={`relative flex flex-col justify-end pb-12 pt-32 md:pb-14 md:pt-40 ${
          size === "lg" ? "min-h-[78svh]" : "min-h-[62svh]"
        }`}
      >
        <div className="shell">
          {crumbs && (
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-bone-100/50">
                {crumbs.map((c, i) => (
                  <li key={c.label} className="flex items-center gap-2">
                    {c.href ? (
                      <Link href={c.href} className="inline-block py-2 transition-colors hover:text-gold-400">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-bone-100/80">{c.label}</span>
                    )}
                    {i < crumbs.length - 1 && <span className="text-bone-100/25">/</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <p className="eyebrow eyebrow-light">{eyebrow}</p>
          <h1 className="display-lg mt-6 max-w-4xl text-balance text-bone-50">{title}</h1>
          {lede && <p className="lede lede-light mt-7 max-w-2xl">{lede}</p>}
          {children && <div className="mt-9">{children}</div>}
        </div>
      </div>
    </section>
  );
}
