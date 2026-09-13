import { z } from "zod";

export const SKILLS = [
  "Obsługa klienta",
  "Praca w zespole",
  "Kasa fiskalna",
  "Angielski",
  "Matematyka",
  "Media społecznościowe",
  "Opieka nad dziećmi",
  "Zwierzęta",
  "Grafika i zdjęcia",
  "Prawo jazdy AM",
] as const;

export const DAYS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"] as const;

export const DAY_PARTS = ["Rano", "Popołudniami", "Wieczorami"] as const;

// Krok 1 — O Tobie (te dane zobaczy pracodawca przy zgłoszeniu)
export const profileStep1Schema = z.object({
  displayName: z
    .string()
    .min(3, "Podaj imię i pierwszą literę nazwiska (np. Julia K.)")
    .max(40, "Za długie (maks. 40 znaków)"),
  city: z.string().min(2, "Podaj miasto"),
  age: z.coerce.number().int().min(14).max(18),
});

// Krok 2 — Umiejętności (zastępują CV)
export const profileStep2Schema = z.object({
  skills: z.array(z.string()).min(1, "Zaznacz przynajmniej jedną umiejętność"),
  bio: z.string().max(400, "Maks. 400 znaków").optional().or(z.literal("")),
});

// Krok 3 — Dyspozycyjność
export const profileStep3Schema = z.object({
  days: z.array(z.string()).min(1, "Zaznacz przynajmniej jeden dzień"),
  parts: z.array(z.string()).min(1, "Zaznacz przynajmniej jedną porę dnia"),
});

// Krok 4 — Konto. UWAGA: w trybie demo (bez backendu) hasło jest WYŁĄCZNIE
// walidowane w przeglądarce i NIGDZIE nie zapisywane — do localStorage
// trafia tylko publiczny profil (imię, miasto, wiek, umiejętności).
// Prawdziwe konta z hashowaniem haseł powstaną razem z backendem.
export const profileStep4Schema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail"),
  password: z.string().min(8, "Hasło musi mieć min. 8 znaków"),
  parentalConsent: z.boolean(),
});

export const candidateProfileSchema = profileStep1Schema
  .merge(profileStep2Schema)
  .merge(profileStep3Schema)
  .merge(profileStep4Schema.omit({ password: true }))
  .extend({ createdAt: z.string() });

export type CandidateProfile = z.infer<typeof candidateProfileSchema>;

// Pracodawca — w trybie demo to "wizytówka" do panelu podglądowego.
export const employerSchema = z.object({
  company: z.string().min(2, "Podaj nazwę firmy lub organizacji").max(80),
  city: z.string().min(2, "Podaj miasto"),
  email: z.string().email("Podaj poprawny adres e-mail"),
});

export type EmployerProfile = z.infer<typeof employerSchema>;
