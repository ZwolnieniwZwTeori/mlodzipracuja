"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DAYS,
  DAY_PARTS,
  SKILLS,
  profileStep1Schema,
  profileStep2Schema,
  profileStep3Schema,
  profileStep4Schema,
  type CandidateProfile,
} from "@/lib/profile-schema";
import { loadCandidate, saveCandidate } from "@/lib/profile-store";
import CityCombobox from "@/components/CityCombobox";

const STEPS = [
  {
    key: "O Tobie",
    title: "Zacznijmy od podstaw",
    sub: "Te informacje zobaczy pracodawca, kiedy wyślesz zgłoszenie.",
  },
  {
    key: "Umiejętności",
    title: "Co potrafisz?",
    sub: "Zaznacz, co do Ciebie pasuje. To zastępuje CV — nic nie musisz pisać od zera.",
  },
  {
    key: "Dyspozycyjność",
    title: "Kiedy możesz pracować?",
    sub: "Dzięki temu pracodawca od razu wie, czy pasujecie sobie godzinami.",
  },
  {
    key: "Konto",
    title: "Ostatni krok — konto",
    sub: "Konto trzyma Twój profil i statusy aplikacji w jednym miejscu.",
  },
];

const AGES = [14, 15, 16, 17, 18];

interface FormState {
  displayName: string;
  city: string;
  age: number | null;
  skills: string[];
  bio: string;
  days: string[];
  parts: string[];
  email: string;
  password: string;
  parentalConsent: boolean;
}

const EMPTY: FormState = {
  displayName: "",
  city: "",
  age: null,
  skills: [],
  bio: "",
  days: [],
  parts: [],
  email: "",
  password: "",
  parentalConsent: false,
};

