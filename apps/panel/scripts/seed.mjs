import { createClient } from "@supabase/supabase-js";
import { BRANDS_SEED } from "@mb/shared";

/**
 * Carga inicial, idempotente: marcas del brief, el número de WhatsApp de
 * respaldo y el primer usuario del panel.
 *
 *   PANEL_ADMIN_EMAIL=... PANEL_ADMIN_PASSWORD=... pnpm db:seed
 *
 * Usa la REST API de Supabase con la service role (no necesita DATABASE_URL),
 * así que sirve también cuando la contraseña de Postgres no está a mano.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRole) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } });
const now = new Date().toISOString();
const cuid = () => `c${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;

// Marcas (por slug, sin pisar las que ya existen).
const { data: existingBrands, error: brandsReadError } = await supabase.from("Brand").select("slug");
if (brandsReadError) throw brandsReadError;
const existingSlugs = new Set((existingBrands ?? []).map((row) => row.slug));
const newBrands = BRANDS_SEED.filter((brand) => !existingSlugs.has(brand.slug)).map((brand) => ({
  id: cuid(),
  name: brand.name,
  slug: brand.slug,
  catalogUrl: brand.catalogUrl,
  rubroSlug: brand.rubroSlug,
  order: brand.order,
  active: true,
  updatedAt: now,
}));
if (newBrands.length > 0) {
  const { error } = await supabase.from("Brand").insert(newBrands);
  if (error) throw error;
}
console.log(`Marcas: ${newBrands.length} nuevas, ${existingSlugs.size} existentes.`);

// Número de WhatsApp inicial.
const { count: numbersCount } = await supabase.from("WhatsappNumber").select("id", { count: "exact", head: true });
if (!numbersCount) {
  const { error } = await supabase.from("WhatsappNumber").insert({
    id: cuid(),
    label: "Ventas",
    phone: "5492615330777",
    message: "Hola, vengo de la web de Materiales Belgrano y quiero hacer una consulta.",
    audience: "GENERAL",
    order: 0,
    active: true,
    updatedAt: now,
  });
  if (error) throw error;
  console.log("WhatsApp: número inicial creado (TODO cliente: confirmar).");
}

// Primer usuario del panel.
const email = process.env.PANEL_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.PANEL_ADMIN_PASSWORD;
if (email && password) {
  const { data: list } = await supabase.auth.admin.listUsers({ perPage: 200 });
  let user = list?.users.find((item) => item.email?.toLowerCase() === email);
  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw error;
    user = data.user;
    console.log(`Auth: usuario ${email} creado.`);
  } else {
    console.log(`Auth: usuario ${email} ya existía.`);
  }
  const { error } = await supabase.from("Profile").upsert({ id: user.id, email, role: "ADMIN" }, { onConflict: "id" });
  if (error) throw error;
  console.log("Profile: acceso ADMIN asegurado.");
} else {
  console.log("Sin PANEL_ADMIN_EMAIL/PANEL_ADMIN_PASSWORD: no se crea usuario.");
}
