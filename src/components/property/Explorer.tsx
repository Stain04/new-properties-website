"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { areas, regions } from "@/data/areas";
import { properties, propertyTypes } from "@/data/properties";
import { toEur } from "@/lib/format";
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

const FEATURE_FILTERS = [
  { key: "sea", label: "Sea view", test: (s: string) => /sea|beach|lagoon|marina/i.test(s) },
  { key: "pool", label: "Pool", test: (s: string) => /pool/i.test(s) },
  { key: "furnished", label: "Furnished", test: (s: string) => /furnish/i.test(s) },
  { key: "garden", label: "Garden or terrace", test: (s: string) => /garden|terrace|roof/i.test(s) },
  { key: "parking", label: "Parking", test: (s: string) => /parking|garage/i.test(s) },
];

const SORTS = [
  { key: "featured", label: "Curated order" },
  { key: "price-asc", label: "Price — low to high" },
  { key: "price-desc", label: "Price — high to low" },
  { key: "size-desc", label: "Largest first" },
];

export default function Explorer({ initial }: { initial: ExplorerInitial }) {
  const router = useRouter();

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
    router.replace(qs ? `/properties?${qs}` : "/properties", { scroll: false });
  }, [purpose, area, type, max, beds, exclusiveOnly, features, sort, router]);

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
      if (ceiling && toEur(p.price, p.currency) > ceiling) return false;

      if (features.length) {
        const haystack = [...p.features, p.view, p.finishing].join(" ");
        const ok = features.every((key) => {
          const f = FEATURE_FILTERS.find((x) => x.key === key);
          return f ? f.test(haystack) : true;
        });
        if (!ok) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    if (sort === "price-asc") {
      sorted.sort((a, b) => toEur(a.price, a.currency) - toEur(b.price, b.currency));
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => toEur(b.price, b.currency) - toEur(a.price, a.currency));
    } else if (sort === "size-desc") {
      sorted.sort((a, b) => b.size - a.size);
    } else {
      sorted.sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          Number(Boolean(b.exclusive)) - Number(Boolean(a.exclusive)),
      );
    }
    return sorted;
  }, [purpose, area, type, max, beds, exclusiveOnly, features, sort]);

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

  const priceCeilings =
    purpose === "rent"
      ? [
          { label: "Any", value: "" },
          { label: "€500 / month", value: "500" },
          { label: "€1,000 / month", value: "1000" },
          { label: "€2,500 / month", value: "2500" },
          { label: "€5,000 / month", value: "5000" },
        ]
      : [
          { label: "Any", value: "" },
          { label: "€75,000", value: "75000" },
          { label: "€150,000", value: "150000" },
          { label: "€350,000", value: "350000" },
          { label: "€750,000", value: "750000" },
          { label: "€1,500,000", value: "1500000" },
        ];

  const filterPanel = (
    <div className="space-y-8">
      {/* Purpose */}
      <div>
        <p className="field-label">Looking to</p>
        <div className="flex gap-1.5">
          {[
            { k: "all", l: "All" },
            { k: "sale", l: "Buy" },
            { k: "rent", l: "Rent" },
          ].map((o) => (
            <button
              key={o.k}
              type="button"
              onClick={() => {
                setPurpose(o.k);
                setMax("");
              }}
              className={`min-h-10 flex-1 rounded-full px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] transition-all duration-400 ${
                purpose === o.k
                  ? "bg-ink-900 text-bone-50"
                  : "bg-bone-100 text-ink-400 hover:text-ink-900"
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
          Destination
        </label>
        <select
          id="fx-area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="field"
        >
          <option value="">All of Egypt</option>
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
          Property type
        </label>
        <select
          id="fx-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="field"
        >
          <option value="">Any type</option>
          {propertyTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Budget */}
      <div>
        <label className="field-label" htmlFor="fx-max">
          Maximum {purpose === "rent" ? "rent" : "price"}
        </label>
        <select id="fx-max" value={max} onChange={(e) => setMax(e.target.value)} className="field">
          {priceCeilings.map((c) => (
            <option key={c.label} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[0.6875rem] leading-relaxed text-ink-300">
          Listings priced in USD and EGP are converted for comparison.
        </p>
      </div>

      {/* Bedrooms */}
      <div>
        <p className="field-label">Bedrooms, minimum</p>
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
              {b === "" ? "Any" : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <p className="field-label">Must have</p>
        <div className="flex flex-wrap gap-1.5">
          {FEATURE_FILTERS.map((f) => {
            const on = features.includes(f.key);
            return (
              <button
                key={f.key}
                type="button"
                onClick={() =>
                  setFeatures((prev) =>
                    on ? prev.filter((x) => x !== f.key) : [...prev, f.key],
                  )
                }
                className={`chip min-h-9 border px-3.5 transition-all duration-300 ${
                  on
                    ? "border-gold-500 bg-gold-500/12 text-gold-700"
                    : "border-ink-900/10 bg-bone-100 text-ink-500 hover:border-ink-900/25"
                }`}
              >
                {f.label}
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
          <span className="block text-sm font-semibold text-ink-900">
            Exclusive instructions only
          </span>
          <span className="mt-0.5 block text-[0.75rem] leading-relaxed text-ink-400">
            Properties we represent solely, not available through other agents.
          </span>
        </span>
      </label>

      {activeCount > 0 && (
        <button type="button" onClick={reset} className="btn btn-outline btn-sm w-full">
          Clear {activeCount} filter{activeCount === 1 ? "" : "s"}
        </button>
      )}
    </div>
  );

  return (
    <div className="shell grid grid-cols-1 gap-10 pb-24 pt-12 lg:grid-cols-[17rem_1fr] lg:gap-14">
      {/* Desktop rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <p className="eyebrow">Refine</p>
          <div className="mt-6">{filterPanel}</div>
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-900/10 pb-5">
          <p className="text-sm text-ink-500">
            <span className="font-display text-2xl text-ink-900">{results.length}</span>{" "}
            {results.length === 1 ? "property" : "properties"}
            {area && <span className="text-ink-300"> · {areas.find((a) => a.slug === area)?.name}</span>}
          </p>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="btn btn-outline btn-sm lg:hidden"
            >
              <SlidersHorizontal className="size-3.5" strokeWidth={2} />
              Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>

            <label className="sr-only" htmlFor="fx-sort">
              Sort results
            </label>
            <select
              id="fx-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="min-h-10 min-w-0 flex-1 rounded-full border border-ink-900/12 bg-white px-4 py-2 text-[0.75rem] sm:flex-none font-semibold text-ink-700 outline-none transition-colors hover:border-ink-900/30 focus:border-gold-500"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-900/15 px-8 py-20 text-center">
            <p className="display-sm text-ink-900">Nothing matches that combination</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-400">
              Our full inventory runs well beyond what is published here. Tell an adviser what
              you are looking for and we will search the off-market stock.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={reset} className="btn btn-outline btn-sm">
                Clear filters
              </button>
              <a href="/contact" className="btn btn-gold btn-sm">
                Send us your brief
              </a>
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

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-bone-50">
            <div className="flex items-center justify-between border-b border-ink-900/10 px-5 py-4">
              <p className="display-sm text-ink-900">Refine</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="grid size-9 place-items-center rounded-full border border-ink-900/15"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{filterPanel}</div>
            <div className="border-t border-ink-900/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="btn btn-ink w-full"
              >
                Show {results.length} {results.length === 1 ? "property" : "properties"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
