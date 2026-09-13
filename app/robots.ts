import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Strona podziękowania nie wnosi treści do indeksu
        disallow: ["/dziekujemy"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
