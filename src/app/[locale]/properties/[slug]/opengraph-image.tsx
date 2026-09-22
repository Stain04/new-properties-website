import { isLocale, type Locale } from "@/i18n/config";
import { getProperty } from "@/i18n/data";
import { getDictionary } from "@/i18n/dictionaries";
import { formatArea } from "@/i18n/format";
import { fill, OG_COLORS, OG_SIZE, OgBrand, OgText, photoDataUri, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/jpeg";
export const alt = "Property on New Properties";

/** Keep long titles to two lines — the renderer can't ellipsise. */
const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

/** The preview card for a single listing: its cover photo, title, price and key specs. */
export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const dict = getDictionary(locale);
  const p = await getProperty(locale, slug);

  // Unknown slug: a plain branded card rather than an error.
  if (!p) {
    return renderOg(
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: OG_COLORS.ink }}>
        <OgBrand size={1.4} />
      </div>,
    );
  }

  const photo = await photoDataUri(p.images[0]);
  const specs = [
    p.bedrooms > 0 ? `${p.bedrooms} ${dict.card.bedrooms}` : null,
    `${p.bathrooms} ${dict.card.bathrooms}`,
    formatArea(locale, p.size),
  ]
    .filter(Boolean)
    .join("  ·  ");
  const chips = [p.purpose === "sale" ? dict.property.forSale : dict.property.toLet, p.typeLabel, p.areaName];
  const text = ar ? "Plex Arabic" : "Manrope";
  const align = ar ? "flex-end" : "flex-start";

  return renderOg(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: OG_COLORS.ink }}>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} width={1200} height={630} alt="" style={{ ...fill, objectFit: "cover" }} />
      )}
      <div
        style={{
          ...fill,
          display: "flex",
          backgroundImage:
            "linear-gradient(0deg, rgba(5,8,11,0.97) 0%, rgba(5,8,11,0.88) 34%, rgba(5,8,11,0.35) 62%, rgba(5,8,11,0.55) 100%)",
        }}
      />

      <div
        style={{
          ...fill,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: align,
          padding: "52px 64px",
        }}
      >
        <OgBrand size={0.8} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: align, width: "100%" }}>
          <div style={{ display: "flex", gap: 10, flexDirection: ar ? "row-reverse" : "row" }}>
            {chips.map((c, i) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 999,
                  fontFamily: text,
                  fontWeight: ar ? 500 : 600,
                  fontSize: 20,
                  color: i === 0 ? OG_COLORS.ink : OG_COLORS.bone,
                  background: i === 0 ? OG_COLORS.gold : "rgba(255,255,255,0.12)",
                  border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.28)",
                }}
              >
                {ar ? <OgText rtl text={c} style={{}} /> : c}
              </div>
            ))}
          </div>

          <OgText
            rtl={ar}
            text={clip(p.title, ar ? 60 : 64)}
            style={{
              marginTop: 22,
              maxWidth: 1060,
              fontFamily: ar ? "Plex Arabic" : "Fraunces",
              fontWeight: ar ? 700 : 400,
              fontSize: ar ? 50 : 56,
              lineHeight: ar ? 1.4 : 1.1,
              letterSpacing: ar ? 0 : -1,
              color: OG_COLORS.bone,
            }}
          />

          <div
            style={{
              display: "flex",
              width: "100%",
              marginTop: 26,
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexDirection: ar ? "row-reverse" : "row",
            }}
          >
            <OgText
              rtl={ar}
              text={p.priceText}
              style={{
                fontFamily: ar ? "Plex Arabic" : "Fraunces",
                fontWeight: ar ? 700 : 300,
                fontSize: ar ? 54 : 60,
                lineHeight: 1,
                color: OG_COLORS.goldLight,
              }}
            />
            <OgText
              rtl={ar}
              text={specs}
              style={{ fontFamily: text, fontWeight: ar ? 500 : 600, fontSize: 24, color: "rgba(251,249,246,0.82)" }}
            />
          </div>
        </div>
      </div>
    </div>,
  );
}