type Errors = Partial<Record<string, string>>;

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function CandidateWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Wczytaj zapisany profil (tryb edycji) — dopiero po montowaniu,
  // żeby nie rozjeżdżać hydratacji (localStorage nie istnieje na serwerze).
  useEffect(() => {
    const saved = loadCandidate();
    if (saved) {
      setForm({
        displayName: saved.displayName,
        city: saved.city,
        age: saved.age,
        skills: saved.skills,
        bio: saved.bio ?? "",
        days: saved.days,
        parts: saved.parts,
        email: saved.email,
        password: "",
        parentalConsent: saved.parentalConsent,
      });
    }
    setLoaded(true);
  }, []);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateStep(s: number): boolean {
    let result;
    if (s === 0) {
      result = profileStep1Schema.safeParse({
        displayName: form.displayName,
        city: form.city,
        age: form.age,
      });
    } else if (s === 1) {
      result = profileStep2Schema.safeParse({ skills: form.skills, bio: form.bio });
    } else if (s === 2) {
      result = profileStep3Schema.safeParse({ days: form.days, parts: form.parts });
    } else {
      result = profileStep4Schema.safeParse({
        email: form.email,
        password: form.password,
        parentalConsent: form.parentalConsent,
      });
    }
    if (result.success) {
      // Zgoda rodzica wymagana przed 16 urodzinami (RODO)
      if (s === 3 && (form.age ?? 18) < 16 && !form.parentalConsent) {
        setErrors({
          parentalConsent:
            "Przed 16 urodzinami do założenia konta potrzebna jest zgoda rodzica lub opiekuna.",
        });
        return false;
      }
      setErrors({});
      return true;
    }
    const next: Errors = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!next[key]) next[key] = issue.message;
    }
    setErrors(next);
    return false;
  }

  function next() {
    if (!validateStep(step)) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Hasło celowo OMIJAMY przy zapisie (tryb demo bez backendu).
      const profile: CandidateProfile = {
        displayName: form.displayName.trim(),
        city: form.city.trim(),
        age: form.age as number,
        skills: form.skills,
        bio: form.bio.trim(),
        days: form.days,
        parts: form.parts,
        email: form.email.trim(),
        parentalConsent: form.parentalConsent,
        createdAt: new Date().toISOString(),
      };
      saveCandidate(profile);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function back() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  if (!loaded) {
    return (
      <div className="animate-pulse" aria-hidden="true">
        <div className="h-8 w-64 rounded bg-line" />
        <div className="mt-4 h-4 w-full rounded bg-line" />
        <div className="mt-2 h-4 w-3/4 rounded bg-line" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="card p-8 text-center" role="status">
        <p className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-moss text-2xl text-cream" aria-hidden="true">
          ✓
        </p>
        <h2 className="mt-5 text-3xl font-black tracking-tight">
          Konto gotowe, {form.displayName.split(" ")[0]}!
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          Twój profil ({form.city}, {form.age} lat, {form.skills.length}{" "}
          {form.skills.length === 1 ? "umiejętność" : "umiejętności"}) jest zapisany
          w tej przeglądarce. Od teraz przy przeglądaniu pokażemy Ci głównie
          oferty dla {form.age}-latków.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {form.skills.map((s) => (
            <span key={s} className="rounded-full border border-moss/25 bg-moss-tint px-3 py-1 text-xs font-medium text-moss-dark">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/?age=${form.age}`} className="btn-primary">
            Pokaż oferty dla mnie
          </Link>
          <button type="button" onClick={() => { setDone(false); setStep(0); }} className="btn-outline">
            Edytuj profil
          </button>
        </div>
        <p className="mx-auto mt-6 max-w-md text-xs text-ink-faint">
          Wersja demo: pełne logowanie (e-mail + hasło) pojawi się razem
          z backendem — hasło nie zostało nigdzie zapisane.
        </p>
      </div>
    );
  }

  const meta = STEPS[step];

  return (
    <div>
      {/* Pasek postępu */}
      <div className="flex gap-2" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span
            key={s.key}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-moss" : "bg-line"}`}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-faint" aria-live="polite">
        Krok {step + 1} z {STEPS.length} · {meta.key}
      </p>

      <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{meta.title}</h2>
      <p className="mt-2 max-w-xl text-ink-soft">{meta.sub}</p>

      <div className="card mt-8 p-6 sm:p-8">
        {step === 0 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="label">Imię i pierwsza litera nazwiska</span>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => set("displayName", e.target.value)}
                  placeholder="np. Julia K."
                  className="input mt-1.5"
                />
                {errors.displayName && <FieldError message={errors.displayName} />}
              </label>
              <div>
                <span className="label">Miasto</span>
                <CityCombobox id="wizard-city" value={form.city} onChange={(v) => set("city", v)} />
                {errors.city && <FieldError message={errors.city} />}
              </div>
            </div>
            <div>
              <span className="label">Ile masz lat?</span>
              <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Wiek">
                {AGES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    role="radio"
                    aria-checked={form.age === a}
                    onClick={() => set("age", a)}
                    className={`rounded-full border px-5 py-2 text-sm transition-all ${
                      form.age === a
                        ? "border-ink bg-ink font-medium text-cream"
                        : "border-line hover:border-ink"
                    }`}
                  >
                    {a} lat
                  </button>
                ))}
              </div>
              {(errors.age) && <FieldError message={errors.age} />}
              <p className="mt-2 text-xs text-ink-faint">
                Pokażemy Ci tylko oferty, które możesz podjąć w tym wieku.
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <span className="label">Zaznacz, co do Ciebie pasuje</span>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {SKILLS.map((s) => {
                  const on = form.skills.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set("skills", toggle(form.skills, s))}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${
                        on
                          ? "border-ink bg-ink font-medium text-cream"
                          : "border-line hover:border-ink"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {errors.skills && <FieldError message={errors.skills} />}
            </div>
            <label className="block">
              <span className="label">Dwa zdania o sobie (opcjonalnie)</span>
              <textarea
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                rows={4}
                maxLength={400}
                placeholder="np. Chodzę do drugiej klasy liceum, pomagam w rodzinnej kawiarni w weekendy."
                className="input mt-1.5 resize-y"
              />
              <span className="mt-1 block text-right text-xs text-ink-faint">{form.bio.length}/400</span>
              {errors.bio && <FieldError message={errors.bio} />}
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="label">Dni</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {DAYS.map((d) => {
                  const on = form.days.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set("days", toggle(form.days, d))}
                      className={`rounded-xl border px-4 py-2 text-sm transition-all ${
                        on
                          ? "border-ink bg-ink font-medium text-cream"
                          : "border-line hover:border-ink"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              {errors.days && <FieldError message={errors.days} />}
            </div>
            <div>
              <span className="label">Pora dnia</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {DAY_PARTS.map((p) => {
                  const on = form.parts.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set("parts", toggle(form.parts, p))}
                      className={`rounded-xl border px-4 py-2 text-sm transition-all ${
                        on
                          ? "border-ink bg-ink font-medium text-cream"
                          : "border-line hover:border-ink"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              {errors.parts && <FieldError message={errors.parts} />}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="label">E-mail</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="ty@example.com"
                  autoComplete="email"
                  className="input mt-1.5"
                />
                {errors.email && <FieldError message={errors.email} />}
              </label>
              <label className="block">
                <span className="label">Hasło</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="min. 8 znaków"
                  autoComplete="new-password"
                  className="input mt-1.5"
                />
                {errors.password && <FieldError message={errors.password} />}
              </label>
            </div>
            <p className="rounded-xl border border-line bg-cream px-4 py-3 text-xs leading-relaxed text-ink-soft">
              Wersja demo: hasło jest tylko sprawdzane w przeglądarce i{" "}
              <strong>nigdzie nie zapisywane</strong>. Prawdziwe konta
              z bezpiecznym logowaniem powstaną razem z backendem.
            </p>
            <label className="flex cursor-pointer gap-3 rounded-xl border border-rust/40 bg-rust/5 p-4">
              <input
                type="checkbox"
                checked={form.parentalConsent}
                onChange={(e) => set("parentalConsent", e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#33502F]"
              />
              <span className="text-sm leading-relaxed text-ink-soft">
                Rodzic lub opiekun wie, że szukam pracy i zgadza się na to.
                Przy umowie i tak będzie potrzebna jego pisemna zgoda.
                {(form.age ?? 18) < 16 && (
                  <strong className="text-ink"> (wymagane przed 16 urodzinami)</strong>
                )}
              </span>
            </label>
            {errors.parentalConsent && <FieldError message={errors.parentalConsent} />}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
          {step === 0 ? (
            <Link href="/profil/start" className="btn-outline">
              Anuluj
            </Link>
          ) : (
            <button type="button" onClick={back} className="btn-outline">
              Wstecz
            </button>
          )}
          <button type="button" onClick={next} className="btn-primary">
            {step === STEPS.length - 1 ? "Załóż konto i gotowe" : "Dalej"}
          </button>
          <span className="ml-auto hidden text-xs text-ink-faint sm:inline">
            Możesz to później zmienić w profilu
          </span>
        </div>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-rust" role="alert">
      {message}
    </p>
  );
}
