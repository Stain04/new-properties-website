import { isLocale, type Locale } from "@/i18n/config";
import { getSite } from "@/i18n/data";
import { getDictionary } from "@/i18n/dictionaries";
import { photos } from "@/lib/images";
import { fill, OG_COLORS, OG_SIZE, OgBrand, OgText, photoDataUri, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/jpeg";
export const alt = "New Properties — Real Estate in New Cairo & the New Capital";

/** The preview card shown when the homepage (or any page without its own card) is shared. */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const raw = (await params).locale;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const site = getSite(locale);
  const hero = getDictionary(locale).hero;
  const photo = await photoDataUri(photos.newCairoAlt);
  const host = site.meta.url.replace(/^https?:\/\//, "");

  const tags = ar ? ["سكني", "تجاري", "إداري"] : ["Residential", "Commercial", "Administrative"];
  const places = ar
    ? "القاهرة الجديدة · مشروعات طلعت مصطفى · العاصمة الإدارية"
    : "New Cairo  ·  TMG Group  ·  New Capital";

  const headline = {
    fontFamily: ar ? "Plex Arabic" : "Fraunces",
    fontWeight: ar ? 700 : 300,
    fontSize: ar ? 70 : 82,
    lineHeight: ar ? 1.4 : 1.02,
    letterSpacing: ar ? 0 : -2,
  } as const;

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
          backgroundImage: `linear-gradient(${ar ? 270 : 90}deg, rgba(5,8,11,0.95) 0%, rgba(5,8,11,0.8) 45%, rgba(5,8,11,0.3) 100%)`,
        }}
      />

      <div
        style={{
          ...fill,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: ar ? "flex-end" : "flex-start",
          padding: "64px 72px",
        }}
      >
        <OgBrand />

        <div style={{ display: "flex", flexDirection: "column", alignItems: ar ? "flex-end" : "flex-start" }}>
          <OgText rtl={ar} text={hero.lineOne} style={{ ...headline, color: OG_COLORS.bone }} />
          <OgText rtl={ar} text={hero.lineTwo} style={{ ...headline, color: OG_COLORS.goldLight }} />
          <div style={{ display: "flex", width: 96, height: 2, background: OG_COLORS.gold, margin: "30px 0 24px" }} />
          <OgText
            rtl={ar}
            text={places}
            style={{ fontFamily: ar ? "Plex Arabic" : "Manrope", fontWeight: ar ? 500 : 600, fontSize: 28, color: "rgba(251,249,246,0.85)" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: ar ? "row-reverse" : "row",
          }}
        >
          <div style={{ display: "flex", gap: 12, flexDirection: ar ? "row-reverse" : "row" }}>
            {tags.map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: "1.5px solid rgba(210,184,132,0.6)",
                  background: "rgba(5,8,11,0.35)",
                  color: OG_COLORS.goldLight,
                  fontFamily: ar ? "Plex Arabic" : "Manrope",
                  fontWeight: ar ? 500 : 600,
                  fontSize: 22,
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontFamily: "Manrope", fontWeight: 600, fontSize: 22, color: "rgba(251,249,246,0.65)" }}>
            {host}
          </div>
        </div>
      </div>
    </div>,
  );
}
