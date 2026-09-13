import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/", label: "Oferty" },
  { href: "/mentor", label: "AI Mentor" },
  { href: "/o-projekcie", label: "O projekcie" },
  { href: "/#pracodawca", label: "Dla pracodawcy" },
  { href: "/profil/start", label: "Załóż profil" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="pracamlodych.pl — strona główna">
          <Image
            src="/logo-mark.png"
            alt=""
            width={315}
            height={195}
            priority
            className="h-9 w-auto"
          />
          <span className="font-display text-lg font-black tracking-tight text-ink max-[400px]:hidden">
            praca<span className="font-normal text-ink-soft">mlodych</span>.pl
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Nawigacja główna">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dodaj-oferte"
            className="rounded-full border border-ink bg-ink px-4 py-2 text-[15px] font-medium text-cream transition-colors hover:border-moss-dark hover:bg-moss-dark"
          >
            Dodaj ofertę
          </Link>
        </div>
      </div>

      <nav
        className="no-scrollbar flex items-center gap-6 overflow-x-auto border-t border-line px-5 py-2.5 lg:hidden"
        aria-label="Nawigacja mobilna"
      >
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-sm text-ink-soft transition-colors hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
