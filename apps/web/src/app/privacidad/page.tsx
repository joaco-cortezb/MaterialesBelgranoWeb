import type { Metadata } from "next";
import { ROUTES, SITE } from "@mb/shared";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Privacidad y cookies",
  description: `Qué datos recopila el sitio de ${SITE.name}, para qué los usa y qué cookies de terceros intervienen (mapa y video).`,
  alternates: { canonical: ROUTES.privacidad },
};

/** Fecha de la última revisión del texto. Actualizarla si cambia algo de abajo. */
const UPDATED = "26 de octubre de 2026";

/**
 * Política de privacidad y cookies. Describe lo que el sitio hace hoy: no hay
 * formularios ni cookies propias; los clics a WhatsApp se cuentan con un hash
 * anónimo; el mapa (Google) y el video (YouTube sin cookies) son de terceros.
 * Si se agrega GA4 u otra herramienta, sumar una sección y un aviso de cookies.
 */
export default function PrivacidadPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema([{ name: "Privacidad y cookies", path: ROUTES.privacidad }])} />
      <article className="py-16 sm:py-24">
        <Container className="max-w-3xl">
          <Eyebrow className="mb-3">Legales</Eyebrow>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-ink-dark sm:text-5xl">Privacidad y cookies</h1>
          <p className="mt-4 text-sm text-ink-soft">Última actualización: {UPDATED}</p>

          <div className="mt-10 space-y-10 text-[16px] leading-relaxed text-ink [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-ink-dark [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
            <section>
              <h2>Quiénes somos</h2>
              <p>
                Este sitio pertenece a {SITE.legalName} ({SITE.name}), con domicilio en {SITE.address.singleLine}, Argentina. Por cualquier consulta sobre tus datos
                escribinos a{" "}
                <a href={`mailto:${SITE.email}`} className="font-semibold text-brand-700 underline underline-offset-4">
                  {SITE.email}
                </a>
                .
              </p>
            </section>

            <section>
              <h2>Qué datos recopilamos</h2>
              <p>El sitio no tiene formularios, registro ni compras online. Lo único que registramos es:</p>
              <ul>
                <li>
                  <strong>Clics a WhatsApp:</strong> cuando tocás un botón de WhatsApp registramos desde qué sección fue, la página de origen y un identificador
                  anónimo e irreversible (no guardamos tu IP). Sirve para saber qué partes del sitio generan consultas.
                </li>
              </ul>
              <p>
                Lo que nos escribas por WhatsApp, teléfono o email lo usamos solo para responder tu consulta y gestionar tu pedido. No vendemos ni cedemos tus datos.
              </p>
            </section>

            <section>
              <h2>Cookies</h2>
              <p>Este sitio no usa cookies propias. Dos contenidos de terceros pueden usarlas o guardar información en tu navegador:</p>
              <ul>
                <li>
                  <strong>Mapa de Google Maps</strong> en la sección de contacto, sujeto a la política de privacidad de Google.
                </li>
                <li>
                  <strong>Video de YouTube</strong>, embebido en modo de privacidad mejorada (youtube-nocookie.com).
                </li>
              </ul>
              <p>Podés bloquear o borrar estas cookies desde la configuración de tu navegador; el resto del sitio sigue funcionando igual.</p>
            </section>

            <section>
              <h2>Tus derechos</h2>
              <p>
                Según la Ley 25.326 de Protección de Datos Personales podés pedir acceso, rectificación o supresión de tus datos escribiendo a {SITE.email}. La
                Agencia de Acceso a la Información Pública, órgano de control de la ley, atiende las denuncias por incumplimiento de las normas sobre datos
                personales.
              </p>
            </section>

            <section>
              <h2>Cambios</h2>
              <p>Si cambiamos cómo tratamos los datos, vamos a actualizar esta página y la fecha de arriba.</p>
            </section>
          </div>
        </Container>
      </article>
    </>
  );
}
