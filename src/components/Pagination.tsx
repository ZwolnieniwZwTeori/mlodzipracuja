"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  limit,
  total,
}: {
  page: number;
  limit: number;
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (totalPages <= 1) return null;

  function goTo(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="btn-outline px-3 py-2 text-[13px] disabled:cursor-not-allowed disabled:opacity-30 sm:px-4 sm:text-sm"
      >
        ← Poprzednie
      </button>
      <span className="order-first w-full text-center text-xs text-ink-faint sm:order-none sm:w-auto sm:text-sm" aria-live="polite">
        Strona {page} z {totalPages}
      </span>
      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="btn-outline px-3 py-2 text-[13px] disabled:cursor-not-allowed disabled:opacity-30 sm:px-4 sm:text-sm"
      >
        Następne →
      </button>
    </div>
  );
}
