import "server-only";

import { unstable_cache } from "next/cache";
import {
  findImageSlot,
  BANNER_CONFIG,
  DEFAULT_HOME_HERO_TEXT,
  DEFAULT_HOME_HERO_TITLE,
  HERO_PAGE_CONFIG,
  IMAGE_SLOTS,
  PUBLIC_SETTING_KEYS,
  SETTING_KEYS,
  SITE,
  seedCategories,
  youtubeVideoId,
  type AboutContent,
  type Brand,
  type Category,
  type Faq,
  type Banner,
  type BannerKey,
  type HeroPage,
  type HeroSlide,
  type ImageSlot,
  type WhatsappNumber,
} from "@mb/shared";
import { getSupabaseClient } from "@/lib/supabase";

/**
 * Todas las lecturas del contenido administrable pasan por acá, cacheadas con
 * `unstable_cache` + tags. El panel invalida con `POST /api/revalidate` y, si
 * ese webhook falla, el TTL de respaldo (1 h) limita el daño.
 *
 * Sin Supabase configurado devuelve vacío: la web compila y se ve con los
 * fallbacks del repo.
 */
const FALLBACK_TTL_SECONDS = 3600;

/* ── Marcas ──────────────────────────────────────────────────────────────── */

const BRAND_SELECT = "id, name, slug, logo, catalogUrl, rubroSlug, order, active";

type BrandRow = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  catalogUrl: string;
  rubroSlug: string | null;
  order: number;
  active: boolean;
};

function brandFromRow(row: BrandRow): Brand {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logo: row.logo ?? "",
    catalogUrl: row.catalogUrl,
    rubroSlug: row.rubroSlug,
    order: row.order,
    active: row.active,
  };
}

export const getBrands = unstable_cache(
  async (): Promise<Brand[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("Brand")
      .select(BRAND_SELECT)
      .eq("active", true)
      .order("order", { ascending: true });
    if (error) {
      console.error("[cms] no se pudieron leer las marcas", error.message);
      return [];
    }
    return (data as BrandRow[]).map(brandFromRow);
  },
  ["cms-brands"],
  { tags: ["brands"], revalidate: FALLBACK_TTL_SECONDS },
);

export async function getBrandsForRubro(rubroSlug: string): Promise<Brand[]> {
  const brands = await getBrands();
  return brands.filter((brand) => brand.rubroSlug === rubroSlug);
}

/* ── Slots de imagen ─────────────────────────────────────────────────────── */

type ImageSlotRow = { key: string; url: string; alt: string; position: string | null };

const getImageSlotRows = unstable_cache(
  async (): Promise<ImageSlotRow[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) return [];
    const { data, error } = await supabase.from("ImageSlot").select("key, url, alt, position");
    if (error) {
      console.error("[cms] no se pudieron leer los slots de imagen", error.message);
      return [];
    }
    return data as ImageSlotRow[];
  },
  ["cms-image-slots"],
  { tags: ["images"], revalidate: FALLBACK_TTL_SECONDS },
);

/**
 * Imagen de un slot: la cargada en el panel o el fallback del repo. Devuelve
 * `null` sólo cuando no hay ninguna de las dos (el componente decide qué
 * mostrar en ese caso).
 */
export async function getImageSlot(key: string): Promise<ImageSlot | null> {
  const definition = findImageSlot(key);
  const rows = await getImageSlotRows();
  const row = rows.find((item) => item.key === key);
  if (row?.url) {
    return { key, url: row.url, alt: row.alt || definition?.fallbackAlt || "", position: row.position || "50% 50%" };
  }
  if (definition?.fallback) {
    return { key, url: definition.fallback, alt: definition.fallbackAlt, position: "50% 50%" };
  }
  return null;
}

export async function getImageSlots(keys: readonly string[]): Promise<Record<string, ImageSlot | null>> {
  const entries = await Promise.all(keys.map(async (key) => [key, await getImageSlot(key)] as const));
  return Object.fromEntries(entries);
}

export const ALL_IMAGE_SLOT_KEYS = IMAGE_SLOTS.map((slot) => slot.key);

