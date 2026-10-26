import { DEFAULT_ABOUT_BODY, DEFAULT_ABOUT_HEADLINE, SETTING_KEYS } from "@mb/shared";
import { prisma } from "@/lib/prisma";
import { requireSectionView } from "@/lib/auth";
import { canManageSection } from "@/lib/permissions";
import { PageHeader } from "@/components/ui";
import { loadWhatsappSlots } from "../whatsapp/data";
import { WhatsappSlots } from "../whatsapp/WhatsappBoard";
import { AboutForm } from "./AboutForm";
import { NosotrosPhotos, type PhotoValue } from "./NosotrosPhotos";

export const dynamic = "force-dynamic";

/** Todo lo que se ve en la página Nosotros de la web: historia, fotos y contacto por WhatsApp. */
export default async function NosotrosPage() {
  const profile = await requireSectionView("nosotros");

  // Sin nada guardado se precarga el texto por defecto: es el que hoy muestra la web.
  let headline = "";
  let body = "";
  let saved = false;
  let photos: Record<string, PhotoValue> = {};
  try {
    const [rows, slots] = await Promise.all([
      prisma.setting.findMany({ where: { key: { in: [SETTING_KEYS.aboutHeadline, SETTING_KEYS.aboutBody] } } }),
      prisma.imageSlot.findMany({ select: { key: true, url: true, alt: true, position: true } }),
    ]);
    for (const row of rows) {
      if (row.key === SETTING_KEYS.aboutHeadline && typeof row.value === "string") headline = row.value;
      if (row.key === SETTING_KEYS.aboutBody && typeof row.value === "string") body = row.value;
      saved = true;
    }
    photos = Object.fromEntries(slots.map((slot) => [slot.key, { url: slot.url, alt: slot.alt, position: slot.position ?? "50% 50%" }]));
  } catch (error) {
    console.error("No se pudo leer Nosotros", error);
  }
  const whatsapp = await loadWhatsappSlots();

  return (
    <div>
      <PageHeader title="Nosotros" subtitle="Todo lo que se ve en la página Nosotros: la historia, las fotos del negocio y los números de WhatsApp de Contacto." />

      <section aria-labelledby="historia-title">
        <h2 id="historia-title" className="mb-4 text-lg font-bold text-ink">
          Historia
        </h2>
        <AboutForm initialHeadline={headline.trim() || DEFAULT_ABOUT_HEADLINE} initialBody={body.trim() || DEFAULT_ABOUT_BODY} saved={saved} />
      </section>

      <section id="fotos" aria-labelledby="fotos-title" className="mt-10 scroll-mt-6">
        <h2 id="fotos-title" className="mb-4 text-lg font-bold text-ink">
          Fotos del negocio
        </h2>
        <NosotrosPhotos values={photos} canManage={canManageSection(profile.role, "imagenes")} />
      </section>

      <section id="whatsapp" aria-labelledby="whatsapp-title" className="mt-10 scroll-mt-6">
        <h2 id="whatsapp-title" className="mb-1 text-lg font-bold text-ink">
          WhatsApp
        </h2>
        <p className="mb-4 text-sm text-ink-soft">Los dos números de la web: uno para ventas y otro para mayoristas.</p>
        <WhatsappSlots slots={whatsapp} canManage={canManageSection(profile.role, "whatsapp")} />
      </section>
    </div>
  );
}
