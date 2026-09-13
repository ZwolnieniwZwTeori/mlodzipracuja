import Link from "next/link";
import { companyInitials } from "@/lib/format";

export interface CompanyEntry {
  name: string;
  count: number;
}

function plural(count: number): string {
  if (count === 1) return "1 oferta";
  if (count >= 2 && count <= 4) return `${count} oferty`;
  return `${count} ofert`;
}

// Siatka polecanych firm — wyłącznie firmy z realnych ofert w bazie
// (pogrupowane po polu company), każda karta linkuje do filtrowanej listy.
export default function CompanyGrid({ companies }: { companies: CompanyEntry[] }) {
  if (companies.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {companies.map((c) => (
        <Link
          key={c.name}
          href={`/?company=${encodeURIComponent(c.name)}`}
          className="card card-hover flex flex-col items-center px-4 py-6 text-center"
        >
          <span
            className="flex h-16 w-16 items-center justify-center border-2 border-ink bg-cream font-display text-xl font-black tracking-tight text-ink"
            aria-hidden="true"
          >
            {companyInitials(c.name)}
          </span>
          <span className="mt-3 text-[15px] font-bold leading-snug text-ink">
            {c.name}
          </span>
          <span className="mt-1 text-xs text-ink-faint">{plural(c.count)}</span>
        </Link>
      ))}
    </div>
  );
}
