import type { Metadata } from "next";
import CandidateWizard from "@/components/CandidateWizard";

export const metadata: Metadata = {
  title: "Profil kandydata",
  description:
    "Załóż profil kandydata w 4 krokach: o Tobie, umiejętności, dyspozycyjność i konto. Bez CV, bez opłat.",
};

export default function CandidatePage() {
  return (
    <div className="container-content max-w-2xl py-12">
      <CandidateWizard />
    </div>
  );
}
