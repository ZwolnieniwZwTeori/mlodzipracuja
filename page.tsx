import Link from "next/link";
import Image from "next/image";
import { getOffers } from "@/lib/api";
import type { CategorySlug } from "@/lib/types";
import { relativeDate } from "@/lib/format";
import { categoryName, CATEGORIES } from "@/data/categories";
import FilterBar from "@/components/FilterBar";
import CategoryStrip from "@/components/CategoryStrip";
import OfferCard from "@/components/OfferCard";
import Pagination from "@/components/Pagination";
import CompanyGrid, { type CompanyEntry } from "@/components/CompanyGrid";
import CityDirectory from "@/components/CityDirectory";
import { CITIES_COUNT, searchCities } from "@/lib/cities-server";
import Faq, { FAQ_ITEMS } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

const AGE_LABELS: Record<string, string> = {
  "14": "14 lat",
  "15": "15 lat",
  "16": "16+ lat",
};

const TRUST = [
  {
    title: "Moderacja ręczna",
    text: "Każde zgłoszenie sprawdzamy, zanim trafi na stronę.",
  },
  {
    title: "Bez logowania",
    text: "Oferty przeglądasz od razu, bez zakładania konta.",
  },
  {
    title: "Dopasowanie do wieku",
    text: "Widełki 14–18 lat przy każdej ofercie i filtr wieku.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Znajdź coś dla siebie",
    text: "Filtruj po mieście, kategorii i wieku albo zapytaj AI Mentora.",
  },
  {
    n: "2",
    title: "Sprawdź szczegóły",
    text: "Przeczytaj opis, widełki wieku i zasady bezpieczeństwa.",
  },
  {
    n: "3",
    title: "Odezwij się",
    text: "Skontaktuj się z organizatorem — najlepiej z rodzicem obok.",
  },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; location?: string; company?: string; q?: string; age?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? "1") || 1;
  const age = resolvedSearchParams.age ? Number(resolvedSearchParams.age) : undefined;
  const activeCategory = resolvedSearchParams.category as CategorySlug | undefined;
  const activeLocation = resolvedSearchParams.location?.trim() || undefined;
  const activeCompany = resolvedSearchParams.company?.trim() || undefined;
  const activeQuery = resolvedSearchParams.q?.trim() || undefined;
  const activeAge = Number.isFinite(age) ? String(age) : undefined;
  const hasFilters = Boolean(activeCategory || activeLocation || activeCompany || activeQuery || activeAge);

  const stats = await getOffers({ limit: 1 });
  const offers = await getOffers({
    category: activeCategory,
    location: activeLocation,
    company: activeCompany,
    q: activeQuery,
    min_age: Number.isFinite(age) ? age : undefined,
    page,
    limit: 9,
  });

  // Polecane firmy — grupowanie realnych ofert po polu company
  // (działa tak samo na mockach i na prawdziwym backendzie).
  const allOffers = await getOffers({ limit: 100 });
  const byCompany = new Map<string, { count: number; latest: string }>();
  for (const o of allOffers.results) {
    if (!o.company) continue;
    const prev = byCompany.get(o.company);
    if (prev) {
      prev.count += 1;
      if (o.created_at > prev.latest) prev.latest = o.created_at;
    } else {
      byCompany.set(o.company, { count: 1, latest: o.created_at });
    }
  }
  const companies: CompanyEntry[] = [...byCompany.entries()]
    .map(([name, v]) => ({ name, count: v.count, latest: v.latest }))
    .sort((a, b) => (a.latest < b.latest ? 1 : -1))
    .slice(0, 8);

  // Statystyki do panelu "Na dziś w bazie"
  const citiesCount = new Set(allOffers.results.map((o) => o.location)).size;
  const freshCount = allOffers.results.filter(
    (o) => new Date(o.created_at).getTime() >= Date.now() - 7 * 86_400_000
  ).length;
  const latestOffers = [...allOffers.results]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 2);

  // Popularne kategorie — realne liczniki ofert (jak kafelki TaskRabbit,
  // ale typograficzne zamiast stockowych zdjęć).
  const categoryCounts = CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: allOffers.results.filter((o) => o.category === c.slug).length,
  }));
  const topCategories = [...categoryCounts]
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <section className="container-content grid gap-10 pb-12 pt-12 md:grid-cols-[1.15fr_0.85fr] md:gap-14 md:pt-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-moss/25 bg-moss-tint px-3.5 py-1.5 text-xs font-medium text-moss-dark">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" aria-hidden="true" />
            Wrocław, Wołów, Brzeg Dolny i okolice
          </p>
          {/* Płynna typografia jak w serwisie referencyjnym: skaluje się
              z szerokością ekranu zamiast skakać między breakpointami */}
          <h1 className="mt-5 text-[clamp(2rem,8vw,3.75rem)] font-black leading-[1.06] tracking-tight">
            Pierwsza praca,
            <br />
            zanim skończysz
            <br />
            osiemnaście lat.
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-soft">
            Od gastronomii i handlu po opiekę, korepetycje i prace zdalne —
            realne, dopasowane wiekowo zlecenia od lokalnych organizatorów,
            zebrane w jednym miejscu i sprawdzone, zanim do Ciebie trafią.
          </p>
          <div className="mt-8">
            <FilterBar />
          </div>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-soft">
            <span className="inline-flex items-center gap-1.5 font-medium text-moss-dark">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {stats.total} {stats.total === 1 ? "oferta" : stats.total < 5 && stats.total > 0 ? "oferty" : "ofert"} zweryfikowanych pod kątem wieku
            </span>
            <span aria-hidden="true" className="text-ink-faint">·</span>
            <span className="text-ink-faint">
              Ostatnia aktualizacja: {latestOffers.length > 0 ? relativeDate(latestOffers[0].created_at) : "brak danych"}
            </span>
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">
              Popularne:
            </span>
            {topCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/kategoria/${c.slug}`}
                className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-[13px] text-ink-soft transition-all hover:-translate-y-px hover:border-ink hover:text-ink"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="notch-tl relative flex flex-1 flex-col overflow-hidden bg-ink p-7 text-cream">
            <Image
              src="/logo-mark.png"
              alt=""
              aria-hidden="true"
              width={315}
              height={195}
              className="pointer-events-none absolute -bottom-10 -right-10 w-60 opacity-[0.08] invert"
            />
            <div className="relative flex items-center justify-between gap-3">
              <p className="text-sm text-cream/60">Na dziś w bazie</p>
              <p className="inline-flex items-center gap-1.5 rounded-full border border-cream/20 px-2.5 py-1 text-[11px] font-medium text-cream/80">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss-tint opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-moss-tint" />
                </span>
                aktualne
              </p>
            </div>
            <p className="relative mt-3 font-display text-6xl font-black leading-none">
              {stats.total}
            </p>
            <p className="relative mt-1 text-sm text-cream/70">aktywnych, zatwierdzonych ofert</p>

            <dl className="relative mt-6 grid grid-cols-3 divide-x divide-cream/15 rounded border border-cream/15 text-center">
              {[
                { v: String(CATEGORIES.length), l: "kategorii" },
                { v: String(citiesCount), l: "miast" },
                { v: String(freshCount), l: "nowych w 7 dni" },
              ].map((s) => (
                <div key={s.l} className="flex flex-col px-2 py-3">
                  <dt className="order-2 mt-1 text-[11px] uppercase tracking-wider text-cream/55">{s.l}</dt>
                  <dd className="order-1 font-display text-2xl font-black">{s.v}</dd>
                </div>
              ))}
            </dl>

            {latestOffers.length > 0 && (
              <div className="relative mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cream/55">
                  Ostatnio dodane
                </p>
                <ul className="mt-2.5 space-y-2.5">
                  {latestOffers.map((o) => (
                    <li key={o.id}>
                      <Link href={`/oferta/${o.id}`} className="group block">
                        <span className="block truncate text-sm font-semibold text-cream group-hover:underline group-hover:underline-offset-4">
                          {o.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-cream/60">
                          {o.company ? `${o.company} · ` : ""}{o.location} · {relativeDate(o.created_at)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href="/mentor"
              className="relative mt-6 inline-flex w-fit items-center gap-2 rounded border border-cream/30 px-4 py-2 text-sm transition-colors hover:border-cream hover:bg-cream/10"
            >
              Nie wiesz, od czego zacząć? Zapytaj AI Mentora
            </Link>
          </div>
          <div className="card grid grid-cols-3 divide-x divide-line text-center">
            {[
              { v: String(CATEGORIES.length), l: "kategorii" },
              { v: "14+", l: "minimalny wiek" },
              { v: "0 zł", l: "za przeglądanie" },
            ].map((s) => (
              <div key={s.l} className="px-2 py-4">
                <p className="font-display text-xl font-black">{s.v}</p>
                <p className="mt-0.5 text-xs text-ink-faint">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper/60" aria-label="Dlaczego my">
        <div className="container-content grid gap-6 py-8 sm:grid-cols-3">
          {TRUST.map((t) => (
            <div key={t.title} className="flex gap-3.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss-tint text-moss-dark" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <div>
                <p className="text-[15px] font-semibold">{t.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-content pt-10">
        <CategoryStrip active={activeCategory} />
      </section>

      <section id="oferty" className="container-content scroll-mt-24 pb-20 pt-6" aria-label="Lista ofert">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">
              {hasFilters ? "Wyniki wyszukiwania" : "Najnowsze oferty"}
            </h2>
            <p className="mt-1 text-sm text-ink-soft" aria-live="polite">
              {offers.total === 0
                ? "Brak ofert"
                : `${offers.total} ${offers.total === 1 ? "oferta" : offers.total < 5 ? "oferty" : "ofert"}`}
            </p>
          </div>
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {activeQuery && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-paper px-3 py-1 text-xs">
                  „{activeQuery}”
                </span>
              )}
              {activeCategory && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-paper px-3 py-1 text-xs">
                  {categoryName(activeCategory)}
                </span>
              )}
              {activeLocation && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-paper px-3 py-1 text-xs">
                  {activeLocation}
                </span>
              )}
              {activeCompany && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-paper px-3 py-1 text-xs">
                  {activeCompany}
                </span>
              )}
              {activeAge && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-paper px-3 py-1 text-xs">
                  Wiek: {AGE_LABELS[activeAge] ?? activeAge}
                </span>
              )}
              <Link href="/" className="text-xs font-medium text-moss-dark underline underline-offset-4 hover:text-ink">
                Wyczyść filtry
              </Link>
            </div>
          )}
        </div>

        {offers.results.length === 0 ? (
          <div className="card mt-6 px-6 py-16 text-center">
            <p className="text-lg font-semibold">Brak ofert spełniających te kryteria.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Spróbuj innej kategorii albo szerszej lokalizacji — albo daj się
              zaskoczyć i zapytaj AI Mentora, co pasuje do Twoich zainteresowań.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn-outline">
                Pokaż wszystkie oferty
              </Link>
              <Link href="/mentor" className="btn-primary">
                Zapytaj AI Mentora
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {offers.results.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
            <div className="mt-10">
              <Pagination page={offers.page} limit={offers.limit} total={offers.total} />
            </div>
          </>
        )}
      </section>

      {topCategories.length > 0 && (
      <section className="container-content pb-20" aria-label="Popularne kategorie">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="section-title">Popularne kategorie</h2>
          <p className="max-w-md text-sm text-ink-soft">
            Tu jest najwięcej zleceń dla Twojego wieku.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/kategoria/${c.slug}`}
              className="card card-hover group flex items-center justify-between gap-4 p-6"
            >
              <div>
                <p className="font-display text-4xl font-black text-moss">
                  {c.count}
                </p>
                <p className="mt-1 text-lg font-bold text-ink">{c.name}</p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {c.count === 1 ? "oferta" : c.count < 5 ? "oferty" : "ofert"} dla 14–18 lat
                </p>
              </div>
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-lg transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-cream"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
      )}

      <section className="border-y border-line bg-paper/60" aria-label="Jak to działa">
        <div className="container-content py-14">
          <p className="eyebrow">Jak to działa</p>
          <h2 className="section-title mt-2">Trzy kroki do pierwszej pracy</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="card p-6">
                <p className="font-display text-3xl font-black text-moss/30">{s.n}</p>
                <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-content pb-20 pt-20" aria-label="Polecane firmy">
        <p className="eyebrow">Polecane firmy</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="section-title">Firmy, które szukają młodych</h2>
          <p className="max-w-md text-sm text-ink-soft">
            Organizatorzy z aktualnymi ofertami — kliknij, żeby zobaczyć ich zlecenia.
          </p>
        </div>
        <div className="mt-8">
          <CompanyGrid companies={companies} />
        </div>
      </section>

      <section className="bg-ink text-cream" aria-label="AI Mentor">
        <div className="container-content flex flex-col items-start gap-5 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cream/60">
              AI Mentor
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Nie wiesz, od czego zacząć?
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-cream/70">
              Opisz w dwóch zdaniach, co lubisz robić — Mentor dopasuje realne
              oferty z naszej bazy w mniej niż minutę.
            </p>
          </div>
          <Link
            href="/mentor"
            className="shrink-0 rounded-full border border-cream bg-cream px-7 py-3 text-sm font-semibold text-ink transition-colors hover:bg-transparent hover:text-cream"
          >
            Zapytaj AI Mentora
          </Link>
        </div>
      </section>

      <section className="border-b border-line bg-paper/60" aria-label="Częste pytania">
        <div className="container-content max-w-3xl py-14">
          <p className="eyebrow">FAQ</p>
          <h2 className="section-title mt-2">Częste pytania</h2>
          <p className="mt-3 text-[15px] text-ink-soft">
            Wszystko, co warto wiedzieć, zanim aplikujesz na pierwszą ofertę.
          </p>
          <div className="mt-8">
            <Faq />
          </div>
        </div>
      </section>

      <section id="pracodawca" className="scroll-mt-24 border-b border-line bg-moss-tint" aria-label="Dla pracodawcy">
        <div className="container-content grid gap-8 py-14 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="eyebrow">Dla pracodawców i organizatorów</p>
            <h2 className="section-title mt-2">Masz ofertę dla nastolatków?</h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
              Dodaj ją za darmo. Każde zgłoszenie przechodzi ręczną moderację,
              zanim pojawi się na stronie — dla bezpieczeństwa naszych użytkowników.
            </p>
            <ol className="mt-6 space-y-3 text-sm">
              {[
                "Wypełnij krótki formularz — tytuł, kategoria, widełki wieku, kontakt.",
                "Czekasz na moderację — zwykle do 24 godzin.",
                "Oferta pojawia się na stronie i trafia do dopasowanych kandydatów.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-cream">
                    {i + 1}
                  </span>
                  <span className="text-ink-soft">{t}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col items-stretch gap-3 md:items-end">
            <Link href="/dodaj-oferte" className="btn-primary w-full md:w-auto">
              Dodaj ofertę — za darmo
            </Link>
            <Link href="/o-projekcie" className="text-sm text-moss-dark underline underline-offset-4 hover:text-ink">
              Poznaj zasady bezpieczeństwa
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line" aria-label="Przeglądaj oferty">
        <div className="container-content py-12">
          <p className="eyebrow">Katalog</p>
          <h2 className="section-title mt-2">Przeglądaj oferty</h2>
          <div className="mt-8 grid items-start gap-4 sm:grid-cols-2">
            <details className="group rounded border border-line bg-paper px-5 py-4 sm:px-6" open>
              <summary className="cursor-pointer list-none text-[15px] font-semibold text-ink transition-colors hover:text-moss-dark [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  Praca dla młodzieży według miasta
                  <span className="flex items-center gap-2">
                    <span className="rounded-full bg-moss-tint px-2.5 py-0.5 text-xs font-medium text-moss-dark">
                      {CITIES_COUNT}
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line text-sm text-ink-soft transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </span>
                </span>
              </summary>
              <div className="mt-3 border-t border-line pt-3">
                <CityDirectory initial={searchCities("", 60)} total={CITIES_COUNT} />
              </div>
            </details>
            <details className="group rounded border border-line bg-paper px-5 py-4 sm:px-6" open>
              <summary className="cursor-pointer list-none text-[15px] font-semibold text-ink transition-colors hover:text-moss-dark [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  Praca dla młodzieży według kategorii
                  <span className="flex items-center gap-2">
                    <span className="rounded-full bg-moss-tint px-2.5 py-0.5 text-xs font-medium text-moss-dark">
                      {CATEGORIES.length}
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line text-sm text-ink-soft transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </span>
                </span>
              </summary>
              <ul className="mt-3 space-y-2 border-t border-line pt-3">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/kategoria/${c.slug}`}
                      className="text-sm text-ink-soft transition-colors hover:text-ink hover:underline hover:underline-offset-4"
                    >
                      {c.name} — praca od 14–18 lat
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
