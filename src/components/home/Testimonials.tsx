"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

interface Testimonial {
  quote: string;
  name: string;
  detail: string;
  origin: string;
  image: string;
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const { dict } = useI18n();
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const step = (d: 1 | -1) => setI((v) => (v + d + testimonials.length) % testimonials.length);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div className="relative aspect-[4/5] max-w-sm overflow-hidden rounded-2xl bg-ink-800">
        {testimonials.map((item, idx) => (
          <Image
            key={item.name}
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width:1024px) 30vw, 80vw"
            className="object-cover transition-opacity duration-1000"
            style={{ opacity: idx === i ? 1 : 0 }}
          />
        ))}
        <div className="scrim-b pointer-events-none absolute inset-0" />
        <div className="absolute inset-x-5 bottom-5">
          <p className="font-display text-xl text-bone-50">{t.name}</p>
          <p className="mt-1 text-[0.75rem] text-bone-100/65">{t.origin}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <Quote className="size-9 text-gold-500" strokeWidth={1} />
        <blockquote className="display-md mt-6 text-balance text-ink-900">
          {t.quote}
        </blockquote>
        <p className="mt-7 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-600">
          {t.detail}
        </p>

        <div className="mt-10 flex items-center gap-4">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={dict.testimonials.prev}
            className="grid size-11 place-items-center rounded-full border border-ink-900/15 text-ink-600 transition-all duration-400 hover:border-ink-900 hover:bg-ink-900 hover:text-bone-50"
          >
            <ChevronLeft className="size-4 rtl:-scale-x-100" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={dict.testimonials.next}
            className="grid size-11 place-items-center rounded-full border border-ink-900/15 text-ink-600 transition-all duration-400 hover:border-ink-900 hover:bg-ink-900 hover:text-bone-50"
          >
            <ChevronRight className="size-4 rtl:-scale-x-100" strokeWidth={1.75} />
          </button>
          <span className="ms-2 font-display text-sm text-ink-400">
            {String(i + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
