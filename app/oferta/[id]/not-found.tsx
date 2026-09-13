import Link from "next/link";

export default function OfferNotFound() {
  return (
    <div className="container-content max-w-xl py-24 text-center">
      <h1 className="text-3xl font-black">Nie znaleziono tej oferty</h1>
      <p className="mt-3 text-ink-soft">
        Mogła zostać usunięta albo jej moderacja jeszcze się nie zakończyła.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-moss hover:border-moss"
      >
        Wróć do wszystkich ofert
      </Link>
    </div>
  );
}
