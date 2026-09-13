import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "moss" | "gold";
}) {
  const toneClasses = {
    default: "border-line text-ink-soft",
    moss: "border-moss/30 bg-moss-tint text-moss-dark",
    gold: "border-gold/30 bg-gold-tint text-[#5C4212]",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium leading-none ${toneClasses}`}
    >
      {children}
    </span>
  );
}
