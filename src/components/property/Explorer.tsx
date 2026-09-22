"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { LocalProperty } from "@/i18n/data";
import { formatPrice } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import Link from "@/i18n/Link";
import type { Area } from "@/lib/types";
import PropertyCard from "./PropertyCard";

export interface ExplorerInitial {
  purpose?: string;
  area?: string;
  type?: string;
  max?: string;
  beds?: string;
  feature?: string;
  exclusive?: string;
  sort?: string;
}

const FEATURE_KEYS = ["sea", "pool", "furnished", "garden", "parking"] as const;
const SORT_KEYS = ["featured", "price-asc", "price-desc", "size-desc"] as const;
const SALE_CEILINGS = [75000, 150000, 350000, 750000, 1500000];
const RENT_CEILINGS = [500, 1000, 2500, 5000];

export default function Explorer({
  initial,
  properties,
  areas,
  regions,
  types,
}: {
  initial: ExplorerInitial;
  /** Listings already translated for the active language. */
  properties: LocalProperty[];
  areas: Area[];
  regions: { key: string; label: string }[];
  types: { value: string; label: string }[];
}) {
  const router = useRouter();
  const { locale, dict, fmt, plural, href } = useI18n();
  const t = dict.explorer;

  const [purpose, setPurpose] = useState(initial.purpose ?? "all");
  const [area, setArea] = useState(initial.area ?? "");
  const [type, setType] = useState(initial.type ?? "");
  const [max, setMax] = useState(initial.max ?? "");
  const [beds, setBeds] = useState(initial.beds ?? "");
  const [exclusiveOnly, setExclusiveOnly] = useState(initial.exclusive === "1");
  const [features, setFeatures] = useState<string[]>(
    initial.feature ? initial.feature.split(",").filter(Boolean) : [],
  );
  const [sort, setSort] = useState(initial.sort ?? "featured");
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* Keep the URL in step so results can be shared and bookmarked. */
  useEffect(() => {
    const params = new URLSearchParams();
    if (purpose !== "all") params.set("purpose", purpose);
    if (area) params.set("area", area);
    if (type) params.set("type", type);
    if (max) params.set("max", max);
    if (beds) params.set("beds", beds);
    if (exclusiveOnly) params.set("exclusive", "1");
    if (features.length) params.set("feature", features.join(","));
    if (sort !== "featured") params.set("sort", sort);
    const qs = params.toString();
    const base = href("/properties");
    router.replace(qs ? `${base}?${qs}` : base, { scroll: false });
  }, [purpose, area, type, max, beds, exclusiveOnly, features, sort, router, href]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const results = useMemo(() => {
    const ceiling = max ? Number(max) : null;
    const minBeds = beds ? Number(beds) : null;

    const filtered = properties.filter((p) => {
      if (purpose !== "all" && p.purpose !== purpose) return false;
      if (area && p.areaSlug !== area) return false;
      if (type && p.type !== type) return false;
      if (minBeds && p.bedrooms < minBeds) return false;
      if (exclusiveOnly && !p.exclusive) return false;
      if (ceiling && p.eurValue > ceiling) return false;
      if (features.some((k) => !p.featureKeys.includes(k))) return false;
      return true;
    });

    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.eurValue - b.eurValue);
    else if (sort === "price-desc") sorted.sort((a, b) => b.eurValue - a.eurValue);
    else if (sort === "size-desc") sorted.sort((a, b) => b.size - a.size);
    else
      sorted.sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          Number(Boolean(b.exclusive)) - Number(Boolean(a.exclusive)),
      );
    return sorted;
  }, [properties, purpose, area, type, max, beds, exclusiveOnly, features, sort]);

  const activeCount =
    (purpose !== "all" ? 1 : 0) +
    (area ? 1 : 0) +
    (type ? 1 : 0) +
    (max ? 1 : 0) +
    (beds ? 1 : 0) +
    (exclusiveOnly ? 1 : 0) +
    features.length;

  function reset() {
    setPurpose("all");
    setArea("");
    setType("");
    setMax("");
    setBeds("");
    setExclusiveOnly(false);
    setFeatures([]);
    setSort("featured");
  }

  const priceCeilings = (purpose === "rent" ? RENT_CEILINGS : SALE_CEILINGS).map((v) => {
    const amount = formatPrice(locale, v, "EUR");
    return { value: String(v), label: purpose === "rent" ? fmt(t.perMonth, { amount }) : amount };
  });

  const filterPanel = (
    <div className="space-y-8">
      {/* Purpose */}
      <div>
        <p className="field-label">{t.lookingTo}</p>
        <div className="flex gap-1.5">
          {[
            { k: "all", l: t.all },
            { k: "sale", l: t.buy },
            { k: "rent", l: t.rent },
          ].map((o) => (
            <button
              key={o.k}
              type="button"
              onClick={() => {
                setPurpose(o.k);
                setMax("");
              }}
              className={`min-h-10 flex-1 rounded-full px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] transition-all duration-400 ${
                purpose === o.k ? "bg-ink-900 text-bone-50" : "bg-bone-100 text-ink-400 hover:text-ink-900"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* Destination */}
      <div>
        <label className="field-label" htmlFor="fx-area">
          {t.destination}
        </label>
        <select id="fx-area" value={area} onChange={(e) => setArea(e.target.value)} className="field">
          <option value="">{t.allEgypt}</option>
          {regions.map((r) => (
            <optgroup key={r.key} label={r.label}>
              {areas
                .filter((a) => a.region === r.key)
                .map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Type */}
      <div>
        <label className="field-label" htmlFor="fx-type">
          {t.type}
        </label>
        <select id="fx-type" value={type} onChange={(e) => setType(e.target.value)} className="field">
          <option value="">{t.anyType}</option>
          {types.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Budget */}
      <div>
        <label className="field-label" htmlFor="fx-max">
          {purpose === "rent" ? t.maxRent : t.maxPrice}
        </label>
        <select id="fx-max" value={max} onChange={(e) => setMax(e.target.value)} className="field">
          <option value="">{t.any}</option>
          {priceCeilings.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[0.6875rem] leading-relaxed text-ink-300">{t.converted}</p>
      </div>

      {/* Bedrooms */}
      <div>
        <p className="field-label">{t.bedsMin}</p>
        <div className="flex gap-1.5">
          {["", "1", "2", "3", "4"].map((b) => (
            <button
              key={b || "any"}
              type="button"
              onClick={() => setBeds(b)}
              className={`min-h-10 flex-1 rounded-lg border px-2 py-2 text-[0.75rem] font-semibold transition-all duration-300 ${
                beds === b
                  ? "border-gold-500 bg-gold-500/12 text-gold-700"
                  : "border-ink-900/12 text-ink-400 hover:border-ink-900/30"
              }`}
            >
              {b === "" ? t.all : <span dir="ltr">{b}+</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <p className="field-label">{t.mustHave}</p>
        <div className="flex flex-wrap gap-1.5">
          {FEATURE_KEYS.map((key) => {
            const on = features.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFeatures((prev) => (on ? prev.filter((x) => x !== key) : [...prev, key]))}
                className={`chip min-h-9 border px-3.5 transition-all duration-300 ${
                  on
                    ? "border-gold-500 bg-gold-500/12 text-gold-700"
                    : "border-ink-900/10 bg-bone-100 text-ink-500 hover:border-ink-900/25"
                }`}
              >
                {t.features[key]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exclusive */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={exclusiveOnly}
          onChange={(e) => setExclusiveOnly(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--color-gold-600)]"
        />
        <span>
          <span className="block text-sm font-semibold text-ink-900">{t.exclusiveOnly}</span>
          <span className="mt-0.5 block text-[0.75rem] leading-relaxed text-ink-400">{t.exclusiveHint}</span>
        </span>
      </label>

      {activeCount > 0 && (
        <button type="button" onClick={reset} className="btn btn-outline btn-sm w-full">
          {plural(activeCount, t.clear)}
        </button>
      )}
    </div>
  );

  return (
    <div className="shell grid grid-cols-1 gap-10 pb-24 pt-12 lg:grid-cols-[17rem_1fr] lg:gap-14">
      {/* Desktop rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <p className="eyebrow">{t.refine}</p>
          <div className="mt-6">{filterPanel}</div>
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-900/10 pb-5">
          <p className="text-sm text-ink-500">
            <span className="font-display text-2xl text-ink-900">
              {plural(results.length, dict.labels.properties)}
            </span>
            {area && <span className="text-ink-300"> · {areas.find((a) => a.slug === area)?.name}</span>}
          </p>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button type="button" onClick={() => setDrawerOpen(true)} className="btn btn-outline btn-sm lg:hidden">
              <SlidersHorizontal className="size-3.5" strokeWidth={2} />
              {t.filters}
              {activeCount > 0 ? ` (${activeCount})` : ""}
            </button>

            <label className="sr-only" htmlFor="fx-sort">
              {t.sortLabel}
            </label>
            <select
              id="fx-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="min-h-10 min-w-0 flex-1 rounded-full border border-ink-900/12 bg-white px-4 py-2 text-[0.75rem] font-semibold text-ink-700 outline-none transition-colors hover:border-ink-900/30 focus:border-gold-500 sm:flex-none"
            >
              {SORT_KEYS.map((k) => (
                <option key={k} value={k}>
                  {t.sorts[k]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-ink-900/15 px-8 py-20 text-center">
            <p className="display-sm text-ink-900">{t.emptyTitle}</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-400">{t.emptyBody}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={reset} className="btn btn-outline btn-sm">
                {t.clearFilters}
              </button>
              <Link href="/contact" className="btn btn-gold btn-sm">
                {t.sendBrief}
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p, i) => (
              <PropertyCard key={p.slug} property={p} priority={i < 3} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile drawer — slides in from the reading edge */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 end-0 flex w-[88%] max-w-sm flex-col bg-bone-50">
            <div className="flex items-center justify-between border-b border-ink-900/10 px-5 py-4">
              <p className="display-sm text-ink-900">{t.refine}</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={t.closeFilters}
                className="grid size-9 place-items-center rounded-full border border-ink-900/15"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{filterPanel}</div>
            <div className="border-t border-ink-900/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button type="button" onClick={() => setDrawerOpen(false)} className="btn btn-ink w-full">
                {plural(results.length, t.show)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
