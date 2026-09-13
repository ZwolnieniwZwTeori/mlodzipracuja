import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

export default function CategoryStrip({ active }: { active?: string }) {
  const pill = (isActive: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-all ${
      isActive
        ? "border-ink bg-ink font-medium text-cream"
        : "border-line bg-paper text-ink-soft hover:border-ink hover:text-ink"
    }`;

  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      <Link href="/" className={pill(!active)} aria-current={!active ? "page" : undefined}>
        Wszystkie
      </Link>
      {CATEGORIES.map((c) => {
        const isActive = c.slug === active;
        return (
          <Link
            key={c.slug}
            href={`/kategoria/${c.slug}`}
            className={pill(isActive)}
            aria-current={isActive ? "page" : undefined}
          >
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
