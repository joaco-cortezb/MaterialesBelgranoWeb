import "server-only";

import { BANNER_KEYS, HERO_PAGES } from "@mb/shared";
import { getBanner, getBrands, getCategories, getHeroSlides, getImageSlots, ALL_IMAGE_SLOT_KEYS } from "@/lib/cms";
import { DEVICE_SIZES, IMAGE_SIZES } from "@/lib/image-sizes";

type WarmItem = { url: string; widths: readonly number[]; quality: number };

/**
 * Todas las imágenes administrables con los anchos y la calidad con que las
 * pide la web (tiene que coincidir con los `quality` de cada componente).
 */
async function collectImages(): Promise<WarmItem[]> {
  const [heroes, banners, categories, brands, slots] = await Promise.all([
    Promise.all(HERO_PAGES.map((page) => getHeroSlides(page))),
    Promise.all(BANNER_KEYS.map((key) => getBanner(key))),
    getCategories(),
    getBrands(),
    getImageSlots(ALL_IMAGE_SLOT_KEYS),
  ]);

  const items: WarmItem[] = [];
  for (const slide of heroes.flat()) items.push({ url: slide.url, widths: DEVICE_SIZES, quality: 75 });
  for (const banner of banners) {
    if (!banner) continue;
    items.push({ url: banner.image, widths: DEVICE_SIZES, quality: 85 });
    if (banner.imageMobile && banner.imageMobile !== banner.image) items.push({ url: banner.imageMobile, widths: DEVICE_SIZES.slice(0, 3), quality: 85 });
  }
  for (const category of categories) if (category.image) items.push({ url: category.image, widths: DEVICE_SIZES.slice(0, 4), quality: 75 });
  for (const slot of Object.values(slots)) if (slot) items.push({ url: slot.url, widths: DEVICE_SIZES.slice(0, 4), quality: 75 });
  for (const brand of brands) if (brand.logo) items.push({ url: brand.logo, widths: IMAGE_SIZES, quality: 75 });
  return items;
}

/**
 * Pide cada imagen al optimizador para que quede procesada y en cache antes de
 * que la pida un visitante (la primera vez tarda ~1 s; desde cache, ~0,2 s).
 * Se corre después de cada cambio del panel, en segundo plano.
 */
export async function warmImageCache(origin: string): Promise<void> {
  const items = await collectImages();
  const urls = items.flatMap((item) =>
    item.widths.map((width) => `${origin}/_next/image?url=${encodeURIComponent(item.url)}&w=${width}&q=${item.quality}`),
  );

  // De a 6 en paralelo para no saturar el optimizador.
  let index = 0;
  const worker = async () => {
    while (index < urls.length) {
      const url = urls[index++];
      try {
        const response = await fetch(url, { headers: { accept: "image/avif,image/webp,image/*,*/*;q=0.8" }, cache: "no-store" });
        await response.arrayBuffer();
      } catch {
        // Si una falla, la próxima visita la procesa igual: no es crítico.
      }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  console.info(`[image-warmup] ${urls.length} versiones de imágenes listas`);
}
