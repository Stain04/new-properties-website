import { photos } from "@/lib/images";

/* ─────────────────────────────────────────────
   Services
   ───────────────────────────────────────────── */

export const services = [
  {
    id: "buying",
    number: "01",
    title: "Buying advisory",
    short: "Finding and securing the right asset",
    blurb:
      "We shortlist against your brief, not our inventory. That includes telling you when the right answer is a property we do not represent.",
    body: [
      "Most agencies show you what they hold. We start from what you are trying to achieve — a residence you will use, an income asset, a hedge against currency — and work backwards to the properties that actually serve it.",
      "That means off-market stock through our developer relationships, honest comparables on anything you are considering, and a written view on price before you make an offer rather than after.",
    ],
    deliverables: [
      "Written brief and shortlist within five working days",
      "Access to off-market and pre-release inventory",
      "Independent comparable analysis on every shortlisted unit",
      "Negotiation handled on your behalf",
      "Accompanied or video viewings if you are abroad",
    ],
    image: photos.consultation,
  },
  {
    id: "selling",
    number: "02",
    title: "Selling & disposal",
    short: "Achieving the price the asset deserves",
    blurb:
      "Professional photography, a realistic valuation, and a marketing reach that extends well beyond the local buyer pool.",
    body: [
      "The gap between a well-marketed property and a poorly marketed one in Egypt is routinely fifteen to twenty per cent. Photography, floor plans, an accurate valuation and genuine international distribution are not luxuries — they are what separates a sale from a listing.",
      "We give you a valuation we can defend with comparables, and we will tell you if your expectation is unrealistic before we take the instruction rather than six months into it.",
    ],
    deliverables: [
      "Evidence-based valuation with full comparables",
      "Professional photography, floor plans and video",
      "Listing across international and regional portals",
      "Direct marketing to our registered buyer database",
      "Qualified viewings only — we screen before we book",
    ],
    image: photos.meeting,
  },
  {
    id: "legal",
    number: "03",
    title: "Legal & conveyancing",
    short: "Title, contracts and registration",
    blurb:
      "In-house counsel handling green contracts, foreign ownership approvals and court registration from offer to keys.",
    body: [
      "Egyptian conveyancing has specific failure modes: unregistered chains of title, developer contracts that never reach the real estate registry, and approvals that foreign buyers are not told they need until the transfer stalls.",
      "Our counsel checks title and encumbrances before you commit funds, drafts or reviews the contract, and carries the registration through to a validated green contract in your name.",
    ],
    deliverables: [
      "Title and encumbrance search before any payment",
      "Contract drafting and review",
      "Foreign ownership approvals where required",
      "Registration to a validated green contract",
      "Power of attorney arrangements for remote buyers",
    ],
    image: photos.signing,
  },
  {
    id: "management",
    number: "04",
    title: "Property management",
    short: "Ownership without being in the country",
    blurb:
      "Utilities, service charges, maintenance, inspections and tenancy handling for owners who live somewhere else.",
    body: [
      "The majority of our owners are not in Egypt for most of the year. Management exists so that this is a non-issue: bills paid, service charges audited, the property inspected on a schedule and photographed for you.",
      "Where the property is let, we handle tenant sourcing, vetting, the tenancy agreement, collection and renewals, and we report monthly.",
    ],
    deliverables: [
      "Utilities and service charges paid and reconciled",
      "Scheduled inspections with photographic reports",
      "Maintenance coordination with vetted contractors",
      "Tenant sourcing, vetting and rent collection",
      "Monthly owner statement",
    ],
    image: photos.aboutDetail,
  },
  {
    id: "interiors",
    number: "05",
    title: "Interiors & furnishing",
    short: "Rental-ready, or genuinely finished",
    blurb:
      "Turnkey specification, procurement and installation — from a letting package to a full bespoke fit-out.",
    body: [
      "A semi-finished property is not an asset until it is finished, and the difference between a competent furnishing package and a cheap one shows up directly in the nightly rate it achieves.",
      "We run two tracks: a costed rental-ready package with a fixed price and a four-week delivery, and full bespoke design for principal residences.",
    ],
    deliverables: [
      "Fixed-price rental-ready packages from €8,500",
      "Full bespoke design and project management",
      "Procurement, customs, delivery and installation",
      "Kitchen and joinery specification",
      "Handover photography for listing use",
    ],
    image: photos.living[0],
  },
  {
    id: "investment",
    number: "06",
    title: "Investment structuring",
    short: "Yield, exit and currency",
    blurb:
      "Modelled returns, portfolio construction and a considered view on how and when you get your capital back out.",
    body: [
      "Gross yield is the number everyone quotes and the least useful one. We model net of service charge, management, void periods, furnishing amortisation and realistic occupancy — and we show you the workings.",
      "We also plan the exit at the point of entry: who the resale buyer is, what the liquidity looks like in that specific compound, and how proceeds are repatriated.",
    ],
    deliverables: [
      "Net yield modelling with stated assumptions",
      "Portfolio construction across areas and currencies",
      "Exit and liquidity analysis before purchase",
      "Repatriation and banking guidance",
      "Annual portfolio review",
    ],
    image: photos.marina,
  },
] as const;

