/**
 * Anchos que genera el optimizador de imágenes. Pocos a propósito: cada
 * combinación de ancho y calidad se procesa una vez y queda en cache; con 19
 * anchos casi cada visita pedía uno nuevo y esperaba ~1 s.
 */
export const DEVICE_SIZES = [640, 828, 1200, 1920, 2560];
/** Anchos para imágenes chicas con `sizes` fijo (logos, miniaturas). */
export const IMAGE_SIZES = [128, 256, 384];
/** Calidades permitidas (cada `quality` usado en la web tiene que estar acá). */
export const IMAGE_QUALITIES = [75, 85];
