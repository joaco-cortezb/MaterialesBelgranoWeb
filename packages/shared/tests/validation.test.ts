import { test } from "node:test";
import assert from "node:assert/strict";
import { isSafeImageUrl, isSafeLocalPath } from "../src/schemas.ts";
import { splitParagraphs } from "../src/config/cms.ts";

test("rutas locales seguras", () => {
  assert.equal(isSafeLocalPath("/marcas"), true);
  assert.equal(isSafeLocalPath("/go/whatsapp/inicio"), true);
  assert.equal(isSafeLocalPath("//evil.com"), false);
  assert.equal(isSafeLocalPath("/\\evil.com"), false);
  assert.equal(isSafeLocalPath("javascript:alert(1)"), false);
});

test("imágenes: sólo archivos de la web o el Storage de Supabase", () => {
  assert.equal(isSafeImageUrl(""), true);
  assert.equal(isSafeImageUrl("/images/banners/tienda-online.webp"), true);
  assert.equal(isSafeImageUrl("https://abc.supabase.co/storage/v1/object/public/media/slots/x.webp"), true);
  assert.equal(isSafeImageUrl("https://evil.com/x.png"), false);
  assert.equal(isSafeImageUrl("https://abc.supabase.co/rest/v1/x"), false);
  assert.equal(isSafeImageUrl("data:image/png;base64,AAAA"), false);
});

test("párrafos: cada renglón es un párrafo, sin vacíos", () => {
  assert.deepEqual(splitParagraphs("Uno\n\n  \nDos\r\nTres"), ["Uno", "Dos", "Tres"]);
  assert.deepEqual(splitParagraphs("   "), []);
});
