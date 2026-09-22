import type { MetadataRoute } from "next";
import { areas } from "@/data/areas";
import { site } from "@/data/site";
import { localePath, locales } from "@/i18n/config";
import { getListings } from "@/lib/listings/store";

/** Every page in every language, each entry pointing at its translations. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getListings();
  const base = site.meta.url;
  const now = new Date();

  const paths: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    ...["", "/properties", "/destinations", "/services", "/about", "/contact"].map((path) => ({
      path: path || "/",
      priority: path === "" ? 1 : 0.8,
      changeFrequency: "weekly" as const,
    })),
    ...areas.map((a) => ({ path: `/destinations/${a.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
    ...properties.map((p) => ({ path: `/properties/${p.slug}`, priority: 0.6, changeFrequency: "weekly" as const })),
  ];

  return paths.flatMap(({ path, priority, changeFrequency }) => {
    const languages = Object.fromEntries(locales.map((l) => [l, `${base}${localePath(l, path)}`]));
    return locales.map((l) => ({
      url: `${base}${localePath(l, path)}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
