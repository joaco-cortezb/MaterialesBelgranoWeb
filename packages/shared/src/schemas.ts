import { z } from "zod";
import { BANNER_KEYS, HERO_PAGES, IMAGE_SLOT_KEYS } from "./config/image-slots.ts";
import { safeExternalUrl, youtubeVideoId } from "./lib/safe-url.ts";
import { normalizeWhatsappPhone } from "./lib/whatsapp-url.ts";

/** Validación de los formularios del panel. Un solo lugar para web y panel. */

const checkbox = z.union([z.literal("on"), z.literal("")]).optional();

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Ruta local segura ("/marcas"): sin "//" ni "/\\" (que el navegador lee como otro dominio). */
export function isSafeLocalPath(value: string): boolean {
  return /^\/(?![\/\\])/.test(value) && !/[\u0000-\u001f\\]/.test(value);
}

/** Imagen válida: vacía, un archivo de la web ("/images/…") o el Storage público de Supabase. */
export function isSafeImageUrl(value: string): boolean {
  if (value === "") return true;
  if (isSafeLocalPath(value)) return true;
  const url = safeExternalUrl(value);
  if (!url) return false;
  const { hostname, pathname } = new URL(url);
  return hostname.endsWith(".supabase.co") && pathname.startsWith("/storage/v1/object/public/");
}

const imageUrl = z.string().trim().max(500).refine(isSafeImageUrl, "URL de imagen inválida");

const lines = (max: number, maxItems: number) =>
  z
    .string()
    .max(max)
    .optional()
    .default("")
    .transform((value) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))
    .refine((items) => items.length <= maxItems, `Máximo ${maxItems} ítems`);

const faqItem = z.object({
  question: z.string().trim().min(1, "Falta la pregunta").max(200),
  answer: z.string().trim().min(1, "Falta la respuesta").max(1200),
});

export const brandSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  catalogUrl: z
    .string()
    .trim()
    .max(500)
    .refine((value) => Boolean(safeExternalUrl(value)), "La URL del catálogo tiene que empezar con https://"),
  logo: imageUrl.optional().default(""),
  rubroSlug: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((value) => value === "" || SLUG_PATTERN.test(value), "Solución inválida"),
  active: checkbox,
});

export const imageSlotSchema = z.object({
  key: z.string().refine((value) => IMAGE_SLOT_KEYS.includes(value), "Slot inválido"),
  url: imageUrl,
  alt: z.string().trim().min(1, "El texto alternativo es obligatorio").max(200),
  position: z
    .string()
    .trim()
    .max(20)
    .optional()
    .default("50% 50%")
    .refine((value) => /^\d{1,3}% \d{1,3}%$/.test(value), "Encuadre inválido"),
});

export const whatsappNumberSchema = z.object({
  label: z.string().trim().min(1, "La etiqueta es obligatoria").max(60),
  phone: z
    .string()
    .trim()
    .transform(normalizeWhatsappPhone)
    .refine((value) => /^\d{10,15}$/.test(value), "Número inválido: usá código de país, ej. 54 9 261 533 0777"),
  message: z.string().trim().max(500).optional().default(""),
  audience: z.enum(["GENERAL", "EMPRESAS"]).default("GENERAL"),
  active: checkbox,
});

export const heroSlideSchema = z.object({
  page: z.enum(HERO_PAGES).default("inicio"),
  url: imageUrl.refine((value) => value !== "", "Subí una imagen"),
  urlMobile: imageUrl.optional().default(""),
  alt: z.string().trim().min(1, "El texto alternativo es obligatorio").max(200),
  position: z
    .string()
    .trim()
    .max(20)
    .optional()
    .default("50% 50%")
    .refine((value) => /^\d{1,3}% \d{1,3}%$/.test(value), "Encuadre inválido"),
});

export const heroTextSchema = z.object({
  title: z.string().trim().max(120).optional().default(""),
  text: z.string().trim().max(240).optional().default(""),
});

/** Link de un banner: vacío, una ruta interna ("/marcas") o una URL https. */
const bannerLink = z
  .string()
  .trim()
  .max(500)
  .optional()
  .default("")
  .refine(
    (value) => value === "" || isSafeLocalPath(value) || Boolean(safeExternalUrl(value)),
    "Link inválido: usá una dirección que empiece con https:// o una ruta como /marcas",
  );

export const bannerSchema = z.object({
  key: z.enum(BANNER_KEYS),
  // `title` es la descripción de la imagen (texto alternativo): el banner no lleva texto encima.
  title: z.string().trim().min(1, "Describí qué dice o muestra el banner").max(200),
  text: z.string().trim().max(280).optional().default(""),
  image: imageUrl.refine((value) => value !== "", "Subí la imagen para computadora"),
  imageMobile: imageUrl.refine((value) => value !== "", "Subí la imagen para celular"),
  url: bannerLink,
  active: checkbox,
});

export const homeVideoSchema = z.object({
  videoUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === "" || Boolean(youtubeVideoId(value)), "Pegá un link de YouTube válido (youtube.com/watch?v=… o youtu.be/…)"),
});

export const aboutSchema = z.object({
  headline: z.string().trim().min(1, "El título es obligatorio").max(160),
  body: z.string().trim().min(1, "El texto es obligatorio").max(1200),
});

/** Formulario de solución del panel. `faqs` llega como JSON (lista de preguntas). */
export const categorySchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "La URL es obligatoria")
    .max(80)
    .refine((value) => SLUG_PATTERN.test(value), "URL inválida: sólo minúsculas, números y guiones"),
  summary: z.string().trim().min(1, "La bajada es obligatoria").max(160),
  description: z
    .string()
    .trim()
    .max(6000)
    .optional()
    .default("")
    .transform((value) => value.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)),
  subcategories: lines(2000, 20),
  faqs: z
    .string()
    .optional()
    .default("[]")
    .transform((value, ctx) => {
      try {
        return JSON.parse(value) as unknown;
      } catch {
        ctx.addIssue({ code: "custom", message: "Preguntas frecuentes inválidas" });
        return z.NEVER;
      }
    })
    .pipe(z.array(faqItem).max(12, "Máximo 12 preguntas")),
  image: imageUrl.optional().default(""),
  imageAlt: z.string().trim().max(200).optional().default(""),
  imagePosition: z
    .string()
    .trim()
    .max(20)
    .optional()
    .default("50% 50%")
    .refine((value) => /^\d{1,3}% \d{1,3}%$/.test(value), "Encuadre inválido"),
  whatsappMessage: z.string().trim().max(500).optional().default(""),
  seoTitle: z.string().trim().max(70).optional().default(""),
  seoDescription: z.string().trim().max(160, "La descripción para Google no puede pasar de 160 caracteres").optional().default(""),
  active: checkbox,
});
