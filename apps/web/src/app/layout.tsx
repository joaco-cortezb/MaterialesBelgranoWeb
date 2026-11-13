import type { Metadata } from "next";
import localFont from "next/font/local";
import { SITE } from "@mb/shared";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteImagePrefetch } from "@/components/layout/SiteImagePrefetch";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { JsonLd } from "@/components/seo/JsonLd";
import { storeSchema, websiteSchema } from "@/lib/structured-data";
import { siteUrl } from "@/lib/site-url";
import { BASE_OPEN_GRAPH } from "@/lib/metadata";
import { env } from "@/lib/env";

/**
 * Tipografías del manual de marca: Abacaxi Latin (variable, 100–700) para el
 * texto, Arupala Grotesk para títulos y Briller para subtítulos y etiquetas. Van servidas desde el
 * propio sitio (`src/fonts`), recortadas a caracteres latinos.
 */
const abacaxi = localFont({
  src: "../fonts/abacaxi-latin-vf.woff2",
  variable: "--font-abacaxi",
  weight: "100 700",
  display: "swap",
});

const arupala = localFont({
  src: [
    { path: "../fonts/arupala-grotesk-500.woff2", weight: "500" },
    { path: "../fonts/arupala-grotesk-700.woff2", weight: "700" },
    { path: "../fonts/arupala-grotesk-800.woff2", weight: "800" },
  ],
  variable: "--font-arupala",
  display: "swap",
});

const briller = localFont({
  src: "../fonts/briller-400.woff2",
  variable: "--font-briller",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name} | Materiales eléctricos e iluminación en Mendoza`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: BASE_OPEN_GRAPH,
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const storageOrigin = safeOrigin(env.SUPABASE_URL);

  return (
    <html lang="es-AR" data-scroll-behavior="smooth" className={`${abacaxi.variable} ${arupala.variable} ${briller.variable} h-full antialiased`}>
      <head>
        {storageOrigin && (
          <>
            <link rel="preconnect" href={storageOrigin} />
            <link rel="dns-prefetch" href={storageOrigin} />
          </>
        )}
        <JsonLd schema={storeSchema()} />
        <JsonLd schema={websiteSchema()} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-ink-dark"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        <SiteImagePrefetch />
        <GoogleTagManager />
      </body>
    </html>
  );
}

function safeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}
