// Typy zgodne z kontraktem API ustalonym w dokumencie
// "0. KONTRAKT MIĘDZY FRONTENDEM A BACKENDEM".
// Backend jest źródłem prawdy — jeśli kontrakt się zmieni, zaktualizuj ten plik
// i src/lib/api.ts w jednym miejscu.

export type CategorySlug =
  | "gastronomia"
  | "handel"
  | "ulotki"
  | "magazyn"
  | "korepetycje"
  | "opieka"
  | "sezonowe"
  | "zdalne"
  | "ogrod"
  | "sprzatanie"
  | "zwierzeta"
  | "seniorzy"
  | "fotografia"
  | "eventy"
  | "promocje"
  | "warsztaty"
  | "social-media"
  | "grafika"
  | "wideo";

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
}

export type OfferSource = "manual" | "olx" | "jooble";
export type ModerationStatus = "pending" | "approved" | "rejected";

export interface Offer {
  id: string;
  title: string;
  category: CategorySlug;
  location: string;
  description: string;
  min_age: number;
  max_age: number;
  source: OfferSource;
  source_url: string | null;
  contact: string;
  created_at: string;
  moderation_status: ModerationStatus;
  // Rozszerzenie frontendu (docelowo do dopisania w kontrakcie API):
  // backend, który ich jeszcze nie zwraca, po prostu da undefined —
  // komponenty traktują brak jak "nie podano".
  company?: string | null;
  salary?: string | null;
  hours?: string | null;
}

export interface OffersQuery {
  category?: CategorySlug;
  location?: string;
  company?: string;
  q?: string;
  min_age?: number;
  page?: number;
  limit?: number;
}

export interface OffersResponse {
  results: Offer[];
  page: number;
  limit: number;
  total: number;
}

export interface NewOfferInput {
  title: string;
  category: CategorySlug;
  location: string;
  description: string;
  min_age: number;
  max_age: number;
  contact: string;
  company?: string;
  salary?: string;
  hours?: string;
  // Pole honeypot — musi zostać puste. Wypełnione = bot.
  website?: string;
}

export interface MentorRequest {
  message: string;
}

export interface MentorResponse {
  recommended_categories: CategorySlug[];
  reasoning: string;
  next_step: string;
  matching_offer_ids: string[];
}
