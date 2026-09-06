import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const text = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");

/* ==========================================================================
   A porta de acesso (guard.js)

   O defeito que estas asserções guardam custou um diagnóstico inteiro: cinco
   links com `?nivel=` diferentes foram abertos e todos viraram a MESMA página,
   porque o login descartava o endereço pedido e mandava todo mundo para
   bancadas.html. Perder o endereço é pior que dar erro — a pessoa chega numa
   página que existe e não desconfia de nada.
   ========================================================================== */

test("o desvio para o login carrega o endereço pedido", async () => {
  const guard = await text("guard.js");
  assert.match(guard, /destino=" \+ encodeURIComponent\(location\.href\)/);
});

test("o login volta ao endereço pedido, e ele vem antes do padrão", async () => {
  const guard = await text("guard.js");
  /* `destinoPedido()` tem de ser o PRIMEIRO da cadeia nos dois caminhos: o de
     quem já estava liberado e o de quem acabou de entrar. */
  const voltas = guard.match(/destinoPedido\(\) \|\| form\.dataset\.destination \|\| bancadasUrl/g);
  assert.equal(voltas?.length, 2);
});

test("a porta não é ponte: destino de fora do laboratório é recusado", async () => {
  const guard = await text("guard.js");
  assert.match(guard, /alvo\.href\.startsWith\(raizUrl\)/);
});

test("destino apontando para o próprio login é recusado, senão vira laço", async () => {
  const guard = await text("guard.js");
  assert.match(guard, /alvo\.pathname === new URL\(authUrl\)\.pathname/);
});

test("as bancadas continuam protegidas", async () => {
  for (const pagina of ["musculo-sarcomero/index.html", "potencial-membrana/index.html"]) {
    assert.match(await text(pagina), /data-ra-protected/, pagina);
  }
});
