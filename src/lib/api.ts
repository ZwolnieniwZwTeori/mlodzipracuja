import { MOCK_OFFERS } from "@/data/mock-offers";
import { normalize } from "@/lib/format";
import type {
  MentorRequest,
  MentorResponse,
  NewOfferInput,
  Offer,
  OffersQuery,
  OffersResponse,
} from "@/lib/types";

// Backend (kolega z zespołu) wystawia REST API zgodne z dokumentem
// "0. KONTRAKT MIĘDZY FRONTENDEM A BACKENDEM". Dopóki backend nie jest
// wdrożony, ustaw NEXT_PUBLIC_API_URL na pusty string (lub nie ustawiaj go
// wcale) — wtedy frontend automatycznie korzysta z lokalnych danych
// przykładowych, żeby dało się pracować nad UI niezależnie od backendu.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const USE_MOCKS = API_URL.length === 0;

// Symulacja opóźnienia sieci, żeby stany ładowania w UI dało się realnie
// przetestować także na danych mockowych.
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getOffers(query: OffersQuery = {}): Promise<OffersResponse> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 9;

  if (USE_MOCKS) {
    await delay(250);
    let filtered = MOCK_OFFERS.filter((o) => o.moderation_status === "approved");

    if (query.category) {
      filtered = filtered.filter((o) => o.category === query.category);
    }
    if (query.location) {
      const needle = query.location.trim().toLowerCase();
      filtered = filtered.filter((o) => o.location.toLowerCase().includes(needle));
    }
    if (query.company) {
      const needle = query.company.trim().toLowerCase();
      filtered = filtered.filter((o) => (o.company ?? "").toLowerCase() === needle);
    }
    if (query.q) {
      // Fraza: tytuł, opis, firma, miasto i kategoria (bez ogonków też działa).
      const needle = normalize(query.q);
      filtered = filtered.filter((o) =>
        [o.title, o.description, o.company ?? "", o.location, o.category]
          .some((field) => normalize(field).includes(needle))
      );
    }
    if (query.min_age) {
      // min_age w zapytaniu = wiek użytkownika. Oferta pasuje, gdy widełki
      // min_age–max_age obejmują ten wiek.
      const age = query.min_age;
      filtered = filtered.filter((o) => o.min_age <= age && o.max_age >= age);
    }

    filtered = [...filtered].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const start = (page - 1) * limit;
    const results = filtered.slice(start, start + limit);

    return { results, page, limit, total: filtered.length };
  }

  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.location) params.set("location", query.location);
  if (query.company) params.set("company", query.company);
  if (query.q) params.set("q", query.q);
  if (query.min_age) params.set("min_age", String(query.min_age));
  params.set("page", String(page));
  params.set("limit", String(limit));

  const res = await fetch(`${API_URL}/api/offers?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Nie udało się pobrać ofert (status ${res.status})`);
  return res.json();
}

export async function getOfferById(id: string): Promise<Offer | null> {
  if (USE_MOCKS) {
    await delay(150);
    return MOCK_OFFERS.find((o) => o.id === id && o.moderation_status === "approved") ?? null;
  }

  const res = await fetch(`${API_URL}/api/offers/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Nie udało się pobrać oferty (status ${res.status})`);
  return res.json();
}

export interface CreateOfferResult {
  ok: boolean;
  error?: string;
}

export async function createOffer(input: NewOfferInput): Promise<CreateOfferResult> {
  // Pole honeypot: jeśli wypełnione, to prawie na pewno bot — po prostu
  // udajemy sukces, żeby nie podpowiadać botom, że zostały złapane.
  if (input.website) {
    await delay(300);
    return { ok: true };
  }

  if (USE_MOCKS) {
    await delay(400);
    return { ok: true };
  }

  const res = await fetch(`${API_URL}/api/offers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    return { ok: false, error: `Nie udało się wysłać oferty (status ${res.status})` };
  }
  return { ok: true };
}

export async function askMentor(input: MentorRequest): Promise<MentorResponse> {
  if (USE_MOCKS) {
    await delay(500);
    // Bardzo uproszczona symulacja odpowiedzi AI Mentora do celów developmentu
    // frontendu — docelowo backend robi mini-RAG opisany w dokumencie
    // "3. AI MENTOR" i odpytuje Claude API z realnymi ofertami z bazy.
    const text = input.message.toLowerCase();
    // Proste dopasowanie słów kluczowych do nowego zestawu kategorii.
    const KEYWORDS: Array<{ slug: Offer["category"]; words: string[] }> = [
      { slug: "gastronomia", words: ["gastro", "kuch", "kelner", "jedzen", "restaur"] },
      { slug: "handel", words: ["handel", "sklep", "sprzeda", "kasa"] },
      { slug: "ulotki", words: ["ulot", "roznos", "plakat"] },
      { slug: "magazyn", words: ["magazyn", "pakowan", "kompletow", "zamów"] },
      { slug: "korepetycje", words: ["korepet", "matemat", "angiel", "nauka", "uczy"] },
      { slug: "opieka", words: ["opiek", "dziec", "animac", "urodzin", "niania"] },
      { slug: "sezonowe", words: ["sezon", "zbior", "festyn"] },
      { slug: "ogrod", words: ["ogród", "ogrod", "koszenie", "grabienie", "traw", "podlewan"] },
      { slug: "sprzatanie", words: ["sprząt", "sprzat", "porządk", "porzadk", "czyszczen"] },
      { slug: "zwierzeta", words: ["zwierzę", "zwierze", "pies", "psa", "kot", "wyprowadz"] },
      { slug: "seniorzy", words: ["senior", "starsz", "babci", "dziadk", "emeryt"] },
      { slug: "fotografia", words: ["fotograf", "zdjęc", "zdjec", "aparat", "sesj"] },
      { slug: "eventy", words: ["event", "imprez", "koncert", "wesel"] },
      { slug: "promocje", words: ["promoc", "degust", "hostess", "sampling"] },
      { slug: "warsztaty", words: ["warsztat", "ceramik", "rękodzieł", "rekodzieł", "plastycz"] },
      { slug: "social-media", words: ["social", "instagram", "tiktok", "profil", "relacj", "post"] },
      { slug: "grafika", words: ["grafik", "projekt", "rysowan", "rysun", "logo"] },
      { slug: "wideo", words: ["wideo", "video", "montaż", "montaz", "film", "nagrywan", "youtube"] },
      { slug: "zdalne", words: ["zdaln", "online", "komputer", "strona"] },
    ];
    const hit = KEYWORDS.find((k) => k.words.some((w) => text.includes(w)));
    const category = hit?.slug ?? "sezonowe";
    const matches = MOCK_OFFERS.filter((o) => o.category === category).slice(0, 3);

    return {
      recommended_categories: [category, "zdalne"],
      reasoning:
        "To wstępna, przykładowa odpowiedź działająca na danych lokalnych — prawdziwy AI Mentor połączy się z backendem i realną bazą ofert.",
      next_step: "Przejrzyj dopasowane oferty poniżej i odezwij się do tej, która pasuje najbardziej.",
      matching_offer_ids: matches.map((o) => o.id),
    };
  }

  const res = await fetch(`${API_URL}/api/mentor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`AI Mentor nie odpowiedział (status ${res.status})`);
  return res.json();
}
