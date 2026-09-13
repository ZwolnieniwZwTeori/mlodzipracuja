import Link from "next/link";

export const metadata = {
  title: "O projekcie",
  description:
    "pracamlodych.pl — jak sprawdzamy oferty pracy dla młodzieży, jak dbamy o RODO i bezpieczeństwo osób 14–18 lat.",
};

const CHECKS = [
  {
    title: "Moderacja ręczna",
    text: "Każda oferta dodana przez organizatora trafia najpierw do moderacji i jest publikowana dopiero po sprawdzeniu.",
  },
  {
    title: "Filtrowanie portali",
    text: "Oferty z OLX i Jooble przechodzą filtr widełek wiekowych i rodzaju pracy — nie pokazujemy ofert dla pełnoletnich.",
  },
  {
    title: "Ochrona przed spamem",
    text: "Formularz zgłoszeniowy jest zabezpieczony przed botami, a dane kontaktowe widać dopiero po zatwierdzeniu.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-content max-w-2xl py-12">
      <p className="eyebrow">Zwolnieni z Teorii</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">O projekcie</h1>

      <div className="mt-8 space-y-6 text-[17px] leading-relaxed text-ink-soft">
        <p>
          pracamlodych.pl powstało z prostej obserwacji: osoby w wieku 14–18
          lat chcą zarobić własne pieniądze, ale większość portali z ofertami
          pracy jest zbudowana z myślą o dorosłych — od wymogów wieku po
          rodzaj publikowanych zleceń. Zbieramy w jednym miejscu oferty
          faktycznie dopasowane do tej grupy wiekowej — od gastronomii, handlu
          i opieki, przez korepetycje, ogród i prace zdalne — łącznie
          w 19 kategoriach lekkich prac dorywczych.
        </p>

        <div className="card p-6 sm:p-7">
          <h2 className="text-lg font-bold text-ink">Jak sprawdzamy oferty</h2>
          <ul className="mt-4 space-y-4">
            {CHECKS.map((c, i) => (
              <li key={c.title} className="flex gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-moss-tint text-xs font-bold text-moss-dark">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">{c.title}</p>
                  <p className="mt-1 text-[15px]">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 sm:p-7">
          <h2 className="text-lg font-bold text-ink">Dane i prywatność</h2>
          <p className="mt-3 text-[15px]">
            Zbieramy tylko dane potrzebne do przedstawienia oferty i kontaktu
            w jej sprawie. Zgodnie z przepisami RODO przetwarzanie danych osób
            poniżej 16 lat może wymagać zgody rodzica lub opiekuna — jeśli nie
            masz jeszcze 16 lat, poproś rodzica o pomoc przy kontakcie z
            organizatorem oferty.
          </p>
        </div>

        <div className="rounded border border-moss/25 bg-moss-tint/60 p-6 sm:p-7">
          <h2 className="text-lg font-bold text-ink">Jesteś pracodawcą?</h2>
          <p className="mt-2 text-[15px]">
            Dodaj ofertę za darmo — przejdzie moderację i trafi do dopasowanych
            kandydatów, zwykle w ciągu 24 godzin.
          </p>
          <Link href="/dodaj-oferte" className="btn-primary mt-5">
            Dodaj ofertę
          </Link>
        </div>

        <p>
          Jeśli któraś z ofert wydaje Ci się niebezpieczna, nieuczciwa albo po
          prostu dziwna — napisz do nas. Każde zgłoszenie sprawdzamy ręcznie.
        </p>
      </div>
    </div>
  );
}
