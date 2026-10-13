import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const app = fs.readFileSync(new URL('../musculo-sarcomero/app.js', import.meta.url), 'utf8');

test('miofibrila: o controle de comprimento aparece nos níveis 04 e 05 e usa a função aprovada', () => {
  assert.match(app, /E\.contrBox\.hidden = n < 3;/);
  assert.match(app, /mioPartes\.sarcs\.forEach\(\(s, i\) => \{ aplicarComprimento\(s, L\);/);
  assert.match(app, /E\.contr\.addEventListener\('input', aplicarMiofibrila\);/);
  assert.match(app, /s\.scale\.set\(1, s\.scale\.y, s\.scale\.z\)/);       // discos Z internos sobre os anéis
});

test('miofibrila: a capa encurta como o sarcômero — banda A fixa, banda I e zona H encolhem', () => {
  const fn = app.match(/function posicaoNoComprimento\(xr, L\) \{[\s\S]*?\n\}/)[0];
  const ctx = { SARC: { len: 2.4 }, SCM: { A: 1.6, actina: 1.0 }, N_SARC_MIO: 3, Math };
  vm.runInNewContext(fn, ctx);
  const f = ctx.posicaoNoComprimento;
  for (const L of [1.9, 2.0, 2.4, 3.0, 3.4]) {
    for (const i of [-1, 0, 1]) {
      const c = i * 2.4, cL = i * L;
      assert(Math.abs(f(c, L) - cL) < 1e-9, 'linha M');
      assert(Math.abs(f(c + .8, L) - (cL + .8)) < 1e-9, 'borda da banda A');          // banda A = 1,6 em qualquer L
      assert(Math.abs(f(c - .8, L) - (cL - .8)) < 1e-9);
      assert(Math.abs(f(c + .2, L) - (cL + Math.max(0, L / 2 - 1))) < 1e-9, 'zona H');
    }
    assert(Math.abs(f(1.2, L) - L / 2) < 1e-9 && Math.abs(f(3.6, L) - 1.5 * L) < 1e-9, 'discos Z');
    let ant = -Infinity;                                                             // nunca dobra
    for (let x = -3.6; x <= 3.6; x += .005) { const y = f(x, L); assert(y >= ant - 1e-9); ant = y; }
  }
});

test('músculo: miofibrila e sarcômero vão à RA na escala do repouso', () => {
  assert.match(app, /const LADO_REPOUSO = \{ 3: maiorLado\(modelos\[3\]\), 4: maiorLado\(modelos\[4\]\) \};/);
  assert.match(app, /TAM_REAL\[atual\] \/ \(LADO_REPOUSO\[atual\] \|\| lado\)/);
});

test('músculo: RA com botões no iPhone — botão único, só no nível 05, poses da função aprovada', () => {
  const html = fs.readFileSync(new URL('../musculo-sarcomero/index.html', import.meta.url), 'utf8');
  const mod = fs.readFileSync(new URL('../ra-botoes-ios.js', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /id="raBotoes"/);                                       // o botão de teste saiu
  assert.match(html, /<button id="launchAR"/);                                      // o botão atual continua
  assert.match(app, /const usaBotoes = \(\) => atual === 4 && !botoesFalhou && \(ehQuickLook/);
  assert.match(app, /botoesFalhou = true;/);                                        // sem as placas, o botão volta à peça comum
  assert.match(html, /app\.js\?v=muscular-mito-20261009/);
  assert.match(app, /if \(usaBotoes\(\) && botoesProntos && ancoraAR\.href\) \{ ancoraAR\.click\(\); return; \}/);
  assert.match(app, /const ESTADOS_BOTOES = \[\{ rotulo: 'Relaxar', L: 2\.4 \}, \{ rotulo: 'Contrair', L: 1\.9 \}\];/);
  assert.match(app, /aplicarComprimento\(sarc, e\.L\)/);
  assert.match(mod, /token info:id = "TapGesture"/);
  assert.match(mod, /token info:id = "Transform"/);
  assert.match(mod, /token type = "absolute"/);
});

test('ra-botoes-ios: alvos no topo da cena, com a pose já multiplicada pelos pais (peças não se separam)', () => {
  const mod = fs.readFileSync(new URL('../ra-botoes-ios.js', import.meta.url), 'utf8');
  assert.match(mod, /multiplyMatrices\(m\.parent\.matrixWorld, pose\)/);
  assert.match(mod, /raiz\.add\(alvo\)/);
  assert.doesNotMatch(mod, /m\.parent\.add\(alvo\)/);                              // o alvo ao lado da parte separava as peças
});

test('ra-botoes-ios: o zip é refeito com os dados de cada arquivo alinhados a 64 bytes', async () => {
  const src = fs.readFileSync(new URL('../ra-botoes-ios.js', import.meta.url), 'utf8');
  const fn = src.match(/export function alinhamento\(zip\) \{[\s\S]*?\n\}/)[0].replace('export ', '');
  const ctx = { DataView, TextDecoder, Uint8Array }; vm.runInNewContext(fn + '\nthis.alinhamento = alinhamento;', ctx);
  // zip mínimo feito à mão: um arquivo "a" com 3 bytes, dados em 30 + 1 + 33 = 64
  const z = new Uint8Array(64 + 3); const v = new DataView(z.buffer);
  v.setUint32(0, 0x04034b50, true); v.setUint32(18, 3, true); v.setUint16(26, 1, true); v.setUint16(28, 33, true); z[30] = 97;
  const r = ctx.alinhamento(z);
  assert.equal(r.length, 1); assert.equal(r[0].nome, 'a'); assert.equal(r[0].dados, 64); assert.equal(r[0].ok, true);
});

test('ra-botoes-ios: percursos em série, geometria com 4 casas e geometrias repetidas unidas', () => {
  const mod = fs.readFileSync(new URL('../ra-botoes-ios.js', import.meta.url), 'utf8');
  assert.match(mod, /token type = "serial"/);
  assert.match(mod, /Math\.max\(\.01, ps\.duracao\)/);                                // duração zero trava o Quick Look
  assert.match(mod, /replace\(\/\(\\d\\\.\\d\{4\}\)\\d\+\/g, '\$1'\)/);
  assert.match(mod, /if \(porConteudo\.has\(chave\)\)/);
});

test('placas no iPhone: Osso vivo (Montar/Desmontar) e Comunicação (Disparar) usam o botão único', () => {
  const osso = fs.readFileSync(new URL('../osso-vivo/app.js', import.meta.url), 'utf8');
  const mem = fs.readFileSync(new URL('../potencial-membrana/app.js', import.meta.url), 'utf8');
  assert.match(osso, /estados:\[\{rotulo:'Montar',poses:poses\[0\]\},\{rotulo:'Desmontar',poses:poses\[1\]\}\]/);
  assert.match(osso, /const usaPlacas=\(\)=>nivel===0&&!placasFalharam&&/);
  assert.match(osso, /if\(usaPlacas\(\)&&placasProntas&&ancoraAR\.href\)\{ancoraAR\.click\(\);return;\}/);
  assert.match(mem, /estados: \[\{ rotulo: 'Disparar', passos \}\]/);
  assert.match(mem, /const usaPlacaCom = \(\) => atual === COM && !placaComFalhou/);
  assert.match(mem, /if \(usaPlacaCom\(\) && placaComPronta && ancoraCom\.href\) \{ ancoraCom\.click\(\); return; \}/);
});
