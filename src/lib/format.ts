import type { OfferSource } from "@/lib/types";

// Małe litery bez ogonków — do wyszukiwania po frazie ("kelner"
// znajdzie "Kelner", "ulotki" znajdzie "Ulotki").
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź/g, "z")
    .replace(/ż/g, "z");
}

export function sourceLabel(source: OfferSource): string {
  switch (source) {
    case "manual":
      return "Zweryfikowany pracodawca";
    case "olx":
      return "Ogłoszenie z OLX";
    case "jooble":
      return "Ogłoszenie z Jooble";
  }
}

export function relativeDate(iso: string): string {
  const date = new Date(iso);
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "dzisiaj";
  if (days === 1) return "wczoraj";
  if (days < 7) return `${days} dni temu`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "tydzień temu";
  if (weeks < 5) return `${weeks} tygodnie temu`;
  return date.toLocaleDateString("pl-PL", { day: "numeric", month: "long" });
}

// Krótka etykieta źródła pod stawką: "z OLX · 2 dni temu".
export function sourceShort(source: OfferSource): string {
  switch (source) {
    case "manual":
      return "Oferta zweryfikowana";
    case "olx":
      return "z OLX";
    case "jooble":
      return "z Jooble";
  }
}

// Inicjały firmy do awatara na karcie oferty (np. "Studio Pixel" → "SP").
// Zwraca "•" gdy nazwy brak (oferty zewnętrzne bez podanej firmy).
export function companyInitials(company?: string | null): string {
  if (!company) return "•";
  const letters = company
    .split(/\s+/)
    .filter((w) => /^[\p{L}]/u.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return letters.toUpperCase() || "•";
}

// Etykieta wieku jak na karcie referencyjnej: "od 15 lat",
// a przy węższym przedziale pełny zakres "16–17 lat".
export function ageLabel(minAge: number, maxAge: number): string {
  if (maxAge >= 18) return `od ${minAge} lat`;
  return `${minAge}–${maxAge} lat`;
}
