/** Únicas variables de entorno que pueden viajar en el bundle del navegador. */
export const publicEnv = {
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID ?? "",
} as const;

/** Sólo se considera configurado si tiene la forma que emite Google. */
export function isValidGtmId(value: string | undefined): boolean {
  if (!value || /placeholder|cambiame/i.test(value)) return false;
  return /^GTM-[A-Z0-9]{4,}$/.test(value);
}

export function gtmConfigured(): boolean {
  return isValidGtmId(publicEnv.GTM_ID);
}