/* ── Soluciones ──────────────────────────────────────────────────────────── */

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string[] | null;
  subcategories: string[] | null;
  faqs: unknown;
  image: string | null;
  imageAlt: string | null;
  imagePosition: string | null;
  whatsappMessage: string;
  seoTitle: string | null;
  seoDescription: string | null;
  order: number;
};

function faqsFromJson(value: unknown): Faq[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Faq => typeof item?.question === "string" && typeof item?.answer === "string",
  );
}

function categoryFromRow(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    description: row.description ?? [],
    subcategories: row.subcategories ?? [],
    faqs: faqsFromJson(row.faqs),
    image: row.image ?? "",
    imageAlt: row.imageAlt || row.name,
    imagePosition: row.imagePosition || "50% 50%",
    whatsappMessage: row.whatsappMessage,
    seoTitle: row.seoTitle || row.name,
    seoDescription: row.seoDescription || row.summary,
    order: row.order,
  };
}

/**
 * Soluciones activas, en orden. Si la base no está configurada o falla, usa el
 * contenido inicial del repo para que las páginas clave de SEO no se caigan.
 * (Si la base responde vacía es porque se borraron todas: se respeta.)
 */
export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) return seedCategories();
    const { data, error } = await supabase
      .from("Category")
      .select("id, slug, name, summary, description, subcategories, faqs, image, imageAlt, imagePosition, whatsappMessage, seoTitle, seoDescription, order")
      .eq("active", true)
      .order("order", { ascending: true });
    if (error) {
      console.error("[cms] no se pudieron leer las soluciones", error.message);
      return seedCategories();
    }
    return (data as CategoryRow[]).map(categoryFromRow);
  },
  ["cms-categories"],
  { tags: ["categories"], revalidate: FALLBACK_TTL_SECONDS },
);

export async function getCategory(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
}

/* ── Portada del inicio ──────────────────────────────────────────────────── */

type HeroSlideRow = { id: string; page: string; url: string; alt: string; position: string | null };

const getHeroSlideRows = unstable_cache(
  async (): Promise<HeroSlideRow[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("HeroSlide")
      .select("id, page, url, alt, position")
      .eq("active", true)
      .order("order", { ascending: true });
    if (error) {
      console.error("[cms] no se pudieron leer las fotos de portada", error.message);
      return [];
    }
    return data as HeroSlideRow[];
  },
  ["cms-hero-slides-v2"],
  { tags: ["images"], revalidate: FALLBACK_TTL_SECONDS },
);

/** Fotos activas de la portada de una página; si no hay ninguna, las del repo. */
export async function getHeroSlides(page: HeroPage = "inicio"): Promise<HeroSlide[]> {
  const rows = (await getHeroSlideRows()).filter((row) => row.url && (row.page || "inicio") === page);
  if (rows.length) {
    return rows.map((row) => ({ id: row.id, url: row.url, alt: row.alt, position: row.position || "50% 50%" }));
  }
  return HERO_PAGE_CONFIG[page].fallback.map((slide, index) => ({ id: `fallback-${index}`, url: slide.url, alt: slide.alt, position: "50% 50%" }));
}

/* ── Banners del inicio ──────────────────────────────────────────────────── */

type BannerRow = { key: string; title: string; text: string; image: string; imageMobile: string | null; url: string; active: boolean };

const getBannerRows = unstable_cache(
  async (): Promise<BannerRow[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) return [];
    const { data, error } = await supabase.from("Banner").select("key, title, text, image, imageMobile, url, active");
    if (error) {
      console.error("[cms] no se pudieron leer los banners", error.message);
      return [];
    }
    return data as BannerRow[];
  },
  ["cms-banners-v2"],
  { tags: ["images"], revalidate: FALLBACK_TTL_SECONDS },
);

/** Banner de un lugar: el del panel, el por defecto si no hay fila, o `null` si está apagado o sin imagen. */
export async function getBanner(key: BannerKey): Promise<Banner | null> {
  const row = (await getBannerRows()).find((item) => item.key === key);
  if (row && (!row.active || !row.image)) return null;
  if (row) return { key, title: row.title, text: row.text, image: row.image, imageMobile: row.imageMobile || row.image, url: row.url };
  return { key, ...BANNER_CONFIG[key].defaults };
}

