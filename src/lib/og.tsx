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
    font("fraunces-latin-300-normal.ttf"),
    font("fraunces-latin-400-normal.ttf"),
    font("manrope-latin-600-normal.ttf"),
    font("manrope-latin-700-normal.ttf"),
    font("ibm-plex-sans-arabic-arabic-500-normal.ttf"),
    font("ibm-plex-sans-arabic-arabic-700-normal.ttf"),
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

/** Pango markup needs its special characters escaped. */
const escapeMarkup = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** "#d2b884" or "rgba(251,249,246,0.82)" → Pango's colour and opacity attributes. */
function pangoColor(color: string) {
  const m = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
  if (!m) return `foreground="${color}"`;
  const hex = [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("");
  const alpha = m[4] === undefined ? 100 : Math.round(Number(m[4]) * 100);
  return `foreground="#${hex}" fgalpha="${alpha}%"`;
}

/*
 * Fonts for Arabic text. Latin digits aren't in the Arabic font files, so
 * Manrope is registered alongside and picked up for numbers automatically.
 * libvips keeps every font file it has been given, so registering each once
 * per server process is enough.
 */
const arabicFontFile = (weight: 500 | 700) => path.join(fontDir, `ibm-plex-sans-arabic-arabic-${weight}-normal.ttf`);
let fontsRegistered: Promise<void> | null = null;
function registerArabicFonts() {
  fontsRegistered ??= (async () => {
    for (const file of [
      "manrope-latin-600-normal.ttf",
      "manrope-latin-700-normal.ttf",
      "ibm-plex-sans-arabic-arabic-500-normal.ttf",
      "ibm-plex-sans-arabic-arabic-700-normal.ttf",
    ]) {
      await sharp({ text: { text: "x", fontfile: path.join(fontDir, file) } }).png().toBuffer();
    }
  })();
  return fontsRegistered;
}

/** Draw Arabic text to a transparent image with full shaping and right-to-left layout. */
async function arabicImage(text: string, style: CSSProperties) {
  const size = Number(style.fontSize ?? 24);
  const weight = Number(style.fontWeight ?? 500) >= 600 ? 700 : 500;
  const maxWidth = Number(style.maxWidth ?? 1060);
  const lineHeight = Number(style.lineHeight ?? 1.3);
  await registerArabicFonts();
  const { data, info } = await sharp({
    text: {
      text: `<span ${pangoColor(String(style.color ?? OG_COLORS.bone))}>${escapeMarkup(text)}</span>`,
      font: `IBM Plex Sans Arabic,Manrope ${weight === 700 ? "Bold" : "Medium"} ${size}`,
      fontfile: arabicFontFile(weight),
      width: maxWidth,
      align: "right",
      rgba: true,
      dpi: 72, // 1pt = 1px, so font sizes match the card's CSS pixels
      spacing: Math.max(0, Math.round(size * (lineHeight - 1.25))),
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { src: `data:image/png;base64,${data.toString("base64")}`, width: info.width, height: info.height };
}

/**
 * Text for a card, in either language. The card renderer can't lay out Arabic
 * properly — it measures letters unjoined, so word gaps come out uneven, and it
 * has no right-to-left ordering for lines that mix Arabic with numbers
 * ("13,800,000 جنيه"). Arabic is therefore drawn separately, with proper
 * shaping, and placed on the card as an image. Layout styles (margins) still apply.
 */
export async function ogText(rtl: boolean, text: string, style: CSSProperties) {
  if (!rtl) return <div style={{ display: "flex", ...style }}>{text}</div>;
  // Keep only the margins that are set — the renderer crashes on undefined style values.
  const margins = Object.fromEntries(
    (["margin", "marginTop", "marginBottom"] as const).filter((k) => style[k] !== undefined).map((k) => [k, style[k]]),
  );
  try {
    const img = await arabicImage(text, style);
    return (
      <div style={{ display: "flex", ...margins }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} width={img.width} height={img.height} alt="" />
      </div>
    );
  } catch (err) {
    // Fall back to the card renderer's own text — imperfect spacing beats a missing line.
    console.warn("[og] Arabic text rendering failed:", (err as Error).message);
    return <div style={{ display: "flex", ...style }}>{text}</div>;
  }
}
