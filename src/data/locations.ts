export interface City {
  slug: string;
  name: string;
  description: string;
}

// TOP5 miast z rozbudowanymi opisami (landing pages w sitemap).
// Pełny rejestr 1026 miast mieszka w src/data/cities.json i jest
// serwowany przez warstwę serwerową (src/lib/cities-server.ts +
// endpoint GET /api/cities) — nigdy w bundlu klienta.
export const CITIES: City[] = [
  {
    slug: "wroclaw",
    name: "Wrocław",
    description:
      "Najwięcej ofert dla młodzieży: gastronomia, handel, magazyny i opieka — głównie weekendy i popołudnia po lekcjach.",
  },
  {
    slug: "wolow",
    name: "Wołów",
    description:
      "Korepetycje, prace sezonowe i zlecenia zdalne — dobre opcje blisko domu, bez dojazdów do Wrocławia.",
  },
  {
    slug: "brzeg-dolny",
    name: "Brzeg Dolny",
    description:
      "Handel, pomoc w ogrodzie i prace sezonowe — oferty od lokalnych sklepów i sąsiadów.",
  },
  {
    slug: "legnica",
    name: "Legnica",
    description:
      "Ulotki, gastronomia i zlecenia dorywcze — prosty start bez doświadczenia.",
  },
  {
    slug: "olawa",
    name: "Oława",
    description:
      "Gastronomia eventowa i prace sezonowe — także jednodniowe zlecenia na festynach.",
  },
];
