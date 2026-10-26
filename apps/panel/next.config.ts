import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

/** Sólo el Storage de este proyecto: el optimizador de imágenes no es un proxy abierto. */
const storageHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return "invalid.supabase.co";
  }
})();

/**
 * Origen de la web pública: las imágenes por defecto (`/images/…`) viven
 * allá y el panel las muestra en las vistas previas.
 */
const webUrl = (process.env.PUBLIC_WEB_URL || "https://materiales-belgrano-web.vercel.app").replace(/\/$/, "");

const nextConfig: NextConfig = {
  transpilePackages: ["@mb/shared"],
  env: { NEXT_PUBLIC_WEB_URL: webUrl },
  serverExternalPackages: ["@prisma/client", ".prisma/client", "sharp"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // El panel no tiene nada que indexar.
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=(), browsing-topics=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `img-src 'self' data: blob: https://${storageHost} https://i.ytimg.com ${webUrl}`,
              "media-src 'self' blob: https://*.supabase.co",
              // `unsafe-eval` sólo lo necesita el dev server (React Refresh).
              `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "frame-src https://www.youtube-nocookie.com",
              "connect-src 'self' https://*.supabase.co",
              "object-src 'none'",
              "base-uri 'self'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
  // Los uploads van por `/api/upload` (route handler), pero las actions con
  // texto largo también pasan por acá.
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: storageHost, pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