/* ─────────────────────────────────────────────
   Why us
   ───────────────────────────────────────────── */

export const advantages = [
  {
    number: "01",
    title: "We are paid to be right, not to be enthusiastic",
    body: "Our advisers are not on listing-level commission. If the best outcome is a property we do not represent, or no purchase at all this year, that is what you will hear.",
  },
  {
    number: "02",
    title: "Both markets, one firm",
    body: "Red Sea resort stock and Greater Cairo compounds behave completely differently. We cover both properly, which means we can tell you which one your objective actually belongs in.",
  },
  {
    number: "03",
    title: "Legal work is in-house",
    body: "Title searches, contracts and registration are handled by our own counsel, not referred out. Nothing gets lost between two firms who each assumed the other was handling it.",
  },
  {
    number: "04",
    title: "Developer diligence you can read",
    body: "We keep delivery records on every developer we list — what was promised, what was handed over, and how late. You get the file, not a verbal reassurance.",
  },
  {
    number: "05",
    title: "We are there after completion",
    body: "Management, letting, furnishing and resale are the same firm and the same people. The relationship does not end at the keys, which is precisely when most buyers need it most.",
  },
];

/* ─────────────────────────────────────────────
   Statistics
   ───────────────────────────────────────────── */

export const stats = [
  { value: 2800, suffix: "+", label: "Transactions completed", note: "Since 2009" },
  { value: 41, suffix: "", label: "Nationalities advised", note: "Buyers from across Europe, the Gulf and North America" },
  { value: 94, suffix: "%", label: "Client retention", note: "Buyers who return or refer" },
  { value: 16, suffix: "", label: "Years in the market", note: "Through three currency cycles" },
];

/* ─────────────────────────────────────────────
   Investment case
   ───────────────────────────────────────────── */

export const investmentReasons = [
  {
    number: "01",
    title: "Entry pricing against comparable coastlines",
    body: "Red Sea beachfront trades at a fraction of equivalent product in southern Europe or the Gulf, with the same flight times from most European capitals.",
  },
  {
    number: "02",
    title: "Freehold ownership for foreign buyers",
    body: "Non-Egyptians may own residential property outright, subject to straightforward limits. There is no requirement for a local partner or nominee structure.",
  },
  {
    number: "03",
    title: "Developer financing at zero interest",
    body: "Payment plans of five to ten years, interest-free, are standard rather than exceptional. Capital is deployed gradually while the asset appreciates.",
  },
  {
    number: "04",
    title: "A hard-currency rental market",
    body: "Coastal short lets are priced and paid in euros and dollars, which insulates rental income from local currency movement.",
  },
  {
    number: "05",
    title: "Tourism volumes that keep expanding",
    body: "Direct flights into Hurghada now serve more than forty European cities, and arrivals have set successive records. Occupancy follows air capacity.",
  },
];

