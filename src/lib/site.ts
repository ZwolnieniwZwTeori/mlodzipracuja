// Centralny adres serwisu — używany przez sitemap.xml, robots.txt,
// canonical i Open Graph. Ustaw w hostingu (np. Netlify/Vercel):
// NEXT_PUBLIC_SITE_URL=https://pracamlodych.pl
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://pracamlodych.pl";

export const SITE_NAME = "pracamlodych.pl";
