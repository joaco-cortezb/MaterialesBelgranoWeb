-- Endurecimiento del INSERT anónimo de clics a WhatsApp (revisión 11/11/2026).
--
-- La anon key es pública (viaja en el bundle del login del panel), así que
-- cualquiera puede insertar en "WhatsappClick" directo por /rest/v1 sin pasar
-- por /go/whatsapp. Antes podía elegir "createdAt" (meter clics en cualquier
-- fecha del contador de 30 días) y mandar un "id" de cualquier tamaño.

-- Sólo las columnas que manda la web: "createdAt" queda siempre en su default.
REVOKE INSERT ON TABLE "WhatsappClick" FROM anon;
GRANT INSERT ("id", "source", "numberId", "referrer", "visitorHash") ON TABLE "WhatsappClick" TO anon;

-- Mismo formato que generan `crypto.randomUUID()`, `isWhatsappSource()` y el
-- hash de 32 hex de la ruta.
DROP POLICY IF EXISTS "Public insert whatsapp clicks" ON "WhatsappClick";
CREATE POLICY "Public insert whatsapp clicks" ON "WhatsappClick"
  FOR INSERT TO anon
  WITH CHECK (
    length("id") <= 64
    AND "source" ~ '^[a-z0-9_-]{1,90}$'
    AND ("referrer" IS NULL OR length("referrer") <= 500)
    AND "visitorHash" ~ '^[0-9a-f]{32}$'
  );
