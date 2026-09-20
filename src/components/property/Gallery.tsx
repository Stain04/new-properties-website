"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, step]);

  const [hero, ...rest] = images;

  return (
    <>
      {/* Mosaic */}
      <div className="grid gap-2 md:grid-cols-[1.9fr_1fr] md:gap-3">
        <button
          type="button"
          onClick={() => setLightbox(0)}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-800 md:aspect-[3/2]"
        >
          <Image
            src={hero}
            alt={title}
            fill
            priority
            sizes="(min-width:768px) 62vw, 100vw"
            className="img-zoom object-cover"
          />
          <span className="absolute bottom-4 left-4 chip chip-glass">
            <Expand className="size-3.5" strokeWidth={2} />
            {images.length} photographs
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:gap-3">
          {rest.slice(0, 2).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setLightbox(i + 1)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-800 md:aspect-auto"
            >
              <Image
                src={src}
                alt={`${title} — photograph ${i + 2}`}
                fill
                sizes="(min-width:768px) 32vw, 48vw"
                className="img-zoom object-cover"
              />
              {i === 1 && rest.length > 2 && (
                <span className="absolute inset-0 grid place-items-center bg-ink-950/55 font-display text-2xl text-bone-50 backdrop-blur-[2px] transition-colors duration-500 group-hover:bg-ink-950/40">
                  +{rest.length - 2}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Thumb strip */}
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setLightbox(i)}
            aria-label={`Open photograph ${i + 1}`}
            className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-ink-800 ring-offset-2 transition-all duration-300 hover:ring-2 hover:ring-gold-500"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/96 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — photograph viewer`}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-5 top-5 z-10 grid size-11 place-items-center rounded-full border border-bone-100/25 text-bone-50 transition-colors hover:bg-bone-50 hover:text-ink-950"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous photograph"
            className="absolute left-3 z-10 grid size-11 place-items-center rounded-full border border-bone-100/25 text-bone-50 transition-colors hover:bg-bone-50 hover:text-ink-950 md:left-8"
          >
            <ChevronLeft className="size-5" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next photograph"
            className="absolute right-3 z-10 grid size-11 place-items-center rounded-full border border-bone-100/25 text-bone-50 transition-colors hover:bg-bone-50 hover:text-ink-950 md:right-8"
          >
            <ChevronRight className="size-5" strokeWidth={1.5} />
          </button>

          <div className="relative h-[72vh] w-[92vw] max-w-6xl">
            <Image
              src={images[lightbox]}
              alt={`${title} — photograph ${lightbox + 1}`}
              fill
              sizes="92vw"
              className="object-contain"
            />
          </div>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-bone-100/60">
            {lightbox + 1} / {images.length} — {title}
          </p>
        </div>
      )}
    </>
  );
}
