import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Załóż profil",
  description:
    "Załóż bezpłatny profil na pracamlodych.pl — dla uczniów szukających pracy albo dla pracodawców z ofertami dla młodzieży 14–18 lat.",
};

const ROLES = [
  {
    href: "/profil/kandydat",
    eyebrow: "Dla uczniów i studentów",
    title: "Szukam pracy",
    text: "4 krótkie kroki: o Tobie, umiejętności zamiast CV, dyspozycyjność i konto. Profil trzyma Twoje zgłoszenia w jednym miejscu.",
    cta: "Załóż profil kandydata",
  },
  {
    href: "/profil/pracodawca",
    eyebrow: "Dla firm i organizatorów",
    title: "Mam ofertę dla młodych",
    text: "Wizytówka firmy, Twoje ogłoszenia, zgłoszenia kandydatów i zaproszenia na rozmowy — wszystko w jednym panelu.",
    cta: "Otwórz panel pracodawcy",
  },
];

export default function RolePickerPage() {
  return (
    <div className="container-content max-w-3xl py-12">
      <p className="eyebrow">Konto</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
        Załóż profil
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
        Wybierz, kim jesteś. Profil kandydata pomoże Ci aplikować jednym
        kliknięciem, a panel pracodawcy zbierze zgłoszenia w jednym miejscu.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {ROLES.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="card card-hover group flex flex-col p-6 sm:p-7"
          >
            <p className="eyebrow">{r.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{r.title}</h2>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">
              {r.text}
            </p>
            <span className="btn-primary mt-6 w-full">{r.cta}</span>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink-faint">
        Wersja demo: profile zapisujemy na razie w Twojej przeglądarce. Pełne
        konta z logowaniem pojawią się razem z backendem.
      </p>
    </div>
  );
}
