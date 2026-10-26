import { DEFAULT_HOME_HERO_TEXT, DEFAULT_HOME_HERO_TITLE, isHeroPage, SETTING_KEYS, type HeroPage } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { HeroSlidesBoard, type HeroSlideDTO } from "./HeroSlidesBoard";

export const dynamic = "force-dynamic";

export default async function PortadaPage({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  await requireSectionView("imagenes");
  const { pagina } = await searchParams;
  const initialPage: HeroPage = pagina && isHeroPage(pagina) ? pagina : "inicio";

  let slides: (HeroSlideDTO & { page: string })[] = [];
  let heroTitle = DEFAULT_HOME_HERO_TITLE;
  // Sin nada guardado se precarga lo que hoy muestra la web.
  let heroText = DEFAULT_HOME_HERO_TEXT;
  try {
    const [rows, settings] = await Promise.all([
      prisma.heroSlide.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: { id: true, page: true, url: true, alt: true, position: true, active: true },
      }),
      prisma.setting.findMany({ where: { key: { in: [SETTING_KEYS.homeHeroTitle, SETTING_KEYS.homeHeroText] } } }),
    ]);
    slides = rows;
    const title = settings.find((row) => row.key === SETTING_KEYS.homeHeroTitle)?.value;
    const text = settings.find((row) => row.key === SETTING_KEYS.homeHeroText)?.value;
    if (typeof title === "string" && title.trim()) heroTitle = title;
    if (typeof text === "string") heroText = text;
  } catch (error) {
    console.error("No se pudieron leer las portadas", error);
  }

  return (
    <HeroSlidesBoard
      slides={slides}
      initialPage={initialPage}
      heroText={{ title: heroTitle, text: heroText, defaultTitle: DEFAULT_HOME_HERO_TITLE }}
    />
  );
}
