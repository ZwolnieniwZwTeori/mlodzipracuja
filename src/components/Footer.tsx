import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { CITIES } from "@/data/locations";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ink text-cream">
      <div className="container-content grid gap-12 py-14 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5" aria-label="pracamlodych.pl — strona główna">
            <Image
              src="/logo-mark.png"
              alt=""
              width={315}
              height={195}
              className="h-8 w-auto brightness-0 invert"
            />
            <span className="font-display text-xl font-black tracking-tight text-cream">
              praca<span className="font-normal opacity-70">mlodych</span>.pl
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            Miejsce, w którym nastolatki 14–18 lat znajdują pierwsze,
            bezpieczne zlecenia — bez czekania, aż skończą osiemnaście lat.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-cream/20 px-3 py-1 text-xs text-cream/70">
              Moderacja ręczna
            </span>
            <span className="rounded-full border border-cream/20 px-3 py-1 text-xs text-cream/70">
              Bez logowania
            </span>
            <span className="rounded-full border border-cream/20 px-3 py-1 text-xs text-cream/70">
              Wrocław i okolice
            </span>
          </div>
        </div>

        <nav aria-label="Kategorie w stopce">
          <p className="text-sm font-medium text-cream/50">Kategorie</p>
          <ul className="mt-4 space-y-2.5">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/kategoria/${c.slug}`}
                  className="text-sm text-cream/80 transition-colors hover:text-cream"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <details className="group mt-2.5">
            <summary className="cursor-pointer list-none text-sm font-medium text-cream/60 transition-colors hover:text-cream [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-1.5">
                Więcej kategorii ({CATEGORIES.length - 6})
                <span className="inline-block text-xs transition-transform group-open:rotate-180" aria-hidden="true">
                  ▾
                </span>
              </span>
            </summary>
            <ul className="mt-2.5 space-y-2.5">
              {CATEGORIES.slice(6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/kategoria/${c.slug}`}
                    className="text-sm text-cream/80 transition-colors hover:text-cream"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </nav>

        <nav aria-label="Projekt w stopce">
          <p className="text-sm font-medium text-cream/50">Projekt</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/o-projekcie" className="text-sm text-cream/80 transition-colors hover:text-cream">
                O projekcie
              </Link>
            </li>
            <li>
              <Link href="/mentor" className="text-sm text-cream/80 transition-colors hover:text-cream">
                AI Mentor
              </Link>
            </li>
            <li>
              <Link href="/profil/start" className="text-sm text-cream/80 transition-colors hover:text-cream">
                Załóż profil
              </Link>
            </li>
            <li>
              <Link href="/prywatnosc" className="text-sm text-cream/80 transition-colors hover:text-cream">
                Polityka prywatności
              </Link>
            </li>
            <li>
              <Link href="/regulamin" className="text-sm text-cream/80 transition-colors hover:text-cream">
                Regulamin
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Pracodawcy w stopce">
          <p className="text-sm font-medium text-cream/50">Dla pracodawcy</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/#pracodawca" className="text-sm text-cream/80 transition-colors hover:text-cream">
                Jak dodać ofertę
              </Link>
            </li>
            <li>
              <Link href="/dodaj-oferte" className="text-sm text-cream/80 transition-colors hover:text-cream">
                Formularz zgłoszenia
              </Link>
            </li>
            <li>
              <Link href="/o-projekcie" className="text-sm text-cream/80 transition-colors hover:text-cream">
                Zasady bezpieczeństwa
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-content flex flex-col gap-3 py-5 text-xs text-cream/50">
          <p>
            Praca dla młodzieży według miasta:{" "}
            {CITIES.map((c, i) => (
              <span key={c.slug}>
                {i > 0 && " · "}
                <Link href={`/lokalizacja/${c.slug}`} className="transition-colors hover:text-cream">
                  {c.name}
                </Link>
              </span>
            ))}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} pracamlodych.pl — projekt w ramach Zwolnieni z Teorii</p>
            <p>Każda oferta zewnętrzna jest weryfikowana pod kątem zgodności z prawem pracy dla młodocianych.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
