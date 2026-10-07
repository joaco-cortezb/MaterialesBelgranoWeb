import type { Metadata } from "next";
import { Barlow_Condensed, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE } from "@mb/shared";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsappFloat } from "@/components/layout/WhatsappFloat";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { JsonLd } from "@/components/seo/JsonLd";
import { storeSchema, websiteSchema } from "@/lib/structured-data";
import { siteUrl } from "@/lib/site-url";
import { env } from "@/lib/env";

/**
 * Montserrat ExtraBold es la tipografía de títulos del manual de marca; la
 * usamos también para el texto para no cargar una tercera familia. Barlow
 * Condensed reemplaza a DIN Condensed (no está en Google Fonts) en eyebrows,
 * etiquetas y cifras.
 */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "es_AR",
    images: [{ url: "/og-materiales-belgrano.jpg", width: 1200, height: 630, alt: `${SITE.name} · ${SITE.tagline}` }],
  },
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
    <html lang="es-AR" className={`${montserrat.variable} ${barlow.variable} h-full antialiased`}>
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
        <WhatsappFloat />
        <GoogleTagManager />
        <Analytics />
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
