"use client";

import { Check, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { areas } from "@/data/areas";

interface LeadFormProps {
  /** Pre-fills the message, e.g. from a property page. */
  subject?: string;
  compact?: boolean;
  /** Visual scheme — forms sit on both light and dark panels. */
  tone?: "light" | "dark";
}

const budgets = [
  "Under €75,000",
  "€75,000 – €150,000",
  "€150,000 – €350,000",
  "€350,000 – €750,000",
  "Above €750,000",
  "Renting, not buying",
];

export default function LeadForm({ subject, compact = false, tone = "light" }: LeadFormProps) {
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
        <p className={`display-sm mt-5 ${dark ? "text-bone-50" : "text-ink-900"}`}>
          Enquiry received
        </p>
        <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-bone-100/60" : "text-ink-400"}`}>
          An adviser will be in touch within one working day. If it is urgent, call the desk
          directly and ask for whoever covers your area.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label className={labelClass} htmlFor="lf-name">
            Name
          </label>
          <input
            id="lf-name"
            name="name"
            required
            autoComplete="name"
            className={fieldClass}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="lf-email">
            Email
          </label>
          <input
            id="lf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="lf-phone">
            Phone / WhatsApp
          </label>
          <input
            id="lf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={fieldClass}
            placeholder="+44 …"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="lf-area">
            Area of interest
          </label>
          <select id="lf-area" name="area" className={fieldClass} defaultValue="">
            <option value="">No preference yet</option>
            {areas.map((a) => (
              <option key={a.slug} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!compact && (
        <div>
          <label className={labelClass} htmlFor="lf-budget">
            Budget
          </label>
          <select id="lf-budget" name="budget" className={fieldClass} defaultValue="">
            <option value="">Prefer not to say</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="lf-message">
          What are you looking for?
        </label>
        <textarea
          id="lf-message"
          name="message"
          rows={compact ? 3 : 4}
          className={`${fieldClass} resize-none`}
          defaultValue={subject ? `I'd like more information about ${subject}.` : ""}
          placeholder="Tell us what you have in mind — purpose, timing, anything that matters."
        />
      </div>

      <input type="hidden" name="source" value={subject ?? "General enquiry"} />

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-gold w-full disabled:opacity-70"
      >
        {state === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" strokeWidth={2} />
            Sending
          </>
        ) : (
          <>
            <Send className="size-4" strokeWidth={2} />
            Send enquiry
          </>
        )}
      </button>

      <p className={`text-xs leading-relaxed ${dark ? "text-bone-100/40" : "text-ink-300"}`}>
        We reply within one working day. Your details are used only to answer this enquiry and
        are never passed to third parties.
      </p>
    </form>
  );
}
