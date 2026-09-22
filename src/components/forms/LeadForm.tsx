"use client";

import { Check, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

interface LeadFormProps {
  /** Pre-fills the message, e.g. from a property page. */
  subject?: string;
  compact?: boolean;
  /** Visual scheme — forms sit on both light and dark panels. */
  tone?: "light" | "dark";
}

export default function LeadForm({ subject, compact = false, tone = "light" }: LeadFormProps) {
  const { dict, fmt, areas, locale } = useI18n();
  const t = dict.form;
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");

    // ── Wire this to the agency's CRM, inbox or form service. ──
    // The shape below is everything the form collects.
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (process.env.NODE_ENV === "development") {
      console.log("Enquiry submitted:", data);
    }

    await new Promise((r) => setTimeout(r, 900));
    setState("sent");
  }

  const dark = tone === "dark";
  const labelClass = dark ? "field-label text-bone-100/50" : "field-label";
  const fieldClass = dark
    ? "field border-bone-100/15 bg-bone-100/5 text-bone-50 placeholder:text-bone-100/30"
    : "field";

  if (state === "sent") {
    return (
      <div
        className={`rounded-2xl border p-8 text-center ${
          dark ? "border-bone-100/15 bg-bone-100/5" : "border-ink-900/10 bg-white"
        }`}
      >
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-gold-500 text-ink-950">
          <Check className="size-6" strokeWidth={2} />
        </div>
        <p className={`display-sm mt-5 ${dark ? "text-bone-50" : "text-ink-900"}`}>{t.sentTitle}</p>
        <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-bone-100/60" : "text-ink-400"}`}>
          {t.sentBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className={compact ? "space-y-4" : "grid grid-cols-1 gap-4 sm:grid-cols-2"}>
        <div>
          <label className={labelClass} htmlFor="lf-name">
            {t.name}
          </label>
          <input
            id="lf-name"
            name="name"
            required
            autoComplete="name"
            className={fieldClass}
            placeholder={t.namePlaceholder}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="lf-email">
            {t.email}
          </label>
          <input
            id="lf-email"
            name="email"
            type="email"
            dir="ltr"
            required
            autoComplete="email"
            className={`${fieldClass} rtl:text-right`}
            placeholder={t.emailPlaceholder}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="lf-phone">
            {t.phone}
          </label>
          <input
            id="lf-phone"
            name="phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            className={`${fieldClass} rtl:text-right`}
            placeholder={t.phonePlaceholder}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="lf-area">
            {t.area}
          </label>
          <select id="lf-area" name="area" className={fieldClass} defaultValue="">
            <option value="">{t.noPreference}</option>
            {areas.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!compact && (
        <div>
          <label className={labelClass} htmlFor="lf-budget">
            {t.budget}
          </label>
          <select id="lf-budget" name="budget" className={fieldClass} defaultValue="">
            <option value="">{t.preferNot}</option>
            {t.budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="lf-message">
          {t.message}
        </label>
        <textarea
          id="lf-message"
          name="message"
          rows={compact ? 3 : 4}
          className={`${fieldClass} resize-none`}
          defaultValue={subject ? fmt(t.prefill, { subject }) : ""}
          placeholder={t.messagePlaceholder}
        />
      </div>

      <input type="hidden" name="source" value={subject ?? t.general} />
      <input type="hidden" name="language" value={locale} />

      <button type="submit" disabled={state === "sending"} className="btn btn-gold w-full disabled:opacity-70">
        {state === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" strokeWidth={2} />
            {t.sending}
          </>
        ) : (
          <>
            <Send className="size-4 rtl:-scale-x-100" strokeWidth={2} />
            {t.send}
          </>
        )}
      </button>

      <p className={`text-xs leading-relaxed ${dark ? "text-bone-100/40" : "text-ink-300"}`}>{t.privacy}</p>
    </form>
  );
}
