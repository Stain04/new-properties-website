import Link from "next/link";
import { site } from "@/data/site";

/**
 * Wordmark. Swap the markup here for an <Image> if the agency
 * supplies a drawn logo — nothing else references the type.
 */
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label={`${site.name} — home`} className="group inline-flex items-center gap-3">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${
          light ? "border-bone-100/35" : "border-ink-900/20"
        }`}
      >
        <span
          className={`font-display text-[0.8rem] leading-none transition-colors duration-500 ${
            light ? "text-gold-400" : "text-gold-600"
          }`}
        >
          NP
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`whitespace-nowrap font-display text-[1.15rem] tracking-tight transition-colors duration-500 ${
            light ? "text-bone-50" : "text-ink-900"
          }`}
        >
          {site.nameLine1} <span className="text-gold-500">{site.nameLine2}</span>
        </span>
        <span
          className={`mt-1 hidden whitespace-nowrap text-[0.5625rem] font-semibold uppercase tracking-[0.28em] transition-colors duration-500 sm:block ${
            light ? "text-bone-100/55" : "text-ink-400"
          }`}
        >
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
