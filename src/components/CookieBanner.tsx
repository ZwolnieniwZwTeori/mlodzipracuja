"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "pracamlodych-cookie-consent";

// Uczciwy baner: serwis nie używa ciasteczek śledzących ani analityki
// reklamowej. Zapisujemy wyłącznie sam wybór użytkownika (localStorage,
// nie cookie), żeby nie pytać przy każdej wizycie.
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function choose(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Tryb prywatny / zablokowany storage — baner po prostu zniknie
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Zgoda na pliki cookie"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper shadow-[0_-8px_30px_-12px_rgba(22,19,14,0.35)]"
    >
      <div className="container-content flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
          Używamy tylko niezbędnych technicznie danych (np. zapamiętanie tego
          wyboru). Nie śledzimy Cię ani nie sprzedajemy danych. Szczegóły:{" "}
          <Link href="/prywatnosc" className="font-medium text-moss-dark underline underline-offset-4 hover:text-ink">
            Polityka prywatności
          </Link>
          .
        </p>
        <div className="grid shrink-0 grid-cols-2 gap-2.5 sm:flex">
          <button type="button" onClick={() => choose("rejected")} className="btn-outline whitespace-nowrap">
            Tylko niezbędne
          </button>
          <button type="button" onClick={() => choose("accepted")} className="btn-primary">
            Rozumiem
          </button>
        </div>
      </div>
    </div>
  );
}
