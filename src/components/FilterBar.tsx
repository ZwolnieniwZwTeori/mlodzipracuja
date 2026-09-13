"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CATEGORIES } from "@/data/categories";
import CityCombobox from "@/components/CityCombobox";

const AGE_OPTIONS = [
  { value: "", label: "Każdy wiek" },
  { value: "14", label: "Mam 14 lat" },
  { value: "15", label: "Mam 15 lat" },
  { value: "16", label: "Mam 16+ lat" },
];
export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [age, setAge] = useState(searchParams.get("age") ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    pushWith({ q, location, category, age });
  }

  function pushWith(state: { q: string; location: string; category: string; age: string }) {
    const params = new URLSearchParams();
    if (state.q.trim()) params.set("q", state.q.trim());
    if (state.location.trim()) params.set("location", state.location.trim());
    if (state.category) params.set("category", state.category);
    if (state.age) params.set("age", state.age);
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  // Segment dotykowy jak w serwisie referencyjnym: tapnięcie od razu
  // filtruje (bez osobnego klikania "Szukaj").
  function applyAge(next: string) {
    setAge(next);
    pushWith({ q, location, category, age: next });
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Szukaj ofert"
      className="card space-y-4 p-4 sm:p-5"
    >
      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <label htmlFor="filter-q" className="label">
            Czego szukasz?
          </label>
          <input
            id="filter-q"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="np. kelner, ulotki, korepetycje"
            autoComplete="off"
            className="input mt-1.5"
          />
        </div>
        <div>
          <label htmlFor="filter-location" className="label">
            Miasto
          </label>
          <CityCombobox
            id="filter-location"
            value={location}
            onChange={setLocation}
            placeholder="np. Kraków"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label htmlFor="filter-category" className="label">
            Kategoria
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input mt-1.5"
          >
            <option value="">Wszystkie kategorie</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary sm:w-auto">
          Szukaj ofert
        </button>
      </div>
      <div>
        <span className="label" id="filter-age-label">
          Twój wiek
        </span>
        <div className="mt-1.5 flex flex-wrap gap-2" role="group" aria-labelledby="filter-age-label">
          {AGE_OPTIONS.map((o) => {
            const active = age === o.value;
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={active}
                onClick={() => applyAge(o.value)}
                className={`min-h-[44px] rounded-full border px-4 text-sm transition-all ${
                  active
                    ? "border-ink bg-ink font-medium text-cream"
                    : "border-line bg-transparent hover:border-ink"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>
    </form>
  );
}
