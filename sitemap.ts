import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/data/categories";
import { CITIES } from "@/data/locations";
import { getOffers } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages = [
    "",
    "/mentor",
    "/dodaj-oferte",
    "/o-projekcie",
    "/prywatnosc",
    "/regulamin",
    "/profil/start",
    "/profil/kandydat",
    "/profil/pracodawca",
  ];

  // Do indeksu trafiają tylko kategorie z min. 1 ofertą — puste podstrony
  // (thin content) są dostępne dla użytkowników, ale nie dla robotów.
  const categoryCounts = await Promise.all(
    CATEGORIES.map(async (c) => ({
      slug: c.slug,
      total: (await getOffers({ category: c.slug, limit: 1 })).total,
    }))
  );

  return [
    ...staticPages.map((p) => ({
      url: `${SITE_URL}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...categoryCounts
      .filter((c) => c.total > 0)
      .map((c) => ({
        url: `${SITE_URL}/kategoria/${c.slug}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ...CITIES.map((c) => ({
      url: `${SITE_URL}/lokalizacja/${c.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