/* ─────────────────────────────────────────────
   Process
   ───────────────────────────────────────────── */

export const process = [
  {
    step: "01",
    title: "Brief",
    body: "A conversation about objective, budget, timeline and how you intend to use the property. No listings yet.",
  },
  {
    step: "02",
    title: "Shortlist",
    body: "A written shortlist with comparables and our reasoning, usually within five working days. Typically four to seven properties.",
  },
  {
    step: "03",
    title: "Viewing",
    body: "Accompanied viewings over one or two days, or full video walkthroughs with live commentary if you are abroad.",
  },
  {
    step: "04",
    title: "Diligence",
    body: "Title search, encumbrance check, developer delivery record and service charge history — before any money moves.",
  },
  {
    step: "05",
    title: "Offer & contract",
    body: "We negotiate, then our counsel drafts or reviews the contract and agrees the payment schedule.",
  },
  {
    step: "06",
    title: "Registration",
    body: "Carried through to a validated green contract in your name, with a power of attorney if you cannot attend.",
  },
  {
    step: "07",
    title: "Handover",
    body: "Snagging, utilities connected, furnishing installed if commissioned, and management set up if you want it.",
  },
];

/* ─────────────────────────────────────────────
   Developers we work with
   ───────────────────────────────────────────── */

export const developers = [
  "Orascom Development",
  "Palm Hills",
  "Emaar Misr",
  "SODIC",
  "Talaat Moustafa Group",
  "Tatweer Misr",
  "Hyde Park",
  "Misr Italia",
  "Mountain View",
  "Al Ahly Sabbour",
  "La Vista",
  "Marakez",
];

/* ─────────────────────────────────────────────
   Testimonials
   ───────────────────────────────────────────── */

export const testimonials = [
  {
    quote:
      "They talked me out of the first property I wanted to buy. Eighteen months later I understood why, and I have since bought two through them.",
    name: "Markus Reinhardt",
    detail: "Bought in El Gouna and Sahl Hasheesh",
    origin: "Munich, Germany",
    image: photos.team.m6,
  },
  {
    quote:
      "I bought entirely remotely. Video viewings, a power of attorney, and the registered contract arrived by courier. At no point did I feel I was guessing.",
    name: "Claire Devereux",
    detail: "Bought in Makadi Bay",
    origin: "Lyon, France",
    image: photos.team.f6,
  },
  {
    quote:
      "The legal side was the reason we chose them. Our previous purchase in Egypt took four years to register. This one took eleven weeks.",
    name: "Ahmed & Farida Selim",
    detail: "Bought in New Cairo",
    origin: "Dubai, UAE",
    image: photos.team.m4,
  },
  {
    quote:
      "They manage two apartments for us and we have not been to Egypt in three years. The statements arrive monthly and the figures have never surprised me.",
    name: "Elena Voronova",
    detail: "Owns and lets in Hurghada",
    origin: "Riga, Latvia",
    image: photos.team.f5,
  },
  {
    quote:
      "I asked for the developer's delivery record and they sent a twelve-page file the same afternoon. That is not normal in this market.",
    name: "Jonathan Pike",
    detail: "Bought off-plan in the New Capital",
    origin: "London, United Kingdom",
    image: photos.team.m2,
  },
];

/* ─────────────────────────────────────────────
   FAQ
   ───────────────────────────────────────────── */

