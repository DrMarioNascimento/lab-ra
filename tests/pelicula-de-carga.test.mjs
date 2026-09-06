import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const text = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");

/* ==========================================================================
   Teste 07 — A película de carga (potencial de membrana, Unidade I)

   As asserções abaixo guardam defeitos que JÁ aconteceram nesta bancada e nas
   irmãs. Nenhuma delas é decorativa: cada uma tem uma foto por trás.
   ========================================================================== */

test("o card 07 leva à película de carga", async () => {
  const hub = await text("bancadas.html");
  assert.match(hub, /data-number="07"/);
  assert.match(hub, /href="potencial-membrana\/"/);
  assert.match(hub, /A película de carga/);
});

test("a bancada da película está protegida como as outras", async () => {
  const page = await text("potencial-membrana/index.html");
  assert.match(page, /data-ra-protected/);
  assert.match(page, /\.\.\/guard\.js/);
  assert.match(page, /ar-modes="webxr scene-viewer quick-look"/);
  assert.match(page, /ar-scale="fixed"/);
});

test("a inversão de face está na geometria, não no material", async () => {
  /* `side: THREE.BackSide` funciona só no navegador: o glTF não tem esse
     conceito, o exportador grava `doubleSided:false` e o visualizador de RA
     desenha a face da frente. A casca voltaria inteira justamente no aparelho
     — e a conferência no desktop não mostraria. Foi o que custou caro no
     músculo; aqui a inversão é `peloAvesso()`, que vira índices e normais. */
  const modelos = await text("potencial-membrana/modelos.js");
  assert.match(modelos, /function peloAvesso/);
  /* sem os comentários: o cabeçalho do arquivo CITA a armadilha pelo nome, e
     uma busca crua acusaria justamente o texto que explica por que ela não
     está lá */
  const codigo = modelos.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert.doesNotMatch(codigo, /THREE\.BackSide/, "voltou BackSide, que não sobrevive ao glTF");
});

test("todo estado desta página se alcança parado", async () => {
  /* O Browser pane roda a aba como oculta e o requestAnimationFrame desenha o
     primeiro quadro e para. Uma página cujo estado interessante só se alcança
     por animação não é conferível — e esta tem dois eixos animados, o
     mergulho entre níveis e a onda. Daí as duas portas de entrada. */
  const app = await text("potencial-membrana/app.js");
  assert.match(app, /busca\.get\('nivel'\)/, "sumiu a entrada direta por nível");
  assert.match(app, /busca\.get\('ms'\)/, "sumiu a entrada direta por instante do disparo");
  assert.match(app, /function irAoInstante/);
  assert.match(app, /renderer\.render\(scene, camera\)/,
    "o cursor precisa desenhar na hora: o laço pode estar congelado");
});

test("a física é a de mamífero, e a conta da película é feita ao vivo", async () => {
  const app = await text("potencial-membrana/app.js");

  /* Concentrações e o fator RT/F a 37 °C em log10. Trocar qualquer um destes
     números muda todos os valores que a página ensina. */
  assert.match(app, /K:\s*\{\s*i:\s*140,\s*o:\s*4\s*\}/);
  assert.match(app, /Na:\s*\{\s*i:\s*12,\s*o:\s*145\s*\}/);
  assert.match(app, /Cl:\s*\{\s*i:\s*6,\s*o:\s*116\s*\}/);
  assert.match(app, /RTF\s*=\s*61\.5/);

  /* A conta que desfaz o erro de concepção: capacitância de bicamada e
     Faraday. Chumbar "1 em 160 mil" no texto seria número que ninguém
     confere — e que ficaria errado assim que alguém mexesse no diâmetro. */
  assert.match(app, /F\s*=\s*96485/);
  assert.match(app, /CM\s*=\s*1e-6/);
  assert.match(app, /function contagem/);
  const html = await text("potencial-membrana/index.html");
  assert.doesNotMatch(html, /1 íon em cada 1[0-9]{2}[. ]?[0-9]{3}/,
    "a conta voltou a ser texto fixo em vez de ser calculada");
});

