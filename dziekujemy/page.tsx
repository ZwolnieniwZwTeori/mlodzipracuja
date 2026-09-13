import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dziękujemy za zgłoszenie",
  description: "Twoja oferta została wysłana do moderacji.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="container-content max-w-xl py-20 text-center">
      <p className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-moss text-2xl text-cream" aria-hidden="true">
        ✓
      </p>
      <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
        Dziękujemy za zgłoszenie!
      </h1>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">
        Twoja oferta trafiła do moderacji. Sprawdzimy ją ręcznie — zwykle
        w ciągu 24 godzin — i opublikujemy, jeśli jest zgodna z zasadami
        bezpieczeństwa dla osób 14–18 lat.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Przeglądaj oferty
        </Link>
        <Link href="/dodaj-oferte" className="btn-outline">
          Dodaj kolejną ofertę
        </Link>
      </div>
    </div>
  );
}
