import MentorForm from "@/components/MentorForm";

export const metadata = {
  title: "AI Mentor",
  description:
    "AI Mentor dopasuje realne oferty pracy dla młodzieży 14–18 lat do Twoich zainteresowań. Opisz, co lubisz robić, i zobacz propozycje.",
};

export default function MentorPage() {
  return (
    <div className="container-content max-w-2xl py-12">
      <p className="eyebrow">Doradca kariery</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">AI Mentor</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
        Opowiedz w kilku zdaniach, czym się interesujesz albo czego szukasz.
        Mentor odpowie na podstawie realnych ofert z naszej bazy — nie
        wymyśla i nie doradza na oślep.
      </p>

      <div className="mt-10">
        <MentorForm />
      </div>
    </div>
  );
}
