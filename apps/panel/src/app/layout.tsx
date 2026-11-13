import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const abacaxi = localFont({
  src: "../fonts/abacaxi-latin-vf.woff2",
  variable: "--font-abacaxi",
  weight: "100 700",
  display: "swap",
});

const arupala = localFont({
  src: [
    { path: "../fonts/arupala-grotesk-700.woff2", weight: "700" },
    { path: "../fonts/arupala-grotesk-800.woff2", weight: "800" },
  ],
  variable: "--font-arupala",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Panel · Materiales Belgrano", template: "%s · Panel MB" },
  description: "Panel de administración de la web de Materiales Belgrano.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${abacaxi.variable} ${arupala.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
