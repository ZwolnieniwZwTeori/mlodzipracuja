import type { Metadata } from "next";
import EmployerPanel from "@/components/EmployerPanel";

export const metadata: Metadata = {
  title: "Panel pracodawcy",
  description:
    "Panel pracodawcy: Twoje ogłoszenia, zgłoszenia kandydatów i zaproszenia na rozmowy w jednym miejscu.",
};

export default function EmployerPage() {
  return (
    <div className="container-content max-w-4xl py-12">
      <EmployerPanel />
    </div>
  );
}
