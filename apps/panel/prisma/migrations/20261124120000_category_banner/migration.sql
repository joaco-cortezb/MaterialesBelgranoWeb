-- Banner propio de la página de cada solución (antes usaba la misma foto que
-- la card del carrusel). Vacío = la página sigue usando la foto de la card.
-- `IF NOT EXISTS`: se puede aplicar a mano antes del deploy sin romperlo.
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "banner" TEXT;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "bannerPosition" TEXT NOT NULL DEFAULT '50% 50%';
