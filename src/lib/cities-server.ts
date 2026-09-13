import "server-only";

import data from "@/data/cities.json";
import { CITIES } from "@/data/locations";

// Warstwa serwerowa dla 1026 miast — JSON (~41 KB) ląduje wyłącznie
// w bundlu serwera i endpoincie /api/cities, NIGDY w kodzie klienta.
// Gdy backend wystawi własny rejestr miast, podmienić tylko searchCities
// (i usunąć cities.json) — komponenty wołają HTTP, więc nic się nie zmieni.
export interface CityOption {
  slug: string;
  name: string;
}

const DIACRITICS: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => DIACRITICS[ch] ?? ch)
    .join("");
}

export const ALL_CITIES: CityOption[] = data as CityOption[];

export const CITIES_COUNT = ALL_CITIES.length;

// "lodz" znajdzie "Łódź" — normalizacja usuwa ogonki po obu stronach.
export function searchCities(query: string, limit = 30): CityOption[] {
  const needle = normalize(query.trim());
  if (!needle) return ALL_CITIES.slice(0, limit);
  return ALL_CITIES.filter((c) => normalize(c.name).includes(needle)).slice(0, limit);
}

export function findCity(slug: string): CityOption | undefined {
  return ALL_CITIES.find((c) => c.slug === slug);
}

export function cityName(slug: string): string {
  return (
    CITIES.find((c) => c.slug === slug)?.name ??
    findCity(slug)?.name ??
    slug
  );
}