test("a película obedece a uma regra só, e ela é a do sinal", async () => {
  /* A face de dentro carrega o sinal de Em e a de fora o oposto; um íon só
     entra na película da SUA face. Se esta regra se partir em casos, a
     inversão no pico deixa de ser consequência e vira animação. */
  const modelos = await text("potencial-membrana/modelos.js");
  assert.match(modelos, /const precisa = c\.lado > 0 \? s : -s;/);
  assert.match(modelos, /return c\.z === precisa \? mag : 0;/);
  /* e o volume nunca pode esvaziar de um sinal: sem a população fixa, a
     página passaria a ensinar que o citoplasma inteiro se carrega */
  assert.match(modelos, /function fixar/);
  assert.match(modelos, /const parado = \[/);
});

test("o nível 04 mostra as quatro travessias, e a difusão simples não ganha buraco", async () => {
  const modelos = await text("potencial-membrana/modelos.js");

  /* As quatro maneiras de atravessar a membrana, cada uma com sua peça — e a
     primeira sem peça nenhuma. Se alguém abrir um buraco no posto da difusão
     simples "para ficar simétrico", o nível passa a ensinar que atravessar o
     lipídio exige proteína, que é o contrário do que ele existe para dizer. */
  /* sem quantificador aninhado: `([^\]]*\])+` numa linha longa faz o motor
     de expressão regular voltar atrás para sempre, e o teste trava em vez de
     falhar — o que é a pior das duas coisas */
  const buracos = modelos.match(/buracos: \[[\s\S]{0,400}?\]\.map/);
  assert.ok(buracos, "sumiu a lista de buracos da bicamada");
  assert.doesNotMatch(buracos[0], /S\.livre/, "abriram um buraco no posto da difusão simples");
  for (const peca of ["S.vazK", "S.volNa", "S.carr", "S.bomba"]) {
    assert.match(buracos[0], new RegExp(peca.replace(".", "\.")), `${peca} ficou sem buraco na bicamada`);
  }

  /* o transportador se distingue do canal por UMA coisa: nunca as duas
     comportas abertas ao mesmo tempo. Sem isso ele é um canal largo. */
  assert.match(modelos, /const foraAberta = c < \.45, dentroAberta = c > \.55;/);
  assert.match(modelos, /function comporta/);
  /* e a bomba é a única que gasta: o ATP existe e só aparece no ciclo dela */
  assert.match(modelos, /atp\.visible = ciclo < \.3;/);
});

test("o nível 02 é a célula em corte, e a película forra a parede", async () => {
  const modelos = await text("potencial-membrana/modelos.js");

  /* A primeira versão era uma tábua com confete: dizia a frase certa e não
     mostrava célula nenhuma. Sem parede FECHADA, "dentro" e "fora" não são
     lugares, e o erro que a página desfaz é espacial. */
  assert.match(modelos, /const CEL = \{/);
  assert.match(modelos, /function faceDoCorte/);

  /* e cada íon vai RETO para a face que tem ao lado — mantendo x e z no
     retalho plano, e a direção radial na célula. Foi isso que fez a película
     fechar em qualquer potencial parcial, e não só em 100%. */
  assert.match(modelos, /bulk: V\(bx, memY\(bx, bz\) \+ lado \* rnd\(faixa\[0\], faixa\[1\]\), bz\),\s*\n\s*filme: V\(bx, memY\(bx, bz\) \+ lado \* faceY, bz\),/);
  assert.match(modelos, /filme: p\.clone\(\)\.normalize\(\)\.multiplyScalar\(rFilme\)/);
});

test("o nível 03 está em proporção, e por isso pode levar régua", async () => {
  const modelos = await text("potencial-membrana/modelos.js");
  const html = await text("potencial-membrana/index.html");

  /* 5 nm de bicamada e 1 nm de película saem os dois de NM: se alguém mexer
     na espessura sem mexer aqui, as réguas passam a mentir — e régua que
     mente é pior que régua nenhuma. */
  assert.match(modelos, /const NM = \./);
  assert.match(modelos, /const SUP = 2\.5 \* NM;/);
  assert.match(modelos, /const FACE = SUP \+ NM \* \.5;/);
  assert.match(modelos, /function reguaY/);
  assert.match(html, /5 nm de bicamada, cerca de 1 nm de película/);
});

test("o neurônio é uma árvore, e não uma bola com hastes espetadas", async () => {
  const modelos = await text("potencial-membrana/modelos.js");

  /* Três coisas separam a célula da peça de encaixe, e as três já foram
     refeitas uma vez porque faltavam: */

  /* 1. o soma SE ESTICA para virar dendrito — sem isso a junção é uma quina,
        e quina é solda */
  assert.match(modelos, /const flareEm = n => \{/);
  assert.match(modelos, /R \* ruido \* \(1 \+ flareEm\(n\)\)/);

  /* 2. a árvore é recursiva e obedece à lei de Rall, com repartição DESIGUAL:
        dois filhos iguais é a assinatura de um gerador */
  assert.match(modelos, /Math\.pow\(f, 2 \/ 3\)/);
  assert.match(modelos, /Math\.pow\(1 - f, 2 \/ 3\)/);
  assert.match(modelos, /ramo\(fim, tan\.clone\(\)\.applyAxisAngle/);

  /* 3. e há espinhas nos ramos distais, que é onde elas existem */
  assert.match(modelos, /function espinha/);

  /* o afinamento composto já secou a árvore uma vez: o piso do raio é o que
     impede que quatro ordens levem a ponta a virar fio de cabelo */
  assert.match(modelos, /Math\.max\(\.013, raio \*/);
});
