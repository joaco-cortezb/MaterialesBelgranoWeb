import "server-only";

import { unstable_cache } from "next/cache";
import {
  findImageSlot,
  IMAGE_SLOTS,
  PUBLIC_SETTING_KEYS,
  SETTING_KEYS,
  SITE,
  youtubeVideoId,
  type AboutContent,
  type Brand,
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
    "Materiales Belgrano nació del aporte de sus tres socios fundadores y actuales propietarios, Federico, Tomás y Pablo, con una idea simple: que comprar materiales eléctricos sea rápido, claro y con alguien del otro lado que sepa lo que vende.",
    "Invertimos en un salón de ventas moderno y cómodo, en un depósito ordenado con stock permanente y en la capacitación de un equipo joven, con un promedio de edad que no supera los 30 años. Crecimos gracias al boca en boca de instaladores, empresas y vecinos de Mendoza.",
    "Hoy estamos entre las principales casas del rubro en la provincia, y seguimos apostando a lo mismo: precios competitivos, entrega rápida y atención personalizada.",
  ],
};

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
