import { ArrowUpRight, Bath, BedDouble, Maximize2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { areaName } from "@/data/areas";
import { formatArea, priceLabel } from "@/lib/format";
import type { Property } from "@/lib/types";

export default function PropertyCard({
  property: p,
  priority = false,
  sizes = "(min-width:1280px) 30vw, (min-width:768px) 45vw, 92vw",
}: {
  property: Property;
  priority?: boolean;
  sizes?: string;
}) {
  const unavailable = p.status === "reserved" || p.status === "sold";

  return (
    <Link
      href={`/properties/${p.slug}`}
      className="group card-surface flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
        <Image
          src={p.images[0]}
          alt={p.title}
          fill
          sizes={sizes}
          priority={priority}
          className="img-zoom object-cover"
        />
        <div className="scrim-b pointer-events-none absolute inset-0" />

        {/* Badges */}
        <div className="absolute inset-x-4 top-4 flex flex-wrap items-start gap-1.5">
          {p.exclusive && <span className="chip chip-gold">Exclusive</span>}
          {p.status === "reserved" && (
            <span className="chip bg-ink-950/85 text-bone-50 backdrop-blur-sm">Reserved</span>
          )}
          {p.status === "sold" && (
            <span className="chip bg-ink-950/85 text-bone-50 backdrop-blur-sm">Sold</span>
          )}
          {p.paymentPlan && (
            <span className="chip chip-glass">{p.paymentPlan.years}-year plan</span>
          )}
          <span className="chip chip-glass ml-auto">{p.type}</span>
        </div>

        {/* Price + location */}
        <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-bone-100/70">
              {areaName(p.areaSlug)}
            </p>
            <p
              className={`font-display text-[1.65rem] leading-tight tracking-tight text-bone-50 ${
                unavailable ? "opacity-60" : ""
              }`}
            >
              {priceLabel(p)}
            </p>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-bone-100/30 text-bone-50 transition-all duration-500 group-hover:border-gold-400 group-hover:bg-gold-500 group-hover:text-ink-950">
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="display-sm text-pretty text-ink-900 transition-colors duration-300 group-hover:text-gold-600">
          {p.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-400">{p.summary}</p>

        <div className="mt-auto pt-5">
          <div className="rule" />
          <div className="mt-4 flex items-center justify-between gap-3 text-[0.8125rem] text-ink-500">
            <div className="flex items-center gap-4">
              {p.bedrooms > 0 && (
                <span className="inline-flex items-center gap-1.5" title="Bedrooms">
                  <BedDouble className="size-4 text-gold-600" strokeWidth={1.5} />
                  {p.bedrooms}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5" title="Bathrooms">
                <Bath className="size-4 text-gold-600" strokeWidth={1.5} />
                {p.bathrooms}
              </span>
              <span className="inline-flex items-center gap-1.5" title="Internal area">
                <Maximize2 className="size-4 text-gold-600" strokeWidth={1.5} />
                {formatArea(p.size)}
              </span>
            </div>
            <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-ink-300">
              {p.ref}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
