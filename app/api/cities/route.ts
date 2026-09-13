import { NextResponse } from "next/server";
import { CITIES_COUNT, searchCities } from "@/lib/cities-server";
import type { CityOption } from "@/lib/cities-server";

// Publiczny rejestr miast dla wyszukiwarki (combobox) i katalogu.
// Dane statyczne (TERYT 2026) — agresywnie cachowane na CDN (s-maxage),
// więc "serwer" w praktyce odpowiada z brzegu sieci.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") ?? "30") || 30, 1),
    200
  );

  const results: CityOption[] = searchCities(q, limit);
  return NextResponse.json(
    { results, total: CITIES_COUNT },
    {
      headers: {
        // Dane nie zmieniają się między wdrożeniami
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
