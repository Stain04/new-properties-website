"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { heroImages } from "@/data/properties";
import { site } from "@/data/site";
import SearchBar from "./SearchBar";

const captions = [
  "Cairo — The Nile",
  "Cairo Skyline",
  "New Capital — Business District",
  "New Cairo — Compounds",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % heroImages.length), 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-ink-950">
      {/* Rotating backdrop */}
      {heroImages.map((src, i) => (
        <div
          key={src}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-opacity duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="scale-105 object-cover"
            style={{
              transform: i === index ? "scale(1.06)" : "scale(1.01)",
              transition: "transform 8000ms cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>
      ))}

      <div className="scrim-full absolute inset-0" />

      {/* Content */}
      <div className="relative flex min-h-[100svh] flex-col justify-end pb-7 pt-32">
        <div className="shell">
          <div className="max-w-4xl">
            <p
              className="eyebrow eyebrow-light"
              style={{ animation: "fade-up 1s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
            >
              {site.descriptor} · Est. {site.established}
            </p>

            <h1
              className="display-xl mt-6 text-bone-50"
              style={{ animation: "fade-up 1.1s cubic-bezier(0.16,1,0.3,1) 0.35s both" }}
            >
              Property in Egypt,
              <br />
              <span className="italic text-gold-400">advised properly.</span>
            </h1>

            <p
              className="mt-7 max-w-2xl text-pretty text-[0.9375rem] font-semibold leading-relaxed tracking-wide text-gold-300 md:text-base"
              style={{ animation: "fade-up 1.1s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}
            >
              {site.positioning}
            </p>

            <p
              className="lede lede-light mt-5 max-w-xl"
              style={{ animation: "fade-up 1.1s cubic-bezier(0.16,1,0.3,1) 0.6s both" }}
            >
              Residential, commercial and administrative property — sourced, verified and
              registered by a single firm that stays with you after the keys change hands.
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-3"
              style={{ animation: "fade-up 1.1s cubic-bezier(0.16,1,0.3,1) 0.65s both" }}
            >
              <Link href="/properties" className="btn btn-gold">
                View the catalogue
              </Link>
              <Link href="/contact" className="btn btn-outline-light">
                Speak to an adviser
              </Link>
            </div>
          </div>

          {/* Search */}
          <div
            className="mt-9 max-w-5xl"
            style={{ animation: "fade-up 1.2s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}
          >
            <SearchBar />
          </div>

          {/* Footer strip */}
          <div
            className="mt-7 flex flex-wrap items-center justify-between gap-6 border-t border-bone-100/12 pt-5"
            style={{ animation: "fade-up 1.2s cubic-bezier(0.16,1,0.3,1) 0.95s both" }}
          >
            <div className="flex items-center gap-3">
              {heroImages.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${captions[i]}`}
                  className={`h-px transition-all duration-700 ${
                    i === index ? "w-12 bg-gold-400" : "w-6 bg-bone-100/30 hover:bg-bone-100/60"
                  }`}
                />
              ))}
              <span className="ml-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-bone-100/55">
                {captions[index]}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
              {[
                ["2,800+", "Transactions"],
                ["8", "Destinations"],
                ["16", "Years advising"],
              ].map(([value, label]) => (
                <div key={label} className="flex items-baseline gap-2">
                  <span className="font-display text-xl text-bone-50">{value}</span>
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-bone-100/50">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
