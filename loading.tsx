// Globalny szkielet ładowania — Next.js pokazuje go automatycznie podczas
// nawigacji między podstronami, zanim dotrą dane (zamiast pustego ekranu).
export default function Loading() {
  return (
    <div className="container-content py-12" aria-hidden="true">
      <div className="h-8 w-56 animate-pulse rounded bg-line" />
      <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-line" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded border border-line bg-paper p-5">
            <div className="h-5 w-28 animate-pulse rounded-full bg-line" />
            <div className="mt-4 h-6 w-full animate-pulse rounded bg-line" />
            <div className="mt-2 h-6 w-2/3 animate-pulse rounded bg-line" />
            <div className="mt-6 h-4 w-1/2 animate-pulse rounded bg-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
