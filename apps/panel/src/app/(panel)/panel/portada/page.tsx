import { HERO_PAGES, HERO_TEXT, isHeroPage, type HeroPage } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { HeroSlidesBoard, type HeroSlideDTO, type HeroTextValue } from "./HeroSlidesBoard";

export const dynamic = "force-dynamic";

export default async function PortadaPage({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  await requireSectionView("imagenes");
  const { pagina } = await searchParams;
  const initialPage: HeroPage = pagina && isHeroPage(pagina) ? pagina : "inicio";

  let slides: (HeroSlideDTO & { page: string })[] = [];
  // Sin nada guardado se precarga lo que hoy muestra la web.
  const heroTexts = Object.fromEntries(
    HERO_PAGES.map((page) => [page, { title: HERO_TEXT[page].defaultTitle, text: HERO_TEXT[page].defaultText, defaultTitle: HERO_TEXT[page].defaultTitle }]),
  ) as Record<HeroPage, HeroTextValue>;
  let loadError = false;
  try {
    const [rows, settings] = await Promise.all([
      prisma.heroSlide.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: { id: true, page: true, url: true, urlMobile: true, alt: true, position: true, active: true },
      }),
      prisma.setting.findMany({ where: { key: { in: HERO_PAGES.flatMap((page) => [HERO_TEXT[page].titleKey, HERO_TEXT[page].textKey]) } } }),
    ]);
    slides = rows;
    for (const page of HERO_PAGES) {
      const title = settings.find((row) => row.key === HERO_TEXT[page].titleKey)?.value;
      const text = settings.find((row) => row.key === HERO_TEXT[page].textKey)?.value;
      if (typeof title === "string" && title.trim()) heroTexts[page].title = title;
      if (typeof text === "string") heroTexts[page].text = text;
    }
  } catch (error) {
    console.error("No se pudieron leer las portadas", error);
    loadError = true;
  }

  return (
    <HeroSlidesBoard
      slides={slides}
      initialPage={initialPage}
      loadError={loadError}
      heroTexts={heroTexts}
    />
  );
}
