"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { areas } from "@/data/areas";
import { propertyTypes } from "@/data/properties";

const saleCeilings = [
  { label: "No maximum", value: "" },
  { label: "Up to €75,000", value: "75000" },
  { label: "Up to €150,000", value: "150000" },
  { label: "Up to €350,000", value: "350000" },
  { label: "Up to €750,000", value: "750000" },
];

const rentCeilings = [
  { label: "No maximum", value: "" },
  { label: "Up to €500 / month", value: "500" },
  { label: "Up to €1,000 / month", value: "1000" },
  { label: "Up to €2,500 / month", value: "2500" },
  { label: "Up to €5,000 / month", value: "5000" },
];

export default function SearchBar({ tone = "glass" }: { tone?: "glass" | "solid" }) {
  const router = useRouter();
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
    router.push(`/properties?${params.toString()}`);
  }

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
  const divider = glass ? "md:border-l md:border-white/15" : "md:border-l md:border-ink-900/10";

  const ceilings = purpose === "sale" ? saleCeilings : rentCeilings;

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
            className={`rounded-full px-5 py-2.5 text-[0.6875rem] lg:px-4 lg:py-1.5 font-semibold uppercase tracking-[0.16em] transition-all duration-400 ${
              purpose === p
                ? "bg-gold-500 text-ink-950"
                : glass
                  ? "text-bone-100/65 hover:text-bone-50"
                  : "text-ink-400 hover:text-ink-900"
            }`}
          >
            {p === "sale" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-stretch sm:grid-cols-2 md:grid-cols-[1.15fr_1fr_1.15fr_auto]">
        <div className="px-4 py-3">
          <label className={label} htmlFor="sb-area">
            Destination
          </label>
          <select
            id="sb-area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={`${select} mt-1.5`}
          >
            <option value="">All of Egypt</option>
            {areas.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className={`px-4 py-3 ${divider}`}>
          <label className={label} htmlFor="sb-type">
            Property type
          </label>
          <select
            id="sb-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={`${select} mt-1.5`}
          >
            <option value="">Any type</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className={`px-4 py-3 ${divider}`}>
          <label className={label} htmlFor="sb-max">
            Budget
          </label>
          <select
            id="sb-max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className={`${select} mt-1.5`}
          >
            {ceilings.map((c) => (
              <option key={c.label} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-1.5">
          <button type="submit" className="btn btn-gold h-full w-full md:px-7">
            <Search className="size-4" strokeWidth={2} />
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
