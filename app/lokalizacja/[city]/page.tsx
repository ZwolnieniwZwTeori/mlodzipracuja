import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOffers } from "@/lib/api";
import { CITIES } from "@/data/locations";
import { cityName, findCity } from "@/lib/cities-server";
import { SITE_URL } from "@/lib/site";
import CategoryStrip from "@/components/CategoryStrip";
import OfferCard from "@/components/OfferCard";
import Pagination from "@/components/Pagination";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const name = cityName(city);
  return {
    title: `Praca dla młodzieży — ${name}`,
    description: `Aktualne oferty pracy dla nastolatków 14–18 lat w mieście ${name}: gastronomia, handel, korepetycje, opieka i więcej. Bez logowania, ze sprawdzoną moderacją.`,
    alternates: { canonical: `${SITE_URL}/lokalizacja/${city}` },
  };
}

export default async function LocationPage({
  params,
  searchParams,
}: {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { city } = await params;
  const resolvedSearchParams = await searchParams;

  const entry = CITIES.find((c) => c.slug === city);
  const fallback = findCity(city);
  // Miasta spoza TOP5 (bez gotowego opisu) też mają stronę — z opisem
  // ogólnym i wynikami wyszukiwania po nazwie (pusto, dopóki backend
  // nie dostarczy ofert z tych miast).
  if (!entry && !fallback) notFound();
  const name = entry?.name ?? fallback!.name;
  const description =
    entry?.description ??
    `Szukasz pierwszej pracy w mieście ${name}? Pokażemy tu oferty dla młodzieży 14–18 lat, gdy tylko się pojawią — tymczasem sprawdź pobliskie miasta albo wszystkie kategorie.`;

  const page = Number(resolvedSearchParams.page ?? "1") || 1;
  const offers = await getOffers({ location: name, page, limit: 9 });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: name,
        item: `${SITE_URL}/lokalizacja/${city}`,
      },
    ],
  };

  return (
    <div className="container-content py-12">
      <JsonLd data={breadcrumbSchema} />
      <nav className="flex items-center gap-2 text-sm text-ink-faint" aria-label="Okruszki">
        <Link href="/" className="transition-colors hover:text-ink">
          Strona główna
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink-soft">Lokalizacja</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="eyebrow">Praca dla młodzieży 14–18 lat</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {name}
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
            {description}
          </p>
        </div>
        <p className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm text-ink-soft" aria-live="polite">
          {offers.total === 0
            ? "Brak ofert"
            : `${offers.total} ${offers.total === 1 ? "oferta" : offers.total < 5 ? "oferty" : "ofert"}`}
        </p>
      </div>

      <div className="mt-8">
        <CategoryStrip />
      </div>

      <div className="mt-10">
        {offers.results.length === 0 ? (
          <div className="card px-6 py-16 text-center">
            <p className="text-lg font-semibold">
              Brak aktualnych ofert w tej lokalizacji.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Sprawdź pobliskie miasta albo wszystkie oferty — nowe zlecenia
              pojawiają się regularnie.
            </p>
            <Link href="/" className="btn-outline mt-6">
              Wróć do wszystkich ofert
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {offers.results.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
            <div className="mt-10">
              <Pagination page={offers.page} limit={offers.limit} total={offers.total} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
