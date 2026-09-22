# New Properties — Premium Real Estate Website

> Real Estate In New Cairo, TMG Group, New Capital City ( Residential, Commercial, Admin )

A production-ready, white-label real estate website built with **Next.js 16**, **React 19**,
**TypeScript** and **Tailwind CSS v4**.

> ### ⚠ Brand and inventory are currently out of step
>
> The brand layer — name, positioning line, hero, contact details, metadata — is set to
> **New Properties**, focused on New Cairo, TMG Group and the New Capital.
>
> The **demo inventory has not been refocused yet.** The listings (manage them at `/admin`)
> and `src/data/areas.ts` still carry 17 Red Sea listings (El Gouna, Hurghada, Sahl Hasheesh,
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

Agency name, tagline, phone, WhatsApp, email, both office addresses and opening hours, and
social links. Their Arabic versions live in `src/i18n/content/ar/site.ts`; menu labels live in
the UI dictionaries.

### 2. Colours and typography — `src/app/globals.css`

The palette is defined once at the top of the file, in the `@theme` block:

```css
--color-ink-950:  #05080b;   /* deep neutral base   */
--color-bone-50:  #fbf9f6;   /* warm paper          */
--color-gold-500: #c0a06b;   /* primary accent      */
```

Change those values and the entire site follows — buttons, borders, hovers, dark sections.
Fonts are swapped in `src/app/[locale]/layout.tsx` (Fraunces and Manrope for English,
Alexandria and IBM Plex Sans Arabic for Arabic).

### 3. Photography — `src/lib/images.ts`

Every image on the site resolves through this one file. To use the agency's own photography:

1. Drop the files into `public/photos/`
2. Change the value, e.g. `heroCairo: "/photos/hero-new-cairo.jpg"`

Local files are automatically optimised, resized and converted to AVIF/WebP by Next.js.
See "Image handling" below for why.

### 4. Listings, team and copy

| File | Contains |
| --- | --- |
| `data/listings.json` | All property listings, English and Arabic — **edit them in the admin panel** (see below) |
| `src/data/areas.ts` | The eight destination/market guides |
| `src/data/team.ts` | Advisers, their specialisms, languages and direct lines |
| `src/data/content.ts` | Services, FAQ, testimonials, statistics, process, developers |

Every page reads listings through the getters in `src/i18n/data.ts` (`getProperties`,
`getProperty`, `getSimilar`, …), which pick the right language for each field.

### The logo

`src/components/site/Logo.tsx` renders a typographic wordmark. Replace its markup with an
`<Image>` when the agency supplies a drawn logo; it is the only place the mark appears.

---

## English and Arabic

The site is fully bilingual. English lives at the root (`/properties`), Arabic under
`/ar` (`/ar/properties`), and the header switch moves between the two while keeping the
visitor on the same page with the same filters. Arabic pages are right-to-left, use Arabic
typefaces (Alexandria for headings, IBM Plex Sans Arabic for text), and are written in a
polished Egyptian register.

| What | Where |
| --- | --- |
| Buttons, labels, headings, page copy | `src/i18n/dictionaries/en.ts` and `ar.ts` — identical keys |
| Listings, destinations, team, services, FAQ in Arabic | `src/i18n/content/ar/` — keyed by slug |
| Brand details in Arabic (offices, positioning line) | `src/i18n/content/ar/site.ts` |
| Merging English data with Arabic text | `src/i18n/data.ts` — every page reads data through these getters |
| Routing (`/ar` prefix, English at the root) | `src/proxy.ts` |

**Numbers, prices, specs and photos are never duplicated.** The Arabic files hold only
words; everything else comes from the English data files. A listing added without an Arabic
translation still appears on the Arabic site, in English, rather than breaking.

**TypeScript enforces completeness.** If `ar.ts` is missing a key that `en.ts` has, the
build fails and names the missing string.

**Plurals** use the browser's own rules (`Intl.PluralRules`), so Arabic gets the right form
automatically: عقار واحد، عقارين، ٣ عقارات، ١١ عقار.

To write Arabic-safe components: use `ms-/me-/ps-/pe-/start-/end-` instead of
`ml-/mr-/pl-/pr-/left-/right-`, add `rtl:-scale-x-100` to directional arrow icons, and
import `Link` from `@/i18n/Link` rather than `next/link` so links stay in the visitor's
language.

---

## Managing listings (the admin panel)

Agencies add, edit and remove listings themselves at **`/admin`** — no code, no developer.

- **Log in** with the password set in `ADMIN_PASSWORD`.
- **Add listing** → drag in photos, fill the details, write the English, optionally the
  Arabic, then **Publish**. It appears on the site in both languages within seconds.
- **Edit** any listing, reorder photos, choose the cover, change the price.
- **Quick changes** from the list: star a listing to feature it on the homepage, mark it
  Reserved or Sold, or delete it (with a confirmation).
- A listing without Arabic still shows on the Arabic site, in English. The list flags
  which listings are missing Arabic.

### Setting it up for an agency

1. Copy `.env.example` to `.env.local` and set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`
   (the file explains how to generate the secret). On a host like Vercel, add the same
   values under the project's *Environment Variables* instead.
2. That's enough on a computer or a VPS: listings are saved to `data/listings.json` and
   photos to `data/uploads/`.
3. **On Vercel (or any host with a read-only disk)** listings must live in the cloud:
   - Create a free project at [supabase.com](https://supabase.com).
   - In *Project Settings → API*, copy the **Project URL** and the **service_role** key
     into `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
   - Run `npm run setup:supabase` once. It creates a storage bucket and uploads the current
     listings — and any photos uploaded locally. No database tables are needed.
   - Add the same three variables to the host and redeploy.

The admin header shows **Local storage** or **Cloud storage** so it's always clear where
changes are going.

> The `service_role` key is a master key for that Supabase project. It is only ever used
> on the server — never sent to the browser — but keep it out of git, chats and screenshots.

### How it's built

| Piece | Where |
| --- | --- |
| Listing shape and validation (runs on every save) | `src/lib/listings/schema.ts` |
| Storage — local files or Supabase, chosen automatically | `src/lib/listings/` |
| Login (signed, http-only cookie, 7 days) | `src/lib/admin/auth.ts` |
| Admin pages and form | `src/app/admin/`, `src/components/admin/` |
| Save / delete / quick-change actions | `src/app/admin/actions.ts` |
| Photo upload endpoint | `src/app/api/admin/upload/route.ts` |

Every admin page and action re-checks the login on the server. Saving triggers a rebuild of
the affected pages, so the public site stays fast (static) and still shows changes at once.

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

- **Site address.** Link previews, the sitemap and Google data use the live domain. On
  Vercel it is detected automatically; on any other host set `NEXT_PUBLIC_SITE_URL`.
- **Link previews.** Every page has a branded share card, and each listing gets its own
  (photo, title, price, specs) in the visitor's language — see `src/lib/og.tsx`. WhatsApp
  caches previews per link: to see a new card on a link already shared, add `?v=2` to it.
- **Vercel** is the path of least resistance (`vercel deploy`); any Node host works with
  `npm run build && npm start`. On Vercel, connect Supabase before using the admin — see
  *Managing listings*.
- **Environment variables** are listed, with explanations, in `.env.example`.
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
- 97 pages (both languages) prerendered as static HTML at build time; only the filtered catalogue is dynamic
