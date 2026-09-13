"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CitySuggestion } from "@/components/CityCombobox";

const PAGE = 60;

interface Props {
  // Pierwsza porcja renderowana po stronie serwera (SEO) —
  // reszta i wyszukiwanie dociągane z GET /api/cities.
  initial: CitySuggestion[];
  total: number;
}

// Przeszukiwany katalog miast: wpisujesz frazę albo przewijasz listę.
// Porcjowanie ("Pokaż więcej") + debounce + cache, jak w CityCombobox.
export default function CityDirectory({ initial, total }: Props) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CitySuggestion[]>(initial);
  const [shown, setShown] = useState(PAGE);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searching = query.trim().length > 0;

  useEffect(() => {
    if (!searching) {
      setItems(initial);
      setMatchCount(null);
      setShown(PAGE);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(
          `/api/cities?q=${encodeURIComponent(query)}&limit=200`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("cities fetch failed");
        const json = (await res.json()) as { results: CitySuggestion[] };
        setItems(json.results);
        setMatchCount(json.results.length);
      } catch {
        // Abort / błąd sieci — zostawiamy poprzedni stan
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [query, searching, initial]);

  const visible = searching ? items : items.slice(0, shown);
  const rest = searching ? 0 : total - shown;

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Wpisz miasto, np. Kra…"
        aria-label="Szukaj miasta na liście"
        autoComplete="off"
        className="input"
      />
      <p className="mt-2 text-xs text-ink-faint" aria-live="polite">
        {searching
          ? `Znaleziono: ${matchCount ?? "…"}`
          : `Wyświetlono ${visible.length} ze ${total}`}
      </p>
      <ul className="mt-2 h-96 space-y-2 overflow-y-auto overscroll-contain border-t border-line pt-3">
        {loading && visible.length === 0 && (
          <li className="text-sm text-ink-faint" aria-hidden="true">Szukam…</li>
        )}
        {visible.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/lokalizacja/${c.slug}`}
              className="text-sm text-ink-soft transition-colors hover:text-ink hover:underline hover:underline-offset-4"
            >
              Praca dla młodzieży — {c.name}
            </Link>
          </li>
        ))}
        {!loading && visible.length === 0 && (
          <li className="text-sm text-ink-faint">
            Brak miasta na liście — mniejsze miejscowości znajdziesz przez wyszukiwarkę ofert.
          </li>
        )}
      </ul>
      {rest > 0 && (
        <button
          type="button"
          onClick={() => setShown((s) => s + 120)}
          className="btn-outline mt-3 w-full"
        >
          Pokaż więcej (pozostało {rest})
        </button>
      )}
    </div>
  );
}
