import { z } from "zod";
import { RUBRO_SLUGS } from "./config/rubros.ts";
import { IMAGE_SLOT_KEYS } from "./config/image-slots.ts";
import { safeExternalUrl, youtubeVideoId } from "./lib/safe-url.ts";
import { normalizeWhatsappPhone } from "./lib/whatsapp-url.ts";

/** Validación de los formularios del panel. Un solo lugar para web y panel. */

const checkbox = z.union([z.literal("on"), z.literal("")]).optional();

export const brandSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  catalogUrl: z
    .string()
    .trim()
    .max(500)
    .refine((value) => Boolean(safeExternalUrl(value)), "La URL del catálogo tiene que empezar con https://"),
  logo: z.string().trim().max(500).optional().default(""),
  rubroSlug: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((value) => value === "" || RUBRO_SLUGS.includes(value), "Rubro inválido"),
  active: checkbox,
});

export const imageSlotSchema = z.object({
  key: z.string().refine((value) => IMAGE_SLOT_KEYS.includes(value), "Slot inválido"),
  url: z.string().trim().max(500),
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

export const homeVideoSchema = z.object({
  videoUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === "" || Boolean(youtubeVideoId(value)), "Pegá un link de YouTube válido (youtube.com/watch?v=… o youtu.be/…)"),
});

export const aboutSchema = z.object({
  headline: z.string().trim().min(1, "El título es obligatorio").max(160),
  body: z.string().trim().min(1, "El texto es obligatorio").max(6000),
});
