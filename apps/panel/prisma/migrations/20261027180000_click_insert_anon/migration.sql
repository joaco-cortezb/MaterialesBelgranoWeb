-- La web registra los clics a WhatsApp con la anon key (ya no necesita la
-- service role). Sólo puede INSERTAR, con datos acotados; no puede leer.
GRANT INSERT ON TABLE "WhatsappClick" TO anon;

CREATE POLICY "Public insert whatsapp clicks" ON "WhatsappClick"
  FOR INSERT TO anon
  WITH CHECK (
    length("source") <= 90
    AND ("referrer" IS NULL OR length("referrer") <= 500)
    AND ("visitorHash" IS NULL OR length("visitorHash") = 32)
  );

-- El bucket es público (las URLs se sirven sin policy); esta policy sólo
-- permitía LISTAR todos los archivos con la anon key.
DROP POLICY IF EXISTS "Public read media bucket" ON storage.objects;

-- Mismo tope que acepta el panel (4 MB por subida, ya optimizada).
UPDATE storage.buckets SET file_size_limit = 5242880 WHERE id = 'media';

-- Intentos fallidos de login: el límite tiene que ser el mismo en todas las
-- instancias de Vercel (en memoria cada una tenía el suyo). Sólo el panel.
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "LoginAttempt_keyHash_createdAt_idx" ON "LoginAttempt"("keyHash", "createdAt");
ALTER TABLE "LoginAttempt" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "LoginAttempt" FROM anon, authenticated;
