"use client";

import { MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

/** Floating contact dock — appears once the visitor has started reading. Sits bottom-right in English, bottom-left in Arabic. */
export default function ContactDock({
  contact,
}: {
  contact: { whatsapp: string; phoneHref: string };
}) {
  const { dict } = useI18n();
  const t = dict.dock;
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappHref = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(t.message)}`;

  const pill =
    "flex items-center gap-2.5 rounded-full bg-bone-50 py-2.5 ps-4 pe-3 text-[0.8125rem] font-semibold text-ink-900 shadow-[0_14px_40px_-12px_rgba(5,8,11,0.5)] transition-transform duration-300 hover:-translate-y-0.5";

  return (
    <div
      className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-[max(1.25rem,env(safe-area-inset-right))] z-40 flex flex-col items-end gap-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div
        className={`flex flex-col items-end gap-2.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={pill}>
          {t.whatsapp}
          <span className="grid size-8 place-items-center rounded-full bg-[#25D366] text-white">
            <MessageCircle className="size-4" strokeWidth={2} />
          </span>
        </a>
        <a href={`tel:${contact.phoneHref}`} className={pill}>
          {t.call}
          <span className="grid size-8 place-items-center rounded-full bg-ink-900 text-bone-50">
            <Phone className="size-4" strokeWidth={2} />
          </span>
        </a>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
        className="grid size-14 place-items-center rounded-full bg-gold-500 text-ink-950 shadow-[0_18px_44px_-14px_rgba(160,130,80,0.85)] transition-all duration-500 hover:bg-gold-400"
      >
        {open ? (
          <X className="size-5" strokeWidth={2} />
        ) : (
          <MessageCircle className="size-5" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
