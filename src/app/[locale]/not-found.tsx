"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";
import Link from "@/i18n/Link";
import { photos } from "@/lib/images";

export default function NotFound() {
  const { dict } = useI18n();
  const t = dict.notFound;

  return (
    <section className="relative min-h-[90svh] overflow-hidden bg-ink-950">
      <Image src={photos.heroCoast} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
      <div className="scrim-full absolute inset-0" />

      <div className="shell relative flex min-h-[90svh] flex-col justify-center py-32">
        <p className="eyebrow eyebrow-light">{t.eyebrow}</p>
        <h1 className="display-xl mt-6 text-bone-50">
          {t.lineOne}
          <br />
          <span className="italic text-gold-400">{t.lineTwo}</span>
        </h1>
        <p className="lede lede-light mt-7 max-w-lg">{t.lede}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/properties" className="btn btn-gold">
            {t.browse}
          </Link>
          <Link href="/contact" className="btn btn-outline-light">
            {dict.common.speakToAdviser}
          </Link>
        </div>
      </div>
    </section>
  );
}
