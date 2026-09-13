// Renderuje dane strukturalne Schema.org jako <script type="application/ld+json">.
// Treść jest statyczna i pochodzi wyłącznie z naszych danych — nigdy
// z inputu użytkownika (ochrona przed wstrzyknięciem do JSON-LD).
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
