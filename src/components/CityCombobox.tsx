"use client";

import { useEffect, useRef, useState } from "react";

export interface CitySuggestion {
  slug: string;
  name: string;
}

// Cache odpowiedzi, żeby nie pytać serwera dwa razy o to samo.
// Żyje tylko w pamięci karty (nie localStorage — dane publiczne,
// ale nie ma sensu ich utrwalać).
const cache = new Map<string, CitySuggestion[]>();

async function fetchCities(query: string, signal: AbortSignal): Promise<CitySuggestion[]> {
  const key = query.trim().toLowerCase();
  const cached = cache.get(key);
  if (cached) return cached;

  const res = await fetch(`/api/cities?q=${encodeURIComponent(query)}&limit=30`, { signal });
  if (!res.ok) throw new Error("cities fetch failed");
  const json = (await res.json()) as { results: CitySuggestion[] };
  cache.set(key, json.results);
  return json.results;
}

// Wyszukiwarka miast z autouzupełnianiem po stronie serwera:
// debounce 150 ms + anulowanie poprzedniego zapytania (AbortController),
// więc szybkie pisanie nie zarzuca serwera. Ogonki nie wymagane.
export default function CityCombobox({
  id,
  value,
  onChange,
  placeholder = "np. Wrocław",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const query = value;

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const data = await fetchCities(query, controller.signal);
        setResults(data);
      } catch {
        // Abort albo błąd sieci — po cichu zostawiamy poprzednie wyniki
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [query, open]);

  const exactMatch = results.some(
    (c) => c.name.toLowerCase() === value.trim().toLowerCase()
  );
  const showCustom = value.trim().length > 0 && !exactMatch;

  function pick(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        value={value}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={`${id}-listbox`}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => setOpen(false), 120);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter" && open && results.length > 0 && !exactMatch) {
            e.preventDefault();
            pick(results[0].name);
          }
        }}
        placeholder={placeholder}
        className="input mt-1.5 pr-9"
      />
      <span
        className={`pointer-events-none absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-xs text-ink-faint transition-transform ${open ? "rotate-180" : ""}`}
        aria-hidden="true"
      >
        ▼
      </span>

      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          aria-label="Podpowiedzi miast"
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-60 overflow-y-auto overscroll-contain rounded-xl border border-line bg-paper shadow-[0_12px_32px_-12px_rgba(22,19,14,0.35)]"
        >
          {loading && results.length === 0 && (
            <li className="px-3.5 py-2.5 text-sm text-ink-faint" aria-hidden="true">
              Szukam…
            </li>
          )}
          {showCustom && (
            <li role="option" aria-selected="false">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(value.trim());
                }}
                className="block w-full px-3.5 py-2.5 text-left text-sm hover:bg-cream"
              >
                Szukaj frazy: <strong>„{value.trim()}”</strong>
              </button>
            </li>
          )}
          {results.map((c) => (
            <li key={c.slug} role="option" aria-selected={c.name === value}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(c.name);
                }}
                className="block w-full px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-cream"
              >
                {c.name}
              </button>
            </li>
          ))}
          {!loading && results.length === 0 && !showCustom && (
            <li className="px-3.5 py-2.5 text-sm text-ink-faint">
              Brak podpowiedzi — wpisz własną frazę.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
