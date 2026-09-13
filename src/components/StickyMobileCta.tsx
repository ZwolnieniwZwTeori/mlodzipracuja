import Link from "next/link";

// Przyklejone mobilne CTA — tylko na małych ekranach (md:hidden).
// Dwa jednoznaczne działania: przeglądanie ofert i dodanie oferty.
// Element <div> na końcu rezerwuje miejsce, żeby pasek nie zasłaniał stopki.
export default function StickyMobileCta() {
  return (
    <>
      <div className="h-16 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2.5 px-4 py-2.5">
          <Link
            href="/#oferty"
            className="inline-flex items-center justify-center rounded-full border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink"
          >
            Szukaj ofert
          </Link>
          <Link
            href="/dodaj-oferte"
            className="inline-flex items-center justify-center rounded-full border border-ink bg-ink px-4 py-2.5 text-sm font-medium text-cream"
          >
            Dodaj ofertę
          </Link>
        </div>
      </div>
    </>
  );
}
