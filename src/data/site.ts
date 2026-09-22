/**
 * ─────────────────────────────────────────────────────────────
 *  BRAND CONFIGURATION
 *  This is the only file you need to edit to rebrand the site
 *  for a different agency: name, contact details, offices and
 *  social links all come from here. Arabic text for these fields
 *  lives in src/i18n/content/ar/site.ts; menu labels live in the
 *  UI dictionaries (src/i18n/dictionaries/).
 * ─────────────────────────────────────────────────────────────
 */

/**
 * The public address of the site, used for share previews, the sitemap and
 * search-engine data. Set NEXT_PUBLIC_SITE_URL to override; on Vercel the
 * production domain is picked up automatically.
 */
function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const site = {
  name: "New Properties",
  nameLine1: "New",
  nameLine2: "Properties",
  legalName: "New Properties Real Estate",
  /** Short lock-up line under the wordmark. */
  tagline: "Real Estate",
  descriptor: "Private Client Property Advisory",
  /** The agency's positioning line, shown on the hero, in the footer and in metadata. */
  positioning:
    "Real Estate In New Cairo, TMG Group, New Capital City ( Residential, Commercial, Admin )",
  established: 2009,

  meta: {
    title: "New Properties — Real Estate in New Cairo & the New Capital",
    // Kept short: this is the grey line under the title in WhatsApp and Google.
    description:
      "Hand-picked homes, offices and investments in New Cairo, TMG Group communities and the New Capital — verified and registered for you.",
    url: siteUrl(),
    locale: "en_EG",
  },

  contact: {
    phoneDisplay: "011 XXXX XXXX",
    phoneHref: "011XXXXXXXX",
    whatsappDisplay: "011 XXXX XXXX",
    whatsapp: "2011XXXXXXXX",
    // Demo placeholders — anonymised so the site can be shown to prospective agencies.
    email: "info@example.com",
    salesEmail: "sales@example.com",
  },

  offices: [
    {
      city: "New Cairo",
      label: "Head Office",
      lines: ["90th Street North, Fifth Settlement", "New Cairo 11835, Cairo Governorate"],
      hours: ["Sunday – Thursday, 10:00 – 19:00", "Saturday by appointment"],
      phone: "011 XXXX XXXX",
      mapQuery: "90th Street, New Cairo, Egypt",
      /** OpenStreetMap embed bounds: minLng, minLat, maxLng, maxLat */
      mapBbox: "31.43,29.97,31.55,30.04",
    },
    {
      city: "New Capital City",
      label: "New Capital Office",
      lines: ["Downtown District, Central Business District", "New Administrative Capital, Egypt"],
      hours: ["Sunday – Thursday, 10:00 – 18:00", "Saturday by appointment"],
      phone: "011 XXXX XXXX",
      mapQuery: "Downtown District, New Administrative Capital, Egypt",
      mapBbox: "31.68,29.96,31.80,30.06",
    },
  ],

  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
} as const;
