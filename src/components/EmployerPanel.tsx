"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MOCK_OFFERS } from "@/data/mock-offers";
import { employerSchema } from "@/lib/profile-schema";
import { loadEmployer, saveEmployer, clearEmployer } from "@/lib/profile-store";
import CityCombobox from "@/components/CityCombobox";
import { companyInitials } from "@/lib/format";

interface DemoCandidate {
  id: string;
  name: string;
  meta: string;
  skills: string[];
  status: "new" | "seen" | "interview";
}

// Przykładowe zgłoszenia do podglądu panelu (tryb demo — z backendem
// przyjdą tu prawdziwe aplikacje kandydatów na Twoje ogłoszenia).
const DEMO_CANDIDATES: DemoCandidate[] = [
  {
    id: "cand-1",
    name: "Julia K.",
    meta: "17 lat · Wrocław · pt.–niedz. po 15:00",
    skills: ["Obsługa klienta", "Praca w zespole", "Angielski B1"],
    status: "new",
  },
  {
    id: "cand-2",
    name: "Mikołaj W.",
    meta: "16 lat · Wrocław · weekendy",
    skills: ["Kasa fiskalna", "Punktualność"],
    status: "new",
  },
  {
    id: "cand-3",
    name: "Zofia N.",
    meta: "18 lat · Wołów · elastycznie",
    skills: ["Barista (kurs)", "Obsługa klienta", "Fotografia"],
    status: "seen",
  },
  {
    id: "cand-4",
    name: "Antoni B.",
    meta: "17 lat · Brzeg Dolny · soboty",
    skills: ["Praca w zespole"],
    status: "interview",
  },
];

const STATUS_LABEL: Record<DemoCandidate["status"], string> = {
  new: "Nowe zgłoszenie",
  seen: "Profil obejrzany",
  interview: "Rozmowa: śr 16:00",
};

export default function EmployerPanel() {
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [invited, setInvited] = useState<string[]>(["cand-4"]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const e = loadEmployer();
    if (e) {
      setCompany(e.company);
      setCity(e.city);
      setEmail(e.email);
      setSaved(true);
    }
    setReady(true);
  }, []);

  const knownCompanies = useMemo(
    () => [...new Set(MOCK_OFFERS.map((o) => o.company).filter((c): c is string => Boolean(c)))],
    []
  );
  const offers = useMemo(
    () => MOCK_OFFERS.filter((o) => o.company === company),
    [company]
  );
  const newCount = DEMO_CANDIDATES.filter((c) => c.status === "new").length;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = employerSchema.safeParse({ company, city, email });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Sprawdź formularz.");
      return;
    }
    setError("");
    saveEmployer({ company: company.trim(), city: city.trim(), email: email.trim() });
    setSaved(true);
  }

  function reset() {
    clearEmployer();
    setCompany("");
    setCity("");
    setEmail("");
    setSaved(false);
  }

  if (!ready) {
    return (
      <div className="animate-pulse" aria-hidden="true">
        <div className="h-8 w-64 rounded bg-line" />
        <div className="mt-4 h-4 w-full rounded bg-line" />
      </div>
    );
  }

  if (!saved) {
    return (
      <div className="card p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight">Wizytówka firmy</h2>
        <p className="mt-2 text-[15px] text-ink-soft">
          Podaj dane firmy, żeby zobaczyć podgląd panelu. W wersji demo
          zapisujemy je tylko w Twojej przeglądarce.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="emp-company" className="label">
              Nazwa firmy lub organizacji
            </label>
            <input
              id="emp-company"
              list="emp-companies"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="np. Kawiarnia Filiżanka"
              className="input mt-1.5"
            />
            <datalist id="emp-companies">
              {knownCompanies.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <p className="mt-1.5 text-xs text-ink-faint">
              Wskazówka: wybierz firmę z podpowiedzi, żeby zobaczyć panel z prawdziwymi ogłoszeniami.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className="label">Miasto</span>
              <CityCombobox id="emp-city" value={city} onChange={setCity} />
            </div>
            <label className="block">
              <span className="label">E-mail kontaktowy</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="firma@example.com"
                autoComplete="email"
                className="input mt-1.5"
              />
            </label>
          </div>
          {error && (
            <p className="rounded-xl border border-rust/30 bg-rust/5 px-4 py-3 text-sm text-rust" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Otwórz panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Panel pracodawcy · podgląd demo</p>
          <h2 className="mt-2 flex items-center gap-3 text-3xl font-black tracking-tight sm:text-4xl">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-paper font-display text-base font-black"
              aria-hidden="true"
            >
              {companyInitials(company)}
            </span>
            {company}
          </h2>
          <button type="button" onClick={reset} className="mt-2 text-xs text-ink-faint underline underline-offset-4 hover:text-ink">
            Zmień firmę
          </button>
        </div>
        <Link href="/dodaj-oferte" className="btn-primary">
          Dodaj ogłoszenie
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { v: String(offers.length), l: offers.length === 1 ? "aktywne ogłoszenie" : "aktywne ogłoszenia" },
          { v: String(newCount), l: "nowe zgłoszenia" },
          { v: String(invited.length), l: invited.length === 1 ? "rozmowa w tym tygodniu" : "rozmowy w tym tygodniu" },
        ].map((s) => (
          <div key={s.l} className="card p-6">
            <p className="font-display text-4xl font-black">{s.v}</p>
            <p className="mt-1 text-sm text-ink-soft">{s.l}</p>
          </div>
        ))}
      </div>

      {offers.length > 0 ? (
        <h3 className="mt-10 text-2xl font-extrabold tracking-tight">
          Kandydaci — {offers[0].title}
        </h3>
      ) : (
        <div className="card mt-10 p-6 text-center">
          <p className="font-bold">Nie masz jeszcze aktywnych ogłoszeń.</p>
          <p className="mt-1 text-sm text-ink-soft">
            Dodaj pierwsze — kandydaci pojawią się na tej liście.
          </p>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {DEMO_CANDIDATES.map((c) => {
          const isInvited = invited.includes(c.id);
          return (
            <article key={c.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <span
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-paper font-display text-base font-black"
                aria-hidden="true"
              >
                {companyInitials(c.name.replace(".", ""))}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="text-[17px] font-bold">{c.name}</h4>
                <p className="mt-0.5 text-sm text-ink-soft">{c.meta}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.skills.map((s) => (
                    <span key={s} className="rounded-full border border-line bg-cream px-2.5 py-1 text-xs text-ink-soft">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    isInvited
                      ? "bg-gold-tint text-[#5C4212]"
                      : c.status === "seen"
                        ? "border border-rust/50 text-rust"
                        : "bg-paper text-ink-soft border border-line"
                  }`}
                >
                  {isInvited ? "Zaproszona · śr 16:00" : STATUS_LABEL[c.status]}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setInvited((prev) =>
                      prev.includes(c.id) ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                    )
                  }
                  className={isInvited ? "btn-outline" : "btn-primary"}
                >
                  {isInvited ? "Szczegóły rozmowy" : "Zaproś na rozmowę"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-ink-faint">
        Zaproszenie wysyła kandydatowi trzy terminy do wyboru — wybrany trafia
        od razu do kalendarza. Lista kandydatów to podgląd demo.
      </p>
    </div>
  );
}