/* ── WhatsApp ────────────────────────────────────────────────────────────── */

type WhatsappRow = {
  id: string;
  label: string;
  phone: string;
  message: string;
  audience: "GENERAL" | "EMPRESAS";
  order: number;
  active: boolean;
};

export const getWhatsappNumbers = unstable_cache(
  async (): Promise<WhatsappNumber[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("WhatsappNumber")
      .select("id, label, phone, message, audience, order, active")
      .eq("active", true)
      .order("order", { ascending: true });
    if (error) {
      console.error("[cms] no se pudieron leer los números de WhatsApp", error.message);
      return [];
    }
    return data as WhatsappRow[];
  },
  ["cms-whatsapp"],
  { tags: ["whatsapp"], revalidate: FALLBACK_TTL_SECONDS },
);

/** Número por defecto para los CTA: el primer GENERAL activo, o el fallback del repo. */
export async function getDefaultWhatsapp(): Promise<WhatsappNumber> {
  const numbers = await getWhatsappNumbers();
  const general = numbers.find((number) => number.audience === "GENERAL") ?? numbers[0];
  if (general) return general;
  return {
    id: "fallback",
    label: SITE.whatsappFallback.label,
    phone: SITE.whatsappFallback.phone,
    message: "",
    audience: "GENERAL",
    order: 0,
    active: true,
  };
}

/* ── Settings ────────────────────────────────────────────────────────────── */

type SettingRow = { key: string; value: unknown };

const getSettings = unstable_cache(
  async (): Promise<Record<string, unknown>> => {
    const supabase = getSupabaseClient();
    if (!supabase) return {};
    const { data, error } = await supabase
      .from("Setting")
      .select("key, value")
      .in("key", PUBLIC_SETTING_KEYS as string[]);
    if (error) {
      console.error("[cms] no se pudieron leer los settings", error.message);
      return {};
    }
    return Object.fromEntries((data as SettingRow[]).map((row) => [row.key, row.value]));
  },
  ["cms-settings"],
  { tags: ["settings"], revalidate: FALLBACK_TTL_SECONDS },
);

/** ID del video de YouTube del inicio, o `null` si no hay uno válido cargado. */
export async function getHomeVideoId(): Promise<string | null> {
  const settings = await getSettings();
  const value = settings[SETTING_KEYS.homeVideoUrl];
  return typeof value === "string" ? youtubeVideoId(value) : null;
}

const DEFAULT_ABOUT: AboutContent = {
  headline: "Casi 10 años creciendo con la atención como diferencial",
  body: [
    "Nacimos de la idea de tres socios, Federico, Tomás y Pablo: que comprar materiales eléctricos sea rápido, claro y con alguien del otro lado que sepa lo que vende.",
    "Hoy somos una de las principales casas del rubro en Mendoza, con un salón moderno, depósito propio y un equipo joven que crece con cada recomendación.",
  ],
};

/** Textos de la portada del inicio (título obligatorio, bajada opcional). */
export async function getHomeHeroText(): Promise<{ title: string; text: string }> {
  const settings = await getSettings();
  const title = settings[SETTING_KEYS.homeHeroTitle];
  const text = settings[SETTING_KEYS.homeHeroText];
  return {
    title: typeof title === "string" && title.trim() ? title.trim() : DEFAULT_HOME_HERO_TITLE,
    text: typeof text === "string" ? text.trim() : DEFAULT_HOME_HERO_TEXT,
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  const settings = await getSettings();
  const headline = settings[SETTING_KEYS.aboutHeadline];
  const body = settings[SETTING_KEYS.aboutBody];
  return {
    headline: typeof headline === "string" && headline.trim() ? headline : DEFAULT_ABOUT.headline,
    body:
      typeof body === "string" && body.trim()
        ? body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)
        : DEFAULT_ABOUT.body,
  };
}
