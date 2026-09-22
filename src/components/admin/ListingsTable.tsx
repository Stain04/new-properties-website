"use client";

import { ExternalLink, Pencil, Search, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { deleteListing, updateFlags } from "@/app/admin/actions";

export interface ListingRow {
  slug: string;
  ref: string;
  title: string;
  titleAr?: string;
  cover: string;
  area: string;
  purpose: "sale" | "rent";
  price: number;
  currency: string;
  period?: "month" | "night";
  status: "available" | "reserved" | "sold";
  featured: boolean;
  hasArabic: boolean;
  updatedAt?: string;
}

const STATUS_STYLE: Record<ListingRow["status"], string> = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  reserved: "bg-amber-50 text-amber-800 border-amber-200",
  sold: "bg-ink-900/5 text-ink-500 border-ink-900/10",
};

export default function ListingsTable({ listings }: { listings: ListingRow[] }) {
  const [rows, setRows] = useState(listings);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "sale" | "rent">("all");
  const [confirming, setConfirming] = useState<ListingRow | null>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === "all" || r.purpose === filter) &&
        (!q || [r.title, r.titleAr ?? "", r.ref, r.area].some((s) => s.toLowerCase().includes(q))),
    );
  }, [rows, query, filter]);

  function flash(tone: "ok" | "error", text: string) {
    setMessage({ tone, text });
    setTimeout(() => setMessage(null), 3500);
  }

  function patch(slug: string, change: Partial<Pick<ListingRow, "featured" | "status">>) {
    const before = rows;
    setRows((r) => r.map((x) => (x.slug === slug ? { ...x, ...change } : x))); // optimistic
    startTransition(async () => {
      const res = await updateFlags(slug, change);
      if (!res.ok) {
        setRows(before);
        flash("error", res.error ?? "Could not save that change.");
      } else flash("ok", "Saved — live on the site.");
    });
  }

  function remove(row: ListingRow) {
    startTransition(async () => {
      const res = await deleteListing(row.slug);
      setConfirming(null);
      if (!res.ok) return flash("error", res.error ?? "Could not delete that listing.");
      setRows((r) => r.filter((x) => x.slug !== row.slug));
      flash("ok", `Deleted “${row.title}”.`);
    });
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, reference or area"
            className="field ps-10"
          />
        </div>
        <div className="flex gap-1 rounded-full border border-ink-900/10 bg-white p-1">
          {(["all", "sale", "rent"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`min-h-9 rounded-full px-4 text-xs font-semibold transition-colors ${
                filter === f ? "bg-ink-900 text-bone-50" : "text-ink-500 hover:text-ink-900"
              }`}
            >
              {f === "all" ? "All" : f === "sale" ? "For sale" : "For rent"}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <p
          role="status"
          className={`mt-4 rounded-xl px-4 py-2.5 text-sm ${
            message.tone === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Rows */}
      <ul className="mt-5 divide-y divide-ink-900/8 overflow-hidden rounded-2xl border border-ink-900/10 bg-white">
        {visible.length === 0 && (
          <li className="px-6 py-14 text-center text-sm text-ink-400">
            {rows.length === 0 ? "No listings yet — add your first one." : "Nothing matches that search."}
          </li>
        )}

        {visible.map((r) => (
          <li key={r.slug} className="flex flex-wrap items-center gap-4 px-4 py-3.5 sm:flex-nowrap">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-bone-200">
              <Image src={r.cover} alt="" fill sizes="96px" className="object-cover" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink-900">{r.title}</p>
              <p className="mt-0.5 truncate text-xs text-ink-400">
                <span className="font-mono">{r.ref}</span> · {r.area} · {r.purpose === "sale" ? "For sale" : "For rent"} ·{" "}
                {r.currency} {r.price.toLocaleString("en-US")}
                {r.purpose === "rent" ? ` / ${r.period ?? "month"}` : ""}
              </p>
              {!r.hasArabic && (
                <p className="mt-1 text-xs text-amber-700">No Arabic yet — the Arabic site shows the English text.</p>
              )}
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button
                type="button"
                onClick={() => patch(r.slug, { featured: !r.featured })}
                aria-label={r.featured ? "Remove from homepage" : "Feature on homepage"}
                title={r.featured ? "Featured on the homepage — click to remove" : "Feature on the homepage"}
                className={`grid size-10 place-items-center rounded-full border transition-colors ${
                  r.featured ? "border-gold-500 bg-gold-500/15 text-gold-700" : "border-ink-900/10 text-ink-300 hover:text-gold-600"
                }`}
              >
                <Star className="size-4" fill={r.featured ? "currentColor" : "none"} />
              </button>

              <select
                value={r.status}
                onChange={(e) => patch(r.slug, { status: e.target.value as ListingRow["status"] })}
                aria-label="Availability"
                className={`min-h-10 rounded-full border px-3 text-xs font-semibold ${STATUS_STYLE[r.status]}`}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>

              <a
                href={`/properties/${r.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open on the website"
                className="grid size-10 place-items-center rounded-full border border-ink-900/10 text-ink-400 hover:text-ink-900"
              >
                <ExternalLink className="size-4" />
              </a>
              <Link
                href={`/admin/listings/${r.slug}`}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink-900 px-4 text-xs font-semibold text-bone-50 hover:bg-ink-700"
              >
                <Pencil className="size-3.5" />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setConfirming(r)}
                aria-label={`Delete ${r.title}`}
                className="grid size-10 place-items-center rounded-full border border-ink-900/10 text-ink-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete confirmation */}
      {confirming && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/50 p-5 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <p className="font-semibold text-ink-900">Delete this listing?</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              &ldquo;{confirming.title}&rdquo; will be removed from the website in both languages. This can&rsquo;t be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirming(null)} className="btn btn-outline btn-sm">
                Keep it
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => remove(confirming)}
                className="btn btn-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 className="size-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
