import assert from "node:assert/strict";
import { test } from "node:test";
import { RUBROS, seedCategories } from "../src/config/rubros.ts";
import { isWhatsappSource, rubroSlugFromSource, whatsappSourceLabel } from "../src/config/cms.ts";
import { categorySchema } from "../src/schemas.ts";

test("las meta descriptions iniciales no superan 160 caracteres", () => {
  for (const rubro of RUBROS) {
    assert.ok(rubro.seoDescription.length <= 160, `${rubro.slug}: ${rubro.seoDescription.length} caracteres`);
  }
});

test("los slugs iniciales son únicos y URL-safe", () => {
  const slugs = RUBROS.map((rubro) => rubro.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z0-9-]+$/);
});

test("cada solución inicial pasa la validación del panel", () => {
  for (const category of seedCategories()) {
    const parsed = categorySchema.safeParse({
      ...category,
      description: category.description.join("\n\n"),
      subcategories: category.subcategories.join("\n"),
      faqs: JSON.stringify(category.faqs),
      active: "on",
    });
    assert.ok(parsed.success, `${category.slug}: ${parsed.success ? "" : parsed.error.issues[0]?.message}`);
  }
});

test("orígenes de WhatsApp: fijos y por solución", () => {
  assert.ok(isWhatsappSource("inicio"));
  assert.ok(isWhatsappSource("rubro_iluminacion"));
  assert.ok(!isWhatsappSource("rubro_../x"));
  assert.ok(!isWhatsappSource("cualquiera"));
  assert.equal(rubroSlugFromSource("rubro_camaras"), "camaras");
  assert.equal(whatsappSourceLabel("rubro_iluminacion", { iluminacion: "Iluminación" }), "Solución: Iluminación");
  assert.equal(whatsappSourceLabel("header"), "Menú");
});
