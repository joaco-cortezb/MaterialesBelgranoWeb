import assert from "node:assert/strict";
import { test } from "node:test";
import { RUBROS } from "../src/config/rubros.ts";
import { IMAGE_SLOT_KEYS } from "../src/config/image-slots.ts";
import { WHATSAPP_SOURCES } from "../src/config/cms.ts";

test("cada rubro tiene un slot de imagen definido y un origen de WhatsApp", () => {
  for (const rubro of RUBROS) {
    assert.ok(IMAGE_SLOT_KEYS.includes(rubro.imageSlot), `falta el slot ${rubro.imageSlot}`);
    assert.ok(
      (WHATSAPP_SOURCES as readonly string[]).includes(`rubro_${rubro.slug}`),
      `falta el origen rubro_${rubro.slug}`,
    );
  }
});

test("las meta descriptions de los rubros no superan 160 caracteres", () => {
  for (const rubro of RUBROS) {
    assert.ok(rubro.seoDescription.length <= 160, `${rubro.slug}: ${rubro.seoDescription.length} caracteres`);
  }
});

test("los slugs de rubro son únicos y URL-safe", () => {
  const slugs = RUBROS.map((rubro) => rubro.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z0-9-]+$/);
});
