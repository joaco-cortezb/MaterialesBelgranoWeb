-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "Audience" AS ENUM ('GENERAL', 'EMPRESAS');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "catalogUrl" TEXT NOT NULL,
    "rubroSlug" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageSlot" (
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "position" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageSlot_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "WhatsappNumber" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "audience" "Audience" NOT NULL DEFAULT 'GENERAL',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsappNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "WhatsappClick" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "numberId" TEXT,
    "referrer" TEXT,
    "visitorHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsappClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE INDEX "Brand_active_order_idx" ON "Brand"("active", "order");

-- CreateIndex
CREATE INDEX "WhatsappNumber_active_order_idx" ON "WhatsappNumber"("active", "order");

-- CreateIndex
CREATE INDEX "WhatsappClick_source_createdAt_idx" ON "WhatsappClick"("source", "createdAt");

-- CreateIndex
CREATE INDEX "WhatsappClick_createdAt_idx" ON "WhatsappClick"("createdAt");

-- AddForeignKey
ALTER TABLE "WhatsappClick" ADD CONSTRAINT "WhatsappClick_numberId_fkey" FOREIGN KEY ("numberId") REFERENCES "WhatsappNumber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────
-- Seguridad: RLS + grants. La web pública (anon) sólo lee lo activo.
-- El panel escribe con Prisma (rol postgres) y los clics se insertan con
-- la service role desde la web, así que `anon` no tiene ningún INSERT.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Brand" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ImageSlot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WhatsappNumber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Setting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WhatsappClick" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE "Brand", "ImageSlot", "WhatsappNumber", "Setting" TO anon;

CREATE POLICY "Public read active brands" ON "Brand"
  FOR SELECT TO anon USING ("active" = true);

CREATE POLICY "Public read image slots" ON "ImageSlot"
  FOR SELECT TO anon USING (true);

CREATE POLICY "Public read active whatsapp numbers" ON "WhatsappNumber"
  FOR SELECT TO anon USING ("active" = true);

-- Misma lista que PUBLIC_SETTING_KEYS en packages/shared/src/config/cms.ts.
CREATE POLICY "Public read allowed settings" ON "Setting"
  FOR SELECT TO anon USING ("key" IN ('home.videoUrl', 'about.headline', 'about.body'));

-- ─────────────────────────────────────────────────────────────
-- Storage: bucket público para logos y fotos (sólo imágenes).
-- ─────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', true, 20971520, ARRAY['image/avif', 'image/jpeg', 'image/png', 'image/webp']::text[])
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read media bucket" ON storage.objects;
CREATE POLICY "Public read media bucket" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
