"use client";

import { useState, type FormEvent } from "react";
import { askMentor, getOfferById } from "@/lib/api";
import type { MentorResponse, Offer } from "@/lib/types";
import { categoryName } from "@/data/categories";
import { Badge } from "@/components/Badge";
import OfferCard from "@/components/OfferCard";

type Status = "idle" | "loading" | "done" | "error";

const EXAMPLES = [
  "Lubię opiekować się dziećmi i szukam czegoś na weekendy",
  "Szukam czegoś na weekendy, blisko domu",
  "Nie wiem co robić, ale chcę zarobić pierwsze pieniądze",
];

export default function MentorForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [response, setResponse] = useState<MentorResponse | null>(null);
  const [matches, setMatches] = useState<Offer[]>([]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("loading");
    try {
      const result = await askMentor({ message });
      setResponse(result);
      const offers = await Promise.all(result.matching_offer_ids.map((id) => getOfferById(id)));
      setMatches(offers.filter((o): o is Offer => o !== null));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="card p-5 sm:p-6">
        <label htmlFor="mentor-message" className="label">
          Co lubisz robić? Czego szukasz?
        </label>
        <textarea
          id="mentor-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          maxLength={600}
          placeholder="Opisz swoimi słowami, czym się interesujesz albo jakiej pracy szukasz..."
          className="input mt-2"
        />
        <p className="mt-1.5 text-right text-xs text-ink-faint">{message.length}/600</p>

        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-ink-faint">
          Nie wiesz, co napisać? Zacznij od przykładu:
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setMessage(example)}
              className="rounded-full border border-line bg-cream px-3.5 py-1.5 text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              {example}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={status === "loading" || !message.trim()}
          className="btn-primary mt-5"
        >
          {status === "loading" ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream" aria-hidden="true" />
              Szukam pomysłów…
            </span>
          ) : (
            "Zapytaj AI Mentora"
          )}
        </button>
      </form>

      {status === "loading" && (
        <div className="mt-8 animate-pulse" aria-hidden="true">
          <div className="rounded border border-line bg-paper p-6">
            <div className="h-4 w-40 rounded bg-line" />
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-24 rounded-full bg-line" />
              <div className="h-6 w-24 rounded-full bg-line" />
            </div>
            <div className="mt-4 h-4 w-full rounded bg-line" />
            <div className="mt-2 h-4 w-3/4 rounded bg-line" />
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="mt-6 rounded border border-rust/30 bg-rust/5 px-4 py-3 text-sm text-rust" role="alert">
          AI Mentor nie odpowiedział. Spróbuj ponownie za chwilę.
        </p>
      )}

      {status === "done" && response && (
        <div className="mt-8 space-y-8">
          <div className="rounded border border-moss/25 bg-moss-tint/60 p-6">
            <p className="text-sm font-medium text-moss-dark">Pasujące kategorie</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {response.recommended_categories.map((c) => (
                <Badge key={c} tone="moss">
                  {categoryName(c)}
                </Badge>
              ))}
            </div>
            <p className="mt-4 leading-relaxed text-ink-soft">{response.reasoning}</p>
            <p className="mt-4 border-t border-moss/20 pt-4 text-sm font-medium text-moss-dark">
              Następny krok: {response.next_step}
            </p>
          </div>

          {matches.length > 0 && (
            <div>
              <p className="text-sm font-medium text-ink-soft">
                Dopasowane oferty ({matches.length})
              </p>
              <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
