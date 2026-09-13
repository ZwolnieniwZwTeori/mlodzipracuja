import { z } from "zod";

export const offerFormSchema = z
  .object({
    title: z
      .string()
      .min(6, "Tytuł powinien mieć przynajmniej 6 znaków")
      .max(90, "Tytuł jest za długi (maks. 90 znaków)"),
    category: z.enum(
      ["gastronomia", "handel", "ulotki", "magazyn", "korepetycje", "opieka", "sezonowe", "zdalne", "ogrod", "sprzatanie", "zwierzeta", "seniorzy", "fotografia", "eventy", "promocje", "warsztaty", "social-media", "grafika", "wideo"],
      { errorMap: () => ({ message: "Wybierz kategorię" }) }
    ),
    location: z.string().min(2, "Podaj miasto lub okolicę"),
    company: z
      .string()
      .max(60, "Nazwa firmy jest za długa (maks. 60 znaków)")
      .optional()
      .or(z.literal("")),
    salary: z
      .string()
      .max(30, "Stawka jest za długa (maks. 30 znaków)")
      .optional()
      .or(z.literal("")),
    hours: z
      .string()
      .max(30, "Wymiar godzin jest za długi (maks. 30 znaków)")
      .optional()
      .or(z.literal("")),
    description: z
      .string()
      .min(30, "Opisz ofertę trochę dokładniej (min. 30 znaków)")
      .max(1200, "Opis jest za długi (maks. 1200 znaków)"),
    min_age: z.coerce
      .number()
      .int()
      .min(14, "Najmłodszy wiek to 14 lat")
      .max(18, "Ta platforma jest dla osób 14–18 lat"),
    max_age: z.coerce
      .number()
      .int()
      .min(14, "Najmłodszy wiek to 14 lat")
      .max(18, "Ta platforma jest dla osób 14–18 lat"),
    contact: z
      .string()
      .min(5, "Podaj e-mail lub numer telefonu, żeby zainteresowani mogli się odezwać"),
    website: z.string().max(0, "").optional().or(z.literal("")),
  })
  .refine((data) => data.min_age <= data.max_age, {
    message: "Minimalny wiek nie może być większy niż maksymalny",
    path: ["max_age"],
  });

export type OfferFormValues = z.infer<typeof offerFormSchema>;
