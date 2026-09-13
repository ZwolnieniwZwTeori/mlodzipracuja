import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOffers } from "@/lib/api";
import { CATEGORIES, categoryDescription, categoryName } from "@/data/categories";
import type { CategorySlug } from "@/lib/types";
import { SITE_URL } from "@/lib/site";
import CategoryStrip from "@/components/CategoryStrip";
import OfferCard from "@/components/OfferCard";
import Pagination from "@/components/Pagination";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = categoryName(slug);
  return {
    title: `${name} — praca dla młodzieży 14–18 lat`,
    description: `Aktualne oferty pracy dla nastolatków w kategorii ${name}: ${categoryDescription(slug)} Wrocław, Wołów, Brzeg Dolny i okolice.`,
    alternates: { canonical: `${SITE_URL}/kategoria/${slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const isKnown = CATEGORIES.some((c) => c.slug === slug);
  if (!isKnown) notFound();

  const page = Number(resolvedSearchParams.page ?? "1") || 1;
  const offers = await getOffers({
    category: slug as CategorySlug,
    page,
    limit: 9,
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName(slug),
        item: `${SITE_URL}/kategoria/${slug}`,
      },
    ],
  };

  return (
    <div className="container-content py-12">
      <JsonLd data={breadcrumbSchema} />
      <nav className="flex flex-wrap items-center gap-2 text-sm text-ink-faint" aria-label="Okruszki">
        <Link href="/" className="transition-colors hover:text-ink">
          Strona główna
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink-soft">Kategoria</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="eyebrow">Oferty pracy dla młodzieży 14–18 lat</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {categoryName(slug)}
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
            {categoryDescription(slug)}
          </p>
        </div>
        <p className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm text-ink-soft" aria-live="polite">
          {offers.total === 0
            ? "Brak ofert"
            : `${offers.total} ${offers.total === 1 ? "oferta" : offers.total < 5 ? "oferty" : "ofert"}`}
        </p>
      </div>

      <div className="mt-8">
        <CategoryStrip active={slug} />
      </div>

      <div className="mt-10">
        {offers.results.length === 0 ? (
          <div className="card px-6 py-16 text-center">
            <p className="text-lg font-semibold">
              Brak aktualnych ofert w tej kategorii.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Zajrzyj tu ponownie za kilka dni albo sprawdź inne kategorie —
              nowe oferty pojawiają się regularnie.
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
