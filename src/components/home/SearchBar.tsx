"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";

export interface SearchOptions {
  areas: { slug: string; name: string }[];
  types: { value: string; label: string }[];
}

const SALE_CEILINGS = [75000, 150000, 350000, 750000];
const RENT_CEILINGS = [500, 1000, 2500, 5000];

export default function SearchBar({
  options,
  tone = "glass",
}: {
  options: SearchOptions;
  tone?: "glass" | "solid";
}) {
  const router = useRouter();
  const { locale, dict, fmt, href } = useI18n();
  const t = dict.search;
  const [purpose, setPurpose] = useState<"sale" | "rent">("sale");
  const [area, setArea] = useState("");
  const [type, setType] = useState("");
  const [max, setMax] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ purpose });
    if (area) params.set("area", area);
    if (type) params.set("type", type);
    if (max) params.set("max", max);
    router.push(`${href("/properties")}?${params.toString()}`);
  }

  const ceilings = (purpose === "sale" ? SALE_CEILINGS : RENT_CEILINGS).map((v) => {
    const amount = formatPrice(locale, v, "EUR");
    return {
      value: String(v),
      label: fmt(t.upTo, { amount: purpose === "rent" ? fmt(t.perMonth, { amount }) : amount }),
    };
  });

  const glass = tone === "glass";
  const shell = glass
    ? "border-white/15 bg-white/10 backdrop-blur-2xl"
    : "border-ink-900/10 bg-white shadow-[0_30px_70px_-40px_rgba(5,8,11,0.45)]";
  const select = glass
    ? "w-full appearance-none bg-transparent py-1.5 text-[0.9375rem] text-bone-50 outline-none lg:py-0 [&>option]:bg-ink-900 [&>option]:text-bone-50"
    : "w-full appearance-none bg-transparent py-1.5 text-[0.9375rem] text-ink-900 outline-none lg:py-0";
  const label = glass
    ? "block text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-bone-100/55"
    : "block text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ink-400";
  const divider = glass ? "md:border-s md:border-white/15" : "md:border-s md:border-ink-900/10";

  return (
    <form onSubmit={submit} className={`rounded-2xl border p-2 ${shell}`}>
      {/* Purpose toggle */}
      <div className="flex gap-1 px-2 pb-2 pt-1">
        {(["sale", "rent"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setPurpose(p);
              setMax("");
            }}
            className={`rounded-full px-5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] transition-all duration-400 lg:px-4 lg:py-1.5 ${
              purpose === p
                ? "bg-gold-500 text-ink-950"
                : glass
                  ? "text-bone-100/65 hover:text-bone-50"
                  : "text-ink-400 hover:text-ink-900"
            }`}
          >
            {p === "sale" ? t.buy : t.rent}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-stretch sm:grid-cols-2 md:grid-cols-[1.15fr_1fr_1.15fr_auto]">
        <div className="px-4 py-3">
          <label className={label} htmlFor="sb-area">
            {t.destination}
          </label>
          <select
            id="sb-area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={`${select} mt-1.5`}
          >
            <option value="">{t.allEgypt}</option>
            {options.areas.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className={`px-4 py-3 ${divider}`}>
          <label className={label} htmlFor="sb-type">
            {t.type}
          </label>
          <select
            id="sb-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={`${select} mt-1.5`}
          >
            <option value="">{t.anyType}</option>
            {options.types.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className={`px-4 py-3 ${divider}`}>
          <label className={label} htmlFor="sb-max">
            {t.budget}
          </label>
          <select
            id="sb-max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className={`${select} mt-1.5`}
          >
            <option value="">{t.noMax}</option>
            {ceilings.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-1.5">
          <button type="submit" className="btn btn-gold h-full w-full md:px-7">
            <Search className="size-4" strokeWidth={2} />
            {t.submit}
          </button>
        </div>
      </div>
    </form>
  );
}
