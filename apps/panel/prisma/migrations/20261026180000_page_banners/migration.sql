-- Portadas por página (inicio, marcas, nosotros) y banners del inicio.

ALTER TABLE "HeroSlide" ADD COLUMN "page" TEXT NOT NULL DEFAULT 'inicio';
DROP INDEX IF EXISTS "HeroSlide_active_order_idx";
CREATE INDEX "HeroSlide_page_active_order_idx" ON "HeroSlide"("page", "active", "order");

-- Banner del inicio, identificado por su lugar (`key`). Todo el banner es un
-- link cuando `url` tiene algo.
CREATE TABLE "Banner" (
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("key")
);

ALTER TABLE "Banner" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "Banner" FROM anon, authenticated;
GRANT SELECT ON TABLE "Banner" TO anon;
CREATE POLICY "Public read banners" ON "Banner" FOR SELECT TO anon USING (true);

-- Las portadas de marcas y nosotros reemplazan al slot "nosotros.hero"; el
-- banner de la tienda online reemplaza al slot "home.distribuidora".
DELETE FROM "ImageSlot" WHERE "key" IN ('nosotros.hero', 'home.distribuidora');

-- Textos de la portada del inicio: misma lista que PUBLIC_SETTING_KEYS.
DROP POLICY IF EXISTS "Public read allowed settings" ON "Setting";
CREATE POLICY "Public read allowed settings" ON "Setting"
  FOR SELECT TO anon USING ("key" IN ('home.videoUrl', 'home.heroTitle', 'home.heroText', 'about.headline', 'about.body'));
