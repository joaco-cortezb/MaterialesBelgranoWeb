import { jsonLdScript } from "@/lib/structured-data";

/**
 * Server Component a propósito: el schema tiene que estar en el HTML servido,
 * porque los crawlers de IA no ejecutan JavaScript.
 */
export function JsonLd({ schema }: { schema: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }} />;
}
