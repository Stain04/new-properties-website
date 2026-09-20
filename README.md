# New Properties — Premium Real Estate Website

> Real Estate In New Cairo, TMG Group, New Capital City ( Residential, Commercial, Admin )

A production-ready, white-label real estate website built with **Next.js 16**, **React 19**,
**TypeScript** and **Tailwind CSS v4**.

> ### ⚠ Brand and inventory are currently out of step
>
> The brand layer — name, positioning line, hero, contact details, metadata — is set to
> **New Properties**, focused on New Cairo, TMG Group and the New Capital.
>
> The **demo inventory has not been refocused yet.** `src/data/properties.ts` and
> `src/data/areas.ts` still carry 17 Red Sea listings (El Gouna, Hurghada, Sahl Hasheesh,
> Soma Bay, Makadi Bay) alongside the 15 Cairo ones, and five Red Sea destination guides.
> Until those are replaced, the catalogue contradicts the positioning line on the homepage.

---

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (also runs a full type check) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

---

## What's in it

| Route | Page |
| --- | --- |
| `/` | Homepage — cinematic hero, live search, featured listings, destinations, services, investment case, testimonials, FAQ |
| `/properties` | Full catalogue with live filtering, sorting and shareable filter URLs |
| `/properties/[slug]` | Property detail — gallery with lightbox, specs, payment plan, map, assigned adviser, enquiry form |
| `/destinations` | All eight markets, grouped by region |
| `/destinations/[slug]` | Market guide with the listings in that area |
| `/services` | Six service lines, process, full FAQ |
| `/about` | Story, principles, process, team |
| `/contact` | Enquiry form, both offices with maps, direct adviser lines |

Plus `sitemap.xml`, `robots.txt`, a custom 404, Open Graph metadata, and JSON-LD structured
data (`RealEstateAgent` on every page, `RealEstateListing` on each property).

---

## Rebranding it for a client

Everything a new agency needs to change lives in four files. **No component markup needs editing.**

### 1. Brand, contact details and offices — `src/data/site.ts`

Agency name, tagline, phone, WhatsApp, email, both office addresses and opening hours,
social links, and the navigation menus.

### 2. Colours and typography — `src/app/globals.css`

The palette is defined once at the top of the file, in the `@theme` block:

```css
--color-ink-950:  #05080b;   /* deep neutral base   */
--color-bone-50:  #fbf9f6;   /* warm paper          */
--color-gold-500: #c0a06b;   /* primary accent      */
```

Change those values and the entire site follows — buttons, borders, hovers, dark sections.
Fonts are swapped in `src/app/layout.tsx` (currently Fraunces for display, Manrope for UI).

### 3. Photography — `src/lib/images.ts`

Every image on the site resolves through this one file. To use the agency's own photography:

1. Drop the files into `public/photos/`
2. Change the value, e.g. `heroCairo: "/photos/hero-new-cairo.jpg"`

Local files are automatically optimised, resized and converted to AVIF/WebP by Next.js.
See "Image handling" below for why.

### 4. Listings, team and copy

| File | Contains |
| --- | --- |
| `src/data/properties.ts` | All property listings |
| `src/data/areas.ts` | The eight destination/market guides |
| `src/data/team.ts` | Advisers, their specialisms, languages and direct lines |
| `src/data/content.ts` | Services, FAQ, testimonials, statistics, process, developers |

Every page consumes listings through the selector functions at the bottom of
`properties.ts` (`propertyBySlug`, `byArea`, `similarTo`, …). To move to a CMS or database,
replace the `properties` array with your query and keep the selectors — nothing else changes.

### The logo

`src/components/site/Logo.tsx` renders a typographic wordmark. Replace its markup with an
`<Image>` when the agency supplies a drawn logo; it is the only place the mark appears.

---

## Connecting the enquiry form

`src/components/forms/LeadForm.tsx` currently validates, shows a sending state and a
confirmation, but does not transmit anywhere. The submit handler collects every field into a
plain object and marks the spot:

```ts
// ── Wire this to the agency's CRM, inbox or form service. ──
const data = Object.fromEntries(new FormData(e.currentTarget).entries());
```

Point that at a Next.js route handler, Resend/SendGrid, HubSpot, Zoho, or a form service such
as Formspree. The payload includes `name`, `email`, `phone`, `area`, `budget`, `message` and
`source` — `source` identifies which property or destination page the enquiry came from.

---

## Image handling

Placeholder photography is free-licence Unsplash imagery, served **directly from the source
CDN** rather than through Next's image optimizer. A custom loader
(`src/lib/imageLoader.ts`, wired up in `next.config.ts`) rewrites each request with the exact
width the browser needs.

This matters: with a hundred-odd images across the site, proxying every remote original
through the optimizer saturates its upstream fetch budget and images start failing to load.
Going straight to the CDN removes that failure mode entirely and costs nothing to serve.

**Local files are unaffected** — anything starting with `/` is handed back to Next's own
optimizer, so real agency photography in `public/photos/` gets full resizing, AVIF/WebP
conversion and caching. Swapping placeholders for real photos needs no configuration change.

> **Licensing:** the placeholder photographs are free to use under the Unsplash licence, but
> they are stock images of properties elsewhere in the world. Replace them with the agency's
> own photography before going live — a real estate site showing someone else's buildings is
> a commercial problem, not a technical one.

---

## Notes for deployment

- **Set the canonical URL.** `site.meta.url` in `src/data/site.ts` feeds the sitemap, the
  Open Graph tags and the structured data. It must be the real domain before launch.
- **Vercel** is the path of least resistance (`vercel deploy`); any Node host works with
  `npm run build && npm start`.
- **Maps** are OpenStreetMap embeds — no API key, no billing. Swap for Google Maps if the
  agency wants Street View or their own place listing.
- **Currencies.** Listings carry their own currency (EUR/USD/EGP). Filtering and sorting
  compare them through the approximate rates in `src/lib/format.ts` — review those before
  launch, or replace them with a live rate if the agency wants accuracy.
- **Placeholder content.** Team members, testimonials, phone numbers, addresses and the
  statistics are all invented for demonstration. Replace them before the site goes public.

---

## Project structure

```
src/
├── app/                       Routes (App Router)
│   ├── layout.tsx             Fonts, metadata, header/footer, structured data
│   ├── globals.css            Design system — the palette lives here
│   ├── page.tsx               Homepage
│   ├── properties/            Catalogue + detail pages
│   ├── destinations/          Market index + guides
│   ├── about|services|contact/
│   ├── sitemap.ts, robots.ts, not-found.tsx
├── components/
│   ├── site/                  Header, Footer, Logo, PageHero, ContactDock
│   ├── home/                  Hero, SearchBar, DestinationsShowcase, Testimonials
│   ├── property/              PropertyCard, Explorer (filters), Gallery
│   ├── forms/                 LeadForm
│   └── ui/                    Reveal, Counter, Accordion, Marquee
├── data/                      site, properties, areas, team, content
└── lib/                       types, format, images, imageLoader
```

---

## Accessibility and performance

- Skip-to-content link, focus-visible rings throughout, labelled form fields and icon buttons
- Full keyboard support in the gallery lightbox (arrows, Escape)
- `prefers-reduced-motion` disables all animation
- Scroll-reveal degrades safely — content already on screen, jumped past via an anchor, or
  rendered without JavaScript is shown immediately rather than staying hidden
- 51 pages prerendered as static HTML at build time; only the filtered catalogue is dynamic
