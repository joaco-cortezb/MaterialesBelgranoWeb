import type { NextConfig } from "next";

const storageHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return "invalid.supabase.co";
  }
})();

const nextConfig: NextConfig = {
  transpilePackages: ["@mb/shared"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=(), browsing-topics=()",
          },
          { key: "Content-Security-Policy", value: contentSecurityPolicy() },
        ],
      },
    ];
  },
  images: {
    // Los defaults de Next arrancan en 640 px: en teléfonos servían cards al
    // doble de su ancho real.
    deviceSizes: [320, 420, 480, 640, 750, 828, 1080, 1200, 1920, 2048],
    formats: ["image/webp"],
    qualities: [60, 65, 70, 75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    remotePatterns: [
      { protocol: "https", hostname: storageHost, pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

/**
 * Content-Security-Policy por directiva: cada origen queda al lado del motivo.
 * Sólo hosts exactos; nada de comodines sobre hostings compartidos.
 */
function contentSecurityPolicy(): string {
  const isProduction = process.env.NODE_ENV === "production";
  /** Script y beacon de `@vercel/analytics`. */
  const VERCEL_ANALYTICS_HOST = "https://va.vercel-scripts.com";
  const GOOGLE_TAG_HOSTS = ["https://www.googletagmanager.com", "https://tagmanager.google.com"];
  const GOOGLE_ANALYTICS_HOSTS = [
    "https://www.google-analytics.com",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
  ];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      "https://*.supabase.co",
      "https://i.ytimg.com",
      "https://*.ytimg.com",
      ...GOOGLE_TAG_HOSTS,
      ...GOOGLE_ANALYTICS_HOSTS,
    ],
    "media-src": ["'self'", "blob:", "https://*.supabase.co"],
    // `unsafe-eval` sólo en el dev server (React Refresh); en producción queda afuera.
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(isProduction ? [] : ["'unsafe-eval'"]),
      "https://www.youtube.com",
      VERCEL_ANALYTICS_HOST,
      ...GOOGLE_TAG_HOSTS,
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    // Video de YouTube (facade) y mapa de Google en /contacto.
    "frame-src": ["https://www.youtube-nocookie.com", "https://www.youtube.com", "https://www.google.com"],
    "connect-src": [
      "'self'",
      "https://*.supabase.co",
      "https://www.youtube-nocookie.com",
      VERCEL_ANALYTICS_HOST,
      "https://vitals.vercel-insights.com",
      ...GOOGLE_TAG_HOSTS,
      ...GOOGLE_ANALYTICS_HOSTS,
    ],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "frame-ancestors": ["'none'"],
    "form-action": ["'self'"],
  };

  const rendered = Object.entries(directives).map(
    ([directive, sources]) => `${directive} ${[...new Set(sources)].join(" ")}`,
  );

  return [...rendered, "upgrade-insecure-requests"].join("; ");
}

export default nextConfig;
