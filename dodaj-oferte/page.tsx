import OfferForm from "@/components/OfferForm";

export const metadata = {
  title: "Dodaj ofertę",
  description:
    "Dodaj za darmo ofertę pracy dla nastolatków 14–18 lat. Każde zgłoszenie przechodzi ręczną moderację przed publikacją.",
};

export default function AddOfferPage() {
  return (
    <div className="container-content max-w-2xl py-12">
      <p className="eyebrow">Dla organizatorów i pracodawców</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Dodaj ofertę</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
        Opisz zlecenie, które nadaje się dla osoby 14–18 lat. Każde zgłoszenie
        trafia najpierw do moderacji — sprawdzamy je pod kątem bezpieczeństwa,
        zanim pojawi się publicznie na stronie.
      </p>

      <div className="card mt-10 p-6 sm:p-8">
        <OfferForm />
      </div>

      <p className="mt-6 text-sm text-ink-faint">
        Wysyłając formularz, potwierdzasz, że oferta jest zgodna z przepisami
        o pracy młodocianych i nie wymaga pełnoletności.
      </p>
    </div>
  );
}
