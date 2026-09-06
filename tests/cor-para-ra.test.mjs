import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const text = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const BANCADAS = ["musculo-sarcomero/app.js", "potencial-membrana/app.js"];

/* ==========================================================================
   Cor fiel na realidade aumentada

   O USDZ não carrega cor por vértice: sem a paleta, cada malha pintada assim
   chega BRANCA no iPhone — 82% dos triângulos no nível 03 da película. As
   asserções abaixo guardam as três decisões que fazem a paleta funcionar, e
   todas têm medida por trás.
   ========================================================================== */

test("as duas bancadas assam a cor antes de exportar", async () => {
  for (const app of BANCADAS) {
    const src = await text(app);
    assert.match(src, /import \{ corParaRA \} from '\.\.\/cores-para-ra\.js'/, app);
    /* tem de acontecer no CLONE, antes do exportador ver a cena */
    const i = src.indexOf("corParaRA(clone)");
    const j = src.indexOf("new GLTFExporter().parseAsync");
    assert.ok(i > 0 && j > i, app);
  }
});

test("a paleta usa bloco e filtro que não deixam a cor vazar", async () => {
  const src = await text("cores-para-ra.js");
  /* Um texel solto fica à mercê do vizinho quando o aparelho escolhe filtrar;
     o bloco 4x4 faz bilinear e mipmap raso devolverem a mesma cor. */
  assert.match(src, /const BLOCO = 4;/);
  assert.match(src, /NearestFilter/);
  assert.match(src, /generateMipmaps = false/);
});

test("a textura vai em sRGB e sem espelhar", async () => {
  const src = await text("cores-para-ra.js");
  /* A cor do vértice está em espaço linear e a textura é lida como sRGB: a
     conversão tem de estar aqui. E sem flipY=false o UV cai no bloco
     espelhado — cada peça sairia com a cor de outra. */
  assert.match(src, /getHex\(THREE\.SRGBColorSpace\)/);
  assert.match(src, /colorSpace = THREE\.SRGBColorSpace/);
  assert.match(src, /flipY = false/);
});

test("nada é alterado sem clonar antes", async () => {
  const src = await text("cores-para-ra.js");
  /* `clone(true)` compartilha geometria e material com a cena da tela:
     mexer sem clonar apagaria a cor da bancada em uso. */
  assert.match(src, /o\.geometry = o\.geometry\.clone\(\)/);
  assert.match(src, /o\.material = o\.material\.clone\(\)/);
});

test("malha com textura própria não perde o UV para a paleta", async () => {
  const src = await text("cores-para-ra.js");
  assert.match(src, /if \(pinta && temMapa\(o\.material\)\)/);
  assert.match(src, /conta\.tingidas\+\+/);
});
