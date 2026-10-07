/**
 * Rubros de la casa. Son las páginas clave para SEO/GEO/AEO, así que viven en
 * código y no en el panel: el panel administra sus imágenes (slots) y las
 * marcas asociadas, no el texto.
 *
 * Las subcategorías salen del brief del cliente (sección 2). Las FAQ están
 * escritas como respuestas directas y citables (40-60 palabras), que es lo que
 * extraen los motores de IA.
 */
export type Faq = { question: string; answer: string };

export type Rubro = {
  slug: string;
  name: string;
  /** Título corto para menús y cards. */
  shortName: string;
  /** `<title>` de la página (sin el sufijo de marca). */
  seoTitle: string;
  /** Meta description (≤160 caracteres). */
  seoDescription: string;
  /** Bajada de una línea para cards e índice. */
  summary: string;
  /** Párrafos descriptivos de la página. El primero es la definición directa. */
  description: string[];
  subcategories: string[];
  faqs: Faq[];
  /** Mensaje precargado de WhatsApp para este rubro. */
  whatsappMessage: string;
  /** Slot de imagen que administra el panel. */
  imageSlot: string;
};

export const RUBROS: readonly Rubro[] = [
  {
    slug: "materiales-electricos",
    name: "Materiales eléctricos",
    shortName: "Eléctricos",
    seoTitle: "Materiales eléctricos en Mendoza",
    seoDescription:
      "Cables, cañerías, tableros, protecciones y accesorios eléctricos en Mendoza. Stock para instaladores, empresas y hogar. Entrega en 24 hs. Consultá por WhatsApp.",
    summary: "Cables, cañerías, tableros, protecciones y todo lo que lleva una instalación domiciliaria o industrial.",
    description: [
      "Materiales Belgrano es una casa de materiales eléctricos en Godoy Cruz, Mendoza, con stock permanente de cables, cañerías, tableros, protecciones y accesorios para instalaciones domiciliarias e industriales. Vendemos a instaladores, empresas, constructoras y consumidor final, con entrega en 24 hs en Mendoza, San Juan y San Luis.",
      "Trabajamos tres rangos de precio en la mayoría de las líneas, con proveedores que responden ante fallas y devoluciones. Si tenés una obra en marcha, pasanos el listado por WhatsApp y te cotizamos todo junto en minutos.",
    ],
    subcategories: [
      "Cables y cañerías",
      "Tableros y gabinetes",
      "Electricidad domiciliaria: protecciones, llaves de luz, cajas",
      "Electricidad industrial: protecciones de potencia, comando, señalización y control",
    ],
    faqs: [
      {
        question: "¿Venden materiales eléctricos por cantidad para obras?",
        answer:
          "Sí. Cotizamos listados completos de obra por WhatsApp y entregamos en el domicilio de la empresa o directamente en obra. Para pedidos grandes conviene avisar con 24 hs de anticipación, así preparamos todo y pedimos lo que no tengamos en stock.",
      },
      {
        question: "¿Qué marcas de cables y protecciones trabajan?",
        answer:
          "Trabajamos marcas reconocidas del mercado eléctrico argentino como Schneider Electric y Chint en protecciones, Kalop y Cables MH en cables, y Genrod y Conextube en canalizaciones. La lista completa está en la página de marcas, con el catálogo de cada fabricante.",
      },
      {
        question: "¿Hacen envíos de materiales eléctricos fuera de Mendoza?",
        answer:
          "Sí. Con transporte propio entregamos en 24 hs en Mendoza, San Juan y San Luis. Al resto del país enviamos por Andreani. Consultanos el costo y el plazo por WhatsApp antes de confirmar el pedido.",
      },
    ],
    whatsappMessage: "Hola, vengo de la web de Materiales Belgrano. Quiero consultar por materiales eléctricos.",
    imageSlot: "rubros.materiales-electricos.hero",
  },
  {
    slug: "iluminacion",
    name: "Iluminación",
    shortName: "Iluminación",
    seoTitle: "Iluminación LED y de diseño en Mendoza",
    seoDescription:
      "Iluminación profesional, interior, exterior y de diseño en Mendoza. Luminarias LED, tiras, lámparas y proyectos. Marcas como Macroled, Leuk y 180°. Consultá por WhatsApp.",
    summary: "Luminarias profesionales, iluminación integrada, exterior y jardín, lámparas, tubos y tiras LED.",
    description: [
      "En Materiales Belgrano encontrás iluminación LED para proyectos profesionales, iluminación integrada para interiores, luminarias de exterior y jardín, y lámparas, tubos y tiras LED de alta rotación. Nuestro salón en Godoy Cruz, Mendoza, tiene exhibición de marcas de diseño como Leuk y 180° para que veas las luminarias encendidas antes de elegir.",
      "Si estás armando un proyecto de iluminación para una obra, un local o una casa, traé el plano o mandanos fotos por WhatsApp: te ayudamos a elegir la solución y te la cotizamos completa.",
    ],
    subcategories: [
      "Iluminación profesional y proyectos",
      "Iluminación integrada interior",
      "Iluminación de exterior y jardín",
      "Lámparas, tubos y tiras LED",
      "Iluminación solar",
    ],
    faqs: [
      {
        question: "¿Asesoran para elegir la iluminación de una casa o un local?",
        answer:
          "Sí. Nuestro equipo asesora en el salón o por WhatsApp sobre temperatura de color, potencia y tipo de luminaria según el ambiente. Para proyectos más grandes podés mandarnos el plano y te proponemos una solución completa con presupuesto.",
      },
      {
        question: "¿Qué marcas de iluminación venden?",
        answer:
          "Trabajamos Macroled para iluminación LED de alta rotación, Leuk y 180° para iluminación de diseño, y Litex para iluminación solar, entre otras. En la página de marcas está el catálogo de cada fabricante para que elijas el modelo exacto.",
      },
      {
        question: "¿Tienen stock de luminarias para entrega inmediata?",
        answer:
          "Sí. Mantenemos stock permanente de las líneas de mayor rotación: lámparas, tubos, paneles, tiras y luminarias de exterior. Los productos de diseño o de proyecto se piden al fabricante cuando no están en stock; te decimos el plazo al cotizar.",
      },
    ],
    whatsappMessage: "Hola, vengo de la web de Materiales Belgrano. Quiero consultar por iluminación.",
    imageSlot: "rubros.iluminacion.hero",
  },
  {
    slug: "maquinas-y-herramientas",
    name: "Máquinas y herramientas",
    shortName: "Herramientas",
    seoTitle: "Máquinas y herramientas para electricistas en Mendoza",
    seoDescription:
      "Herramientas de mano, a batería y eléctricas, consumibles e instrumental de medición en Mendoza. Marcas Jadever y DCK. Stock para instaladores y empresas.",
    summary: "Herramientas de mano, a batería y eléctricas, consumibles e instrumental de medición.",
    description: [
      "Materiales Belgrano vende máquinas y herramientas para instaladores electricistas, empresas y uso doméstico en Mendoza: herramientas de mano y consumibles, herramientas a batería y eléctricas, e instrumental de medición. Trabajamos marcas como Jadever y DCK, con respaldo del fabricante ante fallas.",
      "Es una de las líneas que más crece en la casa porque el instalador encuentra en un mismo lugar el material y la herramienta para la obra.",
    ],
    subcategories: [
      "Herramientas de mano y consumibles",
      "Herramientas a batería",
      "Herramientas eléctricas",
      "Instrumental de medición",
    ],
    faqs: [
      {
        question: "¿Qué herramientas a batería tienen para electricistas?",
        answer:
          "Trabajamos líneas a batería de Jadever y DCK: atornilladores, taladros, amoladoras y kits para instaladores. Si buscás un modelo puntual, consultá por WhatsApp y te confirmamos stock y precio en el momento.",
      },
      {
        question: "¿Venden instrumental de medición como pinzas amperométricas y testers?",
        answer:
          "Sí. Tenemos pinzas amperométricas, multímetros, buscapolos y otros instrumentos de medición para instaladores. Consultá por WhatsApp el modelo que necesitás y te confirmamos disponibilidad.",
      },
    ],
    whatsappMessage: "Hola, vengo de la web de Materiales Belgrano. Quiero consultar por máquinas y herramientas.",
    imageSlot: "rubros.maquinas-y-herramientas.hero",
  },
  {
    slug: "dispositivos-smart",
    name: "Dispositivos smart",
    shortName: "Smart",
    seoTitle: "Dispositivos smart y domótica en Mendoza",
    seoDescription:
      "Dispositivos inteligentes wifi para el hogar y la empresa en Mendoza: medición y control, cerraduras smart y automatización. Consultá por WhatsApp.",
    summary: "Accesorios de medición y control wifi, cerraduras inteligentes y automatización.",
    description: [
      "En Materiales Belgrano vendemos dispositivos smart para el hogar y la empresa en Mendoza: accesorios de medición y control por wifi, cerraduras inteligentes y productos de automatización que se integran a la instalación eléctrica.",
      "Es una línea en crecimiento: si tenés un proyecto de domótica o querés automatizar un ambiente, contanos qué necesitás por WhatsApp y te orientamos con lo que tenemos en stock.",
    ],
    subcategories: ["Accesorios de medición y control wifi", "Cerraduras inteligentes"],
    faqs: [
      {
        question: "¿Qué dispositivos smart venden?",
        answer:
          "Vendemos accesorios de medición y control por wifi (tomas, interruptores y módulos inteligentes) y cerraduras smart. Son productos que se instalan sobre la instalación eléctrica existente y se manejan desde el celular. Consultá por WhatsApp los modelos disponibles.",
      },
    ],
    whatsappMessage: "Hola, vengo de la web de Materiales Belgrano. Quiero consultar por dispositivos smart.",
    imageSlot: "rubros.dispositivos-smart.hero",
  },
  {
    slug: "camaras-y-videovigilancia",
    name: "Cámaras y videovigilancia",
    shortName: "Cámaras",
    seoTitle: "Cámaras de seguridad y videovigilancia en Mendoza",
    seoDescription:
      "Cámaras de seguridad, videoporteros y accesorios de videovigilancia en Mendoza. Marca Uniview. Para obras, comercios y hogares. Consultá por WhatsApp.",
    summary: "Cámaras de seguridad, videoporteros y accesorios para obras, comercios y hogares.",
    description: [
      "Materiales Belgrano vende cámaras de seguridad, videoporteros y accesorios de videovigilancia en Mendoza, con la marca Uniview como línea principal. Hoy prácticamente toda obra lleva cámaras, así que el instalador encuentra en la casa el material eléctrico y el sistema de videovigilancia juntos.",
      "Si estás instalando cámaras en una obra, un comercio o una casa, mandanos por WhatsApp qué necesitás cubrir y te cotizamos el kit completo.",
    ],
    subcategories: ["Cámaras de seguridad", "Videoporteros", "Grabadores y accesorios"],
    faqs: [
      {
        question: "¿Qué marca de cámaras de seguridad trabajan?",
        answer:
          "Trabajamos Uniview, una marca internacional de videovigilancia con cámaras IP, grabadores y accesorios para obras, comercios y hogares. Consultá por WhatsApp y te armamos el kit según la cantidad de cámaras y el tipo de instalación.",
      },
      {
        question: "¿Venden videoporteros?",
        answer:
          "Sí. Tenemos videoporteros para casas y edificios, además de cámaras y grabadores. Es una de las líneas que estamos impulsando este año, así que si no ves el modelo que buscás, consultanos y lo pedimos al fabricante.",
      },
    ],
    whatsappMessage: "Hola, vengo de la web de Materiales Belgrano. Quiero consultar por cámaras y videovigilancia.",
    imageSlot: "rubros.camaras-y-videovigilancia.hero",
  },
] as const;

export const RUBRO_SLUGS = RUBROS.map((rubro) => rubro.slug);

export function findRubro(slug: string): Rubro | undefined {
  return RUBROS.find((rubro) => rubro.slug === slug);
}
