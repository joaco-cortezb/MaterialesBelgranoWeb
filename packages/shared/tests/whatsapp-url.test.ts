import assert from "node:assert/strict";
import { test } from "node:test";
import {
  composeWhatsappMessage,
  formatWhatsappPhone,
  normalizeWhatsappPhone,
  whatsappUrl,
} from "../src/lib/whatsapp-url.ts";
import { safeExternalUrl, youtubeVideoId } from "../src/lib/safe-url.ts";

test("normaliza el teléfono a dígitos", () => {
  assert.equal(normalizeWhatsappPhone("+54 9 261 533-0777"), "5492615330777");
});

test("arma el link de wa.me con el mensaje codificado", () => {
  const url = whatsappUrl("54 9 261 533 0777", "Hola, vengo de la web");
  assert.equal(url, "https://wa.me/5492615330777?text=Hola%2C+vengo+de+la+web");
});

test("sin mensaje no agrega `text`", () => {
  assert.equal(whatsappUrl("5492615330777"), "https://wa.me/5492615330777");
});

test("formatea un número argentino para mostrar", () => {
  assert.equal(formatWhatsappPhone("5492615330777"), "+54 9 261 533-0777");
});

test("compone el mensaje con el origen", () => {
  assert.equal(composeWhatsappMessage("Hola", "Iluminación"), "Hola (Iluminación)");
  assert.equal(composeWhatsappMessage("", "Inicio"), "Hola, vengo de la web de Materiales Belgrano (Inicio).");
});

test("sólo acepta https sin credenciales", () => {
  assert.equal(safeExternalUrl("http://ejemplo.com"), null);
  assert.equal(safeExternalUrl("https://user:pw@ejemplo.com"), null);
  assert.equal(safeExternalUrl("https://ejemplo.com/catalogo"), "https://ejemplo.com/catalogo");
});

test("extrae el id de YouTube en sus formatos habituales", () => {
  assert.equal(youtubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(youtubeVideoId("https://youtu.be/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(youtubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(youtubeVideoId("https://vimeo.com/123"), null);
});
