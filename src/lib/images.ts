/**
 * ─────────────────────────────────────────────────────────────
 *  IMAGE CATALOGUE
 *
 *  Every photograph on the site resolves through this file.
 *  All placeholders are free-licence Unsplash photography.
 *
 *  To swap in the agency's own photography:
 *   1. drop the files into /public/photos/
 *   2. replace the value with "/photos/your-file.jpg"
 *  Nothing else in the codebase needs to change.
 * ─────────────────────────────────────────────────────────────
 */

const UNSPLASH = "https://images.unsplash.com/";

/** Build a full-size Unsplash source URL from a photo slug. */
const u = (slug: string, w = 1400) =>
  `${UNSPLASH}${slug}?auto=format&fit=crop&w=${w}&q=80`;

/** Portrait-cropped variant, for team headshots. */
const portrait = (slug: string) =>
  `${UNSPLASH}${slug}?auto=format&fit=crop&w=800&h=1000&q=80`;

export const photos = {
  /* ---------- Hero / editorial ---------- */
  heroResort: u("photo-1747336755360-c4830d819af1", 1800),
  heroCoast: u("photo-1747336755438-e822d83e9383", 1800),
  heroCairo: u("photo-1640956641338-5a07e5811ca6", 1800),
  heroVilla: u("photo-1745761320791-5ae142edee8c", 1800),

  aboutPortrait: u("photo-1780257562941-d9a6923befa1"),
  aboutWide: u("photo-1785300550088-5f5044ef0d43", 1600),
  aboutDetail: u("photo-1536501483244-925da0b87089"),

  consultation: u("photo-1521791136064-7986c2920216", 1600),
  meeting: u("photo-1518135714426-c18f5ffb6f4d", 1500),
  signing: u("photo-1591453214154-c95db71dbd83", 1500),

  ctaBand: u("photo-1766214573285-1b3df1b0a980", 1800),
  contactBand: u("photo-1747336755307-16278194efb4", 1800),

  /* ---------- Destinations ---------- */
  elGouna: u("photo-1747336755360-c4830d819af1", 1600),
  elGounaAlt: u("photo-1747336755438-e822d83e9383", 1600),
  hurghada: u("photo-1584050671859-cb590a1e859c", 1600),
  hurghadaAlt: u("photo-1672421186833-5ecacbb76075", 1600),
  sahlHasheesh: u("photo-1785300550088-5f5044ef0d43", 1600),
  sahlHasheeshAlt: u("photo-1747336755468-2c12efa216c8", 1600),
  somaBay: u("photo-1708711973477-1373f8eb65db", 1600),
  somaBayAlt: u("photo-1766214573274-f31f935eda13", 1600),
  makadiBay: u("photo-1747336755349-59df86ba5794", 1600),
  makadiBayAlt: u("photo-1753618282382-5cac7b34488d", 1600),
  newCairo: u("photo-1630201187972-dc4136076c6c", 1600),
  newCairoAlt: u("photo-1697571349572-e73357ca5e19", 1600),
  newCapital: u("photo-1561714645-2b6505711ee0", 1600),
  newCapitalTowers: u("photo-1788129115178-fd56436a9470", 1800),
  newCapitalAlt: u("photo-1788129115178-fd56436a9470", 1600),
  sheikhZayed: u("photo-1494380982332-dfc36fbfece6", 1600),
  sheikhZayedAlt: u("photo-1663540275466-f171aa6d9f3e", 1600),

  nile: u("photo-1719659018185-8a239c35fb4a", 1600),
  marina: u("photo-1517696522815-46a004b80a2d", 1600),

  /* ---------- Property photography ---------- */
  exterior: [
    u("photo-1613977257365-aaae5a9817ff"),
    u("photo-1628012209120-d9db7abf7eab"),
    u("photo-1745761320630-148540d19a6c"),
    u("photo-1598911096723-af003b4ea77a"),
    u("photo-1774685110718-c5b4fe026144"),
    u("photo-1768200498972-fd56353d73fc"),
    u("photo-1779487552425-65861889810b"),
    u("photo-1622015663319-e97e697503ee"),
    u("photo-1598737652403-6e0ee5bf5cf2"),
    u("photo-1673469110171-dbf5d19a8336"),
    u("photo-1543489822-c49534f3271f"),
    u("photo-1544984243-ec57ea16fe25"),
    u("photo-1582610116397-edb318620f90"),
    u("photo-1599777560450-e462cffc5368"),
  ],

  living: [
    u("photo-1776362355123-ca966d36e29c"),
    u("photo-1560448204-e02f11c3d0e2"),
    u("photo-1757924461488-ef9ad0670978"),
    u("photo-1707484687082-9493754d389f"),
    u("photo-1780257562963-3389a4105371"),
    u("photo-1758448511322-8bfc73daf606"),
    u("photo-1628592102751-ba83b0314276"),
    u("photo-1642976975710-1d8890dbf5ab"),
    u("photo-1611755489400-3c53602ab783"),
    u("photo-1680416124510-5eae1beca412"),
    u("photo-1512914890251-2f96a9b0bbe2"),
    u("photo-1738168273959-952fdc961991"),
    u("photo-1751998816160-0bdb329a3b9f"),
    u("photo-1702411200201-3061d0eea802"),
  ],

  bedroom: [
    u("photo-1616594039964-ae9021a400a0"),
    u("photo-1710224002849-a76ea1068b0d"),
    u("photo-1648634158203-199accfd7afc"),
    u("photo-1653204095671-3ed81a4bc561"),
    u("photo-1642541070065-3912f347e7c6"),
    u("photo-1696762932825-2737db830bbe"),
    u("photo-1710883734891-93709398496d"),
    u("photo-1625579002297-aeebbf69de89"),
    u("photo-1640109478916-f445f8f19b11"),
    u("photo-1644057501622-dfa7dd26dbfb"),
    u("photo-1663811397207-418a92396ad5"),
    u("photo-1616594092403-fb65629b0a46"),
  ],

  kitchen: [
    u("photo-1600684388091-627109f3cd60"),
    u("photo-1684928365167-e91916573122"),
    u("photo-1649083048428-3d8ed23a3ce0"),
    u("photo-1643949915134-73a4c880f7c7"),
    u("photo-1610177534644-34d881503b83"),
    u("photo-1663811396777-05505d999151"),
    u("photo-1689043528099-2ba014dd7c64"),
    u("photo-1704383014594-01bc24b6b840"),
    u("photo-1635321350281-e2a91ecffd00"),
    u("photo-1614597445336-8a67e9314d91"),
  ],

  bathroom: [
    u("photo-1564540583246-934409427776"),
    u("photo-1564540579594-0930edb6de43"),
    u("photo-1572742482459-e04d6cfdd6f3"),
    u("photo-1625940119840-585d3495dc94"),
    u("photo-1658760046471-896cbc719c9d"),
    u("photo-1744025098626-66c0b9cb1ba8"),
  ],

  terrace: [
    u("photo-1617695591915-87d753983ac0"),
    u("photo-1532960546490-72765f9494c9"),
    u("photo-1776363284806-873eeef565a7"),
    u("photo-1774348692705-704860626289"),
    u("photo-1767555027401-6829988ca9df"),
    u("photo-1758907749704-7ad4e48b2aa0"),
  ],

  pool: [
    u("photo-1766214573285-1b3df1b0a980"),
    u("photo-1622816951464-df6fc7ab2ced"),
    u("photo-1780914149187-c4f302dafbb0"),
    u("photo-1699413935716-aa75fb58ec1a"),
    u("photo-1672421186928-ac9709797b07"),
    u("photo-1562407132-e23789f81bb7"),
    u("photo-1724618702364-8cde016bda22"),
    u("photo-1596746698204-d69844da956d"),
  ],

  aerial: [
    u("photo-1747336755334-c7bd5a5e104d"),
    u("photo-1747336755307-16278194efb4"),
    u("photo-1753618282454-f228a31ee68b"),
    u("photo-1747336755296-a9e715350b32"),
    u("photo-1753618282399-a2d823f8e823"),
    u("photo-1565572473525-02d61e3d37dc"),
    u("photo-1501548881190-edab31107569"),
    u("photo-1507307210924-d7eaf52c948c"),
  ],

  /* ---------- People ---------- */
  team: {
    f1: portrait("photo-1573496359142-b8d87734a5a2"),
    f2: portrait("photo-1494790108377-be9c29b29330"),
    f3: portrait("photo-1573497019940-1c28c88b4f3e"),
    f4: portrait("photo-1604904612715-47bf9d9bc670"),
    f5: portrait("photo-1614786269829-d24616faf56d"),
    f6: portrait("photo-1582896911227-c966f6e7fb93"),
    m1: portrait("photo-1560250097-0b93528c311a"),
    m2: portrait("photo-1519085360753-af0119f7cbe7"),
    m3: portrait("photo-1613181013804-1dcba09e6a9d"),
    m4: portrait("photo-1624797432677-6f803a98acb3"),
    m5: portrait("photo-1600878459108-617a253537e9"),
    m6: portrait("photo-1622902141397-a89655353bec"),
  },
} as const;

/** Deterministic gallery builder so every listing gets a coherent photo set. */
export function gallery(seed: number, opts?: { outdoor?: "pool" | "aerial" | "terrace" }) {
  const pick = <T,>(arr: readonly T[], offset: number) => arr[(seed + offset) % arr.length];
  const outdoorPool =
    opts?.outdoor === "aerial"
      ? photos.aerial
      : opts?.outdoor === "terrace"
        ? photos.terrace
        : photos.pool;

  return [
    pick(photos.living, 0),
    pick(photos.exterior, 1),
    pick(photos.kitchen, 2),
    pick(photos.bedroom, 3),
    pick(outdoorPool, 1),
    pick(photos.bathroom, 4),
    pick(photos.terrace, 2),
    pick(photos.bedroom, 7),
  ];
}
