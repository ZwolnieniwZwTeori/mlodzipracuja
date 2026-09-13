/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Podstawowe nagłówki bezpieczeństwa (OWASP Secure Headers baseline).
  // Pełne CSP celowo pominięte — Next.js wstrzykuje skrypty inline
  // i sztywna polityka breakowałaby hydratację; do rozważenia na hostingu
  // (Cloudflare / Netlify _headers) po przetestowaniu z report-only.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
