-- Banners con dos imágenes: una apaisada para computadora y otra para celular.
ALTER TABLE "Banner" ADD COLUMN "imageMobile" TEXT NOT NULL DEFAULT '';
