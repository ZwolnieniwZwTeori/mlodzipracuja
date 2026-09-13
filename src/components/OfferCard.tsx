import Link from "next/link";
import type { Offer } from "@/lib/types";
import { categoryName } from "@/data/categories";
import {
  ageLabel,
  companyInitials,
  relativeDate,
  sourceLabel,
  sourceShort,
} from "@/lib/format";

export default function OfferCard({ offer }: { offer: Offer }) {
  const isRemote = offer.category === "zdalne";

  return (
    <Link
      href={`/oferta/${offer.id}`}
      className="card card-hover group flex flex-col p-5"
      aria-label={`${offer.title} — ${offer.company ?? sourceLabel(offer.source)}, ${offer.location}`}
    >
      <div className="flex gap-4">
        <span
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-paper font-display text-lg font-black tracking-tight text-ink"
          aria-hidden="true"
        >
          {companyInitials(offer.company)}
        </span>
        <div className="min-w-0">
          <h3 className="text-[17px] font-bold leading-snug text-ink">
            {offer.title}
          </h3>
          <p className="mt-1 truncate text-sm text-ink-soft">
            {offer.company ? `${offer.company} · ` : ""}
            {offer.location}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-gold-tint px-2.5 py-1 text-xs font-medium text-[#5C4212]">
          {ageLabel(offer.min_age, offer.max_age)}
        </span>
        {offer.hours && (
          <span className="rounded-full border border-line bg-cream px-2.5 py-1 text-xs text-ink-soft">
            {offer.hours}
          </span>
        )}
        {isRemote ? (
          <span className="rounded-full border border-rust/50 px-2.5 py-1 text-xs font-medium text-rust">
            Zdalne
          </span>
        ) : (
          <span className="rounded-full border border-moss/25 bg-moss-tint px-2.5 py-1 text-xs font-medium text-moss-dark">
            {categoryName(offer.category)}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
        <div>
          <p className="font-display text-[22px] font-black leading-none text-ink">
            {offer.salary ?? "Stawka do uzgodnienia"}
          </p>
          <p className="mt-1.5 text-xs text-ink-faint">
            {sourceShort(offer.source)} · {relativeDate(offer.created_at)}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-ink px-5 py-2 text-sm font-medium text-ink transition-colors group-hover:bg-ink group-hover:text-cream">
          Zobacz
        </span>
      </div>
    </Link>
  );
}
