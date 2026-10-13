import test from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs';
const ler = f => fs.readFileSync(new URL('../potencial-membrana/' + f, import.meta.url));
const html = ler('index.html').toString(), app = ler('app.js').toString();

test('neurônio: quatro abas, preservando Comunicação e Interior', () => {
  const abas = [...html.matchAll(/data-step="(\d)" type="button"><b>(\d\d)<\/b><span>([^<]+)<\/span>/g)].map(m => [+m[1], m[2], m[3]]);
  assert.deepEqual(abas, [[0, '01', 'Neurônio'], [1, '02', 'Comunicação'], [2, '03', 'Interior'], [5, '04', 'A onda']]);
  assert.match(app, /const NEU = 0, COM = 1, INT = 2, PEL = 3, TRA = 4, ONDA = 5, ULTIMO = ONDA;/);
  assert.match(app, /const modelos = \[base\.modelos\[0\], comunicacao, \.\.\.base\.modelos\.slice\(1\)\];/);
  assert.match(app, /const TAM_REAL = \[\.62, \.80, \.56, \.52, \.60, 1\.05\];/);
  assert.match(app, /NIVEIS.includes\(pedido - 1\)/);
});

test('película de carga: Comunicação usa o GLB local com a animação do sinal', () => {
  const b = ler('impulso-nervoso.glb');
  assert.equal(b.toString('ascii', 0, 4), 'glTF');
  const json = JSON.parse(b.toString('utf8', 20, 20 + b.readUInt32LE(12)));
  assert(json.animations.some(a => a.name === 'impulso'));
  assert(json.nodes.some(n => n.name === 'sinal') && json.nodes.some(n => n.name === 'sinapse_1'));
  assert.match(app, /new URL\('impulso-nervoso\.glb', import\.meta\.url\)/);
  assert.match(html, /id="comunicacaoBox" class="caixa" hidden/);
  assert.match(html, /o sinal elétrico não atravessa|não atravessa como corrente/);
});
