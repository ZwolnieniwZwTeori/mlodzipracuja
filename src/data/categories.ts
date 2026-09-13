import type { Category } from "@/lib/types";

export const CATEGORIES: Category[] = [
  { id: "cat-gastronomia", name: "Gastronomia", slug: "gastronomia" },
  { id: "cat-handel", name: "Handel", slug: "handel" },
  { id: "cat-ulotki", name: "Ulotki", slug: "ulotki" },
  { id: "cat-magazyn", name: "Magazyn", slug: "magazyn" },
  { id: "cat-korepetycje", name: "Korepetycje", slug: "korepetycje" },
  { id: "cat-opieka", name: "Opieka nad dziećmi", slug: "opieka" },
  { id: "cat-sezonowe", name: "Sezonowe", slug: "sezonowe" },
  { id: "cat-zdalne", name: "Zdalne", slug: "zdalne" },
  { id: "cat-ogrod", name: "Ogród", slug: "ogrod" },
  { id: "cat-sprzatanie", name: "Sprzątanie", slug: "sprzatanie" },
  { id: "cat-zwierzeta", name: "Zwierzęta", slug: "zwierzeta" },
  { id: "cat-seniorzy", name: "Seniorzy", slug: "seniorzy" },
  { id: "cat-fotografia", name: "Fotografia", slug: "fotografia" },
  { id: "cat-eventy", name: "Eventy", slug: "eventy" },
  { id: "cat-promocje", name: "Promocje", slug: "promocje" },
  { id: "cat-warsztaty", name: "Warsztaty", slug: "warsztaty" },
  { id: "cat-social-media", name: "Social media", slug: "social-media" },
  { id: "cat-grafika", name: "Grafika", slug: "grafika" },
  { id: "cat-wideo", name: "Wideo", slug: "wideo" },
];

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  gastronomia: "Pomoc kuchenna, obsługa stoisk i eventów — zwykle weekendy, posiłek w cenie zmiany.",
  handel: "Wykładanie towaru, pomoc przy kasie i obsługa klientów w lokalnych sklepach.",
  ulotki: "Roznoszenie ulotek i plakatów — prosty start bez doświadczenia, płatne od godziny.",
  magazyn: "Kompletowanie i pakowanie zamówień w małych magazynach e-sklepów.",
  korepetycje: "Pomoc młodszym uczniom w nauce — matematyka, języki, odrabianie lekcji.",
  opieka: "Opieka nad dziećmi i pomoc przy zajęciach — urodziny, warsztaty, świetlice.",
  sezonowe: "Prace na świeżym powietrzu i zlecenia czasowe — zbiory, ogród, festyny.",
  zdalne: "Zadania do wykonania z domu — zdjęcia, opisy, porządkowanie treści online.",
  ogrod: "Koszenie, grabienie, podlewanie i porządki w ogrodach — sezonowo, na świeżym powietrzu.",
  sprzatanie: "Lekkie porządki: sprzątanie mieszkań, biur i klatek schodowych — bez ciężkiego sprzętu.",
  zwierzeta: "Wyprowadzanie psów i opieka nad kotami oraz drobnymi zwierzętami podczas nieobecności właścicieli.",
  seniorzy: "Towarzystwo, zakupy i drobna pomoc domowa dla seniorów z okolicy.",
  fotografia: "Zdjęcia na urodzinach, meczach i eventach — także obróbka i publikacja online.",
  eventy: "Pomoc przy festynach, koncertach i imprezach — stoiska, porządek, obsługa gości.",
  promocje: "Degustacje i akcje promocyjne w sklepach i galeriach — zwykle od 16 lat.",
  warsztaty: "Pomoc przy zajęciach i kursach: rękodzieło, ceramika, zajęcia plastyczne.",
  "social-media": "Prowadzenie profili lokalnych firm: zdjęcia, posty i relacje.",
  grafika: "Proste projekty graficzne: plakaty, materiały do druku, grafiki do sieci.",
  wideo: "Nagrywanie i montaż krótkich filmów dla klubów, firm i twórców.",
};

export function categoryName(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function categoryDescription(slug: string): string {
  return CATEGORY_DESCRIPTIONS[slug] ?? "";
}
