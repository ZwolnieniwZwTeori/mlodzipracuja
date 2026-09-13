import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="container-content max-w-xl py-24 text-center">
      <p className="font-display text-7xl font-black text-moss/25" aria-hidden="true">404</p>
      <h1 className="mt-4 text-3xl font-black tracking-tight">Nie znaleziono tej strony</h1>
      <p className="mx-auto mt-3 max-w-sm text-ink-soft">
        Adres mógł się zmienić albo oferta wygasła. Sprawdź inne kategorie —
        nowe zlecenia pojawiają się regularnie.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Strona główna
        </Link>
        <Link href="/mentor" className="btn-outline">
          Zapytaj AI Mentora
        </Link>
      </div>
    </div>
  );
}
