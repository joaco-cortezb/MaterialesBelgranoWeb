-- Carrusel de fotos de la portada del inicio (reemplaza al slot "home.hero").

CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "position" TEXT NOT NULL DEFAULT '50% 50%',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HeroSlide_active_order_idx" ON "HeroSlide"("active", "order");

-- Si ya había una portada cargada como slot, pasa a ser la primera foto.
INSERT INTO "HeroSlide" ("id", "url", "alt", "position", "order", "updatedAt")
SELECT 'hero-inicial', "url", "alt", COALESCE("position", '50% 50%'), 0, CURRENT_TIMESTAMP
FROM "ImageSlot" WHERE "key" = 'home.hero' AND "url" <> '';
DELETE FROM "ImageSlot" WHERE "key" = 'home.hero';

-- La web la lee con la anon key: sólo las fotos activas.
ALTER TABLE "HeroSlide" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "HeroSlide" FROM anon, authenticated;
GRANT SELECT ON TABLE "HeroSlide" TO anon;

CREATE POLICY "Public read active hero slides" ON "HeroSlide"
  FOR SELECT TO anon USING ("active" = true);
