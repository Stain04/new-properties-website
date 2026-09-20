import { photos } from "@/lib/images";
import type { Area } from "@/lib/types";

export const areas: Area[] = [
  {
    slug: "el-gouna",
    name: "El Gouna",
    region: "red-sea",
    regionLabel: "Red Sea",
    tagline: "Lagoon living, 25 minutes from Hurghada airport",
    blurb:
      "A self-contained town of islands, marinas and golf — Egypt's most established second-home market and its most liquid resale one.",
    description: [
      "Built across a lattice of saltwater lagoons and connected islands, El Gouna operates less like a resort and more like a small European town: its own hospital, international schools, marina, championship golf and a year-round resident community that does not empty out in October.",
      "That permanence is what makes it the strongest resale market on the Red Sea. Owners here are rarely forced sellers, inventory is tightly held, and the town's single master developer has kept architectural standards consistent for three decades — which protects value in a way that fragmented markets cannot.",
      "We advise on lagoon-front townhouses, marina apartments and the Nubian-style villas of the older districts, where supply is finite and the premium is structural rather than speculative.",
    ],
    image: photos.elGouna,
    heroImage: photos.elGounaAlt,
    stats: [
      { label: "Entry price", value: "€95,000" },
      { label: "Rental yield", value: "7 – 9%" },
      { label: "To airport", value: "25 min" },
    ],
    highlights: [
      "18-hole championship golf course",
      "Two marinas with deep-water berths",
      "International schools and full-service hospital",
      "Strongest resale liquidity on the Red Sea",
    ],
  },
  {
    slug: "hurghada",
    name: "Hurghada",
    region: "red-sea",
    regionLabel: "Red Sea",
    tagline: "The widest choice, the lowest entry point",
    blurb:
      "The commercial heart of the Red Sea coast — where genuine sub-€60,000 entry points still exist alongside serious beachfront product.",
    description: [
      "Hurghada is the coast's working city, and its property market reflects that range. A furnished studio in a managed resort compound can still be acquired under €40,000, while beachfront residences in the northern corridor and Sahl Hasheesh approach trade at multiples of that.",
      "The opportunity here is selection rather than scarcity. Several hundred compounds compete for the same buyer, and quality between them varies enormously — in build standard, in service charge discipline, and in whether the pool is maintained in the fifth year as well as the first.",
      "Our work in Hurghada is mostly subtractive: we know which developments hold their finish, which management companies actually collect and spend the service charge, and which green contracts will register without friction.",
    ],
    image: photos.hurghada,
    heroImage: photos.hurghadaAlt,
    stats: [
      { label: "Entry price", value: "€38,000" },
      { label: "Rental yield", value: "8 – 11%" },
      { label: "Direct flights", value: "40+ cities" },
    ],
    highlights: [
      "Lowest entry point on the Red Sea",
      "Year-round short-let demand",
      "Direct flights from 40+ European cities",
      "Established expatriate community",
    ],
  },
  {
    slug: "sahl-hasheesh",
    name: "Sahl Hasheesh",
    region: "red-sea",
    regionLabel: "Red Sea",
    tagline: "A planned bay with genuine beachfront title",
    blurb:
      "Twelve kilometres of private bay, master-planned from zero — the Red Sea's answer to the branded-residence market.",
    description: [
      "Sahl Hasheesh was drawn as a single bay-wide masterplan rather than assembled plot by plot, and the discipline shows: a continuous promenade, controlled building heights, and genuine beachfront parcels with clean title.",
      "It attracts a different buyer from Hurghada — one buying a finished lifestyle rather than a yield calculation, often in a branded or hotel-managed residence where rental is handled by the operator.",
      "Prices per square metre sit meaningfully above the coast average, and we think justifiably so: the supply of true first-line beachfront in Egypt with registrable freehold title is small and not expanding.",
    ],
    image: photos.sahlHasheesh,
    heroImage: photos.sahlHasheeshAlt,
    stats: [
      { label: "Entry price", value: "€120,000" },
      { label: "Bay frontage", value: "12 km" },
      { label: "Rental yield", value: "6 – 8%" },
    ],
    highlights: [
      "Continuous private bay and promenade",
      "Hotel-managed residence programmes",
      "Controlled low-rise masterplan",
      "Highest concentration of true beachfront title",
    ],
  },
  {
    slug: "soma-bay",
    name: "Soma Bay",
    region: "red-sea",
    regionLabel: "Red Sea",
    tagline: "A peninsula of ten properties and nothing else",
    blurb:
      "The quietest address on the coast — a gated peninsula with championship golf, a thalasso spa and deliberately scarce residential supply.",
    description: [
      "Soma Bay occupies its own peninsula south of Hurghada, and the entire landmass is controlled by a single masterplan with a deliberately low residential count. There is no through traffic, because there is nowhere to pass through to.",
      "The result is the most insulated micro-market in Egypt: fewer than a dozen residential phases have ever been released, kitesurfing and diving conditions are the best on the mainland coast, and the Cascades golf course ranks among Africa's strongest.",
      "Buyers here are typically acquiring their third or fourth property and are indifferent to yield. We treat it accordingly — as a scarcity play, not an income one.",
    ],
    image: photos.somaBay,
    heroImage: photos.somaBayAlt,
    stats: [
      { label: "Entry price", value: "€180,000" },
      { label: "Residential phases", value: "Under 12" },
      { label: "To airport", value: "45 min" },
    ],
    highlights: [
      "Private gated peninsula",
      "Cascades championship golf course",
      "World-class kitesurfing and diving",
      "Severely constrained residential supply",
    ],
  },
  {
    slug: "makadi-bay",
    name: "Makadi Bay",
    region: "red-sea",
    regionLabel: "Red Sea",
    tagline: "Where the yield maths still works",
    blurb:
      "A fast-maturing bay with strong occupancy, aggressive payment plans and the coast's best ratio of rental income to purchase price.",
    description: [
      "Makadi has moved quickly from hotel strip to genuine residential bay. Heights remain low, the beach is wide, and the last five years have brought serious infrastructure — a water park, retail promenades and a resident population large enough to keep restaurants open in winter.",
      "For income-focused buyers this is currently the most efficient point on the coast. Purchase prices have not yet caught up with occupancy rates, and developer payment plans running seven to eight years interest-free let buyers deploy capital slowly against rising rents.",
      "We are candid that this window narrows as the bay matures. It has not closed yet.",
    ],
    image: photos.makadiBay,
    heroImage: photos.makadiBayAlt,
    stats: [
      { label: "Entry price", value: "€52,000" },
      { label: "Rental yield", value: "9 – 12%" },
      { label: "Payment plans", value: "Up to 8 yrs" },
    ],
    highlights: [
      "Highest yields on the Red Sea",
      "Interest-free plans up to eight years",
      "Wide natural beach, low-rise masterplan",
      "Rapidly improving retail and leisure",
    ],
  },
  {
    slug: "new-cairo",
    name: "New Cairo",
    region: "greater-cairo",
    regionLabel: "Greater Cairo",
    tagline: "The established compound market",
    blurb:
      "Fifth Settlement and the 90th Street corridor — Cairo's most liquid compound market, and the one with real rental depth.",
    description: [
      "New Cairo is where Greater Cairo's compound market matured. The Fifth Settlement corridor now carries the city's strongest concentration of international schools, business parks, private hospitals and retail — which means demand comes from residents who need to live there, not only from investors.",
      "That distinction matters. Rental demand in New Cairo is structural: multinational staff, university faculty, and families tied to specific schools. Vacancy is low and tenant quality is high, which is not uniformly true across Greater Cairo.",
      "We cover both the established compounds, where resale supply is genuinely constrained, and selected delivering phases where the developer's track record justifies the completion risk.",
    ],
    image: photos.newCairo,
    heroImage: photos.newCairoAlt,
    stats: [
      { label: "Entry price", value: "EGP 4.2M" },
      { label: "Rental yield", value: "6 – 8%" },
      { label: "To downtown", value: "35 min" },
    ],
    highlights: [
      "Deepest long-let tenant pool in Cairo",
      "Dense cluster of international schools",
      "Mature, fully delivered compounds",
      "Strong resale liquidity",
    ],
  },
  {
    slug: "new-capital",
    name: "New Administrative Capital",
    region: "greater-cairo",
    regionLabel: "Greater Cairo",
    tagline: "A capital being built in one pass",
    blurb:
      "Government districts, the business quarter and the first delivered residential phases — the highest-variance market we cover.",
    description: [
      "The New Administrative Capital is the largest single urban project in the region, and it demands a clear-eyed view. Ministries and the central business district are operational; several residential districts have delivered; others remain drawings with a payment plan attached.",
      "The upside is real — off-plan pricing in a city whose employment base is being relocated into it by decree — but so is the dispersion between developers. Delivery discipline here separates outcomes more sharply than location does.",
      "We work only with developers in the Capital who have already handed over a completed phase. That single filter removes most of the risk buyers actually lose money to.",
    ],
    image: photos.newCapital,
    heroImage: photos.newCapitalAlt,
    stats: [
      { label: "Entry price", value: "EGP 3.6M" },
      { label: "Payment plans", value: "Up to 10 yrs" },
      { label: "Delivered phases", value: "Selective" },
    ],
    highlights: [
      "Longest payment plans in Egypt",
      "Government and CBD employment anchor",
      "Off-plan entry pricing",
      "We list only proven-delivery developers",
    ],
  },
  {
    slug: "sheikh-zayed",
    name: "Sheikh Zayed & 6th October",
    region: "greater-cairo",
    regionLabel: "Greater Cairo",
    tagline: "West Cairo's low-rise, family-first corridor",
    blurb:
      "Established villa and twin-house districts with mature landscaping, short commutes to Smart Village and genuinely scarce resale stock.",
    description: [
      "West Cairo developed earlier and lower than the east. Sheikh Zayed's older compounds have thirty-year-old trees, settled communities and a scarcity of resale product that keeps prices firm through softer cycles.",
      "The corridor serves Smart Village and the Cairo–Alexandria business axis, and increasingly the film and media industry clustered around 6th October. Demand skews strongly toward villas, twin houses and townhouses rather than apartments.",
      "New supply arrives mainly at the outer edge, along the Dahshour link. We generally steer buyers toward the mature core, where the land component of the price is doing the work.",
    ],
    image: photos.sheikhZayed,
    heroImage: photos.sheikhZayedAlt,
    stats: [
      { label: "Entry price", value: "EGP 6.8M" },
      { label: "Dominant type", value: "Villas" },
      { label: "To Smart Village", value: "15 min" },
    ],
    highlights: [
      "Mature low-rise compounds with grown landscaping",
      "Villa and twin-house dominant",
      "Smart Village and media-city employment base",
      "Constrained resale supply in the core",
    ],
  },
];

export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug);

export const areaName = (slug: string) => areaBySlug(slug)?.name ?? slug;

export const regions = [
  { key: "red-sea" as const, label: "Red Sea", blurb: "Coastal and resort residences" },
  { key: "greater-cairo" as const, label: "Greater Cairo", blurb: "Compounds and city residences" },
];
