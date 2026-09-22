"use client";

import { AlertCircle, Check, ExternalLink, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { saveListing } from "@/app/admin/actions";
import {
  CURRENCIES,
  FINISHINGS,
  PROPERTY_TYPES,
  slugify,
  STATUSES,
  type Listing,
  type ListingCopy,
} from "@/lib/listings/schema";
import PhotoManager from "./PhotoManager";

/* ─────────────── Draft state (everything as the inputs hold it) ─────────────── */

interface CopyDraft {
  title: string;
  address: string;
  summary: string;
  /** Paragraphs separated by a blank line. */
  description: string;
  /** One feature per line. */
  features: string;
  view: string;
  floor: string;
  planNote: string;
}

type Draft = {
  slug: string;
  ref: string;
  purpose: Listing["purpose"];
  type: Listing["type"];
  areaSlug: string;
  price: string;
  currency: Listing["currency"];
  period: "month" | "night";
  bedrooms: string;
  bathrooms: string;
  size: string;
  plotSize: string;
  deliveryYear: string;
  finishing: Listing["finishing"];
  status: Listing["status"];
  featured: boolean;
  exclusive: boolean;
  hasPlan: boolean;
  downPayment: string;
  planYears: string;
  lat: string;
  lng: string;
  agentSlug: string;
  images: string[];
  en: CopyDraft;
  ar: CopyDraft;
};

const copyToDraft = (c?: Partial<ListingCopy>): CopyDraft => ({
  title: c?.title ?? "",
  address: c?.address ?? "",
  summary: c?.summary ?? "",
  description: (c?.description ?? []).join("\n\n"),
  features: (c?.features ?? []).join("\n"),
  view: c?.view ?? "",
  floor: c?.floor ?? "",
  planNote: c?.planNote ?? "",
});

const str = (n?: number) => (n === undefined || n === null ? "" : String(n));
const num = (s: string) => (s.trim() === "" ? undefined : Number(s.replace(/,/g, "")));
const opt = (s: string) => (s.trim() === "" ? undefined : s.trim());
const paragraphs = (s: string) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

function toDraft(l: Listing | undefined, defaults: { areaSlug: string; agentSlug: string; ref: string }): Draft {
  return {
    slug: l?.slug ?? "",
    ref: l?.ref ?? defaults.ref,
    purpose: l?.purpose ?? "sale",
    type: l?.type ?? "Apartment",
    areaSlug: l?.areaSlug ?? defaults.areaSlug,
    price: str(l?.price),
    currency: l?.currency ?? "EGP",
    period: l?.period ?? "month",
    bedrooms: str(l?.bedrooms ?? 2),
    bathrooms: str(l?.bathrooms ?? 1),
    size: str(l?.size),
    plotSize: str(l?.plotSize),
    deliveryYear: str(l?.deliveryYear),
    finishing: l?.finishing ?? "Fully finished",
    status: l?.status ?? "available",
    featured: l?.featured ?? false,
    exclusive: l?.exclusive ?? false,
    hasPlan: Boolean(l?.paymentPlan),
    downPayment: l?.paymentPlan?.downPayment ?? "10%",
    planYears: str(l?.paymentPlan?.years ?? 8),
    lat: str(l?.coordinates?.lat),
    lng: str(l?.coordinates?.lng),
    agentSlug: l?.agentSlug ?? defaults.agentSlug,
    images: l?.images ?? [],
    en: copyToDraft(l?.en),
    ar: copyToDraft(l?.ar),
  };
}

function copyPayload(c: CopyDraft) {
  return {
    title: c.title.trim(),
    address: c.address.trim(),
    summary: c.summary.trim(),
    description: paragraphs(c.description),
    features: lines(c.features),
    view: c.view.trim(),
    floor: opt(c.floor),
    planNote: opt(c.planNote),
  };
}

function toPayload(d: Draft) {
  const arFilled = Object.values(d.ar).some((v) => v.trim() !== "");
  const lat = num(d.lat);
  const lng = num(d.lng);
  return {
    slug: d.slug,
    ref: d.ref.trim(),
    purpose: d.purpose,
    type: d.type,
    areaSlug: d.areaSlug,
    price: num(d.price),
    currency: d.currency,
    period: d.purpose === "rent" ? d.period : undefined,
    bedrooms: num(d.bedrooms) ?? 0,
    bathrooms: num(d.bathrooms) ?? 0,
    size: num(d.size),
    plotSize: num(d.plotSize),
    deliveryYear: num(d.deliveryYear),
    finishing: d.finishing,
    status: d.status,
    featured: d.featured,
    exclusive: d.exclusive,
    paymentPlan: d.hasPlan ? { downPayment: d.downPayment.trim(), years: num(d.planYears) } : undefined,
    coordinates: lat !== undefined && lng !== undefined ? { lat, lng } : undefined,
    agentSlug: d.agentSlug,
    images: d.images,
    en: copyPayload(d.en),
    ar: arFilled
      ? Object.fromEntries(
          Object.entries(copyPayload(d.ar)).filter(([, v]) => (Array.isArray(v) ? v.length : Boolean(v))),
        )
      : undefined,
  };
}

/* ─────────────── Component ─────────────── */

export default function ListingForm({
  initial,
  suggestedRef = "",
  areas,
  agents,
}: {
  initial?: Listing;
  /** Reference for a new listing, generated on the server so both renders agree. */
  suggestedRef?: string;
  areas: { slug: string; name: string; region: string }[];
  agents: { slug: string; name: string; role: string }[];
}) {
  const router = useRouter();
  const isNew = !initial;
  const [draft, setDraft] = useState<Draft>(() =>
    toDraft(initial, { areaSlug: areas[0]?.slug ?? "", agentSlug: agents[0]?.slug ?? "", ref: suggestedRef }),
  );
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [tab, setTab] = useState<"en" | "ar">("en");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, startSaving] = useTransition();

  // New listings get their web address from the English title until someone edits it by hand.
  const slug = slugTouched ? draft.slug : slugify(draft.en.title);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };
  const setCopy = (lang: "en" | "ar", key: keyof CopyDraft, value: string) => {
    setDraft((d) => ({ ...d, [lang]: { ...d[lang], [key]: value } }));
    setDirty(true);
  };

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const arabicDone = useMemo(() => Boolean(draft.ar.title.trim() && draft.ar.summary.trim()), [draft.ar]);

  function save() {
    const payload = { ...toPayload(draft), slug };
    setBanner(null);
    startSaving(async () => {
      const res = await saveListing(payload, initial?.slug);
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        setBanner({ tone: "error", text: res.error ?? "Could not save." });
        const keys = Object.keys(res.fieldErrors ?? {});
        if (keys.some((k) => k.startsWith("en."))) setTab("en");
        else if (keys.some((k) => k.startsWith("ar."))) setTab("ar");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setErrors({});
      setDirty(false);
      // A unique value makes the edit page re-render with the saved data and its confirmation.
      router.replace(`/admin/listings/${res.slug}?saved=${Date.now()}`);
    });
  }

  const err = (key: string) => errors[key];
  const copy = draft[tab];
  const rtl = tab === "ar";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="pb-28"
    >
      {banner && (
        <p
          role="status"
          className={`mb-6 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
            banner.tone === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
          }`}
        >
          {banner.tone === "ok" ? <Check className="mt-0.5 size-4 shrink-0" /> : <AlertCircle className="mt-0.5 size-4 shrink-0" />}
          {banner.text}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-6">
          {/* Photos */}
          <Section title="Photos" hint="Drag to add. Use the arrows to reorder; the first photo is the cover.">
            <PhotoManager images={draft.images} onChange={(imgs) => set("images", imgs)} error={err("images")} />
          </Section>

          {/* Text */}
          <Section title="Description" hint="Write the English first. Arabic is optional per listing — the Arabic site shows the English until you add it.">
            <div className="mb-5 flex gap-1 rounded-full border border-ink-900/10 bg-bone-100 p-1">
              <TabButton active={tab === "en"} onClick={() => setTab("en")}>
                English
              </TabButton>
              <TabButton active={tab === "ar"} onClick={() => setTab("ar")}>
                <span lang="ar" className="font-[family-name:var(--font-plex-arabic)]">العربية</span>
                {arabicDone ? <Check className="size-3.5 text-emerald-600" /> : <span className="size-1.5 rounded-full bg-amber-500" />}
              </TabButton>
            </div>

            <div lang={tab} dir={rtl ? "rtl" : "ltr"} className={`space-y-4 ${rtl ? "font-[family-name:var(--font-plex-arabic)]" : ""}`}>
              <Field label={rtl ? "العنوان" : "Title"} error={err(`${tab}.title`)} required={!rtl}>
                <input
                  className="field"
                  value={copy.title}
                  onChange={(e) => setCopy(tab, "title", e.target.value)}
                  placeholder={rtl ? "مثال: شقة تلات غرف، ميفيدا" : "e.g. Three-bedroom apartment, Mivida"}
                />
              </Field>
              <Field label={rtl ? "الموقع / العنوان التفصيلي" : "Address"} error={err(`${tab}.address`)} required={!rtl}>
                <input
                  className="field"
                  value={copy.address}
                  onChange={(e) => setCopy(tab, "address", e.target.value)}
                  placeholder={rtl ? "مثال: ميفيدا، التجمع الخامس" : "e.g. Mivida, Fifth Settlement"}
                />
              </Field>
              <Field
                label={rtl ? "ملخص في سطر" : "One-line summary"}
                hint={rtl ? "بيظهر على كارت العقار." : "Shown on the listing card."}
                error={err(`${tab}.summary`)}
                required={!rtl}
              >
                <textarea className="field resize-y" rows={2} value={copy.summary} onChange={(e) => setCopy(tab, "summary", e.target.value)} />
              </Field>
              <Field
                label={rtl ? "الوصف" : "Full description"}
                hint={rtl ? "افصل بين الفقرات بسطر فاضي." : "Leave a blank line between paragraphs."}
                error={err(`${tab}.description`)}
              >
                <textarea className="field resize-y" rows={8} value={copy.description} onChange={(e) => setCopy(tab, "description", e.target.value)} />
              </Field>
              <Field
                label={rtl ? "المميزات" : "Features"}
                hint={rtl ? "ميزة في كل سطر." : "One per line — e.g. Private garden, Covered parking."}
                error={err(`${tab}.features`)}
              >
                <textarea className="field resize-y" rows={5} value={copy.features} onChange={(e) => setCopy(tab, "features", e.target.value)} />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={rtl ? "الإطلالة" : "View"} error={err(`${tab}.view`)}>
                  <input
                    className="field"
                    value={copy.view}
                    onChange={(e) => setCopy(tab, "view", e.target.value)}
                    placeholder={rtl ? "مثال: على الحديقة" : "e.g. Park view"}
                  />
                </Field>
                <Field label={rtl ? "الدور" : "Floor"} error={err(`${tab}.floor`)}>
                  <input
                    className="field"
                    value={copy.floor}
                    onChange={(e) => setCopy(tab, "floor", e.target.value)}
                    placeholder={rtl ? "مثال: التاني من 4" : "e.g. 2nd of 4"}
                  />
                </Field>
              </div>
              {draft.hasPlan && (
                <Field label={rtl ? "ملاحظة عن التقسيط" : "Payment plan note"} error={err(`${tab}.planNote`)}>
                  <input
                    className="field"
                    value={copy.planNote}
                    onChange={(e) => setCopy(tab, "planNote", e.target.value)}
                    placeholder={rtl ? "مثال: من غير فوايد، أقساط كل 3 شهور" : "e.g. Interest-free, quarterly instalments"}
                  />
                </Field>
              )}
            </div>
          </Section>

          {/* Details */}
          <Section title="Details">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <Field label="For">
                <select className="field" value={draft.purpose} onChange={(e) => set("purpose", e.target.value as Draft["purpose"])}>
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              </Field>
              <Field label="Type">
                <select className="field" value={draft.type} onChange={(e) => set("type", e.target.value as Draft["type"])}>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Area" error={err("areaSlug")}>
                <select className="field" value={draft.areaSlug} onChange={(e) => set("areaSlug", e.target.value)}>
                  {areas.map((a) => (
                    <option key={a.slug} value={a.slug}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={draft.purpose === "rent" ? "Rent" : "Price"} error={err("price")} required>
                <input className="field" inputMode="numeric" value={draft.price} onChange={(e) => set("price", e.target.value)} placeholder="e.g. 13,800,000" />
              </Field>
              <Field label="Currency">
                <select className="field" value={draft.currency} onChange={(e) => set("currency", e.target.value as Draft["currency"])}>
                  {CURRENCIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              {draft.purpose === "rent" ? (
                <Field label="Per">
                  <select className="field" value={draft.period} onChange={(e) => set("period", e.target.value as Draft["period"])}>
                    <option value="month">Month</option>
                    <option value="night">Night</option>
                  </select>
                </Field>
              ) : (
                <Field label="Finishing">
                  <select className="field" value={draft.finishing} onChange={(e) => set("finishing", e.target.value as Draft["finishing"])}>
                    {FINISHINGS.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </Field>
              )}

              <Field label="Bedrooms" error={err("bedrooms")}>
                <input className="field" inputMode="numeric" value={draft.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
              </Field>
              <Field label="Bathrooms" error={err("bathrooms")}>
                <input className="field" inputMode="numeric" value={draft.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
              </Field>
              <Field label="Size (m²)" error={err("size")} required>
                <input className="field" inputMode="decimal" value={draft.size} onChange={(e) => set("size", e.target.value)} />
              </Field>
              <Field label="Plot / garden (m²)" error={err("plotSize")}>
                <input className="field" inputMode="decimal" value={draft.plotSize} onChange={(e) => set("plotSize", e.target.value)} placeholder="Optional" />
              </Field>
              <Field label="Delivery year" error={err("deliveryYear")}>
                <input className="field" inputMode="numeric" value={draft.deliveryYear} onChange={(e) => set("deliveryYear", e.target.value)} placeholder="Optional" />
              </Field>
              {draft.purpose === "rent" && (
                <Field label="Finishing">
                  <select className="field" value={draft.finishing} onChange={(e) => set("finishing", e.target.value as Draft["finishing"])}>
                    {FINISHINGS.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </Field>
              )}
            </div>

            <div className="mt-6 rounded-xl border border-ink-900/10 bg-bone-50 p-4">
              <Toggle checked={draft.hasPlan} onChange={(v) => set("hasPlan", v)} label="Has a payment plan" />
              {draft.hasPlan && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Field label="Down payment" error={err("paymentPlan.downPayment")}>
                    <input className="field" value={draft.downPayment} onChange={(e) => set("downPayment", e.target.value)} placeholder="e.g. 10%" />
                  </Field>
                  <Field label="Years" error={err("paymentPlan.years")}>
                    <input className="field" inputMode="numeric" value={draft.planYears} onChange={(e) => set("planYears", e.target.value)} />
                  </Field>
                </div>
              )}
            </div>
          </Section>

          {/* Location */}
          <Section title="Map location" hint="Optional. In Google Maps, right-click the building and click the numbers to copy them.">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude" error={err("coordinates.lat")}>
                <input className="field" inputMode="decimal" value={draft.lat} onChange={(e) => set("lat", e.target.value)} placeholder="e.g. 30.0201" />
              </Field>
              <Field label="Longitude" error={err("coordinates.lng")}>
                <input className="field" inputMode="decimal" value={draft.lng} onChange={(e) => set("lng", e.target.value)} placeholder="e.g. 31.4788" />
              </Field>
            </div>
          </Section>
        </div>

        {/* Side panel */}
        <aside className="space-y-6">
          <div className="space-y-6 lg:sticky lg:top-24">
            <Section title="Publishing">
              <div className="space-y-4">
                <Field label="Availability">
                  <select className="field" value={draft.status} onChange={(e) => set("status", e.target.value as Draft["status"])}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s[0].toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Toggle checked={draft.featured} onChange={(v) => set("featured", v)} label="Feature on the homepage" />
                <Toggle checked={draft.exclusive} onChange={(v) => set("exclusive", v)} label="Exclusive listing" />
                <Field label="Adviser">
                  <select className="field" value={draft.agentSlug} onChange={(e) => set("agentSlug", e.target.value)}>
                    {agents.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.name} — {a.role}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </Section>

            <Section title="Reference & web address">
              <div className="space-y-4">
                <Field label="Reference" error={err("ref")}>
                  <input className="field font-mono" value={draft.ref} onChange={(e) => set("ref", e.target.value)} />
                </Field>
                <Field
                  label="Web address"
                  hint={isNew ? "Made from the English title — you rarely need to change it." : "Changing this breaks links people have already shared."}
                  error={err("slug")}
                >
                  <div className="flex items-center overflow-hidden rounded-xl border border-ink-900/14 bg-white focus-within:border-gold-500">
                    <span className="shrink-0 ps-3 text-xs text-ink-300">/properties/</span>
                    <input
                      className="min-w-0 flex-1 bg-transparent py-3 pe-3 text-sm outline-none"
                      value={slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        set("slug", slugify(e.target.value));
                      }}
                    />
                  </div>
                </Field>
                {!isNew && (
                  <a
                    href={`/properties/${initial?.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 hover:underline"
                  >
                    <ExternalLink className="size-3.5" /> View on the site
                  </a>
                )}
              </div>
            </Section>
          </div>
        </aside>
      </div>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-900/10 bg-bone-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <p className="text-sm text-ink-500">
            {saving ? "Saving…" : dirty ? "You have unsaved changes." : isNew ? "Fill in the details, then publish." : "All changes saved."}
          </p>
          <button type="submit" disabled={saving} className="btn btn-gold disabled:opacity-70">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isNew ? "Publish listing" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ─────────────── Small building blocks ─────────────── */

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-ink-900/10 bg-white p-5 md:p-6">
      <h2 className="font-display text-lg text-ink-900">{title}</h2>
      {hint && <p className="mt-1 text-sm leading-relaxed text-ink-400">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.8125rem] font-semibold text-ink-700">
        {label}
        {required && <span className="text-gold-600"> *</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs text-red-600">{error}</span>
      ) : (
        hint && <span className="mt-1.5 block text-xs text-ink-400">{hint}</span>
      )}
    </label>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 text-start text-sm font-semibold text-ink-700"
    >
      {label}
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-gold-500" : "bg-ink-900/15"}`}>
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${checked ? "start-[1.375rem]" : "start-0.5"}`}
        />
      </span>
    </button>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
        active ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-900"
      }`}
    >
      {children}
    </button>
  );
}
