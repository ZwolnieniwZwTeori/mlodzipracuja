# pracamlodych.pl — frontend

Frontend platformy z ofertami pracy i zleceń dla nastolatków 14–18 lat.
Zbudowany zgodnie ze stackiem ustalonym w dokumentach projektu ("Drzewo
techniczne Zwolnieni z Teorii"): **Next.js (App Router) + TypeScript +
Tailwind CSS**.

## Uruchomienie lokalne

Wymagania: Node.js 18+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Aplikacja wystartuje na `http://localhost:3000`.

**Backend nie jest jeszcze potrzebny, żeby to uruchomić.** Dopóki
`NEXT_PUBLIC_API_URL` w `.env.local` jest puste, frontend korzysta z danych
przykładowych z `src/data/mock-offers.ts` (12 realistycznych ofert w
różnych kategoriach i miastach). Gdy backend kolegi będzie gotowy, wystarczy
ustawić:

```
NEXT_PUBLIC_API_URL=https://twoj-backend.example.com
```

i przebudować/zrestartować appkę — cała logika przełączania między mockami
a prawdziwym API jest już w `src/lib/api.ts`.

## Struktura projektu

```
app/
  page.tsx                 → strona główna (hero, wyszukiwarka, lista ofert, FAQ)
  kategoria/[slug]/         → widok jednej kategorii (8 kategorii)
  lokalizacja/[city]/       → oferty w danym mieście (wszystkie 1026 miast
                             wg TERYT 2026; rozbudowane opisy dla 5 głównych)
  oferta/[id]/               → szczegóły oferty + schema JobPosting
  dodaj-oferte/              → formularz dodawania oferty (POST /api/offers)
  dziekujemy/                → strona podziękowania po wysłaniu formularza (noindex)
  profil/start               → wybór roli: kandydat / pracodawca (demo, localStorage)
  profil/kandydat            → kreator profilu w 4 krokach (O Tobie, umiejętności…)
  profil/pracodawca          → panel pracodawcy: ogłoszenia, kandydaci (podgląd demo)
  mentor/                    → AI Mentor (POST /api/mentor)
  o-projekcie/                → bezpieczeństwo, RODO, o projekcie
  prywatnosc/, regulamin/    → dokumenty prawne (RODO, młodociani)
  layout.tsx, globals.css    → layout globalny, fonty, style bazowe
  robots.ts, sitemap.ts      → robots.txt i sitemap.xml (19 adresów)
  loading.tsx                → globalny szkielet ładowania
  favicon.ico                → favicon (kopia z ../logo/favicon.ico)

src/
  components/                → komponenty UI (OfferCard, FilterBar, Navbar...)
  lib/
    types.ts                → typy zgodne z kontraktem API
    api.ts                  → klient API + fallback na mocki
    offer-schema.ts         → walidacja formularza (zod)
    format.ts               → formatowanie dat/etykiet
  data/
    categories.ts           → 19 kategorii + opisy na strony kategorii
    cities.json             → rejestr 1026 miast (TERYT 2026, tylko serwer)
    mock-offers.ts          → przykładowe oferty do developmentu bez backendu
```

## Zgodność z kontraktem API

Wszystkie zapytania sieciowe przechodzą przez `src/lib/api.ts` i odpowiadają
formatowi z dokumentu **"0. KONTRAKT MIĘDZY FRONTENDEM A BACKENDEM"**:

- `GET /api/offers?category=&location=&min_age=&page=&limit=` — lista ofert
  (zawsze tylko `moderation_status = approved` po stronie backendu)
- `GET /api/offers/:id` — szczegóły jednej oferty
- `POST /api/offers` — nowa oferta (trafia jako `pending`)
- `POST /api/mentor` — zapytanie do AI Mentora, zwraca ustrukturyzowany JSON
  (`recommended_categories`, `reasoning`, `next_step`, `matching_offer_ids`)

Jeśli backend zmieni kontrakt, wystarczy zaktualizować `src/lib/types.ts` i
`src/lib/api.ts` — reszta frontendu korzysta wyłącznie z tych dwóch plików,
nie robi żadnych zapytań "na własną rękę".

## Co jest już zrobione

- Strona główna z wyszukiwarką (miasto + kategoria + wiek 14/15/16+) i siatką ofert
- Filtrowanie po kategorii (`/kategoria/[slug]`) i paginacja
- Szczegóły oferty z rozróżnieniem: oferta zweryfikowana ręcznie (dane
  kontaktowe) vs. oferta zewnętrzna z OLX/Jooble (link + ostrzeżenie
  bezpieczeństwa)
- Formularz dodawania oferty: walidacja (react-hook-form + zod), pole
  honeypot antybotowe, ekran potwierdzenia moderacji
- AI Mentor: formularz pytania + wyświetlenie ustrukturyzowanej odpowiedzi
  wraz z dopasowanymi ofertami
- Strona "O projekcie" z sekcją o moderacji i RODO dla nieletnich
- Design oparty o dostarczone logo (monogram „pm", czerń/krem, akcent
  mchowej zieleni): `public/logo-mark.png` (znak z przezroczystym tłem,
  wycięty z `../logo/removebackgroundlogo.png`), `app/favicon.ico`
  (kopia z `../logo/favicon.ico`), fonty Archivo + Work Sans (samohostowane przez
  `@fontsource`, więc build działa offline/w CI bez dostępu do Google Fonts)

## Czego celowo nie ma (do zrobienia razem z backendem)

- Prawdziwej autentykacji — kontrakt zakłada brak logowania do przeglądania,
  a prosty e-mail+kod tylko przy dodawaniu oferty; nie było to jeszcze
  ustalone wystarczająco precyzyjnie, żeby to zakodować
- Panelu moderacji — zgodnie z dokumentem "Przewodnik Techniczny Backend"
  moderacja na MVP odbywa się bezpośrednio w Supabase Studio, nie w UI
- Prawdziwego wywołania Claude API dla AI Mentora — obecnie mockowana
  odpowiedź w `src/lib/api.ts` (`askMentor`), do podmiany na `fetch` do
  `POST /api/mentor`, gdy backend go wystawi

## SEO, bezpieczeństwo i zgodność (audyt 09/2026)

Wdrożone we frontendzie:

- Unikalne title/description dla każdej podstrony (template `%s — pracamlodych.pl`),
  canonical, `metadataBase` (`NEXT_PUBLIC_SITE_URL`), Open Graph + Twitter Card
  (`public/og-image.png`), komplet faviconów (ico + apple-touch-icon).
- Dane strukturalne: Organization + WebSite (layout), FAQPage (strona główna),
  BreadcrumbList (kategorie, lokalizacje, oferty), JobPosting (szczegóły oferty).
- Sekcja FAQ (natywne `<details>`, treść widoczna dla robotów), strony lokalizacyjne
  (`/lokalizacja/[city]`), powiązane oferty, okruszki, pasek miast w stopce.
- UX: przyklejone mobilne CTA, strona `/dziekujemy`, custom 404, globalny skeleton
  (`loading.tsx`), poprawiony kontrast `ink-faint` do 5.23:1 (WCAG AA).
- Prawo: baner cookie (zapis wyboru w localStorage, zero śledzenia), `/prywatnosc`,
  `/regulamin`. **Przed publikacją uzupełnij adres administratora danych w polityce.**
- Bezpieczeństwo: nagłówki `nosniff`/`SAMEORIGIN`/referrer/permissions-policy
  (`next.config.mjs`), `.gitignore` (secrets, `.next`, logi), walidacja zod + honeypot.
  W repo nie ma sekretów (sprawdzone skanem; incydent `supabasepasswd.txt` opisany poniżej).

Celowo pominięte (uzasadnienie w raporcie z audytu): fałszywe opinie/blog na siłę,
kontakt-fikcja w stopce (podaj prawdziwy e-mail zespołu), pełne CSP (breakuje hydratację
Next.js — najpierw tryb report-only na hostingu).

Do zrobienia po stronie backendu/hostingu (poza frontendem): rate limiting i CAPTCHA
przy POST, serwerowa walidacja + sanityzacja, HTTPS/HSTS, analityka prywatnościowa
(np. Plausible — dopiero po decyzji zespołu), Cloudflare (DNS, SSL, CDN/cache, boty),
cron do wygaszania ofert, backupy Supabase.

## Bezpieczeństwo — uwaga

W paczce, z której powstał ten frontend, znajdował się plik
`acount/supabasepasswd.txt` z hasłem w czystym tekście. Nie był on używany
przy budowie frontendu. Zalecane działania:

- usuń ten plik z repozytorium i z wszystkich kopii/zipów projektu,
- zrotuj to hasło w Supabase, jeśli paczka trafiła gdziekolwiek indziej niż
  do zaufanych członków zespołu,
- w przyszłości trzymaj sekrety wyłącznie w zmiennych środowiskowych
  (`.env`, nigdy commitowanych) — stąd `.env.example` w tym repo zamiast
  realnych kluczy.

## Znany dług techniczny

`npm audit` zgłasza jedną podatność w `postcss` (bundlowanym wewnątrz
Next.js 15.5.x) dotyczącą przetwarzania nieufnego CSS w build-time — nie
dotyczy runtime'u tej aplikacji, ale warto sprawdzić przy okazji aktualizacji
do Next.js 16.
