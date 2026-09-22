"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

interface Item {
  q: string;
  a: string;
}

export default function Accordion({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-ink-900/10 border-y border-ink-900/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-start justify-between gap-6 py-6 text-start"
            >
              <span
                className={`display-sm pe-4 transition-colors duration-300 ${
                  isOpen ? "text-gold-600" : "text-ink-900 group-hover:text-gold-600"
                }`}
              >
                {item.q}
              </span>
              <span
                className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                  isOpen
                    ? "rotate-45 border-gold-500 bg-gold-500 text-ink-950"
                    : "border-ink-900/20 text-ink-500 group-hover:border-gold-500 group-hover:text-gold-600"
                }`}
              >
                <Plus className="size-4" strokeWidth={1.5} />
              </span>
            </button>

            <div
              className="grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-7 text-[0.975rem] leading-relaxed text-ink-500">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