export const faqGroups = [
  {
    title: "Buying in Egypt",
    items: [
      {
        q: "Can a foreigner own property in Egypt outright?",
        a: "Yes. Non-Egyptians may own residential property freehold, subject to limits under Law 230 of 1996 — generally up to two properties for personal or family use, each under 4,000 m². No local partner or nominee is required. Certain areas, principally Sinai, operate on long leasehold instead, and we will tell you clearly which regime applies before you commit.",
      },
      {
        q: "What is a green contract, and why does it matter so much?",
        a: "A green contract is a court-validated title deed registered at the real estate registry. It is the only form of ownership that is fully enforceable against third parties. A great many Egyptian properties change hands on unregistered preliminary contracts, which are cheaper and faster but leave you exposed. We register every purchase we handle.",
      },
      {
        q: "What documents do I need as a foreign buyer?",
        a: "A valid passport, a tax identification number from your home country, and proof of the source of funds for the transfer. For registration we also need a security clearance which we obtain on your behalf. If you are buying remotely, a notarised and legalised power of attorney replaces your physical presence.",
      },
      {
        q: "Do I need an Egyptian bank account?",
        a: "Not to buy. Funds can be transferred directly to the seller or developer through the banking system, and the inward transfer certificate is part of your registration file. An Egyptian account is useful afterwards for utilities, service charges and receiving rent, and we will help you open one.",
      },
      {
        q: "Can I complete the whole purchase without travelling to Egypt?",
        a: "Yes, and a meaningful share of our clients do. We run live video viewings with commentary, send full photographic and structural reports, and act under a power of attorney for signature and registration. You receive the registered contract by courier.",
      },
      {
        q: "What are the total costs on top of the purchase price?",
        a: "Budget roughly 4 to 7 per cent of the price. That covers registration fees, legal fees, the real estate tax registration and, where applicable, developer transfer or maintenance deposits. We issue a written cost breakdown with every shortlist so there are no late surprises.",
      },
    ],
  },
  {
    title: "Owning, letting and taxes",
    items: [
      {
        q: "What tax does a property owner pay in Egypt?",
        a: "An annual real estate tax of 10 per cent of the assessed annual rental value, after a statutory deduction for maintenance and a generous exemption threshold that many residential units fall below entirely. Rental income is taxable on a progressive scale after allowable deductions. We are advisers, not tax counsel, and we will refer you to a specialist for anything structural.",
      },
      {
        q: "What yields are realistic?",
        a: "On the Red Sea, 7 to 11 per cent gross is achievable on well-located short-let stock, and Makadi Bay currently sits at the top of that range. In Greater Cairo, long lets typically produce 6 to 8 per cent. We model net rather than gross — after service charge, management, voids and furnishing amortisation — and we show the assumptions.",
      },
      {
        q: "Can I let the property while I am abroad?",
        a: "Yes. Our management team handles marketing, tenant vetting, key handling, cleaning, maintenance and collection, and reports to you monthly. Some compounds restrict short letting, which we always confirm in writing before you buy rather than after.",
      },
      {
        q: "How do I get rental income or sale proceeds out of Egypt?",
        a: "Through the formal banking channel. The critical step happens at purchase: your inward transfer must be documented so that the outward transfer is straightforward later. Buyers who move money informally on the way in are the ones who struggle on the way out.",
      },
    ],
  },
  {
    title: "Selling and working with us",
    items: [
      {
        q: "How do you value a property for sale?",
        a: "From recorded comparable transactions in the same compound or district, adjusted for floor, view, finish, orientation and title status, then sense-checked against current live inventory. You receive the comparables, not just a number.",
      },
      {
        q: "What does it cost to sell through you?",
        a: "A commission agreed in advance, inclusive of professional photography, floor plans, video, portal distribution and direct marketing to our buyer database. There are no separate marketing charges and no upfront fees.",
      },
      {
        q: "Are you tied to particular developers?",
        a: "We hold agency agreements with several, which is how we access pre-release pricing. Our advisers are not compensated differently between developers, and we will list resale and off-market stock alongside new-build when it is the better answer for you.",
      },
      {
        q: "What languages does your team work in?",
        a: "Arabic and English throughout, with advisers who also work in German, French, Russian, Italian and Spanish. Contracts are prepared bilingually in Arabic and English.",
      },
    ],
  },
];
