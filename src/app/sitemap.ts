import type { MetadataRoute } from "next";
import { areas } from "@/data/areas";
import { properties } from "@/data/properties";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.meta.url;
  const now = new Date();

  const staticRoutes = ["", "/properties", "/destinations", "/services", "/about", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const areaRoutes = areas.map((a) => ({
    url: `${base}/destinations/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const propertyRoutes = properties.map((p) => ({
    url: `${base}/properties/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...areaRoutes, ...propertyRoutes];
}
