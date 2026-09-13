import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Jak pracamlodych.pl przetwarza dane osobowe, jakie prawa masz zgodnie z RODO i jakie zasady dotyczą osób poniżej 16 lat.",
};

export default function PrivacyPage() {
  return (
    <div className="container-content max-w-2xl py-12">
      <p className="eyebrow">Dokumenty</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">Polityka prywatności</h1>
      <p className="mt-3 text-sm text-ink-faint">Aktualizacja: wrzesień 2026</p>

      <div className="mt-8 space-y-6 text-[16px] leading-relaxed text-ink-soft">
        <section>
          <h2 className="text-lg font-bold text-ink">1. Kto administruje danymi</h2>
          <p className="mt-2">
            Administratorem danych jest zespół projektu pracamlodych.pl
            (projekt realizowany w ramach Zwolnieni z Teorii).{" "}
            <strong className="text-rust">
              [UZUPEŁNIJ przed publikacją: nazwa administratora i adres e-mail
              do spraw prywatności.]
            </strong>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">2. Jakie dane zbieramy</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-ink">Przeglądanie ofert</strong> — nie wymaga
              podawania żadnych danych, nie zakładamy kont.
            </li>
            <li>
              <strong className="text-ink">Formularz dodawania oferty</strong> — tytuł,
              opis, lokalizacja, widełki wieku oraz dane kontaktowe organizatora
              (e-mail lub telefon). Kontakt publikujemy dopiero po zatwierdzeniu oferty.
            </li>
            <li>
              <strong className="text-ink">Wybór w banerze cookie</strong> — przechowujemy
              wyłącznie w Twojej przeglądarce (localStorage), nie na serwerze.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">3. Osoby poniżej 16 lat (RODO)</h2>
          <p className="mt-2">
            Zgodnie z RODO przetwarzanie danych osób poniżej 16 lat w usługach
            internetowych może wymagać zgody rodzica lub opiekuna. Jeśli nie masz
            16 lat, kontakt z organizatorem oferty i wysyłanie zgłoszeń rób razem
            z rodzicem lub opiekunem.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">4. Pliki cookie</h2>
          <p className="mt-2">
            Nie używamy ciasteczek śledzących, reklamowych ani narzędzi
            analitycznych zbierających dane osobowe. Jeśli w przyszłości włączymy
            anonimową statystykę odwiedzin, zaktualizujemy ten dokument i poprosimy
            o zgodę w banerze.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">5. Twoje prawa</h2>
          <p className="mt-2">
            Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia,
            ograniczenia przetwarzania oraz wniesienia skargi do Prezesa UODO.
            W sprawie swoich danych napisz do administratora (adres powyżej).
          </p>
        </section>
      </div>
    </div>
  );
}
