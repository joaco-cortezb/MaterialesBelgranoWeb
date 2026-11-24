-- Una marca puede estar en varias soluciones (antes, una sola en "rubroSlug").
-- "rubroSlug" queda por compatibilidad mientras conviven las dos versiones del
-- código durante el deploy; el panel lo sigue completando con la primera.
-- Idempotente: se puede aplicar a mano antes del deploy.
ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "rubroSlugs" TEXT[] NOT NULL DEFAULT '{}';
UPDATE "Brand" SET "rubroSlugs" = ARRAY["rubroSlug"]
WHERE "rubroSlug" IS NOT NULL AND cardinality("rubroSlugs") = 0;
