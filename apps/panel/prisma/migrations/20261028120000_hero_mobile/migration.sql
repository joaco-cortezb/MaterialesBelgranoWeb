-- Portadas con foto propia para celular (vertical / más alta). Vacía = en
-- celular se usa la de computadora, recortada al centro.
ALTER TABLE "HeroSlide" ADD COLUMN "urlMobile" TEXT NOT NULL DEFAULT '';
