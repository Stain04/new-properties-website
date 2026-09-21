"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { areas } from "@/data/areas";
import { properties } from "@/data/properties";

export default function DestinationsShowcase() {
  const [active, setActive] = useState(0);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
      {/* Preview */}
      <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl bg-ink-900 lg:order-1 lg:block">
        {areas.map((a, i) => (
          <Image
            key={a.slug}
            src={a.image}
            alt={a.name}
            fill
            sizes="(min-width:1024px) 45vw, 92vw"
            className="object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: i === active ? 1 : 0,
              transform: i === active ? "scale(1)" : "scale(1.05)",
            }}
          />
        ))}
        <div className="scrim-b pointer-events-none absolute inset-0" />

        <div className="absolute inset-x-6 bottom-6">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-gold-400">
            {areas[active].regionLabel}
          </p>
          <p className="display-md mt-2 text-bone-50">{areas[active].name}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-bone-100/70">
            {areas[active].tagline}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-bone-100/15 pt-4">
            {areas[active].stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-lg text-bone-50">{s.value}</p>
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-bone-100/50">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <ul className="order-1 lg:order-2">
        {areas.map((a, i) => {
          const count = properties.filter((p) => p.areaSlug === a.slug).length;
          return (
            <li key={a.slug}>
              <Link
                href={`/destinations/${a.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group flex items-center justify-between gap-4 border-b border-ink-900/10 py-4 transition-colors duration-500 lg:gap-6 lg:py-5"
              >
                <div className="flex min-w-0 items-center gap-4 lg:items-baseline">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-ink-900 lg:hidden">
                    <Image src={a.image} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="index-num hidden shrink-0 lg:inline">0{i + 1}</span>
                  <span className="min-w-0">
                    <span
                      className={`display-md block text-balance transition-colors duration-500 max-lg:!text-[1.4rem] ${
                        i === active ? "lg:text-gold-600" : ""
                      } text-ink-900`}
                    >
                      {a.name}
                    </span>
                    <span className="mt-1 block text-[0.8125rem] text-ink-400">
                      {a.regionLabel} · {count} {count === 1 ? "listing" : "listings"}
                    </span>
                  </span>
                </div>
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                    i === active
                      ? "border-ink-900/15 text-ink-400 lg:border-gold-500 lg:bg-gold-500 lg:text-ink-950"
                      : "border-ink-900/15 text-ink-400"
                  }`}
                >
                  <ArrowUpRight className="size-4" strokeWidth={1.75} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
