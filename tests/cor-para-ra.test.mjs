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

test("as duas bancadas preparam o modelo antes de exportar", async () => {
  for (const app of BANCADAS) {
    const src = await text(app);
    assert.match(src, /import \{ prepararParaRA \} from '\.\.\/cores-para-ra\.js'/, app);
    /* tem de acontecer no CLONE, antes do exportador ver a cena */
    const i = src.indexOf("prepararParaRA(clone)");
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

/* ==========================================================================
   A dupla face também não atravessa

   O exportador de USDZ não escreve `doubleSided` uma única vez — o de glTF
   escreve, o de USDZ não. Peça de dupla face vira face única no iPhone e SOME
   vista do lado de trás: foi o que aconteceu com o miolo da bicamada e com a
   parede do corte. Vale a regra que a bancada já aprendeu para o `BackSide`:
   a face tem de estar na GEOMETRIA, não no material.
   ========================================================================== */

test("nenhuma peça sai da preparação com face que o USDZ não lê", async () => {
  const src = await text("cores-para-ra.js");
  assert.match(src, /o\.material\.side = THREE\.FrontSide;/);
  assert.match(src, /if \(lado === THREE\.BackSide\)/);
});

test("a gêmea nasce fora da travessia", async () => {
  const src = await text("cores-para-ra.js");
  /* acrescentar filho no meio da travessia é pedir para visitar o que acabou
     de nascer, e a gêmea ganharia gêmea */
  assert.match(src, /const aNascer = \[\];/);
  const iEmpurra = src.indexOf("aNascer.push(o)");
  const iUsa = src.indexOf("for (const o of aNascer)");
  assert.ok(iEmpurra > 0 && iUsa > iEmpurra);
});

test("pelo avesso inverte o giro E as normais", async () => {
  const src = await text("cores-para-ra.js");
  /* só inverter o giro deixa a peça iluminada ao contrário */
  assert.match(src, /a\[i\] = a\[i \+ 2\]/);
  assert.match(src, /n\.setXYZ\(i, -n\.getX\(i\), -n\.getY\(i\), -n\.getZ\(i\)\)/);
});

test("a dupla face é resolvida depois da paleta", async () => {
  const src = await text("cores-para-ra.js");
  /* a gêmea tem de nascer com o UV já assado, senão sai branca */
  const iPaleta = src.indexOf("conta.assadas++");
  /* a CHAMADA, nao a definicao: esta vem antes no arquivo */
  const iFaces = src.lastIndexOf("duasFaces(raiz, conta)");
  assert.ok(iPaleta > 0 && iFaces > iPaleta);
});
