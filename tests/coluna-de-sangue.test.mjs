import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const text = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");

/* ==========================================================================
   Teste 08 — A coluna de sangue (retorno venoso, Unidade IV)

   A bancada em que o SENSOR é a fisiologia. As asserções abaixo guardam as
   decisões que, se quebrarem, quebram em silêncio: a leitura fica plausível e
   o número fica errado.
   ========================================================================== */

test("o card 08 leva à coluna de sangue", async () => {
  const hub = await text("bancadas.html");
  assert.match(hub, /data-number="08"/);
  assert.match(hub, /href="retorno-venoso\/"/);
  assert.match(hub, /A coluna de sangue/);
});

test("a bancada está protegida e traz o mesmo caminho de RA das irmãs", async () => {
  const page = await text("retorno-venoso/index.html");
  assert.match(page, /data-ra-protected/);
  assert.match(page, /\.\.\/guard\.js/);
  assert.match(page, /ar-modes="webxr scene-viewer quick-look"/);
  assert.match(page, /ar-scale="fixed"/);
});

test("a inclinação sai só de beta e gamma, nunca de alpha", async () => {
  /* alpha é rumo de bússola: exige calibração, oscila e castiga o iPhone.
     Esta bancada é possível porque depende só da GRAVIDADE. */
  const app = await text("retorno-venoso/app.js");
  assert.match(app, /Math\.cos\(g2r\(beta\)\) \* Math\.cos\(g2r\(gamma\)\)/);
  const corpo = app.slice(app.indexOf("export function inclinacaoDe"), app.indexOf("let grauAlvo"));
  assert.ok(!/alpha/.test(corpo), "alpha não pode entrar na conta da inclinação");
});

test("de bruços também é decúbito", async () => {
  /* beta 180 passa de 90 e voltaria a 'em pé' sem o espelhamento */
  const app = await text("retorno-venoso/app.js");
  assert.match(app, /return t > 90 \? 180 - t : t;/);
});

test("o cursor existe desde o primeiro segundo", async () => {
  /* quem está no computador, quem negou a permissão e quem ainda não tocou em
     'Permitir' precisam poder mexer — prender a bancada ao sensor já foi erro
     na Janela do Norte */
  const page = await text("retorno-venoso/index.html");
  assert.match(page, /id="grauCursor"[^>]*type="range"/);
  assert.ok(!/id="grauCursor"[^>]*hidden/.test(page));
});

test("a permissão do iOS é pedida dentro de um gesto", async () => {
  const app = await text("retorno-venoso/app.js");
  const i = app.indexOf("$('permitir').onclick");
  const j = app.indexOf("DeviceOrientationEvent.requestPermission()");
  assert.ok(i > 0 && j > i, "requestPermission tem de estar dentro do onclick");
});

test("a pressão cai de rho*g*h, e não de número chumbado", async () => {
  const m = await text("retorno-venoso/modelos.js");
  assert.match(m, /MMHG_POR_CM = 1060 \* 9\.81 \* 0\.01 \/ 133\.3/);
  assert.match(m, /\(PIH - alturaCm\) \* MMHG_POR_CM \* sen/);
  /* o ponto indiferente é o diafragma, não o coração: usar o coração erra o
     sinal acima dele e some com a jugular colabada */
  assert.match(m, /export const PIH = CORPO\.diafragma;/);
});

test("uma lei só de distensão serve ao desenho e à conta", async () => {
  const m = await text("retorno-venoso/modelos.js");
  assert.match(m, /export function fatorDeDistensao/);
  /* moldar a veia e somar o volume têm de chamar a MESMA função: engrossar
     para aparecer e medir por outra régua seria a mentira que a bancada
     existe para não contar */
  const usos = m.match(/fatorDeDistensao\(/g);
  assert.ok(usos && usos.length >= 3, `fatorDeDistensao usada ${usos ? usos.length : 0}x`);
});

test("o volume é ancorado no repouso medido, e o resto é previsão", async () => {
  const m = await text("retorno-venoso/modelos.js");
  assert.match(m, /VOL_REPOUSO_PERNAS = 600/);
  /* o calibre DESENHADO não pode entrar na conta de volume, senão o exagero
     do desenho vira mililitro: com ele, o modelo previa 7.314 ml */
  const bloco = m.slice(m.indexOf("function somaArea"), m.indexOf("const AREA0"));
  assert.ok(!/raioBase/.test(bloco), "raioBase não pode entrar em somaArea");
});

test("a cor da pressão é montada em sRGB", async () => {
  /* THREE.Color lê linear por padrão: entregar frações de sRGB clareia tudo e
     a veia em repouso sai branca */
  const m = await text("retorno-venoso/modelos.js");
  assert.match(m, /setRGB\([\s\S]{0,300}THREE\.SRGBColorSpace\)/);
});

test("a veia colabada não anuncia pressão negativa", async () => {
  const app = await text("retorno-venoso/app.js");
  assert.match(app, /jugularColabada \? 'colabada'/);
});

test("a bancada abre parada, pelo endereço", async () => {
  /* o painel do navegador congela o laço: sem isto nada aqui é conferível */
  const app = await text("retorno-venoso/app.js");
  assert.match(app, /busca\.get\('nivel'\)/);
  assert.match(app, /busca\.get\('grau'\)/);
});

test("o modelo da RA leva a postura que está na tela", async () => {
  const app = await text("retorno-venoso/app.js");
  const i = app.indexOf("clone.rotation.z = g2r(90 - grau)");
  const j = app.indexOf("new GLTFExporter().parseAsync");
  assert.ok(i > 0 && j > i);
  assert.match(app, /prepararParaRA\(clone\)/);
});
