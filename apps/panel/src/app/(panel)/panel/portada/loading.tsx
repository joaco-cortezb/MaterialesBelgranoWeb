"use client";

import { useSearchParams } from "next/navigation";
import { HERO_PAGE_CONFIG, isHeroPage } from "@mb/shared";
import { HeroSlidesSkeleton } from "@/components/ui/skeletons";

/** Usa las medidas de la pestaña que se abre (`?pagina=`), así las fotos tienen la proporción real. */
export default function Loading() {
  const pagina = useSearchParams().get("pagina");
  const config = HERO_PAGE_CONFIG[pagina && isHeroPage(pagina) ? pagina : "inicio"];
  return <HeroSlidesSkeleton desktop={config.recommended} mobile={config.recommendedMobile} />;
}
