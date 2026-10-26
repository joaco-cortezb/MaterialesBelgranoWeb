import { BANNER_KEYS } from "@mb/shared";
import { getBanner, getCategories, getHeroSlides, getImageSlots } from "@/lib/cms";
import { ImagePrefetcher, type PrefetchImage } from "@/components/layout/ImagePrefetcher";
import { BANNER_SIZES } from "@/components/sections/HomeBanner";
import { MOBILE_MEDIA } from "@/components/ui/ResponsiveMedia";

/**
 * Lista de imágenes importantes de todas las secciones (con los mismos
 * `sizes` y calidad que usa cada componente) para precargarlas en segundo
 * plano. Las lecturas salen de la cache de la web: no suma consultas.
 */
export async function SiteImagePrefetch() {
  const [inicio, marcas, nosotros, banners, slots, categories] = await Promise.all([
    getHeroSlides("inicio"),
    getHeroSlides("marcas"),
    getHeroSlides("nosotros"),
    Promise.all(BANNER_KEYS.map((key) => getBanner(key))),
    getImageSlots(["nosotros.salon", "nosotros.deposito", "nosotros.equipo"]),
    getCategories(),
  ]);

  const images: PrefetchImage[] = [];
  for (const slide of [inicio[0], marcas[0], nosotros[0]]) {
    if (!slide) continue;
    if (slide.urlMobile) {
      images.push({ src: slide.url, sizes: "100vw", quality: 75, media: "(min-width: 640px)" });
      images.push({ src: slide.urlMobile, sizes: "100vw", quality: 75, media: MOBILE_MEDIA });
    } else {
      images.push({ src: slide.url, sizes: "100vw", quality: 75 });
    }
  }
  for (const banner of banners) {
    if (!banner) continue;
    images.push({ src: banner.image, sizes: BANNER_SIZES.desktop, quality: 85, media: "(min-width: 640px)" });
    images.push({ src: banner.imageMobile || banner.image, sizes: BANNER_SIZES.mobile, quality: 85, media: "(max-width: 639.98px)" });
  }
  const salon = slots["nosotros.salon"];
  if (salon) images.push({ src: salon.url, sizes: "(min-width: 1280px) 820px, 100vw", quality: 75 });
  for (const key of ["nosotros.deposito", "nosotros.equipo"] as const) {
    const slot = slots[key];
    if (slot) images.push({ src: slot.url, sizes: "(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw", quality: 75 });
  }
  for (const category of categories) {
    if (category.image) images.push({ src: category.image, sizes: "(min-width: 1280px) 360px, (min-width: 1024px) 30vw, (min-width: 640px) 44vw, 78vw", quality: 75 });
  }

  return <ImagePrefetcher images={images} />;
}
