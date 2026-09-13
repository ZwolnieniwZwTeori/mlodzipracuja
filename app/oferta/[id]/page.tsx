import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOfferById, getOffers } from "@/lib/api";
import { categoryName } from "@/data/categories";
import { relativeDate, sourceLabel } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { Badge } from "@/components/Badge";
import OfferCard from "@/components/OfferCard";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const offer = await getOfferById(id);
  if (!offer) return { title: "Nie znaleziono oferty" };
  return {
    title: offer.title,
    description: `${offer.title} — ${categoryName(offer.category)}, ${offer.location}, wiek ${offer.min_age}–${offer.max_age} lat. ${offer.description.slice(0, 120)}…`,
    alternates: { canonical: `${SITE_URL}/oferta/${offer.id}` },
  };
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOfferById(id);
  if (!offer) notFound();

  const isExternal = offer.source !== "manual";
  const related = (await getOffers({ category: offer.category, limit: 4 })).results
    .filter((o) => o.id !== offer.id)
    .slice(0, 3);

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: offer.title,
    description: offer.description,
    datePosted: offer.created_at,
    employmentType: "PART_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: isExternal ? sourceLabel(offer.source) : "Zweryfikowany pracodawca",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: offer.location,
        addressCountry: "PL",
      },
    },
    directApply: !isExternal,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName(offer.category),
        item: `${SITE_URL}/kategoria/${offer.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: offer.title,
        item: `${SITE_URL}/oferta/${offer.id}`,
      },
    ],
  };

  const meta = [
    ...(offer.company ? [{ label: "Firma", value: offer.company }] : []),
    { label: "Lokalizacja", value: offer.location },
    { label: "Wiek", value: `${offer.min_age}–${offer.max_age} lat` },
    ...(offer.salary ? [{ label: "Stawka", value: offer.salary }] : []),
    ...(offer.hours ? [{ label: "Godziny", value: offer.hours }] : []),
    { label: "Dodano", value: relativeDate(offer.created_at) },
    { label: "Źródło", value: sourceLabel(offer.source) },
  ];

  return (
    <div className="container-content max-w-3xl py-12">
      <JsonLd data={jobPostingSchema} />
      <JsonLd data={breadcrumbSchema} />
      <nav className="flex flex-wrap items-center gap-2 text-sm text-ink-faint" aria-label="Okruszki">
        <Link href="/" className="transition-colors hover:text-ink">
          Strona główna
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/kategoria/${offer.category}`} className="transition-colors hover:text-ink">
          {categoryName(offer.category)}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="max-w-52 truncate text-ink-soft">{offer.title}</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Badge tone="moss">{categoryName(offer.category)}</Badge>
        <Badge>
          {offer.min_age}–{offer.max_age} lat
        </Badge>
        <Badge>{offer.location}</Badge>
      </div>

      <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">{offer.title}</h1>
      <p className="mt-2 text-sm text-ink-faint">
        Dodano {relativeDate(offer.created_at)} · {sourceLabel(offer.source)}
      </p>

      <dl className="card mt-8 grid grid-cols-2 gap-px overflow-hidden sm:grid-cols-3">
        {meta.map((m) => (
          <div key={m.label} className="bg-paper px-4 py-4">
            <dt className="text-xs uppercase tracking-wider text-ink-faint">{m.label}</dt>
            <dd className="mt-1 text-[15px] font-semibold">{m.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <h2 className="text-lg font-bold">Na czym polega praca</h2>
        <p className="mt-3 whitespace-pre-line text-[17px] leading-relaxed text-ink-soft">
          {offer.description}
        </p>
      </div>

      <div className={`mt-10 rounded border p-6 sm:p-7 ${isExternal ? "border-gold/40 bg-gold-tint/40" : "border-moss/25 bg-moss-tint/60"}`}>
        {isExternal ? (
          <>
            <p className="flex items-center gap-2 text-[15px] font-bold">
              <span aria-hidden="true">⚠</span> To ogłoszenie pochodzi z zewnętrznego portalu ({sourceLabel(offer.source)}).
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Przed odpowiedzią sprawdź ofertę uważnie na stronie źródłowej.</li>
              <li>Nigdy nie podawaj danych wrażliwych ani nie płać z góry za możliwość podjęcia pracy.</li>
              <li>Na spotkanie zabierz rodzica lub opiekuna.</li>
            </ul>
            {offer.source_url && (
              <a
                href={offer.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-5"
              >
                Przejdź do oferty →
              </a>
            )}
          </>
        ) : (
          <>
            <p className="flex items-center gap-2 text-[15px] font-bold">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-moss text-[11px] text-cream" aria-hidden="true">✓</span>
              Kontakt do zweryfikowanego organizatora
            </p>
            <p className="mt-3 break-words text-lg font-semibold">{offer.contact}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Ta oferta została ręcznie zweryfikowana przed publikacją. Jeśli coś
              wyda Ci się niepokojące w rozmowie z organizatorem, przerwij kontakt
              i powiedz o tym rodzicowi, opiekunowi lub nauczycielowi.
            </p>
          </>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-14" aria-label="Podobne oferty">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-extrabold tracking-tight">Podobne oferty</h2>
            <Link href={`/kategoria/${offer.category}`} className="text-sm font-medium text-moss-dark underline underline-offset-4 hover:text-ink">
              Więcej z kategorii
            </Link>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
