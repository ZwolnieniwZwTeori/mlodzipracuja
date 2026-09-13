import type { Metadata, Viewport } from "next";

// Fonty samohostowane przez @fontsource (zamiast next/font/google), żeby
// build nie wymagał połączenia z fonts.googleapis.com — ważne w środowiskach
// CI/sandboxach z ograniczonym dostępem do sieci.
import "@fontsource/archivo/700.css";
import "@fontsource/archivo/800.css";
import "@fontsource/archivo/900.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import StickyMobileCta from "@/components/StickyMobileCta";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "Bezpieczne, dopasowane wiekowo zlecenia i prace dorywcze dla nastolatków 14–18 lat — gastronomia, handel, opieka, korepetycje, prace zdalne i 14 innych kategorii.";

export const viewport: Viewport = {
  themeColor: "#F7F1E3",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — pierwsza praca dla 14–18 lat`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — pierwsza praca dla 14–18 lat`,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "pracamlodych.pl — pierwsza praca dla 14–18 lat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — pierwsza praca dla 14–18 lat`,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark.png`,
  description: DESCRIPTION,
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Dolny Śląsk",
  },
  audience: {
    "@type": "PeopleAudience",
    suggestedMinAge: 14,
    suggestedMaxAge: 18,
  },
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "pl",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: rozszerzenia przeglądarki (menedżery haseł,
    // tłumacze, Fill Proxy) potrafią wstrzyknąć własne atrybuty do <html>/<body>
    // zanim React się podepnie — to nie błąd aplikacji, więc wyciszamy ostrzeżenie.
    <html lang="pl" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <JsonLd data={ORGANIZATION_SCHEMA} />
        <JsonLd data={WEBSITE_SCHEMA} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyMobileCta />
        <CookieBanner />
      </body>
    </html>
  );
}
