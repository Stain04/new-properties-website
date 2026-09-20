/**
 * ─────────────────────────────────────────────────────────────
 *  BRAND CONFIGURATION
 *  This is the only file you need to edit to rebrand the site
 *  for a different agency: name, contact details, offices,
 *  social links and navigation all come from here.
 * ─────────────────────────────────────────────────────────────
 */

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
    description:
      "Real Estate In New Cairo, TMG Group, New Capital City ( Residential, Commercial, Admin ). Curated residences, verified developers and end-to-end legal support for buyers and investors in Egypt.",
    // ⚠ Replace with the live domain before launch — this feeds the
    // sitemap, the Open Graph tags and the structured data.
    url: "https://newproperties.example.com",
    locale: "en_EG",
  },

  contact: {
    phoneDisplay: "+20 11 48238883",
    phoneHref: "+201148238883",
    whatsappDisplay: "+20 11 48238883",
    whatsapp: "201148238883",
    // ⚠ Placeholder addresses — replace with the agency's real inboxes.
    email: "info@newproperties.eg",
    salesEmail: "sales@newproperties.eg",
  },

  offices: [
    {
      city: "New Cairo",
      label: "Head Office",
      lines: ["90th Street North, Fifth Settlement", "New Cairo 11835, Cairo Governorate"],
      hours: ["Sunday – Thursday, 10:00 – 19:00", "Saturday by appointment"],
      phone: "+20 11 48238883",
      mapQuery: "90th Street, New Cairo, Egypt",
      /** OpenStreetMap embed bounds: minLng, minLat, maxLng, maxLat */
      mapBbox: "31.43,29.97,31.55,30.04",
    },
    {
      city: "New Capital City",
      label: "New Capital Office",
      lines: ["Downtown District, Central Business District", "New Administrative Capital, Egypt"],
      hours: ["Sunday – Thursday, 10:00 – 18:00", "Saturday by appointment"],
      phone: "+20 11 48238883",
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

export const nav = [
  { label: "Properties", href: "/properties" },
  { label: "Destinations", href: "/destinations" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = [
  {
    title: "Browse",
    links: [
      { label: "All properties", href: "/properties" },
      { label: "For sale", href: "/properties?purpose=sale" },
      { label: "For rent", href: "/properties?purpose=rent" },
      { label: "Exclusive listings", href: "/properties?exclusive=1" },
      { label: "Destinations", href: "/destinations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our team", href: "/about#team" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Advisory",
    links: [
      { label: "Buying in Egypt", href: "/services#buying" },
      { label: "Selling your property", href: "/services#selling" },
      { label: "Property management", href: "/services#management" },
      { label: "Legal & conveyancing", href: "/services#legal" },
      { label: "Interiors & furnishing", href: "/services#interiors" },
    ],
  },
] as const;
