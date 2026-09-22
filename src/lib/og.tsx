/**
 * ─────────────────────────────────────────────────────────────
 *  SHARE IMAGES (WhatsApp, Facebook, LinkedIn, iMessage, X)
 *
 *  Renders 1200×630 preview cards with next/og, then re-encodes
 *  them as JPEG. The PNG next/og produces is often over 1 MB with
 *  a photo in it, and WhatsApp silently drops preview images that
 *  large — the JPEG lands around 100–200 KB.
 * ─────────────────────────────────────────────────────────────
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { CSSProperties, ReactElement } from "react";
import sharp from "sharp";

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  ink: "#05080b",
  bone: "#fbf9f6",
  gold: "#c0a06b",
  goldLight: "#d2b884",
};

const fontDir = path.join(process.cwd(), "src", "assets", "og-fonts");
const font = (file: string) => readFile(path.join(fontDir, file));

async function fonts() {
  const [frauncesLight, fraunces, manrope, manropeBold, arabic, arabicBold] = await Promise.all([
    font("fraunces-latin-300-normal.woff"),
    font("fraunces-latin-400-normal.woff"),
    font("manrope-latin-600-normal.woff"),
    font("manrope-latin-700-normal.woff"),
    font("ibm-plex-sans-arabic-arabic-500-normal.woff"),
    font("ibm-plex-sans-arabic-arabic-700-normal.woff"),
  ]);
  return [
    { name: "Fraunces", data: frauncesLight, weight: 300 as const, style: "normal" as const },
    { name: "Fraunces", data: fraunces, weight: 400 as const, style: "normal" as const },
    { name: "Manrope", data: manrope, weight: 600 as const, style: "normal" as const },
    { name: "Manrope", data: manropeBold, weight: 700 as const, style: "normal" as const },
    // Arabic glyphs fall back to Plex Arabic from any font stack below.
    { name: "Plex Arabic", data: arabic, weight: 500 as const, style: "normal" as const },
    { name: "Plex Arabic", data: arabicBold, weight: 700 as const, style: "normal" as const },
  ];
}

/**
 * Load any listing photo — a remote URL, an Unsplash photo, or a file uploaded
 * through the admin (/media/…) — and return it as a cropped 1200×630 JPEG data URI.
 * Converting here also means WebP/AVIF uploads work, which the renderer can't read.
 */
export async function photoDataUri(src: string): Promise<string | null> {
  try {
    let bytes: Buffer;
    if (src.startsWith("/media/")) {
      bytes = await readFile(path.join(process.cwd(), "data", "uploads", src.slice("/media/".length)));
    } else if (/^https?:\/\//.test(src)) {
      const url = src.startsWith("https://images.unsplash.com/")
        ? `${src.split("?")[0]}?auto=format&fit=crop&w=1400&q=80`
        : src;
      const res = await fetch(url);
      if (!res.ok) return null;
      bytes = Buffer.from(await res.arrayBuffer());
    } else {
      bytes = await readFile(path.join(process.cwd(), "public", src.replace(/^\//, "")));
    }
    const jpeg = await sharp(bytes).resize(OG_SIZE.width, OG_SIZE.height, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Render a card and return it as a compact JPEG response. */
export async function renderOg(element: ReactElement): Promise<Response> {
  const png = await new ImageResponse(element, { ...OG_SIZE, fonts: await fonts() }).arrayBuffer();
  const jpeg = await sharp(Buffer.from(png)).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

/** The NP monogram and wordmark used on every card. */
export function OgBrand({ size = 1 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 * size }}>
      <div
        style={{
          width: 64 * size,
          height: 64 * size,
          borderRadius: 999,
          border: `2px solid ${OG_COLORS.gold}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: OG_COLORS.goldLight,
          fontFamily: "Fraunces",
          fontSize: 26 * size,
        }}
      >
        NP
      </div>
      <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 38 * size, color: OG_COLORS.bone }}>
        New<span style={{ color: OG_COLORS.gold, marginLeft: 10 * size }}>Properties</span>
      </div>
    </div>
  );
}

/** Full-card layer. The renderer ignores the `inset` shorthand, so size it explicitly. */
export const fill: CSSProperties = { position: "absolute", top: 0, left: 0, width: OG_SIZE.width, height: OG_SIZE.height };

/**
 * Text that reads correctly in either language. The image renderer shapes
 * Arabic letters but has no bidirectional layout, so a line that mixes Arabic
 * with numbers ("13,800,000 جنيه") comes out in the wrong order. Laying each
 * word out as its own item in a right-to-left row sidesteps that entirely.
 */
export function OgText({ text, rtl, style }: { text: string; rtl: boolean; style: CSSProperties }) {
  if (!rtl) return <div style={{ display: "flex", ...style }}>{text}</div>;
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        // The renderer adds its own spacing around Arabic word ends; keep the gap tight.
        columnGap: "0.12em",
        ...style,
      }}
    >
      {words.map((w, i) => (
        <span key={i}>{w}</span>
      ))}
    </div>
  );
}
