import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Zasady korzystania z pracamlodych.pl: moderacja ofert, bezpieczeństwo nieletnich i obowiązki organizatorów.",
};

export default function TermsPage() {
  return (
    <div className="container-content max-w-2xl py-12">
      <p className="eyebrow">Dokumenty</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">Regulamin</h1>
      <p className="mt-3 text-sm text-ink-faint">Aktualizacja: wrzesień 2026</p>

      <div className="mt-8 space-y-6 text-[16px] leading-relaxed text-ink-soft">
        <section>
          <h2 className="text-lg font-bold text-ink">1. Czym jest serwis</h2>
          <p className="mt-2">
            pracamlodych.pl to bezpłatna tablica zleceń i ofert pracy dorywczej
            dla osób w wieku 14–18 lat (projekt w ramach Zwolnieni z Teorii).
            Serwis wyłącznie prezentuje oferty — nie jest stroną umowy między
            kandydatem a organizatorem i nie pośredniczy w płatnościach.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">2. Moderacja</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Każda oferta dodana przez formularz trafia do ręcznej moderacji.</li>
            <li>Nie publikujemy ofert wymagających pełnoletności ani niezgodnych z przepisami o pracy młodocianych.</li>
            <li>Możemy odrzucić lub usunąć ofertę naruszającą regulamin, bez podania przyczyny.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">3. Obowiązki organizatora</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Podawaj prawdziwe dane kontaktowe i rzetelny opis pracy.</li>
            <li>Zlecenia dla nieletnich muszą być zgodne z Kodeksem pracy (dział IX: zatrudnianie młodocianych).</li>
            <li>Nie żądaj od kandydatów opłat, danych wrażliwych ani pracy próbnej bez wynagrodzenia.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">4. Bezpieczeństwo kandydatów</h2>
          <p className="mt-2">
            Nigdy nie płać z góry za możliwość podjęcia pracy i nie podawaj
            danych wrażliwych. Na pierwsze spotkanie z organizatorem zabierz
            rodzica lub opiekuna. Podejrzane oferty zgłaszaj zespołowi serwisu.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">5. Postanowienia końcowe</h2>
          <p className="mt-2">
            Korzystanie z serwisu jest bezpłatne. Regulamin może się zmieniać —
            aktualna wersja zawsze znajduje się na tej stronie.
          </p>
        </section>
      </div>
    </div>
  );
}
