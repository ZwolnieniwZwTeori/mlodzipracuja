export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Od ilu lat mogę szukać pracy na pracamlodych.pl?",
    a: "Serwis jest przeznaczony dla osób w wieku 14–18 lat. Każda oferta ma podane widełki wieku (np. 15–18 lat) — użyj filtra wieku w wyszukiwarce, żeby zobaczyć tylko oferty dla siebie. Pamiętaj, że osoby poniżej 16 lat przy kontakcie z pracodawcą powinny mieć zgodę i wsparcie rodzica lub opiekuna.",
  },
  {
    q: "Czy muszę zakładać konto, żeby przeglądać oferty?",
    a: "Nie. Wszystkie oferty przeglądasz bez logowania i bez opłat. Kontaktujesz się bezpośrednio z organizatorem oferty — mailem lub telefonem podanym w ogłoszeniu.",
  },
  {
    q: "Czy oferty są sprawdzone i bezpieczne?",
    a: "Tak. Każda oferta dodana przez organizatora przechodzi ręczną moderację, zanim pojawi się na stronie. Oferty z zewnętrznych portali (OLX, Jooble) filtrujemy pod kątem widełek wiekowych i rodzaju pracy — nie publikujemy ofert wymagających pełnoletności.",
  },
  {
    q: "Jak dodać ofertę pracy dla nastolatków?",
    a: "Wypełnij darmowy formularz na stronie Dodaj ofertę: tytuł, kategoria, miasto, opis, widełki wieku i kontakt. Zgłoszenie trafi do moderacji — zwykle publikujemy je w ciągu 24 godzin.",
  },
  {
    q: "Ile kosztuje dodanie oferty?",
    a: "Nic. Dodawanie i przeglądanie ofert jest w pełni darmowe — to projekt społeczny realizowany w ramach Zwolnieni z Teorii.",
  },
  {
    q: "Czym jest AI Mentor?",
    a: "To doradca, który na podstawie Twojego opisu (zainteresowania, dyspozycyjność) dopasowuje realne oferty z naszej bazy i podpowiada kategorie warte sprawdzenia. Nie wymyśla ofert — pokazuje tylko te, które faktycznie istnieją w serwisie.",
  },
];

// Sekcja FAQ — natywne <details>/<summary>: treść jest w HTML od razu
// (dobre dla SEO), działa bez JavaScriptu i jest dostępna z klawiatury.
export default function Faq({ items = FAQ_ITEMS }: { items?: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-paper">
      {items.map((item) => (
        <details key={item.q} className="group px-5 py-4 sm:px-6">
          <summary className="cursor-pointer list-none text-[15px] font-semibold text-ink transition-colors hover:text-moss-dark [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-4">
              {item.q}
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-sm text-ink-soft transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </span>
          </summary>
          <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
