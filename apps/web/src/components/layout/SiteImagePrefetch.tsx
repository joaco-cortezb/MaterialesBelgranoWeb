import { ROUTES } from "@mb/shared";
import { getHeroSlides } from "@/lib/cms";
import { ImagePrefetcher, type PrefetchImage } from "@/components/layout/ImagePrefetcher";
import { MOBILE_MEDIA } from "@/components/ui/ResponsiveMedia";

/**
 * Primera foto de portada de cada página (con los mismos `sizes` y calidad
 * que usa la portada) para precargarla en segundo plano: es lo primero que se
 * ve al navegar. Las lecturas salen de la cache de la web: no suma consultas.
 */
export async function SiteImagePrefetch() {
  const [inicio, marcas, nosotros] = await Promise.all([getHeroSlides("inicio"), getHeroSlides("marcas"), getHeroSlides("nosotros")]);

  const images: PrefetchImage[] = [];
  const pages = [
    { path: ROUTES.home, slide: inicio[0] },
    { path: ROUTES.marcas, slide: marcas[0] },
    { path: ROUTES.nosotros, slide: nosotros[0] },
  ];
  for (const { path, slide } of pages) {
    if (!slide) continue;
    if (slide.urlMobile) {
      images.push({ path, src: slide.url, sizes: "100vw", quality: 75, media: "(min-width: 640px)" });
      images.push({ path, src: slide.urlMobile, sizes: "100vw", quality: 75, media: MOBILE_MEDIA });
    } else {
      images.push({ path, src: slide.url, sizes: "100vw", quality: 75 });
    }
  }

  return <ImagePrefetcher images={images} />;
}
