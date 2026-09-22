"use client";

import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Upload {
  id: string;
  name: string;
  error?: string;
}

/**
 * Upload, order and remove listing photos. The first photo is the cover
 * shown on cards and at the top of the listing page.
 */
export default function PhotoManager({
  images,
  onChange,
  error,
}: {
  images: string[];
  onChange: (next: string[]) => void;
  error?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [dragging, setDragging] = useState(false);
  // Keep the latest list available to async callbacks that finish out of order.
  const latest = useRef(images);
  useEffect(() => {
    latest.current = images;
  }, [images]);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    for (const file of list) {
      const id = crypto.randomUUID();
      setUploads((u) => [...u, { id, name: file.name }]);
      const body = new FormData();
      body.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Upload failed");
        latest.current = [...latest.current, json.url];
        onChange(latest.current);
        setUploads((u) => u.filter((x) => x.id !== id));
      } catch (err) {
        setUploads((u) => u.map((x) => (x.id === id ? { ...x, error: (err as Error).message } : x)));
      }
    }
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files);
        }}
        className={`grid grid-cols-2 gap-3 rounded-2xl border-2 border-dashed p-3 transition-colors sm:grid-cols-3 lg:grid-cols-4 ${
          dragging ? "border-gold-500 bg-gold-500/5" : error ? "border-red-300" : "border-ink-900/12"
        }`}
      >
        {images.map((src, i) => (
          <div key={src + i} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-bone-200">
            <Image src={src} alt="" fill sizes="240px" className="object-cover" />
            {i === 0 && (
              <span className="absolute start-2 top-2 inline-flex items-center gap-1 rounded-full bg-gold-500 px-2 py-0.5 text-[0.6875rem] font-semibold text-ink-950">
                <Star className="size-3" fill="currentColor" /> Cover
              </span>
            )}
            <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1">
              <div className="flex gap-1">
                <IconButton label="Move earlier" onClick={() => move(i, i - 1)} disabled={i === 0}>
                  <ArrowLeft className="size-3.5" />
                </IconButton>
                <IconButton label="Move later" onClick={() => move(i, i + 1)} disabled={i === images.length - 1}>
                  <ArrowRight className="size-3.5" />
                </IconButton>
                {i !== 0 && (
                  <IconButton label="Make cover photo" onClick={() => move(i, 0)}>
                    <Star className="size-3.5" />
                  </IconButton>
                )}
              </div>
              <IconButton label="Remove photo" onClick={() => onChange(images.filter((_, j) => j !== i))} danger>
                <X className="size-3.5" />
              </IconButton>
            </div>
          </div>
        ))}

        {uploads.map((u) => (
          <div
            key={u.id}
            className={`flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl p-3 text-center text-xs ${
              u.error ? "bg-red-50 text-red-700" : "bg-bone-100 text-ink-400"
            }`}
          >
            {u.error ? (
              <>
                <span className="line-clamp-1 font-semibold">{u.name}</span>
                <span>{u.error}</span>
                <button
                  type="button"
                  onClick={() => setUploads((all) => all.filter((x) => x.id !== u.id))}
                  className="underline"
                >
                  Dismiss
                </button>
              </>
            ) : (
              <>
                <Loader2 className="size-5 animate-spin" />
                <span className="line-clamp-1">{u.name}</span>
              </>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => input.current?.click()}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-ink-900/10 bg-white text-sm font-semibold text-ink-500 transition-colors hover:border-gold-500 hover:text-gold-700"
        >
          <ImagePlus className="size-6" />
          Add photos
          <span className="text-xs font-normal text-ink-300">or drag them here</span>
        </button>
      </div>

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) upload(e.target.files);
          e.target.value = "";
        }}
      />
      <p className={`mt-2 text-xs ${error ? "text-red-600" : "text-ink-400"}`}>
        {error ?? "JPG, PNG or WebP, up to 12 MB each. The first photo is the cover. Landscape photos look best."}
      </p>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid size-8 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors disabled:opacity-30 ${
        danger ? "text-red-600 hover:bg-red-600 hover:text-white" : "text-ink-700 hover:bg-ink-900 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
