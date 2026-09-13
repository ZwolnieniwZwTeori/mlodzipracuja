"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { offerFormSchema, type OfferFormValues } from "@/lib/offer-schema";
import { createOffer } from "@/lib/api";
import { CATEGORIES } from "@/data/categories";

type Status = "idle" | "submitting" | "success" | "error";

export default function OfferForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: { min_age: 15, max_age: 18 },
  });

  const description = watch("description") ?? "";

  async function onSubmit(values: OfferFormValues) {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const result = await createOffer({ ...values, category: values.category });
      if (result.ok) {
        // Dedykowana strona podziękowania (lepszy UX + mierzalny cel).
        // Boty złapane honeypotem też tam trafiają — nie zdradzamy odrzucenia.
        router.push("/dziekujemy");
      } else {
        setStatus("error");
        setErrorMessage(result.error ?? "Coś poszło nie tak. Spróbuj ponownie.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Nie udało się połączyć z serwerem. Spróbuj ponownie za chwilę.");
    }
  }

  if (status === "success") {
    // Stan zapasowy, gdyby nawigacja była zablokowana — główna ścieżka
    // prowadzi przez /dziekujemy (patrz onSubmit).
    return (
      <div className="rounded border border-moss/25 bg-moss-tint/60 p-8 text-center" role="status">
        <p className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-moss text-xl text-cream" aria-hidden="true">
          ✓
        </p>
        <h2 className="mt-4 text-2xl font-extrabold">Oferta wysłana do moderacji</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          Dziękujemy! Sprawdzimy Twoje zgłoszenie ręcznie — zwykle do 24 godzin —
          i opublikujemy je, jeśli jest zgodne z zasadami bezpieczeństwa dla osób 14–18 lat.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-outline mt-6"
        >
          Dodaj kolejną ofertę
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <fieldset className="space-y-5">
        <legend className="text-base font-bold">
          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs text-cream">1</span>
          Podstawowe informacje
        </legend>
        <Field label="Tytuł oferty" required error={errors.title?.message}>
          <input
            {...register("title")}
            type="text"
            placeholder="np. Pomoc w sklepie w weekendy"
            className="input"
          />
        </Field>

        <Field
          label="Firma / organizator"
          hint="Opcjonalnie — pokażemy ją na karcie oferty wraz ze stawką."
          error={errors.company?.message}
        >
          <input
            {...register("company")}
            type="text"
            placeholder="np. Sklep U Asi"
            className="input"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Kategoria" required error={errors.category?.message}>
            <select {...register("category")} defaultValue="" className="input">
              <option value="" disabled>
                Wybierz kategorię
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Miasto / okolica" required error={errors.location?.message}>
            <input
              {...register("location")}
              type="text"
              placeholder="np. Brzeg Dolny"
              className="input"
            />
          </Field>
        </div>

        <Field
          label="Opis oferty"
          required
          hint={`${description.length}/1200 znaków — napisz, na czym polega praca, jakie są godziny i czego oczekujesz.`}
          error={errors.description?.message}
        >
          <textarea
            {...register("description")}
            rows={5}
            maxLength={1200}
            placeholder="Na czym polega praca, jakie są godziny, czego oczekujesz od osoby, która się zgłosi..."
            className="input resize-y"
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-5 border-t border-line pt-8">
        <legend className="text-base font-bold">
          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs text-cream">2</span>
          Dla kogo jest ta oferta
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Minimalny wiek" required error={errors.min_age?.message}>
            <input {...register("min_age")} type="number" min={14} max={18} className="input" />
          </Field>
          <Field label="Maksymalny wiek" required error={errors.max_age?.message}>
            <input {...register("max_age")} type="number" min={14} max={18} className="input" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Stawka" hint="Opcjonalnie, np. 25 zł/h." error={errors.salary?.message}>
            <input {...register("salary")} type="text" placeholder="np. 25 zł/h" className="input" />
          </Field>
          <Field label="Wymiar godzin" hint="Opcjonalnie, np. 8 h/tydz." error={errors.hours?.message}>
            <input {...register("hours")} type="text" placeholder="np. 8 h/tydz." className="input" />
          </Field>
        </div>
        <p className="rounded border border-line bg-cream px-4 py-3 text-xs leading-relaxed text-ink-soft">
          Platforma jest przeznaczona dla osób w wieku 14–18 lat. Oferty wymagające
          pełnoletności nie przejdą moderacji.
        </p>
      </fieldset>

      <fieldset className="space-y-5 border-t border-line pt-8">
        <legend className="text-base font-bold">
          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs text-cream">3</span>
          Kontakt
        </legend>
        <Field
          label="Kontakt"
          required
          hint="E-mail lub telefon — pokażemy go dopiero po zatwierdzeniu oferty."
          error={errors.contact?.message}
        >
          <input
            {...register("contact")}
            type="text"
            placeholder="np. kontakt@twojafirma.pl"
            autoComplete="email"
            className="input"
          />
        </Field>
      </fieldset>

      {/* Honeypot — pole ukryte dla ludzi, widoczne dla botów wypełniających każdy input. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Zostaw to pole puste
          <input {...register("website")} type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p className="rounded border border-rust/30 bg-rust/5 px-4 py-3 text-sm text-rust" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full sm:w-auto"
      >
        {status === "submitting" ? "Wysyłanie…" : "Wyślij do moderacji"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="ml-1 text-rust" aria-hidden="true">*</span>
        )}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-rust" role="alert">{error}</p>
      )}
    </label>
  );
}
