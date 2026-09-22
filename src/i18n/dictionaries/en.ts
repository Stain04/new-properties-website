/**
 * English UI strings. `ar.ts` must provide exactly the same keys —
 * the `Dictionary` type below makes a missing translation a build error.
 *
 * Placeholders use {braces} and are filled by `fmt()` in src/i18n/format.ts.
 * Plural forms follow Intl.PluralRules categories (one / two / few / many / other).
 */
/** Plural forms keyed by Intl.PluralRules category; only `other` is required. */
export type Plural = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
const plural = (forms: Plural): Plural => forms;

const en = {
  common: {
    skip: "Skip to content",
    home: "Home",
    bookConsultation: "Book a consultation",
    speakToAdviser: "Speak to an adviser",
    viewCatalogue: "View the catalogue",
    viewAllProperties: "View all properties",
    emailUs: "Email us",
    getInTouch: "Get in touch",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLanguage: "Switch language",
    est: "Est.",
  },

  nav: {
    properties: "Properties",
    destinations: "Destinations",
    services: "Services",
    about: "About",
    contact: "Contact",
  },

  footer: {
    since: "Advising private buyers, investors and families since {year}.",
    browse: "Browse",
    company: "Company",
    advisory: "Advisory",
    allProperties: "All properties",
    forSale: "For sale",
    forRent: "For rent",
    exclusives: "Exclusive listings",
    destinations: "Destinations",
    aboutUs: "About us",
    team: "Our team",
    services: "Services",
    contact: "Contact",
    buying: "Buying in Egypt",
    selling: "Selling your property",
    management: "Property management",
    legal: "Legal & conveyancing",
    interiors: "Interiors & furnishing",
    follow: "Follow",
    rights: "All rights reserved.",
    privacy: "Privacy policy",
    terms: "Terms of engagement",
    catalogue: "Full catalogue",
  },

  dock: {
    open: "Contact us",
    close: "Close contact options",
    whatsapp: "WhatsApp",
    call: "Call the desk",
    message: "Hello — I'd like to ask about a property on your website.",
  },

  hero: {
    lineOne: "Property in Egypt,",
    lineTwo: "advised properly.",
    lede: "Residential, commercial and administrative property — sourced, verified and registered by a single firm that stays with you after the keys change hands.",
    show: "Show {caption}",
    captions: ["Cairo — The Nile", "Cairo Skyline", "New Capital — Business District", "New Cairo — Compounds"],
    stats: [
      { value: "2,800+", label: "Transactions" },
      { value: "8", label: "Destinations" },
      { value: "16", label: "Years advising" },
    ],
  },

  search: {
    buy: "Buy",
    rent: "Rent",
    destination: "Destination",
    allEgypt: "All of Egypt",
    type: "Property type",
    anyType: "Any type",
    budget: "Budget",
    noMax: "No maximum",
    upTo: "Up to {amount}",
    perMonth: "{amount} / month",
    submit: "Search",
  },

  card: {
    exclusive: "Exclusive",
    reserved: "Reserved",
    sold: "Sold",
    plan: "{years}-year plan",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    area: "Internal area",
  },

  labels: {
    types: {
      Apartment: "Apartment",
      Penthouse: "Penthouse",
      Villa: "Villa",
      "Twin House": "Twin House",
      Townhouse: "Townhouse",
      Chalet: "Chalet",
      Studio: "Studio",
      Duplex: "Duplex",
      Office: "Office",
    },
    finishing: {
      "Fully finished": "Fully finished",
      "Semi-finished": "Semi-finished",
      "Core & shell": "Core & shell",
      Furnished: "Furnished",
    },
    regions: {
      "red-sea": "Red Sea",
      "greater-cairo": "Greater Cairo",
      "north-coast": "North Coast",
    },
    regionBlurbs: {
      "red-sea": "Coastal and resort residences",
      "greater-cairo": "Compounds and city residences",
      "north-coast": "Summer residences",
    },
    perMonth: "month",
    perNight: "night",
    sold: "Sold",
    sqm: "m²",
    listings: plural({ one: "{n} listing", other: "{n} listings" }),
    properties: plural({ one: "{n} property", other: "{n} properties" }),
    destinationsCount: plural({ one: "{n} destination", other: "{n} destinations" }),
  },

  form: {
    name: "Name",
    namePlaceholder: "Your full name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    phone: "Phone / WhatsApp",
    phonePlaceholder: "+20 …",
    area: "Area of interest",
    noPreference: "No preference yet",
    budget: "Budget",
    preferNot: "Prefer not to say",
    budgets: [
      "Under €75,000",
      "€75,000 – €150,000",
      "€150,000 – €350,000",
      "€350,000 – €750,000",
      "Above €750,000",
      "Renting, not buying",
    ],
    message: "What are you looking for?",
    messagePlaceholder: "Tell us what you have in mind — purpose, timing, anything that matters.",
    prefill: "I'd like more information about {subject}.",
    general: "General enquiry",
    send: "Send enquiry",
    sending: "Sending",
    privacy:
      "We reply within one working day. Your details are used only to answer this enquiry and are never passed to third parties.",
    sentTitle: "Enquiry received",
    sentBody:
      "An adviser will be in touch within one working day. If it is urgent, call the desk directly and ask for whoever covers your area.",
  },

  home: {
    whoEyebrow: "Who we are",
    whoTitle: "An advisory firm that happens to hold listings.",
    whoLede:
      "Most agencies in Egypt are distribution channels for whatever a developer is pushing that quarter. We were built the other way around — around the buyer, and around the uncomfortable questions nobody gets paid to answer.",
    whoBody:
      "Since {year} we have advised buyers from forty-one countries across Cairo's fastest-moving markets: the compound belt of New Cairo, TMG Group's flagship communities, and the residential, commercial and administrative districts of the New Administrative Capital. We handle the search, the diligence, the contract, the registration and — for most of our clients — the years of ownership that follow.",
    aboutFirm: "About the firm",
    howWeWork: "How we work",

    selectedEyebrow: "Selected residences",
    selectedTitle: "A short list, chosen rather than compiled.",

    developersEyebrow: "Developers we transact with",
    developersNote: "We hold delivery records on every one of them, and we will show you the file.",

    whyEyebrow: "Why clients stay",
    whyTitle: "What makes us different is mostly what we refuse to do.",
    retention: "of our buyers return to us or refer someone who does",
    portraitAlt: "A residence advised on by {name}",

    destinationsEyebrow: "Destinations",
    destinationsTitle: "Eight markets. They do not behave alike.",
    destinationsNote:
      "Yield, liquidity, buyer profile and title risk vary enormously between the Red Sea and Greater Cairo — and between neighbouring bays. Start with the objective, not the postcode.",

    numbersEyebrow: "By the numbers",
    numbersTitle: "Sixteen years, three currency cycles, one approach.",

    servicesEyebrow: "What we do",
    servicesTitle: "Six mandates, one relationship.",
    serviceDetail: "Service detail",

    investEyebrow: "The investment case",
    investTitle: "Five reasons capital keeps arriving in Egypt.",
    investLede:
      "Not a pitch — a summary of the structural facts that make the market work, and the ones you should test before committing.",
    investCta: "Request the investment brief",

    rentalsEyebrow: "Long and seasonal lets",
    rentalsTitle: "Renting first is rarely the wrong move.",
    rentalsAll: "All rentals",
    rentalsNote:
      "We tell most first-time buyers to spend a season in the area before they commit capital to it. These are the furnished properties we currently hold.",

    testimonialsEyebrow: "In their words",
    testimonialsTitle: "The clients who came back.",

    faqEyebrow: "Common questions",
    faqTitle: "What buyers ask before they commit.",
    faqLede:
      "Ownership rules, registration, tax and yields — answered plainly. If yours is not here, ask us directly.",
    askQuestion: "Ask a question",

    ctaEyebrow: "Start here",
    ctaTitle: "Tell us what you are actually trying to achieve.",
    ctaLede:
      "Not which compound. The objective — a home you will use, income in hard currency, somewhere to put capital. The right property follows from that, and the conversation costs nothing.",
    ctaFormTitle: "Request a consultation",
    ctaFormLede: "One working day to a reply, from the adviser who covers your area.",
  },

  catalogue: {
    metaTitle: "Properties for sale and rent in Egypt",
    metaDescription:
      "Browse apartments, villas, penthouses and chalets across the Red Sea and Greater Cairo. Filter by destination, budget, type and features.",
    eyebrow: "The catalogue",
    title: "Every property we currently represent.",
    lede: "{count} published listings across eight Egyptian markets. Our off-market book is considerably larger — ask an adviser what is not shown here.",
    crumb: "Properties",
  },

  explorer: {
    refine: "Refine",
    lookingTo: "Looking to",
    all: "All",
    buy: "Buy",
    rent: "Rent",
    destination: "Destination",
    allEgypt: "All of Egypt",
    type: "Property type",
    anyType: "Any type",
    maxPrice: "Maximum price",
    maxRent: "Maximum rent",
    any: "Any",
    perMonth: "{amount} / month",
    converted: "Listings priced in USD and EGP are converted for comparison.",
    bedsMin: "Bedrooms, minimum",
    mustHave: "Must have",
    features: {
      sea: "Sea view",
      pool: "Pool",
      furnished: "Furnished",
      garden: "Garden or terrace",
      parking: "Parking",
    },
    exclusiveOnly: "Exclusive instructions only",
    exclusiveHint: "Properties we represent solely, not available through other agents.",
    clear: plural({ one: "Clear {n} filter", other: "Clear {n} filters" }),
    filters: "Filters",
    sortLabel: "Sort results",
    sorts: {
      featured: "Curated order",
      "price-asc": "Price — low to high",
      "price-desc": "Price — high to low",
      "size-desc": "Largest first",
    },
    emptyTitle: "Nothing matches that combination",
    emptyBody:
      "Our full inventory runs well beyond what is published here. Tell an adviser what you are looking for and we will search the off-market stock.",
    clearFilters: "Clear filters",
    sendBrief: "Send us your brief",
    closeFilters: "Close filters",
    show: plural({ one: "Show {n} property", other: "Show {n} properties" }),
  },

  property: {
    notFound: "Property not found",
    forSale: "For sale",
    toLet: "To let",
    exclusive: "Exclusive instruction",
    reserved: "Reserved",
    guidePrice: "Guide price",
    rent: "Rent",
    perSqm: "≈ {value} {currency} per m²",
    specs: {
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      area: "Internal area",
      plot: "Plot / garden",
      floor: "Floor",
      finishing: "Finishing",
      aspect: "Aspect",
      delivery: "Delivery",
      delivered: "Delivered",
      type: "Type",
    },
    theProperty: "The property",
    specification: "Specification",
    payment: "Payment structure",
    downPayment: "Down payment",
    term: "Instalment term",
    years: "{n} yrs",
    interest: "Interest",
    paymentNote:
      "We will model the full schedule against your cash flow before you commit, including handover and maintenance deposits.",
    location: "The location",
    mapTitle: "Map of {place}",
    adviser: "Your adviser for this property",
    speaks: "Speaks {languages}.",
    whatsapp: "Message on WhatsApp",
    whatsappText: "Hello — I'm interested in {ref}, {title}.",
    enquire: "Enquire about {ref}",
    enquireNote: "Floor plans, service charge history and the title file are available on request.",
    verifiedTitle: "Verified before it was published",
    verifiedBody:
      "Title checked, ownership confirmed and service charges reviewed. Every purchase we handle is registered to a validated green contract.",
    similarEyebrow: "You may also consider",
    similarTitle: "Comparable to this one.",
    back: "Back to the catalogue",
  },

  gallery: {
    count: "{n} photographs",
    open: "Open photograph {n}",
    photo: "{title} — photograph {n}",
    viewer: "{title} — photograph viewer",
    close: "Close",
    prev: "Previous photograph",
    next: "Next photograph",
  },

  testimonials: {
    prev: "Previous testimonial",
    next: "Next testimonial",
  },

  destinations: {
    metaTitle: "Destinations — where to buy in Egypt",
    metaDescription:
      "El Gouna, Hurghada, Sahl Hasheesh, Soma Bay, Makadi Bay, New Cairo, the New Capital and Sheikh Zayed — what each market is actually for.",
    eyebrow: "Where to buy",
    title: "Eight markets, and what each one is actually for.",
    lede: "Yield, liquidity, buyer profile and title risk vary enormously between them. This is our honest read on each.",
    crumb: "Destinations",
    ctaEyebrow: "Not sure which",
    ctaTitle: "Start from the objective, not the map.",
    ctaLede:
      "Tell us what the property is for and we will tell you which of these markets it belongs in — including when the answer is none of them yet.",
  },

  destination: {
    notFound: "Destination not found",
    metaTitle: "{name} property — {tagline}",
    listingsHere: "Listings here",
    ourRead: "Our read on the market",
    defines: "What defines it",
    noteAsk:
      "Want the full market note for {name} — transaction comparables, service charge benchmarks and developer delivery records?",
    noteCta: "Request the market note",
    forSale: "For sale",
    availableIn: "Available in {name}",
    filter: "Filter the catalogue",
    toLet: "To let",
    rentalsIn: "Rentals in {name}",
    alsoConsider: "Also consider",
    nearby: "Nearby in {region}",
    enquire: "Enquire about {name}",
    enquireNote: "Including the properties here we have not published.",
  },

  about: {
    metaTitle: "About the firm",
    metaDescription:
      "New Properties is a private client real estate advisory covering New Cairo, TMG Group developments and the New Administrative Capital since 2009. Meet the team and see how we work.",
    eyebrow: "The firm",
    title: "We were built around the buyer, not the developer.",
    lede: "A private client property advisory working across Egypt's two serious markets since {year}.",
    crumb: "About",
    storyEyebrow: "The story",
    storyTitle: "It started because someone got badly advised.",
    story: [
      "In 2008 our founder's family bought an apartment in Hurghada through a well-reviewed agency. The contract was never registered. It took four years, two lawyers and a court case to convert it into a title anyone would lend against. Nobody had lied. Nobody had explained, either.",
      "{name} opened the following year with one rule that has not changed since: the client hears the whole picture, including the parts that cost us the commission. We turn down instructions we cannot defend, and we tell buyers to wait when waiting is right.",
      "Sixteen years later we are a team of ten across two offices, we have advised buyers from forty-one countries, and the single largest source of new business is still a client sending us someone they know. That is the only metric we have ever really optimised for.",
    ],
    howWeWork: "How we work",
    seeCatalogue: "See the catalogue",
    meetingAlt: "An advisory meeting at {name}",
    principlesEyebrow: "Principles",
    principlesTitle: "Five commitments we actually hold ourselves to.",
    inWriting: "Ask us to put any of this in writing before you instruct us.",
    processEyebrow: "The process",
    processTitle: "From first conversation to registered title.",
    processNote:
      "Typically eight to fourteen weeks on a resale purchase. Longer if you are buying off-plan, because the diligence is heavier and should be.",
    teamEyebrow: "The team",
    teamTitle: "Ten people. No call centre.",
    teamLede:
      "You are assigned one adviser who covers your market and stays with you through completion and beyond. Legal, interiors and management sit in the same offices.",
    call: "Call {name}",
    emailPerson: "Email {name}",
    developersEyebrow: "Developers we transact with",
  },

  services: {
    metaTitle: "Services — buying, selling, legal, management",
    metaDescription:
      "Buying advisory, disposals, in-house conveyancing, property management, interiors and investment structuring across Egypt.",
    eyebrow: "What we do",
    title: "Six mandates, one relationship.",
    lede: "Search, diligence, contract, registration, furnishing, letting and eventual resale — handled by the same firm and, wherever possible, the same people.",
    crumb: "Services",
    discuss: "Discuss this service",
    processEyebrow: "The process",
    processTitle: "What actually happens, step by step.",
    faqEyebrow: "Questions",
    faqTitle: "Everything buyers ask us, answered plainly.",
    nextEyebrow: "Next step",
    nextTitle: "Instruct us, or just ask a question first.",
    nextLede: "There is no fee for the first conversation and no obligation after it.",
  },

  contact: {
    metaTitle: "Contact — New Cairo and New Capital offices",
    metaDescription:
      "Speak to an adviser about buying, selling, letting or managing property in Egypt. Offices in New Cairo and the New Administrative Capital.",
    eyebrow: "Get in touch",
    title: "Tell us what you are trying to achieve.",
    lede: "One working day to a reply, from the adviser who covers your market. No fee for the first conversation, and no obligation after it.",
    crumb: "Contact",
    callDesk: "Call the desk",
    whatsapp: "WhatsApp",
    email: "Email",
    enquiryEyebrow: "Send an enquiry",
    enquiryTitle: "The more context you give us, the better the shortlist.",
    officesEyebrow: "Our offices",
    mapTitle: "Map of the {city} office",
    directEyebrow: "Direct lines",
    directTitle: "Or go straight to the right person.",
    faqEyebrow: "Before you write",
    faqTitle: "Your question may already be here.",
  },

  notFound: {
    eyebrow: "Error 404",
    lineOne: "Not found.",
    lineTwo: "Possibly sold.",
    lede: "The page you were looking for is not here. The catalogue is, and an adviser can usually find the closest equivalent to whatever you were after.",
    browse: "Browse properties",
  },
};

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof en>;
export default en satisfies Dictionary;
